const playwright = require("playwright-aws-lambda");
const querystring = require("querystring");

function error(res, msg) {
  return res.status(500).send(msg);
}

module.exports = async (req, res) => {
  const browser = await playwright.launchChromium();

  if (typeof req.query.template === "undefined") {
    return error(res, `no template given`);
  }

  const page = await browser.newPage();

  await page.setViewportSize({
    width: req.query.w || 1200,
    height: req.query.h || 630,
  });

  let queryStr = querystring.stringify(req.query);

  const hostName =
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    "http://localhost:3000";

  const opened = await page.goto(
    `${hostName}/banners/${req.query.template}?${queryStr}`
  );

  if (399 < opened.status()) {
    return error(res, "can't load page");
  }
  const buf = await page.screenshot({
    encoding: "binary",
    type: "jpeg",
  });
  await page.close();

  return res.send(buf);
};
