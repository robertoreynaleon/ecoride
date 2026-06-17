CREATE DATABASE IF NOT EXISTS ecoride;
 CHARACTER SET utf8mb4
 COLLATE utf8mb4_general_ci;
USE ecoride;

-- Table des rôles
CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_role PRIMARY KEY(id),
    CONSTRAINT uq_role_name UNIQUE(role_name)
) ENGINE=InnoDB;

INSERT INTO role (role_name) VALUES ('admin');
INSERT INTO role (role_name) VALUES ('passenger');
INSERT INTO role (role_name) VALUES ('driver');

-- Table des utilisateurs
CREATE TABLE user (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(50),
    birthdate DATE,
    profile_image VARCHAR(255),
    CONSTRAINT pk_user PRIMARY KEY(id),
    CONSTRAINT uq_nickname UNIQUE(nickname),
    CONSTRAINT uq_email UNIQUE(email)
) ENGINE=InnoDB;

CREATE TABLE user_role (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
) ENGINE=InnoDB;

-- Table des véhicules
CREATE TABLE car (
    id INT AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(30),
    fuel_type VARCHAR(30),
    license_plate VARCHAR(15) UNIQUE,
    seats INT NOT NULL,
    CONSTRAINT pk_car PRIMARY KEY(id),
    CONSTRAINT uq_license_plate UNIQUE(license_plate),
    CONSTRAINT fk_car_user FOREIGN KEY(user_id) REFERENCES user(id)
) ENGINE=InnoDB;

-- Table des préférences conducteur
-- CREATE TABLE driver_preferences (
--     id INT AUTO_INCREMENT NOT NULL,
--     user_id INT NOT NULL,
--     music BOOLEAN,
--     animals BOOLEAN,
--     smoker BOOLEAN,
--     discussion BOOLEAN,
--     air_conditioning BOOLEAN,
--     pause_time BOOLEAN,
--     luggage BOOLEAN,
--     food BOOLEAN,
--     CONSTRAINT pk_driver_preferences PRIMARY KEY(id),
--     CONSTRAINT fk_driver_preferences_user FOREIGN KEY(user_id) REFERENCES user(id)
-- ) ENGINE=InnoDB;

-- Table des trajets
CREATE TABLE ride (
    id INT AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    departure_location VARCHAR(100) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_location VARCHAR(100) NOT NULL,
    arrival_time TIME NOT NULL,
    places_available INT NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    description TEXT,
    CONSTRAINT pk_ride PRIMARY KEY(id),
    CONSTRAINT fk_ride_user FOREIGN KEY(user_id) REFERENCES user(id),
    CONSTRAINT fk_ride_car FOREIGN KEY(car_id) REFERENCES car(id)
) ENGINE=InnoDB;

-- Table des réservations
CREATE TABLE booking (
    id INT AUTO_INCREMENT NOT NULL,
    ride_id INT NOT NULL,
    user_id INT NOT NULL,
    places_booked INT NOT NULL,
    booking_date DATETIME NOT NULL,
    price_total DECIMAL(6,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    CONSTRAINT pk_booking PRIMARY KEY(id),
    CONSTRAINT fk_booking_ride FOREIGN KEY(ride_id) REFERENCES ride(id),
    CONSTRAINT fk_booking_user FOREIGN KEY(user_id) REFERENCES user(id)
) ENGINE=InnoDB;

-- Table des messages
-- CREATE TABLE message (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id_sender INT NOT NULL,
--     user_id_receiver INT NOT NULL,
--     content TEXT NOT NULL,
--     date_sent DATETIME NOT NULL,
--     CONSTRAINT fk_message_user_sender FOREIGN KEY(user_id_sender) REFERENCES user(id),
--     CONSTRAINT fk_message_user_receiver FOREIGN KEY(user_id_receiver) REFERENCES user(id)
-- ) ENGINE=InnoDB;

-- Table des avis
CREATE TABLE review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id_author INT NOT NULL,
    user_id_target INT NOT NULL,
    ride_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    date_posted DATETIME NOT NULL,
    CONSTRAINT fk_review_user_author FOREIGN KEY(user_id_author) REFERENCES user(id),
    CONSTRAINT fk_review_user_target FOREIGN KEY(user_id_target) REFERENCES user(id),
    CONSTRAINT fk_review_ride FOREIGN KEY(ride_id) REFERENCES ride(id)
) ENGINE=InnoDB;