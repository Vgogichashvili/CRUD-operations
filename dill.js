Object.prototype.rand = function (start, end) {
    if (start == undefined && end == undefined) {
        start = 0;
        end = 255;
    }

    return Math.round(Math.random() * (end - start) + start);
}

Object.prototype.min = function(limit){
    return this.substr(0,limit) + "...";
}

function generateRandomNum(start, end) {
    if (start == undefined && end == undefined) {
        start = 0;
        end = 255;
    }

    return Math.round(Math.random() * (end - start) + start);
}

function generateRandomRgbColor() {
    var r = generateRandomNum();
    var g = generateRandomNum();
    var b = generateRandomNum();
    return `rgb(${r},${g},${b})`;
}

// Object.prototype.select = function (selector) {
//     return document.querySelector(selector);
// }

// Object.prototype.selectAll = function (selector) {
//     return document.querySelectorAll(selector);
// }