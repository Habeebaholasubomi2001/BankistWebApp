'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// IMPLEMENTING SMOOTH SCROLLING
const btnScrollTo = document.querySelector('.btn--scroll-to');
const featuresScrollTo = document.querySelector('.f');
const operationsScrollTo = document.querySelector('.o');
const testimonialsScrollTo = document.querySelector('.t');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const section4 = document.querySelector('#section--4');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect(); // to know the position of the section we want to scroll to

  // Position of the button we clicked
  console.log(btnScrollTo.getBoundingClientRect());

  // Current scroll position
  console.log('Current Scroll (X/Y)', window.scrollX, window.scrollY);

  // Current height and width of viewport
  console.log(
    'Height and width of viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling: Old way
  // window.scrollTo(
  //   s1coords.left + window.scrollX,
  //   s1coords.top + window.scrollY
  // ); // the top value is only relative to the viewport and will not work when the distance between the button and the section is very small so instead we add the current scroll postion to the top

  // Making it scroll smoothly
  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  // ES6
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// Implementing smooth scrolling for the nav links(I did it by myself :D)
// featuresScrollTo.addEventListener('click', () => {
//   section1.scrollIntoView({
//     behavior: 'smooth',
//   });
// });

// operationsScrollTo.addEventListener('click', () => {
//   section2.scrollIntoView({
//     behavior: 'smooth',
//   });
// });

// testimonialsScrollTo.addEventListener('click', () => {
//   section3.scrollIntoView({
//     behavior: 'smooth',
//   });
// });

//////////////////// Page Navigation /////////////////// (Tutor's method)
// EVENT DELEGATION
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// BUILDING A TABBED COMPONENT: Using event delegation
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activating content area
  // 1. Remove the class on all the boxes initially
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // 2. Adding the active class to the clicked content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// MENU FADE ANIMATION
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

// Passing argument into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// IMPLEMENTING STICKY NAVIGATION: Using Intersection Observer API
// The call back function will be invoked each time the target(section 1) intersects the root element(viewport) at the defined threshold

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// REVEALING ELEMENTS ON SCROLL: Sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////////////////// Lazy Image loading ///////////////////////
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////// Slider //////////////////////////////
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // FUNCTIONS
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // EVENT HANDLERS
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Making Arrow left and right on the keyboard work
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();

    // Using shortcircuiting
    e.key === 'ArrowLeft' && prevSlide();
  });

  // Making the dots work
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide
      const slide = e.target.dataset.slide;
      console.log(slide);
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* This is the beginning of the lectures
// SELECTING, CREATING AND DELETING ELEMENTS FROM THE DOM USING JS
// Selecting entire webpage(document)
console.log(document.documentElement);
console.log(document.head); // only head
console.log(document.body); // only body

// Selecting elements using class
const allSections = document.querySelectorAll('.section'); // only queryselector needs (.)
console.log(allSections);

// By ID
document.getElementById('section--1');

// By Tag name
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); // This return an HTML Collection which is different from NodeList and it is also known as a live collection, if any change is made to an element, it updates immediately (very useful)

// By Class name
document.getElementsByClassName('btn'); // Also returns a live HTML collection

// Creating and Inserting elements
const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics <button class = "btn btn--close-cookie"> Got it! </button> ';
header.append(message); // Inserts as the last child node of header

// header.before(message); // Inserts the div before the header element as a sibling
// header.after(message); // Inserts the div after the header element as a sibling

 Deleting elements
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();

  // Before ES6
  // message.parentElement.removeChild(message);
}); 

// STYLES, ATTRIBUTES AND CLASSES
// STYLES
message.style.backgroundColor = '#37383d'; // This is an inline style on the message element(div)
console.log(message.style.width); // We can only read the style we set using JS using this method

// Reading all styles on the element
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// Increasing the height of the message
message.style.height =
  parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// Working with CSS custom properties(e.g the colors defined in the root element aka document element, --color-primary)
document.documentElement.style.setProperty('--color-primary', 'orangered');

// ATTRIBUTES: e.g src, class, id, alt
const logo = document.querySelector('.nav__logo');
console.log(logo.className);
console.log(logo.alt);

logo.alt = 'Beautiful minimalist logo'; // Changing the value of the alt attribute

console.log(logo.src); // Returns the absolute url. The src in the html is the relative url
console.log(logo.getAttribute('src')); // Returns the relative url

// CLASSES
logo.classList.add();
logo.classList.remove();
logo.classList.toggle();
logo.classList.contains(); 
*/

// Types of Events and Event handlers
// const h1 = document.querySelector('h1');

// 1.
// h1.addEventListener('mouseenter', () => {
//   alert('addEventLister: Great, you are reading the heading :D');
// });

// 2.
// h1.onmouseenter = () => {
//   alert('addEventLister: Great, you are reading the heading :D');
// };

// To reuse the eventlistener, we copy the function to be executed into a separate function
// const alertH1 = () => {
//   alert('addEventLister: Great, you are reading the heading :D');

//   // Removing the listener immediately after
//   // h1.removeEventListener('mouseenter', alertH1);
// };
// h1.addEventListener('mouseenter', alertH1);

// // Removing the listener after a specified time
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// 3. Setting it directly in the html element
/* <h1 onclick="alert('HTML alert')"></h1> */

// EVENT CAPTURING AND BUBBLING
// When a click event is attached to an anchor tag for example, the click is not generated immediately on it, instead it is generated on the root(document) before it travels down through all the parent element of the target element(document-html-body-section-p-a): this is the capturing phase. When the event reaches the target, the target phase begins where the event will be handled using(eventlisteners). In the bubbling phase, the event travels back to the root passing through all the parent elements and not siblings. By default, events are only handled in the target and bubbling phase (addEventListener) but can be made available in the capturing phase. (Not all events have a capturing and bubbling phase). The Bubbling phase is also known as propagation

/* // EVENT PROPAGATION IN PRACTICE
// Creating a random color
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// console.log(randomInt(3, 50));
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

// Adding an event listener on each link, the parent which is ul and the whole nav:
document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget); // the target is not the element on which the eventlistener is attached but it is where the event originated i.e where the click happened. currentTarget is the element on which the event is attached, it is the same as the "this" keyword

  // Stopping event propagation
  // e.stopPropagation(); // Not a good idea
}); // "this" keyword does not work with arrow functions!!

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  },
  true
); // We can capture an event by specifying a 3rd parameter(true) and the result of this is that the nav will appear first before the link and the container

// the event (e) is the same for all the 3 because of event bubbling i.e the event originated on the link(a), it then bubbles to it's next parent element(ul) and finally to the last parent element(nav) */

/*
// DOM TRAVERSING
// Query selector finds children elements no matter how deep in the dom while closest() finds parents no matter how far up in the dom tree
const h1 = document.querySelector('h1');
// Going downwards
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children); // Returns an HTML collection of the elements in the target element(h1)
h1.firstElementChild.style.color = 'black';
h1.lastElementChild.style.color = 'brown';

// Going upwards
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-primary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
}); 

*/
