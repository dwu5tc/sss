'use strict';

const request = require('request'),
	cheerio = require('cheerio'),
	Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:blahblah75@localhost:5432/supremedb');

const target = 'http://www.supremenewyork.com/shop/new';
const DELAY_TIME = 2000;

let items = {};
let itemsSet = new Set();

console.log('beginning scrape');

const getURLsPromise = url => {
	return new Promise((resolve, reject) => {
		request(url, (err, res, body) => {
			console.log('get url request finished');

			if (!err) {
				console.log('no errors');
				const $ = cheerio.load(body);

				const linkElems = $('.turbolink_scroller a');

				// let urls = linkElems.map(elem => 'http://www.supremenewyork.com' + $(elem).attr('href')); // doesn't work since linkElems != array but a jquery obj???
				
				let urls = linkElems.map((i, el) => {
					return 'http://www.supremenewyork.com' + $(el).attr('href');
				}).get(); // what does this return if .get() is removed???

				resolve(urls);
				console.log('resolved geturlspromise');
			} else {
				reject(err); // is this right???
			}
		});
	});
};

const sequentialPromises = (funcs) => {
	return funcs.reduce((promise, func) => {
		return promise.then(res =>
			func().then(item => res.concat(item)));
	}, Promise.resolve([]));
};

const delay = ms => {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
};

const delayedFunc = (func, ms) => {
	return new Promise((resolve, reject) => {
		delay(ms) // should this be returned???
			.then(resolve(func)); // should func be called with brackets???
	});
};

// const scrapeItem = url => {
// 	return request(urls[i], (err, resp, body) => {
// 		const $ = cheerio.load(body);

// 		let item = {};
// 		item.name = $('h1.protect').html();
// 		console.log(item.name);
// 		item.category = $('h1.protect').attr('data-category');
// 		console.log(item.category);
// 		item.price = $('span', 'p.price').html();
// 		console.log(item.price);
// 		item.price = item.price.substring(1, item.price.length);
// 		console.log(item.price);
// 		item.description = $('p.description').html().trim();
// 		console.log(item.description);
// 		item.text = body;
// 		i++;
// 		insertItem(item);
// 		setTimeout(() => {
// 			getOne(i, urls);
// 		}, 500 + (Math.random()*400));
// 	});
// };

const scrapeItemTest = url => {
	return new Promise((resolve, reject) => {
		request(url, (err, resp, body) => {
			const $ = cheerio.load(body);
			const name = ($('h1.protect').html());
			console.log('name: ' + name);
			resolve(name);
		});
	});
};

// difference between these???
const scrapeItemDelayedTest = (url, ms) => {
	return new Promise((resolve, reject) => {
		delay(ms)
			.then(scrapeItemTest(url))
			.then(resp => resolve(resp));
	})
};

// const scrapeItemDelayedTest2 = (url, ms) => {
// 	return new Promise((resolve, reject) => {
// 		delay(ms)
// 			.then(resolve(scrapeItemTest(url))); // what happens when you resolve a pending promise???
// 	});
// };

getURLsPromise(target)
	.then(resp => {
		console.log('starting');
		const funcsTest = resp.map(url => () => scrapeItemDelayedTest(url, 2000));
		console.log('funcsTest length: ' + funcsTest.length);
		return sequentialPromises(funcsTest);
	})
	.then(resp => {
		console.log('here');
		console.log(typeof resp);
		resolve('hi');
	})
	.then(resp => {
		console.log('here2');
		console.log(typeof resp, resp);
	});

// function insertItem(item) {
// 	sequelize.
// 		query(`INSERT INTO items (season, name, price, desc, week, cat)
// 			VALUES ('SS18', '${item.name}', ${item.price}, '${item.description}', 1, '${item.category}')`, 
// 			{ raw: true})
// 		.then(response => {
// 			console.log('insert successful');
// 			console.log(response);
// 		});
// }