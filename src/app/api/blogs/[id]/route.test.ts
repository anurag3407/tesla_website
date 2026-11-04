import { describe, it, expect, vi, beforeEach } from 'vitest';

const { blogModel, authMock } = vi.hoisted(() => {
  const blogModel: any = vi.fn();
  blogModel.findById = vi.fn();
  blogModel.findByIdAndUpdate = vi.fn();
  const authMock = {
    getAuthPayload: vi.fn(),
    requireAuth: vi.fn(),
  };
  return { blogModel, authMock };
});

vi.mock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/models/Blog', () => ({ Blog: blogModel }));
vi.mock('@/lib/auth', () => ({
  getAuthPayload: authMock.getAuthPayload,
  requireAuth: authMock.requireAuth,
}));

import { GET, PUT, DELETE } from './route';

const VALID_BLOG_ID = '507f1f77bcf86cd799439011';
const DRAFT_BLOG_ID = '507f1f77bcf86cd799439022';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('GET /api/blogs/[id]', () => {
  it('returns 404 for invalid ObjectId strings without querying database', async () => {
    const req = new Request('http://localhost/api/blogs/not-an-objectid');
    const res = await GET(req as any, { params: Promise.resolve({ id: 'not-an-objectid' }) });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toMatch(/blog not found/i);
    expect(blogModel.findById).not.toHaveBeenCalled();
  });

  it('allows unauthenticated visitors to read Published blogs', async () => {
    authMock.getAuthPayload.mockResolvedValue(null);
    blogModel.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: VALID_BLOG_ID,
        title: 'Public Tech Article',
        status: 'Published',
        views: 10,
        author: 'u1',
      }),
    });
    blogModel.findByIdAndUpdate.mockResolvedValue({});

    const req = new Request(`http://localhost/api/blogs/${VALID_BLOG_ID}`);
    const res = await GET(req as any, { params: Promise.resolve({ id: VALID_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.blog.title).toBe('Public Tech Article');
    expect(blogModel.findByIdAndUpdate).toHaveBeenCalledWith(VALID_BLOG_ID, { $inc: { views: 1 } });
  });

  it('blocks anonymous access to Draft blogs with 403', async () => {
    authMock.getAuthPayload.mockResolvedValue(null);
    blogModel.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: DRAFT_BLOG_ID,
        title: 'Draft Post',
        status: 'Draft',
        author: 'u1',
      }),
    });

    const req = new Request(`http://localhost/api/blogs/${DRAFT_BLOG_ID}`);
    const res = await GET(req as any, { params: Promise.resolve({ id: DRAFT_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.success).toBe(false);
  });

  it('allows the author to read their own Draft blog', async () => {
    authMock.getAuthPayload.mockResolvedValue({ userId: 'u1', role: 'TeamMember' });
    blogModel.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: DRAFT_BLOG_ID,
        title: 'Draft Post',
        status: 'Draft',
        author: 'u1',
      }),
    });

    const req = new Request(`http://localhost/api/blogs/${DRAFT_BLOG_ID}`);
    const res = await GET(req as any, { params: Promise.resolve({ id: DRAFT_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.blog.title).toBe('Draft Post');
    // Author reading their own draft does not increment view counter
    expect(blogModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('allows an Admin to read any member Draft blog', async () => {
    authMock.getAuthPayload.mockResolvedValue({ userId: 'admin1', role: 'Admin' });
    blogModel.findById.mockReturnValue({
      lean: vi.fn().mockResolvedValue({
        _id: DRAFT_BLOG_ID,
        title: 'Draft Post by Member',
        status: 'Draft',
        author: 'u1',
      }),
    });

    const req = new Request(`http://localhost/api/blogs/${DRAFT_BLOG_ID}`);
    const res = await GET(req as any, { params: Promise.resolve({ id: DRAFT_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.blog.title).toBe('Draft Post by Member');
  });
});

describe('PUT /api/blogs/[id]', () => {
  it('returns 401 when requireAuth fails', async () => {
    const unauthResponse = new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
    authMock.requireAuth.mockResolvedValue({ payload: null, response: unauthResponse });

    const req = new Request(`http://localhost/api/blogs/${VALID_BLOG_ID}`, {
      method: 'PUT',
      body: JSON.stringify({ title: 'New' }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ id: VALID_BLOG_ID }) });

    expect(res.status).toBe(401);
  });

  it('returns 404 for invalid ObjectId', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: 'u1', role: 'TeamMember' }, response: null });
    const req = new Request('http://localhost/api/blogs/invalid-id', {
      method: 'PUT',
      body: JSON.stringify({ title: 'New' }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ id: 'invalid-id' }) });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toMatch(/blog not found/i);
  });

  it('returns 403 when a non-manager tries to edit another user blog', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: 'u2', role: 'TeamMember' }, response: null });
    blogModel.findById.mockResolvedValue({
      _id: VALID_BLOG_ID,
      author: 'u1',
      status: 'Draft',
    });

    const req = new Request(`http://localhost/api/blogs/${VALID_BLOG_ID}`, {
      method: 'PUT',
      body: JSON.stringify({ title: 'Hacked', content: 'text', category: 'Tech' }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ id: VALID_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toBe('Forbidden');
  });

  it('returns 400 when a non-manager edits a blog that is not Draft or Rejected', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: 'u1', role: 'TeamMember' }, response: null });
    blogModel.findById.mockResolvedValue({
      _id: VALID_BLOG_ID,
      author: 'u1',
      status: 'Published',
    });

    const req = new Request(`http://localhost/api/blogs/${VALID_BLOG_ID}`, {
      method: 'PUT',
      body: JSON.stringify({ title: 'Edited', content: 'text', category: 'Tech' }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ id: VALID_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/Only Draft or Rejected blogs can be edited/i);
  });

  it('allows the author to edit and update their own Draft blog', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: 'u1', role: 'TeamMember' }, response: null });
    const mockBlog = {
      _id: VALID_BLOG_ID,
      author: 'u1',
      status: 'Draft',
      title: 'Old Title',
      content: 'Old Content',
      category: 'Old Category',
      coverImage: '',
      tags: [],
      save: vi.fn().mockResolvedValue(true),
    };
    blogModel.findById.mockResolvedValue(mockBlog);

    const req = new Request(`http://localhost/api/blogs/${VALID_BLOG_ID}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Updated Title',
        content: 'New content body',
        category: 'Development',
        tags: ['nextjs', 'vitest'],
        status: 'Pending',
      }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ id: VALID_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockBlog.title).toBe('Updated Title');
    expect(mockBlog.content).toBe('New content body');
    expect(mockBlog.category).toBe('Development');
    expect(mockBlog.tags).toEqual(['nextjs', 'vitest']);
    expect(mockBlog.status).toBe('Pending');
    expect(mockBlog.save).toHaveBeenCalled();
  });

  it('allows Admin full authority to edit another member Published blog', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: 'admin1', role: 'Admin' }, response: null });
    const mockBlog = {
      _id: VALID_BLOG_ID,
      author: 'u_another_author',
      status: 'Published',
      title: 'Member Article',
      content: 'Initial text',
      category: 'Science',
      tags: [],
      save: vi.fn().mockResolvedValue(true),
    };
    blogModel.findById.mockResolvedValue(mockBlog);

    const req = new Request(`http://localhost/api/blogs/${VALID_BLOG_ID}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Curated by Admin',
        content: 'Admin verified content',
        category: 'Engineering',
        tags: 'curated, featured',
      }),
    });
    const res = await PUT(req as any, { params: Promise.resolve({ id: VALID_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockBlog.title).toBe('Curated by Admin');
    expect(mockBlog.content).toBe('Admin verified content');
    expect(mockBlog.tags).toEqual(['curated', 'featured']);
    expect(mockBlog.save).toHaveBeenCalled();
  });
});

