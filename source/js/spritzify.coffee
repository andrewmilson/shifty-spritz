# $('body').prepend($('<div id="spritzify" class="hide"></div>').load(chrome.extension.getURL("index.html"), function() {
#   function getSelectionText() {
#     var text = "";

#     if (window.getSelection) {
#       text = window.getSelection().toString();
#     } else if (document.selection && document.selection.type != "Control") {
#       text = document.selection.createRange().text;
#     }

#     return text;
#   }

#   var spritzify = {
#     meta: {
#       words: "",
#       wordCount: 0,
#       play: true,
#       wordSpeed: 60000 / 500,
#       nextWordTimeout: 0,
#       $document: $(document),
#       $spritzify: $('#spritzify'),
#       $words: $('#spritzify #words'),
#       $left: $('#spritzify #left'),
#       $center: $('#spritzify #center'),
#       $right: $('#spritzify #right'),
#       $progressBar: $('#spritzify #progress-bar'),
#       $progress: $('#spritzify #progress'),
#       $pausePlay: $('#spritzify #pause-play')
#     },
#     showSpritzify: function() {
#       if (spritzify.meta.$spritzify.hasClass("hide")) {
#         $('body').css({
#           "margin-top": spritzify.meta.$spritzify.outerHeight() + "px", 
#           "position": "relative"
#         });

#         $("*").each(function(index, element) {
#           if ($(element).css("position") == "fixed")
#             $(element).css("top", $(element).position().top + spritzify.meta.$spritzify.outerHeight() + "px");
#         });

#         spritzify.meta.$spritzify.css("top", "0");
#         spritzify.meta.$spritzify.removeClass("hide");
#       }
#     },
#     hideSpritzify: function() {
#       if (!spritzify.meta.$spritzify.hasClass("hide")) {
#         $('body').css("margin-top", "0px");

#         $("*").each(function(index, element) {
#           if ($(element).css("position") == "fixed")
#             $(element).css("top", $(element).position().top - spritzify.meta.$spritzify.outerHeight() + "px");
#         });

#         spritzify.meta.$spritzify.addClass("hide");
#       }
#     },
#     getWords: function(text) {
#       return text.split(/\s+/g).filter(function(x) { return x.length; });
#     },
#     updateProgress: function() {
#       this.meta.$progress.css("width", Math.floor(100 / this.meta.words.length * (this.meta.wordCount + 1)) + "%")
#     },
#     stop: function() {
#       this.meta.wordCount = 0;
#     },
#     getWord: function() {
#       return this.meta.wordCount <= this.meta.words.length ? this.meta.words[this.meta.wordCount] : false;
#     },
#     splitWord: function (word) {
#       var pivot = 1;
#       var telly = true;

#       switch (true) {
#         case word.length <= 1: 
#           pivot = 0;
#           break;
#         case word.length >= 2 && word.length <= 5:
#           pivot = 1;
#           break;
#         case word.length >= 6 && word.length <= 9:
#           pivot = 2;
#           break;
#         case word.length >= 10 && word.length <= 13:
#           pivot = 3;
#           break;
#         default:
#           pivot = 4;
#       }

#       return [word.substring(0, pivot), word.substring(pivot, pivot + 1), word.substring(pivot + 1)];
#     },
#     goFrompercent: function(percent) {
#       this.meta.wordCount = Math.floor(this.meta.words.length / 100 * percent);
#       this.updateProgress();
#       clearInterval(this.nextWordTimeout);
#       this.readNextWord(500);
#     },
#     readNextWord: function(delay) {
#       var self = this
#         , nextWord = this.getWord()
#         , wordSpeed = this.meta.wordSpeed
#         , splitWord = this.splitWord(nextWord);

#       delay = delay || 0;

#       this.meta.$left.html(splitWord[0]);
#       this.meta.$center.html(splitWord[1]);
#       this.meta.$right.html(splitWord[2]);
#       this.updateProgress();

#       wordSpeed += nextWord.slice(-1) == "." ? wordSpeed : 0;
#       wordSpeed += delay;

#       this.meta.wordCount++;
#       nextWord = this.getWord()
      
#       if (nextWord && this.meta.play) {
#         this.nextWordTimeout = setTimeout(function() {
#             self.readNextWord();
#           }, wordSpeed);
#       }
#     },
#     init: function(text, wpm) {
#       this.stop();
#       this.meta.words = this.getWords(text);
#       this.readNextWord();
#     }
#   }

