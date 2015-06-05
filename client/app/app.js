'use strict';

angular.module('geoAggregatorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'uiGmapgoogle-maps'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, uiGmapGoogleMapApiProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);

    uiGmapGoogleMapApiProvider.configure({
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });

    $.material.init();
  });
