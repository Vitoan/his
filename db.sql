-- db.sql
-- Creación de la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS his_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE his_db;

-- Tabla para almacenar información de los pacientes
CREATE TABLE IF NOT EXISTS pacientes (
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

-- Tabla para las alas del hospital (Ej: Ala A, Ala B)
CREATE TABLE IF NOT EXISTS alas (
    id_ala INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ala VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla para las habitaciones (relacionadas con las alas)
CREATE TABLE IF NOT EXISTS habitaciones (
    id_habitacion INT AUTO_INCREMENT PRIMARY KEY,
    numero_habitacion VARCHAR(10) UNIQUE NOT NULL,
    id_ala INT NOT NULL,
    tipo_habitacion ENUM('individual', 'doble') NOT NULL,
    FOREIGN KEY (id_ala) REFERENCES alas(id_ala)
);

-- Tabla para las camas (relacionadas con las habitaciones)
CREATE TABLE IF NOT EXISTS camas (
    id_cama INT AUTO_INCREMENT PRIMARY KEY,
    id_habitacion INT NOT NULL,
    numero_cama INT NOT NULL, -- Ej: 1 para cama 1, 2 para cama 2 en doble
    estado ENUM('libre', 'ocupada', 'mantenimiento', 'higienizacion_pendiente') NOT NULL DEFAULT 'libre',
    higienizada BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE si está limpia y lista para usar
    id_paciente_ocupante INT UNIQUE NULL, -- Referencia al paciente actualmente en la cama
    CONSTRAINT UQ_habitacion_numero_cama UNIQUE (id_habitacion, numero_cama),
    FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion),
    FOREIGN KEY (id_paciente_ocupante) REFERENCES pacientes(id_paciente) ON DELETE SET NULL
);

-- Tabla para registrar las internaciones de los pacientes
CREATE TABLE IF NOT EXISTS pacientes_internados (
    id_internacion INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_cama INT NOT NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_alta DATETIME NULL,
    estado ENUM('internado', 'alta_pendiente', 'dado_de_alta') NOT NULL DEFAULT 'internado',
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_cama) REFERENCES camas(id_cama)
);

-- Datos de ejemplo (¡Importante para la prueba!)
INSERT IGNORE INTO alas (nombre_ala) VALUES ('Ala A'), ('Ala B');

-- Insertar habitaciones y camas con verificación IGNORE para evitar duplicados si se ejecuta varias veces
INSERT IGNORE INTO habitaciones (numero_habitacion, id_ala, tipo_habitacion) VALUES
('101', (SELECT id_ala FROM alas WHERE nombre_ala = 'Ala A'), 'individual'),
('102', (SELECT id_ala FROM alas WHERE nombre_ala = 'Ala A'), 'doble'),
('103', (SELECT id_ala FROM alas WHERE nombre_ala = 'Ala A'), 'individual'),
('201', (SELECT id_ala FROM alas WHERE nombre_ala = 'Ala B'), 'individual'),
('202', (SELECT id_ala FROM alas WHERE nombre_ala = 'Ala B'), 'doble');

-- Insertar camas. Asume que las habitaciones ya existen.
-- Si hay un error de clave foránea al insertar camas, asegúrate de que las habitaciones se hayan insertado primero.
INSERT IGNORE INTO camas (id_habitacion, numero_cama, estado, higienizada) VALUES
((SELECT id_habitacion FROM habitaciones WHERE numero_habitacion = '101'), 1, 'libre', TRUE),
((SELECT id_habitacion FROM habitaciones WHERE numero_habitacion = '102'), 1, 'libre', TRUE),
((SELECT id_habitacion FROM habitaciones WHERE numero_habitacion = '102'), 2, 'libre', TRUE),
((SELECT id_habitacion FROM habitaciones WHERE numero_habitacion = '103'), 1, 'higienizacion_pendiente', FALSE), -- Cama no higienizada para prueba
((SELECT id_habitacion FROM habitaciones WHERE numero_habitacion = '201'), 1, 'libre', TRUE),
((SELECT id_habitacion FROM habitaciones WHERE numero_habitacion = '202'), 1, 'libre', TRUE),
((SELECT id_habitacion FROM habitaciones WHERE numero_habitacion = '202'), 2, 'libre', TRUE);

