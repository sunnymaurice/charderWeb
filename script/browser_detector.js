(function (app) {
	// 宣告目前市面上既有的瀏覽器
	var dataBrowser = [{
		string: navigator.userAgent,
		subString: 'Chrome',
		identity: 'Chrome'
	}, 
	{ 	string: navigator.userAgent,
		subString: 'OmniWeb',
		versionSearch: 'OmniWeb/',
		identity: 'OmniWeb'
	}, 
	{
		string: navigator.vendor,
		subString: 'Apple',
		identity: 'Safari',
		versionSearch: 'Version'
	}, 
	{
		prop: window.opera,
		identity: 'Opera',
		versionSearch: 'Version'
	}, 
	{
		string: navigator.vendor,
		subString: 'iCab',
		identity: 'iCab'
	}, 
	{
		string: navigator.vendor,
		subString: 'KDE',
		identity: 'Konqueror'
	}, 
	{
		string: navigator.userAgent,
		subString: 'Firefox',
		identity: 'Firefox'
	}, 
	{
		string: navigator.vendor,
		subString: 'Camino',
		identity: 'Camino'
	}, 
	{	// for newer Netscapes (6+)
		string: navigator.userAgent,
		subString: 'Netscape',
		identity: 'Netscape'
	}, 
	{
		string: navigator.userAgent,
		subString: 'MSIE',
		identity: 'Explorer',
		versionSearch: 'MSIE'
	}, 
	{
		string: navigator.userAgent,
		subString: 'Gecko',
		identity: 'Mozilla',
		versionSearch: "rv"
	}, 
	{   // for older Netscapes (4-)
		string: navigator.userAgent,
		subString: 'Mozilla',
		identity: 'Netscape',
		versionSearch: 'Mozilla'
	}];

	// 宣告目前市面上常見的OS
	var dataOS = [{
		string: navigator.platform,
		subString: 'Win',
		identity: 'Windows'
	}, 
	{
		string: navigator.platform,
		subString: 'Mac',
		identity: 'Mac'
	}, 
	{
		string: navigator.userAgent,
		subString: 'iPhone',
		identity: 'iPhone/iPod'
 	}, 
 	{
		string: navigator.userAgent,
		subString: 'Android',
		identity: 'Android'
 	}, 
 	{
		string: navigator.platform,
		subString: 'Linux',
		identity: 'Linux'
	}];

	app.browserDetect = {
		searchString: function searchString(data) {
			for (var i = 0 ; i < data.length; i++) {
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				} else if (dataProp) {
					return data[i].identity;
				}
			}
		},
		searchVersion: function searchVersion(dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
		},
		init: function init() {
			this.browser = (this.searchString(dataBrowser) || 'unknown_browser');
			this.version = (this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'unknown_version');
			this.OS = this.searchString(dataOS) || 'unknown_OS';
		}
	};
	app.browserDetect.init();

	// 顯示連接用戶端的OS與瀏覽器種類及版本
	//console.log('OS: ' + app.browserDetect.OS);
	//console.log('Browser: ' + app.browserDetect.browser + ' ' + app.browserDetect.version);
})(window);