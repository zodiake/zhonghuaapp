-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `advertise`
--

DROP TABLE IF EXISTS `advertise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `advertise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) DEFAULT NULL,
  `content` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advertise`
--

LOCK TABLES `advertise` WRITE;
/*!40000 ALTER TABLE `advertise` DISABLE KEYS */;
/*!40000 ALTER TABLE `advertise` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cargoo_name`
--

DROP TABLE IF EXISTS `cargoo_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cargoo_name` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(15) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `activate` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `cargoo_name_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `cargoo_name` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargoo_name`
--

LOCK TABLES `cargoo_name` WRITE;
/*!40000 ALTER TABLE `cargoo_name` DISABLE KEYS */;
INSERT INTO `cargoo_name` VALUES (1,'汽油',NULL,1),(2,'菜油',NULL,1),(3,'化工品',NULL,1),(4,'其他',NULL,1),(5,'secondCategory1',1,1),(6,'secondCategory2',2,1),(7,'seco2',4,1),(8,'secondCategory4',4,1),(9,'123',1,NULL),(10,'123',3,NULL),(11,'123',1,NULL),(12,'aaa',2,NULL),(13,'asdf',1,1),(14,'888',1,1),(15,'123',2,1),(16,'333',1,1),(17,'444',1,1),(18,'456',2,1);
/*!40000 ALTER TABLE `cargoo_name` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `common_consignee`
--

DROP TABLE IF EXISTS `common_consignee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `common_consignee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consignee_id` int(11) DEFAULT NULL,
  `consignor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `consignee_id` (`consignee_id`),
  KEY `consignor_id` (`consignor_id`),
  CONSTRAINT `common_consignee_ibfk_1` FOREIGN KEY (`consignee_id`) REFERENCES `usr` (`id`),
  CONSTRAINT `common_consignee_ibfk_2` FOREIGN KEY (`consignor_id`) REFERENCES `usr` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `common_consignee`
--

LOCK TABLES `common_consignee` WRITE;
/*!40000 ALTER TABLE `common_consignee` DISABLE KEYS */;
INSERT INTO `common_consignee` VALUES (1,9,7),(2,10,8);
/*!40000 ALTER TABLE `common_consignee` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:16
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `order_gis`
--

DROP TABLE IF EXISTS `order_gis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_gis` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `longitude` varchar(11) DEFAULT NULL,
  `latitude` varchar(11) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_gis_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_gis`
--

LOCK TABLES `order_gis` WRITE;
/*!40000 ALTER TABLE `order_gis` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_gis` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` char(12) DEFAULT NULL,
  `license` varchar(15) DEFAULT NULL,
  `consignor` char(11) DEFAULT NULL,
  `consignee` char(11) DEFAULT NULL,
  `consignee_name` varchar(6) DEFAULT NULL,
  `company_name` varchar(50) DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `cargoo_name` int(11) DEFAULT NULL,
  `origin` varchar(100) DEFAULT NULL,
  `destination` varchar(100) DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `current_state` varchar(10) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `etd` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `type` char(4) DEFAULT NULL,
  `mobile` char(11) DEFAULT NULL,
  `app_or_out` smallint(6) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  KEY `cargoo_name` (`cargoo_name`),
  KEY `order_id_index` (`order_number`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`category`) REFERENCES `cargoo_name` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`cargoo_name`) REFERENCES `cargoo_name` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'aabbcc','沪A-123456','peter','tom','tom','haha',1,5,NULL,NULL,NULL,'待分配','2015-08-04 08:13:23','0000-00-00 00:00:00',NULL,NULL,1),(2,'aabbcc','沪A-123456','peter','tom','tom','haha',1,5,NULL,NULL,NULL,'待确认','2015-08-04 08:13:23','0000-00-00 00:00:00',NULL,NULL,1),(3,'aabbcc','沪A-123456','peter','tom','tom','haha',4,5,NULL,NULL,NULL,'运送中','2015-08-03 07:57:36','0000-00-00 00:00:00',NULL,NULL,1),(4,'aabbcc','沪A-123456','peter','tom','tom','haha',4,5,NULL,NULL,NULL,'已送达','2015-08-03 07:57:36','0000-00-00 00:00:00',NULL,NULL,1),(5,'79e49e827e7c','123','peter','mary','aaa','cc',1,5,'sh','bj',12,'运送中','2015-08-04 08:13:23','2013-03-04 04:14:51',NULL,'mary',1),(6,'511035144d34','1233','peter','mary','aaa','cc',1,5,'sh','bj',12,'已评价','2015-08-04 08:13:23','2013-03-04 04:14:51',NULL,NULL,1),(7,'462a90573a5c','12331','peter','mary22','aaa','cc22',1,5,'sh','bj',12,'待确认','2015-08-04 08:13:23','2013-03-04 04:14:51',NULL,'mary22',1),(8,'e33f3629cde5','123','peter','mary','aaa','cc',1,5,'sh','bj',12,'已拒绝','2015-08-04 08:13:23','2013-03-04 04:14:51',NULL,'mary',1),(9,'834febf2a305','123','peter','mary','aaa','cc',1,5,'sh','bj',12,'待分配','2015-08-04 08:13:23','2013-03-04 04:14:51',NULL,'mary',1),(10,'cddeeee77dcd','123','peter','mary','aaa','cc',1,5,'sh','bj',12,'待分配','2015-08-04 08:13:23','2013-03-04 04:14:51',NULL,'mary',1),(11,'6eb04164616f','123','peter','mary','aaa','cc',1,5,'sh','bj',12,'待分配','2015-08-04 08:13:23','2013-03-04 04:14:51',NULL,'mary',1),(12,'90074179847b','123','peter','mary','aaa','cc',1,5,'sh','bj',12,'待分配','2015-08-04 08:13:23','2013-03-04 04:14:51',NULL,'mary',1),(13,'1eafa7c7fe84','13817795070','13817795074','13817795070','刘军','沟沟壑壑',2,6,'刚刚回家看','法国户',10,'待分配','2015-08-05 07:01:22','2015-08-05 08:59:00',NULL,'13817795070',1),(14,'0cb96aa545bb','沪A123333','18616316816','18616316816','长河的','我会顶焦度计',2,6,'都不会顶焦度计','顶焦度计顶焦度计',464,'待分配','2015-08-05 07:15:23','2015-08-04 06:14:00',NULL,'18616316816',1),(15,'c3836aaa07e2','8767644','18717925572','18717921111','那些那','等你呢',2,6,'待机','小灰灰',11,'待分配','2015-08-05 07:16:16','2015-08-14 15:15:00',NULL,'18717921111',1),(16,'1ce49199d175','8767644','18717925572','18717921111','那些那','好像还是',4,8,'小聚','最近',14,'已送达','2015-08-05 09:22:48','2016-04-05 07:19:00',NULL,'18717921111',1),(17,'4951b2276307','8767644','18717925572','18717921111','那些那','书',4,8,'就','最近',14,'已送达','2015-08-05 09:28:55','2016-08-05 07:24:00',NULL,'18717921111',1),(18,'8168ac1ce1b0','8767644','18717925572','18717921111','那些那','书',4,8,'就','最近',14,'已送达','2015-08-05 09:57:50','2016-08-05 07:24:00',NULL,'18717921111',1),(19,'6665e0aa4c7d','8767644','18717925572','18717921111','那些那','书',4,8,'就','最近',14,'待分配','2015-08-05 07:25:50','2016-08-05 07:24:00',NULL,'18717921111',1),(20,'212d7376e55f','沪172838','18616316816','18000000000','子小大家','都或多或少',4,8,'是的决定','sisisudjdj',445,'待确认','2015-08-05 07:31:32','2015-08-04 07:19:00',NULL,'18000000000',1),(21,'fc296d11cfee','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待确认','2015-08-05 07:32:19','2015-08-04 07:19:00',NULL,'18000000000',1),(22,'a25ac06a7911','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待确认','2015-08-05 07:32:44','2015-08-04 07:19:00',NULL,'18000000000',1),(23,'4b3f208e0e09','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 07:32:50','2015-08-04 07:19:00',NULL,'18000000000',1),(24,'e635db5cfcb8','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 07:32:56','2015-08-04 07:19:00',NULL,'18000000000',1),(25,'4ba2888e2994','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待确认','2015-08-05 07:32:59','2015-08-04 07:19:00',NULL,'18000000000',1),(26,'52f0da62df7c','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 07:33:25','2015-08-04 07:19:00',NULL,'18000000000',1),(27,'636e6adf2233','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 07:33:45','2015-08-04 07:19:00',NULL,'18000000000',1),(28,'75d3cc7d2c70','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待确认','2015-08-05 07:33:59','2015-08-04 07:19:00',NULL,'18000000000',1),(29,'17738630a371','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 07:34:11','2015-08-04 07:19:00',NULL,'18000000000',1),(30,'e09df8ec2626','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待确认','2015-08-05 07:36:36','2015-08-04 07:19:00',NULL,'18000000000',1),(31,'6adb94f483e0','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待确认','2015-08-05 07:36:44','2015-08-04 07:19:00',NULL,'18000000000',1),(32,'32395d858989','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待确认','2015-08-05 07:36:59','2015-08-04 07:19:00',NULL,'18000000000',1),(33,'3d5109e63445','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待确认','2015-08-05 07:37:14','2015-08-04 07:19:00',NULL,'18000000000',1),(34,'f93814fc90e5','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 07:37:26','2015-08-04 07:19:00',NULL,'18000000000',1),(35,'f726488ef377','沪1727383838','18616316816','18000000000','子小大家','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 07:37:39','2015-08-04 07:19:00',NULL,'18000000000',1),(36,'d6e6f6edbe05','哈哈','18616316816','18600000000','上海','都或多或少',4,8,'是亟待解决的决定','sisisudjdj',445,'已送达','2015-08-05 09:47:01','2015-08-04 07:19:00',NULL,'18600000000',1),(37,'0d93170993fb','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 08:04:48','2015-08-04 07:19:00',NULL,'18600000000',1),(38,'d4f6e2a47b62','8767644','18717925572','18717921111','那些那','不想你',2,6,'吧，吧','不想回',16,'运送中','2015-08-05 09:57:56','2015-08-10 09:36:00',NULL,'18717921111',1),(39,'3e4996a92e1b','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'已送达','2015-08-05 09:59:38','2015-08-04 07:19:00',NULL,'18600000000',1),(40,'061a603dbd75','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 09:50:35','2015-08-04 07:19:00',NULL,'18600000000',1),(41,'ae01a84daec2','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 09:50:38','2015-08-04 07:19:00',NULL,'18600000000',1),(42,'2c3a262e6a2d','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 09:50:39','2015-08-04 07:19:00',NULL,'18600000000',1),(43,'a2d1de5c5702','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 09:50:41','2015-08-04 07:19:00',NULL,'18600000000',1),(44,'f74e143f8e4a','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 09:50:43','2015-08-04 07:19:00',NULL,'18600000000',1),(45,'c40618fe5663','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'运送中','2015-08-05 10:00:13','2015-08-04 07:19:00',NULL,'18600000000',1),(46,'4cc6290683d6','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 09:59:59','2015-08-04 07:19:00',NULL,'18600000000',1),(47,'d45e331348e1','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待确认','2015-08-05 10:00:01','2015-08-04 07:19:00',NULL,'18600000000',1),(48,'fdf8e14ea424','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 10:01:03','2015-08-04 07:19:00',NULL,'18600000000',1),(49,'b4e3c1a3d138','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待确认','2015-08-05 10:01:05','2015-08-04 07:19:00',NULL,'18600000000',1),(50,'ea6808642995','哈哈173738','18616316816','18600000000','上海','都或是的吧',4,8,'是亟待解决的决定','sisisudjdj',445,'待分配','2015-08-05 10:01:06','2015-08-04 07:19:00',NULL,'18600000000',1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `order_state`
--

DROP TABLE IF EXISTS `order_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_state` (
  `order_state_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `state_name` varchar(10) DEFAULT NULL,
  `img_url` char(52) DEFAULT NULL,
  `refuse_reason` char(1) DEFAULT NULL,
  `refuse_desc` varchar(200) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`order_state_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_state_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_state`
--

LOCK TABLES `order_state` WRITE;
/*!40000 ALTER TABLE `order_state` DISABLE KEYS */;
INSERT INTO `order_state` VALUES (1,1,'待分配',NULL,NULL,NULL,'2013-01-01 04:13:14',NULL),(2,1,'待确认',NULL,NULL,NULL,'2013-01-01 04:13:14',NULL),(3,1,'运送中',NULL,NULL,NULL,'2013-01-01 04:13:14',NULL),(4,1,'已送达',NULL,NULL,NULL,'2013-01-01 04:13:14',NULL),(5,5,NULL,NULL,NULL,NULL,'2015-08-03 07:59:33','peter'),(6,6,NULL,NULL,NULL,NULL,'2015-08-03 08:06:47','peter'),(7,7,NULL,NULL,NULL,NULL,'2015-08-03 08:08:06','peter'),(8,7,'运送中',NULL,NULL,NULL,'2015-08-03 08:19:20','mary'),(9,7,'运送中',NULL,NULL,NULL,'2015-08-03 08:25:11','mary'),(10,5,'运送中',NULL,NULL,NULL,'2015-08-03 08:28:11','mary'),(11,6,'已送达','uploads/201583/801d4f73dd8ba86539a8870b7c26d3d1.jpg',NULL,NULL,'2015-08-03 08:30:54','mary'),(19,8,NULL,NULL,NULL,NULL,'2015-08-03 09:20:49','peter'),(20,8,'已拒绝',NULL,'a','asdf','2015-08-03 09:22:39','mary'),(21,9,NULL,NULL,NULL,NULL,'2015-08-03 09:22:57','peter'),(24,6,'已评价',NULL,NULL,NULL,'2015-08-03 09:36:25',NULL),(25,6,'已评价',NULL,NULL,NULL,'2015-08-03 09:37:28',NULL),(26,6,'已评价',NULL,NULL,NULL,'2015-08-03 09:41:42',NULL),(27,10,NULL,NULL,NULL,NULL,'2015-08-03 10:02:11','peter'),(28,11,NULL,NULL,NULL,NULL,'2015-08-03 10:04:57','peter'),(29,12,'待分配',NULL,NULL,NULL,'2015-08-03 10:05:09','peter'),(30,12,'待确认',NULL,NULL,NULL,'2015-08-03 10:06:14','peter'),(31,12,'待分配',NULL,NULL,NULL,'2015-08-03 10:06:31','peter'),(32,13,'待分配',NULL,NULL,NULL,'2015-08-05 07:01:22','13817795074'),(33,14,'待分配',NULL,NULL,NULL,'2015-08-05 07:15:23','18616316816'),(34,15,'待分配',NULL,NULL,NULL,'2015-08-05 07:16:16','18717925572'),(35,16,'待确认',NULL,NULL,NULL,'2015-08-05 07:20:17','18717925572'),(36,17,'待确认',NULL,NULL,NULL,'2015-08-05 07:25:18','18717925572'),(37,18,'待确认',NULL,NULL,NULL,'2015-08-05 07:25:47','18717925572'),(38,19,'待分配',NULL,NULL,NULL,'2015-08-05 07:25:50','18717925572'),(39,20,'待确认',NULL,NULL,NULL,'2015-08-05 07:31:32','18616316816'),(40,21,'待确认',NULL,NULL,NULL,'2015-08-05 07:32:19','18616316816'),(41,22,'待确认',NULL,NULL,NULL,'2015-08-05 07:32:44','18616316816'),(42,23,'待分配',NULL,NULL,NULL,'2015-08-05 07:32:50','18616316816'),(43,24,'待分配',NULL,NULL,NULL,'2015-08-05 07:32:56','18616316816'),(44,25,'待确认',NULL,NULL,NULL,'2015-08-05 07:32:59','18616316816'),(45,26,'待分配',NULL,NULL,NULL,'2015-08-05 07:33:25','18616316816'),(46,27,'待分配',NULL,NULL,NULL,'2015-08-05 07:33:45','18616316816'),(47,28,'待确认',NULL,NULL,NULL,'2015-08-05 07:33:59','18616316816'),(48,29,'待分配',NULL,NULL,NULL,'2015-08-05 07:34:11','18616316816'),(49,30,'待确认',NULL,NULL,NULL,'2015-08-05 07:36:36','18616316816'),(50,31,'待确认',NULL,NULL,NULL,'2015-08-05 07:36:44','18616316816'),(51,32,'待确认',NULL,NULL,NULL,'2015-08-05 07:36:59','18616316816'),(52,33,'待确认',NULL,NULL,NULL,'2015-08-05 07:37:14','18616316816'),(53,34,'待分配',NULL,NULL,NULL,'2015-08-05 07:37:26','18616316816'),(54,35,'待分配',NULL,NULL,NULL,'2015-08-05 07:37:39','18616316816'),(55,36,'待确认',NULL,NULL,NULL,'2015-08-05 08:04:17','18616316816'),(56,37,'待分配',NULL,NULL,NULL,'2015-08-05 08:04:48','18616316816'),(57,16,'运送中',NULL,NULL,NULL,'2015-08-05 08:50:00','18717921111'),(58,16,'已送达',NULL,NULL,NULL,'2015-08-05 09:22:48','18717921111'),(59,17,'运送中',NULL,NULL,NULL,'2015-08-05 09:26:09','18717921111'),(60,17,'已送达',NULL,NULL,NULL,'2015-08-05 09:28:54','18717921111'),(61,38,'待确认',NULL,NULL,NULL,'2015-08-05 09:36:45','18717925572'),(62,39,'待确认',NULL,NULL,NULL,'2015-08-05 09:46:38','18616316816'),(63,36,'已送达',NULL,NULL,NULL,'2015-08-05 09:47:01','18600000000'),(64,18,'运送中',NULL,NULL,NULL,'2015-08-05 09:49:36','18717921111'),(65,40,'待分配',NULL,NULL,NULL,'2015-08-05 09:50:35','18616316816'),(66,41,'待分配',NULL,NULL,NULL,'2015-08-05 09:50:38','18616316816'),(67,42,'待分配',NULL,NULL,NULL,'2015-08-05 09:50:39','18616316816'),(68,43,'待分配',NULL,NULL,NULL,'2015-08-05 09:50:41','18616316816'),(69,44,'待分配',NULL,NULL,NULL,'2015-08-05 09:50:43','18616316816'),(70,45,'待确认',NULL,NULL,NULL,'2015-08-05 09:50:44','18616316816'),(71,39,'运送中',NULL,NULL,NULL,'2015-08-05 09:50:53','18600000000'),(72,18,'已送达',NULL,NULL,NULL,'2015-08-05 09:57:49','18717921111'),(73,38,'运送中',NULL,NULL,NULL,'2015-08-05 09:57:55','18717921111'),(74,39,'已送达',NULL,NULL,NULL,'2015-08-05 09:59:37','18600000000'),(75,46,'待分配',NULL,NULL,NULL,'2015-08-05 09:59:59','18616316816'),(76,47,'待确认',NULL,NULL,NULL,'2015-08-05 10:00:01','18616316816'),(77,45,'运送中',NULL,NULL,NULL,'2015-08-05 10:00:12','18600000000'),(78,48,'待分配',NULL,NULL,NULL,'2015-08-05 10:01:03','18616316816'),(79,49,'待确认',NULL,NULL,NULL,'2015-08-05 10:01:05','18616316816'),(80,50,'待分配',NULL,NULL,NULL,'2015-08-05 10:01:06','18616316816');
/*!40000 ALTER TABLE `order_state` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(100) DEFAULT NULL,
  `answer` varchar(1000) DEFAULT NULL,
  `activate` smallint(6) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `reviews_id` int(11) NOT NULL AUTO_INCREMENT,
  `consignor_id` int(11) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `level` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`reviews_id`),
  KEY `consignor_id` (`consignor_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`consignor_id`) REFERENCES `usr` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (12,2,'haha',6,1);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `scroll_image`
--

DROP TABLE IF EXISTS `scroll_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scroll_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_url` varchar(50) DEFAULT NULL,
  `image_href` varchar(20) DEFAULT NULL,
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scroll_image`
--

LOCK TABLES `scroll_image` WRITE;
/*!40000 ALTER TABLE `scroll_image` DISABLE KEYS */;
INSERT INTO `scroll_image` VALUES (1,'/uploads/banner.png','asdf','2015-08-05 06:28:00'),(2,'/uploads/banner.png','www.baidu.com','2015-08-05 05:47:18'),(3,'/uploads/banner.png','www.baidu.com','2015-08-05 05:47:18'),(4,'/uploads/banner.png','www.baidu.com','2015-08-05 05:47:18');
/*!40000 ALTER TABLE `scroll_image` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `suggestion`
--

DROP TABLE IF EXISTS `suggestion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suggestion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(200) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `consignor` char(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suggestion`
--

LOCK TABLES `suggestion` WRITE;
/*!40000 ALTER TABLE `suggestion` DISABLE KEYS */;
/*!40000 ALTER TABLE `suggestion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `usr_detail`
--

DROP TABLE IF EXISTS `usr_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usr_detail` (
  `id` int(11) NOT NULL DEFAULT '0',
  `detail_name` varchar(10) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `identified_number` char(18) DEFAULT NULL,
  `company_name1` varchar(50) DEFAULT NULL,
  `company_name2` varchar(50) DEFAULT NULL,
  `company_name3` varchar(50) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `praise` int(11) DEFAULT '0',
  `portrait` char(52) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `usr_detail_ibfk_1` FOREIGN KEY (`id`) REFERENCES `usr` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usr_detail`
--

LOCK TABLES `usr_detail` WRITE;
/*!40000 ALTER TABLE `usr_detail` DISABLE KEYS */;
INSERT INTO `usr_detail` VALUES (1,'tomeii','f',NULL,'company1','company2','company3','2015-08-03 07:57:36',0,NULL),(2,'peter lei','m',NULL,'company1','company2','company3','2015-08-03 07:57:36',0,NULL),(4,'mary lei','f',NULL,'company1','company2','company3','2015-08-03 09:41:42',1,NULL),(6,NULL,NULL,NULL,NULL,NULL,NULL,'2015-08-05 06:59:17',0,NULL),(7,NULL,NULL,NULL,NULL,NULL,NULL,'2015-08-05 06:59:33',0,NULL),(8,NULL,NULL,NULL,NULL,NULL,NULL,'2015-08-05 07:06:19',0,NULL),(9,'那些那','m','54546464949494','出乎','滴滴','毒素','2015-08-05 07:15:00',0,NULL),(10,NULL,NULL,NULL,NULL,NULL,NULL,'2015-08-05 07:56:12',0,NULL);
/*!40000 ALTER TABLE `usr_detail` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `usr`
--

DROP TABLE IF EXISTS `usr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usr` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(11) DEFAULT NULL,
  `password` char(64) DEFAULT NULL,
  `authority` varchar(20) DEFAULT NULL,
  `activate` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usr`
--

LOCK TABLES `usr` WRITE;
/*!40000 ALTER TABLE `usr` DISABLE KEYS */;
INSERT INTO `usr` VALUES (1,'tom','202cb962ac59075b964b07152d234b70','ROLE_CONSIGNEE',1),(2,'peter','202cb962ac59075b964b07152d234b70','ROLE_CONSIGNOR',1),(3,'admin','202cb962ac59075b964b07152d234b70','ROLE_ADMIN',1),(4,'mary','202cb962ac59075b964b07152d234b70','ROLE_CONSIGNEE',1),(5,'common','202cb962ac59075b964b07152d234b70','ROLE_COMMON',0),(6,'13817795074','e10adc3949ba59abbe56e057f20f883e','ROLE_CONSIGNOR',1),(7,'18717925572','0b4e7a0e5fe84ad35fb5f95b9ceeac79','ROLE_CONSIGNOR',1),(8,'18616316816','96e79218965eb72c92a549dd5a330112','ROLE_CONSIGNOR',1),(9,'18717921111','0b4e7a0e5fe84ad35fb5f95b9ceeac79','ROLE_CONSIGNEE',1),(10,'18600000000','96e79218965eb72c92a549dd5a330112','ROLE_CONSIGNEE',1);
/*!40000 ALTER TABLE `usr` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: 192.168.1.137    Database: zh
-- ------------------------------------------------------
-- Server version	5.6.25-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `license` varchar(15) DEFAULT NULL,
  `vehicle_type` varchar(10) DEFAULT NULL,
  `vehicle_length` varchar(10) DEFAULT NULL,
  `vehicle_weight` varchar(10) DEFAULT NULL,
  `usr_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usr_id` (`usr_id`),
  CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`usr_id`) REFERENCES `usr` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
INSERT INTO `vehicle` VALUES (1,'8767644','槽车','14','77',9);
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-06 10:24:15
