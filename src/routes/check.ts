import { Router } from 'express';
import { validateCheckRequest } from '../middleware/validation';
import { requireApiKey } from '../middleware/auth';
import { UserService } from '../services/userService';
import { ApiError, CheckRequest, CheckResponse } from '../types/index';
import logger from '../utils/logger';

const router = Router();

router.post(
    '/check',
    requireApiKey,
    validateCheckRequest,
    async (req, res) => {
        try {
            const { idPelanggan, idServer, gameTitle, gameTitleX } = req.body as CheckRequest & { gameTitleX: string[] };

            const data = await UserService.validateUser(
                idPelanggan,
                idServer,
                gameTitle,
                gameTitleX
            );

            const response: CheckResponse = {
                status: 'success',
                message: 'Berhasil melakukan check',
                data,
            };

            res.status(200).json(response);
        } catch (error: unknown) {
            if (error instanceof ApiError) {
                res.status(error.status).json({
                    status: 'error',
                    message: error.message,
                    code: error.code,
                });
                return;
            }

            logger.error('Unexpected error in check route', { error });
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan server',
                code: 'INTERNAL_ERROR',
            });
        }
    }
);

export default router;
