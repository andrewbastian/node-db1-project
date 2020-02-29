
const express = require('express');

const accountsRouter = require('./router/accountsRouter.js');

const server = express();

server.use(express.json());
server.use(logger)

server.use('/api/accounts', accountsRouter);

function logger(req, res, next) {
	console.log(`[${new Date().toISOString()}] - ${req.method} - ${req.url} - ${req.get("User-Agent")}`)
	next()
}

server.use((err, req, res, next) => {
	res.status(500).json({
		message: "Oops, something went wrong", err
	})
})

module.exports = server;