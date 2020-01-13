"use strict";

var MY_COLOURS = {
    orange: "#FD971F",
    green: "#A6E22E",
    white: "#FFFFFF",
    pink: "#F92672",
    blue: "#66D9EF"
}
var CABBAGE_FLY_COUNT = 3;
var scrollEvents = [checkHeaderSticky, checkBioReveal];

var colours = Object.values(MY_COLOURS);

var canvas;
var ctx;
var render;

function initializeLightMode() {
    var toggle = document.querySelector(".light-toggle-checkbox");
    var htmlElem = document.querySelector("html");
    if (toggle.checked) { htmlElem.classList.add("light-toggle"); }
    toggle.addEventListener("change", function() {
        htmlElem.classList.toggle("light-toggle");
    });
}

function initializeCanvas() {
    canvas = document.querySelector(".header__canvas");
    if (!canvas) {
        return;
    }
    ctx = canvas.getContext('2d');
    render = anime({
        duration: Infinity,
        update: function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
    window.addEventListener('resize', setCanvasSize, false);
    setCanvasSize();
}
function setCanvasSize() {
    var scale = 2;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    ctx.scale(scale, scale);
}

function randomNegative() {
    return anime.random(0,1) == 1 ? -1 : 1;
}

// Randomized flowing lines animation in the header
function randomFlow(elem) {
    return function() {
        var delay = anime.random(0, 400);
        var duration = anime.random(3900, 8200);
        var fadeDuration = 425;
        var direction = randomNegative();
        anime.set(elem, {
            opacity: 0,
            translateX: 0,
            translateY: anime.random(3, 33),
            scaleX: anime.random(7,16),
            scaleY: anime.random(1,2),
            background: colours[anime.random(0, colours.length - 1)]
        })
        anime({
            targets: elem,
            keyframes: [
                {opacity: anime.random(45, 75) / 100, delay: delay, duration: fadeDuration},
                {opacity: 0, delay: duration - fadeDuration * 2, duration: fadeDuration}
            ],
            easing: 'linear'
        });
        anime({
            targets: elem,
            translateX: anime.random(Math.min(window.innerWidth / 3, 200),
                Math.min(window.innerWidth / 2, 300)) * direction,
            easing: 'linear',
            duration: duration,
            delay: delay,
            complete: randomFlow(elem)
        });
    }
}

// Randomized 'flying' instances
function randomFly(elem, options={}) {
    return function() {
        var delay = anime.random(18000, 52000);
        var duration = anime.random(4800, 6200);
        var fadeDuration = 300;
        var opacity = anime.random(15, 35) / 100;
        anime.set(elem, {
            opacity: 0,
            translateX: options.x || 0,
            translateY: options.y || 0,
            rotate: 0
        })
        anime({
            targets: elem,
            keyframes: [
                {opacity: opacity, duration: fadeDuration},
                {opacity: opacity, duration: duration - fadeDuration * 2},
                {opacity: 0, duration: fadeDuration}
            ],
            delay: delay,
            easing: 'linear'
        });
        anime({
            targets: elem,
            translateX: anime.random(Math.min(window.innerWidth / 3, 30),
                Math.min(window.innerWidth / 2, 300)) * randomNegative() + "px",
            translateY: anime.random(-80,-130),
            rotate: anime.random(230,450) * randomNegative(),
            easing: 'linear',
            duration: duration,
            delay: delay,
            complete: randomFly(elem, options)
        });
    }
}

function checkHeaderSticky() {
    var header = document.querySelector(".header--sticky");
    var headerShrink = document.querySelector(".header--can-shrink");
    var headerBg = document.querySelector(".header__bg");
    var rect = header.getBoundingClientRect();
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (rect.y <= 2 && !header.classList.contains("header--sticky-active")) {
        header.classList.add("header--sticky-active");
        headerShrink.classList.add("header--can-shrink-active");
        headerBg.classList.add("header__bg--active");
        header.parentElement.style.height = rect.height + "px";
    } else if (scrollTop + 2 <= window.innerHeight / 2 - rect.height / 2) {
        header.classList.remove("header--sticky-active");
        headerShrink.classList.remove("header--can-shrink-active");
        headerBg.classList.remove("header__bg--active");
    }
};

function checkBioReveal() {
    var threshold = 150;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var content = document.querySelector(".about");
    var gradient = document.querySelector(".gradient");
    if (content) {
        if (content.style.opacity < 1 || scrollTop <= threshold) {
            var ratio = scrollTop / threshold;
            content.style.opacity = Math.max(0.1, ratio);
        } else {
            content.style.opacity = 1;
        }
    }
    if (gradient) {
        if (scrollTop <= threshold * 2) {
            var ratio = scrollTop / (threshold * 2);
            gradient.style.height = (40 - 40 * ratio) + "%";
        } else {
            gradient.style.height = "0%";
        }
    }
}

function checkScrollEvents() {
    scrollEvents.forEach(function(fn) {
        fn();
    });
}
function scrollToTop() {
    var position = document.body.scrollTop || document.documentElement.scrollTop;
    if (position) {
        window.scrollBy(0, -Math.max(1, Math.floor(position / 6)));
        requestAnimationFrame(scrollToTop);
    }
}

function main() {
    initializeLightMode();
    initializeCanvas();
    // render.play();
    document.querySelector("html").classList.remove("hidden");
    checkScrollEvents();
    window.onscroll = checkScrollEvents;

    document.querySelector(".header__bg").addEventListener("click", scrollToTop);
    document.querySelector(".header--can-shrink").addEventListener("click", scrollToTop);

    var headerDecorItems = document.querySelectorAll(".header-decor__item");
    headerDecorItems.forEach(function(item, i) {
        scheduleRandomFlow(item, anime.random(0,2000));
    });

    function scheduleRandomFlow(elem, delay) {
        setTimeout(function() { randomFlow(elem)() }, delay);
    }

    var cabbage = document.querySelector(".cabbage.cabbage--centered");
    var header = document.querySelector(".header--can-shrink");
    for (var i = 0; i < CABBAGE_FLY_COUNT; i++) {
        var newCabbage = cabbage.cloneNode(true);
        newCabbage.setAttribute("class","hidden cabbage cabbage--fly cabbage--small");
        header.appendChild(newCabbage);
        randomFly(newCabbage, {x: (-1 * newCabbage.clientWidth / 2) + "px"})();
    }
}

window.addEventListener("DOMContentLoaded", main, false);
