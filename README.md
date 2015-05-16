# angular-hal-collection

![Build Status](https://img.shields.io/travis/mrkrstphr/angular-hal-collection.svg?style=flat-square)
![Latest Version](https://img.shields.io/npm/v/angular-hal-collection.svg?style=flat-square)
![License: MIT](https://img.shields.io/npm/l/angular-hal-collection.svg?style=flat-square)
![Gluten Free](https://img.shields.io/badge/gluten-free-brightgreen.svg?style=flat-square)

Angular HAL Collection provides for interacting with [HAL](http://stateless.co/hal_specification.html)
collections in AngularJS.

## Installation

Use your preferred package manager:

```bash
npm install --save angular-hal-collection
```

Or:

```bash
bower install --save angular-hal-collection
```

## Usage

Once installed, a `$collection` module is available for usage:

```js
angular.module('sample', ['hal-collection']);
```

The `hal-collection` module comes with a `$collection` factory for creating collections.

### Options

The following options can be passed as the fourth argument to `$collection()`:

 * **previous**: The name of the link for the previous page of items in the collection
 * **next**: The name of the link for the next page of items in the collection

Example:

```js
$collection('/api/players', Player, 'players', {previous: 'back', next: 'forward'});
```

Will work for a result matching:

```json
{
  "_links": {
    "previous": {"href": "/players?page=1"},
    "next": {"href": "/players?page=3"}
  },
  "_embedded": {
    "players": []
  }
}
```

### Defining Collections

The `$collection()` factory expects three arguments:

 * **URL**: The path to load this collection from the server
 * **Resource**: The resource to instantiate for each item in the collection
 * **Key**: The key where the collection is stored within the `_embedded` section of a response
 * **Options**: An optional object of options. See Options.

Example:

```js
function PlayerCollection($collection, Player) {
  return $collection('/api/players', Player, 'players');
}
```

### Using Collections

A non-instance collection contains a simple `.get()` method to retrieve data:

```js
playerCollection.get().then(function (collection) {
  // ...
});
```

The returned promise involves an instantiated collection populated with the response from the provided
URL.

#### Getting Items from the Collection

The instantiated collection provides an `.items` property to access the items of the collection:

```js
playerCollection.get().then(function (collection) {
  $scope.collection = collection;
  $scope.players = collection.items;
});
```

Each item will be an instantiated instace of the Resource given when the `$collection` factory was configured.

#### Miscellaneous Data

Miscellaneous data in the collection (data not stored in `_embedded` nor `_links`) can be accessed directly on
the collection:

```html
<p>
  Showing {{collection.count}} of {{collection.total}} players.
</p>
```

#### Links

Hyperpmedia links can be detected and accessed through two convenience methods:

 * **.hasLink(name)** Returns true if the collection has a link named `name`
 * **.getLink(name)** If the collection has a link named `name`, returns the `href` for that link

#### Paginating

The collection provides four methods related to pagination:

 * **.hasPrevious()**: Returns true if there is a `prev` link on the collection, and false otherwise.
 * **.hasNext()**: Returns true if there is a `next` link on the collection, and false otherwise.
 * **.previous()**: Returns a promise resolving a new collection with the previous results, if `.hasPrevious()` is true.
Returns `undefined` otherwise.
 * **.next()**: Returns a promise resolving a new collection with the next results, if `.hasNext()` is true. Returns
`undefined` otherwise.

Note: the `prev` and `next` link names can be overridden by the options mentioned above.

```js
// infinite scrolling style pagination:
$scope.collection.next().then(function (collection) {
  $scope.collection = collection;
  $scope.players = $scope.players.concat(collection.items);
});
```

## Tests

The tests can be run from the project directory:

```bash
npm run test
```

## Contributing

Contributions are welcome! See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## License

angular-hal-collection is released under the MIT License (MIT). See [LICENSE](LICENSE.md) for more information.
