
'use strict'

############################################################################################################
H                         = require './_helpers'
misfit                    = Symbol 'misfit'
platform                  = ( require 'os' ).platform()
rpr                       = ( require 'util' ).inspect
debug                     = console.log
#-----------------------------------------------------------------------------------------------------------
### Constants: ###
C_cr                      = @_C_cr            = 0x0d
C_lf                      = @_C_lf            = 0x0a
C_empty_string            = @_C_empty_string  = ''
C_empty_buffer            = @_C_empty_buffer  = Buffer.from C_empty_string
C_cr_buffer               = @_C_cr_buffer     = Buffer.from [ C_cr, ]
C_lf_buffer               = @_C_lf_buffer     = Buffer.from [ C_lf, ]

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
  guy_fs_walk_buffers_cfg:
    chunk_size:     16 * 1024
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
@walk_buffers = ( path, cfg ) ->
  for { buffer, } from @walk_buffers_with_positions path, cfg
    yield buffer
  return null

#-----------------------------------------------------------------------------------------------------------
@walk_buffers_with_positions = ( path, cfg ) ->
  H.types.validate.guy_fs_walk_buffers_cfg ( cfg = { defaults.guy_fs_walk_buffers_cfg..., cfg..., } )
  H.types.validate.nonempty_text path
  { chunk_size } = cfg
  FS            = require 'node:fs'
  fd            = FS.openSync path
  byte_idx      = 0
  loop
    buffer      = Buffer.alloc chunk_size
    byte_count  = FS.readSync fd, buffer, 0, chunk_size, byte_idx
    break if byte_count is 0
    buffer      = buffer.subarray 0, byte_count if byte_count < chunk_size
    yield { buffer, byte_idx, }
    byte_idx   += byte_count
  return null

#-----------------------------------------------------------------------------------------------------------
@walk_lines = ( path, cfg ) ->
  for { line, } from @walk_lines_with_positions path, cfg
    yield line
  return null

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
      d.eol   = d.eol.toString encoding
      yield d
    else
      yield d
  return null

#-----------------------------------------------------------------------------------------------------------
@_walk_lines_with_positions = ( path, chunk_size = 16 * 1024 ) ->
  line_cache        = []
  eol_cache         = []
  lnr               = 0
  offset_bytes      = null
  material_byte_idx = null
  #.........................................................................................................
  flush = ( material = null, eol = null ) ->
    # return null if ( line_cache.length is 0 ) and ( eol_cache.length is 0 )
    byte_idx          = x_file_byte_idx + offset_bytes
    line              = Buffer.concat if material? then [ line_cache...,  material, ] else line_cache
    eol               = Buffer.concat if eol?      then [ eol_cache...,   eol,      ] else eol_cache
    line_cache.length = 0
    eol_cache.length  = 0
    lnr++
    yield { lnr, line, eol, }
  #.........................................................................................................
  for { buffer, byte_idx: x_file_byte_idx, } from @walk_buffers_with_positions path, { chunk_size, }
    # debug '^_walk_lines_with_positions@23-4^', byte_idx, ( rpr buffer.toString() )
    offset_bytes = 0
    for { material, eol, } from @_walk_lines__walk_advancements buffer
      debug '^_walk_lines_with_positions@23-4^', { x_file_byte_idx, offset_bytes, }, ( rpr material.toString() ), ( rpr eol.toString() )
      if ( eol_cache.length > 0 ) and not ( ( ( eol_cache.at -1 ) is C_cr_buffer ) and eol is C_lf_buffer )
        yield from flush()
      switch eol
        when C_cr_buffer
          line_cache.push material if material.length  > 0
          eol_cache.push eol
        when C_lf_buffer
          yield from flush material, eol
        when C_empty_buffer
          line_cache.push material if material.length  > 0
        else throw new Error "^636456^ internal error"
      offset_bytes += material.length + eol.length
  #.........................................................................................................
  has_extra_cr = ( eol_cache.length > 0 ) and ( ( eol_cache.at -1 ) is C_cr_buffer )
  yield from flush()
  if has_extra_cr
    lnr++
    yield { lnr, line: C_empty_buffer, eol: C_empty_buffer, }
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@_walk_lines__walk_advancements = ( buffer, may_have_cr = true, may_have_lf = true ) ->
  first_idx   = 0
  last_idx    = buffer.length - 1
  loop
    break if first_idx > last_idx
    yield d = @_walk_lines__advance buffer, first_idx, may_have_cr, may_have_lf
    first_idx = d.next_idx
  return null

#-----------------------------------------------------------------------------------------------------------
### TAINT add may_have_cr, may_have_lf as optimization to forego repeated unnecessary lookups ###
@_walk_lines__advance = ( buffer, first_idx, may_have_cr = true, may_have_lf = true ) ->
  material    = C_empty_buffer
  eol         = C_empty_buffer
  next_idx_cr = -1
  next_idx_lf = -1
  next_idx_cr = buffer.indexOf C_cr, first_idx if may_have_cr
  next_idx_lf = buffer.indexOf C_lf, first_idx if may_have_lf
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






