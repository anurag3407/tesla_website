import { describe, it, expect, vi, beforeEach } from 'vitest';

const { userModel, authMock } = vi.hoisted(() => {
  const userModel: any = vi.fn();
  userModel.findById = vi.fn();
  userModel.findByIdAndUpdate = vi.fn();
  const authMock = {
    requireAuth: vi.fn(),
  };
  return { userModel, authMock };
});

vi.mock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/models/User', () => ({ User: userModel }));
vi.mock('@/lib/auth', () => ({ requireAuth: authMock.requireAuth }));

import { PUT } from './route';

const MEMBER_ID = '507f1f77bcf86cd799439011';
const OTHER_MEMBER_ID = '507f1f77bcf86cd799439022';
const ADMIN_ID = '507f1f77bcf86cd799439033';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('PUT /api/user/update-profile', () => {
  it('returns 401 when requireAuth fails', async () => {
    const unauthResponse = new Response(JSON.stringify({ success: false }), { status: 401 });
    authMock.requireAuth.mockResolvedValue({ payload: null, response: unauthResponse });

    const req = new Request('http://localhost/api/user/update-profile', {
      method: 'PUT',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const res = await PUT(req);

    expect(res.status).toBe(401);
  });

  it('updates profile for standard member and ignores targetUserId parameter', async () => {
    authMock.requireAuth.mockResolvedValue({
      payload: { userId: MEMBER_ID, role: 'TeamMember' },
      response: null,
    });

    userModel.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue({ socialLinks: { github: 'https://github.com/member' } }),
    });

    const updatedUserMock = {
      _id: MEMBER_ID,
      name: 'Member Updated',
      bio: 'New Bio',
    };
    userModel.findByIdAndUpdate.mockReturnValue({
      select: vi.fn().mockResolvedValue(updatedUserMock),
    });

    const req = new Request('http://localhost/api/user/update-profile', {
      method: 'PUT',
      body: JSON.stringify({
        targetUserId: OTHER_MEMBER_ID, // Standard member attempts to hijack another profile
        name: 'Member Updated',
        bio: 'New Bio',
        skills: 'React, Node.js',
        team: 'Hacked Team', // Should be ignored because not privileged
      }),
    });

    const res = await PUT(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    // Verified that it updated MEMBER_ID, NOT OTHER_MEMBER_ID
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      MEMBER_ID,
      expect.objectContaining({
        $set: expect.objectContaining({
          name: 'Member Updated',
          bio: 'New Bio',
          skills: ['React', 'Node.js'],
        }),
      }),
      expect.anything()
    );
    // Verified team was NOT included in updateDoc for non-privileged user
    const updateArg = userModel.findByIdAndUpdate.mock.calls[0][1].$set;
    expect(updateArg.team).toBeUndefined();
  });

  it('allows Admin to update any member profile using targetUserId', async () => {
    authMock.requireAuth.mockResolvedValue({
      payload: { userId: ADMIN_ID, role: 'Admin' },
      response: null,
    });

    userModel.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue({ socialLinks: {} }),
    });

    const updatedUserMock = {
      _id: OTHER_MEMBER_ID,
      name: 'Promoted Member',
      team: 'Robotics',
      designation: 'Hardware Lead',
      status: 'active',
      isPublic: true,
    };
    userModel.findByIdAndUpdate.mockReturnValue({
      select: vi.fn().mockResolvedValue(updatedUserMock),
    });

    const req = new Request('http://localhost/api/user/update-profile', {
      method: 'PUT',
      body: JSON.stringify({
        targetUserId: OTHER_MEMBER_ID,
        name: 'Promoted Member',
        team: 'Robotics',
        designation: 'Hardware Lead',
        status: 'active',
        isPublic: true,
      }),
    });

    const res = await PUT(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    // Verified that it targeted OTHER_MEMBER_ID with privileged overrides
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      OTHER_MEMBER_ID,
      expect.objectContaining({
        $set: expect.objectContaining({
          name: 'Promoted Member',
          team: 'Robotics',
          designation: 'Hardware Lead',
          status: 'active',
          isPublic: true,
        }),
      }),
      expect.anything()
    );
  });

  it('returns 400 if targetUserId is invalid', async () => {
    authMock.requireAuth.mockResolvedValue({
      payload: { userId: ADMIN_ID, role: 'Admin' },
      response: null,
    });

    const req = new Request('http://localhost/api/user/update-profile', {
      method: 'PUT',
      body: JSON.stringify({ targetUserId: 'invalid-id' }),
    });

    const res = await PUT(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toMatch(/Invalid target user ID/i);
  });

  it('returns 404 when target user does not exist in database', async () => {
    authMock.requireAuth.mockResolvedValue({
      payload: { userId: ADMIN_ID, role: 'Admin' },
      response: null,
    });

    userModel.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    });

    const req = new Request('http://localhost/api/user/update-profile', {
      method: 'PUT',
      body: JSON.stringify({ targetUserId: OTHER_MEMBER_ID, name: 'Ghost' }),
    });

    const res = await PUT(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toMatch(/User not found/i);
  });
});
