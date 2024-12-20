const logRequests = (req, res, next) => {
  console.log(
    `${new Date().toISOString()}: ${req.method} ${req._parsedUrl?.pathname}`
  );
  next();
};

module.exports = {
  logRequests,
};
