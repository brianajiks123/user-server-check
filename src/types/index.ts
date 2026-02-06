export interface CheckRequest {
    idPelanggan: string;
    idServer: string;
    gameTitle: string;
    gameTitleX: string;
}

export interface CheckResponse {
    status: 'success' | 'error';
    message: string;
    code?: string;
    data?: {
        idPelanggan: string;
        username: string;
        idServer: string;
        gameTitle: string;
    };
}

export interface User {
    idPelanggan: string;
    username: string;
    allowedGames: string[];
}

export interface Server {
    idServer: string;
    name: string;
    region: string;
}

export class ApiError extends Error {
    status: number;
    code: string;

    constructor(status: number, code: string, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
