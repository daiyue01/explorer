




create_sql = 
```



CREATE DATABASE hacash_trsdb;




CREATE TABLE `settings` (
    `name` varchar(255) NOT NULL,
    `value` varchar(255) NOT NULL,
    PRIMARY KEY (`name`,`value`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;





  CREATE TABLE `transferlog` (
    `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
    `blockheight` int(4) unsigned NOT NULL DEFAULT '0',
    `fromaddr` varchar(255) NOT NULL,
    `toaddr` varchar(255) NOT NULL,
    `amountstr` varchar(255) NOT NULL,
    `timestamp` int(4) unsigned NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `blockheight` (`blockheight`,`fromaddr`,`toaddr`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;





  CREATE TABLE `diamondcount` (
    `address` char(34) NOT NULL,
    `count` int(4) unsigned NOT NULL DEFAULT 0,
    PRIMARY KEY (`address`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;




  

```


