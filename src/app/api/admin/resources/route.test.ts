import { describe, it, expect, vi, beforeEach } from 'vitest';

const { resourceModel, authMock } = vi.hoisted(() => {
  const resourceModel: any = vi.fn();
  resourceModel.find = vi.fn();
  resourceModel.findOne = vi.fn();
  resourceModel.create = vi.fn();
  resourceModel.findOneAndUpdate = vi.fn();
  resourceModel.findByIdAndUpdate = vi.fn();
  resourceModel.findByIdAndDelete = vi.fn();

  const authMock = {
    requireAuth: vi.fn(),
    requireRole: vi.fn(),
  };

  return { resourceModel, authMock };
});

vi.mock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/models/Resource', () => ({ Resource: resourceModel }));
vi.mock('@/lib/auth', () => ({
  requireAuth: authMock.requireAuth,
  requireRole: authMock.requireRole,
}));

import { GET, POST, PATCH, PUT, DELETE } from './route';

const VALID_ID = '507f1f77bcf86cd799439011';
const VALID_FILE_ID = '507f1f77bcf86cd799439022';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('GET /api/admin/resources', () => {
  it('returns 401 when requireAuth fails', async () => {
    authMock.requireAuth.mockResolvedValue({
      response: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }),
    });

    const req = new Request('http://localhost/api/admin/resources');
    const res = await GET(req as any);

    expect(res.status).toBe(401);
  });

  it('fetches resources and aggregates chartData and live traffic', async () => {
    authMock.requireAuth.mockResolvedValue({ response: null });

    const mockResources = [
      {
        _id: VALID_ID,
        department: 'CSE',
        semester: 5,
        subjectName: 'DBMS',
        files: [
          { _id: VALID_FILE_ID, title: 'DBMS Notes', type: 'Note', views: 10, downloads: 5 },
          { _id: 'f2', title: 'DBMS PYQ 2024', type: 'PYQ', views: 20, downloads: 15 },
        ],
      },
    ];

    resourceModel.find
      .mockReturnValueOnce({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(mockResources),
        }),
      })
      .mockReturnValueOnce({
        lean: vi.fn().mockResolvedValue(mockResources),
      });

    const req = new Request('http://localhost/api/admin/resources?department=CSE&semester=5');
    const res = await GET(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.resources).toHaveLength(1);
    expect(data.traffic.views).toBe(30);
    expect(data.traffic.downloads).toBe(20);
    expect(data.chartData[0]).toEqual({
      name: 'CSE',
      Notes: 1,
      PYQs: 1,
      Total: 2,
    });
  });
});

