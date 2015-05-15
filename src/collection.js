(function () {
  'use strict';

  $collection.$inject = ['$http'];

  function $collection($http) {

    var CollectionFactory = function (path, resource, key) {
      function Collection(data) {
        shallowClearAndCopy(data || {}, this);
      }

      Collection.get = function() {
        return $http.get(path).then(function (response) {
          return new Collection(response.data);
        });
      }

      return Collection;
    };

    return CollectionFactory;
  }

  /**
   * Create a shallow copy of an object and clear other fields from the destination.
   * Borrowed from angular-resource
   * https://github.com/angular/angular.js/blob/master/src/ngResource/resource.js
   */
  function shallowClearAndCopy(src, dst) {
    dst = dst || {};

    angular.forEach(dst, function(value, key) {
      delete dst[key];
    });

    for (var key in src) {
      if (src.hasOwnProperty(key) && key !== '_embedded' && key !== '_links') {
        dst[key] = src[key];
      }
    }

    return dst;
  }

  angular.module('$collection', ['ngResource'])
    .factory('$collection', $collection);

})();
