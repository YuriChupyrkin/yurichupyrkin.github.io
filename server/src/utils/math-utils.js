module.exports.randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.maxFromArray = (array) => {
  return Math.max.apply(null, array);
};

module.exports.minFromArray = (array) => {
  return Math.min.apply(null, array);
};

