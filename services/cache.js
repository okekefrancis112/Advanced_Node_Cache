const mongoose = require('mongoose');
const redis = require('ioredis');
const util = require('util');

// const redisUrl = 'redis://127.0.0.1:6379';
// const client = redis.createClient(redisUrl);

client = new redis();

client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function() {
    this.useCache = true;
}

mongoose.Query.prototype.exec = async function() {
    this.useCache

    console.log('Am about to run a query');

    const key = JSON.stringify(
        Object.assign({}, this.getQuery, {
            collection: this.mongooseCollection.name
        }));

    // See if we have a value for 'Key' in redis
    const cacheValue = await client.get(key);

    // if we do, return that
    if (cacheValue) {
        // console.log(cacheValue);
        const doc = JSON.parse(cacheValue)

        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    // otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);

    client.set(key, JSON.stringify(result));
    // console.log(result);
    return result;
}

// export default client;