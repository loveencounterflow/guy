

# A Guy of Many Trades


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Structure](#structure)
- [Modules](#modules)
  - [`guy.props`: Define Properties](#guyprops-define-properties)
  - [`guy.async`: Asynchronous Helpers](#guyasync-asynchronous-helpers)
  - [`guy.nowait`: De-Asyncify JS Async Functions](#guynowait-de-asyncify-js-async-functions)
- [`guy.cfg`: Instance Configuration Helper](#guycfg-instance-configuration-helper)
  - [`guy.process`: Process-Related Utilities](#guyprocess-process-related-utilities)
  - [Usage Examples](#usage-examples)
    - [Most Minimal (Bordering Useless)](#most-minimal-bordering-useless)
    - [More Typical](#more-typical)
- [`guy.lft`: Freezing Objects](#guylft-freezing-objects)
- [`guy.obj`: Common Operations on Objects](#guyobj-common-operations-on-objects)
- [To Do](#to-do)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Structure

* Only Peer-Dependencies (except `cnd`, `intertype`)
* Sub-libraries accessible as `guy.${library_name}`
* Most sub-libraries implemented using `guy.props.def_oneoff()`, therefore dependencies (which are declared
  peer dependencies) will only be `require()`d when needed.

## Modules

### `guy.props`: Define Properties

* **`guy.props.def: ( target, name, cfg ) ->`** is just another name for `Object.defineProperty()`.

* **`guy.props.def_oneoff: ()`**


### `guy.async`: Asynchronous Helpers

* **`guy.async.defer: ( f ) ->`**—equivalent to `setImmediate f`

* **`guy.async.after: ( dts, f ) ->`**—equivalent to `setTimeout f, dts * 1000`. Observe that Δt must be
  given in seconds (not milliseconds).

* **`guy.async.sleep: ( dts ) ->`**—`await sleep 1` will resume after one second.


### `guy.nowait`: De-Asyncify JS Async Functions

**Peer Dependencies**: [`abbr/deasync`](https://github.com/abbr/deasync)

* **`guy.nowait.for_callbackable: ( fn_with_callback ) ->`**—given an asynchronous function `afc` that
  accepts a NodeJS-style callback (as in `afc v1, v2, ..., ( error, result ) -> ...`), returns a synchronous
  function `sf` that can be used without a callback (as in `result = sf v1, v2, ...`).

* **`guy.nowait.for_awaitable: ( fn_with_promise ) ->`**—given an asynchronous function `afp` that can be
  used with `await` (as in `result = await afp v1, v2, ...`) returns a synchronous function `f` that can be
  used without `await` (as in `result = sf v1, v2, ...`).

## `guy.cfg`: Instance Configuration Helper

* **`guy.cfg.configure_with_types: ( self, cfg = null, types = null ) => ...`**—Given a class instance
  `self`, an optional `cfg` object and an optional
  [Intertype](https://github.com/loveencounterflow/intertype)-like `types` instance,

  * set `clasz` to `self.constructor` for conciseness;
  * derive effective `cfg` from defaults (where `clasz.C.defaults.constructor_cfg` is set) and
    argument `cfg`;
  * make `cfg` a frozen instance property.
  * Procure `types` where not given and
  * make it a non-enumerable instance property.
  * Now call class method `clasz.declare_types()` with `self`;
  * in `declare_types()`, clients are encouraged to declare type `constructor_cfg` and validate `self.cfg`;
  * further, other types may be declared as appropriate; since those types have access to `self.cfg`, their
    definition may depend on those parameters.
  * The return value of `clasz.declare_types()` is discarded; clients that want to provide their own must
    pass it as third argument to `configure_with_types()`.
  * It is always possible to declare or import `types` on the client's module level and pass in that object
    to `configure_with_types()`; this will avoid (most of) the overhead of per-instance computations and use
    the same `types` object for all instances (which should be good enough for most cases).
  * One thing to avoid though is to declare types on the module level, then pass that types object to
    `configure_with_types()` to add custom types at instantiation time. Doing so would share the same
    `types` object between instances *and* modify it for each new instance, which is almost never what you
    want. Either declare one constant types object for all instances or else build a new bespoke types
    object for each instance from scratch.

### `guy.process`: Process-Related Utilities

**Peer Dependencies**: [`sindresorhus/exit-hook`](https://github.com/sindresorhus/exit-hook)

* **`guy.process.on_exit: ( fn ) => ...`**—call `fn()` before process exits. Convenience link for
  [`sindresorhus/exit-hook`](https://github.com/sindresorhus/exit-hook), which see for details. **Note**
  When installing this peer dependency, make sure to do so with the last CommonJS version added, as in `npm
  install exit-hook@2.2.1`.

### Usage Examples

#### Most Minimal (Bordering Useless)

It is allowable to call `configure_with_types()` with an instance of whatever class.
`guy.cfg.configure_with_types()` will look for properties `clasz.C.defaults`, `clasz.declare_types()` (and a
`types` object as third argument to `configure_with_types()`) and provide defaults where missing:

```coffee
class Ex
  constructor: ( cfg ) ->
    guy.cfg.configure_with_types @, cfg
#.........................................................................................................
ex1 = new Ex()
ex2 = new Ex { foo: 42, }
#.........................................................................................................
log ex1                         # Ex { cfg: {} }
log ex1.cfg                     # {}
log ex2                         # Ex { cfg: { foo: 42 } }
log ex2.cfg                     # { foo: 42 }
log ex1.types is ex2.types      # false
log type_of ex1.types.validate  # function
```

#### More Typical

```coffee
class Ex

  @C: guy.lft.freeze
    foo:      'foo-constant'
    bar:      'bar-constant'
    defaults:
      constructor_cfg:
        foo:      'foo-default'
        bar:      'bar-default'

  @declare_types: ( self ) ->
    self.types.declare 'constructor_cfg', tests:
      "@isa.object x":                    ( x ) -> @isa.object x
      "x.foo in [ 'foo-default', 42, ]":  ( x ) -> x.foo in [ 'foo-default', 42, ]
      "x.bar is 'bar-default'":           ( x ) -> x.bar is 'bar-default'
    self.types.validate.constructor_cfg self.cfg
    return null

  constructor: ( cfg ) ->
    guy.cfg.configure_with_types @, cfg
    return undefined

#.......................................................................................................
ex = new Ex { foo: 42, }
log ex                          # Ex { cfg: { foo: 42, bar: 'bar-default' } }
log ex.cfg                      # { foo: 42, bar: 'bar-default' }
log ex.constructor.C            # { foo: 'foo-constant', bar: 'bar-constant', defaults: { constructor_cfg: { foo: 'foo-default', bar: 'bar-default' } } }
log ex.constructor.C?.defaults  # { constructor_cfg: { foo: 'foo-default', bar: 'bar-default' } }
```


## `guy.lft`: Freezing Objects

`guy.left.freeze()` and `guy.lft.lets()` provide access to the epynomous methods in
[`letsfreezethat`](https://github.com/loveencounterflow/letsfreezethat). `freeze()` is basically
`Object.freeze()` for nested objects, while `d = lets d, ( d ) -> mutate d` provides a handy way to mutate
and re-assign a copy of a frozen object. See [the
documentation](https://github.com/loveencounterflow/letsfreezethat) for details.

## `guy.obj`: Common Operations on Objects

* **`guy.obj.pick_with_fallback = ( d, fallback, keys... ) ->`**—Given an object `d`, a `fallback` value and
  some `keys`, return an object that whose `keys` are the ones passed in, and whose values are either the
  same as found in `d`, or `fallback` in case a key is missing in `d` or set to `undefined`. If `d[ key ]`
  is `null`, it will be replaced by `fallback`. When no keys are given, an empty object will be returned.

* **`guy.obj.nullify_undefined = ( d ) ->`**—Given an object `d`, return a copy of it where all `undefined`
  values are replaced with `null`. In case `d` is `null` or `undefined`, an empty object will be returned.

* **`guy.obj.omit_nullish = ( d ) ->`**—Given an object `d`, return a copy of it where all `undefined` and
  `null` values are not set. In case `d` is `null` or `undefined`, an empty object will be returned.

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
* **[–]** `guy.fs.walk_lines()`: allow to configure; make `trimEnd()` the default
