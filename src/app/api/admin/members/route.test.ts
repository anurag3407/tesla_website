import { describe, it, expect, vi, beforeEach } from 'vitest';

const { userModel, authMock } = vi.hoisted(() => {
  const userModel: any = vi.fn();
  userModel.findById = vi.fn();
  userModel.countDocuments = vi.fn();
  userModel.findByIdAndDelete = vi.fn();
  const authMock = {
    getAuthPayload: vi.fn(),
  };
  return { userModel, authMock };
});

vi.mock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/models/User', () => ({ User: userModel }));
vi.mock('@/lib/auth', () => ({ getAuthPayload: authMock.getAuthPayload }));

import { PATCH, DELETE } from './route';

const ADMIN_ID = '507f1f77bcf86cd799439011';
const OTHER_ADMIN_ID = '507f1f77bcf86cd799439022';
const MEMBER_ID = '507f1f77bcf86cd799439033';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('/api/admin/members edge cases', () => {
  describe('PATCH', () => {
    it('returns 404 for invalid ObjectId', async () => {
      authMock.getAuthPayload.mockResolvedValue({ userId: ADMIN_ID, role: 'Admin' });
      userModel.findById.mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue({ role: 'Admin' }),
        }),
      });

      const req = new Request('http://localhost/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'bad-id', action: 'toggleStatus' }),
      });

      const res = await PATCH(req);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.message).toMatch(/member not found/i);
    });

    it('prevents demoting the last active Administrator', async () => {
      authMock.getAuthPayload.mockResolvedValue({ userId: ADMIN_ID, role: 'Admin' });
      userModel.findById
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue({ role: 'Admin' }),
          }),
        })
        .mockResolvedValueOnce({
          _id: OTHER_ADMIN_ID,
          name: 'Target Admin',
          role: 'Admin',
          status: 'active',
          save: vi.fn(),
        });
      // Only 1 active Admin left in the database
      userModel.countDocuments.mockResolvedValue(1);

      const req = new Request('http://localhost/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: OTHER_ADMIN_ID, action: 'updateRole', role: 'TeamMember' }),
      });

      const res = await PATCH(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.message).toMatch(/cannot demote the last active administrator/i);
    });

    it('prevents deactivating the last active Administrator', async () => {
      authMock.getAuthPayload.mockResolvedValue({ userId: ADMIN_ID, role: 'Admin' });
      userModel.findById
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue({ role: 'Admin' }),
          }),
        })
        .mockResolvedValueOnce({
          _id: OTHER_ADMIN_ID,
          name: 'Target Admin',
          role: 'Admin',
          status: 'active',
          save: vi.fn(),
        });
      // Only 1 active Admin left
      userModel.countDocuments.mockResolvedValue(1);

      const req = new Request('http://localhost/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: OTHER_ADMIN_ID, action: 'toggleStatus' }),
      });

      const res = await PATCH(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.message).toMatch(/cannot deactivate the last active administrator/i);
    });
  });

  describe('DELETE', () => {
    it('prevents deleting the last active Administrator', async () => {
      authMock.getAuthPayload.mockResolvedValue({ userId: ADMIN_ID, role: 'Admin' });
      userModel.findById
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue({ role: 'Admin' }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockResolvedValue({
            _id: OTHER_ADMIN_ID,
            role: 'Admin',
          }),
        });
      userModel.countDocuments.mockResolvedValue(1);

      const req = new Request(`http://localhost/api/admin/members?id=${OTHER_ADMIN_ID}`, {
        method: 'DELETE',
      });

      const res = await DELETE(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.message).toMatch(/cannot delete the last active administrator/i);
      expect(userModel.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('allows deleting a TeamMember by Admin', async () => {
      authMock.getAuthPayload.mockResolvedValue({ userId: ADMIN_ID, role: 'Admin' });
      userModel.findById
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue({ role: 'Admin' }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockResolvedValue({
            _id: MEMBER_ID,
            role: 'TeamMember',
          }),
        });
      userModel.findByIdAndDelete.mockResolvedValue({});

      const req = new Request(`http://localhost/api/admin/members?id=${MEMBER_ID}`, {
        method: 'DELETE',
      });

      const res = await DELETE(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toMatch(/member removed/i);
      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(MEMBER_ID);
    });
  });
});
