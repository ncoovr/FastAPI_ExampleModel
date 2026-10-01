# 🎬 U|STREAM - Plataforma de Streaming

Plataforma web de video inspirada en la estética y funcionalidad de Spotify y Pinterest. Desarrollada con una arquitectura cliente-servidor moderna, base de datos relacional y diseño responsivo.

## 🛠️ Tecnologías Utilizadas

*   **Backend:** Python, FastAPI, SQLModel, PostgreSQL, `uv` (Gestor de paquetes).
*   **Frontend:** React, Vite, React Router, Lucide React, CSS (Atomic/Responsive Design).
*   **Seguridad:** Hashing de contraseñas con `bcrypt`.

---

## 📋 Requisitos Previos (Instalación desde cero)

Para ejecutar este proyecto en tu máquina local, necesitas instalar las siguientes herramientas:

### 1. Node.js y npm (Para el Frontend)
Descarga e instala la versión recomendada (LTS) de Node.js desde su página oficial:
*   [Descargar Node.js](https://nodejs.org/)
*   Para verificar que se instaló correctamente, abre tu terminal y ejecuta: `node -v` y `npm -v`.

### 2. Gestor de paquetes `uv` (Para el Backend en Python)
`uv` es una herramienta ultrarrápida para gestionar proyectos en Python. Instálala abriendo tu terminal y ejecutando el comando correspondiente a tu sistema operativo:
*   **Windows (PowerShell):**
    ```powershell
    powershell -ExecutionPolicy ByPass -c "irm [https://astral.sh/uv/install.ps1](https://astral.sh/uv/install.ps1) | iex"
    ```
*   **macOS / Linux:**
    ```bash
    curl -LsSf [https://astral.sh/uv/install.sh](https://astral.sh/uv/install.sh) | sh
    ```

### 3. PostgreSQL (Base de Datos)
*   Instala PostgreSQL y pgAdmin desde [postgresql.org](https://www.postgresql.org/download/).
*   Abre pgAdmin (o usa la terminal `psql`) y crea una base de datos vacía. Puedes llamarla, por ejemplo, `ustream_db`.

### 4. Git
Si aún no lo tienes, instala Git desde [git-scm.com](https://git-scm.com/) para poder clonar el repositorio.

---

## 🚀 Guía de Instalación y Ejecución Paso a Paso

### Paso 1: Clonar el repositorio
Abre tu terminal, navega a la carpeta donde deseas guardar el proyecto y ejecuta:
```bash
git clone [https://github.com/TU_USUARIO/TU_REPOSITORIO.git](https://github.com/TU_USUARIO/TU_REPOSITORIO.git)
cd TU_REPOSITORIO
Paso 2: Configuración de Variables de Entorno
El proyecto necesita saber cómo conectarse a tu base de datos local.

En la carpeta raíz del proyecto, busca el archivo .env.example y haz una copia de él llamándola .env.

Abre el archivo .env y configura tu cadena de conexión a PostgreSQL:

Ini, TOML
# Reemplaza 'usuario', 'contraseña' y 'ustream_db' con tus datos de pgAdmin
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/ustream_db
Paso 3: Levantar el Backend (FastAPI)
Desde la misma terminal en la raíz del proyecto, usaremos uv para instalar Python, crear el entorno virtual y descargar las librerías automáticamente:

Sincroniza e instala las dependencias:

Bash
uv sync
Inicia el servidor de desarrollo de FastAPI:

Bash
uv run uvicorn src.fastapi_examplemodel.main:app --reload
✅ Éxito: Si ves "Application startup complete", tu backend está corriendo.
🔗 Swagger UI (Documentación interactiva): http://localhost:8000/docs

Paso 4: Levantar el Frontend (React)
Abre una NUEVA pestaña o ventana de terminal (deja el backend corriendo en la primera) y sigue estos pasos:

Ingresa a la carpeta del frontend:

Bash
cd frontend
Instala todas las dependencias de Node.js:

Bash
npm install
Inicia el servidor de desarrollo de Vite:

Bash
npm run dev
✅ Éxito: La terminal te mostrará una dirección local.
🔗 Aplicación Web: http://localhost:5173

🎮 Uso Básico
Entra a http://localhost:5173.

Ve a la sección Iniciar Sesión y regístrate como un usuario nuevo.

Para simular videos (hasta que se integre la subida por AWS S3), puedes ir a http://localhost:8000/docs, usar el endpoint POST /videos, e insertar datos de prueba utilizando el id de tu usuario recién creado.

Vuelve al inicio y comienza a explorar la plataforma.