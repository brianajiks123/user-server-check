import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '5050', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    apiKey: process.env.API_KEY,
    internalApiUrl: process.env.INTERNAL_API_URL,
    internalApiTimeout: parseInt(process.env.INTERNAL_API_TIMEOUT || '10000', 10),
};

if (config.nodeEnv === 'production') {
    if (!config.apiKey) {
        throw new Error('API_KEY environment variable wajib diisi di production');
    }
    if (!config.internalApiUrl) {
        throw new Error('INTERNAL_API_URL environment variable wajib diisi di production');
    }
    if (config.corsOrigin === 'http://localhost:3001' || config.corsOrigin === '*') {
        console.warn('CORS origin sebaiknya di-lock ketat di production, bukan localhost atau *');
    }
}

export default config;
