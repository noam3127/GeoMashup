'use strict';

angular.module('geoAggregatorApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

  })
  .constant('urls', {
    WIKIPEDIA_BASE: "http://api.geonames.org/wikipediaSearch?"

  });