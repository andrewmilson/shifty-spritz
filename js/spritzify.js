$(function() {
  var getSelectionText, pressedTimeout, progressBarMouseDown, shiftySpritz;
  getSelectionText = function() {
    if (window.getSelection) {
      return window.getSelection().toString();
    } else {
      return document.selection.createRange().text(document.selection && document.selection.type !== "Control" ? void 0 : "");
    }
  };
  shiftySpritz = {
    meta: {
      word: 0,
      text: {},
      play: true,
      wpm: 60000 / 300,
      nextWordTimeout: 0,
      $document: $(document),
      $shiftySpritz: $("#shifty-spritz"),
      $words: $("#shifty-spritz #words"),
      $left: $("#shifty-spritz #left"),
      $center: $("#shifty-spritz #center"),
      $right: $("#shifty-spritz #right"),
      $progressBar: $("#shifty-spritz #progress-bar"),
      $progressSeek: $("#shifty-spritz #progress-bar #seek"),
      $progress: $("#shifty-spritz #progress-bar #progress"),
      $pausePlay: $("#shifty-spritz #pause-play"),
      $close: $("#shifty-spritz #close")
    },
    show: function() {
      if (shiftySpritz.meta.$shiftySpritz.hasClass("hide")) {
        $("body").addClass("shifty-spritz").css({
          "margin-top": shiftySpritz.meta.$shiftySpritz.outerHeight() + "px",
          position: "relative"
        });
        $("*").each(function(index, element) {
          if ($(element).css("position") === "fixed") {
            $(element).css("top", $(element).position().top + shiftySpritz.meta.$shiftySpritz.outerHeight() + "px");
          }
        });
        this.meta.$shiftySpritz.css({
          "top": "0",
          "margin-top": "0"
        });
        this.meta.$shiftySpritz.removeClass("hide");
        return true;
      } else {
        return false;
      }
    },
    close: function() {
      if (!shiftySpritz.meta.$shiftySpritz.hasClass("hide")) {
        $("body").css("margin-top", "0px");
        $("*").each(function(index, element) {
          if ($(element).css("position") === "fixed") {
            $(element).css("top", $(element).position().top - shiftySpritz.meta.$shiftySpritz.outerHeight() + "px");
          }
        });
        shiftySpritz.meta.$shiftySpritz.addClass("hide");
        return true;
      } else {
        return false;
      }
    },
    empty: function(text) {
      return !!text.length;
    },
    getText: function(text) {
      var map;
      map = function(x) {
        var words;
        words = x.split(/\s+/g);
        words.push("");
        return words;
      };
      text = text.split(/[\n\r]+/g).filter(this.empty).map(map.bind(this)).reduce(function(a, b) {
        return a.concat(b);
      });
      text.pop();
      return text;
    },
    updateProgress: function() {
      this.meta.$progress.css("width", 100 / this.meta.text.length * this.meta.word + "%");
    },
    getWord: function() {
      return this.meta.text[this.meta.paragraph].words[this.meta.word];
    },
    splitWord: function(word) {
      var pivot;
      pivot = (function() {
        switch (false) {
          case !(word.length < 2):
            return 0;
          case !(word.length < 6):
            return 1;
          case !(word.length < 10):
            return 2;
          case !(word.length < 14):
            return 3;
          default:
            return 4;
        }
      })();
      return [word.substring(0, pivot), word.substring(pivot, pivot + 1), word.substring(pivot + 1)];
    },
    goFromPercent: function(percent, readNext) {
      this.meta.word = Math.floor(this.meta.text.length / 100 * percent);
      this.meta.$progress.css("width", percent + "%");
      clearTimeout(this.meta.nextWordTimeout);
      this.readNextWord(this.meta.wpm, readNext);
    },
    readNextWord: function(delay, readNext) {
      var self, splitWord, wpm, _ref;
      if (delay == null) {
        delay = 0;
      }
      if (readNext == null) {
        readNext = true;
      }
      if (this.meta.word === this.meta.text.length) {
        return false;
      }
      self = this;
      wpm = this.meta.wpm;
      splitWord = this.splitWord(this.meta.text[this.meta.word]);
      wpm += ((_ref = this.meta.text[this.meta.word].slice(-1)) === "." || _ref === "," || _ref === "!" || _ref === "?" ? wpm : 0);
      wpm += (this.meta.text[this.meta.word] === "" ? wpm * 3 : 0);
      wpm += delay;
      this.meta.$left.html(splitWord[0]);
      this.meta.$center.html(splitWord[1]);
      this.meta.$right.html(splitWord[2]);
      this.meta.word++;
      if (readNext) {
        this.updateProgress();
        this.meta.nextWordTimeout = setTimeout(function() {
          self.readNextWord();
        }, wpm);
      }
    },
    playPause: function(delay) {
      this.meta.$pausePlay.addClass((this.meta.play ? "fa-pause" : "fa-play")).removeClass((!this.meta.play ? "fa-pause" : "fa-play"));
      clearTimeout(this.meta.nextWordTimeout);
      !this.meta.play || this.readNextWord(delay);
    },
    play: function(delay) {
      this.meta.play = true;
      this.playPause(delay);
    },
    pause: function() {
      this.meta.play = false;
      this.playPause();
    },
    init: function(text, wpm, countdown) {
      clearTimeout(this.meta.nextWordTimeout);
      this.meta.word = 0;
      this.meta.text = this.getText(text);
      this.play(countdown ? this.meta.wpm : 0);
    }
  };
  progressBarMouseDown = false;
  shiftySpritz.meta.$progressBar.mousedown(function(e) {
    shiftySpritz.goFromPercent(100 / shiftySpritz.meta.$progressBar.width() * (e.pageX + 6 - shiftySpritz.meta.$progressBar.offset().left), false);
    progressBarMouseDown = true;
  });
  shiftySpritz.meta.$progressBar.mousemove(function(e) {
    return shiftySpritz.meta.$progressSeek.css("left", Math.max(e.pageX - shiftySpritz.meta.$progressBar.offset().left, 6) + "px");
  });
  shiftySpritz.meta.$pausePlay.click(function() {
    if (shiftySpritz.meta.play) {
      return shiftySpritz.pause();
    } else {
      return shiftySpritz.play();
    }
  });
  shiftySpritz.meta.$document.mouseup(function(e) {
    !progressBarMouseDown || shiftySpritz.goFromPercent(100 / shiftySpritz.meta.$progressBar.width() * Math.max(Math.min(e.pageX + 6 - shiftySpritz.meta.$progressBar.offset().left, shiftySpritz.meta.$progressBar.width()), 0), shiftySpritz.meta.play);
    progressBarMouseDown = false;
  });
  shiftySpritz.meta.$document.mousemove(function(e) {
    if (progressBarMouseDown) {
      shiftySpritz.goFromPercent(100 / shiftySpritz.meta.$progressBar.width() * Math.max(Math.min(e.pageX + 6 - shiftySpritz.meta.$progressBar.offset().left, shiftySpritz.meta.$progressBar.width()), 0), false);
    }
  });
  shiftySpritz.meta.$close.click(function() {
    return shiftySpritz.close();
  });
  shiftySpritz.meta.$shiftySpritz.keydown(function(e) {
    if (e.keyCode === 32) {
      if (shiftySpritz.meta.play) {
        shiftySpritz.pause();
      } else {
        shiftySpritz.play();
      }
      return e.preventDefault();
    } else if (e.keyCode === 27) {
      return shiftySpritz.close();
    }
  });
  pressedTimeout = void 0;
  shiftySpritz.meta.$document.keydown(function(e) {
    if (e.shiftKey) {
      pressedTimeout = setTimeout(function() {
        var selectedText;
        selectedText = getSelectionText();
        if (selectedText.length) {
          setTimeout(shiftySpritz.init(selectedText, 500, shiftySpritz.show()));
          shiftySpritz.meta.$shiftySpritz.focus();
        }
      }, 500);
    }
  }).keyup(function(e) {
    clearTimeout(pressedTimeout);
  });
})
