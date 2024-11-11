const {
  uniqueNamesGenerator,
  colors,
  animals,
} = require("unique-names-generator");

const colorfulName = uniqueNamesGenerator({
  dictionaries: [colors, animals],
  separator: "",
  style: "capital",
});

module.exports = { colorfulName };
