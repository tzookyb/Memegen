'use strict'

function saveToStorage(key, val) {
    var str= JSON.stringify(val);
    localStorage.setItem(key, str)
}

function loadFromStorage(key) {
    var str = localStorage.getItem(key);
    var val = JSON.parse(str)
    return val;
}

// function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
// }

// function attributeCompare(attr) {
//     if (attr === 'txt') {
//         return function (a, b) {
//             if (a.txt < b.txt) return -1;
//             if (a.txt > b.txt) return 1;
//             return 0;
//         };
//     } else return function (a, b) {
//         return a[attr] - b[attr];
//     }
// }