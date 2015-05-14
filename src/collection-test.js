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
  });
});
