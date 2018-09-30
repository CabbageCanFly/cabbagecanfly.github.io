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

	setSearch();
	setAccordion();
}

function setSearch() {
	let search = document.getElementById("search");
	search = search.childNodes[1];

	window.onkeydown = function (e) {
		if (!e) e = window.event;
		if (!e.metaKey) {
			if(e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 48 &&
				e.keyCode <= 57 || e.keyCode == 8 || e.keyCode == 46) {
				search.focus();
			}
		}
	};
	window.onkeyup = function (e) {
		if (!e) e = window.event;
		if (!e.metaKey) {
			if(e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 48 &&
				e.keyCode <= 57 || e.keyCode == 8 || e.keyCode == 46) {
				
			}
			if (e.keyCode == 13) {
				checkSearch(search);
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
	let elems = document.getElementsByClassName("found");
	while (elems.length) {
		let elem = elems[0];
		let p = elem.parentNode;
		while (elem.firstChild) {
			p.insertBefore(elem.firstChild, elem);
		}
		elem.remove();
	}
	articles[1].innerHTML = originalContent[1];

	let value = input.value;
	let regex = new RegExp('^[a-zA-Z0-9_ ]+$');
	if (regex.test(value) == false) {
		return;
	}

	for (let articleInd = 0; articleInd < articles.length; articleInd++) {
	// get the html text
	let html_content = articles[articleInd].innerHTML;
	// split value into words
	let value_words = value.split(' ');
	let nr_words = value_words.length;

	// check if value is inside a html tag or not
	// if the first angle bracket is a '<' the value is outside of a html tag
	if (nr_words === 1) {
			regex = new RegExp(value+'(?=[^>]*?(<|$))','gi');
	} else {
			// there can be a html tag between two words
			regex = value_words[0]+'(?=[^>]*?(<|$))';
			for (let i = 1; i < nr_words; i++) {
				 // there can be a space and a whole html tag between two parts 
				 regex += '(?: ?)(?:<[^>]*?>)?(?: ?)'+value_words[i]+'(?=[^>]*?(<|$))';     
			}
			regex = new RegExp(regex,'gi');
	}

	let matches = null;
	let positions = [], found = [], add_found_char = [];

	while(matches = regex.exec(html_content)) {
		// add this before / after a value part
		let start_tag = '<span class="found">';
		let end_tag = '</span>';
		// if the match contains html tags there need to be a </span>
		// before the html tag starts and a <span if the html tags closes again
		 // abc <p>def => abc </span><p><span class="found">def</span>   
		let match = matches[0].replace(/>/g,'>'+start_tag);
		match = match.replace(/<(?!span class="found">)/g,end_tag+'<');
			
		// save the new match with correct html tags    
		found.push(match); 
		// save how many chars have been added 
		add_found_char.push(match.length-matches[0].length);
		// save found position
		positions.push(matches.index); 
	}


	let add_nr_chars = 0;
	let new_html_content = html_content;
	// iterate through all positions and add a span tag to mark the query
	for (let i = 0; i < positions.length; i++) {
			// add this before / after the found value
			let start_tag = '<span class="found" id="found_'+i+'">';
			let end_tag = '</span>';
			// string before value
			let content_before = new_html_content.substr(0,positions[i]+add_nr_chars);
			// value and start_tag and end_tag
			let value_and_tags = start_tag + found[i] + end_tag;
			// string after value
			let content_after = new_html_content.substr(positions[i]+add_nr_chars+found[i].length-add_found_char[i]);

			// number of characters which have been added
			add_nr_chars += start_tag.length + end_tag.length + add_found_char[i];
			
			// new content
			new_html_content = content_before + value_and_tags + content_after;
	}
	articles[articleInd].innerHTML = new_html_content;
	}

	elems = document.getElementsByClassName("found");
	for (let i = 0; i < elems.length; i++) {
		elem = elems[i];
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
		if (i == 0) {
			document.getElementById("btn_c1_" + elem.id).checked = true;
		}
	}
	checkAccordion();
	setAccordion();
	setTimeout(checkAccordion, 400);
	// checkAccordion();
	
}

function setAccordion() {
	let acc = document.getElementsByClassName("accordion");
	let i;
	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function() {
			let parent;
			let panel = this.nextElementSibling;
			let height;
			let pheight;
			if (panel.style.maxHeight || hasClass(this, "accordion-active")){
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

			this.classList.toggle("accordion-active");
		});
	}
}
function checkAccordion() {
	let acc = document.getElementsByClassName("accordion");
	let i;
	for (i = 0; i < acc.length; i++) {
		let elem = acc[i];
		let parent;
		let panel = elem.nextElementSibling;
		let height;
		let pheight;
		if (!hasClass(elem, "accordion-active")){
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
	}	
}

function hasClass(element, className) {
	return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}