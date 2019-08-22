const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const routes = require('./routes.js')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

/* Use a Map (a hash map) here instead of a
 * Object. Creating and accessing Object
 * properties on demand is slower than using
 * a hash map.
 */
const connectedUsers = {}

io.on('connection', socket => {
    const { user } = socket.handshake.query
    connectedUsers[user] = socket.id
    console.log('Client connectet:', user )

})

mongoose.connect('mongodb+srv://...', {
    useNewUrlParser: true   
})

app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers

    return next()
})

/* When using CORS library, setup a specific
 * domains to allow, in order to prevent CSRF
 */
app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(3333)