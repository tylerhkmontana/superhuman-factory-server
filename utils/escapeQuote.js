function escapeQuote(stringArr) {
  return stringArr.map((str) => str.replace("'", "''"));
}

module.exports = escapeQuote;
