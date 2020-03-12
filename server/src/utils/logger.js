module.exports.logInfo = (message) => {
  console.log(`>> INFO (${new Date().toISOString()}): ${message}`);
}

module.exports.logError = (message) => {
  console.log(`>> ERROR (${new Date().toISOString()}): ${message}`);
}
