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

