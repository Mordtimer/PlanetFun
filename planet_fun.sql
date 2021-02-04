-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 04 Lut 2021, 00:08
-- Wersja serwera: 10.4.17-MariaDB
-- Wersja PHP: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `planet_fun`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `planet`
--

CREATE TABLE `planet` (
  `id` int(11) NOT NULL,
  `planetary_system_id` int(11) NOT NULL,
  `position_x` float NOT NULL,
  `position_y` float NOT NULL,
  `velocity_x` float NOT NULL,
  `velocity_y` float NOT NULL,
  `mass` float NOT NULL,
  `radius` float NOT NULL,
  `color` varchar(20) NOT NULL,
  `gravity_const` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `planetary_system`
--

CREATE TABLE `planetary_system` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `planet`
--
ALTER TABLE `planet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `planetary_system_id` (`planetary_system_id`);

--
-- Indeksy dla tabeli `planetary_system`
--
ALTER TABLE `planetary_system`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `planet`
--
ALTER TABLE `planet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `planetary_system`
--
ALTER TABLE `planetary_system`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `planet`
--
ALTER TABLE `planet`
  ADD CONSTRAINT `planet_ibfk_1` FOREIGN KEY (`planetary_system_id`) REFERENCES `planetary_system` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
