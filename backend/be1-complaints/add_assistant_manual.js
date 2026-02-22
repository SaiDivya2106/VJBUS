const { MongoClient } = require('mongodb');
require('dotenv').config();

async function addAssistant() {
    const uri = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(process.env.DB_NAME || 'complaintsdb'); // Defaulting if env not set
        const assistantsCollection = db.collection('assistantsCollection');

        const email = '22071a1284@vnrvjiet.in';

        const existing = await assistantsCollection.findOne({ email });

        if (existing) {
            console.log(`Assistant ${email} already exists.`);
        } else {
            await assistantsCollection.insertOne({
                email: email,
                name: 'Requested Assistant',
                createdAt: new Date()
            });
            console.log(`Successfully added assistant: ${email}`);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

addAssistant();
