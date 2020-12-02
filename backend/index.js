const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

(async () => {
	const browser = await puppeteer.launch();
	app.get('/api/make-preview', async (req, res) => {
		const page = await browser.newPage();
		const opened = await page.goto('http://ya.ru'); // TODO: replace with /api/render/
		if (399 < opened.status()) {
			return res.status(500).send("can't load page");
		}
		const buf = await page.screenshot({
			encoding: "binary",
			type: "png",
		})
		const closed = page.close()

		return res.set("Content-Type", "image/png").send(buf);
	});

	app.get('/api/render', function (req, res) {
		// render React component
		res.send('hello world');
	});

	app.listen(3000, () => {
		console.log("API on localhost:3000");
	});
})();
