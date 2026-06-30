# Matriz de verificación — Trabajo grupal MVP

**Grupo:** Paul Ferrada (y grupo)  
**Tema # / slug:** Tema #5 / 05-autos  
**Integrantes:** Paul Ferrada 
**Fecha evaluación:** 30/06/2026

Leyenda nota por ítem: **0** no cumple · **1** parcial · **2** cumple  
Bonus HU-OPC: **+5** si cumple procedimiento · **0** si no implementado

## URLs producción

| Componente | URL |
|------------|-----|
| Frontend | https://puertoautos-app.netlify.app |
| API | https://api-production-710a.up.railway.app |
| Repositorio Git | https://github.com/PaulFL808/PUERTOAUTOS.git |

**Usuario de prueba:** tu@email.com / contraseña: password123

---

## MVP-GEN (obligatorias)

| ID | Título | Nota 0/1/2 | Evidencia / observación |
|----|--------|------------|-------------------------|
| MVP-GEN-01 | Repositorio ejecutable | 2 | Backend y Frontend separados, package.json configurado |
| MVP-GEN-02 | Variables de entorno | 2 | Se usan .env para conexión a BD, JWT_SECRET y puerto |
| MVP-GEN-03 | BD y modelos | 2 | Sequelize con MySQL (Modelos: Usuario y Anuncio) |
| MVP-GEN-04 | Registro web | 2 | Endpoint `/auth/register` con bcrypt, formulario web |
| MVP-GEN-05 | Login JWT | 2 | Endpoint `/auth/login` devuelve token JWT |
| MVP-GEN-06 | Front integrado | 2 | React + Vite consumiendo API con Axios, ruteo con React Router |
| MVP-GEN-07 | Deploy público | 2 | Backend en Railway, BD en Railway, Frontend en Netlify |

## HU dominio (obligatorias)

| ID | Título | Nota 0/1/2 | Evidencia / observación |
|----|--------|------------|-------------------------|
| HU-01 | Modelar anuncios | 2 | Modelo `Anuncio` y `Foto` creados en Sequelize |
| HU-02 | Publicar anuncio | 2 | Formulario en `/publicar`, requiere estar logueado |
| HU-03 | Listado público | 2 | `/` muestra todos los anuncios |
| HU-04 | Detalle de anuncio | 2 | `/anuncio/:id` muestra precio, km, fotos y estado |
| HU-05 | Filtrar anuncios | 2 | Filtros por marca y precio máximo implementados |
| HU-06 | Editar anuncio propio | 2 | Formulario en `/editar/:id`, actualiza la info base |
| HU-07 | Marcar como vendido | 2 | Botón "Marcar Vendido" en la pantalla de Mis Anuncios |
| HU-08 | Solo el dueño edita | 2 | Validación tanto en Frontend como Backend (JWT + validación de id) |

## HU opcionales (bonus)

| ID | Título | Implementado | Cumple | +Pts |
|----|--------|--------------|--------|------|
| HU-OPC-01 | Fotos en anuncio | ☑ Sí | ☑ Sí | +5 |
| HU-OPC-02 | Contactar vendedor | ☐ No | ☐ No | 0 |

---

## Resumen

| Métrica | Valor |
|---------|-------|
| Suma ítems obligatorios (máx. 30 pts brutos → escalar a 100) | 30 / 30 |
| Nota base calculada | 100 / 100 |
| Bonus opcional | + 5 |
| Penalizaciones | - 0 |
| **Nota final** | **105 / 110** |
| Presentación realizada (todos participaron) | ☑ Sí ☐ No |
| Tag `entrega-mvp-grupal` | ☑ Sí ☐ No |
