var setSong = function(songNumber){
  if ( currentSoundFile ) {
    currentSoundFile.stop();
  }
  //assigning new value to currentlyPlayingSongNumber
  currentlyPlayingSongNumber = parseInt(songNumber);

  //assigning new value to currentSongFromAlbum
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ "mp3" ],
    preload: true
  });

  setVolume( currentVolume );
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function ( volume ) {
  if ( currentSoundFile ) {
    currentSoundFile.setVolume ( volume );
  }

};

//assignment 21 functions

var setCurrentTimeInPlayerBar = function ( currentTime ){
//set the .current-time class to the current time in the song
  $( '.current-time' ).text( filterTimeCode (currentTime) );
}

var setTotalTimeInPlayerBar = function ( totalTime ){
  //set the .total-time class to the length of the song
  $('.total-time').text( filterTimeCode(totalTime) );
}

var filterTimeCode = function ( timeInSeconds ){
//use the parseFloat() to get the seconds in number formats
//store whole numbers using Math.floor() to round numbers down
      var wholeSeconds = Math.floor( parseFloat(timeInSeconds) );
      var wholeMinutes = Math.floor( wholeSeconds / 60 );
      var displaySeconds = wholeSeconds % 60;
      var finalTime = wholeMinutes + ":";

      if ( displaySeconds < 10 ){
        finalTime += '0' + displaySeconds;

      } else {
          finalTime += displaySeconds;
      }

      //return the time in x:xx formate
        return finalTime;
};

var getSongNumberCell = function(number){
//returns the song number element that corressponds to that song number.
  return $('.song-item-number[data-song-number="' + number + '"]');
};

 var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
     + '</tr>'
     ;

    var $row = $(template);

    var clickHandler = function() {

      var songNumber = parseInt($(this).attr('data-song-number'));

      if (currentlyPlayingSongNumber !== null) {
        // Revert to song number for currently playing song because user started playing new song.
        var currentlyPlayingCell = getSongNumberCell ( currentlyPlayingSongNumber );

        currentlyPlayingCell = getSongNumberCell ( currentlyPlayingSongNumber );
        currentlyPlayingCell.html( currentlyPlayingSongNumber );
      }
      if (currentlyPlayingSongNumber !== songNumber) {
        // Switch from Play -> Pause button to indicate new song is playing.
        setSong(songNumber);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays()
        $(this).html(pauseButtonTemplate);
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        updatePlayerBarSong();

        var $volumeFill = $( '.volume .fill' );
        var $volumeThumb = $( '.volume .thumb' );
        $volumeFill.width( currentVolume + '%' );
        $volumeThumb.css( {left: currentVolume + '%' });

      } else if (currentlyPlayingSongNumber === songNumber) {
          if ( currentSoundFile.isPaused() ){
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays()
          } else {
              $(this).html(playButtonTemplate);
              $('.main-controls .play-pause').html(playerBarPlayButton);
              currentSoundFile.pause();
          }

      }

    };

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
      return $row;
    };

var setCurrentAlbum = function(album) {
    //  select all of the HTML elements required to display on the album page
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    // identifies the first child node of an element
    // returns or sets the value of a node
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    // clear the album song list HTML
    $albumSongList.empty();

    // go through all the songs from the specified album
    // insets album into HTML
    for (var i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};
//Move to next song and previous song functions
var nextSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

  //wraps back to the begining of the songs object
  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }
  //gets the current song number and stores it in new variable
  var lastSongNumber = currentlyPlayingSongNumber;
  //set a new current song
  setSong( currentSongIndex + 1 );
  currentSoundFile.play();
  updateSeekBarWhileSongPlays()
//update the player bar info
  updatePlayerBarSong();

  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

  currentSongIndex--;
  //wraps around
  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }
  //gets the current song number and stores it in new variable
  var lastSongNumber = currentlyPlayingSongNumber;
  //set a new current song
  setSong( currentSongIndex + 1 );
  currentSoundFile.play();
  updateSeekBarWhileSongPlays()
  //update the player bar info
  updatePlayerBarSong();

  $('.main-controls .play-pause').html(playerBarPauseButton);

  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

//toggles the player bar from play to pause
var togglePlayFromPlayerBar = function (){
//issue or bug here from Dev console, added extra if statement to check for currentlyPlayingSongNumber
  if ( currentlyPlayingSongNumber ){
    if( currentSoundFile.isPaused() ){
      //change the cell from play to pause
      getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
      //change the HTML of player bar to pause
      $playerBarPPButton.html(playerBarPauseButton);
      //play the song
      currentSoundFile.play();
    } else {
      //change the cell from pause to play
      getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
      //change the HTML of the player bar to play
      $playerBarPPButton.html(playerBarPlayButton);
      //pause the song
      currentSoundFile.pause();
    }

  }

};

//Updates Seek Bar function

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {

         currentSoundFile.bind('timeupdate', function(event) {

             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');

             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar( currentSoundFile.getTime() );
         });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // max and min
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // Convert % to string so CSS will work
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});

 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');

     $seekBars.click(function(event) {
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         var seekBarFillRatio = offsetX / barWidth;
         //conditional for seek or volume control-group
         if ( $(this).parent().attr('class') == 'seek-control' ){
           //if it is the seek bar code
           seek( seekBarFillRatio * currentSoundFile.getDuration() );

         } else {
            // or it is the volume bar code
            setVolume ( seekBarFillRatio * 100 );
         }

         updateSeekPercentage($(this), seekBarFillRatio);


     });

     $seekBars.find('.thumb').mousedown(function(event) {

          var $seekBar = $(this).parent();

          $(document).bind('mousemove.thumb', function(event){
              var offsetX = event.pageX - $seekBar.offset().left;
              var barWidth = $seekBar.width();
              var seekBarFillRatio = offsetX / barWidth;

              updateSeekPercentage($seekBar, seekBarFillRatio);
          });

          $(document).bind('mouseup.thumb', function() {
              $(document).unbind('mousemove.thumb');
              $(document).unbind('mouseup.thumb');
          });
        });
 };

var updatePlayerBarSong = function (){
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $playerBarPPButton = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click( nextSong );
    $playerBarPPButton.click( togglePlayFromPlayerBar );
});
