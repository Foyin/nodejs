// HTML escaping from http://stackoverflow.com/a/13510502
/*
jquery version
Problem: takes a raw string and puts it in between tags (this is bad) so it gets interpreted by the browser
Solution: use an escape function to transform the raw string into a sanitized version
Include the following in your code to escape html tags 
*/


var __entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

String.prototype.escapeHTML = function() {
    return String(this).replace(/[&<>"'\/]/g, function (s) {
        return __entityMap[s];
    });
}
