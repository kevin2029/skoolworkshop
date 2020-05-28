DROP DATABASE IF EXISTS `skoolworkshop`;
 CREATE DATABASE `skoolworkshop`;
 USE `skoolworkshop`;


 CREATE USER 'skoolworkshop_admin'@'%' IDENTIFIED BY 'secret';
    CREATE USER 'skoolworkshop_admin'@'localhost' IDENTIFIED BY 'secret';

-- -- geef rechten aan deze user
GRANT SELECT, INSERT, DELETE, UPDATE ON `skoolworkshop`.* TO 'skoolworkshop_admin'@'%';
GRANT SELECT, INSERT, DELETE, UPDATE ON `skoolworkshop`.* TO 'skoolworkshop_admin'@'localhost';



 DROP TABLE IF EXISTS `gebruiker` ;
CREATE TABLE IF NOT EXISTS `gebruiker` (
	`Naam` VARCHAR(50) NOT NULL,
	`Email` VARCHAR(50) NOT NULL UNIQUE,
	`Organisatie` VARCHAR(50) NOT NULL,
    `Adress` VARCHAR(50) NOT NULL,
	`Wachtwoord` VARCHAR(50) BINARY NOT NULL,
	PRIMARY KEY (`Email`)
) 
ENGINE = InnoDB;


DROP TABLE IF EXISTS `Workshop` ;
CREATE TABLE IF NOT EXISTS `Workshop` (
	`Naam` VARCHAR(50) NOT NULL UNIQUE,
	`Beschrijving` VARCHAR(1000) NOT NULL,
    `CadeaubonId` INT,
	`Kosten` INT NOT NULL ,
	`Vervolg kosten` INT NOT NULL,
	`Genre` VARCHAR(64)NOT NULL,
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
	`ID` INT NOT NULL UNIQUE,
	`Code` VARCHAR(32) NOT NULL,
    `Value` INT,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;


DROP TABLE IF EXISTS `Evaluatie` ;
CREATE TABLE IF NOT EXISTS `Evaluatie` (
	`ID` INT NOT NULL UNIQUE,
    `Workshop` VARCHAR(50) NOT NULL,
	`Titel` VARCHAR(32) NOT NULL,
    `Beschrijving` VARCHAR(100),
    `Naam` VARCHAR(50) DEFAULT 'ANON',
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;



ALTER TABLE `GebruikerWorkshop` 
ADD CONSTRAINT `fk_gebruiker_gebruikerworkshop`
FOREIGN KEY (`Gebruikersemail`) REFERENCES `Gebruiker` (`Email`)
,
ADD CONSTRAINT `fk_workshop_gebruikerworkshop`
FOREIGN KEY (`Workshopnaam`) REFERENCES `Workshop` (`Naam`)
;

ALTER TABLE `Workshop`
ADD CONSTRAINT `fk_Workshop_CadueaBon`
FOREIGN KEY (`CadeaubonId`) REFERENCES `Cadeaubon` (`ID`)
;

ALTER TABLE `Evaluatie`
ADD CONSTRAINT `fk_gEvaluatie_workshop`
FOREIGN KEY (`Workshop`) REFERENCES `Workshop` (`Naam`)
;













