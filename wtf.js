'use strict';

const request = require('request'),
	cheerio = require('cheerio'),
	Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:blahblah75@localhost:5432/supremedb');

let items = {};
let itemsSet = new Set();

console.log('beginning scrape');

const getURLsPromise = url => {
	return new Promise((resolve, reject) => {
		request(url, (err, res, body) => {
			console.log('request finished');

			if (!err) {
				console.log('no errors');
				const $ = cheerio.load(body);

				const linkElems = $('.turbolink_scroller a');

				// let urls = linkElems.map(elem => 'http://www.supremenewyork.com' + $(elem).attr('href')); // doesn't work since linkElems != array but a jquery obj???
				
				let urls = linkElems.map((i, el) => {
					return 'http://www.supremenewyork.com' + $(el).attr('href');
				}).get(); // what does this return if .get() is removed???

				resolve(urls);
			} else {
				reject(err); // is this right???
			}
		});
	});
};

// https://hackernoon.com/functional-javascript-resolving-promises-sequentially-7aac18c4431e
// const getAll = funcs => 
// 	funcs.reduce((promise, func) =>
// 		promise.then(res =>
// 			func().then(item) => res.concat(item)),
// 		promise.resolve({}))

// const getAll = funcs => { 
// 	return funcs.reduce((promise, func) => {
// 		return promise.then(res =>
// 			func().then(item => res.concat(item)));
// 	}, Promise.resolve({}));
// };

// const scrapeItemTest = (url) => {
// 	return new Promise((resolve, reject) => {
// 		request(url, (err, resp, body) => {
// 			const $ = cheerio.load(body);
// 			resolve($('h1.protect').html());
// 		});
// 	});
// };


const foo = () => {
	console.log('hi');
	Promise.resolve([])
		.then(items => {
			console.log(items.length);
			console.log('starting timeout 1');
			return new Promise(resolve => {
				setTimeout(() => {
					console.log('timeout 1 has elapsed starting fetch');
					return func1.then(item => {
						console.log('fetch 1, item' + item);
						resolve(items.concat(item));
					})
				}, 5000);
			});
		})
		.then(items => {
			console.log(items.length);
			console.log('starting timeout 2');
			return new Promise(resolve => {
				setTimeout(() => {
					console.log('timeout 2 has elapsed starting fetch');
					return func2.then(item => {
						console.log('fetch 2, item ' + item);
						resolve(items.concat(item));
					})
				}, 5000);
			});
		}).then(items => {
			console.log(items.length);
			console.log('done all');
		});
	console.log('bye');
};

// const funcs = urls.map(url => () => scrapeItem(url));

// const pipe = function(...fns) {
// 	return fns.reduce(function(a, f) {
// 		return function(...args) {
// 			return f(a(...args)); // a = accumulator, f = function
// 		}
// 	}); 
// };



// getURLsPromise('http://www.supremenewyork.com/shop/new')
// 	.then(resp => {
// 		let urls = resp;
// 		// console.log('response from getURLs', urls);
// 		scrapeItemsRecursive(urls);
// 	});
// 	.then(resp => {
// 		console.log('done scraping all items');
// 		console.log(resp);
// 	});

// Promise.resolve(items)


// function scrapeItemsRecursive(urlsArr) {
// 	let [url, ...urls] = urlsArr;

// 	return setTimeout(() => {
// 		console.log(url);
// 		if (urls.length > 1) {
// 			return Promise.all(setTimeout(() => {
// 				return scrapeItemsRecursive(urls);
// 			}, 20));
// 		} else {
// 			Promise.resolve('hi');
// 		}
// 	}, 20);
// }

// function scrapeItemsRecursive(urlsArr) {
// 	return new Promise((resolve, reject) => {
// 		let [url, ...urls] = urlsArr;

// 		scrapeItemPromise(url)
// 			.then(resp => {
// 				if (urls.length > 1) {
// 					setTimeout(() => {
// 						scrapeItemsRecursive(urls);
// 					}, 500);
// 				}
// 			});
// 	});
// }


// function scrapeItemsRecursive(urlsArr) {
// 	return new Promise (resolve, reject) => {

// 		let [url, ...urls] = urlsArr;

// 		scrapeItem(url)
// 			.then(resp => {
// 				if (urls.length > 1) {
// 					setTimeout(() => {
// 						scrapeItemsRecursive(urls);
// 					}, 800 + Math.random() * 2000);
// 				} else {
// 					resolve('hi');
// 				}
// 			});
// 	}
// }

// function scrapeItemsRecursive(urlsArr) {
// 	let [url, ...urls] = urlsArr;

