

-- testli.categories definition



CREATE TABLE `categories` (

  `id` int unsigned NOT NULL AUTO_INCREMENT,

  `org_id` int unsigned NOT NULL,

  `parent_id` int DEFAULT NULL,

  `title` varchar(255) DEFAULT NULL,

  `description` varchar(255) DEFAULT NULL,

  `meta_title` varchar(200) DEFAULT NULL,

  `slug` varchar(255) NOT NULL,

  `meta_keyword` varchar(255) DEFAULT NULL,

  `meta_description` varchar(255) DEFAULT NULL,

  `status` tinyint(1) NOT NULL DEFAULT '0',

  `show_menu` tinyint(1) DEFAULT '0',

  `is_parent_id` tinyint(1) NOT NULL DEFAULT '0',

  `is_show_home` tinyint(1) NOT NULL DEFAULT '0',

  `icon` varchar(255) NOT NULL,

  `position` int NOT NULL,

  `created_by` int DEFAULT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `modified_by` int DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),

  UNIQUE KEY `slug` (`slug`),

  KEY `org_id` (`org_id`)

) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb3;





-- testli.complexity definition



CREATE TABLE `complexity` (

  `id` int NOT NULL,

  `name` varchar(30) NOT NULL,

  `type` varchar(30) NOT NULL,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='question complexity';





-- testli.countries definition



CREATE TABLE `countries` (

  `id` int unsigned NOT NULL AUTO_INCREMENT,

  `country_short_code` varchar(10) DEFAULT NULL,

  `country_name` varchar(50) DEFAULT NULL,

  `country_code` varchar(50) DEFAULT NULL,

  `status` tinyint NOT NULL DEFAULT '0',

  PRIMARY KEY (`id`),

  KEY `country_short_code` (`country_short_code`)

) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8mb3;





-- testli.`groups` definition



CREATE TABLE `groups` (

  `id` mediumint unsigned NOT NULL AUTO_INCREMENT,

  `name` varchar(20) NOT NULL,

  `description` varchar(100) NOT NULL,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;





-- testli.login_attempts definition



CREATE TABLE `login_attempts` (

  `id` int unsigned NOT NULL AUTO_INCREMENT,

  `ip_address` varchar(45) NOT NULL,

  `login` varchar(100) NOT NULL,

  `time` int unsigned DEFAULT NULL,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb3;





-- testli.membership definition



CREATE TABLE `membership` (

  `id` int unsigned NOT NULL AUTO_INCREMENT,

  `org_id` int DEFAULT NULL,

  `membership_type` varchar(255) DEFAULT NULL,

  `description` varchar(255) DEFAULT NULL,

  `price` decimal(10,2) NOT NULL DEFAULT '0.00',

  `days` int DEFAULT '0',

  `period` varchar(1) DEFAULT 'D',

  `trial` tinyint(1) NOT NULL DEFAULT '0',

  `status` tinyint(1) DEFAULT '0',

  `created_by` int DEFAULT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `modified_by` int DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;





-- testli.org_provider_relation definition



CREATE TABLE `org_provider_relation` (

  `id` int NOT NULL,

  `provider_id` int NOT NULL,

  `org_id` int NOT NULL,

  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,

  `created_by` int NOT NULL,

  `modified_date` datetime NOT NULL,

  `modified_by` int NOT NULL,

  PRIMARY KEY (`id`),

  KEY `provider_id` (`provider_id`),

  KEY `org_id` (`org_id`)

) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Orgnization Provider Relation';





-- testli.organisation definition



CREATE TABLE `organisation` (

  `id` int unsigned NOT NULL,

  `org_name` varchar(200) DEFAULT NULL,

  `address` varchar(200) DEFAULT NULL,

  `org_logo` varchar(255) DEFAULT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `created_by` int DEFAULT NULL,

  `modified_by` int DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '2=deleted',

  UNIQUE KEY `org_id` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=latin1;





-- testli.question_categories definition



CREATE TABLE `question_categories` (

  `id` int unsigned NOT NULL AUTO_INCREMENT,

  `question_id` int unsigned DEFAULT NULL,

  `category_id` int unsigned DEFAULT NULL,

  `created_by` int DEFAULT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `modified_by` int DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=231 DEFAULT CHARSET=latin1;





-- testli.question_set definition



CREATE TABLE `question_set` (

  `id` int unsigned NOT NULL,

  `org_id` int DEFAULT NULL,

  `title` varchar(255) DEFAULT NULL,

  `question_set_url` varchar(255) DEFAULT NULL,

  `image` varchar(255) DEFAULT NULL,

  `author` varchar(200) DEFAULT NULL,

  `short_desc` varchar(255) NOT NULL,

  `description` text,

  `start_time` time DEFAULT NULL,

  `end_time` time DEFAULT NULL,

  `start_date` date DEFAULT NULL,

  `end_date` date DEFAULT NULL,

  `time_duration` varchar(100) DEFAULT NULL,

  `no_of_question` int NOT NULL,

  `status_id` int DEFAULT NULL,

  `is_demo` tinyint(1) NOT NULL DEFAULT '0',

  `created_by` int DEFAULT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `modified_by` int DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB DEFAULT CHARSET=latin1;





-- testli.question_set_bkup definition



CREATE TABLE `question_set_bkup` (

  `id` int unsigned NOT NULL AUTO_INCREMENT,

  `org_id` int DEFAULT NULL,

  `title` varchar(255) DEFAULT NULL,

  `question_set_url` varchar(255) DEFAULT NULL,

  `image` varchar(255) DEFAULT NULL,

  `author` varchar(200) DEFAULT NULL,

  `short_desc` varchar(255) NOT NULL,

  `description` text,

  `start_time` time DEFAULT NULL,

  `end_time` time DEFAULT NULL,

  `start_date` date DEFAULT NULL COMMENT 'Start Date',

  `end_date` date DEFAULT NULL COMMENT 'End Date . This will use for expired date for question set',

  `time_duration` varchar(100) DEFAULT NULL,

  `no_of_question` int NOT NULL,

  `status_id` int DEFAULT NULL,

  `is_demo` tinyint(1) NOT NULL DEFAULT '0',

  `created_by` varchar(10) DEFAULT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `modified_by` varchar(10) DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `totalmarks` int DEFAULT '0',

  `pass_percentage` double DEFAULT '0',

  `tags` varchar(200) DEFAULT NULL,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;





-- testli.question_type definition



CREATE TABLE `question_type` (

  `id` int unsigned NOT NULL AUTO_INCREMENT,

  `type` varchar(100) DEFAULT NULL,

  `created_by` int DEFAULT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `modified_by` int DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `status_id` tinyint(1) DEFAULT NULL,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;





-- testli.user_info definition



CREATE TABLE `user_info` (

  `id` int NOT NULL,

  `gender` varchar(11) DEFAULT NULL,

  `dob` date DEFAULT NULL,

  `address1` varchar(155) DEFAULT NULL,

  `address2` varchar(155) DEFAULT NULL,

  `country_id` int DEFAULT NULL,

  `state_id` int DEFAULT NULL,

  `city_id` int DEFAULT NULL,

  `zipcode` varchar(11) DEFAULT NULL,

  `education` varchar(25) DEFAULT NULL,

  `other_education` varchar(25) DEFAULT NULL,

  `email` varchar(100) DEFAULT NULL

) ENGINE=InnoDB DEFAULT CHARSET=latin1;





-- testli.user_membership_details definition



CREATE TABLE `user_membership_details` (

  `id` int NOT NULL AUTO_INCREMENT,

  `user_id` int NOT NULL,

  `membership_id` int NOT NULL,

  `invoiceid` varchar(25) DEFAULT NULL,

  `first_name` varchar(100) DEFAULT NULL,

  `last_name` varchar(100) DEFAULT NULL,

  `mobile_no` varchar(15) DEFAULT NULL,

  `email` varchar(255) DEFAULT NULL,

  `address` varchar(255) DEFAULT NULL,

  `country` varchar(15) DEFAULT NULL,

  `state` varchar(15) DEFAULT NULL,

  `city` varchar(15) DEFAULT NULL,

  `pincode` varchar(10) DEFAULT NULL,

  `total_amount` decimal(10,2) DEFAULT NULL,

  `net_amount` decimal(10,2) DEFAULT NULL,

  `status` tinyint DEFAULT '1',

  `expiry_date` date DEFAULT NULL,

  `payment_date` date DEFAULT NULL,

  `payment_time` time DEFAULT NULL,

  `payment_mode` varchar(50) DEFAULT NULL,

  `payment_id` varchar(50) DEFAULT NULL,

  `payment_status` varchar(25) DEFAULT NULL,

  `payment_type` varchar(25) DEFAULT NULL,

  `message` varchar(100) DEFAULT NULL,

  `tx_msg` varchar(100) DEFAULT NULL,

  `tx_time` varchar(100) DEFAULT NULL,

  `created_at` datetime DEFAULT NULL,

  `created_by` int DEFAULT NULL,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=latin1;





-- testli.user_provider_relation definition



CREATE TABLE `user_provider_relation` (

  `id` int NOT NULL,

  `user_id` int unsigned NOT NULL,

  `provider_id` int unsigned NOT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `created_by` int DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `modified_by` int DEFAULT NULL

) ENGINE=InnoDB DEFAULT CHARSET=latin1;





-- testli.user_test_result definition



CREATE TABLE `user_test_result` (

  `id` int NOT NULL AUTO_INCREMENT,

  `org_id` int DEFAULT NULL,

  `user_id` int DEFAULT NULL,

  `question_set_id` int DEFAULT NULL,

  `total_question` tinyint DEFAULT NULL,

  `total_answered` tinyint DEFAULT NULL,

  `total_not_answered` tinyint DEFAULT NULL,

  `total_reviewed` tinyint DEFAULT NULL,

  `total_not_visited` tinyint DEFAULT NULL,

  `percentage` decimal(2,2) DEFAULT NULL,

  `marks_obtained` decimal(5,2) DEFAULT NULL,

  `date` date DEFAULT NULL,

  `flag` int DEFAULT NULL,

  `created_by` int DEFAULT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `modified_by` int DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `status` int unsigned NOT NULL COMMENT '0 - Not Started , 1 -Submitted(Completed)  ,  2 - In Progress',

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;





-- testli.users definition



CREATE TABLE `users` (

  `id` int unsigned NOT NULL AUTO_INCREMENT,

  `ip_address` varchar(45) NOT NULL,

  `username` varchar(100) DEFAULT NULL,

  `password` varchar(255) NOT NULL,

  `email` varchar(254) NOT NULL,

  `activation_selector` varchar(255) DEFAULT NULL,

  `activation_code` varchar(255) DEFAULT NULL,

  `forgotten_password_selector` varchar(255) DEFAULT NULL,

  `forgotten_password_code` varchar(255) DEFAULT NULL,

  `forgotten_password_time` int unsigned DEFAULT NULL,

  `remember_selector` varchar(255) DEFAULT NULL,

  `remember_code` varchar(255) DEFAULT NULL,

  `created_on` int unsigned NOT NULL,

  `last_login` int unsigned DEFAULT NULL,

  `active` tinyint unsigned DEFAULT NULL,

  `first_name` varchar(50) DEFAULT NULL,

  `last_name` varchar(50) DEFAULT NULL,

  `company` varchar(100) DEFAULT NULL,

  `phone` varchar(20) DEFAULT NULL,

  `profile_pic` varchar(255) DEFAULT NULL,

  `created_by` int DEFAULT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `modified_by` int DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `is_delete` tinyint(1) NOT NULL DEFAULT '0',

  PRIMARY KEY (`id`),

  UNIQUE KEY `uc_email` (`email`),

  UNIQUE KEY `uc_activation_selector` (`activation_selector`),

  UNIQUE KEY `uc_forgotten_password_selector` (`forgotten_password_selector`),

  UNIQUE KEY `uc_remember_selector` (`remember_selector`)

) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb3;





-- testli.org_user_relation definition



CREATE TABLE `org_user_relation` (

  `id` int NOT NULL AUTO_INCREMENT,

  `user_id` int unsigned NOT NULL,

  `org_id` int unsigned NOT NULL,

  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `created_by` int DEFAULT NULL,

  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP,

  `modified_by` int DEFAULT NULL,

  PRIMARY KEY (`id`),

  KEY `user_id` (`user_id`),

  KEY `org_id` (`org_id`),

  CONSTRAINT `org_user_relation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),

  CONSTRAINT `org_user_relation_ibfk_2` FOREIGN KEY (`org_id`) REFERENCES `organisation` (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;





-- testli.question_master definition



CREATE TABLE `question_master` (

  `id` int unsigned NOT NULL AUTO_INCREMENT,

  `org_id` int DEFAULT NULL,

  `question` varchar(1000) NOT NULL,

  `description` mediumtext NOT NULL,

  `question_type_id` int unsigned DEFAULT NULL,

  `status_id` tinyint(1) DEFAULT NULL,

  `complexity` enum('easy','normal','hard','medium','killer',

...


