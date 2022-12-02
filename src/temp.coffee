
'use strict'

############################################################################################################
H                         = require './_helpers'
debug                     = console.log
defaults                  = { keep: false, prefix: 'guy.temp-', suffix: '', }


#-----------------------------------------------------------------------------------------------------------
@with_file = ( cfg, handler ) ->
  switch arity = arguments.length
    when 1 then [ cfg, handler, ] = [ null, cfg, ]
    when 2 then null
    else throw new Error "expected 1 or 2 arguments, got #{arity}"
  cfg   = { defaults..., cfg..., }
  type  = Object::toString.call handler
  return @_with_file_async cfg, handler if type is '[object AsyncFunction]'
  return @_with_file_sync  cfg, handler if type is '[object Function]'
  throw new Error "^guy.temp@1^ expected an (sync or async) function, got a #{type}"

#-----------------------------------------------------------------------------------------------------------
@with_directory = ( cfg, handler ) ->
  switch arity = arguments.length
    when 1 then [ cfg, handler, ] = [ null, cfg, ]
    when 2 then null
    else throw new Error "expected 1 or 2 arguments, got #{arity}"
  cfg   = { defaults..., cfg..., }
  type  = Object::toString.call handler
  return @_with_directory_async cfg, handler if type is '[object AsyncFunction]'
  return @_with_directory_sync  cfg, handler if type is '[object Function]'
  throw new Error "^guy.temp@2^ expected an (sync or async) function, got a #{type}"

#-----------------------------------------------------------------------------------------------------------
@_with_file_sync = ( cfg, handler ) ->
  TEMP          = require 'tmp'
  { name: path
    fd
    removeCallback } = TEMP.fileSync cfg
  try handler { path, fd, } finally
    removeCallback() unless cfg.keep
  return null

#-----------------------------------------------------------------------------------------------------------
@_with_directory_sync = ( cfg, handler ) ->
  FS              = require 'node:fs'
  TEMP            = require 'tmp'
  { name: path, } = TEMP.dirSync cfg
  try handler { path, } finally
    FS.rmSync path, { recursive: true, } unless cfg.keep
  return null

#-----------------------------------------------------------------------------------------------------------
@_with_file_async = ( cfg, handler ) ->
  TEMP          = require 'tmp'
  { name: path
    fd
    removeCallback } = TEMP.fileSync cfg
  try await handler { path, fd, } finally
    removeCallback() unless cfg.keep
  return null

#-----------------------------------------------------------------------------------------------------------
@_with_directory_async = ( cfg, handler ) ->
  switch arity = arguments.length
    when 1 then [ cfg, handler, ] = [ null, cfg, ]
    when 2 then null
    else throw new Error "expected 1 or 2 arguments, got #{arity}"
  cfg             = { defaults..., cfg..., }
  FS              = require 'node:fs'
  TEMP            = require 'tmp'
  { name: path, } = TEMP.dirSync cfg
  try await handler { path, } finally
    FS.rmSync path, { recursive: true, } unless cfg.keep
  return null

#-----------------------------------------------------------------------------------------------------------
@with_shadow_file = ( original_path, handler ) ->
  type  = Object::toString.call handler
  return @_with_shadow_file_async original_path, handler if type is '[object AsyncFunction]'
  return @_with_shadow_file_sync  original_path, handler if type is '[object Function]'
  throw new Error "^guy.temp@3^ expected an (sync or async) function, got a #{type}"

#-----------------------------------------------------------------------------------------------------------
@_with_shadow_file_sync = ( original_path, handler ) ->
  ### TAINT check that original_path is nonexistent or file path, not directory ###
  GFS       = require './fs'
  FS        = require 'node:fs'
  PATH      = require 'node:path'
  real_path = FS.realpathSync original_path
  @with_directory ({ path: folder_path, }) ->
    base_name = PATH.basename real_path
    temp_path = PATH.join folder_path, base_name
    FS.copyFileSync real_path, temp_path
    handler { path: temp_path, }
    GFS.rename_sync temp_path, real_path
  return null


