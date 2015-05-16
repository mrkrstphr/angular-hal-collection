describe('$collection', function () {
  beforeEach(module('$collection'));

  beforeEach(inject(function ($collection) {
    this.$collection = $collection;
    this.collection = new $collection();

    function myResource() {}
    this.resource = myResource;
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
      var collection = this.$collection('/foo', this.resource, 'foos');
      var instance = new collection({_embedded: {foos: [{id: 1}, {id: 2}]}});

      expect(instance.items.length).toBe(2);
      expect(instance.items[0].constructor.name).toBe('myResource');
    });

    it('should return an empty array when there are no resources', function () {
      var collection = this.$collection('/foo', this.resource, 'foos');
      var instance = new collection({});

      expect(instance.items).toEqual([]);
    });
  });

  describe('.links', function () {
    it('should return the provided _links', function () {
      var collection = this.$collection('/foo', this.resource, 'foos');
      var instance = new collection({_links: {self: {href: '/self'}}});

      expect(instance.links.hasOwnProperty('self')).toBe(true);
      expect(instance.links.self.href).toBe('/self');
    });

    it('should return an empty array when there are no links', function () {
      var collection = this.$collection('/foo', this.resource, 'foos');
      var instance = new collection({});

      expect(instance.links).toEqual([]);
    });
  });

  describe('.hasLink()', function () {
    it('should return true if the link is present', function () {
      var collection = this.$collection('/foo', this.resource, 'foos');
      var instance = new collection({_links: {self: {href: '/self'}}});

      expect(instance.hasLink('self')).toBe(true);
    });

    it('should return false if the link is not present', function () {
      var collection = this.$collection('/foo', this.resource, 'foos');
      var instance = new collection({});

      expect(instance.hasLink('self')).toBe(false);
    });
  });

  describe('.getLink()', function () {
    it('should return the href if the link is present', function () {
      var collection = this.$collection('/foo', this.resource, 'foos');
      var instance = new collection({_links: {self: {href: '/self'}}});

      expect(instance.getLink('self')).toBe('/self');
    });

    it('should return false if the link is not present', function () {
      var collection = this.$collection('/foo', this.resource, 'foos');
      var instance = new collection({});

      expect(instance.hasLink('self')).toBe(false);
    });
  });

  describe('.get()', function () {
    beforeEach(inject(function (_$httpBackend_) {
      this.$httpBackend = _$httpBackend_;
    }));

    it('should make an HTTP request for the resource and return a new collection', function () {
      this.$httpBackend.expectGET('/foos').respond({});
      var collection = this.$collection('/foos', this.resource, 'foos');

      collection.get().then(function (newCollection) {
        expect(newCollection.prototype.constructor.name).toBe('Collection');
      });
    });
  });

  describe('.hasMore()', function () {
    it('should return true if there is a "next" link', function () {
      var instance = new (this.$collection())({_links: {next: {href: '/foos/1'}}});
      expect(instance.hasMore()).toBe(true);
    });

    it('should return false if there is not a "next" link', function () {
      var instance = new (this.$collection())({});
      expect(instance.hasMore()).toBe(false);
    });
  });

  describe('.paginate()', function () {
    beforeEach(inject(function (_$httpBackend_) {
      this.$httpBackend = _$httpBackend_;
    }));

    it('should make an HTTP request for the next page', function () {
      this.$httpBackend.expectGET('/foos/1').respond({});
      var instance = new (this.$collection())({_links: {next: {href: '/foos/1'}}});

      instance.paginate().then(function (newCollection) {
        expect(newCollection.prototype.constructor.name).toBe('Collection');
      });
    });
  });
});
