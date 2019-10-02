# Run a local MongoDB container for development
* `docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:4.2.0`
* `docker exec -it mongodb bash` to start a shell in the running container
* `mongo` to start the MongoDB Shell
* `show dbs` to show the current databases
* `use learninglunches` to use the learninglunches database
* `db.pizzas.save({ id: 1, name: "margarita", spicy: false})` to create our first pizza
* `db.pizzas.find()` to find all pizzas in our collection, should return the one we just created
* `exit` to get out of the MongoDB Shell and `exit` again to get out of the bash shell

# Install some Node.js packages
* `npm install --save mongodb` to install the mongodb client package
* `npm install --save body-parser` to install the body-parser package to parse JSON for us

# Testing
* `node index.js` to run from the command prompt
* `curl -i localhost:8080/pizzas` from another terminal to test
* `curl -i -X POST -H 'Content-Type: application/json' -d '{"id":2,"name":"hawaiian","spicy":false}' localhost:8080/pizzas`
* `curl -i localhost:8080/pizzas`
* `curl -i -X DELETE localhost:8080/pizzas/2`
* `curl -i localhost:8080/pizzas`

# Build the new Docker image
* `docker build --tag yourdockerhubusername/pizza-service .`
* `docker push yourdockerhubusername/pizza-service`

# Testing the Docker image locally
* `docker network create pizza-service-network`
* `docker run -d --network pizza-service-network --name pizza-database mongo:4.2.0`
* `docker run -d -p 8080:8080 --network pizza-service-network -e "MONGODB_URI=mongodb://pizza-database:27017" --name pizza-service miketrout/pizza-service`

# Testing the running containers
* `curl -i -X POST -H 'Content-Type: application/json' -d '{"id": 2, "name": "pepperoni", "spicy": true}' localhost:8080/pizzas`
* `curl -i -X DELETE localhost:8080/pizzas/2`
