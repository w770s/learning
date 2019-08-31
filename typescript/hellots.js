// function sayName(name: string) {
//     return 'hello'+ name
// }
//
// let person = '1211221'
var createArray;
createArray = function (length, value) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
};
createArray(3, 'x'); // ['x', 'x', 'x']
