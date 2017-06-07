/* globals ns, org, com, $ */
ns('com.project.clm').modify({
  VERSION: '0.0.2',
  DEBUG: true,
  _currentISI: 0,
  _maxISI: 7,

  EVENT_FOOTNOTE: 'event_footnote',
  EVENT_REFERENCE: 'event_reference',

  presentationStructure: {
    'presentationName': 'Project',
    'presentationID': 'PROJECT_000',
    'slides': [
      {
        'id': 'landing',
        'keyMessage': 'project-landing.zip',
        'jobCode': 'S27183 03/17'
      },
      {
        'id': 'home',
        'keyMessage': 'project-main.zip',
        'jobCode': 'S27183 03/17'
      },
      {
        'id': 'pi',
        'keyMessage': 'project-pi.zip',
        'jobCode': 'S10324 11/15'
      }
    ]
  },

  /* Package log method
  */
  log: function () {
    if (com.project.clm.DEBUG) {
      console.log('[com.project.clm]', Array.prototype.join.call(arguments, ' '))
    }
  },

  /* Startup initialization
  */
  initialize: function () {
    org.tomasino.clm.navCreate(com.project.clm.presentationStructure)

    var isiScroll = $('.main .isi')
    isiScroll.on('touchstart', function () {
      com.project.clm.cycleISI()
    })

    org.tomasino.clm.subscribe(org.tomasino.clm.EVENT_CURRENTSLIDEID, function (id) {
      var jobCode = org.tomasino.clm.getCurrentSlideJobCode()
      if (jobCode) $('.job-number').text(jobCode)
    })

    $('.footer .btn-references').on('touchstart', function () {
      org.tomasino.clm.publish(com.project.clm.EVENT_REFERENCE)
    })

    $('.footer .btn-footnotes').on('touchstart', function () {
      org.tomasino.clm.publish(com.project.clm.EVENT_FOOTNOTE)
    })

    $('.footer .btn-isi').on('touchstart', function () {
      $('.full-isi').addClass('active')
    })

    $('.full-isi .close').on('touchstart', function () {
      $('.full-isi').removeClass('active')
    })

    $('.footer .btn-pi').on('touchstart', function () {
      org.tomasino.clm.navToID('pi')
    })

    $('.btn-text-pi').on('touchstart', function () {
      org.tomasino.clm.navToID('pi')
    })

    /* Ready for inidividual asset code.
    */
    com.project.clm.assetReady()
  },

  /* Cycle through the ISI
   *
   * Made available publically to advance on asset actions
   */
  cycleISI: function () {
    var isiScroll = $('.main .isi')
    isiScroll.removeClass('s0 s1 s2 s3 s4 s5 s6 s7')
    com.project.clm._currentISI ++
    if (com.project.clm._currentISI > com.project.clm._maxISI) {
      com.project.clm._currentISI = 0
    }
    isiScroll.addClass('s' + com.project.clm._currentISI)
  },

  /* Override this function in the asset code as a place for initialization.
   * Use this instead of DocumentReady
   */
  assetReady: function () {
    com.project.clm.log('Override this method for asset init')
  }

})

$(document).ready(function () {
  org.tomasino.clm.initialize()
  com.project.clm.initialize()
  org.tomasino.clm.start()
})

/* vi: set shiftwidth=2 tabstop=2 expandtab: */
