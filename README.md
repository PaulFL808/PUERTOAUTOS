# PUERTOAUTOS - Proyecto 05

Sistema de Anuncios de Automóviles (Clon de Chileautos) desarrollado como MVP grupal.

## Tecnologías
- **Backend:** Node.js, Express, Sequelize, MySQL
- **Frontend:** React, Vite, Vanilla CSS
- **Autenticación:** JWT
- **Imágenes:** Multer (Local en `/public/uploads`)

## Requisitos Previos
1. Node.js (v18+)
2. MySQL (Crear base de datos `puertoautos` o correr el backend que la sincronizará).

## Ejecución Local

**Backend:**
```bash
cd server
npm install
node src/index.js
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

El backend corre en el puerto `3000` y el frontend en el puerto sugerido por Vite (usualmente `5173`).
