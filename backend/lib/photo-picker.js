const glob = require("glob");
const crypto = require("crypto");

class PhotoPicker {
	constructor(photoMask) {
		if (0 === (photoMask || "").length) {
			throw new Error(`mask can't be empty`);
		}

		this.photoMask = photoMask
	}

	async pick(query) {
		const photosFiles = await this.getPhotosFiles(this.photoMask);
		if (0 === (photosFiles || []).length) {
			throw new Error(`no photos files found`);
		}

		const photoNumber = this.getPhotoNumber(photosFiles.length, query);

		return photosFiles[photoNumber];
	}

	async getPhotosCount(photosMask) {
		return new Promise((resolve, reject) => {
			glob(photosMask, function (er, files) {
				if (null !== er) {
					return reject(er);
				}

				return resolve(files.length);
			});
		});
	}

	async getPhotosFiles(photosMask) {
		return new Promise((resolve, reject) => {
			glob(photosMask, function (er, files) {
				if (null !== er) {
					return reject(er);
				}

				return resolve(files);
			});
		});
	}

	getPhotoNumber(photosCount, key) {
		return this.calcHash2Number(this.getHash(key), photosCount);
	}

	getHash(key) {
		return crypto.createHash('sha256').update(key).digest('hex')
	}

	calcHash2Number(hash = "", photosCount = 1) {
		if (0 === (hash || "").length) {
			throw new Error(`hash can't be empty`);
		}
		if (0 === (photosCount || 0)) {
			throw new Error(`photos count can't be empty`);
		}

		let num = 0;
		for (let i = 0; i < hash.length; i++) {
			num += hash.charCodeAt(i);
		}

		return num % photosCount;
	}
}

module.exports = {PhotoPicker};