// function generateDateTime(date) {
//     return new Date().toISOString().replace("T"," ").substring(0, 19);
//   }


//   module.exports = generateDateTime;

function generateDateTime(date = new Date()) {
  const pad = (n) => (n < 10 ? '0' + n : n);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = generateDateTime;
