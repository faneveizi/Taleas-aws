const mongoose = require('mongoose');
const cors = require('cors');
const { application } = require('express');
require('dotenv').config();
app.use(cors())
mongoose.Promise = global.Promise;

module.exports = connectDatabase = async () => {
    try{
        const URL = "mongodb+srv://fapperino:mosmore11@api.p51kn.mongodb.net/?retryWrites=true&w=majority";
        const databaseConnection = await mongoose.connect(URL , {useNewUrlParser:true})

    }catch (error) {
        console.error(`Error::: ${error.message}`);
        process.exit(1);
      }
}