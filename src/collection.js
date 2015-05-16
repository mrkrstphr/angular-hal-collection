(function () {
  'use strict';

  $collection.$inject = ['$http'];

  function $collection($http) {

    var defaults = {
      previous: 'prev',
      next: 'next'
    };

    var CollectionFactory = function (path, resource, key, config) {
      // "private" variables
      var items;
      var links;

      config = mergeObjects(defaults, config);

      // "private" methods
      function retrieve(href) {
        return $http.get(href).then(function (response) {
          return new Collection(response.data);
        });
      }

      function Collection(data) {
        shallowClearAndCopy(data || {}, this);

        var embeddedData = data.hasOwnProperty('_embedded') && data._embedded.hasOwnProperty(key) ?
          data._embedded[key] : [];

        items = embeddedData.map(function (item) {
          return new resource(item);
        });

        links = data.hasOwnProperty('_links') ? data._links : [];
      }

      Object.defineProperties(Collection.prototype, {
        items: {
          get: function () {
            return items;
          }
        },
        links: {
          get: function () {
            return links;
          }
        }
      });

      Collection.get = function() {
        return retrieve(path);
      };

      Collection.prototype.hasLink = function (name) {
        return name in links && 'href' in links[name];
      };

      Collection.prototype.getLink = function (name) {
        if (this.hasLink(name)) {
          return links[name].href;
        }
      };

      Collection.prototype.hasPrevious = function () {
        return this.hasLink(config.previous);
      };

      Collection.prototype.hasNext = function () {
        return this.hasLink(config.next);
      };

      Collection.prototype.previous = function () {
        if (this.hasPrevious()) {
          return retrieve(this.getLink(config.previous));
        }
      };

      Collection.prototype.next = function () {
        if (this.hasNext()) {
          return retrieve(this.getLink(config.next));
        }
      };

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

  function mergeObjects(uno, dos) {
    var copy = {};

    var merge = function (obj) {
      for (var key in obj) {
        copy[key] = obj[key];
      }
    };

    merge(uno);
    merge(dos);

    return copy;
  }

  angular.module('hal-collection', ['ngResource'])
    .factory('$collection', $collection);

})();
