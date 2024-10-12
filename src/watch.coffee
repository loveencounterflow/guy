


# 'use strict'

# ############################################################################################################
# H                         = require './_helpers'
# debug                     = console.log
# { FSWatcher }             = require 'chokidar'
# { rpr }                   = H
# FS                        = require 'fs'

# #-----------------------------------------------------------------------------------------------------------
# path_exists = ( path ) ->
#   H.types.validate.nonempty_text path
#   try FS.statSync path catch error
#     return false if error.code is 'ENOENT'
#     throw error
#   return true


# #===========================================================================================================
# class @Watcher

#   #---------------------------------------------------------------------------------------------------------
#   constructor: ( cfg = null ) ->
#     ### TAINT use InterType ###
#     defaults  =
#       recursive:        true
#       persistent:       true
#       awaitWriteFinish: { stabilityThreshold: 100, }
#     cfg       = { defaults...,  cfg..., }
#     @_watcher = new FSWatcher cfg
#     @_attach_handlers()
#     return undefined

#   #---------------------------------------------------------------------------------------------------------
#   stop: -> await @_watcher.close()

#   #---------------------------------------------------------------------------------------------------------
#   _attach_handlers: ->
#     #.......................................................................................................
#     @_watcher.on 'add',       ( ( path, stats   ) => @on_add            path  ) if @on_add?
#     @_watcher.on 'change',    ( ( path, stats   ) => @on_change         path  ) if @on_change?
#     @_watcher.on 'unlink',    ( ( path          ) => @on_unlink         path  ) if @on_unlink?
#     @_watcher.on 'addDir',    ( ( path          ) => @on_add_folder     path  ) if @on_add_folder?
#     @_watcher.on 'unlinkDir', ( ( path          ) => @on_unlink_folder  path  ) if @on_unlink_folder?
#     #.......................................................................................................
#     @_watcher.on 'ready',     ( => @on_ready()                                ) if @on_ready?
#     @_watcher.on 'raw',       ( ( key, path, d  ) => @on_raw key, path, d     ) if @on_raw?
#     @_watcher.on 'error',     ( ( error         ) => @on_error error          ) if @on_error?
#     #.......................................................................................................
#     if @on_all?
#       @_watcher.on 'all', ( key, path ) =>
#         key = 'add_folder'    if key is 'addDir'
#         key = 'unlink_folder' if key is 'unlinkDir'
#         @on_all key, path
#     #.......................................................................................................
#     return null

#   #---------------------------------------------------------------------------------------------------------
#   on_error: ( path ) -> throw error
#     ###
#     watcher.on 'error', ( error ) ->
#       debug '^guy.watch@2^', 'error', error.message
#       for k, v of error
#         key = k + ': '
#         debug ( CND.reverse key.padEnd 25 ), ( CND.yellow rpr v )
#       if error.message.startsWith "Couldn't initialize inotify"
#         reject error.message
#         defer -> process.exit 1
#       debug CND.reverse "error #{rpr error.message} occurred for path: #{CND.yellow rpr path}"
#     ###

#   #---------------------------------------------------------------------------------------------------------
#   add_path: ( path, P... ) ->
#     @_watcher.add path, P...
#     return null


# #===========================================================================================================
# class @Reporting_watcher extends @Watcher
#   on_add:           ( path      ) -> debug '^guy.watch@3^ add           ', { path, }
#   on_change:        ( path      ) -> debug '^guy.watch@4^ change        ', { path, }
#   on_unlink:        ( path      ) -> debug '^guy.watch@5^ unlink        ', { path, }
#   on_add_folder:    ( path      ) -> debug '^guy.watch@6^ add_folder    ', { path, }
#   on_unlink_folder: ( path      ) -> debug '^guy.watch@7^ unlink_folder ', { path, }
#   on_ready:                       -> debug '^guy.watch@8^ ready         '
#   # on_all:           ( key, path ) -> debug '^guy.watch@3^ all           ', { key, path, }
#   # on_raw:           ( P... ) -> debug '^guy.watch@9^ raw           ', P
#   # on_error:         ( error     ) -> debug '^guy.watch@10^ error         ', rpr error