#   var dragDown = false
#     , dragOffset = {x: 0, y: 0};

#   spritzify.meta.$progressBar.click(function(e) {
#     spritzify.goFrompercent(Math.floor(100 / spritzify.meta.$progressBar.width() * (e.pageX - spritzify.meta.$progressBar.offset().left)));
#   });

#   spritzify.meta.$pausePlay.click(function() {
#     spritzify.meta.play = !spritzify.meta.play;
#     spritzify.meta.$pausePlay.addClass(spritzify.meta.play ? "fa-pause" : "fa-play").removeClass(!spritzify.meta.play ? "fa-pause" : "fa-play");
#     clearInterval(spritzify.nextWordTimeout);
#     !spritzify.meta.play || spritzify.readNextWord();
#   });

#   spritzify.meta.$words.mousedown(function(e) {
#     dragDown = true;
#     dragOffset = {
#       x: e.pageX - spritzify.meta.$spritzify.offset().left,
#       y: e.pageY - spritzify.meta.$spritzify.position().top
#     };
#   });

#   spritzify.meta.$document.mouseup(function(e) {
#     dragDown = false;
#   });

#   spritzify.meta.$document.mousemove(function(e) {
#     if (dragDown) {
#       spritzify.meta.$spritzify.css({
#         "left": e.pageX - dragOffset.x,
#         "top": e.pageY - dragOffset.y
#       });
#     }
#   });

#   var pressedTimeout;

#   spritzify.meta.$document.keydown(function(e) {
#     if (e.shiftKey) {
#       pressedTimeout = setTimeout(function() {
#         var selectedText = getSelectionText();
#         if (selectedText.length) {
#           spritzify.showSpritzify();
#           spritzify.init(selectedText, 500)
#         }
#       }, 500);
#     }
#   }).keyup(function(e) {
#     clearTimeout(pressedTimeout);
#   });

# }));

# $('body').prepend $('<div id="spritzify" class="hide"></div>').load(chrome.extension.getURL("index.html"), ->
#   spritzify = 
#     meta:
#       words: ""
#       wordCount: 0
#       play: true
#       wordSpeed: 6000 / 500
#       nextWordTimeout: 0
#       $document: $(document)
#       $spritzify: $("#spritzify")
#       $words: $("#spritzify #words")
#       $left: $("#spritzify #left")
#       $center: $("#spritzify #center")
#       $right: $("#spritzify #right")
#       $progressBar: $("#spritzify #progress-bar")
#       $progress: $("#spritzify #progress")
#       $pausePlay: $("#spritzify #pause-play")
    
#     showSpritzify: ->
#       if @meta.$spritzify.hasClass "hide"
#         $("body").css
#           "margin-top": @meta.$spritzify.outerHeight() + "px"
#           "position": "relative"

#         $("*").each (index, element) ->
#           $(element).css "top", $(element).position().top + @meta.$spritzify.outerHeight() + "px"  if $(element).css "position" is "fixed"

#         @meta.$spritzify.css "top", "0"
#         @meta.$spritzify.removeClass "hide"
#         return

#     hideSpritzify: ->
#       unless @meta.$spritzify.hasClass "hide"
#         $("body").css "margin-top", "0px"
        
#         $("*").each (index, element) ->
#           $(element).css "top", $(element).position().top - @meta.$spritzify.outerHeight() + "px"  if $(element).css "position" is "fixed"

#         @meta.$spritzify.addClass "hide"
#         return

#     getWords: (text) ->
#       text.split(/\s+/g).filter (x) ->
#         x.length

#     updateProgress: ->
#       @meta.$progress.css "width", Math.floor(100 / @meta.words.length * (@meta.wordCount + 1)) + "%"
#       return

#     stop: ->
#       @meta.wordCount = 0
#       return

#     getWord: ->
#       if @meta.wordCount <= @meta.words.length then @meta.words[@meta.wordCount] else false

#     splitWord: (word) ->    
#       pivot = switch
#         when word.length < 2 then 0
#         when word.length > 1 and word.length < 6 then 1
#         when word.length > 5 and word.length < 10 then 2
#         when word.length > 9 and word.length < 14 then 3
#         else 4

