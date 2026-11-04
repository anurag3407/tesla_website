import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const { modelsMock, authMock } = vi.hoisted(() => {
  const modelsMock: any = {
    User: { find: vi.fn() },
    Team: { find: vi.fn() },
    Event: { find: vi.fn() },
    Blog: { find: vi.fn() },
    Achievement: { find: vi.fn() },
    Resource: { find: vi.fn() },
    Visit: { countDocuments: vi.fn(), find: vi.fn() },
  };
  const authMock = {
    requireRole: vi.fn(),
  };
  return { modelsMock, authMock };
});

vi.mock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/lib/auth', () => ({ requireRole: authMock.requireRole }));
vi.mock('@/models/User', () => ({ User: modelsMock.User }));
vi.mock('@/models/Team', () => ({ Team: modelsMock.Team }));
vi.mock('@/models/Event', () => ({ Event: modelsMock.Event }));
vi.mock('@/models/Blog', () => ({ Blog: modelsMock.Blog }));
vi.mock('@/models/Achievement', () => ({ Achievement: modelsMock.Achievement }));
vi.mock('@/models/Resource', () => ({ Resource: modelsMock.Resource }));
vi.mock('@/models/Visit', () => ({ Visit: modelsMock.Visit }));

import { GET } from './route';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('GET /api/dashboard/pi', () => {
  it('blocks unauthorized roles with 403', async () => {
    authMock.requireRole.mockResolvedValue({
      response: new Response(JSON.stringify({ error: 'Access denied: role unauthorized' }), { status: 403 }),
    });

    const req = new NextRequest('http://localhost/api/dashboard/pi');
    const res = await GET(req);

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toMatch(/Access denied/);
  });

  it('allows Admin, President, or PI to fetch analytics oversight data', async () => {
    authMock.requireRole.mockResolvedValue({
      payload: { userId: 'admin1', role: 'Admin' },
      response: null,
    });

    // Mock query chains
    modelsMock.Team.find.mockReturnValue({
      populate: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([
            { _id: 't1', name: 'Software', lead: { name: 'Lead Dev' }, members: [] },
          ]),
        }),
      }),
    });

    modelsMock.User.find.mockReturnValue({
      select: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([
            { _id: 'u1', name: 'Member A', role: 'TeamMember', status: 'active', createdAt: new Date() },
          ]),
        }),
      }),
    });

    modelsMock.Event.find.mockReturnValue({
      select: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([
            { _id: 'e1', title: 'Workshop', registeredUsers: ['u1'], date: new Date(), createdAt: new Date() },
          ]),
        }),
      }),
    });

    modelsMock.Blog.find.mockReturnValue({
      select: vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          sort: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue([
              { _id: 'b1', title: 'Tech Article', views: 42, author: { name: 'Author' }, createdAt: new Date() },
            ]),
          }),
        }),
      }),
    });

    modelsMock.Achievement.find.mockReturnValue({
      select: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    modelsMock.Resource.find.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          { _id: 'r1', department: 'CSE', files: [{ _id: 'f1', downloads: 10, views: 25, uploadedAt: new Date() }] },
        ]),
      }),
    });

    modelsMock.Visit.countDocuments.mockResolvedValue(150);
    modelsMock.Visit.find.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      }),
    });

    const req = new NextRequest('http://localhost/api/dashboard/pi?period=30d');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.period).toBe('30d');
    expect(data.kpis).toBeDefined();
    expect(data.kpis.activeMembers).toBe(1);
    expect(data.kpis.totalEvents).toBe(1);
    expect(data.kpis.publishedBlogs).toBe(1);
    expect(data.visibility.visitsTotal).toBe(150);
    expect(data.teams).toHaveLength(1);
  });
});
