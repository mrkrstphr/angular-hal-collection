describe('$collection', function () {
  beforeEach(module('$collection'));

  beforeEach(inject(function ($collection) {
    this.$collection = $collection;
    this.collection = new $collection();
  }));

  describe('construction', function () {
    it('should return an instance of Collection', function () {
      var collection = this.$collection({});
      expect(collection.prototype.constructor.name).toBe('Collection');
    });

    it('should copy the data passed to the object to the object itself', function () {
      var instance = new this.collection({foo: 'bar'});
      expect(instance.foo).toBe('bar')
    });

    it('should not directly copy _links', function () {
      var instance = new this.collection({_links: {self: {href: 'foo'}}});
      expect(instance._links).toBeUndefined();
    });

    it('should not directly copy _embedded', function () {
      var instance = new this.collection({_embedded: {}});
      expect(instance._embedded).toBeUndefined();
    });
  });

  describe('.items', function () {
    it('should transform an _embedded collection into an array of resources', function () {
      function myResource() {}

      var collection = this.$collection('/foo', myResource, 'foos');
      var instance = new collection({_embedded: {foos: [{id: 1}, {id: 2}]}});

      expect(instance.items.length).toBe(2);
      expect(instance.items[0].constructor.name).toBe('myResource');
    });

    it('should return an empty array when there are no resources', function () {
      function myResource() {}

      var collection = this.$collection('/foo', myResource, 'foos');
      var instance = new collection({});

      expect(instance.items).toEqual([]);
    });
  });

  describe('.links', function () {
    it('should return the provided _links', function () {
      function myResource() {}

      var collection = this.$collection('/foo', myResource, 'foos');
      var instance = new collection({_links: {self: {href: '/self'}}});

      expect(instance.links.hasOwnProperty('self')).toBe(true);
      expect(instance.links.self.href).toBe('/self');
    });

    it('should return an empty array when there are no links', function () {
      function myResource() {}

      var collection = this.$collection('/foo', myResource, 'foos');
      var instance = new collection({});

      expect(instance.links).toEqual([]);
    });
  });

  describe('.get()', function () {
    beforeEach(inject(function (_$httpBackend_) {
      this.$httpBackend = _$httpBackend_;
    }));

    it('should make an HTTP request for the resource and return a new collection', function () {
      function myResource() {}

      this.$httpBackend.expectGET('/foos').respond({});
      this.collection = this.$collection('/foos', myResource, 'foos');

      this.collection.get().then(function (newCollection) {
        expect(newCollection.prototype.constructor.name).toBe('Collection');
      });
    });
  });
});
