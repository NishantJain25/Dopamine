const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {db} = require('./config')
const {contactRouter, phoneRouter} = require('./routes')


db.connect()

const app = express()
const jsonParser = bodyParser.json({limit: '50mb'})
const urlencodedParser = bodyParser.urlencoded({limit:'50mb',extended: true})

app.use(jsonParser)
app.use(urlencodedParser)
app.use(cors())
app.use('/api', contactRouter)
app.use('/api', phoneRouter)



app.listen(3005, () => {
    console.log("Server listening at port 3005")
})