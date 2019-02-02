const keys = require('./keys')

// express setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors()) // cross origin resource sharing (cors)
app.use(bodyParser.json()) // parse body into json

// Postgres setup
const { Pool } = require('pg')
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDB,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () => console.log('Lost connection'))
pgClient
    .query('CREATE TABLE IF NOT EXISTS fib(number INT)')
    .catch((err) => console.log(err))


// Redis setup 
const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_statergy: () => 1000
})

const publisher = redisClient.duplicate()

// routes
app.get('/', (req, res) => {
    res.send('Welcome Route')
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM fib limit 10')
    res.send(values.rows) // send only rows to response
})

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values)
    })
})

app.post('/values', async (req, res) => {
    const index = req.body.index
    if(parseInt(index) > 40) {
        return res.status(422).send('Index out of range')
    }

    redisClient.hset('values', index, 'Not yet!')
    publisher.publish('insert', index)
    pgClient.query('INSERT INTO fib(number) VALUES($1)', [index])
    res.send({working: true})

})

app.listen(5000, err => {
    console.log('Listening')
})