// HTTP request logger middleware.
// Prints relevant information for each incoming request to the console,
// including timestamp, HTTP method, URL, status code, and response time.

const logger = (req, res, next) => {
  const start = Date.now();

  // Listen for the 'finish' event to log after the response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    // Log the main request details
    console.log(`[${timestamp}] ${req.method} ${req.url} | ${res.statusCode} | ${duration}ms`);

    // If the request contains a GraphQL query, log the first line for context
    if (req.body && req.body.query) {
      console.log(`  Query: ${req.body.query.trim().split('\n')[0]}`);
    }
  });

  // Pass control to the next middleware
  next();
};

module.exports = logger;