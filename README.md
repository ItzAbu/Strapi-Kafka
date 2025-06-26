# Strapi-Kafka
 kafka implementation

//Funzionamento
Alla creazione di un pub, viene salvata la notifica di creazione su kafka tramite un producer.
Un consumer (in questo caso sempre su strapi ma si possono usare microcontrollori) in modo persistente (kafka in base al traffico, invia le richieste) processa i messaggi.
Questo progetto salva tutti i dati processati tramite draft / published su new-entry-pub e una volta pubblicato li salva su pub.

NECESSARIO OPENSSL

//Librerie necessarie
kafkajs -> `npm install kafkajs`
cron -> `npm install cron`

//Strapi login 
email: `StrapiProject@strapi.it`
password: `Strapi1234`

//CONFIGURAZIONE SERVIZIO SSL
 1. Creare i certificati tramite `generatore.bat` -> cambiare `set PASSWORD=password123` la password che si vuole mettere
 2. Su strapi va sistemato l'accesso su kafka -> `my-project\src\api\new-entry-pub\services\new-entry-pub.js`
 3. `const kafka = new Kafka({`
   `clientId: 'js-client',`
  `brokers: ['localhost:9093'],`
  `ssl: {`
    `rejectUnauthorized: true, `
   ` ca: [fs.readFileSync('./../KafkaSetup/certs/ca.crt')], //<-- Sistema qui`
    `key: fs.readFileSync('./../KafkaSetup/certs/server.key'), //<-- Sistema qui`
    `cert: fs.readFileSync('./../KafkaSetup/certs/server.crt'), //<-- Sistema qui`
    `servername: 'kafka'`
 ` }`
`})`

 STEP BY STEP 
 1. Avvia Kafka con AKHQ -> `cd ./kafkasetup & docker-compose up -d`
 2. AKHQ è una UI per kafka visitabile da `localhost:8080` -> Creare i 2 topic `pub.create` e `pub.update`
 3. Avvia strapi -> `cd ./my-project & npm run develop`
 4. Per creare un nuovo pub, creare un api token `ip:port/admin/settings/api-tokens` con Full Access (si puo cambiare in solo newPub)
 5. Con il nuovo Api Token si può creare un nuovo POST `postrequest.http` (Modificare e mettere l'api key prima)

    PER PIU INFO/BUG SCRIVERMI SU DISCORD -> `abu.was.taken`

-----------
AKHQ UI
-----------

![image](https://github.com/user-attachments/assets/6b488131-ea4d-4cf6-adc5-ea405a475476)

----------
STRAPI UI
----------

![image](https://github.com/user-attachments/assets/bf5b36ba-0038-4014-b09e-08989c901449)



