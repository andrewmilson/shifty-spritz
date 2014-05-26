$('body').prepend($('<div id="spritzify"></div>').load(chrome.extension.getURL("index.html"), function() {
  function getSelectionText() {
    var text = "";

    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }

    return text;
  }

  var spritzify = {
    meta: {
      words: "",
      wordCount: 0,
      play: true,
      wordSpeed: 60000 / 500,
      nextWordTimeout: 0,
      $spritzify: $('#spritzify'),
      $words: $('#spritzify #words'),
      $left: $('#spritzify #left'),
      $center: $('#spritzify #center'),
      $right: $('#spritzify #right'),
      $progressBar: $('#spritzify #progress-bar'),
      $progress: $('#spritzify #progress'),
      $pausePlay: $('#spritzify #pause-play')
    },
    getWords: function(text) {
      return text.split(/\s+/g).filter(function(x) { return x.length; });
    },
    updateProgress: function() {
      this.meta.$progress.css("width", Math.floor(100 / this.meta.words.length * (this.meta.wordCount + 1)) + "%")
      console.log(100 / this.meta.words.length, (this.meta.wordCount));
    },
    stop: function() {
      this.meta.wordCount = 0;
    },
    getWord: function() {
      return this.meta.wordCount <= this.meta.words.length ? this.meta.words[this.meta.wordCount] : false;
    },
    splitWord: function (word) {
      var pivot = 1;
      var telly = true;

      switch (true) {
        case word.length <= 1: 
          pivot = 0;
          break;
        case word.length >= 2 && word.length <= 5:
          pivot = 1;
          break;
        case word.length >= 6 && word.length <= 9:
          pivot = 2;
          break;
        case word.length >= 10 && word.length <= 13:
          pivot = 3;
          break;
        default:
          pivot = 4;
      }

      return [word.substring(0, pivot), word.substring(pivot, pivot + 1), word.substring(pivot + 1)];
    },
    goFrompercent: function(percent) {
      this.meta.wordCount = Math.floor(this.meta.words.length / 100 * percent);
      this.updateProgress();
      clearInterval(this.nextWordTimeout);
      this.readNextWord(500);
    },
    readNextWord: function(delay) {
      var self = this
        , nextWord = this.getWord()
        , wordSpeed = this.meta.wordSpeed
        , splitWord = this.splitWord(nextWord);

      delay = delay || 0;

      this.meta.$left.html(splitWord[0]);
      this.meta.$center.html(splitWord[1]);
      this.meta.$right.html(splitWord[2]);
      this.updateProgress();

      wordSpeed += nextWord.slice(-1) == "." ? wordSpeed : 0;
      wordSpeed += delay;

      this.meta.wordCount++;
      nextWord = this.getWord()
      
      if (nextWord && this.meta.play) {
        this.nextWordTimeout = setTimeout(function() {
            self.readNextWord();
          }, wordSpeed);
      }
    },
    init: function(text, wpm) {
      this.stop();
      this.meta.words = this.getWords(text);
      this.readNextWord();
    }
  }

  $('body').css({"margin-top": spritzify.meta.$spritzify.outerHeight() + "px", "position": "relative"});

  $("*").each(function(index, element) {
    if ($(element).css("position") == "fixed")
      $(element).css("top", $(element).position().top + spritzify.meta.$spritzify.outerHeight() + "px");
  });

  spritzify.meta.$spritzify.css("top", "0");

  var dragDown = false
    , dragOffset = {x: 0, y: 0};

  spritzify.meta.$progressBar.click(function(e) {
    spritzify.goFrompercent(Math.floor(100 / spritzify.meta.$progressBar.width() * (e.pageX - spritzify.meta.$progressBar.offset().left)));
  });

  spritzify.meta.$pausePlay.click(function() {
    spritzify.meta.play = !spritzify.meta.play;
    spritzify.meta.$pausePlay.addClass(spritzify.meta.play ? "fa-pause" : "fa-play").removeClass(!spritzify.meta.play ? "fa-pause" : "fa-play");
    clearInterval(spritzify.nextWordTimeout);
    !spritzify.meta.play || spritzify.readNextWord();
  });

  spritzify.meta.$words.mousedown(function(e) {
    dragDown = true;
    dragOffset = {
      x: e.pageX - spritzify.meta.$spritzify.offset().left,
      y: e.pageY - spritzify.meta.$spritzify.position().top
    };
  });

  $(document).mouseup(function(e) {
    dragDown = false;
  });

  $(document).mousemove(function(e) {
    if (dragDown) {
      spritzify.meta.$spritzify.css({
        "left": e.pageX - dragOffset.x,
        "top": e.pageY - dragOffset.y
      });
    }
  });

  var pressedTimeout;

  $(document).keydown(function(e) {
    if (e.shiftKey) {
      pressedTimeout = setTimeout(function() {
        var selectedText = getSelectionText();
        if (selectedText.length) {
          spritzify.meta.$spritzify.show();
          spritzify.init(selectedText, 500)
        }
      }, 500);
    }
  });

  $(document).keyup(function(e) {
    clearTimeout(pressedTimeout);
  });
}));