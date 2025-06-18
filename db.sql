SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for alas
-- ----------------------------
DROP TABLE IF EXISTS `alas`;
CREATE TABLE `alas` (
  `id_ala` int NOT NULL AUTO_INCREMENT,
  `nombre_ala` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_ala`) USING BTREE,
  UNIQUE INDEX `nombre_ala`(`nombre_ala` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of alas
-- ----------------------------
INSERT INTO `alas` VALUES (1, 'Ala A');
INSERT INTO `alas` VALUES (2, 'Ala B');

-- ----------------------------
-- Table structure for camas
-- ----------------------------
DROP TABLE IF EXISTS `camas`;
CREATE TABLE `camas` (
  `id_cama` int NOT NULL AUTO_INCREMENT,
  `id_habitacion` int NOT NULL,
  `numero_cama` int NOT NULL,
  `estado` enum('libre','ocupada','mantenimiento','higienizacion_pendiente') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'libre',
  `higienizada` tinyint(1) NOT NULL DEFAULT 1,
  `id_paciente_ocupante` int NULL DEFAULT NULL,
  PRIMARY KEY (`id_cama`) USING BTREE,
  UNIQUE INDEX `UQ_habitacion_numero_cama`(`id_habitacion` ASC, `numero_cama` ASC) USING BTREE,
  -- ¡LA SIGUIENTE LÍNEA HA SIDO REMOVIDA PARA SOLUCIONAR EL ERROR DE CLAVE DUPLICADA!
  -- UNIQUE INDEX `id_paciente_ocupante`(`id_paciente_ocupante` ASC) USING BTREE,
  CONSTRAINT `camas_ibfk_1` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `camas_ibfk_2` FOREIGN KEY (`id_paciente_ocupante`) REFERENCES `pacientes` (`id_paciente`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of camas (Se usarán los datos de prueba del otro Canvas)
-- Se recomienda usar el script de datos de prueba para poblar las camas después de crear el esquema
-- o asegurarse de que tu db.sql final contiene los datos deseados.
-- Estos son ejemplos por si no usas el script de datos de prueba:
INSERT INTO `camas` VALUES (1, 1, 1, 'ocupada', 1, 1);
INSERT INTO `camas` VALUES (2, 2, 1, 'libre', 1, NULL);
INSERT INTO `camas` VALUES (3, 2, 2, 'libre', 1, NULL);
INSERT INTO `camas` VALUES (4, 3, 1, 'higienizacion_pendiente', 0, NULL);
INSERT INTO `camas` VALUES (5, 4, 1, 'libre', 1, NULL);
INSERT INTO `camas` VALUES (6, 5, 1, 'libre', 1, NULL);
INSERT INTO `camas` VALUES (7, 5, 2, 'libre', 1, NULL);


-- ----------------------------
-- Table structure for habitaciones
-- ----------------------------
DROP TABLE IF EXISTS `habitaciones`;
CREATE TABLE `habitaciones` (
  `id_habitacion` int NOT NULL AUTO_INCREMENT,
  `numero_habitacion` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_ala` int NOT NULL,
  `tipo_habitacion` enum('individual','doble') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_habitacion`) USING BTREE,
  UNIQUE INDEX `numero_habitacion`(`numero_habitacion` ASC) USING BTREE,
  INDEX `id_ala`(`id_ala` ASC) USING BTREE,
  CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`id_ala`) REFERENCES `alas` (`id_ala`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of habitaciones
-- ----------------------------
INSERT INTO `habitaciones` VALUES (1, '101', 1, 'individual');
INSERT INTO `habitaciones` VALUES (2, '102', 1, 'doble');
INSERT INTO `habitaciones` VALUES (3, '103', 1, 'individual');
INSERT INTO `habitaciones` VALUES (4, '201', 2, 'individual');
INSERT INTO `habitaciones` VALUES (5, '202', 2, 'doble');

-- ----------------------------
-- Table structure for pacientes
-- ----------------------------
DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE `pacientes` (
  `id_paciente` int NOT NULL AUTO_INCREMENT,
  `dni` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` enum('M','F','Otro') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `direccion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `grupo_sanguineo` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `alergias` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `antecedentes_medicos` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `motivo_internacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_paciente`) USING BTREE,
  UNIQUE INDEX `dni`(`dni` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pacientes (Se usarán los datos de prueba del otro Canvas)
-- Estos son ejemplos por si no usas el script de datos de prueba:
INSERT INTO `pacientes` VALUES (1, '36220045', 'Victor', 'Aguilera', '1992-02-15', 'M', 'Juan de garay 1349', '3544660382', 'vitoan@proton.me', 'o+', 'penisilina', 'sobrepeso', 'estres', '2025-06-17 22:57:06');

-- ----------------------------
-- Table structure for pacientes_internados
-- ----------------------------
DROP TABLE IF EXISTS `pacientes_internados`;
CREATE TABLE `pacientes_internados` (
  `id_internacion` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_cama` int NOT NULL,
  `fecha_ingreso` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_alta` datetime NULL DEFAULT NULL,
  `estado` enum('internado','alta_pendiente','dado_de_alta') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'internado',
  PRIMARY KEY (`id_internacion`) USING BTREE,
  INDEX `id_paciente`(`id_paciente` ASC) USING BTREE,
  INDEX `id_cama`(`id_cama` ASC) USING BTREE,
  CONSTRAINT `pacientes_internados_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `pacientes_internados_ibfk_2` FOREIGN KEY (`id_cama`) REFERENCES `camas` (`id_cama`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pacientes_internados (Se usarán los datos de prueba del otro Canvas)
-- Estos son ejemplos por si no usas el script de datos de prueba:
INSERT INTO `pacientes_internados` VALUES (1, 1, 1, '2025-06-17 22:57:07', NULL, 'internado');

SET FOREIGN_KEY_CHECKS = 1;