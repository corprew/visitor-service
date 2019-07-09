var express = require('express');
var router = express.Router();
var debug = require('debug')('vs:entity')
var moment = require('moment');
var crypto = require('crypto');
var redisClient = require('../redis-client.js');
var sprintf = require('sprintf-js').sprintf

/*
 * It's helpful to note that these are currently mounted at /entity, so /bees here is /entity/bees
 *
 * This is somewhat standard, but it seems to be a cause of confusion.
 */

router.get('/:entityType/:entityString', async (req, res, next) => {
    try {
        debug("router.get[enter] %O", req.params)
        debug("params: %O", req.params);
        const base_string = "ntt." + req.params.entityType + "." + req.params.entityString
        var count = 0;
        for (var i = 0; i <= 23; i++) {
            const stub = moment().subtract(i, "hours").format("DDD-HH");

            const key = base_string + "." + stub;
            debug("scard for key %O", key);
            res_scard = await redisClient.scardAsync(key);
            debug("scard result: %O %O", key, res_scard);
            count += res_scard;
        }

        res.json({
            count: count
        })

        debug("toal entity count: %O", count)
    }
    catch (err) {
        debug(err.toString);
        res.status(500).json({ error: err.toString() });
    }
});
/*
 * this code expects the client as a string parameter inside the body.
 *
 * the value that is sent to redis is a hash of the client because people
 * kept sending funny values to this to see what would happen.  Encoding
 * this in base64 also keeps the redis size reasonable.
 * 
 */
router.post('/:entityType/:entityString', async (req, res, next) => {
    try {
        debug("router.post [enter] %O", req.params)
        const base_string = "ntt." + req.params.entityType + "." + req.params.entityString
        const key = base_string + "." + moment().format("DDD-HH")
        const value = req.body.client

        if (value === undefined || value === null) {
            res.status(422).json({ error: "you must specify the 'client' parameter in the request body" });
            return;
        }

        value_hash = crypto.createHash('md5').update(value).digest("base64");
        expire_key = base_string + "." + value_hash;

        res_new_key = await redisClient.setnxAsync(expire_key, "1");
        redisClient.expireAsync(expire_key, 3600);
        debug("is this a new key? %O", res_new_key);

        res_sadd = 0;
        if (res_new_key == '1') {
            res_sadd = await redisClient.saddAsync(key, value_hash);
            debug("sadd result: %O", res_sadd);
        }
        res.json({
            new_record: res_sadd
        })
        debug("router.post [exit] new element in set? %O", res_sadd)
    } catch (err) {
        debug(err.toString);
        res.status(500).json({ error: err.toString() });
    }
});

module.exports = router;
