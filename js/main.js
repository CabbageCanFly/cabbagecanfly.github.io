"use strict";

// last updated: 2023-02-09
//    copyright: 2023

var MY_COLOURS = {
    orange: "#FD971F",
    green: "#A6E22E",
    white: "#FFFFFF",
    pink: "#F92672",
    blue: "#66D9EF"
}
var CABBAGE_FLY_COUNT = 3;

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

function runAll(functions) {
    functions.forEach(function(fn) {
        fn();
    });
}

function main() {
    initializeLightMode();
    document.querySelector("html").classList.remove("hidden");
    // runAll(scrollEvents)();
}

window.addEventListener("DOMContentLoaded", main, false);
