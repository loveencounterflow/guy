
'use strict'

############################################################################################################
H                         = require './_helpers'
debug                     = console.log
defaults                  = { keep: false, prefix: 'guy.temp-', suffix: '', }


#---------------------------------------------------------------------------------------------------------
@with_file = ( cfg, handler ) ->
  switch arity = arguments.length
    when 1 then [ cfg, handler, ] = [ null, cfg, ]
    when 2 then null
    else throw new Error "expected 1 or 2 arguments, got #{arity}"
  cfg           = { defaults..., cfg..., }
  TEMP          = require 'tmp'
  debug '^34534^', cfg
  { name,
    fd,
    removeCallback } = TEMP.fileSync {}
  # { name: path, fd }  = TEMP.fileSync cfg
  try handler { path: name, fd, } finally
    removeCallback() unless cfg.keep
  return null

#---------------------------------------------------------------------------------------------------------
@with_directory = ( cfg, handler ) ->
  switch arity = arguments.length
    when 1 then [ cfg, handler, ] = [ null, cfg, ]
    when 2 then null
    else throw new Error "expected 1 or 2 arguments, got #{arity}"
  cfg           = { defaults..., cfg..., }
  FS            = require 'node:fs'
  TEMP          = require 'tmp'
  { name: path
    removeCallback } = TEMP.dirSync cfg
  try handler { path, } finally
    FS.rmdirSync path, { recursive: true, } unless cfg.keep
  return null

