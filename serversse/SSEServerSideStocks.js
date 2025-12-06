// https://javascript.plainenglish.io/server-sent-events-with-react-nodejs-4c3d622419e1

// configuration file contains:
//     hostname
//     port
//     Stock or Index data:
//         stocks is an array of stock and index ticker names
//         Each ticker name has an array containing:
//             - fullName
//             - initPrice
//             - rate (up or down, a multiplier that's applied to the stock)
//             - baseVolume: base volume for stocks, the "base" amount for a trade; for indices where the day starts
//             - volumeRate: volume variability, multiplicative factor (i.e. 1.5 means 50%)
//             - volumeTrend: (indices reflect daily cummulatives, stocks reflect individual trades) random or up
//
// A query must contain a ticker symbol.
//
// The server returns a JSON object containing:
// - Ticker symbol
// - Full name of the ticker symbol
// - Last price (index) or current price (stocks)
// - Daily volume (index) or current trade valume (stocks)
//

//const { createServer } = require('node:http');
const config = require('./stockServerConfigV3.json');

function getRand(varRange, upOnly) {
    if (upOnly) {
	return Math.floor(Math.random() * varRange);
    } else {
	return Math.floor(Math.random() * varRange - varRange/2);
    }
}

function getStock(items, ticker) {
    for (i = 0; i < items.length && items[i].ticker != ticker; i++) {
	console.log(items[i].ticker);
    }
    return items[i];
}

class Stock {
    constructor(ticker, initPrice, rate, name, baseVolume, volRate, volTrend) {
	this._ticker = ticker;
	this._last = parseInt(initPrice);
	this.rate = parseFloat(rate)
	this.name = name;
	this._volume = parseInt(baseVolume);
	this.volRate = parseFloat(volRate);
	this.volTrend = volTrend;
    }
    get ticker() {
	return this._ticker;
    }
    set last(value) {
	this._last = value;
    }
    get last() {
	return this._last;
    }
    set volume(value) {
	this._volume = value;
    }
    get volume() {
	return this._volume;
    }
    trade() {
	this.last = this.last + getRand(this.last * this.rate);
	//	this.volume = this.volume + getRand(this.volume * this.volRate, false);
	if (this.volTrend == "up") {
	    this.volume = this.volume + getRand(this.volume * this.volRate, true);
	} else if (this.volTrend == "random") {
	    this.volume = this.volume + getRand(this.volume * this.volRate, false);
	}
    }
}

let stockObjs = [];
for (let i = 0; i < config.stocks.length; i++) {
    let id = config.stocks[i];
    console.log(id);
    let newItem = new Stock(id, config[id].initPrice, config[id].rate, config[id].fullName, config[id].baseVolume, config[id].volumeRate, config[id].volumeTrend);
    stockObjs.push(newItem);
}

function buildReturn() {
    const stock = stockObjs[Math.floor(Math.random() * stockObjs.length)];
    stock.trade();
    let returnVal = {
	"ticker": stock.ticker,
	"name": stock.name,
	"price": stock.last,
	"volume": stock.volume
    };
    return JSON.stringify(returnVal);
}

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/stocks', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    setInterval(() => {
	let retData = buildReturn();
	console.log(retData);
	res.write(`data: ${retData}\n\n`);
    }, 3500);
});
app.listen(config.port, () => console.log(`Server running on port ${config.port}`));

/* const server = createServer((req, res) => {
    //console.log(req.url);
    //console.log(req.method);
    try {
	let request = req.url.substr(1);
	if (request != "favicon.ico") {
	    let data = config[request];
	    let stock = getStock(items, request);
	    console.log(stock);
	    stock.trade();
	    res.statusCode = 200;
	    res.setHeader('Content-Type', 'application/json');
	    let returnVal = {
		"ticker": request,
		"name": stock.name,
		"price": stock.last,
		"volume": stock.volume
	    };
	    console.log(JSON.stringify(returnVal));
	    res.end(JSON.stringify(returnVal));
	}
    } catch (error) {
	console.log("Error!");
	console.log(error);
    }
});

server.listen(config.port, config.hostname, () => {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);
});

*/

