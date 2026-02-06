import { Request, Response, NextFunction } from 'express';
import config from '../config/env';

export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
    const providedKey =
        req.headers['x-api-key'] ||
        req.headers['authorization']?.replace('Bearer ', '') ||
        req.body.apiKey;

    if (!providedKey || providedKey !== config.apiKey) {
        return res.status(401).json({
            status: 'error',
            message: 'API Key tidak valid atau tidak disediakan',
            code: 'UNAUTHORIZED',
        });
    }

    next();
};
