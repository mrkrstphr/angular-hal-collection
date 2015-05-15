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
