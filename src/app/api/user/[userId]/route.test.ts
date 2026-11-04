import { describe, it, expect, vi, beforeEach } from 'vitest';

const { userModel, blogModel, eventModel, resourceModel, authMock } = vi.hoisted(() => {
  const userModel: any = vi.fn();
  userModel.findById = vi.fn();
  userModel.findByIdAndUpdate = vi.fn();
  const blogModel: any = vi.fn();
  blogModel.countDocuments = vi.fn();
  blogModel.find = vi.fn();
  const eventModel: any = vi.fn();
  eventModel.countDocuments = vi.fn();
  eventModel.find = vi.fn();
  const resourceModel: any = vi.fn();
  resourceModel.find = vi.fn();
  const authMock = {
    requireAuth: vi.fn(),
  };
  return { userModel, blogModel, eventModel, resourceModel, authMock };
});

vi.mock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/models/User', () => ({ User: userModel }));
vi.mock('@/models/Blog', () => ({ Blog: blogModel }));
vi.mock('@/models/Event', () => ({ Event: eventModel }));
vi.mock('@/models/Resource', () => ({ Resource: resourceModel }));
vi.mock('@/lib/auth', () => ({ requireAuth: authMock.requireAuth }));

import { GET, PUT } from './route';

const USER_A_ID = '507f1f77bcf86cd799439011';
const USER_B_ID = '507f1f77bcf86cd799439022';
const ADMIN_ID = '507f1f77bcf86cd799439033';

beforeEach(() => {
  vi.resetAllMocks();
  blogModel.countDocuments.mockResolvedValue(0);
  eventModel.countDocuments.mockResolvedValue(0);
  blogModel.find.mockReturnValue({
    sort: vi.fn().mockReturnValue({ limit: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue([]) }) }),
  });
  eventModel.find.mockReturnValue({
    sort: vi.fn().mockReturnValue({ limit: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue([]) }) }),
  });
  resourceModel.find.mockReturnValue({ lean: vi.fn().mockResolvedValue([]) });
});

describe('GET /api/user/[userId]', () => {
  it('returns 404 for invalid ObjectId', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: USER_A_ID, role: 'TeamMember' } });
    const req = new Request('http://localhost/api/user/bad-id');
    const res = await GET(req as any, { params: Promise.resolve({ userId: 'bad-id' }) });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toMatch(/user not found/i);
    expect(userModel.findById).not.toHaveBeenCalled();
  });

  it('strips phone, cgpa, and resume when a peer member views another member profile', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: USER_A_ID, role: 'TeamMember' } });
    userModel.findById.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: USER_B_ID,
          name: 'Bob',
          email: 'bob@tesla.club',
          phone: '+91 9999999999',
          cgpa: 9.5,
          resume: 'https://example.com/resume.pdf',
          role: 'TeamMember',
        }),
      }),
    });

    const req = new Request(`http://localhost/api/user/${USER_B_ID}`);
    const res = await GET(req as any, { params: Promise.resolve({ userId: USER_B_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.isOwn).toBe(false);
    expect(data.user.name).toBe('Bob');
    expect(data.user.phone).toBeUndefined();
    expect(data.user.cgpa).toBeUndefined();
    expect(data.user.resume).toBeUndefined();
  });

  it('preserves private fields when a user views their own profile', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: USER_A_ID, role: 'TeamMember' } });
    userModel.findById.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: USER_A_ID,
          name: 'Alice',
          email: 'alice@tesla.club',
          phone: '+91 8888888888',
          cgpa: 9.8,
          resume: 'https://example.com/alice.pdf',
          role: 'TeamMember',
        }),
      }),
    });

    const req = new Request(`http://localhost/api/user/${USER_A_ID}`);
    const res = await GET(req as any, { params: Promise.resolve({ userId: USER_A_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.isOwn).toBe(true);
    expect(data.user.phone).toBe('+91 8888888888');
    expect(data.user.cgpa).toBe(9.8);
    expect(data.user.resume).toBe('https://example.com/alice.pdf');
  });

  it('preserves private fields when an Admin views any member profile', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: ADMIN_ID, role: 'Admin' } });
    userModel.findById.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: USER_B_ID,
          name: 'Bob',
          email: 'bob@tesla.club',
          phone: '+91 9999999999',
          cgpa: 9.5,
          resume: 'https://example.com/resume.pdf',
          role: 'TeamMember',
        }),
      }),
    });

    const req = new Request(`http://localhost/api/user/${USER_B_ID}`);
    const res = await GET(req as any, { params: Promise.resolve({ userId: USER_B_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.isOwn).toBe(false);
    expect(data.user.phone).toBe('+91 9999999999');
    expect(data.user.cgpa).toBe(9.5);
    expect(data.user.resume).toBe('https://example.com/resume.pdf');
  });
});

