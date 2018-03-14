const delay = ms => {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
};

const delayedFunc = (func, ms) => {
	return delay(ms) // should this be returned???
		.then(func); // should it be func or func()???
};

const add = (a, b) => a + b

const addPromise = () => {
	return new Promise((resolve, reject) => {
		resolve(5);
	});
};

// const add23 = add(2, 3);

delayedFunc(addPromise, 5000)
	.then(resp => console.log(resp));

delayedFunc(addPromise, 5000)
	.then(resp => console.log(resp));