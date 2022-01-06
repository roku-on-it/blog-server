import { Request, Response } from 'express';
import session from 'express-session';

export interface GQLContext {
  req: Req;
  res: Response;
}

export interface Req extends Request {
  session: Session;
}

export interface Session extends session.Session {
  userId: bigint;
}
