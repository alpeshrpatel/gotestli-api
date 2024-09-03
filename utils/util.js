function generateDateTime(date) {
    return new Date().toISOString().replace("T"," ").substring(0, 19);
  }


  module.export = [
    generateDateTime
  ]