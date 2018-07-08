create = function create(props, extra) {
  var C = this;
  var instance = new C();

  if (extra === undefined) {
    initialize(instance, props);
  } else {
    initialize(instance, flattenProps.apply(this, arguments));
  }

  return instance;
}
