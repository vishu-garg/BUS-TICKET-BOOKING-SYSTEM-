-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema dbms_project
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema dbms_project
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dbms_project` DEFAULT CHARACTER SET latin1 ;
USE `dbms_project` ;

-- -----------------------------------------------------
-- Table `dbms_project`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbms_project`.`admin` (
  `admin_id` VARCHAR(45) NOT NULL,
  `admin_pass` VARCHAR(250) NOT NULL,
  PRIMARY KEY (`admin_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `dbms_project`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbms_project`.`users` (
  `Mobile` VARCHAR(25) NOT NULL,
  `Name` VARCHAR(25) NOT NULL,
  `Password` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`Mobile`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `dbms_project`.`employee_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbms_project`.`employee_details` (
  `admin_id` VARCHAR(45) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `age` INT(11) NOT NULL,
  `doj` DATE NOT NULL,
  `salary` INT(11) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `staff_amount` INT(11) NOT NULL DEFAULT '0',
  `type` VARCHAR(50) NOT NULL DEFAULT 'STAFF',
  PRIMARY KEY (`admin_id`),
  INDEX `employee_key_idx` (`admin_id` ASC) VISIBLE,
  CONSTRAINT `employee_key`
    FOREIGN KEY (`admin_id`)
    REFERENCES `dbms_project`.`admin` (`admin_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `dbms_project`.`buses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbms_project`.`buses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `agent_id` VARCHAR(45) NOT NULL,
  `driver_name` VARCHAR(45) NOT NULL,
  `origin` VARCHAR(45) NOT NULL,
  `dest` VARCHAR(45) NOT NULL,
  `driver_mobile` VARCHAR(45) NOT NULL,
  `capacity` INT(11) NOT NULL,
  `available` VARCHAR(45) NOT NULL DEFAULT 'YES',
  `price` INT(11) NOT NULL,
  `category` VARCHAR(45) NOT NULL,
  `timing` TIME NULL DEFAULT NULL,
  `employee_id` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `key_admin_bus_idx` (`employee_id` ASC) VISIBLE,
  CONSTRAINT `key_admin_bus`
    FOREIGN KEY (`employee_id`)
    REFERENCES `dbms_project`.`employee_details` (`admin_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 38
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `dbms_project`.`bookings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbms_project`.`bookings` (
  `booking_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(45) NOT NULL,
  `bus` INT(11) NOT NULL,
  `dot` DATE NOT NULL,
  `seat_no` INT(11) NOT NULL,
  `booking_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` VARCHAR(45) NOT NULL DEFAULT 'L',
  `amount` INT(11) NOT NULL,
  PRIMARY KEY (`booking_id`),
  INDEX `key1_idx` (`user` ASC) VISIBLE,
  INDEX `key2_idx` (`bus` ASC) VISIBLE,
  INDEX `key3` (`bus` ASC) VISIBLE,
  CONSTRAINT `key1`
    FOREIGN KEY (`user`)
    REFERENCES `dbms_project`.`users` (`Mobile`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `key2`
    FOREIGN KEY (`bus`)
    REFERENCES `dbms_project`.`buses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 168
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `dbms_project`.`chart`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbms_project`.`chart` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `bus` INT(11) NOT NULL,
  `day` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `key1_idx` (`bus` ASC) VISIBLE,
  CONSTRAINT `key3`
    FOREIGN KEY (`bus`)
    REFERENCES `dbms_project`.`buses` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 60
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `dbms_project`.`cities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbms_project`.`cities` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `dbms_project`.`refunds`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbms_project`.`refunds` (
  `refund_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(45) NOT NULL,
  `amount` INT(11) NOT NULL,
  PRIMARY KEY (`refund_id`),
  INDEX `key_refund_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `key_refund`
    FOREIGN KEY (`user_id`)
    REFERENCES `dbms_project`.`users` (`Mobile`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 67
DEFAULT CHARACTER SET = latin1;

USE `dbms_project` ;

-- -----------------------------------------------------
-- Placeholder table for view `dbms_project`.`revenue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbms_project`.`revenue` (`mon` INT, `Month` INT, `Year` INT, `bus_id` INT, `Amount` INT, `Status` INT, `tickets` INT);

-- -----------------------------------------------------
-- procedure add_new_bus
-- -----------------------------------------------------

DELIMITER $$
USE `dbms_project`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_new_bus`(in a_id varchar(100),in name1 varchar(100),in org varchar(50),in dst varchar(50),in mobile varchar(50),in cap int,in price int,in category varchar(100),in timing time,in admin_id varchar(60))
BEGIN
INSERT INTO `dbms_project`.`buses` (`agent_id`, `driver_name`, `origin`, `dest`, `driver_mobile`, `capacity`, `available`, `price`, `category`, `timing`,`employee_id`) VALUES (a_id,name1, org, dst, mobile, cap, 'YES', price, category, timing,admin_id);
SELECT max(id) as id from buses where employee_id=admin_id; 
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure buses_on_route
-- -----------------------------------------------------

DELIMITER $$
USE `dbms_project`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buses_on_route`( in org varchar(40) ,in destination  varchar(40) , in dot1  date, in dot2 varchar(40) )
BEGIN
	IF dot1 !=  CURDATE()
    THEN
    SELECT * FROM 
    (SELECT * FROM buses where origin=org AND dest=destination AND AVAILABLE='YES' AND id in (SELECT bus from CHART WHERE DAY=dot2 ))t1
    left join
    (SELECT COUNT(*) AS filled, bus FROM bookings where dot=dot1 and status!='CNCL' AND bus in (SELECT id FROM buses where origin=org AND dest=destination AND AVAILABLE='YES' AND id in (SELECT bus from CHART WHERE DAY=dot2 )) group by (bus)) t2
    on (t1.id=t2.bus);
    END IF;
    IF dot1=CURDATE() THEN
    SELECT * FROM 
    (SELECT * FROM buses where origin=org AND dest=destination AND timing>(NOW()) AND AVAILABLE='YES' AND id in (SELECT bus from CHART WHERE DAY=dot2 ))t1
    left join
    (SELECT COUNT(*) AS filled, bus FROM bookings where dot=dot1 and status!='CNCL' AND bus in (SELECT id FROM buses where origin=org AND dest=destination AND AVAILABLE='YES' AND id in (SELECT bus from CHART WHERE DAY=dot2 )) group by (bus)) t2
    on (t1.id=t2.bus);
    END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_booking_details
-- -----------------------------------------------------

DELIMITER $$
USE `dbms_project`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_booking_details`( in b_id int)
BEGIN
SELECT buses.agent_id,bookings.user,buses.timing ,buses.price,bookings.dot from buses JOIN bookings ON bookings.bus=buses.id AND booking_id=b_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_admin
-- -----------------------------------------------------

DELIMITER $$
USE `dbms_project`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_admin`(in role varchar(50) , in id varchar(50) , in name varchar(50) , in age int, in doj date, in city1 varchar(50), in pass varchar(250), in salary int , in staff int, in rem_amount int)
BEGIN
INSERT INTO admin values (id,pass);
INSERT INTO employee_details values (id,name,age,doj,salary,city1,staff,role);
UPDATE employee_details SET staff_amount=staff_amount-1 WHERE city=city1 and staff_amount>0 ;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure show_bookings
-- -----------------------------------------------------

DELIMITER $$
USE `dbms_project`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `show_bookings`(mobile varchar(255))
BEGIN
	SELECT t2.booking_id,t2.user,t1.price,t1.category,t1.agent_id,t1.origin,t1.dest,t1.timing,t2.seat_no,t2.dot FROM buses t1 INNER JOIN bookings t2 ON t1.id=t2.bus AND t2.user=mobile AND t2.status='C';
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure show_seats
-- -----------------------------------------------------

DELIMITER $$
USE `dbms_project`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `show_seats`(id1 INT, dot1 DATE)
BEGIN
	SELECT seat_no AS booked from BOOKINGS where bus=id1 and dot=dot1 and status!='CNCL';
    SELECT * from buses where id=id1;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `dbms_project`.`revenue`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dbms_project`.`revenue`;
USE `dbms_project`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `dbms_project`.`revenue` AS select month(`dbms_project`.`bookings`.`dot`) AS `mon`,monthname(`dbms_project`.`bookings`.`dot`) AS `Month`,year(`dbms_project`.`bookings`.`dot`) AS `Year`,`dbms_project`.`bookings`.`bus` AS `bus_id`,sum(`dbms_project`.`bookings`.`amount`) AS `Amount`,`dbms_project`.`bookings`.`status` AS `Status`,count(0) AS `tickets` from `dbms_project`.`bookings` where ((`dbms_project`.`bookings`.`status` = 'C') or (`dbms_project`.`bookings`.`status` = 'CNCL')) group by `dbms_project`.`bookings`.`bus`,monthname(`dbms_project`.`bookings`.`dot`),year(`dbms_project`.`bookings`.`dot`),`dbms_project`.`bookings`.`status` order by `mon`;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
