"use strict";

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
}

window.addEventListener("DOMContentLoaded", main, false);
