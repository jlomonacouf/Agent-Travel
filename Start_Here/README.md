#Database: Amazon RDS 
#Tested with MySQL Workbench and Apache Postman


#Downloads: 
    npm install –save express body-parser jsonwebtoken 

    Primary reference: https://www.dotnettricks.com/learn/nodejs/token-based-authentication-using-json-web-token

    Secondary reference: https://arjunphp.com/use-jwt-json-web-token-express-js/

#Running sql scrips :

        In MySQL WorkBench Click Run SQL Script, select Populate DBTables. 

        Reference:  https://stackoverflow.com/questions/8940230/how-to-run-sql-script-in-mysql



#Tables 

Table: Comments
    
    id int(11) AI PK 
    user_id int(11) 
    itinerary_id int(11) 
    comment tinytext


Table: EmailCode

    user_id int(11) PK 
    email varchar(45) 
    code varchar(10) 
    created_at date

Table: Followers

    user1_id int(11) PK 
    user2_id


Table: Hashtag

    id int(11) AI PK 
    hashtag varchar(255)

Table: Itineraries

    id int(11) AI PK 
    user_id int(11) 
    name varchar(45) 
    text mediumtext 
    created_at date 
    country varchar(45) 
    city varchar(45) 
    region varchar(45)


Table: Itinerary_Hashtag

    itinerary_id int(11) PK 
    hashtag_id int(11) 

Table: Location

    id int(11) AI PK 
    country varchar(45) 
    city varchar(45) 
    region varchar(45)

Table: Photos

    id int(11) AI PK 
    itinerary_id int(11) 
    caption tinytext 
    image_path varchar(100) 
    image_size varchar(45)

Table: Trip_Itinerary

    trip_id int(11) PK 
    itinerary_id

Table: Trips

    id int(11) AI PK 
    user_id int(11) 
    name varchar(45) 
    created_at date

Table: Users

    id int(11) AI PK 
    username varchar(30) 
    first_name varchar(20) 
    last_name varchar(30) 
    email varchar(45) 
    email_verified bit(1) 
    phone_number varchar(15) 
    password varchar(70) 
    followers int(11) 
    following int(11) 
    created_at date

