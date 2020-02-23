export const CustomPKFactory = function(){}
CustomPKFactory.prototype = new Object()
CustomPKFactory.createPk = function() {
console.log("CUSTOM_PK_FACTORY");
return +Date.now()
}