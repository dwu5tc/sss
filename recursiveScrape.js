function scrapeItemsRecursive(urlsArr) {
	let [url, ...urls] = urlsArr;

	return setTimeout(() => {
		console.log(url);
		if (urls.length > 1) {
			return Promise.all(setTimeout(() => {
				return scrapeItemsRecursive(urls);
			}, 20));
		} else {
			Promise.resolve('hi');
		}
	}, 20);
}

function scrapeItemsRecursive(urlsArr) {
	return new Promise((resolve, reject) => {
		let [url, ...urls] = urlsArr;

		scrapeItemPromise(url)
			.then(resp => {
				if (urls.length > 1) {
					setTimeout(() => {
						scrapeItemsRecursive(urls);
					}, 500);
				}
			});
	});
}


function scrapeItemsRecursive(urlsArr) {
	return new Promise (resolve, reject) => {

		let [url, ...urls] = urlsArr;

		scrapeItem(url)
			.then(resp => {
				if (urls.length > 1) {
					setTimeout(() => {
						scrapeItemsRecursive(urls);
					}, 800 + Math.random() * 2000);
				} else {
					resolve('hi');
				}
			});
	}
}

function scrapeItemsRecursive(urlsArr) {
	let [url, ...urls] = urlsArr;

	if (urlsArr.length <= 1) {
		// setTimeout(() => {
		// 		console.log(urlsArr.length);
		// 	}, 500);
		scrapeItem(urlsArr[0])
			.then(resp => {
				console.log(resp);
			});
	}
	else {
		// setTimeout(() => {
		// 	console.log(urlsArr.length);
		// 	scrapeItemsRecursive(urlsArr.slice(1, urlsArr.length));
		// }, 800 + Math.random() * 2000);
		scrapeItem(urlsArr[0])
			.then(resp => {
				console.log(resp);
				setTimeout(() => { // limit the rate of requests
					scrapeItemsRecursive(urlsArr.slice(1, urlsArr.length));
				}, 800 + Math.random() * 2000);
			});
	}
}