// External Modules
var request = require('ahr'),
sys = require('sys'),
events = require('events'),
jsdom = require('jsdom');

var jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';
var headers = {'content-type':'application/json', 'accept': 'application/json'};

// Export searcher
module.exports = Scraper;

function Scraper(param) {
	if (param.headers) {
		this.headers = param.headers;
	} else {
		this.headers = headers;
	}

	this.siteName = param.siteName;
	this.siteUrl = param.siteUrl;
}

// Inherit from EventEmitter
Scraper.prototype = new process.EventEmitter;

Scraper.prototype.scrape = function(query, collector) {
	var self = this;
	var url = self.getScrapeUrl(query);

	console.log('Connecting to... ' + url);

	request({uri: url, method: 'GET', headers: self.headers, timeout: 30000}, function(err, response, html) {
		if (err) {
			self.onError({error: err, searcher: self});
			self.onComplete({searcher: self});
		} else {
			console.log('Fetched content from... ' + url);
			// create DOM window from HTML data
			var window = jsdom.jsdom(html,null,{features: {
				ProcessExternalResources : false,
				FetchExternalResources: false
       		}}).createWindow();
			// load jquery with DOM window and call the parser!
			jsdom.jQueryify(window, 'http://code.jquery.com/jquery-1.4.2.min.js', function() {
				self.parseHTML(window);
				self.onComplete({scraper: self});
			});
		}
	});
}



// Implemented in inhetired class
Scraper.prototype.parseHTML = function(window) {
	throw "parseFHTML() is unimplemented!";
}

// Implemented in inhetired class
Scraper.prototype.getScrapeUrl = function(query) {
	throw "getScrapeUrl() not implemented!";
}
// Emits 'complete' event when searcher is done
Scraper.prototype.onComplete = function(scraper) {
	this.emit('complete', scraper);
}
// Emit 'error' events
Scraper.prototype.onError = function(error) {
	this.emit('error', error);
}

// Emits 'item' events when an item is found.
Scraper.prototype.onItem = function(item) {
	this.emit('item', item);
}

Scraper.prototype.toString = function() {
	return this.siteName + "(" + this.siteUrl + ")";
}
