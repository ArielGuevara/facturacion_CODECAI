export interface JwtPayload {
  sub: number;      
  email: string;
  roleId: number;
  roleName?: string;
  iat?: number;     
  exp?: number;      
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}