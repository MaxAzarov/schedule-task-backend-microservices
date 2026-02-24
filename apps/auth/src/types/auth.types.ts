import { Request } from 'express';
import { User } from '@app/common';

export interface JwtPayload {
  id: User['id'];
  email: User['email'];
  iat: number;
  exp: number;
};

/** User payload returned in auth responses (no password) */
export type AuthUserResponse = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName' | 'phone' | 'createdAt' | 'updatedAt'
>;

export interface AuthSignInResponse {
  token: string;
  user: AuthUserResponse;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
