

# A Guy of Many Trades


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Structure](#structure)
- [Modules](#modules)
  - [`guy.props`: Define Properties](#guyprops-define-properties)
  - [`guy.async`: Asynchronous Helpers](#guyasync-asynchronous-helpers)
  - [`guy.nowait`: De-Asyncify JS Async Functions](#guynowait-de-asyncify-js-async-functions)

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

* implemented using [`abbr/deasync`](https://github.com/abbr/deasync)

* **`guy.nowait.for_callbackable: ( fn_with_callback ) ->`**—given an asynchronous function `afc` that
  accepts a NodeJS-style callback (as in `afc v1, v2, ..., ( error, result ) -> ...`), returns a synchronous
  function `sf` that can be used without a callback (as in `result = sf v1, v2, ...`).

* **`guy.nowait.for_awaitable: ( fn_with_promise ) ->`**—given an asynchronous function `afp` that can be
  used with `await` (as in `result = await afp v1, v2, ...`) returns a synchronous function `f` that can be
  used without `await` (as in `result = sf v1, v2, ...`).



