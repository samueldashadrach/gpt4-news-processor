const xml2js = require("xml2js");
const util = require('util');

xml2js.Parser.prototype.parseStringPromise = util.promisify(xml2js.parseString);

const getUrlsFromSitemap_HT = async (SitemapUrl_HT) => {
	
	response = await fetch(SitemapUrl_HT, {
		method: "get",
		headers: {
			"Content-Type" : "application/json"
		}
	});
	SitemapXML = await response.text();
	var parser = new xml2js.Parser();
	SitemapObject = await parser.parseStringPromise(SitemapXML);

	const urlObjects = SitemapObject.urlset.url.map((urlObjectNonstandard) => {
		urlObject = {}
		urlObject.pageUrl = urlObjectNonstandard.loc[0];
		// Assumes Hindustan Times sitemap date/time follows ISO 8601 format
		urlObject.lastModified = Date.parse(urlObjectNonstandard.lastmod[0]);
		urlObject.changeFreq = urlObjectNonstandard.changefreq[0];
		return urlObject;
	})

	return urlObjects;

}

module.exports = { getUrlsFromSitemap_HT };