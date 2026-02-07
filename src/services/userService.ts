import axios, { AxiosError } from 'axios';
import logger from '../utils/logger';
import { ApiError } from '../types/index';
import config from '../config/env';

interface ApiResponse {
    status: string;
    message: string;
    code?: string;
    data?: {
        idPelanggan: string;
        username: string;
        idServer: string;
        gameTitle: string;
    };
}

export class UserService {
    private static readonly INTERNAL_API_URL = config.internalApiUrl;
    private static readonly TIMEOUT = config.internalApiTimeout;

    static async validateUser(
        idPelanggan: string,
        idServer: string,
        gameTitle: string,
        gameTitleX: string[]
    ): Promise<{ idPelanggan: string; username: string; idServer: string; gameTitle: string }> {
        const safeId = idPelanggan.length > 8 ? idPelanggan.slice(0, 4) + '****' + idPelanggan.slice(-4) : idPelanggan;

        logger.info('Validating user via internal API', { safeId, idServer, gameTitle });

        try {
            const response = await axios.post<ApiResponse>(
                `${this.INTERNAL_API_URL}/api/check`,
                {
                    idPelanggan,
                    idServer,
                    gameTitle,
                    gameTitleX: gameTitleX.join(','),
                },
                {
                    timeout: this.TIMEOUT,
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const { data } = response;

            if (!data.data) {
                throw new ApiError(500, 'INVALID_API_RESPONSE', 'API internal mengembalikan data kosong');
            }

            logger.info('User validation successful', {
                safeId,
                username: data.data.username,
            });

            return data.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.code === 'ECONNABORTED') {
                    throw new ApiError(408, 'INTERNAL_API_TIMEOUT', 'Server sedang gangguan, silakan coba beberapa saat lagi');
                }
                if (err.response) {
                    const { status, data } = err.response;
                    throw new ApiError(
                        status,
                        (data as any)?.code || 'INTERNAL_API_ERROR',
                        (data as any)?.message || 'API internal mengembalikan error'
                    );
                }
                throw new ApiError(503, 'INTERNAL_API_UNAVAILABLE', err.message || 'Tidak dapat terhubung ke API internal');
            }

            logger.error('Unexpected error during validation', { error: (err as Error).message });
            throw new ApiError(500, 'INTERNAL_ERROR', 'Kesalahan server tidak diketahui');
        }
    }
}
