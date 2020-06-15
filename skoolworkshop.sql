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

-- SET DATEFORMAT dmy;

DROP TABLE IF EXISTS `gebruiker` ;
CREATE TABLE IF NOT EXISTS `gebruiker` (
	`ID` INT NOT NULL UNIQUE AUTO_INCREMENT,
	`Naam` VARCHAR(50) NOT NULL,
	`Email` VARCHAR(50) NOT NULL UNIQUE,
	`Organisatie` VARCHAR(50) NOT NULL,
	`Wachtwoord` VARCHAR(500) BINARY NOT NULL,
	`PathLogo` VARCHAR(100),
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

DROP TABLE IF EXISTS `Organisatie` ;
CREATE TABLE IF NOT EXISTS `Organisatie` (
	`Naam` VARCHAR(50) NOT NULL,
	`Adres` VARCHAR(50) NOT NULL UNIQUE,
	PRIMARY KEY (`Naam`)
) 
ENGINE = InnoDB;

DROP TABLE IF EXISTS `Admin` ;
CREATE TABLE IF NOT EXISTS `Admin` (
	`ID` INT UNIQUE NOT NULL AUTO_INCREMENT,
	`Naam` VARCHAR(50) NOT NULL,
	`Email` VARCHAR(50) NOT NULL UNIQUE,
	`Wachtwoord` VARCHAR(500) BINARY NOT NULL,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;


DROP TABLE IF EXISTS `Workshop` ;
CREATE TABLE IF NOT EXISTS `Workshop` (
	`Naam` VARCHAR(50) NOT NULL UNIQUE,
	`Beschrijving` VARCHAR(1000) NOT NULL,
	`Kosten` INT NOT NULL ,
	`VervolgKosten` INT NOT NULL,
	`Categorie` VARCHAR(64)NOT NULL,
	PRIMARY KEY (`Naam`)
) 
ENGINE = InnoDB;


DROP TABLE IF EXISTS `GebruikerWorkshop`;
CREATE TABLE IF NOT EXISTS `GebruikerWorkshop`(
    `GebruikerID` INT NOT NULL,
    `Workshopnaam` VARCHAR(32) NOT NULL,
    `SingedUpOn` DATE NOT NULL,
	`BookedDate` DATE NOT NULL,
    PRIMARY KEY (`GebruikerID`, `Workshopnaam`)
)   
ENGINE= InnoDB;

DROP TABLE IF EXISTS `Cadeaubon` ;
CREATE TABLE IF NOT EXISTS `Cadeaubon` (
	`ID` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`Code` VARCHAR(32) NOT NULL,
    `Value` VARCHAR(32) NOT NULL,
	`MaxBedrag` INT,
	`MaxGebruik` INT NOT NULL,
	`AantalGebruikt` INT,
	`OrganisatieNaam` VARCHAR(50),
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

DROP TABLE IF EXISTS `Evaluatie` ;
CREATE TABLE IF NOT EXISTS `Evaluatie` (
	`ID` INT NOT NULL UNIQUE,
	`Titel` VARCHAR(32) NOT NULL,
    `Beschrijving` VARCHAR(100),
	`GebruikerID` INT,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

DROP TABLE IF EXISTS `Factuur` ;
CREATE TABLE IF NOT EXISTS `Factuur` (
	`ID` INT AUTO_INCREMENT,
    `GebruikerID` INT NOT NULL,
	`Path` VARCHAR(90) NOT NULL UNIQUE,
	`IsBetaald` BOOLEAN NOT NULL,
	`UrlFoto` VARCHAR(100),
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

ALTER TABLE `Factuur` 
ADD CONSTRAINT `fk_gebruiker_factuur`
FOREIGN KEY (`GebruikerID`) REFERENCES `Gebruiker` (`ID`)
;
ALTER TABLE `GebruikerWorkshop` 
ADD CONSTRAINT `fk_gebruiker_gebruikerworkshop`
FOREIGN KEY (`GebruikerID`) REFERENCES `Gebruiker` (`ID`)
;

ALTER TABLE `GebruikerWorkshop`
ADD CONSTRAINT `fk_workshop_gebruikerworkshop`
FOREIGN KEY (`Workshopnaam`) REFERENCES `Workshop` (`Naam`)
;

ALTER TABLE `Evaluatie`
ADD CONSTRAINT `fk_Evaluatie_gebruiker`
FOREIGN KEY (`GebruikerID`) REFERENCES `Gebruiker` (`ID`)
;

ALTER TABLE `Gebruiker`
ADD CONSTRAINT `fk_Gebruiker_organisatie`
FOREIGN KEY (`Organisatie`) REFERENCES `Organisatie` (`Naam`)
ON DELETE CASCADE
;

ALTER TABLE `Cadeaubon`
ADD CONSTRAINT `fk_Organisatie_Cadeaubon`
FOREIGN KEY (`OrganisatieNaam`) REFERENCES `Organisatie` (`Naam`)
ON DELETE CASCADE
;