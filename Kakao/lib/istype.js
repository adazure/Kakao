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
Kakao.isFunc = function isFunc(a) {
    if (!a) return false;
    return typeof a === 'function';
}

//Sadece array tipler
Kakao.isArr = function isArr(a) {
    if (!a) return false;
    return typeof a === 'array';
}

//Sadece object array tipler
Kakao.isObj = function isObj(a) {
    if (!a) return false;
    return typeof a === 'object';
}

//Sadece numeric tipler
Kakao.isNum = function isNum(a) {
    if (!a) return false;
    return typeof a === 'number';
}

//Sadece numeric olmayanlar tipler
Kakao.isNaN = function isNaN(a) {
    if (!a) return false;
    return a == Number.isNaN;
}

//Sadece string tipler
Kakao.isStr = function isStr(a) {
    if (!a) return false;
    return typeof a === 'string';
}