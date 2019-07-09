const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient(process.env.REDIS_URL);

module.exports = {
    ...client,
    saddAsync: promisify(client.sadd).bind(client),
    scardAsync: promisify(client.scard).bind(client),
    setnxAsync: promisify(client.setnx).bind(client),
    expireAsync: promisify(client.expire).bind(client)
};
