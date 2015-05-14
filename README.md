# angular-hal-collection

![Build Status](https://img.shields.io/travis/mrkrstphr/angular-hal-collection.svg?style=flat-square)
![Latest Version](https://img.shields.io/npm/v/angular-hal-collection.svg?style=flat-square)
![License: MIT](https://img.shields.io/npm/l/angular-hal-collection.svg?style=flat-square)
![Gluten Free](https://img.shields.io/badge/gluten-free-brightgreen.svg?style=flat-square)

Angular HAL Collection provides for interacting with [HAL](http://stateless.co/hal_specification.html)
collections in AngularJS.

## Defining Collections

The following code defines a module, `me.resource`, which has a resource factory defined, `User`, and a collection
`UsersCollection`.

A `$collection` is created using the URL for the collection endpoint, as well as the resource object to instantiate
each item with.

```js
// collections.js
(function () {
  'use strict';

  angular.module('me.resource', ['ng-resource', '$collection']);

})();

(function () {
  'use strict';

  UserFactory.$inject = ['$resource'];

  function UserFactory($resource) {
    return $resource('http://api.dev/users/:id');
  }

  angular.module('me.resource')
    .factory('User', UserFactory);

})();

// users.collection.js
(function () {
  'use strict';

  UsersCollection.$inject = ['$collection', 'User'];

  function UsersCollection($collection, User) {
    return $collection('http://api.dev/users', User);
  }

  angular.module('me.resource.collections')
    .factory('UsersCollection', UsersCollection);

})();
```

## Using Collections

The following example shows how to use the `UsersCollection` defined above. A controller is created, and injected
with the resolved collection, using the collection's `.get()` method. The data is then passed off to the template.

The controller has a `.paginate()` method, which calls the collection's `.paginate()` method if the collection's
`.hasMore()` method returns true. The results are updated in scope and rendered in the template.

The template utilizes [ng-infinite-scroll](http://binarymuse.github.io/ngInfiniteScroll/) to trigger the `.paginate()`
method.

```js
// users.js
(function () {
  'use strict';

  resolveUsers.$inject = ['UsersCollection'];

  function resolveUsers(UsersCollection) {
    return UsersCollection.get();
  }

  moduleConfig.$inject = ['$routeProvider'];

  function moduleConfig($routeProvider) {
    $routeProvider.when('/users', {
      controller: 'UsersController',
      controllerAs: 'vm',
      templateUrl: 'users/users.html',
      resolve: {
        usersCollection: resolveUsers
      }
    })
  }

  angular.module('me.users', ['ngRoute', 'me.resource.collections'])
    .config(moduleConfig);

})();

// users.controller.js
(function () {
  'use strict';

  UsersController.$inject = ['usersCollection'];

  var collection;

  function UsersController(usersCollection) {
    collection = usersCollection;
    this.users = usersCollection.items;
  }

  UsersController.prototype.paginate = function () {
    if (collection.hasMore()) {
      var that = this;

      collection.paginate.then(function () {
        that.users = collection.items;
      });
    }
  };

  angular.module('me.users')
    .controller('UsersController', UsersController);

})();
```

The template utilizes [ng-infinite-scroll](http://binarymuse.github.io/ngInfiniteScroll/) to trigger the `.paginate()`
method.

```html
<div class="users-container" infinite-scroll="vm.paginate()" infinite-scroll-distance="3">
  <ul class="users">
    <li data-ng-repeat="users in vm.users">
      {{user.name.first}} {{user.name.last}} - {{user.email}}
    </li>
  </ul>
</div>
```

You can see this entire example in action [on plunker](#).
