const encryptResponseMiddleware = (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(body) {
      // Skip encryption for error responses or already encrypted data
      if (res.statusCode >= 400 || 
          (typeof body === 'object' && body !== null && body.encryptedPayload)) {
        return originalSend.call(this, body);
      }
      
      try {
        // Encrypt the response body
        const encryptedData = encrypt(
          typeof body === 'string' ? body : JSON.stringify(body)
        );
        
        // Set Content-Type header to application/json
        res.setHeader('Content-Type', 'application/json');
        
        // Send the encrypted data
        return originalSend.call(this, JSON.stringify({ encryptedPayload: encryptedData }));
      } catch (error) {
        console.error('Encryption error:', error);
        return originalSend.call(this, body);
      }
    };
    
    next();
  };

  module.exports = {encryptResponseMiddleware};