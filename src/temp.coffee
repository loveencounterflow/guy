
'use strict'

############################################################################################################
H                         = require './_helpers'
debug                     = console.log
defaults                  = { dir: null, prefix: 'guy.temp-', suffix: '', }


#---------------------------------------------------------------------------------------------------------
@with_file = ( cfg, handler ) ->
  switch arity = arguments.length
    when 1 then [ cfg, handler, ] = [ null, cfg, ]
    when 2 then null
    else throw new Error "expected 1 or 2 arguments, got #{arity}"
  cfg           = { defaults..., cfg..., }
  TEMP          = ( require 'temp' ).track()
  { path, fd }  = TEMP.openSync cfg
  try handler { path, fd, } finally R = TEMP.cleanupSync()
  return R

#---------------------------------------------------------------------------------------------------------
@with_directory = ( cfg, handler ) ->
  switch arity = arguments.length
    when 1 then [ cfg, handler, ] = [ null, cfg, ]
    when 2 then null
    else throw new Error "expected 1 or 2 arguments, got #{arity}"
  cfg           = { defaults..., cfg..., }
  TEMP          = ( require 'temp' ).track()
  path          = TEMP.mkdirSync cfg
  try handler { path,     } finally R = TEMP.cleanupSync()
  return R

