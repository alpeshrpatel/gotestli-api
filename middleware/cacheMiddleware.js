const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 5 * 60 * 60, checkperiod: 120 });



function cacheMiddleware(req, res, next) {
    const key = req.originalUrl; //  request URL as the cache key
    const cachedData = cache.get(key);
    if (cachedData) {
      
        return res.status(200).json(cachedData); 
    }
    
    next(); 
}

  module.exports = {cache, cacheMiddleware};