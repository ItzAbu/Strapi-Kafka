'use strict';

/**
 * new-entry-pub service
 */

const { createCoreService } = require('@strapi/strapi').factories;

const { Kafka } = require('kafkajs');
const fs = require('fs');

const kafka = new Kafka({
  clientId: 'js-client',
  brokers: ['localhost:9093'],
  ssl: {
    rejectUnauthorized: true, 
    ca: [fs.readFileSync('./../KafkaSetup/certs/ca.crt')],
    key: fs.readFileSync('./../KafkaSetup/certs/server.key'), 
    cert: fs.readFileSync('./../KafkaSetup/certs/server.crt'),
    servername: 'kafka'
  },
  sasl: {
    mechanism: 'scram-sha-256', // o 'scram-sha-512' se configurato così su Kafka
    username: 'device1',
    password: 'api_key_123456'
  }
})

const producer = kafka.producer()

const consumer = kafka.consumer({ groupId: 'noti-engine'});

var lastExecutionTime = 0;

module.exports = createCoreService('api::new-entry-pub.new-entry-pub', ({strapi}) => ({
    async newNoti(topic, data, notificationTypepubData) {
        try {
            

            //Saving the notification in the database
            const entry = await strapi.entityService.create('api::new-entry-pub.new-entry-pub', {
                data: {
                    name: data.attributes.name,
                    address: data.attributes.address,
                    avgPrice: data.attributes.avgPrice,
                    picture: data.attributes.picture,
                    publishedAt: null,
                    status: 'draft',
                }
                
            })

            await producer.connect()
            const message = {
            value: JSON.stringify({
                data: entry,
                notificationTypepubData
                
            }),
            topic,
            }
            await producer.send({
            topic,
            messages: [message]
            })
            console.log(`Message sent to topic ${topic}:`, message)

            console.log('Notification saved in the database:', message.value)

        } catch (error) {
            console.error('Error sending message to Kafka:', error)
        } finally {
            await producer.disconnect()
        }
    },

    async update(id, data) {
        const entry = await super.update(id, data);
        return entry;
    },


    async completeNoti(topic) {
        console.log('Starting to consume messages from Kafka...');
        await consumer.connect();
        await consumer.subscribe({ topic: topic, fromBeginning: true });

        try {
            await consumer.run({
                eachMessage: async ({ topic, message }) => {
                    const { data, notificationTypepubData} = JSON.parse(message.value.toString())
                    console.log(`QUI: Received message from topic ${topic}:`, data)
                    // Handle the consumed message here

                    console.log(`Processing message for pub ID: ${data.id}`)

                    const pub = await strapi.entityService.create('api::pub.pub',{
                        data: {
                            name: data.name,
                            address: data.address,
                            avgPrice: data.avgPrice,
                            picture: data.picture,
                            entry_pub: data.id,
                            publishedAt: null,
                            status: 'draft',
                        }
                        
                    })

                    await strapi.entityService.update('api::new-entry-pub.new-entry-pub', data.id, {
                        data: {
                            status: 'published',
                            publishedAt: new Date(),
                            sendAt: new Date(),
                            pub_id: pub.id,
                        }
                    });

                    console.log(`Pub created with ID: ${pub.id} and linked to entry_pub ID: ${data.id}`)
                    console.log(`Notification type pub data:`, notificationTypepubData)

                    
                }
                
            })

            console.log('Consumer is running and listening for messages...')
            
        } catch (error) {
            console.error('Error consuming messages from Kafka:', error)
        }
    }

    
}));
