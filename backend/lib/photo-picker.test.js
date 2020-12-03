const path = require("path");
const fs = require("fs");
const readline = require("readline");

jest.mock("glob");
const glob = require("glob");
const querystring = require('querystring');
const {PhotoPicker} = require("./photo-picker");

describe("search for files by mask", () => {
	test("files exist", async () => {
		jest.spyOn(glob, 'glob').mockImplementation((photosMask, cb) => {
			return cb(null, [
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph1.jpg",
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph14.jpg",
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph2.jpg",
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph3.jpg",
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph5.jpg",
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph6.jpg",
			]);
		});

		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		const n = await pp.getPhotosCount();
		expect(n).toBe(6);
	});

	test("files not exist", async () => {
		jest.spyOn(glob, 'glob').mockImplementation((photosMask, cb) => {
			return cb(null, []);
		});

		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		const n = await pp.getPhotosCount();
		expect(n).toBe(0);
	});

	test("got error", async () => {
		jest.spyOn(glob, 'glob').mockImplementation((photosMask, cb) => {
			return cb(new Error(`some bug`), []);
		});

		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		await expect(pp.getPhotosCount()).rejects.toEqual(new Error(`some bug`));
	});
});

describe("calculate number from hash", () => {
	const cases = [
		["1e223fc77f8dc2ad48f14af26dff90a5bc80ff1a", 12, 4],
		["828686c78a548fdc2b1f0f1a4ca08090919272cf", 17, 11],
		["fefb19ca5ab343aa0e1903e7b3a1ba78f9f382e9", 11, 7],
	];

	const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
	test.each(cases)(
		`hash %p photosCount "%p" => %p`,
		(hash, photosCount, photoNumber) => {
			expect(pp.calcHash2Number(hash, photosCount)).toEqual(photoNumber);
		}
	);

	test("hash is empty", async () => {
		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		expect(() => {
			pp.calcHash2Number("", 1);
		}).toThrow(`hash can't be empty`);
	});

	test("photo count is 0", async () => {
		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		expect(() => {
			pp.calcHash2Number("aa", 0);
		}).toThrow(`photos count can't be empty`);
	});
	test("photo count is null", async () => {
		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		expect(() => {
			pp.calcHash2Number("aa", null);
		}).toThrow(`photos count can't be empty`);
	});
	test("photo count is undefined", async () => {
		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		let actual = pp.calcHash2Number("aa", undefined);
		expect(actual).toEqual(0);
	});
});

describe("pick photo", () => {
	test("files exist", async () => {
		jest.spyOn(glob, 'glob').mockImplementation((photosMask, cb) => {
			return cb(null, [
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph1.jpg",
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph14.jpg",
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph2.jpg",
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph3.jpg",
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph5.jpg",
				"/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph6.jpg",
			]);
		});

		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		const photoFile = await pp.pick(querystring.stringify({
			title: "Go Miro25691809",
			desc: "Dream job",
			team: "Developers",
			position: "Middle",
		}));
		expect(photoFile).toBe("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph5.jpg");
	})

	test("files not exist", async () => {
		jest.spyOn(glob, 'glob').mockImplementation((photosMask, cb) => {
			return cb(null, []);
		});

		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		await expect(async () => {
			await pp.pick(querystring.stringify({
				title: "Go Miro",
				desc: "Dream job",
				team: "Developers",
				position: "Middle",
			}));
		}).rejects.toEqual(new Error(`no photos files found`));
	})
});

describe("photo picker", () => {
	test("mask ok", async () => {
		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		expect(pp.photoMask).toEqual("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
	})

	const cases = [
		["empty string", ""],
		["null", null],
		["undefined", undefined],
	];
	test.each(cases)(
		`mask is %p`,
		async () => {
			await expect(async () => {
				new PhotoPicker("");
			}).rejects.toEqual(new Error(`mask can't be empty`));
		},
	);
});

describe("calculate hash", () => {
	const cases = [
		["d83b7497ce692fcde43f0405a94a61254f48ef2e5586c10ee35f986f0c218737", "http://localhost:3000/api/make-preview?template=careers&a=1&b=2"],
		["0accd6bd4510b2801db2e068b3dd74d21411529c19f6efb3450bf26ace17b61f",
			"https://www.google.com/search?newwindow=1&client=firefox-b-d&sxsrf=ALeKk02FLnAKpyf9IZlDKV2-8dENJn6UAQ%3A1606985632901&ei=oKfIX8quNsLosAecw7PoCA&q=nodejs+sha256+&oq=nodejs+sha256+&gs_lcp=CgZwc3ktYWIQAzIGCAAQBxAeMgYIABAHEB4yBggAEAcQHjIGCAAQBxAeMgYIABAHEB4yBggAEAcQHjICCAAyBwgAEBQQhwIyAggAMgIIADoHCAAQsAMQQzoFCAAQyQM6BQgAEMsBOgYIABAWEB46CAgAEAgQBxAeUO2vAViMuwFgsrwBaABwAHgAgAGHAYgB0gWSAQMwLjaYAQCgAQGqAQdnd3Mtd2l6yAEKwAEB&sclient=psy-ab&ved=0ahUKEwjK_rr-t7HtAhVCNOwKHZzhDI0Q4dUDCAw&uact=5"],
		["2f57dc9943dd8d84a71dfa9c4e1a3a8a77fc5d34a05b9e87aa4305f5de177b48", "https://stackoverflow.com/questions/27970431/using-sha-256-with-nodejs-crypto"],
	];

	const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
	test.each(cases)(
		`hash %p of %p`,
		(hash, str) => {
			expect(pp.getHash(str)).toEqual(hash);
		}
	);
});

test("verify distribution", async () => {
	const book = path.resolve(__dirname, '..', "assets", "JohnRonaldReuelTolkien.txt");
	const fileStream = fs.createReadStream(book);
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const pp = new PhotoPicker("aa");

	const results = new Map();
	let line = ""
	let totalLines = 0;
	for await (line of rl) {
		line = line.trim();
		if (0 === line.length) {
			continue
		}

		let hash = pp.getPhotoNumber(20, line);
		results.set(hash, (results.get(hash) || 0) + 1);
		totalLines++;
	}

	// region See https://en.wikipedia.org/wiki/Standard_deviation
	const avg = totalLines/results.size;
	let sum = 0;
	for (var [photo, appearences] of results.entries()) {
		sum += Math.pow(appearences-avg, 2);
	}
	const deviation = Math.sqrt(sum/results.size);
	const deviationPerc = deviation/avg * 100;
	// endregion

	expect(deviationPerc).toBeLessThan(7);
});