#       [
#         word.substring(0, pivot)
#         word.substring(pivot, pivot + 1)
#         word.substring(pivot + 1)
#       ]

#     goFrompercent: (percent) ->
#       @meta.wordCount = Math.floor(@meta.words.length / 100 * percent)
#       @updateProgress()
#       clearInterval @nextWordTimeout
#       @readNextWord 500
#       return

#     readNextWord: (delay) ->
#       self = @
#       nextWord = @getWord()
#       wordSpeed = @meta.wordSpeed
#       splitWord = @splitWord(nextWord)
#       delay = delay or 0
#       @meta.$left.html splitWord[0]
#       @meta.$center.html splitWord[1]
#       @meta.$right.html splitWord[2]
#       @updateProgress()
#       wordSpeed += (if nextWord.slice(-1) is "." then wordSpeed else 0)
#       wordSpeed += delay
#       @meta.wordCount++
#       nextWord = @getWord()
#       if nextWord and @meta.play
#         @nextWordTimeout = setTimeout(->
#           self.readNextWord()
#           return
#         , wordSpeed)
#       return

#     init: (text, wpm) ->
#       @stop()
#       @meta.words = @getWords(text)
#       @readNextWord()
#       return

#   getSelectionText = ->
#     if window.getSelection
#       window.getSelection().toString()
#     else if document.selection && document.selection.type != "Control"
#       document.selection.createRange().text

#   dragDown = false
#   pressedTimeout = 0
#   dragOffset = 
#     x: 0
#     y: 0

#   spritzify.meta.$progressBar.click (e) ->
#     spritzify.goFrompercent Math.floor 100 / spritzify.meta.$progressBar.width() * (e.pageX - spritzify.meta.$progressBar.offset().left)
#     return

#   spritzify.meta.$pausePlay.click ->
#     spritzify.meta.play = !spritzify.meta.play
#     spritzify.meta.$pausePlay.addClass(if spritzify.meta.play then "fa-pause" else "fa-play").removeClass(if !spritzify.meta.play then "fa-pause" else "fa-play")
#     clearInterval spritzify.nextWordTimeout 
#     !spritzify.meta.play || spritzify.readNextWord()
#     return

#   spritzify.meta.$words.mousedown (e) ->
#     dragDown = true;
#     dragOffset =
#       x: e.pageX - spritzify.meta.$spritzify.offset().left
#       y: e.pageY - spritzify.meta.$spritzify.position().top

#     return

#   spritzify.meta.$document.mouseup (e) ->
#     dragDown = false
#     return

#   spritzify.meta.$document.mousemove (e) ->
#     if dragDown
#       spritzify.meta.$spritzify.css
#         left: e.pageX - dragOffset.x
#         top: e.pageY - dragOffset.y

#     return

#   spritzify.meta.$document.keydown((e) ->
#     if e.shiftKey
#       pressedTimeout = setTimeout (->
#         selectedText = getSelectionText()
        
#         if selectedText.length
#           spritzify.showSpritzify()
#           spritzify.init selectedText, 500

#         return
#       ), 500
#   ).keyup((e) ->
#     clearTimeout pressedTimeout
#     return
#   )


