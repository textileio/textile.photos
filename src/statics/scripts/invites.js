(function () {

  var regex = /[?&]([^=#]+)=([^&#]*)/g,
      url = window.location.href,
      params = {},
      match;
  while(match = regex.exec(url)) {
    params[match[1]] = match[2];
  }
  if ('inviter' in params) {
    document.getElementsByClassName("invite-username")[0].innerText = params['inviter'];
    document.getElementsByClassName("invite-username")[1].innerText = params['inviter'];
    document.getElementsByClassName("invite-username")[2].innerText = params['inviter'];
  }
  if ('referral' in params) {
    document.getElementsByClassName("invite-code")[0].innerText = params['referral'];
  }
  if ('internal' in params) {
    document.getElementsByClassName("invite-type")[0].innerText = ' added you to the list';
  }

  //* Wow init
  new WOW({
    boxClass:     'anim',
    animateClass: 'animated',
    offset:       0,
    mobile:       true,
    live:         true
  }).init()

  var step1AnimNode=document.querySelector(".steps__content__image__list__item--1")
  var step2AnimNode=document.querySelector(".steps__content__image__list__item--2")
  var step3AnimNode=document.querySelector(".steps__content__image__list__item--3")
  var animationsList = [
    {
      node:step1AnimNode,
      path:"/statics/bodymovin/step1/data.json"
    },
    {
      node:step2AnimNode,
      path:"/statics/bodymovin/step2/data.json"
    },
    {
      node:step3AnimNode,
      path:"/statics/bodymovin/step3/data.json"
    }]
  window.loadedAnimationsList=[]
  animationsList.forEach(function(o){
    window.loadedAnimationsList.push(
        bodymovin.loadAnimation({
          container:o.node,
          renderer:"svg",
          loop:o.loop||!1,
          autoplay:!1,
          path:o.path
        })
    )
  })

  loadedAnimationsList[0].setSpeed = 0.5
  loadedAnimationsList[0].setQuality = 'medium'
  loadedAnimationsList[0].play()

  //* Steps list
  var stepBoxPositions = {
    tablet: [0, 150, 300],
    desktop: [0, 160, 325]
  }
  var activeStep = 0

  var stepsBoxesContainerNode = document.querySelector('.steps__content__list')
  var stepImagesNodes = document.querySelectorAll('.steps__content__image__list__item')
  var boxNode = document.querySelector('.steps__content__list__item--active')

  var animateSteps = function (step) {
    if (window.innerWidth > 1024) {
      boxNode.style.top = stepBoxPositions.desktop[step] + 'px'
    } else {
      boxNode.style.top = stepBoxPositions.tablet[step] + 'px'
    }

    for (var x = 0; x < stepImagesNodes.length; x++) {
      var next = x + 1 < stepImagesNodes.length ? x + 1 : 0
      if (stepImagesNodes[x].dataset.image !== step) {
        stepImagesNodes[x].classList.add('hide')
        loadedAnimationsList[next].pause()
      } else {
        stepImagesNodes[x].classList.remove('hide')
        loadedAnimationsList[x].goToAndPlay(0)
      }
    }
  }

  /**
   * Animates every step on mouser over on each one of the titles
   */
  // stepsBoxesContainerNode.addEventListener('mouseover', function (e) {
  //   if (!e.target.classList.contains('steps__content__list__item')) return
  //   var step = e.target.dataset.step
  //   animateSteps(step)
  //   activeStep = step
  // })

  /**
   * Animates steps automatically every 4 seconds
   */
  var stepsRepetitionInterval = setInterval(function () {
    if (activeStep < 3) {
      animateSteps(String(activeStep))
      activeStep++
    } else {
      activeStep = 0
    }
  }, 4000)


  //* Smooth Scroll init
  new SmoothScroll('a[href*="#"]', {
    // Selectors
    ignore: '[data-scroll-ignore]', // Selector for links to ignore (must be a valid CSS selector)
    header: null, // Selector for fixed headers (must be a valid CSS selector)

    // Speed & Easing
    speed: 500, // Integer. How fast to complete the scroll in milliseconds
    offset: 0, // Integer or Function returning an integer. How far to offset the scrolling anchor location in pixels
    easing: 'easeInOutCubic', // Easing pattern to use
    customEasing: function (time) {
    }, // Function. Custom easing pattern

    // Callback API
    before: function () {
    }, // Callback to run before scroll
    after: function () {
    } // Callback to run after scroll
  })
})()