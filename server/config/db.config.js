const mongoose = require('mongoose')
var url = "mongodb+srv://nishantjain2503:Njain250300@cluster0.ncvkqwp.mongodb.net/dopamine_test_db"

const db = {
    connect: async () => {
        try{
            await mongoose.connect(url,{
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            console.log("Db connection successful")
        }catch(err){
            console.log({err})
        }
    }
}



module.exports = {db};