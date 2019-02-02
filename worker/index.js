const keys = require('./keys')
const redis = require('redis')

const redis_cli = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})

const sub = redis_cli.duplicate()

// core function for Fib
function fib(number) {
    if(number < 2)
        return 1;
    return fib(number - 1) + fib(number - 2)
}

sub.on('message', (channel, number) => {
    redis_cli.hset('values', number, fib(parseInt(number)))
})

sub.subscribe('insert')