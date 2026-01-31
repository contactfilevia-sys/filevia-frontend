# Document Converter Backend API

Production-ready backend for document conversion platform supporting multiple file format conversions.

## Features

- Word ↔ PDF conversion
- Excel ↔ PDF conversion
- PowerPoint ↔ PDF conversion
- Image ↔ PDF conversion
- Automatic file cleanup (15-minute retention)
- File size validation
- Secure file handling
- RESTful API endpoints

## Prerequisites

- Node.js 18+ 
- LibreOffice (for document conversions)
- pdf-poppler (for PDF to image conversion)
- Sharp (for image processing)

### Installing LibreOffice

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y libreoffice
```

**CentOS/RHEL:**
```bash
sudo yum install -y libreoffice
```

**macOS:**
```bash
brew install --cask libreoffice
```

### Installing pdf-poppler

**Ubuntu/Debian:**
```bash
sudo apt-get install -y poppler-utils
```

**CentOS/RHEL:**
```bash
sudo yum install -y poppler-utils
```

**macOS:**
```bash
brew install poppler
```

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=20971520
CLEANUP_INTERVAL=600000
FILE_RETENTION_TIME=900000
TMP_UPLOAD_DIR=./tmp/uploads
TMP_OUTPUT_DIR=./tmp/outputs
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```

### Conversion Endpoints

All conversion endpoints accept `POST` requests with a file upload using the field name `file`.

#### Word to PDF
```
POST /api/convert/word-to-pdf
Content-Type: multipart/form-data
Body: file (doc, docx)
```

#### PDF to Word
```
POST /api/convert/pdf-to-word
Content-Type: multipart/form-data
Body: file (pdf)
```

#### Excel to PDF
```
POST /api/convert/excel-to-pdf
Content-Type: multipart/form-data
Body: file (xls, xlsx)
```

#### PDF to Excel
```
POST /api/convert/pdf-to-excel
Content-Type: multipart/form-data
Body: file (pdf)
```

#### PPT to PDF
```
POST /api/convert/ppt-to-pdf
Content-Type: multipart/form-data
Body: file (ppt, pptx)
```

#### PDF to PPT
```
POST /api/convert/pdf-to-ppt
Content-Type: multipart/form-data
Body: file (pdf)
```

#### Image to PDF
```
POST /api/convert/image-to-pdf
Content-Type: multipart/form-data
Body: file (jpg, jpeg, png)
```

#### PDF to Image
```
POST /api/convert/pdf-to-image
Content-Type: multipart/form-data
Body: file (pdf)
```

## Example Request

### Using cURL
```bash
curl -X POST \
  http://localhost:3001/api/convert/word-to-pdf \
  -F "file=@document.docx" \
  --output converted.pdf
```

### Using JavaScript (Fetch API)
```javascript
const formData = new FormData()
formData.append('file', fileInput.files[0])

const response = await fetch('http://localhost:3001/api/convert/word-to-pdf', {
  method: 'POST',
  body: formData,
})

if (response.ok) {
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'converted.pdf'
  a.click()
} else {
  const error = await response.json()
  console.error('Error:', error)
}
```

## Response Format

### Success Response
- **Content-Type:** `application/octet-stream`
- **Headers:**
  - `Content-Disposition: attachment; filename="converted_file.pdf"`
  - `X-Original-File: original.docx`
  - `X-Converted-File: converted.pdf`
- **Body:** Binary file data

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## File Handling

- Files are stored temporarily in `./tmp/uploads` and `./tmp/outputs`
- Automatic cleanup runs every 10 minutes
- Files are deleted after 15 minutes
- Maximum file size: 20MB (configurable)

## Security

- File type validation
- File size limits
- Sanitized file names
- No persistent storage
- Automatic file cleanup
- CORS protection

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `NODE_ENV` | production | Environment mode |
| `CORS_ORIGIN` | http://localhost:3000 | Allowed CORS origin |
| `MAX_FILE_SIZE` | 20971520 | Max file size in bytes (20MB) |
| `CLEANUP_INTERVAL` | 600000 | Cleanup interval in ms (10 min) |
| `FILE_RETENTION_TIME` | 900000 | File retention time in ms (15 min) |
| `TMP_UPLOAD_DIR` | ./tmp/uploads | Upload directory |
| `TMP_OUTPUT_DIR` | ./tmp/outputs | Output directory |

## Project Structure

```
backend/
├── src/
│   ├── app.js                 # Main application entry
│   ├── config/                # Configuration
│   │   └── index.js
│   ├── controllers/           # Request handlers
│   │   └── convertController.js
│   ├── middlewares/           # Express middlewares
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── routes/                 # API routes
│   │   ├── index.js
│   │   └── convertRoutes.js
│   ├── services/               # Business logic
│   │   ├── converter.js
│   │   ├── libreoffice.js
│   │   └── imageConverter.js
│   └── utils/                  # Utility functions
│       ├── fileUtils.js
│       └── cleanup.js
├── tmp/                        # Temporary files (auto-created)
├── package.json
├── .env.example
└── README.md
```

## Deployment

### Linux VPS

1. Install Node.js and dependencies
2. Install LibreOffice and poppler-utils
3. Clone repository
4. Install npm packages
5. Configure `.env`
6. Use PM2 or systemd to run as service:

```bash
pm2 start src/app.js --name doc-converter
```

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:18

RUN apt-get update && apt-get install -y \
    libreoffice \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001
CMD ["npm", "start"]
```

## Troubleshooting

### LibreOffice not found
- Ensure LibreOffice is installed: `which libreoffice`
- Check PATH environment variable

### Conversion fails
- Verify input file format is supported
- Check file size limits
- Review server logs for detailed errors

### Permission errors
- Ensure write permissions for temp directories
- Check file system permissions

## License

MIT
