var animatePoints = function() {
  var revealPoint = function() {
    // #7
    $(this).css({
      opacity: 1,
      transform: 'scaleX(1) translateY(0)'
    });
  };
  $.each($('.point'), revealPoint);
};
$(window).load(function() {
  // Automatically animate the points on a tall screen where scrolling can't trigger the animation
  if ($(window).height() > 950) {
    animatePoints();
  }
  var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

  $(window).scroll(function(event) {
    if ($(window).scrollTop() >= scrollDistance) {
      animatePoints();
    }
  });
});
var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {

  var revealPoint = function(i) {
    points[i].style.opacity = 1;
    points[i].style.transform = "scaleX(1) translateY(0)";
    points[i].style.msTransform = "scaleX(1) translateY(0)";
    points[i].style.WebkitTransform = "scaleX(1) translateY(0)";
  };
  for (var i = 0; i < points.length; i++) {
    console.log(i);
    revealPoint(i);
  }
};

window.onload = function() {
  // Automatically animate the points on a tall screen where scrolling can't trigger the animation
 if (window.innerHeight > 950) {
     animatePoints(pointsArray);
 }
  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
  window.addEventListener('scroll', function(event) {
    console.log("Current offset from the top is " + sellingPoints.getBoundingClientRect().top + " pixels");
    if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
        animatePoints(pointsArray);
    }
  });
}
