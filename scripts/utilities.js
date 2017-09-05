var forEacha = function forEacha() {
  console.log("This section of code is working");
  //loop through all elements in points array, NOT poiintsArray!!
  for (var i = 0; i < points.length; i++) {
    //execute a callback for each elements
    function myForEachCallback(points, callback) {
//what does this function need to do? Not console.log the points array
      console.log(points);
      callback();
    }
  }
  //replace the for loop in landing.js with foreach block created here
}
