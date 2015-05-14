(function () {
  'use strict';

  $collection.$inject = ['$http'];

  function $collection($http) {

    var CollectionFactory = function (path, resource) {
      function Collection() {
      }

      return Collection;
    };

    return CollectionFactory;
  }

  angular.module('$collection', ['ngResource'])
    .factory('$collection', $collection);

})();
