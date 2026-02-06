import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import { ApiError } from '../types/index.js';

export const errorHandler = (
    error: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    logger.error('Error occurred', {
        message: error.message,
        stack: error.stack,
    });

    if (error instanceof ApiError) {
        res.status(error.status).json({
            status: 'error',
            message: error.message,
            code: error.code,
        });
        return;
    }

    res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
        code: 'INTERNAL_ERROR',
    });
};
