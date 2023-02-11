

# 🛠 A Guy of Many Trades 🛠


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [🛠 A Guy of Many Trades 🛠](#%F0%9F%9B%A0-a-guy-of-many-trades-%F0%9F%9B%A0)
  - [Structure](#structure)
  - [Modules](#modules)
    - [`GUY.props`: Common Operations on Object Properties](#guyprops-common-operations-on-object-properties)
      - [`GUY.props.keys()`](#guypropskeys)
      - [`GUY.props.tree()`](#guypropstree)
      - [Class for Strict Ownership](#class-for-strict-ownership)
        - [Special Keys](#special-keys)
    - [`GUY.async`: Asynchronous Helpers](#guyasync-asynchronous-helpers)
    - [`GUY.nowait`: De-Asyncify JS Async Functions](#guynowait-de-asyncify-js-async-functions)
    - [`GUY.process`: Process-Related Utilities](#guyprocess-process-related-utilities)
    - [`GUY.lft`: Freezing Objects](#guylft-freezing-objects)
    - [`GUY.fs.walk_lines()`, `GUY.str.walk_lines()` and `GUY.fs.walk_buffers()`](#guyfswalk_lines-guystrwalk_lines-and-guyfswalk_buffers)
    - [`GUY.fs`: File-Related Stuff](#guyfs-file-related-stuff)
    - [`GUY.src`: JS Source Code Analysis](#guysrc-js-source-code-analysis)
      - [`GUY.trm`](#guytrm)
      - [`GUY.sets`](#guysets)
      - [`GUY.str`](#guystr)
      - [`GUY.samesame`](#guysamesame)
      - [`GUY.rnd`](#guyrnd)
      - [`GUY.temp`](#guytemp)
      - [`GUY.datetime`](#guydatetime)
  - [To Do](#to-do)
  - [Is Done](#is-done)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 🛠 A Guy of Many Trades 🛠

## Structure

* Only Peer-Dependencies (except `cnd`, `intertype`)
* Sub-libraries accessible as `GUY.${library_name}`
* Most sub-libraries implemented using `GUY.props.def_oneoff()`, therefore dependencies (which are declared
  peer dependencies) will only be `require()`d when needed.

## Modules

### `GUY.props`: Common Operations on Object Properties

* **`GUY.props.def: ( target, name, cfg ) ->`** is just another name for `Object.defineProperty()`.

* **`GUY.props.hide: ( object, name, value ) ->`** is a shortcut to define a non-enumerable property as in
  `Object.defineProperty object, name, { enumerable: false, value, }`.

* **`GUY.props.xray: ( owner, host ) ->`**—A little bit the inverse to `GUY.props.hide()`, it will return an
  object with all key/value pairs set that were found on `owner` after applying `GUY.props.keys owner, {
  hidden: true, symbols: true, builtins: false, }`. When `host` is set, that value will be used to store the
  key/value pairs in, possibly overwriting existing keys. This method is useful for printing and debugging
  objects with non-enumerable and/or symbol keys.

* **`GUY.props.def_oneoff: ()`**

* **`GUY.props.pick_with_fallback = ( d, fallback, keys... ) ->`**—Given an object `d`, a `fallback` value and
  some `keys`, return an object that whose `keys` are the ones passed in, and whose values are either the
  same as found in `d`, or `fallback` in case a key is missing in `d` or set to `undefined`. If `d[ key ]`
  is `null`, it will be replaced by `fallback`. When no keys are given, an empty object will be returned.

* **`GUY.props.nullify_undefined = ( d ) ->`**—Given an object `d`, return a copy of it where all `undefined`
  values are replaced with `null`. In case `d` is `null` or `undefined`, an empty object will be returned.

* **`GUY.props.omit_nullish = ( d ) ->`**—Given an object `d`, return a copy of it where all `undefined` and
  `null` values are not set. In case `d` is `null` or `undefined`, an empty object will be returned.

* **`GUY.props.nonull_assign = ( first, others... ) ->`**—Given one or more objects, return what `{
  first..., other_0..., 0ther_1..., ... }` would return after removing all `null` and `undefined` attributes
  from all the `other` values, i.e. `Object.assign {}, first, ( @omit_nullish other for other in others
  )...`. This method is useful if you have an object with default values and want to derive settings by
  passing in settings where `null` and `undefined` mean 'unset', 'don't care'.

* **`GUY.props.crossmerge = ( cfg ) ->`**—Given an object `keys` and an object `values`, return a new object
  whose keys come from the former and whose values come fom the latter. Should there be a key in `keys` that
  is not set in `values`, an error will be thrown unless `fallback` has been set (to any value, inlcuding
  `undefined`). This method calls `GUY.props.keys()` and will accept the `cfg` settings used there
  (`allow_any`, `symbols`, `builtins`, `hidden`, `depth`).

* **`GUY.props.has = ( x, key ) ->`**—Given any value `x`, return whether the value has a given property
  (`key`). This is a safe version of `Reflect.has()` that never throws an error. Like direct property access
  (using `x.key` or `x[ 'key' ]`) but unlike `Object.getOwnPropertyDescriptor()` &c, `GUY.props.has()` looks
  into the prototype chain; like `Object.getOwnPropertyDescriptor()`, it does not trigger property getters.

* **`GUY.props.get = ( x, key, fallback ) ->`**—Given any value `x`, return the value of property named in
  `key`. If that property is missing, throw an error, but when `fallback` has been given, return `fallback`
  instead. Using `GUY.props.get x, 'foo'` is like saying `x.foo` or `x[ 'foo' ]` except that it doesn't
  tolerate missing property keys; using it with a fallback as in `GUY.props.get x, 'foo', undefined` is like
  saying `x.foo` or `x[ 'foo' ]` except that it also works for `null` and `undefined`.

Using `GUY.props.has()` and `GUY.props.get()` it is always possible to circumvent errors being thrown and
instead do value-based error handling (and raise one own's errors where seen fit). One pattern to do so is
to define a private Symbol instead of relying on `undefined` that could have been caused by all kinds of
circumstances. Here's a real-life example; it was created in a context where instances of the `Strict_owner`
class (for which see below) are prevalent (i.e. those objects will throw an error instead of returning
`undefined` as is the standard in JS). This function will return the `length` of a value `x` where that
attribute is present (as in strings and arrays), or else its `size` where that is present (as in sets and
maps), else it will return `fallback` where given, or resort to throwing an error:

```coffee
notavalue = Symbol 'notavalue'
size_of = ( x, fallback = misfit ) ->
  return R unless ( R = GUY.props.get x, 'length',  notavalue ) is notavalue
  return R unless ( R = GUY.props.get x, 'size',    notavalue ) is notavalue
  return fallback unless fallback is misfit
  throw new Error "expected an object with `x.length` or `x.size`, got a #{typeof x} with neither"
```

* **`GUY.props.resolve_property_chain = ( owner, property_chain ) ->`**—Given an `owner` value (typically an
  object) and a `property_chain` as a list of names, repeatedly apply the names, first against the owner,
  then the next name against that result and so on. This allows one to programmatically resolve chained
  property access and to parametrize a literal `owner.first.second.other.last` as
  `GUY.props.resolve_property_chain owner, [ 'first', 'second', 'other', 'last', ]`.

* **`GUY.props._shallow_copy = ( d ) ->`**—Given object `d`, return a shallow copy of it using the technique
  demonstrated in the [MDN documentation for
  `Object.getOwnPropertyDescriptors()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors#creating_a_shallow_copy):
  `( d ) -> Object.create ( Object.getPrototypeOf d ), ( Object.getOwnPropertyDescriptors d )`. This method
  is not yet official part of the API because it may get an extension to work transparently with primitive
  values.

#### `GUY.props.keys()`

* **`GUY.props.keys: () =>`**—Like `Object.keys( t )`, `Reflect.ownKeys( t )` (which is equivalent to
  `Object.getOwnPropertyNames( target ).concat(Object.getOwnPropertySymbols( target ))`) but more versatile
* `GUY.props.keys()` can retrieve or skip non-enumerable (a.k.a. 'hidden') keys
* `GUY.props.keys()` can retrieve only own keys (with `{ depth: 0 }`) or descend into the prototype chain
  for any number of steps: `{ depth: null, }` (the default, equivalent to `{ depth: Infinity, }`) will
  descend into the prototype chain or e.g. `{ depth: 1, }`
* `GUY.props.keys()` can retrieve string keys as well as symbol keys with `{ symbols: true, }`
* `GUY.props.keys()` works for all JS values, including `null` and `undefined` when `{ allow_any: true, }`
  is set (the default)
* `GUY.props.keys()` can retrieve hidden (i.e. non-enumerable) keys with `{ hidden: true, }`
* `GUY.props.keys()` can retrieve builtins with `{ builtins: true, }`; observe that since builtins are
  always hidden, `{ builtins: true, hidden: false, }` makes no sense and causes a validation error.


```coffee
lst = [ 'x', ]
( Object.keys lst    )
# [ '0', ]

( ( k for k of lst ) )
# [ '0', ]

( GUY.props.keys lst )
# [ '0', ]

( GUY.props.keys lst, { symbols: true, builtins: true, } )

# [ '0', 'length', 'constructor', 'concat', 'copyWithin', 'fill', 'find', 'findIndex', 'lastIndexOf',
# 'pop', 'push', 'reverse', 'shift', 'unshift', 'slice', 'sort', 'splice', 'includes', 'indexOf', 'join',
# 'keys', 'entries', 'values', 'forEach', 'filter', 'flat', 'flatMap', 'map', 'every', 'some', 'reduce',
# 'reduceRight', 'toLocaleString', 'toString', 'at', 'findLast', 'findLastIndex', Symbol.iterator,
# Symbol.unscopables, '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__',
# '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf', '__proto__' ]

( GUY.props.keys Array, { symbols: true, builtins: true, } )

# [ 'length', 'name', 'prototype', 'isArray', 'from', 'of', Symbol.species, 'arguments', 'caller',
# 'constructor', 'apply', 'bind', 'call', 'toString', Symbol.hasInstance, '__defineGetter__',
# '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf',
# 'propertyIsEnumerable', 'valueOf', '__proto__', 'toLocaleString' ]
```

#### `GUY.props.tree()`

`GUY.props.tree()` is the logical dual to `GUY.props.keys()`: instead of descending into the prototype
chain, `tree()` climbs through the key/value pairs attached to an object and, recursively, through the trees
of each value's key/value pairs. In default mode, the method returns a list of lists of names ('paths'):

```coffee
log           = console.log
{ inspect, }  = require 'util'
d = { a: [ 0, 1, 2, ], e: { g: { some: 'thing', }, h: 42, h: null, }, empty: {}, }
for path in GUY.props.tree d
  log inspect path
```

This will print:

```coffee
[ 'a' ]
[ 'a', '0' ]
[ 'a', '1' ]
[ 'a', '2' ]
[ 'e' ]
[ 'e', 'g' ]
[ 'e', 'g', 'some' ]
[ 'e', 'h' ]
[ 'empty' ]
```

The default configuration for the `tree()` method is `{ allow_any: true, symbols: false, builtins: false,
hidden: false, depth: null, evaluate: null, sep: null, }`, with the last two settings being specific to
`tree()`, and the first five having the same meaning as for `GUY.props.keys()`, q.v.

To turn the result into a list of strings, pass in a property `sep`:

```coffee
...
for path in GUY.props.tree d, { sep: '.', }
...

'a'
'a.0'
'a.1'
'a.2'
'e'
'e.g'
'e.g.some'
'e.h'
'empty'
```

The `evaluate` setting can be set to a function which will be called with an object `{ owner, key, value, }`
where `owner` is the current object being iterated over, and `key`/`value` the current property name and
value. The evaluate function should return `true`, `false`, or a string that may contain the words `take`
and/or `descend`; the default (when no `evaluate` function is given) is `take,descend`, meaning all keys
will be both included in the list as well as descended into. `true` is equivalent to `take,descend`; `false`
means skip this property altogether. In the below example, we use the `evaluate` setting to avoid descending
into arrays and to include only the tips (leaves, endpoints) of the tree:

```coffee
evaluate = ({ owner, key, value, }) ->
  return 'take' if Array.isArray value
  return 'take' unless GUY.props.has_keys value
  return 'descend'
...
for path in GUY.props.tree d, { evaluate, sep: '.', }
...

'a'
'e.g.some'
'e.h'
'empty'
```

#### Class for Strict Ownership

JavaScript is famously forgiving when it comes to accessing non-existing object properties. However this
lenience is also conducive to silent failure. `Strict_owner` is an ES6 class that aims to provide users with
a convenient mechanism to produce object that throw an error when a non-existing property is being accessed.

When you extend your class with `GUY.props.Strict_owner`, instance of your class will now throw an error
when a non-existing property is accessed.

**Note** Most often one will want to define a class that extends `Strict_owner`, however, it is also
possible to pass in an arbitrary object—including a function—as property `target` to the constructor, e.g.

```coffee
f = ( x ) -> x * 2
x = new GUY.props.Strict_owner { target: f, }
```

> **Note** As of Guy v6, special methods `get()` and `set()` have been removed from `Strict_owner`. They
> have been replaced with a much cleaner and more correct implementation as `GUY.props.get()` and
> `GUY.props.has()`. These methods are more versatile, too, since they can be used with *any* JS value
> (including the always-problematic `null` and `undefined`).

> **Note** `GUY.props.Strict_owner` is implemented using an ES6
> [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). While
> proxies are powerfool tools [they're also notoriously hard to get
> right](https://github.com/nodejs/node/issues/21639) because of the many methods one could/should/must
> implement and which all have to act in mutually consistent ways. As a result, my personal recommendation
> here is to try hard *not* use a proxy and use another methodology to achieve a workable solution where
> possible. One thing that will probably not work is proxying a proxy: When you have a `Strict_owner` object
> (which already is a proxy) and wrap it in another proxy, chances are you'll get errors like `instance does
> not have property '0'` when attempting to use `node:util.inspect()` on that instance. I have been so far
> unable to fix that bug and since been looking for a solution that works without the need for a double
> proxy in that other codebase.

In order to get an object which is sealed and or frozen, use properties `seal` and `freeze`, respectively:

```coffee
d   = { x: 42, }
dso = new GUY.props.Strict_owner { target: d, seal: true, freeze: true, }

# this works:
dso.x                 # 42

# but none of these work:

# Strict owner ship means unknown properties cannot be accessed:
dso.y                 # Strict_owner instance does not have property 'y'

# Properties of a frozen object cannot be re-assigned:
dso.x = 48            # TypeError: Cannot assign to read only property 'x'

# Properties cannot be added to a sealed object (also implied by being frozen):
dso.y = 'something'   # TypeError: Cannot define property y, object is not extensible
```

In addition, when property `oneshot` is set (and neither `seal` nor `freeze`), properties can be set *once*,
but not get re-assigned. In case non-re-assignable values should also be immutable, consider to set frozen
objects:

```coffee
d         = { x: 42, }
dso       = new GUY.props.Strict_owner { target: d, oneshot: true, }
dso.xy    = new GUY.props.Strict_owner { target: { foo: 'bar', }, freeze: true, }
# dso.x     = 123     # Strict_owner instance already has property 'x'
# dso.xy    = {}      # Strict_owner instance already has property 'xy'
# dso.xy.foo  = 'gnu' # TypeError: Cannot assign to read only property 'foo'
```

Observe that because all of the sealing, freezing and one-shot business is performed on the proxy, not on
the target object, we can still manipulate that one:

```coffee
debug '^35345^', dso  # { x: 42, xy: { foo: 'bar' } }
debug '^35345^', d    # { x: 42, xy: { foo: 'bar' } }

# we *can* still manipulate the underlying object:
d.x = 123
debug '^35345^', dso  # { x: 123, xy: { foo: 'bar' } }
debug '^35345^', d    # { x: 123, xy: { foo: 'bar' } }
```

It is possible to lift the strict behavior of `Strict_owner` instances by using `Strict_owner.set_locked
false` and resume strict behavior with `Strict_owner.set_locked true`.

##### Special Keys

* `return "#{instance.constructor.name}" if key is Symbol.toStringTag`
* `return target.constructor         if key is 'constructor'`
* `return target.toString            if key is 'toString'`
* `return target.call                if key is 'call'`
* `return target.apply               if key is 'apply'`
* `return target[ Symbol.iterator  ] if key is Symbol.iterator`
* `return target[ node_inspect     ] if key is node_inspect`
* `return target[ 0                ] if key is '0'`


### `GUY.async`: Asynchronous Helpers

These 'five letter' methods are convenience methods in the sense that they are very thin shims over the
somewhat less convenient JavaScript methods. For many people, the most strightforward way to understand what
these methods do will be to read the very simple definitions:

* `every: ( dts, f ) ->                         setInterval f,    dts * 1000`
* `after: ( dts, f ) ->                         setTimeout  f,    dts * 1000`
* `cease: ( toutid ) -> clearTimeout toutid`
* `sleep: ( dts    ) -> new Promise ( done ) => setTimeout  done, dts * 1000`
* `defer: ( f = -> ) -> await sleep 0; return await f()`

In each case, `dts` denotes an interval (delta time) measured in *seconds* (not milliseconds) and `f`
denotes a function. `every()` and `after()` return so-called timeout IDs (`toutid`s), i.e. values that are
recognized by `cease()` (`clearTimeout()`, `clearInterval()`) to stop a one-off or repetetive timed function
call. `sleep()` returns a promise that should be awaited as in `await sleep 3`, which will allow another
task on the event loop to return and resume execution no sooner than after 3000 milliseconds have elapsed.
Finally, there is `defer()`, which should also be `await`ed. It is a special use-case of `sleep()` where the
timeout is set to zero, so the remaining effect is that other tasks on the event loop get a chance to run.
It accepts an optional function argument whose (synchronous or asynchronous) result will be returned.

### `GUY.nowait`: De-Asyncify JS Async Functions

**Note** Due to ongoing issues when compiling the `deasync` module that this functionality
is implemented in, `guy-nowait`has been removed from this release.

<del>
**Peer Dependencies**: [`abbr/deasync`](https://github.com/abbr/deasync)

* **`GUY.nowait.for_callbackable: ( fn_with_callback ) ->`**—given an asynchronous function `afc` that
  accepts a NodeJS-style callback (as in `afc v1, v2, ..., ( error, result ) -> ...`), returns a synchronous
  function `sf` that can be used without a callback (as in `result = sf v1, v2, ...`).

* **`GUY.nowait.for_awaitable: ( fn_with_promise ) ->`**—given an asynchronous function `afp` that can be
  used with `await` (as in `result = await afp v1, v2, ...`) returns a synchronous function `f` that can be
  used without `await` (as in `result = sf v1, v2, ...`).
</del>


### `GUY.process`: Process-Related Utilities

**Peer Dependencies**: [`sindresorhus/exit-hook`](https://github.com/sindresorhus/exit-hook)

* **`GUY.process.on_exit: ( fn ) => ...`**—call `fn()` before process exits. Convenience link for
  [`sindresorhus/exit-hook`](https://github.com/sindresorhus/exit-hook), which see for details. **Note**
  When installing this peer dependency, make sure to do so with the last CommonJS version added, as in `npm
  install exit-hook@2.2.1`.


### `GUY.lft`: Freezing Objects

`GUY.left.freeze()` and `GUY.lft.lets()` provide access to the epynomous methods in
[`letsfreezethat`](https://github.com/loveencounterflow/letsfreezethat). `freeze()` is basically
`Object.freeze()` for nested objects, while `d = lets d, ( d ) -> mutate d` provides a handy way to mutate
and re-assign a copy of a frozen object. See [the
documentation](https://github.com/loveencounterflow/letsfreezethat) for details.

### `GUY.fs.walk_lines()`, `GUY.str.walk_lines()` and `GUY.fs.walk_buffers()`

* **`GUY.fs.walk_lines = ( path, cfg ) ->`**—Given a `path`, return a *synchronous* iterator over file
  lines. This is the most hassle-free approach to synchronously obtain lines of text files in NodeJS that
  I'm aware of, yet. The optional `cfg` argument may be an object with a single property `decode`; when set
  to `false`, `walk_lines()` will iterate over buffers instead of strings. Observe that currently the
  newline character is always assumed to be `\n` (i.e. U+00a0).

  **Behavior regarding terminal newline characters**: The following invariant shall hold:

  ```coffee
  FS            = require 'node:fs'
  file_content  = FS.readFileSync path, { encoding: 'utf-8', }
  lines_1       = file_content.split '\n'
  lines_2       = [ ( GUY.fs.walk_lines path )..., ]
  ( JSON.stringify lines_1 ) == ( JSON.stringify lines_2 )
  ```

  In other words, the lines iterated over by `GUY.fs.walk_lines()` are the same lines as would be obtained
  by splitting the file content using `String::split()`, meaning that
    * newline characters right before the end-of-file (EOF) will generate an additional, empty line (because
      `( '\n' ).split '\n'` gives `[ '', '', ]`)
    * an empty file will generate a single empty string (because `( '' ).split '\n'` gives `[ '', ]`)

* The newline character sequences recognized by `GUY.fs.walk_lines()` are
  * `\r` = U+000d Carriage Return (CR) (ancient Macs)
  * `\n` = U+000a Line Feed (LF) (Unix, Linux)
  * `\r\n` = U+000d U+00a0 Carriage Return followed by Line Feed (CRLF) (Windows)
  * i.e. a file containing only the characters `\r\r\n\r\n\n\n` will be parsed as `\r`, `\r\n`, `\r\n`,
    `\n`, `\n`, that is, as six empty lines, as two of the line feeds are pre-empted by the preceding
    carriage returns. This behavior is consistent with the text of the file being split as
    `'\r\r\n\r\n\n\n'.split /\r\n|\r|\n/`, which gives `[ '', '', '', '', '', '' ]`. This is, incidentally,
    also what `pico` and Sublime Text 4 (on Linux) and [Textpad
    8.15](https://www.textpad.com/download#TextPad8151) (on Wine under Linux) show, although Notepad (on
    Wine under Linux) thinks the file in question has only 5 lines.
* `GUY.str.walk_lines()` behaves like `GUY.fs.walk_lines()`, although it does not yield buffers (yet) amd
  has no way to set the chunk size
* both `GUY.str.walk_lines()` and `GUY.fs.walk_lines()` will return right-trimmed lines (i.e. remove
  whitespace from the end of the string) unless a setting `trim: false` is included as the second argument
  to the method (as in, `walk_lines path, { trim: false, }`). With `GUY.fs.walk_lines()`, trimming is only
  available if lines are decoded, so when one calls `walk_lines path, { trim: false, encoding: null, }` to
  get buffers, those will not be trimmed.

* **`GUY.fs.walk_buffers = ( path, cfg ) ->`**—Given a `path`, return a *synchronous* iterator over buffers
  representing the file contents, the invariant being that the concatenation of the buffers compares equal
  to reading the entire file in a single go:

  ```coffee
  ( Buffer.compare ( Buffer.concat [ ( GUY.fs.walk_buffers path )..., ] ), ( FS.readFileSync path ) ) == 0
  ```

  Where deemed necessary, `cfg.chunk_size` can be set to an arbitrary integer greater than 0 (default: 16
  KiB).

* **`GUY.fs.walk_lines_with_positions = ( path, cfg ) ->`** and <br> **`GUY.fs.walk_buffers_with_positions =
  ( path, cfg ) ->`**—Same as `GUY.fs.walk_lines()` `GUY.fs.walk_buffers()`, respectively, but yields
  objects of the shape `{ lnr, line, eol, }` where `lnr` is the 1-based line number, `line` is the (by
  default, when not requesting buffers) trimmed 'material' of the line (identical to what the `walk_lines()`
  methods yield), and `eol` represents the bytes or characters that were recognized as the line ending.
  `eol` may be a single `CR` (`\r`, U+000d), a single `LF` (`\n`, U+000a; standard on Linux), a two-byte
  `CRLF` (`\r\n`, standard on Windows), or an empty string or buffer (the latter only at the end of a string
  or file). None of these attributes will ever be `null`, so one can always reconstruct the entire file
  complete with positions indicated by line numbers, line-local or file-global [UTF-16 code unit
  indexes](https://mathiasbynens.be/notes/javascript-encoding), code point indexes or byte offsets, as seen
  appropriate.

### `GUY.fs`: File-Related Stuff

* **`GUY.fs.walk_circular_lines = ( path, cfg ) ->`**—Given a `path`, return an iterator over the lines in
  the referenced file; optionally, when the iterator is exhausted (all lines have been read), restart from
  the beginning. `cfg` may be an object with the keys:
  * **`loop_count`**—(cardinal; default: `1`) controls how many times to loop over the file. Set to
    `+Infinity` to allow for an unlimited number of laps.
  * **`line_count`**—(cardinal; default: `+Infinity`) controls the maximum number of lines that will be
    yielded.
  * The iteration will finish as soon as the one or the other limit has been reached.
  * By default, `GUY.fs.walk_circular_lines()` will act like `GUY.fs.walk_lines`.
  * The iterator will not yield anything when either `loop_count` or `line_count` are set to `0`.

* **`GUY.fs.get_content_hash = ( path, cfg ) ->`**—Given a `path`, return the
  hexadecimal `sha1` hash digest for its contents. On Linux, this uses `sha1sum`, and `shasum` on all 
  other systems.

### `GUY.src`: JS Source Code Analysis

> This submodule needs peer-dependencies, install them with
>
> `npm install acorn acorn-loose acorn-walk astring`
>
> or
>
> `pnpm add acorn acorn-loose acorn-walk astring`


* **`@STRICT_PARSER = require 'acorn'`**
* **`@LOOSE_PARSER = require 'acorn-loose'`**
* **`@AST_walk = require 'acorn-walk'`**
* **`@ASTRING = require 'astring'`**

* **`@parse = ( cfg ) =>`**—Given either a JS source `text` or a `function`, return an
  [ESTree-compliant](https://github.com/estree/estree) AST. Should an error occur and `fallback` is set to
  any value, that value will be returned; otherwise, the error will be thrown. The `use` parameter controls
  which parser is used and can take on the values `'strict'`, `'strict,loose'`, and `'loose'`. For many
  settings `'strict,loose'` will probably the right setting since the strict parser will balk already on
  unnamed function declarations that are not part of assignment, while the 'loose' parser happily (and
  correctly parses those). For this reason, the default setting is `use: 'strict,loose'`.

<!-- * **`@get_first_return_clause_text = ( callable ) =>`**—Given a callable `f` (a function-like object),
  return the re-generated source text for the first return statement found by `PARSER.parse f.toString()`.
 -->

* **`slug_node_from_simple_function = ( cfg ) =>`**—Same as `slug_from_simple_function()`, below, but
  returns an AST node representing the result. You can manipulate the node if you want it and then pass it
  to `GUY.src._generate()` to get it rendered as JS, but the result will slightly differ from what
  `slug_from_simple_function()` would return for the same input because that function does some
  post-processing on the source text to make it even terser.

* **`slug_from_simple_function = ( cfg ) =>`**—Given the same `cfg` object one would use for
  `GUY.src.parse()`, return a 'slug' (i.e. a condensed form) of its source text. This slug is defined to be
    * if function has no return: `undefined`
    * if function has single `return`: `argument` property of the `ReturnStatement` node
    * if function has several `return`s: <del>first</del><ins>last</ins> `BlockStatement` (i.e. the function
      body) (???)

Examples:

```
█ ( -> )
''

█ ( ( x ) -> 42 )
'42'

█ ( ( x ) -> ( not x? ) or ( @isa.object x ) or ( @isa.nonempty.text x ) )
'x == null || this.isa.object(x) || this.isa.nonempty.text(x)'

█ ( `function ( x ) { 42; }` )
'42;'

█ ( `function ( x ) { return 42; }` )
'42'

█ ( ( x ) -> if x? then true else false )
'if (x != null) { return true; } else { return false; }'

█ ( ( x ) -> ( not x? ) or ( @isa.object x ) or ( @isa.nonempty.text x ) )
'x == null || this.isa.object(x) || this.isa.nonempty.text(x)'

█ f3
'if (x > 0) { return true; } if (x < 0) { return false; } return null;'
```

#### `GUY.trm`

* Preview version, expect changes
* colorize terminal output
* two variants of `node:util.inspect()`: `GUY.trm.inspect()`, `GUY.trm.rpr()`
* standardized loggers: `alert()`, `debug()`, `help()`, `info()`, `plain()`, `praise()`, `urge()`, `warn()`,
  `whisper()`
* produce with `GUY.trm.get_loggers badge` where `badge` identifies your submodule
* includes short timestamp
* writer `GUY.trm.log()` writes undecorated stuff to `process.stderr()`
* writer `GUY.trm.echo()` writes undecorated stuff to `process.stdout()`
* all writers and loggers apply `GUY.trm.rpr` to each argument independently, so `echo a, b, c` is like
  `console.log ( rpr a ), ( rpr b ), ( rpr c )`
* writer `GUY.trm.pen()` returns string representation as used in `GUY.trm.log()` &c
* `GUY.trm.strip_ansi: ( text ) ->` uses RegEx from
  (chalk)[https://raw.githubusercontent.com/chalk/ansi-regex/main/index.js] to strip ANSI codes from a given
  string

#### `GUY.sets`

Operations on sets, copied / modelled on [*JavaScript for impatient programmers (ES2022 edition): Missing
Set operations*](https://exploringjs.com/impatient-js/ch_sets.html#missing-set-operations)

* **`unite:     ( P... ) ->`**—return the union of all sets passed in
* **`intersect: ( P... ) ->`**—return the intersection of all sets passed in
* **`subtract:  ( a, b ) ->`**—return the set of elements of set `a` except for those that are also in set
  `b`

#### `GUY.str`

* **`escape_for_regex: ( text ) ->`**—escape `text` so it can safely be used as a regex, with all
  meta-characters properly escaped.

* **`SQL`**—a [tag
  function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals?retiredLocale=de#tagged_templates)
  that can be used to mark string literals as SQL which can then be properly treated by text editors that
  support nested languages.

#### `GUY.samesame`

Contains two methods, `equals()` and `deep_copy()`, that are thought to be among the best and fastest
implementations for the purposes of deep equality checking and deep copying.

* **`@equals     = ( require 'util' ).isDeepStrictEqual`**
* **`@deep_copy  = ( require '../dependencies/rfdc-patched.js' )()`**
* **`@copy_regex = ( require '../dependencies/sindresorhus-clone-regexp.js' ).cloneRegExp`**

See also

  * [`jseq`](https://github.com/loveencounterflow/jseq) for an in-depth comparison of numerous alternatives
    to the present implementation of `GUY.samesame.equals()`.
  * [*2ality on `structuredClone()`*](https://2ality.com/2022/01/structured-clone.html) for some
    shortcomings of the new JS built-in `structuredClone()` (besides the insane naming decision).
  * [*`rfdc`: Really Fast Deep Clone*](https://github.com/davidmarkclements/rfdc) for the underlying
    implementation of `GUY.samesame.deep_copy()`.
  * [*`clone-regexp` by Sindre Sorhus*](https://github.com/sindresorhus/clone-regexp/blob/main/index.js) for
    the code added to `rfdc` to enable copying of RegExes.


#### `GUY.rnd`

* **`@_shuffle = ( list, ratio, rnd, random_integer ) ->`**
* **`@get_rnd = ( seed = 1, delta = 1 ) ->`**
* **`@get_rnd_int = ( seed = 1, delta = 1 ) ->`**
* **`@get_shuffle = ( seed_0 = 0, seed_1 = 1 ) ->`**
* **`@integer_from_normal_float = ( x, min = 0, max = 2 ) ->`**
* **`@random_integer = ( min = 0, max = 2 ) ->`**
* **`@random_number = ( min = 0, max = 1 ) ->`**
* **`@shuffle = ( list, ratio = 1 ) ->`**

#### `GUY.temp`

> This submodule needs peer-dependencies, install them with
>
> `npm install tmp`
>
> or
>
> `pnpm add tmp`

`GUY.temp` provides context handlers to work with temporary files and directories. It is built on top of
[`tmp`](https://github.com/raszi/node-tmp).

`GUY.temp.with_file: ( cfg, handler ) ->`
`GUY.temp.with_directory: ( cfg, handler ) ->`
`GUY.temp.create_directory: ( cfg ) ->`

**Note** refer to
[hengist](https://github.com/loveencounterflow/hengist/blob/master/dev/guy/src/temp.tests.coffee) to see how
to use these methods until docs are written; the below gives a rough idea:

```coffee

#-----------------------------------------------------------------------------------------------------------
@GUY_temp_context_handler_file = ( T, done ) ->
  GUY = require '../../../apps/guy'
  #.........................................................................................................
  do =>
    path = null
    info = GUY.temp.with_file ({ path: mypath, fd, }) ->
      path = mypath
      T?.ok isa.fs_file mypath
    T?.eq info, { files: 1, dirs: 0, }
    T?.ok not isa.fs_file path
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_temp_context_handler_directory = ( T, done ) ->
  GUY = require '../../../apps/guy'
  #.........................................................................................................
  do =>
    path = null
    info = GUY.temp.with_directory ({ path: mypath, }) ->
      path = mypath
      debug '^34534^', { path, }
      T?.ok isa.fs_directory mypath
    T?.eq info, { files: 0, dirs: 1, }
    T?.ok not isa.fs_directory path
  #.........................................................................................................
  do =>
    path = null
    info = GUY.temp.with_directory { prefix: 'whatever-', }, ({ path: mypath, }) ->
      path = mypath
      debug '^34534^', { path, }
      T?.ok ( PATH.basename mypath ).startsWith 'whatever-'
      T?.ok isa.fs_directory mypath
    T?.eq info, { files: 0, dirs: 1, }
    T?.ok not isa.fs_directory path
  #.........................................................................................................
  return done?()
```

`GUY.temp.create_directory()` will create a directory and return an object with two entries, `rm` and
`path`. `rm` is a function that, when called without arguments, will remove the directory whose location is
indicated by `path`. One way to ensure such a temporary directory will in fact be removed is to use
`GUY.process.on_exit()`, as in `GUY.process.on_exit -> warn "removing #{path}"; rm()`


#### `GUY.datetime`

> This submodule needs peer-dependencies, install them with
>
> `npm install dayjs`
>
> or
>
> `pnpm add dayjs`

`GUY.datetime` provides methods to obtain and convert timestamps.

* `isots`: ISO TimeStamp
* `srts`: Short, Readable TimeStamp

* **`@from_now = ( srts ) ->`**
* **`@now = ( cfg ) ->`**
* **`@srts_from_isots = ( isots ) ->`**
* **`@parse = ( srts ) ->`**
* **`@format = ( srts, P... ) ->`**
* **`@isots_from_srts = ( srts ) ->`**


## To Do

* **[–]** adopt `icql-dba/errors#Dba_error`:

  ```coffee
  class @Dba_error extends Error
    constructor: ( ref, message ) ->
      super()
      @message  = "#{ref} (#{@constructor.name}) #{message}"
      @ref      = ref
      return undefined
  ```
  * **[–]** might want to integrate code from https://github.com/creemama/utiljs/blob/master/packages/utiljs-errors/lib/RethrownError.js
    to enable re-throwing of errors w/out losing stack trace info.
  * also see https://github.com/joyent/node-verror
* **[–]** while `test @[ "nowait with async steampipes" ]` works in isolation, running the test suite hangs
  indefinitely.
* **[+]** <del>see whether [`n-readlines`]() may be replaced by a simpler, faster implementation as it does
  contain some infelicitous loops in
  [`_searchInBuffer`](https://github.com/nacholibre/node-readlines/blob/master/readlines.js#L33) that can
  probably be replaced by
  [`buffer.indexOf()`](https://nodejs.org/api/buffer.html#buffer_buf_indexof_value_byteoffset_encoding).
  Also, there's a similar implementation in
  [`intertext-splitlines`](https://github.com/loveencounterflow/intertext-splitlines).</del>
  <ins>[Benchmarks](https://github.com/loveencounterflow/hengist/blob/master/dev/guy/src/readlines.benchmarks.coffee)
  show that patched version with suitable chunk size performs OK; using patched version to avoid deprecation
  warning.</ins>
* **[–]** `GUY.fs.walk_lines()`: allow to configure; make `trimEnd()` the default

* implement easy way to collect, rediect `process.stdout`, `process.stderr`:

  ```coffee
  original_stderr_write = process.stderr.write.bind process.stderr
  collector = []
  process.stderr.write = ( x ) ->
    echo '^3453^', type_of x
    # FS.writeSync output_fd, x
    collector.push x
    original_stderr_write '^1234^ '
    original_stderr_write x
  echo "(echo) helo world"
  info "(info) helo world"
  info "whatever goes on here"
  warn CND.reverse "is collected"
  for x in collector
    process.stdout.write '^collector@4565^' + x
  ```

* **[–]** take over tabulation (as in `hengist/src/helpers`)
* **[–]** could the `SQL` string annotation / tagged literal function be syntactically extended to allow
  simpler interpolation of escaped names? Could we instantiate it with a dictionary of values?
<!-- * **[–]** `GUY.src.parse()`: rename `cfg.function` to sth more generic like `js` (?) -->
* **[–]** `GUY.src.get_first_return_clause_text()`:
  * **[–]** change input format to standard `cfg`-based to make compatible with call conventions for
    `GUY.src.parse()`
  * **[–]** use `fallback` argument to decide whether to return value or throw error in case of parsing
    failure (same for `parse()`)
  * **[–]** return based on how many `ReturnStatement`s are found:
    * if function has no return: `undefined`
    * if function has single `return`: `argument` property of the `ReturnStatement` node
    * if function has several `return`s: <del>first</del><ins>last</ins> `BlockStatement` (i.e. the function
      body) (???)
* **[–]** move `GUY.src._generate()` to public API
* **[–]** what should be the correct output for `GUY.src.slug_from_simple_function { function: ( -> ), }`?
  Currently it is the empty string which is not ideal
* **[–]** use
  [`Reflect.has()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
  to check for property availability for `Strict_owner`s instead of using instance method; provide as
  `GUY.props.has()`
* **[–]** likewise, use `GUY.props.get: ( target, name, fallback = misfit ) ->` instead of instance method
* **[–]** consider to move submodule `_builtins`, test for builtins to Intertype, backport to
  Intertype-legacy
* **[–]** consider to make `trm.log()` write to `stdout`, `err()` to `stderr`
* **[–]** implement `trm.write()` write to `stdout` without trailing newline (but formatting like `log()`)
* **[–]** consider to drop `trm.pen()`, use improved `GUY.trm.rpr()` instead
* **[–]** fix `GUY.props.get '', 'length'` (works for sets but not for string)s
* **[–]** consider to re-implement `deep_copy()` from `letsfreezethat` using `rfdc`
* **[–]** remove dependencies as far as possible, make GUY run in browser

  ```coffee
  LOUPE         = require '../deps/loupe.js'
  @rpr          = rpr = ( x ) => LOUPE.inspect x, { customInspect: false, }
  @xrpr         = ( x ) -> ( rpr x )[ .. 1024 ]
  ```
* **[–]** modify behavior of `GUY.props.tree()`:
  * **[–]** callbacks are `take_key()`, `descend_value()`, `filter_path()`
  * **[–]** `take_key: ( owner, key, value ) ->`
  * **[–]** `descend_value: ( owner, key, value ) ->`
  * **[–]** `filter_path: ( owner, path ) ->`; path will be list of strings w/out `sep`, single string with it
  * **[+]** implement `GUY.props.walk_tree()`
* **[–]** modify behavior of `GUY.trm.rpr()`:
  * **[–]** colorize for readablity
  * **[–]** change signature to either `rpr x, cfg` or `rpr P...`
  * **[–]** in either case, provide a way to pass configuration to `node:util.inspect`
  * **[–]** allow indented output
* **[–]** implement method that allows to name a type and give a cfg object, returns cfg for named typed
  based on `crossmatch()`ing defaults for that type with given `cfg`
* **[–]** `GUY.trm.warn()`, `alert()`: collect and re-issue on process exit; may want to throw error or at
  least issue non-zero error code when messages beyond (configurable) urgency threshold were issued; this
  will allow apps to not bail out prematurely on minor issues and keep messages from getting hidden in
  regular messages
* **[–]** turn `Strict_owner` instances into sealed objects, retaining old behavior in new class
  `Strict_getter`
* **[–]** turn `GUY`, submodules into `Strict_owner` instances
* **[–]** move deep freezing, deep sealing from `lft` to `props`?
* **[–]** concerning `Strict_owner`: in
  [`hengist/dev/intertype/_ng.test.coffee`](https://github.com/loveencounterflow/hengist/commit/b16acfcf57b2868849d74afc5073c632fb9eccbf#diff-fa6070699391fb27bafd4df9db13ee8288be4399d939863b689f8a6c711ef3c3R1378)
  we have found a way to build custom-named functions with strict ownership:

  ```coffee
  @_demo_type_cfgs_as_funmctions_2 = ->
    class Intertype
      create_type_cfg: ( cfg ) ->
        defaults  = { extras: true, collection: false, type: null, }
        cfg       = { defaults..., cfg..., }
        name      = cfg.type
        R         = ( ( x ) -> x ** 2 ).bind @
        Object.defineProperty R, 'name', { value: name, }
        R[ k ]    = v for k, v of cfg
        R         = new GUY.props.Strict_owner target: R
        Object.seal R
        # R         = GUY.lft.freeze R1 = R # <== doesn't freeze???
        Object.freeze R                     # <== works as expected
        return R
    types = new Intertype()
    urge '^982-1^', f = types.create_type_cfg { type: 'foobar', }
    # Object is frozen, sealed, and has a strict `get()`ter:
    urge '^982-2^', Object.isFrozen f
    urge '^982-3^', Object.isSealed f
    try f.collection = true catch error then warn rvr error.message # Cannot assign to read only property 'collection' of function 'function () { [native code] }'
    try f.xxx               catch error then warn rvr error.message # ^guy.props.Strict_owner@1^ Strict_owner instance does not have property 'xxx'
    try f.xxx = 111         catch error then warn rvr error.message # Cannot define property xxx, object is not extensible
    info '^982-4^', f.name
    info '^982-5^', f 42
    return null
  ```

  This should lead to the following:
  * **[–]** fix the apparent bug that `GUY.lft.freeze()` does not freeze a function
  * **[–]** an extension of `GUY.props.Strict_owner`:
    * **[+]** incorporate (deep?) `seal`ing (next to `freeze`ing)
    * **[–]** allow to pass in a 'deep target' such that properties not found on the immediate target (the
      named function in the above) will also be searched in the deep target (such as the `Intertype` or
      `Dbay` instance), mimicking a prototype chain

* **[–]** integrate pinned package versions helper, cf `( require 'mixa/lib/check-package-versions' )
  require '../pinned-package-versions.json'`
* **[–]** documentation for `temp`
* **[–]** implement line walker for strings, analoguous to `GUY.fs.walk_lines()`:
  ```coffee
  #.........................................................................................................
  walk_lines = ( text ) ->
    validate.text text
    pattern       = /.*?(\n|$)/suy
    last_position = text.length - 1
    loop
      break if pattern.lastIndex > last_position
      unless ( match = text.match pattern )?
        debug '^3234^', text[ pattern.lastIndex .. ]
        break
      yield match[ 0 ]
    R = walk_lines()
    R.reset = -> pattern.lastIndex = 0
    return R
  #.........................................................................................................
  md_lexer  = new_toy_md_lexer 'md'
  parser    = new_toy_parser()
  lines     = probe.split /\n+/us
  #.........................................................................................................
  debug '^79-1^'
  debug '^79-1^', rpr line for line from walk_lines probe
  debug '^79-1^', rpr line for line from walk_lines probe + '\n'
  debug '^79-1^', rpr line for line from walk_lines probe + '\n\n'
  ```
* **[–]** `GUY.fs.walk_lines()`, `GUY.str.walk_lines()`: implement option to add custom suffix to each line
  such as (most frequently) `\n` to help in line-wise lexing
* **[–]** implement option to track global position in `GUY.*.walk_lines()`, including skipped newline
  characters
* **[–]** possible / useful to implement `step` / `walk` / `run` API for `fs.walk_lines()`,
  `str.walk_lines()`?

## Is Done

* **[+]** make choice between parsers configurable:
  * only `acorn`
  * first `acorn`, upon parse error `acorn-loose`
  * only `acorn-loose`
* **[+]** `parse()`: use `fallback` argument to decide whether to return value or throw error in case of
  parsing failure
* **[+]** testing for a key without inadvertantly retrieving its value is surprisingly involved in JS.
  Re-implement `GUY.props.has()`
  * (1) using `Reflect.has()` catching `TypeError: Reflect.has called on non-object`, and
    `Object.getPrototypeOf()`, or
  * (2) using attribute access `x[ key ]`, discarding value and catching errors from strict owners, `null`
    and `undefined`.
  * option (2) *should* be faster, maybe just live with the fact that attribute checking *without* value
    retrieval is not very viable in JS
  * depending on favorable benchmarks, may want to cache whether instances of a given type are collections
    with a size and if so, which property (`length` or `size`) is used
  [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone); benchmarks
* **[+]** rename `GUY.props.has_keys()` -> `GUY.props.has_any_keys()`
* **[+]** replace peer-dependency [`temp`](https://github.com/bruce/node-temp) with
  [`tmp`](https://github.com/raszi/node-tmp) as the former has global state (see
  [`node-temp#98`](https://github.com/bruce/node-temp/issues/98))
* **[+]** make `temp` context handlers work with async functions
* **[+]** consider to use promise with `after`, as in
  `after  = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000`
* **[+]** make line walkers work with different EOL standards inlcuding `\n\r`, `\r`




