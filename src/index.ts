import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/env.js';
import logger from './utils/logger.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import checkRoutes from './routes/check.js';

const app = express();

app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { status: 'error', message: 'Terlalu banyak permintaan, coba lagi nanti', code: 'RATE_LIMIT_EXCEEDED' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(cors({ origin: config.corsOrigin, credentials: false }));
app.use(requestLogger);

app.use('/api', checkRoutes);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), env: config.nodeEnv });
});

app.use((_req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint tidak ditemukan',
        code: 'NOT_FOUND',
    });
});

app.use(errorHandler);

app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`, {
        environment: config.nodeEnv,
        corsOrigin: config.corsOrigin,
    });
});
