const express = require('express');
const app = express();
const path = require('path');
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
const loader = new TwingLoaderFilesystem(path.join(__dirname, '..', 'frontend'));
const twing = new TwingEnvironment(loader);

app.use(express.static(path.join(__dirname, '..', 'frontend', 'static')))

app.get('/', function(req, res) {
	res.send('hello world');
});


app.get('/api/renderer', (req, res) => {
	let template = req.query.template + '.twig'
	twing.render(template, req.query).then(output => {
		res.send(output);
	}).catch(e => {
		res.send('We have problems')
	});
});

app.listen(3000);