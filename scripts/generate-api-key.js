import { randomBytes } from 'crypto';

function generateApiKey(length = 48) {
    const bytes = randomBytes(length);
    const apiKey = bytes
        .toString('base64url')
        .replace(/=/g, '');

    return apiKey;
}

const key = generateApiKey(48);

console.log('Copy dan paste ke .env:');
console.log(`API_KEY=${key}`);
console.log('\nPanjang:', key.length, 'karakter');
console.log('Keamanan: sangat tinggi (crypto.randomBytes)');
