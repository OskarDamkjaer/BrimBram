//stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

function sfc32(a, b, c, d) {
	return function () {
		a >>>= 0;
		b >>>= 0;
		c >>>= 0;
		d >>>= 0;
		let t = (a + b) | 0;
		a = b ^ (b >>> 9);
		b = (c + (c << 3)) | 0;
		c = (c << 21) | (c >>> 11);
		d = (d + 1) | 0;
		t = (t + d) | 0;
		c = (c + t) | 0;
		return (t >>> 0) / 4294967296;
	};
}

export function getRandomizer(num: number) {
	const seed = num ^ 0xdeadbeef;
	const rand = sfc32(0x9e3779b9, 0x243f6a88, 0xb7e15162, seed);
	for (let i = 0; i < 15; i++) rand();
	return rand;
}

export function createSemiRandomSeed() {
	return Math.floor(Math.random() * 10000000);
}
