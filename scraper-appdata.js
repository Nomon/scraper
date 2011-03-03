var Scraper = require('./scraper');

var scraper = new Scraper({
	siteName: 'Appdata',
	siteUrl: 'http://www.appdata.com'
});

module.exports = scraper;

scraper.getScrapeUrl = function(query) {
	if(query == 0) {
		return this.siteUrl + "/leaderboard/developers?list_select=devs&metric_select=mau&fanbase=0&genre_id=1"; // appdata gives error on page=0
	} else {
		return this.siteUrl + "/leaderboard/developers?list_select=devs&metric_select=mau&fanbase=0&genre_id=1&page=" + query;
	}
}

scraper.parseHTML = function(window) {
	var self = this;
	window.$('tr').each(function() {
		var item = window.$(this);
		var a = item.attr('style');
		if(a == 'padding-bottom:10px;') {
			var elem = item.find('a').first();
			var name = elem.text().replace(/\s/gi,'');
			var mau = item.find('.name').first().find('td').first().text().replace(/\s/gi,'').replace(/,/gi,'');
			self.onItem({'name':name,'mau':mau});
		}
	});
}
