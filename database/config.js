const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        mongoose.connect(process.env.DB_CNN2);
        console.log("db online");
    } catch (error) {
        console.log(error);
        throw new Error("Error: could not initialize database");
    }
};

module.exports = {
    dbConnection,
};