// 	if (urlsArr.length <= 1) {
// 		// setTimeout(() => {
// 		// 		console.log(urlsArr.length);
// 		// 	}, 500);
// 		scrapeItem(urlsArr[0])
// 			.then(resp => {
// 				console.log(resp);
// 			});
// 	}
// 	else {
// 		// setTimeout(() => {
// 		// 	console.log(urlsArr.length);
// 		// 	scrapeItemsRecursive(urlsArr.slice(1, urlsArr.length));
// 		// }, 800 + Math.random() * 2000);
// 		scrapeItem(urlsArr[0])
// 			.then(resp => {
// 				console.log(resp);
// 				setTimeout(() => { // limit the rate of requests
// 					scrapeItemsRecursive(urlsArr.slice(1, urlsArr.length));
// 				}, 800 + Math.random() * 2000);
// 			});
// 	}
// }

// get urls

// scrape single item

// db insert

// function scrapeItemPromise(url) {
// 	return new Promise((resolve, reject) => {
// 		request(url, (err, resp, body) => {
// 			if (!err) {
// 				const $ = cheerio.load(body);

// 				let name = $('h1.protect').html();
// 				resolve(name);
// 			} else {
// 				reject(err);
// 			}
// 		});
// 	});
// }

const scrapeItem = url => {
	return request(urls[i], (err, resp, body) => {
		const $ = cheerio.load(body);

		let item = {};
		item.name = $('h1.protect').html();
		console.log(item.name);
		item.category = $('h1.protect').attr('data-category');
		console.log(item.category);
		item.price = $('span', 'p.price').html();
		console.log(item.price);
		item.price = item.price.substring(1, item.price.length);
		console.log(item.price);
		item.description = $('p.description').html().trim();
		console.log(item.description);
		item.text = body;
		i++;
		insertItem(item);
		setTimeout(() => {
			getOne(i, urls);
		}, 500 + (Math.random()*400));
	});
};

const scrapeItemDelayed = (url, ms) => {
	return new Promise((resolve, reject) => setTimeout(resolve(scrapeItem(url)), ms));
};

const delay = ms => {
	return new Promise((resolve, reject) => { 
		setTimeout(resolve, ms);
	});
};

const scrapeItemTest = url => {
	return new Promise((resolve, reject) => {
		request(url, (err, resp, body) => {
			const $ = cheerio.load(body);
			const name = ($('h1.protect').html());
			console.log(name);
			resolve(name);
		});
	});
};

const scrapeItemDelayedTest = (url, ms) => {
	return new Promise((resolve, reject) => {
		delay(ms)
			.then(scrapeItemTest(url))
			.then(resp => resolve(resp));
	});
};

const scrapeItemDelayedTest2 = (url, ms) => { // difference with this one?
	return new Promise((resolve, reject) => {
		delay(ms)
			.then(resolve(scrapeItemTest(url)));
	});
};




// const scrapeItemDelayedTest = (url, ms) => {
// 	return new Promise((resolve, reject) => setTimeout(resolve(scrapeItemTest(url)), ms));
// };

// const urlsTest = getURLsPromise('http://www.supremenewyork.com/shop/new');

// const funcsTest = urls.map(url => () => scrapeItemDelayedTest(url, 3000));

const scrapeAll = (funcs) => {
	return funcs.reduce((promise, func) => {
		return promise.then(res =>
			func().then(item => res.concat(item)));
	}, Promise.resolve({}));
};

const scrapeAllTest = (funcs) => {
	return funcs.reduce((promise, func) => {
		return promise.then(res =>
			func().then(item => res.concat(item)));
	}, Promise.resolve([]));
};

getURLsPromise('http://www.supremenewyork.com/shop/new')
	.then(resp => {
		console.log('starting');
		const funcsTest = resp.map(function(url) {
			return function() {
				return scrapeItemDelayedTest(url, 2000);
			};
		});
		console.log(funcsTest.length);
		return scrapeAllTest(funcsTest);
	})
	.then(resp => {
		console.log('here');
		console.log(typeof resp);
	})



// getURLs()
// 	.then(response => {
// 		console.log(response.length);
// 	});


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

// urls.forEach(url => {
// 	i++;
// 	let j = i;
// 	return setTimeout(() => {
// 		let endTime = (new Date()).getTime();
// 		let elapsedTime = (endTime - startTime)/1000;
// 		console.log(url + ' : ' + j + ' : ' + j*j*1000 + ' : ' + elapsedTime);
// 		// tscrapeSingle(url);
// 	}, (i*i*1000) + (Math.random() * 1))
// });