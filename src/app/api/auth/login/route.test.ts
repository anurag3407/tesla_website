import { describe, it, expect, vi, beforeEach } from 'vitest';

const { userModel, bcryptMock, jwtMock } = vi.hoisted(() => {
  const userModel: any = vi.fn();
  userModel.findOne = vi.fn();
  const bcryptMock = {
    compare: vi.fn(),
  };
  const jwtMock = {
    sign: vi.fn().mockReturnValue('mock-jwt-token'),
  };
  return { userModel, bcryptMock, jwtMock };
});

vi.mock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/models/User', () => ({ User: userModel }));
vi.mock('bcryptjs', () => ({ default: bcryptMock }));
vi.mock('jsonwebtoken', () => ({ default: jwtMock }));

import { POST } from './route';

function postRequest(body: unknown): Request {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  jwtMock.sign.mockReturnValue('mock-jwt-token');
});

describe('POST /api/auth/login', () => {
  it('returns 400 when email or password is missing', async () => {
    const res = await POST(postRequest({ email: 'test@tesla.club' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/provide email and password/i);
  });

  it('normalizes email with lowercase and trimming', async () => {
    userModel.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    });

    const res = await POST(postRequest({ email: '  User@Tesla.Club  ', password: 'password123' }));
    expect(res.status).toBe(401);
    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'user@tesla.club' });
  });

  it('rejects deactivated/inactive user with 403', async () => {
    userModel.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        _id: 'user-1',
        email: 'banned@tesla.club',
        password: 'hashed-password',
        status: 'inactive',
      }),
    });

    const res = await POST(postRequest({ email: 'banned@tesla.club', password: 'password123' }));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toMatch(/deactivated/i);
    expect(bcryptMock.compare).not.toHaveBeenCalled();
  });

  it('returns 401 on incorrect password', async () => {
    userModel.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        _id: 'user-1',
        email: 'user@tesla.club',
        password: 'hashed-password',
        status: 'active',
      }),
    });
    bcryptMock.compare.mockResolvedValue(false);

    const res = await POST(postRequest({ email: 'user@tesla.club', password: 'wrongpassword' }));
    expect(res.status).toBe(401);
  });

  it('returns 200 and sets httpOnly token on success', async () => {
    userModel.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        _id: 'user-1',
        role: 'TeamMember',
        designation: 'Developer',
        team: 'Dev Team',
        email: 'user@tesla.club',
        password: 'hashed-password',
        status: 'active',
      }),
    });
    bcryptMock.compare.mockResolvedValue(true);

    const res = await POST(postRequest({ email: 'user@tesla.club', password: 'correctpassword' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toMatch(/logged in successfully/i);
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toMatch(/token=mock-jwt-token/);
    expect(setCookie).toMatch(/HttpOnly/i);
  });
});
