<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260618180941 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE booking (id INT AUTO_INCREMENT NOT NULL, places_booked INT NOT NULL, booking_date DATETIME NOT NULL, price_total NUMERIC(6, 2) NOT NULL, status VARCHAR(30) NOT NULL, ride_id INT NOT NULL, passenger_id INT NOT NULL, INDEX IDX_E00CEDDE302A8A70 (ride_id), INDEX IDX_E00CEDDE4502E565 (passenger_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE car (id INT AUTO_INCREMENT NOT NULL, brand VARCHAR(50) NOT NULL, model VARCHAR(50) NOT NULL, color VARCHAR(30) DEFAULT NULL, fuel_type VARCHAR(30) NOT NULL, license_plate VARCHAR(20) NOT NULL, seats INT NOT NULL, owner_id INT NOT NULL, INDEX IDX_773DE69D7E3C61F9 (owner_id), UNIQUE INDEX UNIQ_CAR_LICENSE_PLATE (license_plate), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE review (id INT AUTO_INCREMENT NOT NULL, rating INT NOT NULL, comment LONGTEXT DEFAULT NULL, status VARCHAR(30) NOT NULL, date_posted DATETIME NOT NULL, author_id INT NOT NULL, target_id INT NOT NULL, ride_id INT NOT NULL, INDEX IDX_794381C6F675F31B (author_id), INDEX IDX_794381C6158E0B66 (target_id), INDEX IDX_794381C6302A8A70 (ride_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE ride (id INT AUTO_INCREMENT NOT NULL, departure_location VARCHAR(100) NOT NULL, departure_at DATETIME NOT NULL, arrival_location VARCHAR(100) NOT NULL, arrival_at DATETIME NOT NULL, places_available INT NOT NULL, price NUMERIC(6, 2) NOT NULL, description LONGTEXT DEFAULT NULL, status VARCHAR(30) NOT NULL, created_at DATETIME NOT NULL, driver_id INT NOT NULL, car_id INT NOT NULL, INDEX IDX_9B3D7CD0C3423909 (driver_id), INDEX IDX_9B3D7CD0C3C6F69F (car_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, nickname VARCHAR(50) NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, phone VARCHAR(20) DEFAULT NULL, address VARCHAR(255) DEFAULT NULL, birthdate DATE DEFAULT NULL, profile_image VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_USER_EMAIL (email), UNIQUE INDEX UNIQ_USER_NICKNAME (nickname), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE302A8A70 FOREIGN KEY (ride_id) REFERENCES ride (id)');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE4502E565 FOREIGN KEY (passenger_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE car ADD CONSTRAINT FK_773DE69D7E3C61F9 FOREIGN KEY (owner_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C6F675F31B FOREIGN KEY (author_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C6158E0B66 FOREIGN KEY (target_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C6302A8A70 FOREIGN KEY (ride_id) REFERENCES ride (id)');
        $this->addSql('ALTER TABLE ride ADD CONSTRAINT FK_9B3D7CD0C3423909 FOREIGN KEY (driver_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE ride ADD CONSTRAINT FK_9B3D7CD0C3C6F69F FOREIGN KEY (car_id) REFERENCES car (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE booking DROP FOREIGN KEY FK_E00CEDDE302A8A70');
        $this->addSql('ALTER TABLE booking DROP FOREIGN KEY FK_E00CEDDE4502E565');
        $this->addSql('ALTER TABLE car DROP FOREIGN KEY FK_773DE69D7E3C61F9');
        $this->addSql('ALTER TABLE review DROP FOREIGN KEY FK_794381C6F675F31B');
        $this->addSql('ALTER TABLE review DROP FOREIGN KEY FK_794381C6158E0B66');
        $this->addSql('ALTER TABLE review DROP FOREIGN KEY FK_794381C6302A8A70');
        $this->addSql('ALTER TABLE ride DROP FOREIGN KEY FK_9B3D7CD0C3423909');
        $this->addSql('ALTER TABLE ride DROP FOREIGN KEY FK_9B3D7CD0C3C6F69F');
        $this->addSql('DROP TABLE booking');
        $this->addSql('DROP TABLE car');
        $this->addSql('DROP TABLE review');
        $this->addSql('DROP TABLE ride');
        $this->addSql('DROP TABLE `user`');
    }
}
