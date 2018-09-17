main();

var articles = document.getElementsByTagName("article");
var curSearch = "";
var articleInd = 0;
var searchInd = 0;

function main() {
	var len = document.lastModified.length;
	var date = document.lastModified.substring(0,len-8).replace(/ /g,'').split('/');
	var year = date[2];
	date = date[2] + '-' + date[0] + '-' + date[1];
	document.getElementById("lastModified").innerHTML = "<span>Last modified:</span><div>" + date + "</div>";
	document.getElementById("year").innerHTML = year;

	setSearch();
	setAccordion();
}

function setSearch() {
	var search = document.getElementById("search");
	search = search.childNodes[1];

	window.onkeydown = function (e) {
		if (!e) e = window.event;
		if (!e.metaKey) {
			if(e.keyCode >= 65 && event.keyCode <= 90 || e.keyCode >= 48 && event.keyCode <= 57) {
				search.focus();
			}
		}
	};
	window.onkeyup = function (e) {
		if (!e) e = window.event;
		if (e.keyCode == 13) {
			// checkSearch(search);
			var selObj = window.getSelection();
			var selRange = selObj.getRangeAt(0);
			console.log(selObj);
			console.log(selRange);
			console.log(selObj.toString());
		}
	};
}

// <input> is an 'input' element responsible for searching
function checkSearch(input) {
	var inp = input.value.toUpperCase();
	if (inp !== curSearch) {
		curSearch = inp;
		articleInd = 0;
		searchInd = 0;
	}
	console.log('searchin');
	for (var i = 0; i < articles.length; i++) {
		if (i >= articleInd) {
			var innerHTML = articles[i].innerHTML.toUpperCase();
			var index = innerHTML.indexOf(inp, searchInd);
			console.log(index);
			if (index > -1) {
				// var temp = document.getElementById("highlight");
				// if (temp) {
				// 	console.log(temp.parentNode);
				// 	console.log(temp.firstChild);
				// 	var pa = temp.parentNode;
				// 	while(temp.firstChild) pa.insertBefore(temp.firstChild, temp);
				// 	pa.removeChild(temp);
				// }
				innerHTML = articles[i].innerHTML;
				innerHTML = innerHTML.substring(0, index) + "<span id='highlight'>" + innerHTML.substring(index, index+inp.length) + "</span>" + innerHTML.substring(index+inp.length, innerHTML.length);
				articles[i].innerHTML = innerHTML;
				radio = document.getElementById("btn_c1_" + articles[i].id);
				radio.checked = true;
				break;
			}
		}
	}
}

function setAccordion() {
	var acc = document.getElementsByClassName("accordion");
	var i;
	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function() {
			var parent;
			var panel = this.nextElementSibling;
			var height;
			var pheight;
			if (panel.style.maxHeight){
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

function hasClass(element, className) {
	return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}