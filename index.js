const express = require('express'); // Express server package
const bodyParser = require('body-parser'); // Helper package for parsing HTTP request bodies
const MongoClient = require('mongodb').MongoClient; // MongoDB client from MongoDB package
const PizzaCollection = require('./PizzaCollection'); // Our PizzaCollection class

const app = express(); // App is an Express server
app.use(bodyParser.json()); // Use the JSON body parser

// Try and get the database connection string from the environment,
// default it if the MONGODB_URI environment variable doesn't exist
const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Connection options to prevent warnings when using MongoDB 4.2.0
const connectOptions = { useUnifiedTopology: true, useNewUrlParser: true };

// Create a MongoDB client instance
const mongoClient = new MongoClient(databaseUri, connectOptions);

// Variable to hold our PizzaCollection instance
let pizzaCollection = null;

// Create a new Promise and resolve it with a connected MongoDB
// client or reject it if there's an error
new Promise((resolve, reject) => {
    mongoClient.connect((err, client) => {
        if (err) return reject(err);
        return resolve(client);
    });
}).then((client) => {
    console.info('Connected to database');

    // Get the 'learninglunches' database from the database client
    const db = client.db('learninglunches');

    // Create an instance of our PizzaCollection class, passing the 
    // database to the constructor
    pizzaCollection = new PizzaCollection(db);

    // Try and get the port number from the environment, default to 8080
    const port = process.env.APP_PORT || 8080;

    // Start the server listening on the application port
    app.listen(port);

    console.info(`Pizza service listening on port ${port}`);
}).catch((err) => {
    console.error('Database connection failed');

    // Log the error and terminate the process
    console.error(err);
    process.exit(1);
});

// GET /pizzas
app.get('/pizzas', (req, resp) => {
    console.info('GET /pizzas');

    // Set the Content-Type header of the response
    resp.setHeader('Content-Type', 'application/json');

    // Return the pizzas collection
    pizzaCollection.getAll().then((pizzas) => {
        resp.send(pizzas);
    }).catch((err) => {
        resp.status(500).send(err)
    });
});

// GET /pizzas/{id}
app.get('/pizzas/:id([0-9]+)', (req, resp) => {
    // Get the id from the URL path
    const id = parseInt(req.params['id']);

    console.info(`GET /pizzas/${id}`);

    // Set the Content-Type header of the response
    resp.setHeader('Content-Type', 'application/json');

    // Find the pizza from the collection and wait for the promise to resolve
    pizzaCollection.getOne(id).then((pizza) => {
        // If we found the pizza, return it, else return an error message
        // with status 404 (not found)
        if (pizza.length === 1) {
            resp.send(pizza[0]);
        } else {
            resp.status(404).send({ error: `Pizza with ID ${id} not found` });
        }
    }).catch((err) => {
        resp.status(500).send(err);
    });
});

// POST /pizzas
app.post('/pizzas', (req, resp) => {
    console.info('POST /pizzas');

    // Get the pizza object from the request body
    const pizza = req.body;

    // Add the pizza to the collection
    pizzaCollection.addOne(pizza).then((inserted) => {
        resp.status(201).send(inserted);
    }).catch((err) => {
        resp.status(500).send(err);
    });
});

// DELETE /pizzas/{id}
app.delete('/pizzas/:id([0-9]+)', (req, resp) => {
    // Get the id from the URL path
    const id = parseInt(req.params['id']);

    console.info(`DELETE /pizzas/${id}`);

    pizzaCollection.removeOne(id).then(() => {
        resp.sendStatus(204);
    }).catch((err) => {
        resp.status(500).send(err);
    });
});

// Close the connection when the process exits
process.on('exit', function () {
    mongoClient.close();
});
