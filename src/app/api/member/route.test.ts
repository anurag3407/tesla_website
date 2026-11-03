import { describe, it, expect, vi, beforeEach } from 'vitest';

const { resourceModel, galleryModel, userModel, authMock } = vi.hoisted(() => {
  const resourceModel: any = vi.fn();
  resourceModel.findOne = vi.fn();
  resourceModel.create = vi.fn();
  resourceModel.findOneAndUpdate = vi.fn();

  const galleryModel: any = vi.fn();
  galleryModel.findById = vi.fn();
  galleryModel.findByIdAndDelete = vi.fn();

  const userModel: any = vi.fn();
  userModel.findById = vi.fn();

  const authMock = {
    getAuthPayload: vi.fn(),
  };

  return { resourceModel, galleryModel, userModel, authMock };
});

vi.mock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/models/Resource', () => ({ Resource: resourceModel }));
vi.mock('@/models/Gallery', () => ({ Gallery: galleryModel }));
vi.mock('@/models/User', () => ({ User: userModel }));
vi.mock('@/lib/auth', () => ({ getAuthPayload: authMock.getAuthPayload }));

import { POST, DELETE } from './route';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('/api/member route', () => {
  it('POST returns 400 when subjectName is missing', async () => {
    authMock.getAuthPayload.mockResolvedValue({ userId: 'u123', role: 'TeamMember' });
    const req = new Request('http://localhost/api/member', {
      method: 'POST',
      body: JSON.stringify({ action: 'resource', department: 'CSE', semester: 5 }),
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/subjectName is required/);
  });

  it('POST escapes regex metacharacters in subjectName', async () => {
    authMock.getAuthPayload.mockResolvedValue({ userId: 'u123', role: 'TeamMember' });
    resourceModel.findOne.mockResolvedValue(null);
    resourceModel.create.mockResolvedValue({ _id: 'r1' });

    const req = new Request('http://localhost/api/member', {
      method: 'POST',
      body: JSON.stringify({
        action: 'resource',
        department: 'CSE',
        semester: 5,
        subjectName: 'C++ (Object Oriented)',
        fileTitle: 'Unit 1 Notes',
        fileUrl: 'https://example.com/notes.pdf',
        fileType: 'Notes',
      }),
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(resourceModel.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        subjectName: { $regex: /^C\+\+ \(Object Oriented\)$/i },
      })
    );
  });

  const VALID_GALLERY_ID = '507f1f77bcf86cd799439099';

  it('DELETE returns 400 when id is missing or not a valid ObjectId', async () => {
    authMock.getAuthPayload.mockResolvedValue({ userId: 'u123', role: 'TeamMember' });
    const req = new Request('http://localhost/api/member?target=gallery&id=bad-id', {
      method: 'DELETE',
    });
    const res = await DELETE(req as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toMatch(/Target id is required/);
  });

  it('DELETE gallery returns 403 when user is not a manager', async () => {
    authMock.getAuthPayload.mockResolvedValue({ userId: 'u123', role: 'TeamMember' });
    userModel.findById.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({ role: 'TeamMember', status: 'active' }),
      }),
    });

    const req = new Request(`http://localhost/api/member?target=gallery&id=${VALID_GALLERY_ID}`, {
      method: 'DELETE',
    });

    const res = await DELETE(req as any);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toMatch(/Access Denied/);
    expect(galleryModel.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('DELETE gallery succeeds when user is an OfficeBearer', async () => {
    authMock.getAuthPayload.mockResolvedValue({ userId: 'ob1', role: 'OfficeBearer' });
    userModel.findById.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({ role: 'OfficeBearer', status: 'active' }),
      }),
    });
    galleryModel.findById.mockResolvedValue({ _id: VALID_GALLERY_ID });
    galleryModel.findByIdAndDelete.mockResolvedValue({ _id: VALID_GALLERY_ID });

    const req = new Request(`http://localhost/api/member?target=gallery&id=${VALID_GALLERY_ID}`, {
      method: 'DELETE',
    });

    const res = await DELETE(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(galleryModel.findByIdAndDelete).toHaveBeenCalledWith(VALID_GALLERY_ID);
  });
});
