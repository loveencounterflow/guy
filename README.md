

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
  - [Usage Examples](#usage-examples)
- [`guy.lft`: Freezing Objects](#guylft-freezing-objects)
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
  `self`, an optional `cfg` object and an optional Intertype-like `types` instance,

  * derive effective `cfg` from defaults (where `self.constructor.C.defaults.constructor_cfg` is set) and
    argument `cfg`;
  * make `cfg` a frozen instance property.
  * Procure `types` where not given and
  * make it a non-enumerable instance property.
  * Now call class method `self.constructor.declare_types()` with `self`;
  * in `declare_types()`, clients are encouraged to declare type `constructor_cfg` and validate `self.cfg`;
  * further, other types may be declared as appropriate; since those types have access to `self.cfg`, their
    definition may depend on those parameters.
  * It is always possible to declare or import `types` on the client's module level and pass in that object
    to `configure_with_types()`; this will avoid (most of) the overhead of per-instance computations and use
    the same `types` object for all instances (which should be good enough for most cases). ###


### Usage Examples

**TBD**


## `guy.lft`: Freezing Objects

`guy.left.freeze()` and `guy.lft.lets()` provide access to the epynomous methods in
[`letsfreezethat`](https://github.com/loveencounterflow/letsfreezethat). `freeze()` is basically
`Object.freeze()` for nested objects, while `d = lets d, ( d ) -> mutate d` provides a handy way to mutate
and re-assign a copy of a frozen object. See [the
documentation](https://github.com/loveencounterflow/letsfreezethat) for details.

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




