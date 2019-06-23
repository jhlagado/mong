const pick = (keys, object) => keys.reduce((acc, key) => {
  if (key in object) {
    acc[key] = object[key];
  }
  return acc;
}, {});

module.exports = {
  pick,
}