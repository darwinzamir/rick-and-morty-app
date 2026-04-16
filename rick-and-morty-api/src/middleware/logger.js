const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} | ${res.statusCode} | ${duration}ms`);
    if (req.body && req.body.query) {
      console.log(`  Query: ${req.body.query.trim().split('\n')[0]}`);
    }
  });
  next();
};

module.exports = logger;