const http = require('http');
const port = process.env.PORT || 3000;
const app = require('./app');
const db = require("./db"); // Package with the connection to the MongoDB

// We need to add a listener function to the server
const server = http.createServer(app);

//Ensure that we connect to the db before initializing the server
db.initDb((err, db) => {
    if(err) {
        console.log(err);
    } else {
        server.listen(port);
    }
});
