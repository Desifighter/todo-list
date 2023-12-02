module.exports.getDate = getDate;
function getDate() {
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    var today = new Date();

    var td = today.toLocaleDateString("en-US", options);
    return td;
}

module.exports.getFDate = ()=>{
  var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  var today = new Date();

  var td = today.toLocaleDateString("en-US", options);
  return td;
}
