var scraper = require('./scraper-appdata');
var output = "./maus.txt";
var fs = require('fs');
var out = fs.openSync(output, 'w');


scraper.on('item', function(item){
	fs.write(out,item.name+";"+item.mau+"\n");
});

scraper.on('complete', function(scraper){
	console.log('scraper done for page '+i);
	i++;
	scrape();
});

var i = 0;

var scrape = function() {
	if(i > 50) { // 50 pages in there to load.
		fs.closeSync(out);
		process.exit();
	}
	scraper.scrape(i);
}
scrape();
