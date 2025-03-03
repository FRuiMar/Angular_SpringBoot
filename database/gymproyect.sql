-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-03-2025 a las 19:00:03
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

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
(5, '54545454a', 'Fortachon', 'McGee', 'Salsa y Merengue', 'asdfasdfasdfasdaf');

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
(5, 'Mensual Mañana', 20, 1);

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
(12, 18, 2, '2026-02-26 18:50:12');

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
(1, '11111111A', 'Fran', 'Ruiz', 'franruiz81@gmail.com', '1234', 'ADMIN', NULL, 1),
(2, '22222222A', 'Pepe', 'Ruiz', 'pepe@pepe.com', '1234', 'NORMAL', NULL, 1),
(3, '11111113A', 'Fran', 'Torquemada', 'fran@fran.es', '$2a$10$IK1Ta3tPjahI/iqswnoFL.FQtkabJbj1ooeqzBNMiXgWQ8l1zyiA2', 'ADMIN', NULL, 3),
(7, '11111199Z', 'eeeesssaasfasdf', 'eeeeasdfasee', 'c@sdsdfsdfsc.es', '$2a$10$yVS6qftP32qG3h2/Pyg8kuoLUl3wvS.C3AquOYXaRU5CMLkeXhVDa', 'NORMAL', NULL, 3),
(11, '12341234a', 'fras', 'fras', 'f@f.es', '$2a$10$Yt7a4kogWN9KTqeJgAJuiOPavP92ww40E0aIHlLj/nN6UYZ2PGxqu', 'NORMAL', '', 1),
(14, '1194994A', 'Aaaaaaaaaa', 'Naaaaaaaaaaa', 'Coaaaaa@conaaaaaaa.es', '$2a$10$DsIaY97T9SNIWwbQFUEbU.lpZ.l7uzmDNneAKk96M.V2iRvDHLSAC', 'NORMAL', NULL, 5),
(15, '12344321a', 'Fran', 'Ruiz', 'f@f.com', '$2a$10$.k6VJsRFWqwLrj3W3oSEpe9NkKp9MS0npp4d9lSS36clZHweLjps6', 'NORMAL', '', 1),
(18, '2292344A', 'frrraaaan', 'Nabnosor32aaaffffff', 'f2@f.com', '$2a$10$paRU31joYUU3bnXFghr4jeCCgDFhzSRQU0SZpJnb6qYZpaXnYlwdK', 'ADMIN', NULL, 1),
(19, '43211234A', 'Julito', 'Iglesias', 'j@j.com', '$2a$10$po85KyEnoQFyBJ0ZERK.iuVfoQBoIMD4uLm3Gc07PzcsQnOz7Bvme', 'NORMAL', '', 2),
(20, '43144332a', 'bbddddddddddddddddddddddbb', 'bbbbb111111111bbbbb', 'a@a.es', '$2a$10$xapHg24AsZy88Xf1B6aBmOO.62h1zJk5B6O8sek9ULHITcRfNVv6W', 'NORMAL', NULL, 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `entrenadores`
--
ALTER TABLE `entrenadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `membresias`
--
ALTER TABLE `membresias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
