import { module, test } from 'ember-qunit';
import EmberObject from '@ember/object';

module('polyfill', function() {
  module('native classes', function() {
    test('it works with class fields', function(assert) {
      class Foo extends EmberObject {
        first = 'rob';
        last = 'jackson';
      }

      let foo = Foo.create({ first: 'tom', last: 'dale' });

      assert.equal(foo.first, 'tom');
      assert.equal(foo.last, 'dale');
    });

    test('init is after constructor', function(assert) {
      let calls = [];

      class Foo extends EmberObject {
        constructor() {
          calls.push('foo before constructor');
          super(...arguments);
          calls.push('foo after constructor');
        }

        init() {
          calls.push('foo before init');
          super.init(...arguments);
          calls.push('foo after init');
        }
      }

      class Bar extends Foo {
        constructor() {
          calls.push('bar before constructor');
          super(...arguments);
          calls.push('bar after constructor');
        }

        init() {
          calls.push('bar before init');
          super.init(...arguments);
          calls.push('bar after init');
        }
      }

      Bar.create();

      assert.deepEqual(calls, [
        'bar before constructor',
        'foo before constructor',
        'foo after constructor',
        'bar after constructor',
        'bar before init',
        'foo before init',
        'foo after init',
        'bar after init',
      ]);
    });
  });

  module('ember object model', function() {
    test('it works with class properties', function(assert) {
      const Foo = EmberObject.extend({
        first: 'rob',
        last: 'jackson',
      });

      let foo = Foo.create({ first: 'tom', last: 'dale' });

      assert.equal(foo.first, 'tom');
      assert.equal(foo.last, 'dale');
    });
  });

  test('init still works', function(assert) {
    let calls = [];

    const Foo = EmberObject.extend({
      init() {
        calls.push('foo before init');
        this._super(...arguments);
        calls.push('foo after init');
      },
    });

    const Bar = Foo.extend({
      init() {
        calls.push('bar before init');
        this._super(...arguments);
        calls.push('bar after init');
      },
    });

    Bar.create();

    assert.deepEqual(calls, [
      'bar before init',
      'foo before init',
      'foo after init',
      'bar after init',
    ]);
  });
});
