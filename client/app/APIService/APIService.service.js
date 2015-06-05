'use strict';

angular.module('geoAggregatorApp')
  .constant('urls', {
    WIKI_USERNAME: 'noam3127',
    WIKIPEDIA_URL: 'http://api.geonames.org/wikipediaSearch',
    FLICKR_URL: 'https://api.flickr.com/services/rest/',
    FLICKR_KEY: '8227368590ff288722bd0fc6c31f55a7',
    EAN_POI_URL: 'http://dev.api.ean.com/ean-services/rs/hotel/v3/geoSearch',
    EAN_KEY: 'd88batasn4m69t9xfmr7k7sj',
    EAN_CID: 55505,
    PANORAMIO_URL: 'http://www.panoramio.com/map/get_panoramas.php'
  })

  .service('APIService', ['$http', 'urls', function ($http, urls) {
    this.getWikiPlaces = function(query) {
      var params = {
        q: query,
        maxRows: 10,
        username: urls.WIKI_USERNAME,
        type: 'json'
      };
      return $http.get(urls.WIKIPEDIA_URL, {params: params});
    };

    this.getFlickr = function(place, from) {
      /*var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9b0940f2dd674df5abb54f9c95f480d9"
      + "&place_id=" + flickrPlaceId + "&sort=interestingness-desc&per_page=100&page="
      + pageNum + "&has_geo=1&extras=geo&accuracy=13&format=json&jsoncallback=?";*/
      var params = {
        api_key: '9b0940f2dd674df5abb54f9c95f480d9',
        method: 'flickr.photos.search',
        sort: 'interestingness-desc',
        place_id: place,
        per_page: 10,
        page: from || 0
      };
      return $http.get(urls.FLICKR_URL, {params: params});
    };

    // this.getPointsOfInterest = function(query) {
    //   var poiUrl = "http://dev.api.ean.com/ean-services/rs/hotel/v3/geoSearch?CID=55505&apiKey=d88batasn4m69t9xfmr7k7sj&type=2&destinationString="
    //   + query + "&callback=JSON_CALLBACK";
    //   var params = {
    //     CID: urls.EAN_CID,
    //     apiKey: urls.EAN_KEY,
    //     type: 2,
    //     destinationString: query,
    //     callback: 'JSON_CALLBACK'
    //   };
    //   console.log('calling...');
    //   return $http.jsonp(poiUrl, {params: params});
    // };
    this.getFlickrPlaces = function(query) {
     // var flickr_woe = "http://api.flickr.com/services/rest/?method=flickr.places.find&api_key=9b0940f2dd674df5abb54f9c95f480d9&query="
     //  + loc + "&format=json&jsoncallback=?",
     //   specific;
      var url = urls.FLICKR_URL;
      var params = {
        api_key: urls.FLICKR_KEY,
        method: 'flickr.places.find',
        query: query,
        format: 'json',
        callback: 'JSON_CALLBACK',
        nojsoncallback: 1
      };
      return $http.get(url, {params: params});
    };

    this.getFlickrPhotos = function(minLong, minLat, maxLong, maxLat) {
      var url = urls.FLICKR_URL;
      var bbox = Array.prototype.slice.call(arguments).join(',');
      var params = {
        api_key: urls.FLICKR_KEY,
        method: 'flickr.photos.search',
        sort: 'interestingness-asc',
        bbox: bbox,
        format: 'json',
        has_geo: 1,
        extras: 'geo',
        accuracy: 13,
        per_page: 10,
        callback: 'JSON_CALLBACK',
        nojsoncallback: 1
      };
      return $http.get(url, {params: params});
    };

    this.getPanoramioPhotos = function(minLong, minLat, maxLong, maxLat) {
      console.log('args', arguments);
      var url = urls.PANORAMIO_URL;
      var params = {
        set: 'public',
        from: 0,
        to: 100,
        minx: minLong,
        miny: minLat,
        maxx: maxLong,
        maxy: maxLat,
        size: 'square',
        mapFilter: true,
        callback: 'JSON_CALLBACK'
      };

      return $http.jsonp(url, {params: params});
    };
  }]);
