
'use strict'

############################################################################################################
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  type_of }               = types.export()
misfit                    = Symbol 'misfit'


#-----------------------------------------------------------------------------------------------------------
types.declare 'guy_walk_lines_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "@isa.boolean x.decode":                                            ( x ) -> @isa.boolean x.decode

#-----------------------------------------------------------------------------------------------------------
types.declare 'guy_walk_circular_lines_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "@isa.boolean x.decode":                                            ( x ) -> @isa.boolean x.decode
  "( x.loop_count is +Infinity ) or ( @isa.cardinal x.loop_count )":  ( x ) -> ( x.loop_count is +Infinity ) or ( @isa.cardinal x.loop_count )
  "( x.line_count is +Infinity ) or ( @isa.cardinal x.line_count )":  ( x ) -> ( x.line_count is +Infinity ) or ( @isa.cardinal x.line_count )

#-----------------------------------------------------------------------------------------------------------
types.declare 'guy_get_content_hash_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "@isa.cardinal x.length":                                           ( x ) -> @isa.cardinal x.length
  "x.command must be allowed value":                                  ( x ) ->
    return x.command in [ 'sha1sum', 'sha512sum', 'sha256sum', 'sha224sum', 'md5sum', ]

#-----------------------------------------------------------------------------------------------------------
defaults =
  guy_walk_lines_cfg:
    decode:         true
  guy_walk_circular_lines_cfg:
    decode:         true
    loop_count:     1
    line_count:     +Infinity
  guy_get_content_hash_cfg:
    command:        'sha1sum'
    length:         17

#-----------------------------------------------------------------------------------------------------------
@walk_lines = ( path, cfg ) ->
  ### TAINT make newline, buffersize configurable ###
  ### thx to https://github.com/nacholibre/node-readlines ###
  validate.guy_walk_lines_cfg ( cfg = { defaults.guy_walk_lines_cfg..., cfg..., } )
  validate.nonempty_text path
  readline_cfg =
    readChunk:          4 * 1024 # chunk_size, byte_count
    newLineCharacter:   '\n'      # nl
  readlines = new ( require '../dependencies/n-readlines-patched' ) path, readline_cfg
  if cfg.decode
    while ( line = readlines.next() ) isnt false
      yield line.toString 'utf-8'
  else
    while ( line = readlines.next() ) isnt false
      yield line
  return null

#-----------------------------------------------------------------------------------------------------------
@walk_circular_lines = ( path, cfg ) ->
  validate.guy_walk_circular_lines_cfg ( cfg = { defaults.guy_walk_circular_lines_cfg..., cfg..., } )
  return if ( cfg.line_count is 0 ) or ( cfg.loop_count is 0 )
  line_count = 0
  loop_count = 0
  loop
    for line from @walk_lines path, { decode: cfg.decode, }
      yield line
      line_count++; return null if line_count >= cfg.line_count
    loop_count++; return null if loop_count >= cfg.loop_count
  return null

#-----------------------------------------------------------------------------------------------------------
@get_file_size = ( path, fallback = misfit ) ->
  validate.nonempty_text path
  try return ( ( require 'fs' ).statSync path ).size catch error
    throw error if ( fallback is misfit )
    throw error if ( error.code isnt 'ENOENT' )
  return fallback

#-----------------------------------------------------------------------------------------------------------
@get_content_hash = ( path, cfg ) ->
  validate.nonempty_text path
  validate.guy_get_content_hash_cfg ( cfg = { defaults.guy_get_content_hash_cfg..., cfg..., } )
  CP        = require 'child_process'
  result    = CP.spawnSync cfg.command, [ '-b', path, ]
  if result.status isnt 0
    throw new Error "^guy.fs.get_content_hash@1^ " + result.stderr.toString 'utf-8'
  R = result
  R = R.stdout.toString 'utf-8'
  R = R.replace /\s.*$/, ''
  R = R[ ... cfg.length ]
  unless R.length is cfg.length
    throw new Error "^guy.fs.get_content_hash@1^ unable to generate hash of length #{cfg.length} using #{cfg.command}"
  return R








