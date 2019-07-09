# visitor-service

This is a node-based service that is designed to provide a simple visitor tracking facility for websites.  It is used to provide the count for the "XXXX visitors in last day" text common on websites, it is largely an API-driven service.  It is based on express and redis.

The visitor count lasts for 24 hours.  Subsequent visits in the next 60 minutes to the same entity by the same client doesn't add to the visitor count for a particular page.  Expiration is done on an hour-by-hour basis, the visitor session timing is based on an hour from when the visit first occurred.

This will scale pretty far as-is, because it never writes to disk.  Most reasonable scaling issues can be solved by changing the redis config (see `redis-config.js`) or changing how express is configured (or running more express servers, no session fixation issues here.)

## running

You can run this as a node app as per normal.  this is built using express so `npm install` followed by `npm start` will kick it off. 

The easiest way to run this service is with `docker-compose up --build`.  This docker composer file has a built in reference to a redis image.  Pay careful attention to the first few lines of the log to see if you have a kernel issue, this probably won't affect you in development mode on your server, but see https://github.com/docker-library/redis/issues/55 for more details.

## API:

`GET /entity/:entity_type/:entity_id`

This will return a json element with a key 'count' containing the count of visits to this entity in the last day.

`POST /entity/:entity_type/:entity_id`

The body of this HTTP request should contain a key `client` that contains however you want to describe the client making the request.  Customarily, this is transmitted in json.  This key is hashed and used to key the same client making repeated requests from driving up the count returned by the 'GET' version.  Practically, you can send whatever you want so long as it uniquely identifies clients, it is an opaque string.

## security considerations

As this exists in this repo, it should only be used in isolation -- this has a small exposed API, but there is no protection against other clients calling this API.

## production considerations

This is designed to take advantage of the LRU key expiry of Redis.  It makes a new set to store client hashes in every hour and just lets the limited memory of the redis server age them out as needed.  There is no reason to have this server use a redis with persistence

## CONTRIBUTING

* Fork the project.
* Make your feature addition or bug fix.
* Add tests for it. This is important so I don't break it in a
  future version unintentionally.
* Commit, please do not change the version, or history.
  (if you want to have your own version, that is fine but bump version in a commit by itself I can ignore when I pull)
* Send me a pull request. Bonus points for topic branches.


## LICENSE

MIT License

Copyright (c) 2019 E. Corprew Reed

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

