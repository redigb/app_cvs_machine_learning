## 🚀 Cómo correrlo


``bash
    - docker build -t model-cvs-docs .
    - docker run -p 8000:8000 omodel-cvs-docs


**Construir image solo Dockerfile**
``bash
    - docker build -t model-cvs-docs .

**Si es solo Dockerfile para cargar el .env correr**

``bash
    - docker run --env-file .env -p 8000:8000 model-cvs-docs
    - docker run --rm --env-file .env -p 8000:8000 --name model-cvs-docs model-cvs-docs
