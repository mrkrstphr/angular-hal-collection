(function () {
  'use strict';

  $collection.$inject = ['$http'];

  function $collection($http) {

    var CollectionFactory = function (path, resource) {
      function Collection() {
      }

      Collection.get = function() {
        return $http.get(path).then(function (response) {
          return response.data.map(function (element) {
            return new resource(element);
          });
        });
      }

      return Collection;
    };

    return CollectionFactory;
  }

  angular.module('$collection', ['ngResource'])
    .factory('$collection', $collection);

})();
