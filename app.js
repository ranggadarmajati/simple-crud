const express = require("express")
require("dotenv").config()
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const app = express()
const port = process.env.NODE_PORT
const timeout = require('connect-timeout')
const apiTimeout = 900000
app.use(timeout(apiTimeout))
// body parser
app.use(cors())
app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }))
app.use(haltOnTimedout)
app.use(cookieParser())
app.use(haltOnTimedout)
function haltOnTimedout(req, res, next) {
    if (!req.timedout) next()
}
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    res.header("Access-Control-Allow-Credentials", true)
    res.header("X-Trigger", "CORS")
    next()
})
// defined routes
const userRoute = require('./routes/user')
// route
app.use('/api/users', userRoute);
app.get('/', (req, res) => {
    res.send('Sample CRUD NODEJS Ready to use!')
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})