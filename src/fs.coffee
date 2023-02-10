
'use strict'

############################################################################################################
H                         = require './_helpers'
misfit                    = Symbol 'misfit'
platform                  = ( require 'os' ).platform()
rpr                       = ( require 'util' ).inspect
#-----------------------------------------------------------------------------------------------------------
### Constants: ###
cr                        = 0x0d
lf                        = 0x0a
C_empty_string            = ''
C_empty_buffer            = Buffer.from C_empty_string
C_cr_buffer               = Buffer.from [ cr, ]
C_lf_buffer               = Buffer.from [ lf, ]

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_buffer_chr', ( x ) ->
  return true if ( @isa.integer x ) and ( 0x00 <= x <= 0xff )
  return true if ( @isa.buffer  x ) and ( x.length > 0 )
  return true if ( @isa.text    x ) and ( x.length > 0 )
  return false

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_fs_walk_buffers_cfg', tests:
  "@isa.positive_integer x.chunk_size":                               ( x ) -> @isa.positive_integer x.chunk_size

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_fs_walk_lines_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "@isa_optional.nonempty_text x.encoding":                           ( x ) -> @isa_optional.nonempty_text x.encoding
  "@isa.positive_integer x.chunk_size":                               ( x ) -> @isa.positive_integer x.chunk_size
  "@isa.boolean x.trim":                                              ( x ) -> @isa.boolean x.trim

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_walk_circular_lines_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "@isa.boolean x.decode":                                            ( x ) -> @isa.boolean x.decode
  "( x.loop_count is +Infinity ) or ( @isa.cardinal x.loop_count )":  ( x ) -> ( x.loop_count is +Infinity ) or ( @isa.cardinal x.loop_count )
  "( x.line_count is +Infinity ) or ( @isa.cardinal x.line_count )":  ( x ) -> ( x.line_count is +Infinity ) or ( @isa.cardinal x.line_count )

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_get_content_hash_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "@isa.cardinal x.length":                                           ( x ) -> @isa.cardinal x.length

#-----------------------------------------------------------------------------------------------------------
defaults =
  guy_fs_walk_lines_cfg:
    encoding:       'utf-8'
    chunk_size:     16 * 1024
    trim:           true
  guy_walk_circular_lines_cfg:
    decode:         true
    loop_count:     1
    line_count:     +Infinity
  guy_get_content_hash_cfg:
    length:         17
    fallback:       misfit

#-----------------------------------------------------------------------------------------------------------
@walk_lines = ( path, cfg ) -> yield line for { line, } from @walk_lines_with_positions path, cfg

#-----------------------------------------------------------------------------------------------------------
@walk_lines_with_positions = ( path, cfg ) ->
  H.types.validate.guy_fs_walk_lines_cfg ( cfg = { defaults.guy_fs_walk_lines_cfg..., cfg..., } )
  H.types.validate.nonempty_text path
  { chunk_size
    encoding
    trim      } = cfg
  #.........................................................................................................
  count         = 0
  for d from @_walk_lines_with_positions path, chunk_size
    count++
    if encoding?
      d.line  = d.line.toString encoding
      d.line  = d.line.trimEnd() if trim
      d.nl    = d.nl.toString encoding
      yield d
    else
      yield d
  if count is 0
    line  = if encoding? then C_empty_string else C_empty_buffer
    nl    = if encoding? then C_empty_string else C_empty_buffer
    yield { lnr: 1, line, nl, }
  return null

