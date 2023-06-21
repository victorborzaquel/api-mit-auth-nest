declare global {
  namespace Express {
    export interface Request {
      user: {
        sub: string;
      };
      sign: {
        sub: string;
        role: Role;
        company_id: string;
        is_admin: boolean;
      };
    }
  }
}
