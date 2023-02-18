"use strict";

var COMMIT_PATH = 'https://api.github.com/repos/cabbagecanfly/cabbagecanfly.github.io/commits?per_page=1&'

var rateExceeded = false;

var MY_COLOURS = {
    orange: "#FD971F",
    green: "#A6E22E",
    white: "#FFFFFF",
    pink: "#F92672",
    blue: "#66D9EF"
}
var CABBAGE_FLY_COUNT = 3;
var scrollEvents = [checkHeaderSticky, checkBioReveal];
var resizeEvents = [setCanvasSize];

var colours = Object.values(MY_COLOURS);

var canvas;
var ctx;

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
    // anime({
    //     duration: Infinity,
    //     update: function() {
    //         p.draw();
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     }
    // });
    window.addEventListener('resize', runAll(resizeEvents), false);
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
    if (rect.y <= 2 && !header.classList.contains("header--sticky-active") && window.innerHeight > rect.height * 3) {
        header.classList.add("header--sticky-active");
        headerShrink.classList.add("header--can-shrink-active");
        headerBg.classList.add("header__bg--active");
        header.parentElement.style.height = rect.height + "px";
    } else if (scrollTop + 2 <= window.innerHeight / 2 - rect.height / 2 || window.innerHeight <= rect.height * 3) {
        header.classList.remove("header--sticky-active");
        headerShrink.classList.remove("header--can-shrink-active");
        headerBg.classList.remove("header__bg--active");
    }
}

function checkBioReveal() {
    var threshold = 500;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var gradient = document.querySelector(".gradient");
    if (gradient) {
        if (scrollTop <= threshold) {
            var ratio = scrollTop / (threshold);
            // gradient.classList.remove("gradient--unveil");
            // gradient.style.transform = "scaleY(" + (1 - ratio) + ")";
            gradient.style.transform = "translateY(" + Math.max(0,(100 * ratio)) + "%)";
            gradient.style.display = 'block';
        } else {
            // gradient.classList.add("gradient--unveil");
            // gradient.style.transform = "scaleY(0)";
            gradient.style.transform = "translateY(100%)";
            gradient.style.display = 'none';
        }
    }
}

function scrollToTop() {
    var position = document.body.scrollTop || document.documentElement.scrollTop;
    if (position) {
        window.scrollBy(0, -Math.max(1, Math.floor(position / 6)));
        requestAnimationFrame(scrollToTop);
    }
}

// Hyperlinks within show-more elements can mess up the overflow
//  when user focuses on the hyperlink by pressing tab; so, scroll back to top.
function disableTabShift() {
    document.querySelectorAll(".show-more").fosrEach(function(showMore) {
        showMore.querySelectorAll("a").forEach(function(link) {
            link.addEventListener("focus", function() {
                showMore.scrollTop = 0;
            });
        })
    });
}

function runAll(functions) {
    return function() {
        functions.forEach(function(fn) {
            fn();
        });
    };
}

function setCopyright() {
    var len = document.lastModified.length;
    var date = document.lastModified.substring(0,len-8).replace(/ /g,'').split('/');
    var year = date[2];
    document.querySelector(".copyright__year").innerHTML = year;
}

function setLastUpdated() {
    var createDateElem = function(date, url, label, parentElem) {
        var link = document.createElement(url ? 'a' : 'span');
        var tzOffset = new Date().getTimezoneOffset() * 60000;
        var localDate = new Date(Date.parse(date) - tzOffset).toISOString();
        link.innerHTML = localDate.substring(0,10).replace(/-/g,'');
        if (url) {
            link.href = url;
            link.target = "_blank";
        }
        parentElem.innerHTML = label + ": ";
        parentElem.appendChild(link);
    }

    var paths = ['css', 'js', 'index.html'];
    getLatestCommitDate(paths, function(latestDate, latestCommit) {
        if (latestDate && !rateExceeded) {
            createDateElem(latestDate, latestCommit.html_url, 'site',
                document.querySelector(".last-updated__site"));
        }
    });
    paths = ['resources/resume'];
    getLatestCommitDate(paths, function(latestDate, latestCommit) {
        if (latestDate && !rateExceeded) {
            createDateElem(latestDate, null, 'résumé',
                document.querySelector(".last-updated__resume"));
        }
    });
}

// Get latest commit date for given path(s)
function getLatestCommitDate(paths, callback) {
    var latestDate = null;
    var latestCommit = null;
    var returned = 0;

    if (paths.length == 0) {
        callback(latestDate, latestCommit);
    }

    paths.forEach(function(e) {
        var url = COMMIT_PATH + "path=v3/" + e;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                returned += 1;
                if (this.status == 200) {
                    var res = JSON.parse(xhr.responseText);
                    if (res[0]) {
                        var cDate = res[0].commit.author.date;
                        if (latestDate) {
                            if (latestDate < cDate) {
                                latestCommit = res[0];
                                latestDate = cDate;
                            }
                        } else {
                            latestDate = cDate;
                            latestCommit = res[0];
                        }
                    }
                } else {
                    rateExceeded = true;
                    return;
                }
                if (returned >= paths.length) {
                    callback(latestDate, latestCommit);
                }
            }
        };
        if (!rateExceeded) {
            xhr.send();
        }
    });
}

function main() {
    setLastUpdated();
    setCopyright();
    document.querySelectorAll(".show-more__button").forEach(function(e) {
        e.addEventListener("click", function() {
            e.parentElement.classList.toggle("show-more--active");
        });
    });
    initializeLightMode();
    initializeCanvas();
    // render.play();
    document.querySelector("html").classList.remove("hidden");
    runAll(scrollEvents)();
    window.onscroll = runAll(scrollEvents);

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
