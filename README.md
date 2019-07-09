# visitor-service

This is a node-based service that is designed to provide a simple visitor tracking facility for websites.  It is used provide the "XXXX visitors in last day" text, it is largely an API-driven service.  It is based on express.

## running

You can run this as a node app as per normal.  this is built using express so `npm install` followed by `npm start` will kick it off. 

The easiest way to run this service is with `docker-compose up --build`.  This docker composer file has a built in reference to a redis file.  Pay careful attention to the first few lines of the log to see if you have a kernel issue, this probably won't affect you in development mode on your server, but see https://github.com/docker-library/redis/issues/55 for more details.

## API:

`GET /entity/:entity_type/:entity_id`

This will return a json element with a key 'count' containing the count of visits to this entity in the last day.

`POST /entity/:entity_type/:entity_id`

The body of this HTTP request should contain a key `client` that contains however you want to describe the client making the request.  Customarily, this is transmitted in json.  This key is hashed and used to key the same client making repeated requests from driving up the count returned by the 'GET' version.  Practically, you can send whatever you want so long as it uniquely identifies clients, it is an opaque string.

## security considerations

As this exists in this repo, it should only be used in isolation -- this has a small exposed API, but there is no protection against other clients calling this API.

## production considerations

This is designed to take advantage of the LRU key expiry of Redis.  It makes a new set to store client hashes in every hour and just lets the limited memory of the redis server age them out as needed.  There is no reason to have this server use a redis with persistence
