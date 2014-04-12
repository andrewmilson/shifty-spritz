$(function() {
  var spritzify = {
    meta: {
      words: "",
      wordCount: 0,
      wordSpeed: 60000 / 600,
      $spritzify: $('#spritzify'),
      $left: $('#spritzify #left'),
      $center: $('#spritzify #center'),
      $right: $('#spritzify #right'),
      $progress: $('#spritzify #progress')
    },
    getWords: function(text) {
      return text.split(/\s+/g)
    },
    stop: function() {
      this.meta.wordCount = 0;
    },
    getNextWord: function() {
      this.meta.wordCount++;
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

      console.log([word.substring(0, pivot), word.substring(pivot, pivot + 1), word.substring(pivot + 1)]);
      return [word.substring(0, pivot), word.substring(pivot, pivot + 1), word.substring(pivot + 1)];
    },
    readNextWord: function() {
      var self = this
        , nextWord = this.getNextWord()
        , wordSpeed = this.meta.wordSpeed;

      if (nextWord) {
        var splitWord = this.splitWord(nextWord);

        this.meta.$left.html(splitWord[0]);
        this.meta.$center.html(splitWord[1]);
        this.meta.$right.html(splitWord[2]);
        this.meta.$progress.css("width", Math.floor(100 / this.meta.words.length * (this.meta.wordCount + 1)) + "%")

        wordSpeed += nextWord.slice(-1) == "." ? 100 : 0;

        setTimeout(function() {
            self.readNextWord();
          }, wordSpeed);
      } else {
        this.stop()
      }
    },
    init: function(text, wpm) {
      this.meta.words = this.getWords(text);
      this.readNextWord();
    }
  }

  spritzify.init("The Moon is a barren, rocky world without air and water. It has dark lava plain on its surface. The Moon is filled wit craters. It has no light of its own. It gets its light from the Sun. The Moon keeps changing its shape as it moves round the Earth. It spins on its axis in 27.3 days stars were named after the Edwin Aldrin were the first ones to set their foot on the Moon on 21 July 1969 They reached the Moon in their space craft named Apollo II.", 500);
});