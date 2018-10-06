"use strict";
main();

let curInp = "";
let articles = document.getElementsByTagName("article");
let originalContent = [];
originalContent.push(articles[0].innerHTML);
originalContent.push(articles[1].innerHTML);

function main() {
	let len = document.lastModified.length;
	let date = document.lastModified.substring(0,len-8).replace(/ /g,'').split('/');
	let year = date[2];
	date = date[2] + '-' + date[0] + '-' + date[1];
	document.getElementById("lastModified").innerHTML = "<span>Last modified:</span><div>" + date + "</div>";
	document.getElementById("year").innerHTML = year;

	// Delayed to allow initial load animation to run.
	setTimeout(setSearch, 1000);
	setAccordion();
}

function setSearch() {
	let searchElem = document.getElementById("search");
	searchElem = searchElem.childNodes[1];

	// Triggered on letters, numbers, and numpad numbers;
	// 	does not trigger on ctrl/alt/meta key combos
	window.onkeydown = function (e) {
		if (!e) e = window.event;
		if (!e.metaKey && !e.ctrlKey && !e.altKey) {
			if((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 48 && 
				e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || 
				e.keyCode == 8 || e.keyCode == 46) {
				searchElem.focus();
			}
		}
	};
	window.onkeyup = function (e) {
		if (!e) e = window.event;
		if (!e.metaKey && !e.ctrlKey && !e.altKey) {
			if((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 48 && 
				e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || 
				e.keyCode == 8 || e.keyCode == 46) {
				checkSearch(searchElem);
			}
		}
	};
}

function checkSearch(input) {
	if (input.value == curInp) {
		return;
	} else {
		curInp = input.value;
	}

	// Remove previously found tags
	let elems = document.getElementsByClassName("found");
	while (elems.length) {
		let elem = elems[0];
		let p = elem.parentNode;
		while (elem.firstChild) {
			p.insertBefore(elem.firstChild, elem);
		}
		elem.remove();
	}

	// Reset the courses HTML
	articles[1].innerHTML = originalContent[1];

	// Check if input is valid; search gets buggy with some punctuation
	// 	so punctuation is invalid for input.
	let value = input.value;
	let regex = new RegExp('^[a-zA-Z0-9_ ]+$');
	if (regex.test(value) == false) {
		// Have to reapply event listeners to accordion due to DOM changes
		setAccordion();
		return;
	}

	for (let articleInd = 0; articleInd < articles.length; articleInd++) {
		let content = articles[articleInd].innerHTML;
		let words = value.split(' ');
		let numWords = words.length;

		// Check if input is in an HTML tag
		if (numWords === 1) {
			regex = new RegExp(value+'(?=[^>]*?(<|$))','gi');
		} else {
			// HTML tag can be in between words
			regex = words[0]+'(?=[^>]*?(<|$))';
			for (let i = 1; i < numWords; i++) {
				 regex += '(?: ?)(?:<[^>]*?>)?(?: ?)' + words[i] + '(?=[^>]*?(<|$))';     
			}
			regex = new RegExp(regex,'gi');
		}

		let matches = null;
		let positions = []
		let found = []
		let addFound = [];

		while (matches = regex.exec(content)) {
			let startTag = '<span class="found">';
			let endTag = '</span>';
			// If the match contains html tags there need to be a </span>
			// 	before the html tag starts and a <span> if the html tags
			// 	closes again
			// abc <p>def => abc </span><p><span class="found">def</span>   
			let match = matches[0].replace(/>/g,'>'+startTag);
			match = match.replace(/<(?!span class="found">)/g,endTag+'<');

			// Save how many chars have been added 
			addFound.push(match.length-matches[0].length);

			found.push(match); 
			positions.push(matches.index); 
		}

		let numAdded = 0;
		let newContent = content;
		// Iterate through all positions and add a span tag to mark the query
		for (let i = 0; i < positions.length; i++) {
			let startTag = '<span class="found" id="found_'+i+'">';
			let endTag = '</span>';

			let contentBefore = newContent.substr(0, positions[i] + numAdded);
			let foundTag = startTag + found[i] + endTag;
			let contentAfter = newContent.substr(positions[i] + numAdded +
					found[i].length - addFound[i]);

			numAdded += startTag.length + endTag.length + addFound[i];
			newContent = contentBefore + foundTag + contentAfter;
		}
		articles[articleInd].innerHTML = newContent;
	}

	// Traverse through found tags, specifically in courses.
	// Expand the accordion that contains the found content.
	elems = document.getElementsByClassName("found");
	for (let i = 0; i < elems.length; i++) {
		let elem = elems[i];
		let arr;
		while (elem.tagName != "ARTICLE") {
			if (hasClass(elem, "accordion")) {
			   arr = elem.className.split(" ");
			    if (arr.indexOf("accordion-active") == -1) {
			        elem.className += " accordion-active";
			    }
			} else if (hasClass(elem, "panel")) {
				elem = elem.previousElementSibling;
				arr = elem.className.split(" ");
			    if (arr.indexOf("accordion-active") == -1) {
			        elem.className += " accordion-active";
			    }
			}
			elem = elem.parentNode;
		}
		// Toggle the radio button to the first article content that contains
		// 	a found tag
		if (i == 0) {
			document.getElementById("btn_c1_" + elem.id).checked = true;
		}
	}

	// setAccordion() re-adds event listener to each accordion due to
	// 	DOM changes
	checkAccordion(400);
	setAccordion();
}

// Adds event listeners to accordion for toggling class.
function setAccordion() {
	let acc = document.getElementsByClassName("accordion");
	let i;
	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function() {
			toggleAccordion(this, true);
		});
	}
}

// checkAccordion() called twice, with a slight delay, to allow
// 	accordion panel to properly expand completely; used mainly
// 	during search
function checkAccordion(delay) {
	if (delay > 0) {
		setTimeout(function() {checkAccordion(0)}, delay);
	}
	let acc = document.getElementsByClassName("accordion");
	for (let i = 0; i < acc.length; i++) {
		toggleAccordion(acc[i]);
	}
}

// Compute/toggle next height of panel depending on state of accordion
function toggleAccordion(elem, toggle) {
	if (toggle != true) {
		toggle = false;
	}
	let parent;
	let panel = elem.nextElementSibling;
	let height;
	let pheight;
	if (hasClass(elem, "accordion-active") == toggle){
		panel.style.maxHeight = null;
	} else {
		height = panel.scrollHeight * 1.2;
		panel.style.maxHeight = height + "px";
		parent = panel.parentNode;
		while (parent != document) {
			if (hasClass(parent, "panel")) {
				height = (parent.scrollHeight + panel.scrollHeight) * 1.2;
				pheight = parent.style.maxHeight.replace("px","");
				if (+pheight < height) {
					parent.style.maxHeight = height + "px";
				}
			}
			parent = parent.parentNode;
		}
	}
	if (toggle) {
		elem.classList.toggle("accordion-active");
	}
}

function hasClass(element, className) {
	return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}