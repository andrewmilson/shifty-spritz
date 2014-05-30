$("body").prepend $("<div id=\"shifty-spritz\" class=\"hide\"></div>").load(chrome.extension.getURL("index.html"), ->
  getSelectionText = ->
    text = ""
    if window.getSelection
      text = window.getSelection().toString()
    else text = document.selection.createRange().text  if document.selection and document.selection.type isnt "Control"
    text
  shiftySpritz =
    meta:
      word: 0
      text: {}
      play: true
      wordSpeed: 60000 / 400
      nextWordTimeout: 0
      $document: $(document)
      $shiftySpritz: $("#shifty-spritz")
      $words: $("#shifty-spritz #words")
      $left: $("#shifty-spritz #left")
      $center: $("#shifty-spritz #center")
      $right: $("#shifty-spritz #right")
      $progressBar: $("#shifty-spritz #progress-bar")
      $progress: $("#shifty-spritz #progress")
      $pausePlay: $("#shifty-spritz #pause-play")
      $close: $("#shifty-spritz #close")

    showShiftySpritz: ->
      if shiftySpritz.meta.$shiftySpritz.hasClass("hide")
        $("body").addClass("shifty-spritz").css
          "margin-top": shiftySpritz.meta.$shiftySpritz.outerHeight() + "px"
          position: "relative"

        $("*").each (index, element) ->
          $(element).css "top", $(element).position().top + shiftySpritz.meta.$shiftySpritz.outerHeight() + "px"  if $(element).css("position") is "fixed"
          return

        @meta.$shiftySpritz.css 
          "top": "0"
          "margin-top": "0"
        @meta.$shiftySpritz.removeClass "hide"
        true
      else
        false

    hideShiftySpritz: ->
      unless shiftySpritz.meta.$shiftySpritz.hasClass("hide")
        $("body").css "margin-top", "0px"
        
        $("*").each (index, element) ->
          $(element).css "top", $(element).position().top - shiftySpritz.meta.$shiftySpritz.outerHeight() + "px"  if $(element).css("position") is "fixed"
          return

        shiftySpritz.meta.$shiftySpritz.addClass "hide"
        true
      else
        false

    empty: (text) ->
      !!text.length

    getText: (text) ->
      map = (x) ->
        words = x.split(/\s+/g)
        words.push("");
        words

      text = text.split(/[\n\r]+/g).filter(@empty).map(map.bind(this)).reduce (a, b) -> a.concat b
      text.pop()
      text

    updateProgress: ->
      @meta.$progress.css "width", Math.floor(100 / @meta.words.length * (@meta.word + 1)) + "%"
      return

    getWord: ->
      @meta.text[@meta.paragraph].words[@meta.word]

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
      @meta.word = Math.floor(@meta.words.length / 100 * percent)
      @updateProgress()
      clearInterval @nextWordTimeout
      @readNextWord @meta.wordSpeed
      return

    readNextWord: (delay) ->
      if @meta.word is @meta.text.length
        return false

      self = @
      wordSpeed = @meta.wordSpeed
      splitWord = @splitWord @meta.text[@meta.word]
      wordSpeed += (if @meta.text[@meta.word].slice(-1) in [".", ","] then wordSpeed else 0)
      wordSpeed += (if @meta.text[@meta.word] == "" then wordSpeed * 3 else 0)
      wordSpeed += delay or 0

      @meta.$left.html splitWord[0]
      @meta.$center.html splitWord[1]
      @meta.$right.html splitWord[2]

      @meta.word++

      @meta.nextWordTimeout = setTimeout(->
        self.readNextWord()
        return
      , wordSpeed)
      return

    init: (text, wpm, countdown) ->
      @meta.word = 0
      @meta.text = @getText text
      console.log @meta.text
      @readNextWord(if countdown then @meta.wordSpeed else 0)
      return

  dragDown = false
  dragOffset =
    x: 0
    y: 0

  shiftySpritz.meta.$progressBar.click (e) ->
    shiftySpritz.goFrompercent Math.floor(100 / shiftySpritz.meta.$progressBar.width() * (e.pageX - shiftySpritz.meta.$progressBar.offset().left))
    return

  shiftySpritz.meta.$pausePlay.click ->
    shiftySpritz.meta.play = not shiftySpritz.meta.play
    shiftySpritz.meta.$pausePlay.addClass((if shiftySpritz.meta.play then "fa-pause" else "fa-play")).removeClass (if not shiftySpritz.meta.play then "fa-pause" else "fa-play")
    clearInterval shiftySpritz.nextWordTimeout
    not shiftySpritz.meta.play or shiftySpritz.readNextWord()
    return

  shiftySpritz.meta.$words.mousedown (e) ->
    dragDown = true
    dragOffset =
      x: e.pageX - shiftySpritz.meta.$shiftySpritz.offset().left
      y: e.pageY - shiftySpritz.meta.$shiftySpritz.position().top

    return

  shiftySpritz.meta.$document.mouseup (e) ->
    dragDown = false
    return

  shiftySpritz.meta.$document.mousemove (e) ->
    if dragDown
      shiftySpritz.meta.$shiftySpritz.css
        left: e.pageX - dragOffset.x
        top: e.pageY - dragOffset.y

    return

  shiftySpritz.meta.$close.click ->
    shiftySpritz.hideShiftySpritz()

  pressedTimeout = undefined
  shiftySpritz.meta.$document.keydown((e) ->
    if e.shiftKey
      pressedTimeout = setTimeout(->
        selectedText = getSelectionText()
        if selectedText.length
          setTimeout shiftySpritz.init selectedText, 500, shiftySpritz.showShiftySpritz()
        return
      , 500)
    return
  ).keyup (e) ->
    clearTimeout pressedTimeout
    return

  return
)