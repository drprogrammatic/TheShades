import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import User from '@/models/User';

async function hydrateUserFromToken(token) {
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded?.id) return null;

  await dbConnect();
  const user = await User.findById(decoded.id).select('-password');
  return user;
}

function readTokenClaims(token) {
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded?.id) return null;

  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };
}

export async function getSessionUserFromRequest(request) {
  const token = getTokenFromRequest(request);
  return hydrateUserFromToken(token);
}

export async function getSessionUserFromCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  return hydrateUserFromToken(token);
}

export function getSessionClaimsFromRequest(request) {
  const token = getTokenFromRequest(request);
  return readTokenClaims(token);
}

export function getSessionClaimsFromCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  return readTokenClaims(token);
}