#-----------------------------------------------------------------------------------------------------------
@_walk_lines_with_positions = ( path, chunk_size ) ->
  FS            = require 'node:fs'
  fd            = FS.openSync path
  byte_idx      = 0
  prv_was_cr    = false
  is_cr         = false
  is_lf         = false
  #.........................................................................................................
  lnr           = 0
  line          = null
  line_cache    = []
  nl_cache      = []
  #.........................................................................................................
  flush = ->
    return if ( line_cache.length is 0 ) and ( nl_cache.length is 0 )
    switch line_cache.length
      when 0 then line  = C_empty_buffer
      when 1 then line  = line_cache[ 0 ]
      else        line  = Buffer.concat line_cache
    switch nl_cache.length
      when 0 then nl    = C_empty_buffer
      when 1 then nl    = nl_cache[ 0 ]
      else        nl    = Buffer.concat nl_cache
    lnr++
    yield { lnr, line, nl, }
    line_cache.length = 0
    nl_cache.length   = 0
    return null
  #.........................................................................................................
  loop
    buffer      = Buffer.alloc chunk_size
    byte_count  = FS.readSync fd, buffer, 0, chunk_size, byte_idx
    break if byte_count is 0
    byte_idx   += byte_count
    buffer      = buffer.subarray 0, byte_count if byte_count < chunk_size
    # console.log '^54-4^', rpr buffer.toString()
    yield from walk_lines buffer
  #.........................................................................................................
  yield from flush()
  return null

#-----------------------------------------------------------------------------------------------------------
### TAINT add may_have_cr, may_have_lf as optimization to forego repeated unnecessary lookups ###
@_walk_lines__advance = ( buffer, first_idx, may_have_cr = true, may_have_lf = true ) ->
  material    = null
  eol         = C_empty_buffer
  next_idx_cr = -1
  next_idx_lf = -1
  next_idx_cr = buffer.indexOf cr, first_idx if may_have_cr
  next_idx_lf = buffer.indexOf lf, first_idx if may_have_lf
  next_idx    = buffer.length
  #.........................................................................................................
  if next_idx_cr is -1
    if next_idx_lf is -1
      return { material: buffer, eol, next_idx, } if first_idx is 0
    else
      next_idx    = next_idx_lf
      eol         = C_lf_buffer
  #.........................................................................................................
  else if ( next_idx_lf is -1 ) or ( next_idx_cr < next_idx_lf )
    next_idx    = next_idx_cr
    eol         = C_cr_buffer
  #.........................................................................................................
  else
    next_idx    = next_idx_lf
    eol         = C_lf_buffer
  #.........................................................................................................
  material = buffer.subarray first_idx, next_idx
  return { material, eol, next_idx: next_idx + 1, }


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@walk_circular_lines = ( path, cfg ) ->
  H.types.validate.guy_walk_circular_lines_cfg ( cfg = { defaults.guy_walk_circular_lines_cfg..., cfg..., } )
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
  H.types.validate.nonempty_text path
  try return ( ( require 'fs' ).statSync path ).size catch error
    throw error if ( fallback is misfit )
    throw error if ( error.code isnt 'ENOENT' )
  return fallback

#-----------------------------------------------------------------------------------------------------------
@get_content_hash = ( path, cfg ) ->
  H.types.validate.nonempty_text path
  H.types.validate.guy_get_content_hash_cfg ( cfg = { defaults.guy_get_content_hash_cfg..., cfg..., } )
  CP        = require 'child_process'
  command   = if platform is 'linux' then 'sha1sum' else 'shasum'
  result    = CP.spawnSync command, [ '-b', path, ]
  if result.status isnt 0
    return cfg.fallback unless cfg.fallback is misfit
    if result.stderr?
      throw new Error "^guy.fs.get_content_hash@1^ " + result.stderr.toString 'utf-8'
    else
      throw new Error "^guy.fs.get_content_hash@1^ " + ( require 'util' ).inspect result.error
  R = result
  R = R.stdout.toString 'utf-8'
  R = R.replace /\s.*$/, ''
  R = R[ ... cfg.length ]
  unless R.length is cfg.length
    throw new Error "^guy.fs.get_content_hash@1^ unable to generate hash of length #{cfg.length} using #{command}"
  return R

#-----------------------------------------------------------------------------------------------------------
@rename_sync = ( from_path, to_path ) ->
  ### Same as `FS.renameSync()`, but falls back to `FS.copyFileSync()`, `FS.unlinkSync()` in case device
  boundaries are crossed. Thx to https://github.com/sindresorhus/move-file/blob/main/index.js ###
  FS = require 'node:fs'
  try FS.renameSync from_path, to_path catch error
    throw error unless error.code is 'EXDEV'
    FS.copyFileSync from_path, to_path
    FS.unlinkSync from_path
  return null






