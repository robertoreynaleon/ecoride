<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260618183406 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE review DROP FOREIGN KEY `FK_794381C6158E0B66`');
        $this->addSql('ALTER TABLE review DROP FOREIGN KEY `FK_794381C6302A8A70`');
        $this->addSql('ALTER TABLE review DROP FOREIGN KEY `FK_794381C6F675F31B`');
        $this->addSql('DROP TABLE review');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE review (id INT AUTO_INCREMENT NOT NULL, rating INT NOT NULL, comment LONGTEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_0900_ai_ci`, status VARCHAR(30) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, date_posted DATETIME NOT NULL, author_id INT NOT NULL, target_id INT NOT NULL, ride_id INT NOT NULL, INDEX IDX_794381C6302A8A70 (ride_id), INDEX IDX_794381C6F675F31B (author_id), INDEX IDX_794381C6158E0B66 (target_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT `FK_794381C6158E0B66` FOREIGN KEY (target_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT `FK_794381C6302A8A70` FOREIGN KEY (ride_id) REFERENCES ride (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT `FK_794381C6F675F31B` FOREIGN KEY (author_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
