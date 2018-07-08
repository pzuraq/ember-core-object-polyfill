function _assert() {
  (_emberDebug || _emberMetal).assert.apply(this, arguments);
}

function _detectActionHandler(obj) {
  (_action_handler || _emberRuntimeMixinsAction_handler).default.detect(obj)
}

function initialize(obj, properties) {
  var m = (0, _emberMetal.meta)(obj);

  if (properties !== undefined) {
    (true && !(typeof properties === 'object' && properties !== null) && (0, _assert)('EmberObject.create only accepts objects.', typeof properties === 'object' && properties !== null));
    (true && !(!(properties instanceof _emberMetal.Mixin)) && (0, _assert)('EmberObject.create no longer supports mixing in other ' + 'definitions, use .extend & .create separately instead.', !(properties instanceof _emberMetal.Mixin)));


    var concatenatedProperties = obj.concatenatedProperties;
    var mergedProperties = obj.mergedProperties;
    var hasConcatenatedProps = concatenatedProperties !== undefined && concatenatedProperties.length > 0;
    var hasMergedProps = mergedProperties !== undefined && mergedProperties.length > 0;

    var keyNames = Object.keys(properties);

    for (var i = 0; i < keyNames.length; i++) {
      var keyName = keyNames[i];
      var value = properties[keyName];

      if (_emberMetal.detectBinding(keyName)) {
        m.writeBindings(keyName, value);
      }

      (true && !(!(value instanceof _emberMetal.ComputedProperty)) && (0, _assert)('EmberObject.create no longer supports defining computed ' + 'properties. Define computed properties using extend() or reopen() ' + 'before calling create().', !(value instanceof _emberMetal.ComputedProperty)));
      (true && !(!(typeof value === 'function' && value.toString().indexOf('._super') !== -1)) && (0, _assert)('EmberObject.create no longer supports defining methods that call _super.', !(typeof value === 'function' && value.toString().indexOf('._super') !== -1)));
      (true && !(!(keyName === 'actions' && _detectActionHandler(obj))) && (0, _assert)('`actions` must be provided at extend time, not at create time, ' + 'when Ember.ActionHandler is used (i.e. views, controllers & routes).', !(keyName === 'actions' && _detectActionHandler(obj))));


      var baseValue = obj[keyName];
      var isDescriptor = baseValue !== null && typeof baseValue === 'object' && baseValue.isDescriptor;

      if (hasConcatenatedProps && concatenatedProperties.indexOf(keyName) > -1) {
        if (baseValue) {
          value = (0, _emberUtils.makeArray)(baseValue).concat(value);
        } else {
          value = (0, _emberUtils.makeArray)(value);
        }
      }

      if (hasMergedProps && mergedProperties.indexOf(keyName) > -1) {
        value = (0, _emberUtils.assign)({}, baseValue, value);
      }

      if (isDescriptor) {
        baseValue.set(obj, keyName, value);
      } else if (typeof obj.setUnknownProperty === 'function' && !(keyName in obj)) {
        obj.setUnknownProperty(keyName, value);
      } else {
        if (true) {
          (0, _emberMetal.defineProperty)(obj, keyName, null, value);
        } else {
          obj[keyName] = value;
        }
      }
    }
  }

  _emberMetal.Mixin.finishPartial(obj, m);

  obj.init(properties);

  obj[POST_INIT]();

  m.proto = obj.constructor.prototype;
  (0, _emberMetal.finishChains)(m);
  (0, _emberMetal.sendEvent)(obj, 'init', undefined, undefined, undefined, m);
}

function flattenProps() {
  var concatenatedProperties = this.concatenatedProperties,
      mergedProperties = this.mergedProperties;

  var hasConcatenatedProps = concatenatedProperties !== undefined && concatenatedProperties.length > 0;
  var hasMergedProps = mergedProperties !== undefined && mergedProperties.length > 0;

  var initProperties = {};

  for (var _len2 = arguments.length, props = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    props[_key2] = arguments[_key2];
  }

  for (var i = 0; i < props.length; i++) {
    var properties = props[i];

    (true && !(!(properties instanceof _emberMetal.Mixin)) && (0, _assert)('EmberObject.create no longer supports mixing in other ' + 'definitions, use .extend & .create separately instead.', !(properties instanceof _emberMetal.Mixin)));


    var keyNames = Object.keys(properties);

    for (var j = 0, k = keyNames.length; j < k; j++) {
      var keyName = keyNames[j];
      var value = properties[keyName];

      if (hasConcatenatedProps && concatenatedProperties.indexOf(keyName) > -1) {
        var baseValue = initProperties[keyName];

        if (baseValue) {
          value = (0, _emberUtils.makeArray)(baseValue).concat(value);
        } else {
          value = (0, _emberUtils.makeArray)(value);
        }
      }

      if (hasMergedProps && mergedProperties.indexOf(keyName) > -1) {
        var _baseValue = initProperties[keyName];

        value = (0, _emberUtils.assign)({}, _baseValue, value);
      }

      initProperties[keyName] = value;
    }
  }

  return initProperties;
}
