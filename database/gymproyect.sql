-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-03-2025 a las 03:31:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;



DROP DATABASE IF EXISTS `gymproyect`;

CREATE DATABASE `gymproyect`;

USE `gymproyect`;



--
-- Base de datos: `gymproyect`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clases`
--

CREATE TABLE `clases` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `horario` datetime NOT NULL,
  `capacidad_maxima` int(11) NOT NULL,
  `entrenador_id` int(11) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clases`
--

INSERT INTO `clases` (`id`, `nombre`, `horario`, `capacidad_maxima`, `entrenador_id`, `imagen`) VALUES
(1, 'Zumba', '2025-02-22 15:26:32', 30, 1, 'asdfasdfasdf'),
(2, 'Yoga', '2025-02-22 11:29:17', 20, 1, 'asfdjñlkasjñasd'),
(5, 'Crossfit', '2025-02-24 12:29:17', 15, 5, 'ddd'),
(10, 'HIIT', '2025-02-28 22:42:00', 354, 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrenadores`
--

CREATE TABLE `entrenadores` (
  `id` int(11) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `especialidad` varchar(100) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entrenadores`
--

INSERT INTO `entrenadores` (`id`, `dni`, `nombre`, `apellido`, `especialidad`, `imagen`) VALUES
(1, '12312312A', 'Pepe1', 'meeeh', 'Zumba y Yoga', 'asfdas'),
(2, '12341234A', 'Javi', 'Fortote', 'PowerGym y Pilates', 'asfdasfdadsfwer'),
(3, '33333333', 'probando----ID', 'probandoPor--ID', 'HacerCroquetas', 'prob.ID'),
(5, '54545454a', 'Fortachon', 'McGee', 'Salsa y Merengue', 'asdfasdfasdfasdaf'),
(7, '65432987d', 'asdf', 'asdf', 'asdf', 'asdf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `membresias`
--

CREATE TABLE `membresias` (
  `id` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `precio` float NOT NULL,
  `duracion_meses` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `membresias`
--

INSERT INTO `membresias` (`id`, `tipo`, `precio`, `duracion_meses`) VALUES
(1, 'Mensual', 45, 1),
(2, 'Trimestral', 120, 3),
(3, 'Anual', 450, 12),
(4, 'Mensual Tarde', 25, 1),
(5, 'Mensual Mañana', 20, 1),
(12, 'prueba 48', 11111200000, 153);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `clase_id` int(11) DEFAULT NULL,
  `fecha_reserva` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `usuario_id`, `clase_id`, `fecha_reserva`) VALUES
(1, 1, 1, '2025-02-26 19:50:12'),
(2, 3, 5, '2025-02-28 19:51:46'),
(3, 1, 5, '2025-02-28 16:13:55'),
(9, 18, 10, '2026-02-26 18:50:12'),
(10, 18, 5, '2026-02-26 18:50:12'),
(11, 18, 1, '2026-02-26 18:50:12'),
(12, 18, 2, '2026-02-26 18:50:12'),
(13, 15, 2, '2025-03-06 10:01:03'),
(14, 15, 5, '2025-03-06 10:01:03'),
(15, 15, 5, '2025-03-06 10:01:19'),
(16, 15, 10, '2025-03-06 10:01:19'),
(17, 2, 5, '2025-03-06 11:06:18'),
(18, 2, 10, '2025-03-06 11:06:18'),
(19, 2, 2, '2025-03-06 11:06:34'),
(25, 15, 10, '2025-03-06 12:33:02'),
(26, 15, 2, '2025-03-06 12:33:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('NORMAL','ADMIN') NOT NULL DEFAULT 'NORMAL',
  `imagen` varchar(255) DEFAULT NULL,
  `membresia_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `dni`, `nombre`, `apellido`, `email`, `contrasena`, `rol`, `imagen`, `membresia_id`) VALUES
(1, '11111111A', 'Fran', 'Ruiz', 'f3@f.com', '$2a$10$.k6VJsRFWqwLrj3W3oSEpe9NkKp9MS0npp4d9lSS36clZHweLjps6', 'NORMAL', NULL, 1),
(2, '22222222A', 'Pepe', 'Rambo', 'f2@f.com', '$2a$10$.k6VJsRFWqwLrj3W3oSEpe9NkKp9MS0npp4d9lSS36clZHweLjps6', 'NORMAL', NULL, 2),
(3, '11111113A', 'Fran', 'Torquemada', 'fran@fran.es', '$2a$10$IK1Ta3tPjahI/iqswnoFL.FQtkabJbj1ooeqzBNMiXgWQ8l1zyiA2', 'ADMIN', NULL, 3),
(7, '11111199Z', 'eeeesssaasfasdf', 'eeeeasdfasee', 'c@sdsdfsdfsc.es', '$2a$10$yVS6qftP32qG3h2/Pyg8kuoLUl3wvS.C3AquOYXaRU5CMLkeXhVDa', 'NORMAL', NULL, 3),
(11, '12341234a', 'fras', 'fras', 'f@f.com', '$2a$10$Yt7a4kogWN9KTqeJgAJuiOPavP92ww40E0aIHlLj/nN6UYZ2PGxqu', 'ADMIN', '', 1),
(14, '1194994A', 'Aaaaaaaaaa', 'Naaaaaaaaaaa', 'Coaaaaa@conaaaaaaa.es', '$2a$10$DsIaY97T9SNIWwbQFUEbU.lpZ.l7uzmDNneAKk96M.V2iRvDHLSAC', 'NORMAL', NULL, 5),
(15, '12344321a', 'User', 'Ruiz', 'user@user.com', '$2a$10$.k6VJsRFWqwLrj3W3oSEpe9NkKp9MS0npp4d9lSS36clZHweLjps6', 'NORMAL', '', 1),
(18, '2292344A', 'Admin', 'Nabnosor32aaaffffff', 'admin@admin.com', '$2a$10$paRU31joYUU3bnXFghr4jeCCgDFhzSRQU0SZpJnb6qYZpaXnYlwdK', 'ADMIN', NULL, 1),
(19, '43211234A', 'Julito', 'Iglesias', 'j@j.com', '$2a$10$po85KyEnoQFyBJ0ZERK.iuVfoQBoIMD4uLm3Gc07PzcsQnOz7Bvme', 'NORMAL', '', 2),
(27, '65748392a', 'fff', 'fff', 'fff@fff.com', '$2a$10$yyKNeec/NhtlsnAxzZRtKutMDuC5TUR6nnBKO4ZeTlrr5knDB38Ca', 'NORMAL', '/uploads/20250306_163333_65748392a.jpg', 3),
(28, '12348744a', 'prueba', 'prueba', 'prueba@p.com', '$2a$10$MRlOcnSqY7OtZw.1bYrkP.ow//fImbZpvf6MJBqISvlFiC43KA.La', 'NORMAL', '/uploads/20250306_173411_12348744a.jpg', 3),
(29, '93348573a', 'qwer', 'qwer', 'asd@asd.com', '$2a$10$nPOt.eWkkZUh7kAlajndS.tvA0aDMbG1Iya0RZ/PsdcS1P2fwYkWa', 'NORMAL', '/uploads/20250306_175322_93348573a.jpg', 2),
(30, '67679394z', 'Pepito', 'Mítico', 'pepito@pepito.com', '$2a$10$5Wq/lLPkpIgnAXxKukZJqONp7kHxN8NGqleu4faC1Qor9kn0jY4aO', 'NORMAL', '/uploads/20250306_175841_67679394z.jpg', 3),
(31, '80804200z', 'Sergio', 'Sanchez', 'ss@ss.com', '$2a$10$FDTW0/3CMSYKclio2690BO4kgS69TDVHV3dzMge4B7kPtkdDRr2RW', 'NORMAL', '/uploads/20250306_180450_80804200z.jpg', 3),
(32, '78943265a', 'zxcv', 'qwer', 'adf@adf.com', '$2a$10$IdA5WmkjH0KDKr.sBDfGYOfD0fJDlf5HKV0CuxVuLzoGRBxpBpI8C', 'NORMAL', '/uploads/20250306_180626_78943265a.jpg', 1),
(33, '12365485a', 'gfdssgsdfgsdgs', 'sgdfgsdfgsdfgsdfgsdfg', 'uuu@uuu.com', '$2a$10$eNHc9J25jGYLtIF5Mm1e8.CKJHXy4vbPHSiNgId7G.GC7EE948bvC', 'NORMAL', '/uploads/20250306_225505_12365485a.jpg', 2),
(34, '78755421a', 'ddaa', 'ddaa', 'ddaa@ddaa.com', '$2a$10$8F1GpOo5AgjJ0XYNDlfC9erMfQ7Bu0rxAu.yIkjc.VCR51o5UDjTq', 'NORMAL', '/uploads/20250306_230102_78755421a.jpg', 2),
(35, '93476512y', 'Curro', 'Jimenez', 'cc@jj.com', '$2a$10$RR4SO2IPExGJjB7j6XaLQ.A/a/lgFCpipg3j53pNf5DnYEPvYZpuq', 'NORMAL', '/uploads/20250306_233702_93476512y.jpg', 4),
(37, '45546556l', 'probando3434', 'probando3434', 'probando3434@probando3434.com', '$2a$10$icyeKvpQ7hFzMt3MJ1AieeuEJGyC7cxzpyAtDC3EQr0zi9pw/X2lm', 'NORMAL', '/uploads/20250307_031019_45546556l.jpg', 12);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clases`
--
ALTER TABLE `clases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entrenador_id` (`entrenador_id`);

--
-- Indices de la tabla `entrenadores`
--
ALTER TABLE `entrenadores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `membresias`
--
ALTER TABLE `membresias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `clase_id` (`clase_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `membresia_id` (`membresia_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clases`
--
ALTER TABLE `clases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `entrenadores`
--
ALTER TABLE `entrenadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `membresias`
--
ALTER TABLE `membresias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clases`
--
ALTER TABLE `clases`
  ADD CONSTRAINT `clases_ibfk_1` FOREIGN KEY (`entrenador_id`) REFERENCES `entrenadores` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`clase_id`) REFERENCES `clases` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`membresia_id`) REFERENCES `membresias` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
