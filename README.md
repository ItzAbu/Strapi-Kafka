# Strapi-Kafka
 kafka implementation

//Funzionamento
Alla creazione di un pub, viene salvata la notifica di creazione su kafka tramite un producer.
Un consumer (in questo caso sempre su strapi ma si possono usare microcontrollori) in modo persistente (kafka in base al traffico, invia le richieste) processa i messaggi.
Questo progetto salva tutti i dati processati tramite draft / published su new-entry-pub e una volta pubblicato li salva su pub.

//Librerie necessarie
kafkajs -> `npm install kafkajs`
cron -> `npm install cron`

//Strapi login 
email: `StrapiProject@strapi.it`
password: `Strapi1234`


 STEP BY STEP 
 1. Avvia Kafka con AKHQ -> `cd ./kafkasetup | docker-compose up -d`
 2. AKHQ è una UI per kafka visitabile da `localhost:8080` -> Creare i 2 topic `pub.create` e `pub.update`
 3. Avvia strapi -> `cd ./my-project | npm run develop`
 4. Per verificare il funzionamento, in una console apparte si puo creare un pub -> `Invoke-RestMethod -Uri http://localhost:1337/api/pubs/newPub -Method POST -ContentType "application/json" -Body '{"name":"Nuovo18","address":"Via del Vaticano","avgPrice":19}'`

    PER PIU INFO/BUG SCRIVERMI SU DISCORD -> `abu.was.taken`

-----------
AKHQ UI
-----------

![image](https://github.com/user-attachments/assets/6b488131-ea4d-4cf6-adc5-ea405a475476)

----------
STRAPI UI
----------

![image](https://github.com/user-attachments/assets/bf5b36ba-0038-4014-b09e-08989c901449)



