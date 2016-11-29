/**
 * Nesne tipleri ile ilgili dönüşüm bilgilerini alacağımız methodlar
 * @isFunc
 * @isArr
 * @isObj
 * @isNum
 * @isNaN
 * @isStr
 */

//Sadece fonksiyon tipler
function isFunc(a) {
    if (!a) return false;
    return typeof a === 'function';
}

//Sadece array tipler
function isArr(a) {
    if (!a) return false;
    return typeof a === 'array';
}

//Sadece object array tipler
function isObj(a) {
    if (!a) return false;
    return typeof a === 'object';
}

//Sadece numeric tipler
function isNum(a) {
    if (!a) return false;
    return typeof a === 'number';
}

//Sadece numeric olmayanlar tipler
function isNaN(a) {
    if (!a) return false;
    return a == Number.isNaN;
}

//Sadece string tipler
function isStr(a) {
    if (!a) return false;
    return typeof a === 'string';
}