describe('PUT /api/user/[userId]', () => {
  it('returns 401 when requireAuth fails', async () => {
    const unauthResponse = new Response(JSON.stringify({ success: false }), { status: 401 });
    authMock.requireAuth.mockResolvedValue({ payload: null, response: unauthResponse });

    const req = new Request(`http://localhost/api/user/${USER_A_ID}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ userId: USER_A_ID }) });

    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid userId ObjectId', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: USER_A_ID, role: 'TeamMember' }, response: null });

    const req = new Request('http://localhost/api/user/bad-id', {
      method: 'PUT',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ userId: 'bad-id' }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe('Invalid user ID');
  });

  it('returns 403 when a non-privileged member tries to update another user profile', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: USER_A_ID, role: 'TeamMember' }, response: null });

    const req = new Request(`http://localhost/api/user/${USER_B_ID}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Hacked Name' }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ userId: USER_B_ID }) });
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.message).toBe('Forbidden');
  });

  it('allows a member to update their own profile and ignores sensitive field changes', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: USER_A_ID, role: 'TeamMember' }, response: null });

    const updatedUserMock = {
      _id: USER_A_ID,
      name: 'Alice Updated',
      bio: 'New bio',
      role: 'TeamMember',
    };

    userModel.findByIdAndUpdate.mockReturnValue({
      select: vi.fn().mockResolvedValue(updatedUserMock),
    });

    const req = new Request(`http://localhost/api/user/${USER_A_ID}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Alice Updated',
        bio: 'New bio',
        team: 'Privileged Team', // should be ignored for non-privileged
        designation: 'Admin', // should be ignored
        status: 'inactive', // should be ignored
      }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ userId: USER_A_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.name).toBe('Alice Updated');
    // Verify findByIdAndUpdate was called without sensitive fields
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      USER_A_ID,
      {
        $set: {
          name: 'Alice Updated',
          bio: 'New bio',
        },
      },
      expect.objectContaining({ new: true })
    );
  });

  it('allows Admin to update any member profile including privileged fields', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: ADMIN_ID, role: 'Admin' }, response: null });

    const updatedUserMock = {
      _id: USER_B_ID,
      name: 'Bob Promoted',
      team: 'Web Development',
      designation: 'Tech Lead',
      status: 'active',
    };

    userModel.findByIdAndUpdate.mockReturnValue({
      select: vi.fn().mockResolvedValue(updatedUserMock),
    });

    const req = new Request(`http://localhost/api/user/${USER_B_ID}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Bob Promoted',
        team: 'Web Development',
        designation: 'Tech Lead',
        status: 'active',
      }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ userId: USER_B_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      USER_B_ID,
      {
        $set: {
          name: 'Bob Promoted',
          team: 'Web Development',
          designation: 'Tech Lead',
          status: 'active',
        },
      },
      expect.objectContaining({ new: true })
    );
  });

  it('returns 404 when target user is not found', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: ADMIN_ID, role: 'Admin' }, response: null });

    userModel.findByIdAndUpdate.mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    });

    const req = new Request(`http://localhost/api/user/${USER_B_ID}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Missing' }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ userId: USER_B_ID }) });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe('User not found');
  });
});
