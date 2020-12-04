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
  const data = await page.screenshot({
    type: "jpeg",
  });

  await page.close();

  // Set the s-maxage property which caches the images then on the Vercel edge
  res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
  res.setHeader("Content-Type", "image/jpeg");
  // write the image to the response with the specified Content-Type
  res.end(data);
};
