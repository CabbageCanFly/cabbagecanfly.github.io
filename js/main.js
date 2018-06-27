var len = document.lastModified.length;
var date = document.lastModified.substring(0,len-8).replace(/ /g,'').split('/');
var year = date[2];
date = date[2] + '-' + date[0] + '-' + date[1];
document.getElementById("lastModified").innerHTML = "<span>Last modified:</span><div>" + date + "</div>";
document.getElementById("year").innerHTML = year;

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

function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}