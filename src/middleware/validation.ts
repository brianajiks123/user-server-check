import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

const VALID_GAME_TITLES = [
    'MOBILELEGEND',
    'FREEFIRE',
    'AOV',
    'TOMANDJERRY',
    'CALLOFDUTY',
    'LORDSMOBILE',
    'MARVELSUPERWAR',
];

const checkRequestSchema = z.object({
    idPelanggan: z
        .string()
        .min(3, 'ID Pelanggan minimal 3 karakter')
        .max(50, 'ID Pelanggan maksimal 50 karakter')
        .regex(/^[a-zA-Z0-9_-]+$/, 'ID Pelanggan hanya boleh alphanumeric, underscore, dan dash'),
    idServer: z
        .string()
        .min(1, 'ID Server tidak boleh kosong')
        .max(50, 'ID Server maksimal 50 karakter')
        .regex(/^[a-zA-Z0-9_-]+$/, 'ID Server hanya boleh alphanumeric, underscore, dan dash'),
    gameTitle: z
        .string()
        .refine((val) => VALID_GAME_TITLES.includes(val), {
            message: `Game Title harus salah satu dari: ${VALID_GAME_TITLES.join(', ')}`,
        }),
    gameTitleX: z
        .string()
        .min(1, 'Daftar game yang diizinkan server tidak boleh kosong')
        .transform((val) => val.split(',').map((t) => t.trim()).filter(Boolean)),
});

export const validateCheckRequest = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const validated = checkRequestSchema.parse(req.body);

        if (!validated.gameTitleX.includes(validated.gameTitle)) {
            res.status(400).json({
                status: 'error',
                message: `Game "${validated.gameTitle}" tidak termasuk dalam daftar game yang diizinkan oleh server`,
                code: 'GAME_NOT_ALLOWED_BY_SERVER',
            });
            return;
        }

        req.body = {
            ...validated,
            gameTitleX: validated.gameTitleX,
        };

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            logger.warn('Validation error', { errors: error.errors });
            res.status(400).json({
                status: 'error',
                message: 'Validasi input gagal',
                code: 'VALIDATION_ERROR',
                errors: error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
            return;
        }
        next(error);
    }
};