describe('DELETE /api/blogs/[id]', () => {
  it('returns 401 when requireAuth fails', async () => {
    const unauthResponse = new Response(JSON.stringify({ success: false }), { status: 401 });
    authMock.requireAuth.mockResolvedValue({ payload: null, response: unauthResponse });

    const req = new Request(`http://localhost/api/blogs/${VALID_BLOG_ID}`, { method: 'DELETE' });
    const res = await DELETE(req as any, { params: Promise.resolve({ id: VALID_BLOG_ID }) });

    expect(res.status).toBe(401);
  });

  it('returns 403 when a non-manager tries to delete another member blog', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: 'u2', role: 'TeamMember' }, response: null });
    blogModel.findById.mockResolvedValue({
      _id: VALID_BLOG_ID,
      author: 'u1',
    });

    const req = new Request(`http://localhost/api/blogs/${VALID_BLOG_ID}`, { method: 'DELETE' });
    const res = await DELETE(req as any, { params: Promise.resolve({ id: VALID_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toBe('Forbidden');
  });

  it('allows the author to delete their own blog', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: 'u1', role: 'TeamMember' }, response: null });
    const mockBlog = {
      _id: VALID_BLOG_ID,
      author: 'u1',
      deleteOne: vi.fn().mockResolvedValue(true),
    };
    blogModel.findById.mockResolvedValue(mockBlog);

    const req = new Request(`http://localhost/api/blogs/${VALID_BLOG_ID}`, { method: 'DELETE' });
    const res = await DELETE(req as any, { params: Promise.resolve({ id: VALID_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockBlog.deleteOne).toHaveBeenCalled();
  });

  it('allows Admin to delete any blog written by any member', async () => {
    authMock.requireAuth.mockResolvedValue({ payload: { userId: 'admin1', role: 'Admin' }, response: null });
    const mockBlog = {
      _id: VALID_BLOG_ID,
      author: 'u_someone_else',
      deleteOne: vi.fn().mockResolvedValue(true),
    };
    blogModel.findById.mockResolvedValue(mockBlog);

    const req = new Request(`http://localhost/api/blogs/${VALID_BLOG_ID}`, { method: 'DELETE' });
    const res = await DELETE(req as any, { params: Promise.resolve({ id: VALID_BLOG_ID }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockBlog.deleteOne).toHaveBeenCalled();
  });
});