describe('POST /api/admin/resources', () => {
  it('returns 400 when required fields are missing', async () => {
    authMock.requireRole.mockResolvedValue({
      payload: { userId: 'u1', role: 'Admin' },
      response: null,
    });

    const req = new Request('http://localhost/api/admin/resources', {
      method: 'POST',
      body: JSON.stringify({ department: 'CSE' }),
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Missing required parameters');
  });

  it('adds file to existing resource if subject already exists', async () => {
    authMock.requireRole.mockResolvedValue({
      payload: { userId: 'u1', role: 'Admin' },
      response: null,
    });

    const mockResource = {
      files: [] as any[],
      save: vi.fn().mockResolvedValue(true),
    };
    resourceModel.findOne.mockResolvedValue(mockResource);

    const req = new Request('http://localhost/api/admin/resources', {
      method: 'POST',
      body: JSON.stringify({
        department: 'CSE',
        semester: 3,
        subjectName: 'Data Structures',
        fileTitle: 'Trees Notes',
        fileUrl: 'https://example.com/trees.pdf',
        fileType: 'Note',
      }),
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(mockResource.files).toHaveLength(1);
    expect(mockResource.files[0].title).toBe('Trees Notes');
    expect(mockResource.save).toHaveBeenCalled();
  });

  it('creates new subject resource when it does not exist', async () => {
    authMock.requireRole.mockResolvedValue({
      payload: { userId: 'u1', role: 'Admin' },
      response: null,
    });

    resourceModel.findOne.mockResolvedValue(null);
    resourceModel.create.mockResolvedValue({ _id: VALID_ID });

    const req = new Request('http://localhost/api/admin/resources', {
      method: 'POST',
      body: JSON.stringify({
        department: 'ECE',
        semester: 4,
        subjectName: 'Signals & Systems',
        subjectCode: 'EC401',
        fileTitle: 'Fourier Transform',
        fileUrl: 'https://example.com/signals.pdf',
        fileType: 'Note',
      }),
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(resourceModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        department: 'ECE',
        semester: 4,
        subjectName: 'Signals & Systems',
        subjectCode: 'EC401',
      })
    );
  });
});

describe('PATCH /api/admin/resources', () => {
  it('returns 400 for invalid actionType or fileId', async () => {
    authMock.requireAuth.mockResolvedValue({ response: null });

    const req = new Request('http://localhost/api/admin/resources', {
      method: 'PATCH',
      body: JSON.stringify({ fileId: 'not-valid', actionType: 'invalid' }),
    });

    const res = await PATCH(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid operation parameters');
  });

  it('increments views for a valid file', async () => {
    authMock.requireAuth.mockResolvedValue({ response: null });
    resourceModel.findOneAndUpdate.mockResolvedValue({ _id: VALID_ID });

    const req = new Request('http://localhost/api/admin/resources', {
      method: 'PATCH',
      body: JSON.stringify({ fileId: VALID_FILE_ID, actionType: 'views' }),
    });

    const res = await PATCH(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(resourceModel.findOneAndUpdate).toHaveBeenCalledWith(
      { 'files._id': VALID_FILE_ID },
      { $inc: { 'files.$.views': 1 } },
      { new: true }
    );
  });
});

describe('PUT /api/admin/resources', () => {
  it('returns 400 if neither id nor fileId is provided', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });

    const req = new Request('http://localhost/api/admin/resources', {
      method: 'PUT',
      body: JSON.stringify({ subjectName: 'New Subject' }),
    });

    const res = await PUT(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/Resource id or fileId required/i);
  });

  it('updates specific file details when fileId is provided', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });

    const fileSubdoc = {
      title: 'Old Title',
      fileUrl: 'https://old.url',
      type: 'Note',
    };
    const mockResource = {
      files: {
        id: vi.fn().mockReturnValue(fileSubdoc),
      },
      save: vi.fn().mockResolvedValue(true),
    };
    resourceModel.findOne.mockResolvedValue(mockResource);

    const req = new Request('http://localhost/api/admin/resources', {
      method: 'PUT',
      body: JSON.stringify({
        fileId: VALID_FILE_ID,
        fileTitle: 'Updated File Title',
        fileUrl: 'https://updated.url',
        fileType: 'PYQ',
      }),
    });

    const res = await PUT(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(fileSubdoc.title).toBe('Updated File Title');
    expect(fileSubdoc.fileUrl).toBe('https://updated.url');
    expect(fileSubdoc.type).toBe('PYQ');
    expect(mockResource.save).toHaveBeenCalled();
  });

  it('updates subject metadata when id is provided', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });

    resourceModel.findByIdAndUpdate.mockResolvedValue({
      _id: VALID_ID,
      subjectName: 'Advanced Computer Networks',
      subjectCode: 'CS502',
    });

    const req = new Request('http://localhost/api/admin/resources', {
      method: 'PUT',
      body: JSON.stringify({
        id: VALID_ID,
        subjectName: 'Advanced Computer Networks',
        subjectCode: 'CS502',
        semester: 6,
      }),
    });

    const res = await PUT(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(resourceModel.findByIdAndUpdate).toHaveBeenCalledWith(
      VALID_ID,
      {
        $set: {
          subjectName: 'Advanced Computer Networks',
          subjectCode: 'CS502',
          semester: 6,
        },
      },
      { new: true }
    );
  });
});

describe('DELETE /api/admin/resources', () => {
  it('returns 400 if neither id nor fileId is provided', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });

    const req = new Request('http://localhost/api/admin/resources');
    const res = await DELETE(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/Target id or fileId required/i);
  });

  it('deletes a specific file when fileId is passed in query', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });
    resourceModel.findOneAndUpdate.mockResolvedValue({ _id: VALID_ID });

    const req = new Request(`http://localhost/api/admin/resources?fileId=${VALID_FILE_ID}`);
    const res = await DELETE(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(resourceModel.findOneAndUpdate).toHaveBeenCalledWith(
      { 'files._id': VALID_FILE_ID },
      { $pull: { files: { _id: VALID_FILE_ID } } },
      { new: true }
    );
  });

  it('deletes an entire subject resource when id is passed in query', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });
    resourceModel.findByIdAndDelete.mockResolvedValue({ _id: VALID_ID });

    const req = new Request(`http://localhost/api/admin/resources?id=${VALID_ID}`);
    const res = await DELETE(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(resourceModel.findByIdAndDelete).toHaveBeenCalledWith(VALID_ID);
  });
});