$("body").prepend $("<div id=\"spritzify\" class=\"hide\"></div>").load(chrome.extension.getURL("index.html"), ->
  getSelectionText = ->
    text = ""
    if window.getSelection
      text = window.getSelection().toString()
    else text = document.selection.createRange().text  if document.selection and document.selection.type isnt "Control"
    text
  spritzify =
    meta:
      words: ""
      wordCount: 0
      play: true
      wordSpeed: 60000 / 500
      nextWordTimeout: 0
      $document: $(document)
      $spritzify: $("#spritzify")
      $words: $("#spritzify #words")
      $left: $("#spritzify #left")
      $center: $("#spritzify #center")
      $right: $("#spritzify #right")
      $progressBar: $("#spritzify #progress-bar")
      $progress: $("#spritzify #progress")
      $pausePlay: $("#spritzify #pause-play")

    showSpritzify: ->
      if spritzify.meta.$spritzify.hasClass("hide")
        $("body").css
          "margin-top": spritzify.meta.$spritzify.outerHeight() + "px"
          position: "relative"

        $("*").each (index, element) ->
          $(element).css "top", $(element).position().top + spritzify.meta.$spritzify.outerHeight() + "px"  if $(element).css("position") is "fixed"
          return

        @meta.$spritzify.css 
          "top": "0"
          "margin-top": "0"
        @meta.$spritzify.removeClass "hide"
        true
      else
        false

    hideSpritzify: ->
      unless spritzify.meta.$spritzify.hasClass("hide")
        $("body").css "margin-top", "0px"
        $("*").each (index, element) ->
          $(element).css "top", $(element).position().top - spritzify.meta.$spritzify.outerHeight() + "px"  if $(element).css("position") is "fixed"
          return

        spritzify.meta.$spritzify.addClass "hide"
        true
      else
        false

    getWords: (text) ->
      text.split(/\s+/g).filter (x) ->
        x.length


    updateProgress: ->
      @meta.$progress.css "width", Math.floor(100 / @meta.words.length * (@meta.wordCount + 1)) + "%"
      return

    stop: ->
      @meta.wordCount = 0
      return

    getWord: ->
      (if @meta.wordCount <= @meta.words.length then @meta.words[@meta.wordCount] else false)

    splitWord: (word) ->
      pivot = 1
      telly = true
      switch true
        when word.length <= 1
          pivot = 0
        when word.length >= 2 and word.length <= 5
          pivot = 1
        when word.length >= 6 and word.length <= 9
          pivot = 2
        when word.length >= 10 and word.length <= 13
          pivot = 3
        else
          pivot = 4
      [
        word.substring(0, pivot)
        word.substring(pivot, pivot + 1)
        word.substring(pivot + 1)
      ]

    goFrompercent: (percent) ->
      @meta.wordCount = Math.floor(@meta.words.length / 100 * percent)
      @updateProgress()
      clearInterval @nextWordTimeout
      @readNextWord 500
      return

    readNextWord: (delay) ->
      self = this
      nextWord = @getWord()
      wordSpeed = @meta.wordSpeed
      splitWord = @splitWord(nextWord)
      delay = delay or 0
      @meta.$left.html splitWord[0]
      @meta.$center.html splitWord[1]
      @meta.$right.html splitWord[2]
      @updateProgress()
      wordSpeed += (if nextWord.slice(-1) is "." then wordSpeed else 0)
      wordSpeed += delay
      @meta.wordCount++
      nextWord = @getWord()
      if nextWord and @meta.play
        @nextWordTimeout = setTimeout(->
          self.readNextWord()
          return
        , wordSpeed)
      return

    init: (text, wpm, countdown) ->
      @stop()
      @meta.words = @getWords text
      @readNextWord(if countdown then 1000 else 0)
      return

  dragDown = false
  dragOffset =
    x: 0
    y: 0

  spritzify.meta.$progressBar.click (e) ->
    spritzify.goFrompercent Math.floor(100 / spritzify.meta.$progressBar.width() * (e.pageX - spritzify.meta.$progressBar.offset().left))
    return

  spritzify.meta.$pausePlay.click ->
    spritzify.meta.play = not spritzify.meta.play
    spritzify.meta.$pausePlay.addClass((if spritzify.meta.play then "fa-pause" else "fa-play")).removeClass (if not spritzify.meta.play then "fa-pause" else "fa-play")
    clearInterval spritzify.nextWordTimeout
    not spritzify.meta.play or spritzify.readNextWord()
    return

  spritzify.meta.$words.mousedown (e) ->
    dragDown = true
    dragOffset =
      x: e.pageX - spritzify.meta.$spritzify.offset().left
      y: e.pageY - spritzify.meta.$spritzify.position().top

    return

  spritzify.meta.$document.mouseup (e) ->
    dragDown = false
    return

  spritzify.meta.$document.mousemove (e) ->
    if dragDown
      spritzify.meta.$spritzify.css
        left: e.pageX - dragOffset.x
        top: e.pageY - dragOffset.y

    return

  pressedTimeout = undefined
  spritzify.meta.$document.keydown((e) ->
    if e.shiftKey
      pressedTimeout = setTimeout(->
        selectedText = getSelectionText()
        if selectedText.length
          setTimeout spritzify.init selectedText, 500, spritzify.showSpritzify()
        return
      , 500)
    return
  ).keyup (e) ->
    clearTimeout pressedTimeout
    return

  return
)