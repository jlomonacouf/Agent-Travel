

SELECT * FROM AgentTravel.Users;

-- Creating 5 user profiles and email codes 
--  Password Hash: '$2b$10$V6nMraVPQHWIS0wjJVMQlugn1.UBMu91L3FH8oeMCL6CLOqa4Ikpy'
--  Password:  Password321 

INSERT INTO AgentTravel.Users (id, username, first_name, last_name,email, email_verified,phone_number,password,followers, following, created_at)  VALUES ( 1, 'Detienne20', 'Dania', 'Etienne', 'detienne20@ufl.edu', 0, '305-922-7121','$2b$10$V6nMraVPQHWIS0wjJVMQlugn1.UBMu91L3FH8oeMCL6CLOqa4Ikpy',0,0, '2020-04-06');

INSERT INTO AgentTravel.EmailCode (user_id, email, code, created_at) Values (1, 'detienne20@ufl.edu','VDvZCFknSc', '2020-04-06');  


INSERT INTO AgentTravel.Users (id,username, first_name, last_name,email, email_verified,phone_number,password,followers,following,created_at) 
    VALUES (2, 'Gremlin', 'Nickan', 'Hussaini', 'n.hussaini@ufl.edu', 0, '786-999-4125','$2b$10$V6nMraVPQHWIS0wjJVMQlugn1.UBMu91L3FH8oeMCL6CLOqa4Ikpy',0,0,'2020-04-06' );

INSERT INTO AgentTravel.EmailCode (user_id, email, code, created_at) Values (2, 'n.hussaini@ufl.edu','kvaBOl6xcy', '2020-04-06');  



INSERT INTO AgentTravel.Users(id,username, first_name, last_name,email, email_verified,phone_number,password,followers,following,created_at) 
    VALUES (3, 'Ophillia', 'Angely', 'Etienne', 'angely.guzman001@mymdc.net', 0, '786-283-0137','$2b$10$V6nMraVPQHWIS0wjJVMQlugn1.UBMu91L3FH8oeMCL6CLOqa4Ikpy',0,0, '2020-04-06' );

INSERT INTO AgentTravel.EmailCode (user_id, email, code, created_at) Values (3, 'angely.guzman001@mymdc.net','LoqNnERcqV', '2020-04-06');  



INSERT INTO AgentTravel.Users(id,username, first_name, last_name,email, email_verified,phone_number,password,followers,following,created_at) 
    VALUES (4, 'JLo', 'Justin', 'LoMonaco', 'justinpat.lomonaco@gmail.com', 0, '904-465-6071','$2b$10$V6nMraVPQHWIS0wjJVMQlugn1.UBMu91L3FH8oeMCL6CLOqa4Ikpy',0,0, '2020-04-06' );

INSERT INTO AgentTravel.EmailCode (user_id, email, code, created_at) Values (4, 'justinpat.lomonaco@gmail.com','k6bQ9lsizk', '2020-04-06');  



INSERT INTO AgentTravel.Users(id,username, first_name, last_name,email, email_verified,phone_number,password,followers,following,created_at) 
    VALUES (5, 'SamG', 'Samantha', 'Garcia', 'samangarc22@gmail.com', 0, '305-965-1895','$2b$10$V6nMraVPQHWIS0wjJVMQlugn1.UBMu91L3FH8oeMCL6CLOqa4Ikpy',0,0, '2020-04-06' );

INSERT INTO AgentTravel.EmailCode (user_id, email, code, created_at) Values (5, 'samangarc22@gmail.com','eo4WoltBji', '2020-04-06');  


SELECT * FROM AgentTravel.Users;



-- TO DO: 

-- Upload profile pictures for each user ???? 
    -- CAN ADD PHOTOS TO USER PROFILE OR HAVE ANOTHER TABLE -- Attribute. 
    -- Does the location table need to be populated before anything else? Not needed** 
    -- TAKEN TRIPS ? HOW DOES THAT WORK? taken attribute? 
    -- TRIPS does not have a private field, or start/end date or populate designation? 
    -- Likes not implemented ** 

    -- STRETCH GOALS : 
    -- NO RECOMMENDED TIME SAD ;/ 
    -- How do we show the routes to each user?

-- Populate locations table with 

-- Create 2 trips for users 1, and 2 : INSERT into AgentTravel.Trips (id, user_id, name, created_at) Values () 
        -- Add 3 cities with respective itineries to each trip ! Showcase VARIETY ( For example: international, local, national and different interests) ! 
                -- INSERT into : AgentTravel.Trip_Itinerary (trip_id, itinerary_id) Values ()
                -- Add hashtags:  INSERT INTO AgentTravel.Hashtag (id, hashtag) Values (); 
                -- Add pictures to itineries : INSERT INTO AgentTravel.Photos (id, itinerary_id,caption,image_path, image_size) Values (); 
        
        -- Set taken trips : ones user create, other users 
                -- Allow for user 1 to have taken a trip from another user, but not be following them ?? REVIEW  
                -- User 2 should be following the other users they have used the itenaries from : INSERT INTO AgentTravel.Followers (user1_id, user2_id) Values () 


-- Create 2 trips for user 3 
        -- Set both trips to be taken in the future?? 
        -- Set one trip as private  
        -- Add 3 cities with respective itineries to each trip ,add hashtags, showcase variety( For example: international, local, national and different interests) 
        -- Set taken trips : Other users 


--  Create 3 trips for users 4 and 5 
        --  Set the 3rd trip to private 
        --  Add 3 cities with respective itineries to each trip and add hashtags. Be sure to Showcase variety( For example: international, local, national and different interests) 
        --  Set taken trips : ones user create, other users 

--  Designate 4 trips as the popular ones. 
--  Set users to be following each other, update followers and following count 


--  TRIPS?
    -- Users should be presented with cities nearby to add to the trip or visit. 
    -- Users should be able to search for things to do in a city and add to their trip. 
        -- This means that we might need to populate location before anything else 

