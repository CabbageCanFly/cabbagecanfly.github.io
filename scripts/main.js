var len = document.lastModified.length;
var date = document.lastModified.substring(0,len-8).replace(/ /g,'').split('/');
var year = date[2];
date = date[2] + '-' + date[0] + '-' + date[1];
document.getElementById("lastModified").innerHTML = "Last modified: " + date;
document.getElementById("copyright").innerHTML = year;

setTimeout(function(){
    document.body.className="";
},500);

// NOTE: ORDER MATTERS FOR TOGGLING CLASS.
//		 <tog> has to come after the initial class in stylesheet.
function toggle(divId, tog) {
	var div = document.getElementById(divId);
	div.classList.toggle(tog);
}