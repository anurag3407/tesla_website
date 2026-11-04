import { describe, it, expect, vi, beforeEach } from 'vitest';

const { galleryModel, authMock } = vi.hoisted(() => {
  const galleryModel: any = vi.fn();
  galleryModel.find = vi.fn();
  galleryModel.create = vi.fn();
  galleryModel.findByIdAndUpdate = vi.fn();
  galleryModel.findByIdAndDelete = vi.fn();

  const authMock = {
    requireAuth: vi.fn(),
    requireRole: vi.fn(),
  };

  return { galleryModel, authMock };
});

vi.mock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/models/Gallery', () => ({ Gallery: galleryModel }));
vi.mock('@/lib/auth', () => ({
  requireAuth: authMock.requireAuth,
  requireRole: authMock.requireRole,
}));

import { GET, POST, PUT, DELETE } from './route';

const VALID_ID = '507f1f77bcf86cd799439011';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('GET /api/admin/gallery', () => {
  it('returns 401 when requireAuth fails', async () => {
    authMock.requireAuth.mockResolvedValue({
      response: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }),
    });

    const req = new Request('http://localhost/api/admin/gallery');
    const res = await GET(req as any);

    expect(res.status).toBe(401);
  });

  it('retrieves media and aggregates album chartData and stats', async () => {
    authMock.requireAuth.mockResolvedValue({ response: null });

    const mockItems = [
      {
        _id: { toString: () => VALID_ID },
        title: 'Robotics Workshop',
        imageUrl: 'https://example.com/photo.jpg',
        album: 'Workshops 2024',
        mediaType: 'Photo',
        views: 45,
      },
      {
        _id: { toString: () => '507f1f77bcf86cd799439022' },
        title: 'Tech Fest Recap',
        imageUrl: 'https://example.com/video-thumb.jpg',
        mediaUrl: 'https://example.com/video.mp4',
        album: 'Tech Fest',
        mediaType: 'Video',
        views: 120,
      },
    ];

    galleryModel.find
      .mockReturnValueOnce({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(mockItems),
        }),
      })
      .mockReturnValueOnce({
        lean: vi.fn().mockResolvedValue(mockItems),
      });

    const req = new Request('http://localhost/api/admin/gallery');
    const res = await GET(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.media).toHaveLength(2);
    expect(data.stats.total).toBe(2);
    expect(data.stats.photos).toBe(1);
    expect(data.stats.videos).toBe(1);
    expect(data.stats.views).toBe(165);
    expect(data.chartData).toEqual(
      expect.arrayContaining([
        { name: 'Workshops 2024', Photos: 1, Videos: 0 },
        { name: 'Tech Fest', Photos: 0, Videos: 1 },
      ])
    );
  });
});

describe('POST /api/admin/gallery', () => {
  it('returns 400 when title, imageUrl, or album is missing', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });

    const req = new Request('http://localhost/api/admin/gallery', {
      method: 'POST',
      body: JSON.stringify({ title: 'Just Title' }),
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/Missing required configuration payloads/i);
  });

  it('creates gallery asset with default views', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });
    galleryModel.create.mockResolvedValue({
      _id: VALID_ID,
      title: 'Orientation Day',
      imageUrl: 'https://example.com/orientation.jpg',
      album: 'Orientation 2024',
      views: 0,
    });

    const req = new Request('http://localhost/api/admin/gallery', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Orientation Day',
        imageUrl: 'https://example.com/orientation.jpg',
        album: 'Orientation 2024',
        caption: 'Welcoming the freshers',
        mediaType: 'Photo',
        uploadSource: 'Direct',
      }),
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(galleryModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Orientation Day',
        imageUrl: 'https://example.com/orientation.jpg',
        album: 'Orientation 2024',
        views: 0,
      })
    );
  });
});

describe('PUT /api/admin/gallery', () => {
  it('returns 400 when id is missing or invalid', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });

    const req = new Request('http://localhost/api/admin/gallery', {
      method: 'PUT',
      body: JSON.stringify({ id: 'bad-id', title: 'Updated' }),
    });

    const res = await PUT(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Valid gallery ID required');
  });

  it('updates gallery item properties when valid id provided', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });

    const updatedItem = {
      _id: VALID_ID,
      title: 'Updated Title',
      album: 'Updated Album',
      caption: 'Updated Caption',
    };
    galleryModel.findByIdAndUpdate.mockResolvedValue(updatedItem);

    const req = new Request('http://localhost/api/admin/gallery', {
      method: 'PUT',
      body: JSON.stringify({
        id: VALID_ID,
        title: 'Updated Title',
        album: 'Updated Album',
        caption: 'Updated Caption',
      }),
    });

    const res = await PUT(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(galleryModel.findByIdAndUpdate).toHaveBeenCalledWith(
      VALID_ID,
      {
        $set: {
          title: 'Updated Title',
          album: 'Updated Album',
          caption: 'Updated Caption',
        },
      },
      { new: true }
    );
  });

  it('returns 404 when item to update is not found', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });
    galleryModel.findByIdAndUpdate.mockResolvedValue(null);

    const req = new Request('http://localhost/api/admin/gallery', {
      method: 'PUT',
      body: JSON.stringify({ id: VALID_ID, title: 'Nonexistent' }),
    });

    const res = await PUT(req as any);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('Media item not found');
  });
});

describe('DELETE /api/admin/gallery', () => {
  it('returns 400 when id is invalid or missing in query', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });

    const req = new Request('http://localhost/api/admin/gallery?id=bad-id');
    const res = await DELETE(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('ID required');
  });

  it('deletes gallery item when valid id is provided', async () => {
    authMock.requireRole.mockResolvedValue({ response: null });
    galleryModel.findByIdAndDelete.mockResolvedValue({ _id: VALID_ID });

    const req = new Request(`http://localhost/api/admin/gallery?id=${VALID_ID}`);
    const res = await DELETE(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(galleryModel.findByIdAndDelete).toHaveBeenCalledWith(VALID_ID);
  });
});
