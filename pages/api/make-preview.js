const puppeteer = require('puppeteer');
const querystring = require('querystring');

function error(res, msg) {
    return res.status(500).send(msg)
}

export default async (req, res) => {

    const browser = await puppeteer.launch();

    if (typeof req.query.template === "undefined") {
        return error(res, `no template given`)
    }

    const page = await browser.newPage();

    page.setViewport({
        width: req.query.w || 1200,
        height: req.query.h || 630
    })

    let queryStr = querystring.stringify(req.query);
    const opened = await page.goto(`http://localhost:3000/banners/${req.query.template}?${queryStr}`);


    if (399 < opened.status()) {
        return error(res, "can't load page");
    }
    const buf = await page.screenshot({
        encoding: "binary",
        type: "jpeg",
    })
    await page.close()

    return res.send(buf);
}