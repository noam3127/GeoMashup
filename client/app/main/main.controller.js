'use strict';

angular.module('geoAggregatorApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$timeout', 'APIService', 'uiGmapGoogleMapApi', 'uiGmapIsReady',
   function ($scope, $rootScope, $timeout, APIService, uiGmapGoogleMapApi, uiGmapIsReady) {
      $scope.showDropdown = false;
      var startCoords = {
        latitude: 40,
        longitude: -74
      };
      $scope.map = {
        center: startCoords,
        zoom: 10,
        control: {},
        events: {
          tilesloaded: function(map) {
            $scope.$apply(function () {

            });
          },
          idle: function(map) {
            var bounds = map.getBounds();
            getPanoramio(bounds);
            getFlickr(bounds);
          }
        }
      };

      var markerIcons = {
        flickr: '/assets/marker-icons/flickr_marker.png'
      };

      $scope.markers = [];
      var originMarker = {};
      originMarker.idKey = "originMarker";
      originMarker.coords = startCoords;
      originMarker.options = {
        draggable: false,
        labelContent: "lat: " + originMarker.coords.latitude + ' lon: '+ originMarker.coords.longitude,
        labelAnchor: '100 0',
        labelClass: 'marker-labels'
      };
      //$scope.markers.push(originMarker);

      var setMarkers = function(type, items) {
        var marker = {}, markerGroup = {};
        console.log('set markers', items);
        markerGroup.name = type;
        markerGroup.markers = [];
        items.forEach(function(item) {
          marker = {};
          marker.id = item.id;
          marker.coords = {
            latitude: item.latitude || item.coords.latitude,
            longitude: item.longitude || item.coords.longitude
          };
          marker.options = {
            draggable: false,
            labelContent: item.title,
            labelAnchor: '100 0',
            labelClass: 'marker-label'
          };
          marker.icon = markerIcons[type];
          markerGroup.markers.push(marker);
        });
        $scope.markers.push(markerGroup);
      };

      $scope.query = '';
      $scope.wikiPlaces = [];

      $scope.getData = function() {
        console.log($scope.query);
        APIService.getWikiPlaces($scope.query)
          .success(function(data) {
            $scope.hasResults = true;

            data.geonames.forEach(function(place) {
              place.coords = {latitude: place.lat, longitude: place.lng};
              place.id = place.geoNameId || place.title;
            });

            $scope.wikiPlaces = data.geonames;
            setMarkers('wikipedia', data.geonames);
            if (!data.geonames.length) return null;
            $scope.map.zoom = 13;
            $scope.map.center = $scope.wikiPlaces[0].coords;
          });

        // APIService.getFlickr($scope.query)
        //   .success(function(data) {
        //     console.log(data);
        //   })
        //   .error(function(e) {
        //     console.error('error', e);
        //   });
        console.log(APIService);

        APIService.getFlickrPlaces($scope.query)
          .success(function(data) {
            console.log(data);
            $scope.showDropdown = true;
            $scope.flickrPlaces = data.places.place;

          })
          .error(function(e) {
            console.error(e);
          });

      };

      var getPanoramio = function(bounds) {
        var SW = bounds.getSouthWest();
        var NE = bounds.getNorthEast();
        APIService.getPanoramioPhotos(SW.lng(), SW.lat(), NE.lng(), NE.lat())
          .then(function(data) {
            console.log('PAN', data);
            $scope.panoramioPhotos = data.data.photos;
          });
      };

      var getFlickr = function(bounds) {
        var SW = bounds.getSouthWest();
        var NE = bounds.getNorthEast();
        APIService.getFlickrPhotos(SW.lng(), SW.lat(), NE.lng(), NE.lat())
          .success(function(data) {
            console.log(data);
            $scope.flickrThumbs = [];
            $scope.flickrThumbs = _.map(data.photos.photo, function(photo, i) {
              var thumb = 'http://farm'+ photo.farm +'.static.flickr.com/'+ photo.server +'/'+ photo.id +'_'+ photo.secret +'_s.jpg';
              data.photos.photo[i].thumb = thumb
              return thumb;
            });
            setMarkers('flickr', data.photos.photo);
          })
          .error(function(e) {
            console.error(e);
          });
      };

      uiGmapGoogleMapApi.then(function(maps) {
        uiGmapIsReady.promise(1).then(function(instances) {
          //var map1 = $scope.map.control.getGMap();
          var map = instances[0].map;
          console.log('initialMap2', map.getBounds());
          var bounds = map.getBounds();
          $scope.map.bounds = bounds;
          var NE = bounds.getNorthEast();
          var SW = bounds.getSouthWest();
          var uuid = map.uiGmap_id;
        });
      });

      $scope.active = 'wikipedia';
  }]);
