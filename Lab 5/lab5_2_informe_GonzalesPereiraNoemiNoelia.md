# Informe de Laboratorio 5.1: Despliegue Continuo (CD) Profesional
**Estudiante:** Noemi Noelia Gonzales Pereira  
**Institución:** Universidad Mayor Real y Pontificia de San Francisco Xavier de Chuquisaca  
**Carrera:** Ingeniería de Sistemas  
**Fecha:** Mayo de 2026

---

## 1. Descripción del Pipeline de CD
Para este laboratorio, se ha diseñado e implementado un pipeline de Despliegue Continuo (CD) utilizando **GitHub Actions**, orientado a automatizar el ciclo de vida de una API CRUD desarrollada en NestJS.

### Decisiones Técnicas Tomadas:
*   **Multi-stage Build:** Se configuró un `Dockerfile` con dos etapas (Build y Runtime) utilizando imágenes base de **Node:20-alpine**. Esto reduce drásticamente el peso de la imagen final y disminuye la superficie de ataque al no incluir herramientas de compilación en el entorno de ejecución.



*   **Etiquetado por SHA:** Se utiliza el `${{ github.sha }}` para etiquetar cada imagen en Docker Hub. Esto garantiza una trazabilidad total, permitiendo saber exactamente qué versión del código está corriendo en el servidor en cualquier momento.
*   **GitHub Environments:** Se implementó el entorno `production` para centralizar secretos sensibles (IPs, llaves SSH, tokens) de forma aislada y segura.
*   **Escaneo de Seguridad:** Se integró **Trivy** en el pipeline para analizar las capas de la imagen en busca de vulnerabilidades críticas y altas antes del despliegue.

---

## 2. Fase de Build y Push (GitHub Actions)
En esta etapa, el pipeline realiza el login en Docker Hub, construye la imagen y la sube al repositorio público `noegonzales/nestjs-app`.

> **Captura de pantalla sugerida:** (Pestaña Actions con el job de Build-and-Push en verde)
![Fase de Build y Push](/img/u.jpeg)

---

## 3. Escaneo de Vulnerabilidades
Utilizando `aquasecurity/trivy-action`, se analizan las dependencias y el sistema operativo de la imagen. Esto asegura que no se desplieguen contenedores con fallos de seguridad conocidos.



## 4. Despliegue en Producción (AWS EC2)
El despliegue se realiza mediante SSH. El script automatizado descarga la nueva imagen desde Docker Hub, detiene el contenedor anterior y levanta el nuevo en el puerto 80 del servidor remoto.

*   **Host del Servidor:** 54.90.167.110
*   **Puerto de Producción:** 80 (mapeado al 3001 interno)

> **Captura de pantalla sugerida:** (Navegador con la API funcionando en tu IP o Swagger UI)
![Aplicación Funcionando](/img/health.jpeg)

---

## 5. Gestión de Fallos: Rollback
En este proyecto, se han documentado dos métodos para revertir a una versión estable si algo falla:

1.  **Rollback Automático (Script de Deploy):** El archivo `cd.yml` incluye un paso de validación. Si el contenedor nuevo no responde correctamente, el script termina con error y no reemplaza el contenedor estable actual.
 
![Aplicación Funcionando](/img/rol.jpeg)


2.  **Rollback Manual (Infraestructura):** En caso de detectar un error lógico posterior al despliegue, se puede ejecutar por SSH:
    ```bash
    docker pull noegonzales/nestjs-app:SHA_ESTABLE_LARGO
    docker stop nest-app && docker rm nest-app
    docker run -d --name nest-app -p 80:3001 noegonzales/nestjs-app:SHA_ESTABLE_LARGO