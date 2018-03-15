// todos
// try to add a delay after request to target
// add option to break out of sequential promises early
// try the recursive method
// restructure the database
// handle inserting html
// deal with images
// write db insert serial

'use strict';

const request = require('request'),
	cheerio = require('cheerio'),
	Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:blahblah75@localhost:5432/supremedb');

const target = 'http://www.supremenewyork.com/shop/new';

console.log('beginning scrape.js');

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

// const sequentialPromises = funcs =>
// 	funcs.reduce((promise, func) =>
// 	promise.then(result => {
// 		console.info(result);
// 		return func().then(Array.prototype.concat.bind(result));
// 	}),
// 	Promise.resolve([]))

const sequentialPromises = funcs => {
	console.log('starting sequentual promises');
	return funcs.reduce((promise, func) => {
		return promise.then(res => {
			return func().then(item => {
				return res.concat(item);
			});
		});
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
			.then(resolve(func())); // should it be func or func()???
	});
};

const scrapeItem = url => {
	return new Promise((resolve, reject) => {
		return request(url, (err, resp, body) => {
			const $ = cheerio.load(body, {
				decodeEntities: false
			});
			let item = {};
			let name = $('h1.protect').html();
			let category = $('h1.protect').attr('data-category');
			let colour = $('p.style.protect').html();
			let price = $('span', 'p.price').html();
			price = parseInt(price.substring(1, price.length)); // remove $
			let description = $('p.description').html().trim();
			let collaborators = [];
			if (name.includes('/')) {
				const words = name.split(' ');
				collaborators = words[0].split('/');
				collaborators.shift(); // remove supreme 
				collaborators = collaborators.map(collaborator => collaborator.replace(/®/, '')) //
				collaborators = JSON.stringify(collaborators);
			}
			console.log(name);
			// console.log(category);
			// console.log(colour);
			// console.log(price);
			// console.log(description);
			// if (collaborators.length > 0) {
			// 	console.info(collaborators);
			// }
			let html = body; // remove this later
			item = {
				name,
				category,
				colour,
				price,
				description,
				collaborators// how to handle null collaborators???
				// html
			};
			// console.info(item);
			resolve(item);
		});
	})
};

const scrapeItemTest = url => {
	console.log('starting scrape item test');
	return new Promise((resolve, reject) => {
		request(url, (err, resp, body) => {
			if (!err) {
				const $ = cheerio.load(body, {
						decodeEntities: false
					});
				console.log('request of scrape item test finished');
				const name = ($('h1.protect').html());
				console.log(name);
				resolve(name);
				console.log('resolved scrapeitemtest');
			} else {
				reject(err);
			}
		});
	});
};

const scrapeItemDelayed = (url, ms) => {
	return new Promise((resolve, reject) => {
		delay(ms)
			.then(() => scrapeItem(url))
			.then(resp => resolve(resp));
	})
};

// difference between these???
const scrapeItemDelayedTest = (url, ms) => {
	return new Promise((resolve, reject) => {
		delay(ms)
			.then(resolve(scrapeItemTest(url)));
	})
};

// const scrapeItemDelayedTest2 = (url, ms) => {
// 	return new Promise((resolve, reject) => {
// 		delay(ms)
// 			.then(resolve(scrapeItemTest(url))); // what happens when you resolve a pending promise???
// 	});
// };

// scrapeItem('http://www.supremenewyork.com/shop/jackets/mvg0bjte6/glhqz5gfw')
// 	.then(resp => {
// 		console.info(resp);
// 		insertItem(resp);
// 	});

getURLsPromise(target)
	.then(resp => {
		console.log('starting');
		const scrapeFuncs = resp.map(url => () => scrapeItemDelayed(url, 750 + Math.floor(Math.random() * 750)));
		console.log('scrapeFuncs length: ' + scrapeFuncs.length);
		resp.forEach(url => console.log(url));
		return sequentialPromises(scrapeFuncs);
	})
	.then(resp => {
		console.log('here');
		console.log(typeof resp);
		const insertFuncs = resp.map(item => () => insertItem(item));
		resp.forEach(item => console.info(item));
		insertFuncs.forEach(func => {
			func();
		});
	})
	.then(resp => {
		console.log('here2');
		console.log(typeof resp, resp);
		return;
	});

function insertItem(item) {
	let sql = `INSERT INTO items_temp (season, week, name, category, colour, price, description, collaborators)
			VALUES ('SS18', 3, '${item.name}', '${item.category}', '${item.colour}', '${item.price}', '${item.description}', '${item.collaborators}')`;
	return sequelize.
		query(sql, { raw: true })
		.spread((results, metadata) => {
			console.log('insert successful');
			console.log(results);
			console.log(metadata);
		})
		.catch(err => {
			console.log('insert failed');
			console.log(err);
		});
}