/* global $, ns */
ns('com.project.clm.help').modify({

  initialize: function (modes) {
    var helpBtn = $('.btn-help')
    var helpModal = $('.help-modal')
    var helpImage = $('.help-modal .help-image')
    var helpClose = $('.help-modal .help-close')
    var helpBtnNav = $('.help-modal .help-btn-nav')

    var helpBtnLeftBottom = $('.help-modal .btn-left-bottom')
    var helpBtnLeftTop = $('.help-modal .btn-left-top')
    var helpBtnLeftPlus = $('.help-modal .btn-left-plus')
    var helpBtnRight = $('.help-modal .btn-right')

    var helpMode = 'global'
    var helpButtonMode = 'closed-global'
    var currentIndex = 1

    helpBtn.on('touchstart', onHelpOpen)
    helpClose.on('touchstart', onHelpClose)

    helpBtnLeftBottom.on('touchstart', function () {
      switch (helpButtonMode) {
        case 'closed-sales-global':
          helpMode = 'global'
          helpButtonMode = 'closed-global'
          showHelpScreen()
          break
        case 'closed-sales-screen':
          helpMode = 'screen'
          helpButtonMode = 'closed-screen'
          showHelpScreen()
          break
        case 'open-sales-global':
          helpMode = 'global'
          helpButtonMode = 'closed-global'
          showHelpScreen()
          break
        case 'open-sales-screen':
          helpMode = 'screen'
          helpButtonMode = 'closed-screen'
          showHelpScreen()
          break
      }
    })

    helpBtnLeftTop.on('touchstart', function () {
      switch (helpButtonMode) {
        case 'open-global':
          helpMode = 'screen'
          helpButtonMode = 'closed-screen'
          showHelpScreen()
          break
        case 'open-screen':
          helpMode = 'global'
          helpButtonMode = 'closed-global'
          showHelpScreen()
          break
        case 'open-sales-global':
          helpMode = 'screen'
          helpButtonMode = 'closed-screen'
          showHelpScreen()
          break
        case 'open-sales-screen':
          helpMode = 'global'
          helpButtonMode = 'closed-global'
          showHelpScreen()
          break
      }
    })

    helpBtnLeftPlus.on('touchstart', function () {
      switch (helpButtonMode) {
        case 'closed-global':
          helpButtonMode = 'open-global'
          showHelpScreen()
          break
        case 'closed-screen':
          helpButtonMode = 'open-screen'
          showHelpScreen()
          break
        case 'closed-sales-global':
          helpButtonMode = 'open-sales-global'
          showHelpScreen()
          break
        case 'closed-sales-screen':
          helpButtonMode = 'open-sales-screen'
          showHelpScreen()
          break
        case 'open-global':
          helpButtonMode = 'closed-global'
          showHelpScreen()
          break
        case 'open-screen':
          helpButtonMode = 'closed-screen'
          showHelpScreen()
          break
        case 'open-sales-global':
          helpButtonMode = 'closed-global'
          showHelpScreen()
          break
        case 'open-sales-screen':
          helpButtonMode = 'closed-screen'
          showHelpScreen()
          break
      }
    })

    helpBtnRight.on('touchstart', function () {
      switch (helpButtonMode) {
        case 'closed-global':
          helpMode = 'sales'
          helpButtonMode = 'closed-sales-global'
          showHelpScreen()
          break
        case 'closed-screen':
          helpMode = 'sales'
          helpButtonMode = 'closed-sales-screen'
          showHelpScreen()
          break
        case 'open-global':
          helpMode = 'sales'
          helpButtonMode = 'closed-sales-global'
          showHelpScreen()
          break
        case 'open-screen':
          helpMode = 'sales'
          helpButtonMode = 'closed-sales-screen'
          showHelpScreen()
          break
      }
    })

    helpModal.swipe({
      swipe: function (event, direction) {
        // Don't allow us to click through the help layer
        event.stopPropagation()

        // Cycle through help
        if (direction === 'up') {
          // Next Images
          if (currentIndex === modes[helpMode]) {
            currentIndex = 1
          } else {
            currentIndex++
          }
        } else if (direction === 'down') {
          // Prev Image
          if (currentIndex <= 1) {
            currentIndex = modes[helpMode]
          } else {
            currentIndex--
          }
        }

        showHelpScreen()
      }
    })

    function onHelpOpen () {
      helpModal.addClass('active')
      showHelpScreen()
    }

    function onHelpClose () {
      helpModal.removeClass('active')
    }

    function showHelpScreen () {
      var className = 'help-' + helpMode + '-' + currentIndex
      helpImage.removeClass().addClass('help-image ' + className)
      helpBtnNav.removeClass().addClass('help-btn-nav ' + helpButtonMode)
    }
  }
})

/* vi: set shiftwidth=2 tabstop=2 expandtab: */
