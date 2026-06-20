CREATE DATABASE IF NOT EXISTS ecoride
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ecoride;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS ride;
DROP TABLE IF EXISTS car;
DROP TABLE IF EXISTS `user`;

SET FOREIGN_KEY_CHECKS = 1;

-- Table des utilisateurs
-- Les roles sont stockes en JSON pour correspondre a Symfony Security.
CREATE TABLE `user` (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    email VARCHAR(180) NOT NULL,
    roles JSON NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    birthdate DATE,
    profile_image VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user PRIMARY KEY (id),
    CONSTRAINT uq_user_email UNIQUE (email),
    CONSTRAINT uq_user_nickname UNIQUE (nickname)
) ENGINE=InnoDB;

-- Table des vehicules
CREATE TABLE car (
    id INT AUTO_INCREMENT NOT NULL,
    owner_id INT NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    color VARCHAR(30),
    fuel_type VARCHAR(30) NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    seats INT NOT NULL,
    CONSTRAINT pk_car PRIMARY KEY (id),
    CONSTRAINT uq_car_license_plate UNIQUE (license_plate),
    CONSTRAINT fk_car_owner FOREIGN KEY (owner_id) REFERENCES `user` (id)
) ENGINE=InnoDB;

-- Table des trajets proposes par les conducteurs
CREATE TABLE ride (
    id INT AUTO_INCREMENT NOT NULL,
    driver_id INT NOT NULL,
    car_id INT NOT NULL,
    departure_location VARCHAR(100) NOT NULL,
    departure_at DATETIME NOT NULL,
    arrival_location VARCHAR(100) NOT NULL,
    arrival_at DATETIME NOT NULL,
    places_available INT NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_ride PRIMARY KEY (id),
    CONSTRAINT fk_ride_driver FOREIGN KEY (driver_id) REFERENCES `user` (id),
    CONSTRAINT fk_ride_car FOREIGN KEY (car_id) REFERENCES car (id)
) ENGINE=InnoDB;

-- Table des reservations effectuees par les passagers
CREATE TABLE booking (
    id INT AUTO_INCREMENT NOT NULL,
    ride_id INT NOT NULL,
    passenger_id INT NOT NULL,
    places_booked INT NOT NULL,
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    price_total DECIMAL(6,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    CONSTRAINT pk_booking PRIMARY KEY (id),
    CONSTRAINT fk_booking_ride FOREIGN KEY (ride_id) REFERENCES ride (id),
    CONSTRAINT fk_booking_passenger FOREIGN KEY (passenger_id) REFERENCES `user` (id)
) ENGINE=InnoDB;

-- Les avis clients et les messages de chat ne sont pas dans MySQL.
-- Ils sont stockes dans MongoDB avec les collections reviews et messages.
