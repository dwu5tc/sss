INSERT INTO items (season, name, price, desc, week, cat)
VALUES ('SS18', 'Studded Arc Logo Leather Jacket', 698, 'Lambskin leather with satin lining and full zip closure. Studded leather appliqu&#xE9; logo across back and shoulders. Double welt hand pockets at lower front and interior chest pocket.', 1, 'Jackets')

const util = require('util');

function pObj(obj) {
	if (isObj(obj)) {
		console.log('' + typeof obj + ' : ' + obj.length);
		console.log('-----');
		console.log(util.inspect(obj, false, null));
		console.log('-----');
	} 
};

function pArr(arr) {
	if (isArr(arr)) {
		console.log('' + typeof arr + ' : ' + arr.length);
		console.log('-----');
		arr.forEach(el => {
			console.log(el);
		});
		console.log('-----');
	}
};

function isArr(a) {
	return (!!a) && (a.constructor === Array);
};

function isObj(a) {
	return (!!a) && (a.constructor === Object);
}