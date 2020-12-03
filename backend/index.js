const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const querystring = require('querystring');
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
const loader = new TwingLoaderFilesystem(path.join(__dirname, '..', 'frontend'));
const twing = new TwingEnvironment(loader);
const app = express();

app.use(express.static(path.join(__dirname, '..', 'frontend', 'static')));

function error(res, msg) {
	return res.status(500).send(msg)
}

(async () => {
	const browser = await puppeteer.launch();
	app.get('/api/make-preview', async (req, res) => {
		if (typeof req.query.template === "undefined") {
			return error(res, `no template given`)
		}

		const page = await browser.newPage();
		let queryStr = querystring.stringify(req.query);
		const opened = await page.goto(`/banners/${req.query.template}?${queryStr}`);
		if (399 < opened.status()) {
			return error(res, "can't load page");
		}
		const buf = await page.screenshot({
			encoding: "binary",
			type: "jpeg",
		})
		await page.close()

		return res.set("Content-Type", "image/jpeg").send(buf);
	});

	app.get('/api/renderer', (req, res) => {
		if (typeof req.query.template === "undefined") {
			return error(res, `no template given`)
		}

		let template = req.query.template + '.twig'
		twing.render(template, req.query).then(output => {
			return res.send(output);
		}).catch(e => {
			return error(`We have problems: ${e.toString()}`)
		});
	});

	app.listen(3000, () => {
		console.log("API on localhost:3000");
	});
})();
