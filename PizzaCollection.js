class PizzaCollection {

    constructor(databaseConnection) {
        // Keep the database connection as a member of a class instances
        this.db = databaseConnection;
    }

    // Method to add one pizza to the database
    addOne(pizza) {
        let db = this.db;
        return new Promise((resolve, reject) => {
            db.collection('pizzas').insertOne(pizza, (err, res) => {
                if (err) return reject(err); // If there was an error, reject the promise
                return resolve(res.ops[0]); // Resolve the promise with the inserted pizza
            });
        });
    }

    // Method to return all pizzas from the database
    getAll() {
        let db = this.db;
        return new Promise((resolve, reject) => {
            db.collection('pizzas').find().toArray((err, res) => {
                if (err) return reject(err); // Error? Reject the promise
                return resolve(res); // Resolve with the returned array
            });
        });
    }

    // Method to get one pizza from the database by ID
    getOne(id) {
        let db = this.db;
        return new Promise((resolve, reject) => {
            db.collection('pizzas').find({ id: id }).toArray((err, res) => {
                if (err) return reject(err); // Error? Reject the promise
                return resolve(res); // Resolve with the returned pizza (in an array)
            })
        });
    }

    // Method to remove one pizza from the database by ID
    removeOne(id) {
        let db = this.db;
        return new Promise((resolve, reject) => {
            db.collection('pizzas').remove({ id: id }, (err, res) => {
                if (err) return reject(err); // Error? Reject!
                return resolve(); // Resolve with no value
            })
        });
    }

}

// Export our class from the module
module.exports = PizzaCollection;
