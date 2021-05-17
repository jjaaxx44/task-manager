//CRUD
// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const MongoClient = mongodb.MongoClient

const { MongoClient, ObjectID } = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to DB');
    }

    const db = client.db(databaseName)
})