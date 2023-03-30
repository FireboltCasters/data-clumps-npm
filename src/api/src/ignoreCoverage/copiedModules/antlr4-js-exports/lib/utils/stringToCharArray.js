"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stringToCharArray;
function stringToCharArray(str) {
  let result = new Uint16Array(str.length);
  for (let i = 0; i < str.length; i++) {
    result[i] = str.charCodeAt(i);
  }
  return result;
}