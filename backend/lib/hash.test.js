jest.mock("glob");
import glob from "glob";

const {PhotoPicker} = require("./hash");

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
		const photoFile = await pp.pick({
			title: "Go Miro",
			desc: "Dream job",
			team: "Developers",
			position: "Middle",
		});
		expect(photoFile).toBe("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph5.jpg");
	})

	test("files not exist", async () => {
		jest.spyOn(glob, 'glob').mockImplementation((photosMask, cb) => {
			return cb(null, []);
		});

		const pp = new PhotoPicker("/Users/miju/Work/rtb.hackathon2020/backend/tmp/ph*.jpg");
		await expect(async () => {
			await pp.pick({
				title: "Go Miro",
				desc: "Dream job",
				team: "Developers",
				position: "Middle",
			});
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
		async (maskTitle, mask) => {
			await expect(async () => {
				const pp = new PhotoPicker("");
			}).rejects.toEqual(new Error(`mask can't be empty`));
		},
	);
});
