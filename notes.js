// https://hackernoon.com/functional-javascript-resolving-promises-sequentially-7aac18c4431e
const getAll = funcs => 
	funcs.reduce((promise, func) =>
		promise.then(res =>
			func().then(item) => res.concat(item)),
		promise.resolve({}))

const getAll = funcs => { 
	return funcs.reduce((promise, func) => {
		return promise.then(res =>
			func().then(item => res.concat(item)));
	}, Promise.resolve({}));
};

const pipe = function(...fns) {
	return fns.reduce(function(a, f) {
		return function(...args) {
			return f(a(...args)); // a = accumulator, f = function
		}
	}); 
}; 

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

// what's the difference
const scrapItemDelayedTest = (url, ms) => {
	return new Promise((resolve, reject) => {
		delay(ms)
			.then(scrapeItemTest(resp)) // returns undefined!!!
			.then(resp => resolve(resp));
	})
}

const scrapeItemDelayedTest2 = (url, ms) => {
	return new Promise((resolve, reject) => {
		delay(ms)
			.then(resolve(scrapeItemTest(url))); // no delay here!!!
	});
};

const scrapeItemDelayedTest2 = (url, ms) => {
	return new Promise((resolve, reject) => {
		delay(ms)
			.then(() => scrapeItemTest(url))
			.then(resp => resolve(resp));
	});
};
