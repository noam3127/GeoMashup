'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');

var geoNamesService = function(config) {
  var geonames = {};
  /**
   * Defines the detail level of the response
   */
  geonames.style = {
    short : 'SHORT',
    medium : 'MEDIUM',
    long : 'LONG',
    full : 'FULL'
  };

  /**
   * Defines the matching range for cities
   *   cities1000  : all cities with a population > 1000 or seats of adm div (ca 80.000)
   *   cities5000  : all cities with a population > 5000 or PPLA (ca 40.000)
   *   cities15000 : all cities with a population > 15000 or capitals (ca 20.000)
   */
  geonames.cities = {
    cities1000 : 'cities1000',
    cities5000 : 'cities5000',
    cities15000 : 'cities15000'
  };

  //init
  geonames._username = config.geoNamesUsername || 'noam3127';
  geonames._endpoint = config.geoNamesEndpoint || 'http://api.geonames.org';
  geonames._language = config.language || 'en';
  //geonames._country = config.country || 'US';
  geonames._charset = config.charset || 'UTF-8';
  // geonames._postCodeDefaults = {
  //   country :  geonames._country,
  //   maxRows :  5,
  //   charset : geonames._charset,
  //   username : geonames._username,
  //   lang : geonames._language
  // };
};
router.get('/nearby', function(req, res, next) {
  var qs = _.extend({
    //country :  geonames._country,
    maxRows :  20,
    charset : geonames._charset,
    username : geonames._username,
    style : geonames.style.long,
    cities : geonames.cities.cities1000,
    lang : geonames._language
  },
  {
    lat : options.lat,
    lng : options.lng,
    radius : options.radius,
    cities : options.cities,
    localCountry : options.localCountry,
    style : options.style
  });

  var url = '/findNearbyPlaceNameJSON';

  request({
    qs : qs,
    url : geonames._endpoint + url,
    json : true
  }, function(err, res, body){
    if (err) {
      callback(error, null);
    }
    callback(null, body.geonames || []);
  });
});

module.exports = router;