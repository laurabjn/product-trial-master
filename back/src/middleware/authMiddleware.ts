import { Request, Response, NextFunction, RequestHandler  } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { userId: string; isAdmin: boolean };
};

export const authMiddleware: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ error: "Access denied" });
        return;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; isAdmin: boolean };
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).json({ error: "Invalid token" });
    }
};

export const adminMiddleware: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user?.isAdmin) {
        res.status(403).json({ error: "Access denied" });
        return;
    }
    next();
};