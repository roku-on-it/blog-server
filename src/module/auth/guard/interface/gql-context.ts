import { Request, Response } from 'express';
import session from 'express-session';

export interface GQLContext {
  req: Req;
  res: Response;
}

interface Req extends Request {
  session: Sess;
}

interface Sess extends session.Session {
  userId: bigint;
}
