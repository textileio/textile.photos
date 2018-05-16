(function () {

  //* Wow init
  new WOW({
    boxClass:     'anim',
    animateClass: 'animated',
    offset:       0,
    mobile:       true,
    live:         true
  }).init()

  //* Slider
  var sliderItemsNodes = document.querySelectorAll('.how__slider__content__list__item__desktop')
  var dotsItemsNodes = document.querySelectorAll('.how__slider__content__dots__item')
  var leftNode = document.querySelector('.how__slider__left')
  var rightNode = document.querySelector('.how__slider__right')

  var activeItem = 0
  leftNode.addEventListener('click', function () {
    if (activeItem <= 0) return

    for (var i = 0; i < sliderItemsNodes.length; i++) {
      sliderItemsNodes[i].classList.remove('sbFadeRight', 'sbFadeLeft')

      if (activeItem === i) {
        sliderItemsNodes[i].classList.add('sbFadeRight')
      }
    }

    activeItem = activeItem - 1
    setTimeout(function () {
      for (var j = 0; j < sliderItemsNodes.length; j++) {
        if (activeItem === j) {
          sliderItemsNodes[j].classList.remove('hide')
          dotsItemsNodes[j].classList.add('how__slider__content__dots__item--active')
        } else {
          sliderItemsNodes[j].classList.add('hide')
          dotsItemsNodes[j].classList.remove('how__slider__content__dots__item--active')
        }
      }
    }, 500)
  })

  rightNode.addEventListener('click', function () {
    if (activeItem >= sliderItemsNodes.length - 1) return

    for (var i = 0; i < sliderItemsNodes.length; i++) {
      sliderItemsNodes[i].classList.remove('sbFadeRight', 'sbFadeLeft')

      if (activeItem === i) {
        sliderItemsNodes[i].classList.add('sbFadeLeft')
      }
    }

    activeItem = activeItem + 1
    setTimeout(function () {
      for (var j = 0; j < sliderItemsNodes.length; j++) {
        if (activeItem === j) {
          sliderItemsNodes[j].classList.remove('hide')
          dotsItemsNodes[j].classList.add('how__slider__content__dots__item--active')
        } else {
          sliderItemsNodes[j].classList.add('hide')
          dotsItemsNodes[j].classList.remove('how__slider__content__dots__item--active')
        }
      }
    }, 500)
  })

  /*
    Grab latest blog post data from Medium. Async so page loads.
 */
  var loadRSS = function(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Ftextileio', true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        var title = xhr.response.items[0].title;
        if (title.length > 60) {
          title = title.substring(0,57) + '...'
        }
        var span= document.createElement('span');
        span.innerHTML= xhr.response.items[0].description;
        var content = span.textContent || span.innerText;
        if (content.length > 100) {
          content = content.substring(0,97);
          content = content.substring(0, content.lastIndexOf(" ")) + '...'
        }
        var link = xhr.response.items[0].link;
        document.getElementsByClassName("blog__content__text__title")[0].innerHTML = title;
        document.getElementsByClassName("blog__content__text__content")[0].innerHTML = content;
        document.getElementsByClassName("blog__content__text__link")[0].href = link;
      }
    };
    xhr.send();
  }

  //* Bodymovin init
  var heroAnimNode = document.querySelector('.hero__animation')
  var step1AnimNode = document.querySelector('.steps__content__image__list__item--1')
  var step2AnimNode = document.querySelector('.steps__content__image__list__item--2')
  var step3AnimNode = document.querySelector('.steps__content__image__list__item--3')

  var animationsList = [
    {
      node: heroAnimNode,
      path: 'statics/bodymovin/hero/data.json',
      loop: true
    },
    {
      node: step1AnimNode,
      path: 'statics/bodymovin/step1/data.json'
    },
    {
      node: step2AnimNode,
      path: 'statics/bodymovin/step2/data.json'
    },
    {
      node: step3AnimNode,
      path: 'statics/bodymovin/step3/data.json'
    }
  ]

  var loadedAnimationsList = animationsList.map(function (animation) {
    return bodymovin.loadAnimation({
      container: animation.node,
      renderer: 'svg',
      loop: animation.loop || false,
      autoplay: false,
      path: animation.path
    })
  })

  loadedAnimationsList[0].addEventListener('DOMLoaded', function() {
    setTimeout(loadRSS, 1);
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
      if (stepImagesNodes[x].dataset.image !== step) {
        stepImagesNodes[x].classList.add('hide')
        loadedAnimationsList[x + 1].pause()
      } else {
        stepImagesNodes[x].classList.remove('hide')
        if (loadedAnimationsList[x + 1].isPaused) {
          loadedAnimationsList[x + 1].goToAndPlay(0)
        }
      }
    }
  }

  /**
   * Animates every step on mouser over on each one of the titles
   */
  stepsBoxesContainerNode.addEventListener('mouseover', function (e) {
    if (!e.target.classList.contains('steps__content__list__item')) return
    var step = e.target.dataset.step
    animateSteps(step)
    activeStep = step
  })

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