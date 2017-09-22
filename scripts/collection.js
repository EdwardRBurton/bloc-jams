var buildCollectionItemTemplate = function() {
  var template =
    '<div class="collection-album-container column fourth">' +
    '  <img src="assets/images/album_covers/01.png"/>' +
    '  <div class="collection-album-info caption">' +
    '    <p>' +
    '      <a class="album-name" href="album.html"> The Colors </a>' +
    '      <br/>' +
    '      <a href="album.html"> Pablo Picasso </a>' +
    '      <br/>' +
    '      X songs' +
    '      <br/>' +
    '    </p>' +
    '  </div>' +
    '</div>';
  return $(template);
};
$(window).load(function() {
  // selects the first album-covers element and assigns it to collectionContainer
  var $collectionContainer = $('.album-covers');
  // clear the content from innerHTML
  $collectionContainer.empty();
  // insets collectionItemTemplate into the innerHTML of collectionContainer
  for (var i = 0; i < 12; i++) {
    var $newThumbnail = buildCollectionItemTemplate();
    $collectionContainer.append($newThumbnail);
  }
}
});
