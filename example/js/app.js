(function () {
  'use strict';

  PlayerResource.$inject = ['$resource'];

  function PlayerResource($resource) {
    return $resource();
  }

  PlayerCollection.$inject = ['$collection', 'Player'];

  function PlayerCollection($collection, Player) {
    return $collection('first.json', Player, 'players');
  }

  angular.module('sample.resources', ['ngResource', '$collection'])
    .factory('Player', PlayerResource)
    .factory('PlayerCollection', PlayerCollection);

  PlayersController.$inject = ['PlayerCollection'];

  var collection;

  function PlayersController(PlayerCollection) {
    this.players = [];
    this.total = 0;

    var that = this;

    PlayerCollection.get().then(function (players) {
      that.players = players.items;
      that.total = players.total;

      collection = players;
    });
  }

  PlayersController.prototype.hasMore = function () {
    return collection && collection.hasMore();
  };

  PlayersController.prototype.paginate = function () {
    if (this.hasMore()) {
      var that = this;

      collection.paginate().then(function (players) {
        that.players = that.players.concat(players.items);
        collection = players;
      });
    }
  };

  angular.module('sample.players', ['sample.resources'])
    .controller('PlayersController', PlayersController);

  moduleConfig.$inject = ['$routeProvider'];

  function moduleConfig($routeProvider) {
    $routeProvider.when('/', {
      controller: 'PlayersController',
      controllerAs: 'vm',
      templateUrl: 'players.html'
    });
  }

  angular.module('sample', ['ngRoute', 'sample.players'])
    .config(moduleConfig);

})();
