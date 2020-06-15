DROP DATABASE IF EXISTS `skoolworkshop`;
 CREATE DATABASE `skoolworkshop`;
 USE `skoolworkshop`;

-- DROP USER  'skoolworkshop_admin'@'%';
-- DROP USER  'skoolworkshop_admin'@'localhost';
-- flush privileges; 
-- CREATE USER 'skoolworkshop_admin'@'%' IDENTIFIED BY 'secret';
-- CREATE USER 'skoolworkshop_admin'@'localhost' IDENTIFIED BY 'secret';

-- -- geef rechten aan deze user
-- GRANT SELECT, INSERT, DELETE, UPDATE ON `skoolworkshop`.* TO 'skoolworkshop_admin'@'localhost';

-- SET DATEFORMAT dmy;

DROP TABLE IF EXISTS `gebruiker` ;
CREATE TABLE IF NOT EXISTS `gebruiker` (
	`ID` INT NOT NULL UNIQUE AUTO_INCREMENT,
	`Naam` VARCHAR(50) NOT NULL,
	`Email` VARCHAR(50) NOT NULL UNIQUE,
	`Organisatie` VARCHAR(50) NOT NULL,
	`Wachtwoord` VARCHAR(500) BINARY NOT NULL,
	`PathLogo` VARCHAR(100),
	`Inactive` BOOLEAN,
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
	`Korting` INT,
    PRIMARY KEY (`GebruikerID`, `Workshopnaam`, `BookedDate`)
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

DROP TABLE IF EXISTS `Categorie` ;
CREATE TABLE IF NOT EXISTS `Categorie` (
	`Naam` VARCHAR(64) NOT NULL UNIQUE,
	PRIMARY KEY (`Naam`)
)
ENGINE = InnoDB;

INSERT INTO `Categorie`
VALUES ('Beeldende Kunst'),
('Dans'),
('Media'),
('Muziek'),
('Sport'),
('Theater');

INSERT INTO `Workshop`
VALUES ('Graffiti', 'Doen wat eigenlijk niet mag: openbare muurkladderij, oftewel graffiti spuiten. Dat wil je toch een keer gedaan hebben? Bij Skool Workshop mag het! Bij onze creatieve Workshop Graffiti ga je aan de slag met spuitbussen en een canvas. Je mag je eigen kunstwerk ontwerpen en waar nodig helpen we je. Samen met jouw eigen graffiti tag onderteken je jouw street art helemaal in stijl.', '165', '150', 'Beeldende Kunst'),
('Light Graffiti', 'Media wordt steeds populairder en fotografie speelt daarbij een belangrijke rol. Luminografie, ook wel lightpainting / lightgraffiti genoemd, is een techniek die vroeger al gebruikt werd door Pablo Picasso in de kunst.Tijdens de workshop Light Graffiti van Skool Workshop leer je tekenen met licht. Je maakt foto’s met een camera die een lange belichtingstijd (sluitertijd) heeft en een zaklamp. Zo kun je lichtbewegingen vastleggen en super spectaculaire beelden maken! Grote namen als Canon en Nikon delen regelmatig foto’s waarin ze schrijven met licht. Hier reageren  vervolgens veel mensen op door hun eigen light paintings te sharen. Dat wil jij toch ook? Pak dan nu je zaklamp en doe mee met onze light graffiti workshop!', '165', '150', 'Beeldende Kunst'),
('Stop Motion', 'Iedereen heeft wel eens een Stop Motion film gezien. Denk maar aan Bob de Bouwer, Nijntje of Shaun Het Schaap. Tijdens de Workshop Stop Motion breng je figuren tot leven. Een figuur van klei, tekeningen of speelgoed eigenlijk zijn de mogelijkheden eindeloos. Door op een creatieve manier foto’s te maken én door animatietechnieken maak jij je eigen stop motion film helemaal zelf!', '165', '150', 'Beeldende Kunst'),
('Tshirt Ontwerpen', 'Een eigen T-shirt ontwerpen? Wie wil dat nou niet? Tijdens de workshop T-shirt ontwerpen tover je een saai T-shirt om tot een vet shirt dat bij jou past. Vind je het leuk om met de mode mee te gaan? Of wil je juist anders zijn? Dan is een workshop T-shirt ontwerpen iets voor jou. Creëer je eigen stijl, of het nou een croptop, longsleeve of een T-shirt met gaten is, alles mag! Glitters, studs en andere materialen zullen gebruikt worden om jou shirt te laten shinen. Jij bent de baas en wie weet loop jij straks rond in jouw eigen ontworpen design!', '165', '150', 'Beeldende Kunst'),
('Breakdance', 'Wil je vette trucks leren? Rondjes draaien op je handen of op je hoofd, handstanden maken of snel voetwerk leren dan ben je bij Skool Workshop aan het juiste adres voor een Workshop Breakdance. Breakdance is net zoals streetdance en graffiti één van de elementen van Hiphop. De dans heeft veel verschillende soorten bewegingen; top rock, footwork, powermoves en freezes. Bij breakdance draait het om het hebben van een eigen stijl, originaliteit en het uiten van expressie. Tijdens de Workshop Breakdance ga je je eigen grenzen verleggen, maar je blijft altijd onderdeel van de groep. Zo leer je respecteren want in de strijd blijven we ook een eenheid te vormen. In de groep ontwikkel je je motoriek en moedig je elkaar aan. Aan het einde van de workshop ben je in staat je eigen presentatie te geven en kun je helemaal losgaan met de techniek die je is geleerd. Het is een uitdagende sport, maar wanneer je het eenmaal onder de knie hebt, zal je iedereen versteld laten staan.', '165', '150', 'Dans'),
('Dance-fit', 'De Workshop Dance Fit is een leuke aerobic work–out. Denk aan dansles, Zumba, cardio-fitness en aerobic oefeningen gemixt met een hoog fun gehalte. Je uithoudingsvermogen wordt op een positieve manier getraind waarbij cultuur en dans je helpen om al je spieren te trainen. Net zoals bij een fitness- cardio work-out bouw je bij deze dans workshop kracht op en verbrand je lekker veel calorieën.', '165', '150', 'Dans'),
('Flash Mob', 'Je hebt het vast wel eens gezien: mensen beginnen vanuit het niets een dans in het openbaar. Eén persoon of een kleine groep begint, maar er komen steeds meer mensen meedoen aan de dans. Klinkt dit bekend? Dan was je getuige van een flashmob. De ‘zogenaamde’ toeschouwers die mee gaan dansen laten de ‘echte’ toeschouwers verbazen. Misschien ken je het ook wel van de dansfilm ‘Step up 4‘ (2012). Deze dansfilm gebruikt ook flashmobs op verschillende locaties, bijvoorbeeld op stations, in musea en winkelcentra. Deze film werd een hit en zorgde ervoor dat er steeds meer flashmobs kwamen.', '165', '150', 'Dans'),
('Hiphop', 'Tegenwoordig kom je overal hiphop tegen. Niet alleen als muziek vorm, maar ook als dans. Denk maar aan bekende dansgroepen zoals Royal Family en Jabbawockeez. Ook zie je veel dansprogramma’s op tv, vette dansmoves bij concerten door achtergronddansers en danseressen. Bij de Workshop Hiphop leer je ook hoe je de gaafste dansmoves maakt! De roots van hiphop ligt, net zoals bij rap en ghetto drums, in de achterbuurten van New York. Daar werd veel gedanst op straat en in clubs, wie houdt er nu niet van een feestje? Bij de workshop hiphop leer je alle dans moves en zijn de danspasjes makkelijk te leren. Daarom is de workshop hiphop dans voor iedereen, wie daag jij uit voor een battle?', '165', '150', 'Dans'),
('Moderne dans', 'Moderne dans is niet meer weg te denken binnen de danswereld. Overal kom je het tegen; bij dansprogramma’s, talentenjachten en dansacademies. Moderne dans is een dansstijl zonder vaststaande bewegingen. Het is een vernieuwde vorm en combinatie van klassiek ballet en jazzdans. De Workshop Moderne Dans is een workshop van kunst waarbij het draait om persoonlijke en artistieke expressie. Het kenmerkende voor moderne dans is daarom dan ook dat je je lichaam als uitdrukkingsmiddel gebruikt. Alle expressie laat je zien door een verhaal te vertellen, met behulp van je lichaam. Tijdens Moderne dans dans je met gevoel. Je maakt zoveel mogelijk gebruik van de ruimte om jouw gevoel over te brengen.', '165', '150', 'Dans'),
('Stepping', 'Stampen, klappen, schreeuwen en muziek maken? Bij de workshop stepping (ook wel bodypercussie of bodyclapping genoemd), komt alles aan bod. Stepping is een Afro-Amerikaanse dans waarbij de kracht in je voeten en handen erg belangrijk is. Je hele lichaam wordt gebruikt als instrument om ritmes en geluiden te produceren, zoals voetstappen, gesproken woord en geklap. Je gaat tijdens deze actieve workshop aan de met muziek maken door op een ritmische wijze te stampen en te klappen. Tijdens deze bodypercussie workshop leer je hoe je met je handen en je voeten een vette beat kunt creëren. Je leert hoe je goed in teamverband kunt functioneren, iedereen erbij kunt betrekken en je leert een eenheid vormen. Stepping is bekend geworden door de populaire dansfilms ‘Stomp The Yard’ en ‘How She Moves’. Het gaat bij stepping om discipline, doorzettingsvermogen en zelfvertrouwen, dit is ook duidelijk terug te zien in deze twee films.', '165', '150', 'Dans'),
('Streetdance', 'Ben je nog bekend met de talent dansshow So you think you can dance nog? Wil jij net zo dansen als de sterren in dit programma, of net zoals in de film Body Language, de eerste Nederlandse dansfilm? Streetdance is officieel een verzamelnaam van deze verschillende dansvormen die als het ware op straat zijn ontstaan. Net zoals hiphop begon deze dans in New York en is uitgegroeid tot een populaire dansstijl. Bij de Workshop Streetdance leer jij de tofste dansmoves!', '165', '150', 'Dans'),
('Photoshop', 'Iedereen kent het wel ‘Photoshop’; één van de populairste grafische programma’s om alles met beeld te kunnen doen. Dit programma wordt veelal gebruikt in vakgebieden zoals fotografie en filmmakers, van websites tot illustraties en het bewerken van andere digitale beeldmaterialen. Wil je de perfecte foto maken voor je Instagram feed, Snapchat reeks of als Facebook post? Dan ga je vaak aan de slag met een ‘filter’, dit zorgt voor een mooi effect. Na de Workshop Photoshop kun je straks je foto’s nog uitgebreider bewerken op een professionele manier.', '240', '225', 'Media'),
('Vloggen', 'Van jong tot oud, iedereen kan vloggen. Bij de Workshop Vloggen gebruikt de workshopdocent zijn expertise om de deelnemer een bepaalde basis aan te leren bij het opnemen van een vlog. Tijden veranderen; bloggen is al lang niet meer populair, want mensen lezen minder. Tekst veranderd in beeld: bloggen wordt dus vloggen. Vlog (een afkorting voor video weblog) is als het ware een dagboek op internet waarbij het grootste deel bestaat uit videobeelden. Iemand die een vlog maakt noem je vlogger of vlogster. De drie bekendste vloggers onder de jeugd in Nederland zijn Dylan Haegens, Enzo Knol, Monica Geuze, StukTV,  Nikki Tutorials en rapper Boef. Zij filmen hun hele dag, vertellen leuke verhalen en vermaken hier wel duizend volgers (abonnees of subscribers op Youtube) mee. Verzin je eigen onderwerp en ga aan de slag met je eigen vlog tijdens de Workshop Vloggen.', '240', '225', 'Media'),
('Smartphone Fotografie', 'Hoeveel likes heb je gekregen op je foto? Momenteel is de online wereld niet meer weg te denken. Je kunt het zo gek niet bedenken of het wordt gemaakt voor ‘De Gram’. Van Snapchat reeksen tot mooi uitgedachte Instagram feeds. Tijdens de Workshop Smartphone Fotografie leer je hoe je de mooiste foto’s maakt met je smartphone. Lelepons, Vonnekebonneke en Twan Kuyper zijn onder andere bekend geworden door ‘de Gram’. Ook zij maken gebruik van smartphone fotografie. Iedereen heeft het wel eens gedaan, een foto maken met je smartphone. Toch is het moeilijker en je kan er meer mee dan je denkt. Tegenwoordig heb je namelijk niet meer per se een digitale camera nodig. Je kan ook met je smartphone kwalitatieve foto’s maken. Bij de workshop Smartphone Photografie leer jij de mooiste foto’s te maken en te bewerken.', '165', '150', 'Media'),
('Videoclip Maken', 'Bekend zijn en je eigen nummers opnemen in een eigen videoclip, wie wilt dit nou niet? Muziekvideo’s zijn tegenwoordig niet meer weg te denken in de muziekwereld. YouTube staat er vol mee. Maar dat niet alleen, ook de Nederlandse televisiezender XITE houdt zich er druk mee bezig. Drake, Nicki Minaj, Ariana Grande en Bizzey zijn vast namen die je bekend voorkomen. De jongeren van nu luisteren veel naar hun muziek. Deze artiesten laten een videoclip van hun nummers maken, en wij gaan jou leren hoe dat moet in de workshop videoclip. Maak jouw eigen videoclip tot een succes!', '240', '225', 'Media'),
('Ghetto Drums', 'Stap in de muziekwereld van Afrika en de Amerikaanse sloppenwijken en ontdek de mogelijkheid om muziek te maken door middel van tonnen. De benaming Ghetto Drums, ook wel ‘Streetbeats‘ genoemd, zegt letterlijk al waar het vandaan komt. Het is een kunstvorm die puur is ontstaan door geldnood in de sloppenwijken van derdewereldlanden, maar is uitgegroeid tot een zelfstandige, muzikale kunstdiscipline, waarbij ze te werk gaan met alledaagse en makkelijke materialen. Je leert tijdens de drum workshop diverse ritmes op afroep spelen en binnen no time dendert de hele zaal. Deze workshop is voor iedereen weggelegd. Een Workshop muziek maken is nog nooit zo leuk geweest!', '165', '150', 'Muziek'),
('Live Looping', 'Altijd al zelf een muzikaal muziekstukje in elkaar willen zetten? De workshop Live Looping is het creëren van een geluidscollage, net zoals bij de Workshop Rap. Tijdens deze muzikale workshop wordt er gebruik gemaakt van een speciaal apparaat, een ‘loopstation‘. Hiermee kun je in verschillende lagen geluid opnemen. Uiteindelijk vormen die verschillende lagen geluid een verrassend en harmonieus geheel. De workshop live looping is perfect voor deelnemers om te ontdekken hoe je van verschillende soorten geluiden één geheel kunt maken dat ook nog eens lekker klinkt! Het is niet altijd gewenst om als artiest met een hele band op te trekken. Dit heeft veelal financiële motieven, maar het zou ook gebrek aan ruimte kunnen zijn. Een artiest als Ed Sheeran staat internationaal bekend als een gebruiker van een loop pedal tijdens zijn live performance.', '165', '150', 'Muziek'),
('Percussie', 'Wil je samen in een ontspannen sfeer muziek maken? Dit is mogelijk bij de Workshop Percussie. Zelfs als je nog nooit een muziekinstrument hebt bespeeld. Percussie is een vorm van muziek maken met behulp van slagwerkinstrumenten uit de Afrikaanse cultuur, zoals doun douns (bas-trommels), bellen shakers en djembés. Je drumt Afrikaanse ritmes, deze zijn vaak eenvoudig om te spelen, maar worden spannend als je ze door elkaar heen speelt. Samenwerken en communiceren met elkaar is erg belangrijk om een mooi muziek stuk te creëren.', '165', '150', 'Muziek'),
('Popstar', 'Heb je altijd al eens op een professionele manier een song in willen zingen? Je eigen geschreven liedje of een cover van je favoriete artiest willen zingen in een studio? Skool Workshop maakt dit mogelijk. Met de Workshop Popstar zing of rap je nu je favoriete hits van Josylvio, Latifah of Chris Brown. Je kunt bij de Workshop Popstar samen een zangkoor vormen of The Voice Of Holland na doen, alles is mogelijk. Je gaat een lied opnemen in onze mobiele studio. Als het lied opgenomen is, kan je ook een spetterende videoclip maken.', '165', '150', 'Muziek'),
('Rap', 'Hits zoals Lit, HUTS en 4x Duurder, we kennen ze allemaal, althans bijna allemaal. De Workshop Rap gaat mee in de belevingswereld van de jongeren. Rapmuziek is namelijk niet meer weg te denken uit hun belevingswereld. Ook wordt rap in Nederland steeds populairder en kun je er een aardig zakcentje mee verdienen. Wat is rap nou eigenlijk? Rappen is het zingen van poëtische teksten op een ritmische wijze. Naast een Workshop Rappen is het dus ook een taal workshop. De rap geschiedenis begon in de jaren tachtig, de muziekstijl rap ontstond in de New Yorkse wijk The Bronx. Bij de Workshop Rap kan jij je eigen rap maken en wellicht word je wel de nieuwe Nicki Minaj of Drake. Lil’ Kleine, Ronnie Flex en Broederliefde zijn de populairste rappers van het moment. Zij behalen miljoenen views en doen dit allemaal gewoon in Nederland. Dus mogelijkheden genoeg.', '165', '150', 'Muziek'),
('Bootcamp', 'Sporten in groepsverband is vaak gezelliger en motiverender dan alleen. Fit worden met z’n allen en samenwerken staat centraal in de Workshop Bootcamp. Tijdens de workshop krijg je  oefeningen met behulp van je eigen lichaamsgewicht, natuurlijke trainingsmaterialen zoals boomtakken en gemakkelijk te vervoeren fitnessmaterialen denk bijvoorbeeld aan kettlebells. Je helpt elkaar om de eindstreep te halen. Belangrijk is dan ook de hoge fun factor van deze uitdagende workshop.', '165', '150', 'Sport'),
('Capoeira', 'Kennismaken met de beroemde Braziliaanse vecht-dans? Capoeira is een Braziliaans spel van vechtkunst, acrobatiek en muziek. Een veel gehoorde suggestie over de geschiedenis van Capoeira is dat de slaven ‘gevechtstraining‘ camoufleerden als dans om zo de onderdrukker te misleiden. Capoeira is dan ook een bevrijdend spel dat de wereld op zijn kop kan zetten! Een kenmerkende beweging van de sport is de ginga; een swingende basisstap van waaruit alle mogelijke bewegingen voortvloeien. Capoeira ziet er voor anderen vaak uit als een combinatie van vele acrobatische, capoeira bewegingen en draaitrappen.', '165', '150', 'Sport'),
('Freerunning', 'Wil jij vrij rennen, over hekken springen, met vette trucks tegen muren oplopen? Dan ben je bij Skool Workshop aan het juiste adres voor een Workshop Freerunning. Freerunning is een spectaculaire en leuke sport. Als freerunner ervaar je het uiterste gevoel van vrijheid, lichaamscontrole en kracht. Maar wat is freerunning nou eigenlijk? Freerunnen houdt in dat je door middel van gymnastische technieken, zoals salto’s over obstakels heen springt. Er ligt veel aandacht bij het showelement. Bij Parkour is het de bedoeling om zo snel mogelijk van punt A naar punt B te komen over verschillende obstakels. Het lijkt net op een superhelden film, maar wordt tegenwoordig door steeds meer jongeren gedaan.', '165', '150', 'Sport'),
('Kickboxing', 'Sportief bezig zijn met sporten waar respect hoog in het vaandel staat? Kickboksen is momenteel zeer populair bij jongens en bij meisjes. Kickboksen is een vechtsport die is ontstaan uit de sporten karate en boksen. Je mag daarom bij deze vechtsport ook gebruik maken van je handen en voeten. Bekende Nederlandse kickboksers zijn Rico Verhoeven, Remy Bonjasky en Melvin Manhoef. Ook bij bekende artiesten, youtubers en vloggers is kickboksen erg populair. Voor hun is er een speciale wedstrijd georganiseerd ‘Boxing Influencers‘. Boxing Influencers laat influencers van verschillende categorieën uitvechten wie de sterkste is. Zo zullen onder andere vloggers, rappers en fitgirls het tegen elkaar opnemen.', '165', '150', 'Sport'),
('Pannavoetbal', 'Je bent vast weleens langs een voetbalveldje gelopen en “Ohwww Panna…. whahahahah!”  voorbij horen komen. Dat wordt vaak geroepen als iemand een bal door zijn benen krijgt gespeeld. De belangrijkste voorwaarde voor een geslaagde panna (Surinaams voor ‘poortje’, een verwijzing naar de voetbalterm ‘poorten’) is dat de poortende speler zelf balbezit houdt na zijn beweging. Dit doe je door op een veldje of in een Panna-kooi met kleine goals te gaan voetballen en vooral veel trucjes te doen, waarbij je natuurlijk gebruik maakt van de pannavoetbal regels. Ziyech, Neymar en Mbappe zijn bekende voetballers die met straatvoetbal zijn begonnen. Zij brengen hun vette trucks terug in het normale voetbal. Bij Pannavoetbal is respect erg belangrijk ook is het belangrijk dat er veel wordt gelachen en plezier wordt gemaakt.', '165', '150', 'Sport'),
('Zelfverdediging', 'Iedereen herkent het wel: je moet in je eentje in het donker fietsen en je raakt in conflict/confrontatie of ongewenst gedrag. Voor de meeste mensen kan deze situaties herkenbaar zijn. Zelfverdediging kan dan van groot belang zijn en houdt in dat je jezelf beschermt. Zelfverdediging is een sport waarbij je geen direct geweld gebruikt. Tijdens de Workshop Zelfverdediging leren wij je verschillende vaardigheden zoals het mentale aspect en fysieke vaardigheden, ook leren wij je een klein stukje Jiu Jitsu wat een oude en traditionele Japanse krijgskunst is. Je leer hierbij in enkele seconden één of meerdere aanvallers uit te schakelen.', '165', '150', 'Sport'),
('Soap Acteren', 'Altijd al willen acteren in een film? Of helemaal in de rol duiken die jij altijd al hebt willen spelen, dit kan tijdens de Workshop Soap Acteren. Een soapserie is een televisieserie die oorspronkelijk meestal na de middag werd uitgezonden. Dat is nu al lang niet meer zo. Soaps zijn nu zo populair dat deze ook te volgen zijn op Netflix en Videoland. Bij een soap wordt vaak, van dag tot dag, de belevenissen van personen in een fictieve wereld gevolgd. Vooral de emotionele interacties en de relaties tussen de hoofdpersonen staan in het middelpunt van de aandacht. Een aantal verhaallijnen lopen door elkaar en er is zelden een duidelijk eind aan de verwikkelingen. GTST, Prison Break, en La Casa de Papel zijn voorbeelden van series, dit zijn dan ook een van de dé bekendste series van dit moment.', '165', '150', 'Theater'),
('Stage Fighting', 'Vanaf jongs af aan zijn jongens en meisjes al bezig met stoeien, oftewel nep vechten. Stage Fighting, ook wel bekend als stage combat of toneelgevecht. Het is een gespecialiseerde techniek in de theater- en filmwereld. Je speelt een vechtchoreografie van een fysiek gevecht zonder dat je schade toebrengt aan je medespeler. Dit wordt zo gespeeld dat het voor de kijkers echt lijkt. Veel acteurs die beroemd zijn vanwege hun vaardigheden om te strijden, hebben vaak een achtergrond in dans- of vechtsporten. Voorbeelden hiervan zijn  Bruce Lee, Jackie Chan en Jet Li, of aan films als Karate Kid en Spider Man.', '165', '150', 'Theater'),
('Theatersport', 'Het is moeilijk om zomaar uit het niets te improviseren. Er is een moment dat je denkt wat moet ik doen? Het is makkelijker gezegd dan gedaan. Tijdens de workshop leer je het verhaal, de personages en de dialogen ter plekke te verzinnen. Neem een voorbeeld aan ‘De Grote Improvisatie Show’, zij kunnen ook niet meteen als ze een onderwerp krijgen naar voren stappen en gaan improviseren. Bij de Workshop Theatersport gaan we je helemaal klaarstomen voor je eigen improvisatie show, door middel van theatersport spellen.', '165', '150', 'Theater')
;
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

ALTER TABLE `Workshop`
ADD CONSTRAINT `fk_Workshop_Categorie`
FOREIGN KEY (`Categorie`) REFERENCES `Categorie` (`Naam`)

