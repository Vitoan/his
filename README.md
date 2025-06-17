# 🏥 Sistema Hospitalario - Módulo de Admisión y Recepción de Pacientes

[![GitHub](https://img.shields.io/github/stars/Vitoan/his?style=social)](https://github.com/Vitoan/his)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## 📋 Índice
- [🏥 Sistema Hospitalario - Módulo de Admisión y Recepción de Pacientes](#-sistema-hospitalario---módulo-de-admisión-y-recepción-de-pacientes)
  - [📋 Índice](#-índice)
  - [📖 Descripción](#-descripción)
  - [✨ Características](#-características)
  - [🛠️ Arquitectura y Tecnologías](#️-arquitectura-y-tecnologías)
  - [🗄️ Estructura de la Base de Datos](#️-estructura-de-la-base-de-datos)
  - [📋 Requisitos de Entrega](#-requisitos-de-entrega)
  - [💻 Instalación y Ejecución Local](#-instalación-y-ejecución-local)
    - [Prerrequisitos](#prerrequisitos)
    - [Pasos](#pasos)
  - [🐛 Solución de Problemas](#-solución-de-problemas)
  - [🤝 Contribuciones](#-contribuciones)
  - [📬 Contacto](#-contacto)

---

## 📖 Descripción

El **Sistema Hospitalario HIS** implementa un módulo de **Admisión y Recepción de Pacientes** para gestionar el ingreso de pacientes en un centro médico. Este módulo permite registrar y actualizar información de pacientes, asignar camas automáticamente según disponibilidad y compatibilidad de sexo, y mantener un registro de internaciones. Desarrollado con un stack tecnológico moderno, el proyecto sigue estándares de programación web y buenas prácticas,  y una experiencia de usuario intuitiva.

El objetivo es optimizar la gestión hospitalaria, reduciendo errores en la asignación de camas y mejorando la eficiencia en el proceso de admisión.

---

## ✨ Características

- **Flujo Completo de Admisión**:
  - 📝 **Registro de Pacientes**: Captura datos personales (DNI, nombre, apellido, fecha de nacimiento, sexo, dirección, contacto) y médicos (grupo sanguíneo, alergias, antecedentes, motivo de internación).
  - 🔄 **Actualización de Pacientes**: Actualiza datos de pacientes existentes al ingresar un DNI registrado.
  - 🛏️ **Asignación Inteligente de Camas**:
    - Busca camas libres e higienizadas.
    - Soporta habitaciones individuales y dobles.
    - Valida compatibilidad de sexo en habitaciones dobles (evita mezclar sexos diferentes).
  - 📋 **Registro de Internación**: Asocia pacientes con camas y registra la fecha de ingreso.
  - ❌ **Cancelación de Internación**: Da de alta a pacientes, actualizando el estado de la cama a "higienización pendiente".
- **Gestión de Camas**:
  - Vista de disponibilidad de camas (ruta `/admission/camas`).
  - Seguimiento de estados: libre, ocupada, mantenimiento, higienización pendiente.
- **Manejo de Errores**:
  - Notificaciones para el usuario (por ejemplo, "No hay camas disponibles").
  - Páginas de error personalizadas para 404 y 500.
- **Interfaz Responsiva**:
  - Diseñada con Tailwind CSS (vía CDN) para una experiencia moderna y adaptable.

---

## 🛠️ Arquitectura y Tecnologías

| Componente         | Tecnología                     |
|--------------------|--------------------------------|
| **Backend**        | Node.js, Express               |
| **Frontend**       | Pug (motor de plantillas)      |
| **Base de Datos**  | MySQL (con Sequelize ORM)      |
| **Estilos**        | Tailwind CSS (vía CDN)         |
| **Configuración**  | dotenv para variables de entorno |
| **Despliegue**     | Clever Cloud                   |

- **Calidad del Código**:
  - Modularidad: Rutas, controladores, y modelos separados.
  - Uso de `async/await` para operaciones asíncronas.
  - Transacciones en base de datos para garantizar integridad.
  - Nomenclatura clara y en español.

---

## 🗄️ Estructura de la Base de Datos

La base de datos `his_db` se define en `db.sql` y consta de las siguientes tablas:

| Tabla                 | Descripción                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| `pacientes`           | Almacena información personal y médica de los pacientes.                    |
| `alas`                | Registra las alas del hospital (por ejemplo, Ala A, Ala B).                 |
| `habitaciones`        | Contiene datos de habitaciones, asociadas a un ala.                         |
| `camas`               | Gestiona camas por habitación, con estados y ocupantes.                     |
| `pacientes_internados`| Registra internaciones, asociando pacientes con camas y fechas de ingreso/alta. |

- **Script SQL**: `db.sql` crea las tablas con claves primarias, índices, restricciones de integridad referencial, y datos de ejemplo (alas, habitaciones, camas).
- **Normalización**: Cumple con la tercera forma normal (3FN).
- **Sequelize**: Modelos definidos para interactuar con las tablas.

**Esquema Simplificado**:
```sql
CREATE DATABASE IF NOT EXISTS his_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE his_db;

CREATE TABLE pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo ENUM('M', 'F', 'Otro') NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100),
    grupo_sanguineo VARCHAR(5),
    alergias TEXT,
    antecedentes_medicos TEXT,
    motivo_internacion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alas (
    id_ala INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ala VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE habitaciones (
    id_habitacion INT AUTO_INCREMENT PRIMARY KEY,
    numero_habitacion VARCHAR(10) UNIQUE NOT NULL,
    id_ala INT NOT NULL,
    tipo_habitacion ENUM('individual', 'doble') NOT NULL,
    FOREIGN KEY (id_ala) REFERENCES alas(id_ala)
);

CREATE TABLE camas (
    id_cama INT AUTO_INCREMENT PRIMARY KEY,
    id_habitacion INT NOT NULL,
    numero_cama INT NOT NULL,
    estado ENUM('libre', 'ocupada', 'mantenimiento', 'higienizacion_pendiente') NOT NULL DEFAULT 'libre',
    higienizada BOOLEAN NOT NULL DEFAULT TRUE,
    id_paciente_ocupante INT UNIQUE NULL,
    CONSTRAINT UQ_habitacion_numero_cama UNIQUE (id_habitacion, numero_cama),
    FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion),
    FOREIGN KEY (id_paciente_ocupante) REFERENCES pacientes(id_paciente) ON DELETE SET NULL
);

CREATE TABLE pacientes_internados (
    id_internacion INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_cama INT NOT NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_alta DATETIME NULL,
    estado ENUM('internado', 'alta_pendiente', 'dado_de_alta') NOT NULL DEFAULT 'internado',
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_cama) REFERENCES camas(id_cama)
);
```

---

## 📋 Requisitos de Entrega

| Requisito                          | Estado       | Detalle                                                                 |
|------------------------------------|--------------|-------------------------------------------------------------------------|
| Repositorio GitHub                | ✅ Completado | [https://github.com/Vitoan/his](https://github.com/Vitoan/his)          |
| URL de Despliegue                 | ⏳ Pendiente  | `[URL]/admission`  |
| Video de Demostración             | ⏳ Pendiente  | `[URL_YOUTUBE_O_DRIVE]` (máximo 7 minutos)                              |
| README.md                         | ✅ Completado | Este archivo                                                    |
| Endpoint Funcional                | ✅ Completado | Rutas: `/`, `/admission`, `/admission/list`, `/admission/new`, `/admission/:id`, `/admission/camas` |
| Funcionalidad de Admisión         | ✅ Completado | Registro, actualización, asignación de camas, y cancelación            |
| Interfaz de Usuario               | ✅ Completado | Responsiva con Tailwind CSS                                            |
| Script SQL                        | ✅ Completado | `db.sql` con tablas y datos de ejemplo                                 |
| Normalización de BD (3FN)         | ✅ Completado | Ver `db.sql` para claves, índices, e integridad referencial            |

---

## 💻 Instalación y Ejecución Local

### Prerrequisitos
- **Node.js**: Versión 16 o superior ([descargar](https://nodejs.org)).
- **MySQL**: Servidor instalado y en ejecución ([descargar](https://dev.mysql.com/downloads/)).
- **Git**: Para clonar el repositorio ([descargar](https://git-scm.com)).

### Pasos
1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/Vitoan/his.git
   cd his
   ```

2. **Instalar Dependencias**:
   ```bash
   npm install
   npm install dotenv --save
   ```

3. **Configurar la Base de Datos**:
   - Crea la base de datos:
     ```sql
     CREATE DATABASE his_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```
   - Importa `db.sql`:
     ```bash
     mysql -u root -p his_db < db.sql
     ```
     Reemplaza `root` con tu usuario MySQL y proporciona la contraseña.

4. **Configurar Variables de Entorno**:
   - Crea un archivo `.env` en la raíz:
     ```env
     DATABASE_HOST=localhost
     DATABASE_USER=root
     DATABASE_PASSWORD=tu_contraseña
     DATABASE_NAME=his_db
     DATABASE_PORT=3306
     PORT=3000
     ```

5. **Iniciar la Aplicación**:
   ```bash
   npm start
   ```
   Accede a `http://localhost:3000`.

6. **Rutas Disponibles**:
   - Bienvenida: `http://localhost:3000`
   - Admisión: `http://localhost:3000/admission`
   - Lista de Pacientes: `http://localhost:3000/admission/list`
   - Registrar Paciente: `http://localhost:3000/admission/new`
   - Disponibilidad de Camas: `http://localhost:3000/admission/camas`

---

## 🐛 Solución de Problemas

| Problema | Solución |
|----------|----------|
| **Error: Access denied for user** | Verifica `DATABASE_PASSWORD` en `.env`. Cambia autenticación: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña';`. |
| **Error: Cannot find module** | Ajusta rutas en `require()` (por ejemplo, `./routes/admission`). |
| **Errores de Pug (Unexpected token)** | Usa `class=['clase1', 'clase2']` para Tailwind. Asegúrate de que `extends layout.pug` sea la primera línea. |
| **Tabla no encontrada** | Importa `db.sql` correctamente. Verifica `DATABASE_NAME`. |

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Pasos:
1. Haz un fork del repositorio.
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`.
3. Haz commit: `git commit -m "Añadida nueva funcionalidad"`.
4. Envía un pull request.


---

## 📬 Contacto

- **Correo**: [vitoan@proton.me]
- **GitHub**: [Vitoan](https://github.com/Vitoan)



