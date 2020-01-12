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
            background: colours[anime.random(0,colours.length)]
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
function randomFly(elem) {
    return function() {
        var delay = anime.random(18000, 52000);
        var duration = anime.random(4800, 6200);
        var fadeDuration = 300;
        var opacity = anime.random(15, 35) / 100;
        anime.set(elem, {
            opacity: 0,
            translateX: 0,
            translateY: 0,
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
                Math.min(window.innerWidth / 2, 300)) * randomNegative(),
            translateY: anime.random(-80,-130),
            rotate: anime.random(230,450) * randomNegative(),
            easing: 'linear',
            duration: duration,
            delay: delay,
            complete: randomFly(elem)
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
    if (content.style.opacity < 1 || scrollTop <= threshold) {
        var ratio = scrollTop / threshold;
        document.querySelector(".about").style.opacity = Math.max(0.1, ratio);
    }
}

function checkScrollEvents() {
    scrollEvents.forEach(function(fn) {
        fn();
    });
}

function main() {
    document.querySelector("html").classList.remove("hidden");
    checkScrollEvents();
    window.onscroll = checkScrollEvents;

    var headerDecorItems = document.querySelectorAll(".header-decor__item");
    headerDecorItems.forEach(function(item, i) {
        scheduleRandomFlow(item, anime.random(0,2000));
    });

    function scheduleRandomFlow(elem, delay) {
        setTimeout(function() { randomFlow(elem)() }, delay);
    }

    var cabbage = document.querySelector(".cabbage.cabbage--centered");
    var header = document.querySelector(".header--centered");
    for (var i = 0; i < CABBAGE_FLY_COUNT; i++) {
        var newCabbage = cabbage.cloneNode(true);
        newCabbage.setAttribute("class","hidden cabbage cabbage--fly cabbage--small");
        header.appendChild(newCabbage);
        newCabbage.style.left = (header.clientWidth / 2 - newCabbage.clientWidth / 2) + "px";
        randomFly(newCabbage)();
    }
}

window.addEventListener("DOMContentLoaded", main, false);
