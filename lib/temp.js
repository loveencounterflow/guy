(function() {
  // 'use strict'

  // ############################################################################################################
// H                         = require './_helpers'
// debug                     = console.log
// defaults                  = { keep: false, prefix: 'guy.temp-', suffix: '', }

  // #-----------------------------------------------------------------------------------------------------------
// @with_file = ( cfg, handler ) ->
//   switch arity = arguments.length
//     when 1 then [ cfg, handler, ] = [ null, cfg, ]
//     when 2 then null
//     else throw new Error "expected 1 or 2 arguments, got #{arity}"
//   cfg   = { defaults..., cfg..., }
//   type  = Object::toString.call handler
//   return @_with_file_async cfg, handler if type is '[object AsyncFunction]'
//   return @_with_file_sync  cfg, handler if type is '[object Function]'
//   throw new Error "^guy.temp@1^ expected an (sync or async) function, got a #{type}"

  // #-----------------------------------------------------------------------------------------------------------
// @with_directory = ( cfg, handler ) ->
//   switch arity = arguments.length
//     when 1 then [ cfg, handler, ] = [ null, cfg, ]
//     when 2 then null
//     else throw new Error "expected 1 or 2 arguments, got #{arity}"
//   cfg   = { defaults..., cfg..., }
//   type  = Object::toString.call handler
//   return @_with_directory_async cfg, handler if type is '[object AsyncFunction]'
//   return @_with_directory_sync  cfg, handler if type is '[object Function]'
//   throw new Error "^guy.temp@2^ expected an (sync or async) function, got a #{type}"

  // #-----------------------------------------------------------------------------------------------------------
// @_with_file_sync = ( cfg, handler ) ->
//   TEMP          = require 'tmp'
//   { name: path
//     fd
//     removeCallback } = TEMP.fileSync cfg
//   try handler { path, fd, } finally
//     removeCallback() unless cfg.keep
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @_with_directory_sync = ( cfg, handler ) ->
//   FS              = require 'node:fs'
//   TEMP            = require 'tmp'
//   { name: path, } = TEMP.dirSync cfg
//   try handler { path, } finally
//     FS.rmSync path, { recursive: true, } unless cfg.keep
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @_with_file_async = ( cfg, handler ) ->
//   TEMP          = require 'tmp'
//   { name: path
//     fd
//     removeCallback } = TEMP.fileSync cfg
//   try await handler { path, fd, } finally
//     removeCallback() unless cfg.keep
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @_with_directory_async = ( cfg, handler ) ->
//   switch arity = arguments.length
//     when 1 then [ cfg, handler, ] = [ null, cfg, ]
//     when 2 then null
//     else throw new Error "expected 1 or 2 arguments, got #{arity}"
//   cfg             = { defaults..., cfg..., }
//   FS              = require 'node:fs'
//   TEMP            = require 'tmp'
//   { name: path, } = TEMP.dirSync cfg
//   try await handler { path, } finally
//     FS.rmSync path, { recursive: true, } unless cfg.keep
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @create_directory = ( cfg ) ->
//   FS              = require 'node:fs'
//   TEMP            = require 'tmp'
//   cfg             = { defaults..., cfg..., }
//   { name: path, } = TEMP.dirSync cfg
//   rm              = -> FS.rmSync path, { recursive: true, }
//   return { path, rm, }


}).call(this);

//# sourceMappingURL=temp.js.map