const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const mongoUrl = "mongodb://mongodb:27017/";

let _db;

// Initialize the Database if not active
const initDb = (callback) => {
    if(_db) {
        console.log("The Database is already initialized.");
        return callback(null, _db);
    } else {
        MongoClient
            .connect(mongoUrl)
            .then(client => {
                _db = client.db('healthcareSystem');
                console.log("Database has been initialized.");
                return callback(null, _db);
            })
            .catch(error => {
                console.log(error);
                return callback(error, null);
            });
    }
};

// Obtain the Database after initialized
const getDb = () => {
    if(!_db){
        throw Error("Database not initialized");
    } else {
        return _db;
    }
};

module.exports = {
    initDb,
    getDb
};