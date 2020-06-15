DROP DATABASE IF EXISTS `skoolworkshop`;
 CREATE DATABASE `skoolworkshop`;
 USE `skoolworkshop`;

-- DROP USER  'skoolworkshop_admin'@'%';
-- DROP USER  'skoolworkshop_admin'@'localhost';
-- flush privileges; 
CREATE USER 'skoolworkshop_admin'@'%' IDENTIFIED BY 'secret';
CREATE USER 'skoolworkshop_admin'@'localhost' IDENTIFIED BY 'secret';

-- -- geef rechten aan deze user
GRANT SELECT, INSERT, DELETE, UPDATE ON `skoolworkshop`.* TO 'skoolworkshop_admin'@'localhost';

DROP TABLE IF EXISTS `gebruiker` ;
CREATE TABLE IF NOT EXISTS `gebruiker` (
	`Naam` VARCHAR(50) NOT NULL,
	`Email` VARCHAR(50) NOT NULL UNIQUE,
	`Organisatie` VARCHAR(50) NOT NULL,
    `Adress` VARCHAR(50) NOT NULL,
	`Wachtwoord` VARCHAR(500) BINARY NOT NULL,
	`CadeaubonId` INT,
	PRIMARY KEY (`Email`)
) 
ENGINE = InnoDB;

DROP TABLE IF EXISTS `Admin` ;
CREATE TABLE IF NOT EXISTS `Admin` (
	`Naam` VARCHAR(50) NOT NULL,
	`Email` VARCHAR(50) NOT NULL UNIQUE,
	`Wachtwoord` VARCHAR(500) BINARY NOT NULL,
	PRIMARY KEY (`Email`)
) 
ENGINE = InnoDB;


DROP TABLE IF EXISTS `Workshop` ;
CREATE TABLE IF NOT EXISTS `Workshop` (
	`Naam` VARCHAR(50) NOT NULL UNIQUE,
	`Beschrijving` VARCHAR(1000) NOT NULL,
    `CadeaubonId` INT,
	`Kosten` INT NOT NULL ,
	`VervolgKosten` INT NOT NULL,
	`Categorie` VARCHAR(64)NOT NULL,
	PRIMARY KEY (`Naam`)
) 
ENGINE = InnoDB;


DROP TABLE IF EXISTS `GebruikerWorkshop`;
CREATE TABLE IF NOT EXISTS `GebruikerWorkshop`(
    `Gebruikersemail` VARCHAR(50) NOT NULL,
    `Workshopnaam` VARCHAR(32) NOT NULL,
    `SingedUpOn` DATE NOT NULL,
    PRIMARY KEY (`Gebruikersemail`, `Workshopnaam`)
)   
ENGINE= InnoDB;

DROP TABLE IF EXISTS `Cadeaubon` ;
CREATE TABLE IF NOT EXISTS `Cadeaubon` (
	`ID` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`Code` VARCHAR(32) NOT NULL,
    `Value` VARCHAR(32),
	`MaxBedrag` INT,
	`MaxGebruik` INT,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;


DROP TABLE IF EXISTS `Evaluatie` ;
CREATE TABLE IF NOT EXISTS `Evaluatie` (
	`ID` INT NOT NULL UNIQUE,
	`Titel` VARCHAR(32) NOT NULL,
    `Beschrijving` VARCHAR(100),
    `Naam` VARCHAR(50) DEFAULT 'ANON',
	`GebruikerEmail` VARCHAR(50),
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

DROP TABLE IF EXISTS `Factuur` ;
CREATE TABLE IF NOT EXISTS `Factuur` (
	`ID` INT AUTO_INCREMENT,
    `GebruikerEmail` VARCHAR(50) NOT NULL,
	`Path` VARCHAR(90) NOT NULL UNIQUE,
	`IsBetaald` BOOLEAN NOT NULL,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

ALTER TABLE `Factuur` 
ADD CONSTRAINT `fk_gebruiker_factuur`
FOREIGN KEY (`GebruikerEmail`) REFERENCES `Gebruiker` (`Email`)
;
ALTER TABLE `GebruikerWorkshop` 
ADD CONSTRAINT `fk_gebruiker_gebruikerworkshop`
FOREIGN KEY (`Gebruikersemail`) REFERENCES `Gebruiker` (`Email`)
;

ALTER TABLE `GebruikerWorkshop`
ADD CONSTRAINT `fk_workshop_gebruikerworkshop`
FOREIGN KEY (`Workshopnaam`) REFERENCES `Workshop` (`Naam`)
;

ALTER TABLE `Gebruiker`
ADD CONSTRAINT `fk_Gebruiker_CadueaBon`
FOREIGN KEY (`CadeaubonId`) REFERENCES `Cadeaubon` (`ID`)
;

ALTER TABLE `Evaluatie`
ADD CONSTRAINT `fk_Evaluatie_gebruiker`
FOREIGN KEY (`GebruikerEmail`) REFERENCES `Gebruiker` (`Email`)
;