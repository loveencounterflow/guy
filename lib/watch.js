(function() {
  // 'use strict'

  // ############################################################################################################
// H                         = require './_helpers'
// debug                     = console.log
// { FSWatcher }             = require 'chokidar'
// { rpr }                   = H
// FS                        = require 'fs'

  // #-----------------------------------------------------------------------------------------------------------
// path_exists = ( path ) ->
//   H.types.validate.nonempty_text path
//   try FS.statSync path catch error
//     return false if error.code is 'ENOENT'
//     throw error
//   return true

  // #===========================================================================================================
// class @Watcher

  //   #---------------------------------------------------------------------------------------------------------
//   constructor: ( cfg = null ) ->
//     ### TAINT use InterType ###
//     defaults  =
//       recursive:        true
//       persistent:       true
//       awaitWriteFinish: { stabilityThreshold: 100, }
//     cfg       = { defaults...,  cfg..., }
//     @_watcher = new FSWatcher cfg
//     @_attach_handlers()
//     return undefined

  //   #---------------------------------------------------------------------------------------------------------
//   stop: -> await @_watcher.close()

  //   #---------------------------------------------------------------------------------------------------------
//   _attach_handlers: ->
//     #.......................................................................................................
//     @_watcher.on 'add',       ( ( path, stats   ) => @on_add            path  ) if @on_add?
//     @_watcher.on 'change',    ( ( path, stats   ) => @on_change         path  ) if @on_change?
//     @_watcher.on 'unlink',    ( ( path          ) => @on_unlink         path  ) if @on_unlink?
//     @_watcher.on 'addDir',    ( ( path          ) => @on_add_folder     path  ) if @on_add_folder?
//     @_watcher.on 'unlinkDir', ( ( path          ) => @on_unlink_folder  path  ) if @on_unlink_folder?
//     #.......................................................................................................
//     @_watcher.on 'ready',     ( => @on_ready()                                ) if @on_ready?
//     @_watcher.on 'raw',       ( ( key, path, d  ) => @on_raw key, path, d     ) if @on_raw?
//     @_watcher.on 'error',     ( ( error         ) => @on_error error          ) if @on_error?
//     #.......................................................................................................
//     if @on_all?
//       @_watcher.on 'all', ( key, path ) =>
//         key = 'add_folder'    if key is 'addDir'
//         key = 'unlink_folder' if key is 'unlinkDir'
//         @on_all key, path
//     #.......................................................................................................
//     return null

  //   #---------------------------------------------------------------------------------------------------------
//   on_error: ( path ) -> throw error
//     ###
//     watcher.on 'error', ( error ) ->
//       debug '^guy.watch@2^', 'error', error.message
//       for k, v of error
//         key = k + ': '
//         debug ( CND.reverse key.padEnd 25 ), ( CND.yellow rpr v )
//       if error.message.startsWith "Couldn't initialize inotify"
//         reject error.message
//         defer -> process.exit 1
//       debug CND.reverse "error #{rpr error.message} occurred for path: #{CND.yellow rpr path}"
//     ###

  //   #---------------------------------------------------------------------------------------------------------
//   add_path: ( path, P... ) ->
//     @_watcher.add path, P...
//     return null

  // #===========================================================================================================
// class @Reporting_watcher extends @Watcher
//   on_add:           ( path      ) -> debug '^guy.watch@3^ add           ', { path, }
//   on_change:        ( path      ) -> debug '^guy.watch@4^ change        ', { path, }
//   on_unlink:        ( path      ) -> debug '^guy.watch@5^ unlink        ', { path, }
//   on_add_folder:    ( path      ) -> debug '^guy.watch@6^ add_folder    ', { path, }
//   on_unlink_folder: ( path      ) -> debug '^guy.watch@7^ unlink_folder ', { path, }
//   on_ready:                       -> debug '^guy.watch@8^ ready         '
//   # on_all:           ( key, path ) -> debug '^guy.watch@3^ all           ', { key, path, }
//   # on_raw:           ( P... ) -> debug '^guy.watch@9^ raw           ', P
//   # on_error:         ( error     ) -> debug '^guy.watch@10^ error         ', rpr error


}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3dhdGNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEwRnlGO0VBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5cblxuIyAndXNlIHN0cmljdCdcblxuIyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgSCAgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vX2hlbHBlcnMnXG4jIGRlYnVnICAgICAgICAgICAgICAgICAgICAgPSBjb25zb2xlLmxvZ1xuIyB7IEZTV2F0Y2hlciB9ICAgICAgICAgICAgID0gcmVxdWlyZSAnY2hva2lkYXInXG4jIHsgcnByIH0gICAgICAgICAgICAgICAgICAgPSBIXG4jIEZTICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdmcydcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgcGF0aF9leGlzdHMgPSAoIHBhdGggKSAtPlxuIyAgIEgudHlwZXMudmFsaWRhdGUubm9uZW1wdHlfdGV4dCBwYXRoXG4jICAgdHJ5IEZTLnN0YXRTeW5jIHBhdGggY2F0Y2ggZXJyb3JcbiMgICAgIHJldHVybiBmYWxzZSBpZiBlcnJvci5jb2RlIGlzICdFTk9FTlQnXG4jICAgICB0aHJvdyBlcnJvclxuIyAgIHJldHVybiB0cnVlXG5cblxuIyAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgY2xhc3MgQFdhdGNoZXJcblxuIyAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgICBjb25zdHJ1Y3RvcjogKCBjZmcgPSBudWxsICkgLT5cbiMgICAgICMjIyBUQUlOVCB1c2UgSW50ZXJUeXBlICMjI1xuIyAgICAgZGVmYXVsdHMgID1cbiMgICAgICAgcmVjdXJzaXZlOiAgICAgICAgdHJ1ZVxuIyAgICAgICBwZXJzaXN0ZW50OiAgICAgICB0cnVlXG4jICAgICAgIGF3YWl0V3JpdGVGaW5pc2g6IHsgc3RhYmlsaXR5VGhyZXNob2xkOiAxMDAsIH1cbiMgICAgIGNmZyAgICAgICA9IHsgZGVmYXVsdHMuLi4sICBjZmcuLi4sIH1cbiMgICAgIEBfd2F0Y2hlciA9IG5ldyBGU1dhdGNoZXIgY2ZnXG4jICAgICBAX2F0dGFjaF9oYW5kbGVycygpXG4jICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiMgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICAgc3RvcDogLT4gYXdhaXQgQF93YXRjaGVyLmNsb3NlKClcblxuIyAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgICBfYXR0YWNoX2hhbmRsZXJzOiAtPlxuIyAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMgICAgIEBfd2F0Y2hlci5vbiAnYWRkJywgICAgICAgKCAoIHBhdGgsIHN0YXRzICAgKSA9PiBAb25fYWRkICAgICAgICAgICAgcGF0aCAgKSBpZiBAb25fYWRkP1xuIyAgICAgQF93YXRjaGVyLm9uICdjaGFuZ2UnLCAgICAoICggcGF0aCwgc3RhdHMgICApID0+IEBvbl9jaGFuZ2UgICAgICAgICBwYXRoICApIGlmIEBvbl9jaGFuZ2U/XG4jICAgICBAX3dhdGNoZXIub24gJ3VubGluaycsICAgICggKCBwYXRoICAgICAgICAgICkgPT4gQG9uX3VubGluayAgICAgICAgIHBhdGggICkgaWYgQG9uX3VubGluaz9cbiMgICAgIEBfd2F0Y2hlci5vbiAnYWRkRGlyJywgICAgKCAoIHBhdGggICAgICAgICAgKSA9PiBAb25fYWRkX2ZvbGRlciAgICAgcGF0aCAgKSBpZiBAb25fYWRkX2ZvbGRlcj9cbiMgICAgIEBfd2F0Y2hlci5vbiAndW5saW5rRGlyJywgKCAoIHBhdGggICAgICAgICAgKSA9PiBAb25fdW5saW5rX2ZvbGRlciAgcGF0aCAgKSBpZiBAb25fdW5saW5rX2ZvbGRlcj9cbiMgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgICBAX3dhdGNoZXIub24gJ3JlYWR5JywgICAgICggPT4gQG9uX3JlYWR5KCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgaWYgQG9uX3JlYWR5P1xuIyAgICAgQF93YXRjaGVyLm9uICdyYXcnLCAgICAgICAoICgga2V5LCBwYXRoLCBkICApID0+IEBvbl9yYXcga2V5LCBwYXRoLCBkICAgICApIGlmIEBvbl9yYXc/XG4jICAgICBAX3dhdGNoZXIub24gJ2Vycm9yJywgICAgICggKCBlcnJvciAgICAgICAgICkgPT4gQG9uX2Vycm9yIGVycm9yICAgICAgICAgICkgaWYgQG9uX2Vycm9yP1xuIyAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMgICAgIGlmIEBvbl9hbGw/XG4jICAgICAgIEBfd2F0Y2hlci5vbiAnYWxsJywgKCBrZXksIHBhdGggKSA9PlxuIyAgICAgICAgIGtleSA9ICdhZGRfZm9sZGVyJyAgICBpZiBrZXkgaXMgJ2FkZERpcidcbiMgICAgICAgICBrZXkgPSAndW5saW5rX2ZvbGRlcicgaWYga2V5IGlzICd1bmxpbmtEaXInXG4jICAgICAgICAgQG9uX2FsbCBrZXksIHBhdGhcbiMgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgICByZXR1cm4gbnVsbFxuXG4jICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgIG9uX2Vycm9yOiAoIHBhdGggKSAtPiB0aHJvdyBlcnJvclxuIyAgICAgIyMjXG4jICAgICB3YXRjaGVyLm9uICdlcnJvcicsICggZXJyb3IgKSAtPlxuIyAgICAgICBkZWJ1ZyAnXmd1eS53YXRjaEAyXicsICdlcnJvcicsIGVycm9yLm1lc3NhZ2VcbiMgICAgICAgZm9yIGssIHYgb2YgZXJyb3JcbiMgICAgICAgICBrZXkgPSBrICsgJzogJ1xuIyAgICAgICAgIGRlYnVnICggQ05ELnJldmVyc2Uga2V5LnBhZEVuZCAyNSApLCAoIENORC55ZWxsb3cgcnByIHYgKVxuIyAgICAgICBpZiBlcnJvci5tZXNzYWdlLnN0YXJ0c1dpdGggXCJDb3VsZG4ndCBpbml0aWFsaXplIGlub3RpZnlcIlxuIyAgICAgICAgIHJlamVjdCBlcnJvci5tZXNzYWdlXG4jICAgICAgICAgZGVmZXIgLT4gcHJvY2Vzcy5leGl0IDFcbiMgICAgICAgZGVidWcgQ05ELnJldmVyc2UgXCJlcnJvciAje3JwciBlcnJvci5tZXNzYWdlfSBvY2N1cnJlZCBmb3IgcGF0aDogI3tDTkQueWVsbG93IHJwciBwYXRofVwiXG4jICAgICAjIyNcblxuIyAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgICBhZGRfcGF0aDogKCBwYXRoLCBQLi4uICkgLT5cbiMgICAgIEBfd2F0Y2hlci5hZGQgcGF0aCwgUC4uLlxuIyAgICAgcmV0dXJuIG51bGxcblxuXG4jICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBjbGFzcyBAUmVwb3J0aW5nX3dhdGNoZXIgZXh0ZW5kcyBAV2F0Y2hlclxuIyAgIG9uX2FkZDogICAgICAgICAgICggcGF0aCAgICAgICkgLT4gZGVidWcgJ15ndXkud2F0Y2hAM14gYWRkICAgICAgICAgICAnLCB7IHBhdGgsIH1cbiMgICBvbl9jaGFuZ2U6ICAgICAgICAoIHBhdGggICAgICApIC0+IGRlYnVnICdeZ3V5LndhdGNoQDReIGNoYW5nZSAgICAgICAgJywgeyBwYXRoLCB9XG4jICAgb25fdW5saW5rOiAgICAgICAgKCBwYXRoICAgICAgKSAtPiBkZWJ1ZyAnXmd1eS53YXRjaEA1XiB1bmxpbmsgICAgICAgICcsIHsgcGF0aCwgfVxuIyAgIG9uX2FkZF9mb2xkZXI6ICAgICggcGF0aCAgICAgICkgLT4gZGVidWcgJ15ndXkud2F0Y2hANl4gYWRkX2ZvbGRlciAgICAnLCB7IHBhdGgsIH1cbiMgICBvbl91bmxpbmtfZm9sZGVyOiAoIHBhdGggICAgICApIC0+IGRlYnVnICdeZ3V5LndhdGNoQDdeIHVubGlua19mb2xkZXIgJywgeyBwYXRoLCB9XG4jICAgb25fcmVhZHk6ICAgICAgICAgICAgICAgICAgICAgICAtPiBkZWJ1ZyAnXmd1eS53YXRjaEA4XiByZWFkeSAgICAgICAgICdcbiMgICAjIG9uX2FsbDogICAgICAgICAgICgga2V5LCBwYXRoICkgLT4gZGVidWcgJ15ndXkud2F0Y2hAM14gYWxsICAgICAgICAgICAnLCB7IGtleSwgcGF0aCwgfVxuIyAgICMgb25fcmF3OiAgICAgICAgICAgKCBQLi4uICkgLT4gZGVidWcgJ15ndXkud2F0Y2hAOV4gcmF3ICAgICAgICAgICAnLCBQXG4jICAgIyBvbl9lcnJvcjogICAgICAgICAoIGVycm9yICAgICApIC0+IGRlYnVnICdeZ3V5LndhdGNoQDEwXiBlcnJvciAgICAgICAgICcsIHJwciBlcnJvclxuIl19
//# sourceURL=../src/watch.coffee