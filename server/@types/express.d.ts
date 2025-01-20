import { JwtPayload } from "aws-jwt-verify";

declare global {
  namespace Express {
    interface Request {
      user?: { sub: string };
    }
  }
}