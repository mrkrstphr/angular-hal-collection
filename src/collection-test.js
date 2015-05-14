describe('$collection', function () {
  beforeEach(module('$collection'));

  beforeEach(inject(function ($collection) {
    this.$collection = $collection;
  }));

  describe('construction', function () {
    it('should return an instance of Collection', function () {
      var collection = this.$collection('foo');
      expect(collection.prototype.constructor.name).toBe('Collection');
    });

    it('should copy the data passed to the object to the object itself', function () {
      var collection = this.$collection('foo');
      var instance = new collection({foo: 'bar'});
      expect(instance.foo).toBe('bar')
    });
  });

  describe('.get()', function () {
    beforeEach(inject(function (_$httpBackend_) {
      this.$httpBackend = _$httpBackend_;
    }));

    it('should make an HTTP request and transform the results into a resource', function () {
      function myResource() {}

      var collection = this.$collection('foo', myResource);

      this.$httpBackend.expectGET('foo').respond([{}, {}]);

      collection.get().then(function (data) {
        expect(data.length).toBe(2);
        data.forEach(function (datum) {
          expect(datum.constructor.name).toBe('myResource');
        });
      });

      this.$httpBackend.flush();
    });
  });
});
