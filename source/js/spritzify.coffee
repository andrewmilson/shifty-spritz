$("body").prepend $("<div id=\"shifty-spritz\" class=\"hide\" tabindex=\"1\"></div>").load(chrome.extension.getURL("index.html"), ->
  console.log chrome

  getSelectionText = ->
    if window.getSelection
      window.getSelection().toString()
    else document.selection.createRange().text if document.selection and document.selection.type isnt "Control"
    else ""

  shiftySpritz =
    meta:
      word: 0
      text: {}
      play: true
      wpm: 60000 / 300
      nextWordTimeout: 0
      $document: $(document)
      $shiftySpritz: $(this)
      $words: $("#shifty-spritz #words-shifty")
      $left: $("#shifty-spritz #left-shifty")
      $center: $("#shifty-spritz #center-shifty")
      $right: $("#shifty-spritz #right-shifty")
      $progressBar: $("#shifty-spritz #progress-bar-shifty")
      $progressSeek: $("#shifty-spritz #progress-bar-shifty #seek-shifty")
      $progress: $("#shifty-spritz #progress-bar-shifty #progress-shifty")
      $pausePlay: $("#shifty-spritz #pause-play-shifty")
      $close: $("#shifty-spritz #close-shifty")

    show: ->
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

    close: ->
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
        words = x.split /\s+/g
        words.push ""
        words
      text = text.split(/[\n\r]+/g).filter(@empty).map(map.bind(this)).reduce (a, b) -> a.concat b
      text.pop()
      text

    updateProgress: ->
      @meta.$progress.css "width", 100 / @meta.text.length * (@meta.word) + "%"
      return

    getWord: ->
      @meta.text[@meta.paragraph].words[@meta.word]

    splitWord: (word) ->
      pivot = switch
        when word.length < 2 then 0
        when word.length < 6 then 1
        when word.length < 10 then 2
        when word.length < 14 then 3
        else 4
      [
        word.substring 0, pivot
        word.substring pivot, pivot + 1
        word.substring pivot + 1
      ]

    goFromPercent: (percent, readNext) ->
      @meta.word = Math.floor @meta.text.length / 100 * percent
      @meta.$progress.css "width", percent + "%"
      clearTimeout @meta.nextWordTimeout
      @readNextWord @meta.wpm, readNext
      return

    updateWordPositioning: ->
      @meta.$center.css "margin-left", -@meta.$center.width() / 2 + "px"
      @meta.$left.css "padding-right", @meta.$center.width() / 2 + "px"
      console.log()

    readNextWord: (delay = 0, readNext = true) ->
      return false if @meta.word is @meta.text.length
      self = @
      wpm = @meta.wpm
      splitWord = @splitWord @meta.text[@meta.word]
      wpm += (if @meta.text[@meta.word].slice(-1) in [".", ",", "!", "?"] then wpm else 0)
      wpm += (if @meta.text[@meta.word] == "" then wpm * 3 else 0)
      wpm += delay
      @meta.$left.html splitWord[0]
      @meta.$center.html(splitWord[1])
      @meta.$right.html splitWord[2]
      @updateWordPositioning()
      @meta.word++
      if readNext
        @updateProgress()
        @meta.nextWordTimeout = setTimeout(->
          self.readNextWord()
          return
        , wpm)
      return

    playPause: (delay) ->
      @meta.$pausePlay.addClass((if @meta.play then "fa-pause" else "fa-play")).removeClass (if not @meta.play then "fa-pause" else "fa-play")
      clearTimeout @meta.nextWordTimeout
      not @meta.play or @readNextWord(delay)
      return

    play: (delay) ->
      @meta.play = true
      @playPause(delay)
      return

    pause: ->
      @meta.play = false
      @playPause()
      return

    init: (text, wpm, countdown) ->
      clearTimeout @meta.nextWordTimeout
      @meta.word = 0
      @meta.text = @getText text
      @play(if countdown then @meta.wpm else 0)
      return

  progressBarMouseDown = false

  chrome.storage.sync.get ["wpm", "color", "size", "style"], (value) ->
    shiftySpritz.meta.wpm = 60000 / value.wpm or 60000 / 300
    shiftySpritz.meta.$words.css
      "font-size": parseInt(value.size or 25) + "px"
      "height": parseInt(value.size or 25) + 25 + "px"
      "line-height": parseInt(value.size or 25) + 25 + "px"
      "font-weight": value.style or "normal"
    shiftySpritz.meta.$center.css "color", value.color or "#fa3d3d"
    return

  chrome.storage.onChanged.addListener (changes, namespace) ->
    shiftySpritz.meta.wpm = 60000 / changes.wpm.newValue if changes.wpm
    if changes.size then shiftySpritz.meta.$words.css
      "font-size": parseInt(changes.size.newValue or 25) + "px"
      "height": parseInt(changes.size.newValue or 25) + 25 + "px"
      "line-height": parseInt(changes.size.newValue or 25) + 25 + "px"
    if changes.style then shiftySpritz.meta.$words.css
      "font-weight": changes.style.newValue or "normal"
    shiftySpritz.meta.$center.css "color", changes.color.newValue or shiftySpritz.meta.$center.css "color" if changes.color
    shiftySpritz.updateWordPositioning()
    return

  shiftySpritz.meta.$progressBar.mousedown (e) ->
    shiftySpritz.goFromPercent 100 / shiftySpritz.meta.$progressBar.width() * (e.pageX + 6 - shiftySpritz.meta.$progressBar.offset().left), false
    progressBarMouseDown = true
    return

  shiftySpritz.meta.$progressBar.mousemove (e) ->
    shiftySpritz.meta.$progressSeek.css "left", Math.max(e.pageX - shiftySpritz.meta.$progressBar.offset().left, 6) + "px"

  shiftySpritz.meta.$pausePlay.click ->
    if shiftySpritz.meta.play then shiftySpritz.pause() else shiftySpritz.play()

  shiftySpritz.meta.$document.mouseup (e) ->
    not progressBarMouseDown or shiftySpritz.goFromPercent 100 / shiftySpritz.meta.$progressBar.width() * Math.max(Math.min(e.pageX + 6 - shiftySpritz.meta.$progressBar.offset().left, shiftySpritz.meta.$progressBar.width()), 0), shiftySpritz.meta.play
    progressBarMouseDown = false
    return

  shiftySpritz.meta.$document.mousemove (e) ->
    if progressBarMouseDown
      shiftySpritz.goFromPercent 100 / shiftySpritz.meta.$progressBar.width() * Math.max(Math.min(e.pageX + 6 - shiftySpritz.meta.$progressBar.offset().left, shiftySpritz.meta.$progressBar.width()), 0), false
    return

  shiftySpritz.meta.$close.click ->
    shiftySpritz.close()

  shiftySpritz.meta.$shiftySpritz.keydown (e) ->
    if e.keyCode == 32
      if shiftySpritz.meta.play then shiftySpritz.pause() else shiftySpritz.play()
      e.preventDefault()
    else if e.keyCode == 27
      shiftySpritz.close()

  pressedTimeout = undefined
  shiftySpritz.meta.$document.keydown((e) ->
    if e.shiftKey
      pressedTimeout = setTimeout(->
        selectedText = getSelectionText()
        if selectedText.length
          setTimeout shiftySpritz.init selectedText, 500, shiftySpritz.show()
          shiftySpritz.meta.$shiftySpritz.focus()
        return
      , 500)
    return
  ).keyup (e) ->
    clearTimeout pressedTimeout
    return

  return
)
