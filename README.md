# FastAPI & SQLModel CRUD API - Usuarios y Posts

Este proyecto es una API RESTful desarrollada con **FastAPI**, utilizando **SQLModel** como ORM y **SQLite** como base de datos local. Cumple con el objetivo de implementar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) con relaciones entre dos entidades principales: `User` y `Post`.

## 🛠️ Tecnologías Utilizadas
* **Python** 
* **FastAPI:** Framework web moderno y rápido para construir APIs.
* **SQLModel:** ORM que combina SQLAlchemy y Pydantic.
* **SQLite:** Motor de base de datos relacional ligero.
* **uv:** Gestor de paquetes y entornos virtuales ultra rápido.

## 🚀 Instalación y Configuración Local

Sigue estos pasos para replicar el entorno y ejecutar la API en tu máquina local.

### 1. Clonar el repositorio
Abre tu terminal (PowerShell o Git Bash) y clona el proyecto:
```bash
git clone [https://github.com/ncoovr/FastAPI_ExampleModel.git](https://github.com/ncoovr/FastAPI_ExampleModel.git)
cd FastAPI_ExampleModel

2. Inicializar el proyecto con uv
Si no tienes uv instalado, instálalo primero. Luego, inicializa el proyecto para crear la configuración base:

Bash
uv init
(Nota: Si se genera un archivo hello.py por defecto, puedes eliminarlo).

3. Instalar las dependencias
Instala FastAPI, SQLModel y genera el entorno virtual automáticamente en un solo comando:

Bash
uv add "fastapi[standard]" sqlmodel --system-certs
4. Estructura del Código
El código fuente se encuentra alojado bajo la estructura de paquetes de Python en la ruta src/fastapi_examplemodel/:

models.py: Contiene los modelos de tablas de base de datos (User, Post) y los modelos DTO de validación de entrada (UserCreate, PostCreate) para proteger la integridad de los datos.

main.py: Contiene la instancia de FastAPI, la configuración de la base de datos y todos los endpoints de la API.

5. Ejecutar el Servidor de Desarrollo
Inicia la API indicando la ruta del archivo principal:

Bash
uv run fastapi dev src/fastapi_examplemodel/main.py
La base de datos posts.db se generará automáticamente en la raíz del proyecto al arrancar el servidor.

📖 Documentación de la API (Swagger UI)
Una vez que el servidor esté corriendo, abre tu navegador y visita:
http://127.0.0.1:8000/docs

Allí encontrarás la interfaz interactiva para probar los siguientes endpoints:

Endpoints de Usuarios
POST /users: Crea un nuevo usuario validando que el email no esté duplicado.

GET /users: Obtiene la lista de todos los usuarios registrados.

Endpoints de Posts
POST /posts: Crea un nuevo post asignado a un usuario existente (verifica la llave foránea).

GET /posts: Obtiene todos los posts.

GET /posts/latest: Obtiene el último post registrado.

GET /posts/{id}: Busca un post específico por su ID.

PUT /posts/{id}: Actualiza los datos de un post existente.

DELETE /posts/{id}: Elimina un post de la base de datos.