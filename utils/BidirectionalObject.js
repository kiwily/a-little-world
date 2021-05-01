class BidirectionalObject {
  constructor(object) {
    this.object = object;
    this.reverseObject = undefined;
    this.reverseObject = this.valuesToKeys() || undefined;
  }

  keysToValues() {
    return this.object
  };

  valuesToKeys() {
    if (this.reverseObject !== undefined) {
      return this.reverseObject;
    };
    this.reverseObject = Object.keys(this.object).reduce((object, key) => {
      object[this.object[key]] = key;
      return object;
    }, {});
    return this.reverseObject;
  };

  update(object) {
    this.object = object;
    this.reverseObject = undefined;
    this.reverseObject = this.valuesToKeys() || undefined;
  };
};


exports.BidirectionalObject = BidirectionalObject;
