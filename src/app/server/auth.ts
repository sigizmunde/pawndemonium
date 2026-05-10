'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export type AuthUser = {
  email: string;
  name?: string;
  picture?: string;
};

export async function authenticateWithGoogle(credential: string): Promise<AuthUser> {
  if (!credential) {
    throw new Error('No credential provided');
  }

  // verify google token
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new Error('Invalid Google token');
  }

  // placeholder for additional user info processing (e.g., save to DB)

  // create app session jwt
  const sessionToken = jwt.sign(
    {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    },
    process.env.JWT_SECRET || '',
    {
      expiresIn: '7d',
    }
  );

  // set httpOnly cookie
  cookies().set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}

export async function logout() {
  cookies().set('session', '', {
    expires: new Date(0),
    path: '/',
  });
}
