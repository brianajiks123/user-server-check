# Dokumentasi API Sinkronisasi User & Server ID

API ini berfungsi sebagai **proxy aman** untuk memvalidasi `id user` dan `id server` terhadap API internal kantor (yang hanya bisa diakses via VPN lokal).

API ini **tidak boleh diakses secara publik tanpa autentikasi**.

## Informasi Umum

| Item                  | Deskripsi                                      |
|-----------------------|------------------------------------------------|
| Base URL (lokal dev)  | `http://localhost:5050`                        |
| Port default          | 5050                                           |
| Environment           | Development / Production                       |
| Authentication        | Header `x-api-key` (wajib)                     |
| Content-Type          | `application/json`                             |
| Rate Limit            | 30 request per menit per IP (bisa disesuaikan) |

## Environment Variables yang Diperlukan

```env
PORT=5050
NODE_ENV=development          # atau production
LOG_LEVEL=info
CORS_ORIGIN=https://nama-domain-anda.netlify.app
API_KEY=your_very_long_random_secret_key_2026_xyz123
INTERNAL_API_URL=http://x.x.x.x:5050
INTERNAL_API_TIMEOUT=10000
```

## Endpoints

### Health

```http
GET /health
```

#### Response Sukses (200 OK)

```json
{
  "status": "ok",
  "timestamp": "2026-02-06T20:44:00.000Z",
  "env": "development"
}
```

### Validasi User & Server ID

```http
POST /api/check
```

#### Header

```text
x-api-key: your_very_long_random_secret_key_2026_xyz123
Content-Type: application/json
```

#### Body JSON

```json
{
    "idPelanggan": "123456789",
    "idServer": "server123",
    "gameTitle": "MOBILELEGEND",
    "gameTitleX": "MOBILELEGEND,FREEFIRE,AOV"
}
```

#### List Game

- MOBILE LEGEND
- FREE FIRE
- ARENA OF VALOR (AOV)
- TOM AND JERRY
- CALL OF DUTY
- LORDS MOBILE
- MARVEL SUPER WAR

#### Response Sukses (200 OK)

```json
{
    "status": "success",
    "message": "Berhasil melakukan check",
    "data": {
        "idPelanggan": "123456789",
        "username": "xxxGaming",
        "idServer": "server123",
        "gameTitle": "MOBILELEGEND"
    }
}
```
