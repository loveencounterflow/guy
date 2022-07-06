

# 🛠 A Guy of Many Trades 🛠


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [🛠 A Guy of Many Trades 🛠](#%F0%9F%9B%A0-a-guy-of-many-trades-%F0%9F%9B%A0)
  - [Structure](#structure)
  - [Modules](#modules)
    - [`GUY.props`: Common Operations on Object Properties](#guyprops-common-operations-on-object-properties)
      - [Class for Strict Ownership](#class-for-strict-ownership)
    - [`GUY.async`: Asynchronous Helpers](#guyasync-asynchronous-helpers)
    - [`GUY.nowait`: De-Asyncify JS Async Functions](#guynowait-de-asyncify-js-async-functions)
    - [`GUY.process`: Process-Related Utilities](#guyprocess-process-related-utilities)
    - [`GUY.cfg`: Instance Configuration Helper](#guycfg-instance-configuration-helper)
      - [Usage Examples](#usage-examples)
        - [Most Minimal (Bordering Useless)](#most-minimal-bordering-useless)
        - [More Typical](#more-typical)
    - [`GUY.lft`: Freezing Objects](#guylft-freezing-objects)
    - [`GUY.fs`: File-Related Stuff](#guyfs-file-related-stuff)
    - [`GUY.src`: JS Source Code Analysis](#guysrc-js-source-code-analysis)
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

* **`GUY.props.def_oneoff: ()`**

* **`GUY.props.pick_with_fallback = ( d, fallback, keys... ) ->`**—Given an object `d`, a `fallback` value and
  some `keys`, return an object that whose `keys` are the ones passed in, and whose values are either the
  same as found in `d`, or `fallback` in case a key is missing in `d` or set to `undefined`. If `d[ key ]`
  is `null`, it will be replaced by `fallback`. When no keys are given, an empty object will be returned.

* **`GUY.props.nullify_undefined = ( d ) ->`**—Given an object `d`, return a copy of it where all `undefined`
  values are replaced with `null`. In case `d` is `null` or `undefined`, an empty object will be returned.

* **`GUY.props.omit_nullish = ( d ) ->`**—Given an object `d`, return a copy of it where all `undefined` and
  `null` values are not set. In case `d` is `null` or `undefined`, an empty object will be returned.

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
circumstances:

```coffee
no_such_value = Symbol 'no_such_value'
if ( value = GUY.props.get x, key, no_such_value ) is no_such_value
  # deal with missing value here
else
  # deal with present value here
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

**Note** As of Guy v6, special methods `get()` and `set()` have been removed from `Strict_owner`. They have
been replaced with a much cleaner and more correct implementation as `GUY.props.get()` and
`GUY.props.has()`. These methods are more versatile, too, since they can be used with *any* JS value
(including the always-problematic `null` and `undefined`).


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

### `GUY.cfg`: Instance Configuration Helper

* **`GUY.cfg.configure_with_types: ( self, cfg = null, types = null ) => ...`**—Given a class instance
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

#### Usage Examples

##### Most Minimal (Bordering Useless)

It is allowable to call `configure_with_types()` with an instance of whatever class.
`GUY.cfg.configure_with_types()` will look for properties `clasz.C.defaults`, `clasz.declare_types()` (and a
`types` object as third argument to `configure_with_types()`) and provide defaults where missing:

```coffee
class Ex
  constructor: ( cfg ) ->
    GUY.cfg.configure_with_types @, cfg
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

##### More Typical

```coffee
class Ex

  @C: GUY.lft.freeze
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
    GUY.cfg.configure_with_types @, cfg
    return undefined

#.......................................................................................................
ex = new Ex { foo: 42, }
log ex                          # Ex { cfg: { foo: 42, bar: 'bar-default' } }
log ex.cfg                      # { foo: 42, bar: 'bar-default' }
log ex.constructor.C            # { foo: 'foo-constant', bar: 'bar-constant', defaults: { constructor_cfg: { foo: 'foo-default', bar: 'bar-default' } } }
log ex.constructor.C?.defaults  # { constructor_cfg: { foo: 'foo-default', bar: 'bar-default' } }
```


### `GUY.lft`: Freezing Objects

`GUY.left.freeze()` and `GUY.lft.lets()` provide access to the epynomous methods in
[`letsfreezethat`](https://github.com/loveencounterflow/letsfreezethat). `freeze()` is basically
`Object.freeze()` for nested objects, while `d = lets d, ( d ) -> mutate d` provides a handy way to mutate
and re-assign a copy of a frozen object. See [the
documentation](https://github.com/loveencounterflow/letsfreezethat) for details.


### `GUY.fs`: File-Related Stuff

* **`GUY.fs.walk_lines = ( path, cfg ) ->`**—Given a `path`, return a *synchronous* iterator over file
  lines. This is the most hassle-free approach to synchronously obtain lines of text files in NodeJS that
  I'm aware of, yet. The optional `cfg` argument may be an object with a single property `decode`; when set
  to `false`, `walk_lines()` will iterate over buffers instead of strings.

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

## Is Done

* **[+]** make choice between parsers configurable:
  * only `acorn`
  * first `acorn`, upon parse error `acorn-loose`
  * only `acorn-loose`
* **[–]** `parse()`: use `fallback` argument to decide whether to return value or throw error in case of
  parsing failure



