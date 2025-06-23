# Strapi-Kafka
 kafka implementation

//Librerie necessarie
kafkajs -> `npm install kafkajs`
cron -> `npm install cron`


 STEP BY STEP 
 1. Avvia Kafka con AKHQ -> `cd ./kafkasetup & docker-compose up -d`
 2. AKHQ è una UI per kafka visitabile da `localhost:8080` -> Creare i 2 topic `pub.create` e `pub.update`
 3. Avvia strapi -> `cd ./my-project & npm run develop`
 4. Per verificare il funzionamento, in una console apparte si puo creare un pub -> `Invoke-RestMethod -Uri http://localhost:1337/api/pubs/newPub -Method POST -ContentType "application/json" -Body '{"name":"Nuovo18","address":"Via del Vaticano","avgPrice":19}'`

    PER PIU INFO SCRIVERMI SU DISCORD

-----------
AKHQ UI
-----------

![image](https://github.com/user-attachments/assets/882fb7f7-497a-4cee-b342-fd15dcc84d35)

----------
STRAPI UI
----------


