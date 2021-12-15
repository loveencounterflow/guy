
'use strict'

############################################################################################################
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  type_of }               = types.export()


#-----------------------------------------------------------------------------------------------------------
types.declare 'guy_walk_circular_lines_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "( x.loop_count is +Infinity ) or ( @isa.cardinal x.loop_count )":  ( x ) -> ( x.loop_count is +Infinity ) or ( @isa.cardinal x.loop_count )
  "( x.line_count is +Infinity ) or ( @isa.cardinal x.line_count )":  ( x ) -> ( x.line_count is +Infinity ) or ( @isa.cardinal x.line_count )

#-----------------------------------------------------------------------------------------------------------
defaults =
  guy_walk_circular_lines_cfg:
    loop_count:     1
    line_count:     +Infinity

#-----------------------------------------------------------------------------------------------------------
@walk_lines = ( path, cfg ) ->
  ### TAINT make newline, buffersize configurable ###
  ### thx to https://github.com/nacholibre/node-readlines ###
  validate.nonempty_text path
  cfg = { decode: true, cfg..., }
  validate.boolean cfg.decode
  cfg =
    readChunk:          4 * 1024 # chunk_size, byte_count
    newLineCharacter:   '\n'      # nl
  readlines = new ( require '../dependencies/n-readlines-patched' ) path, cfg
  if cfg.decode then  yield line.toString 'utf-8' while ( line = readlines.next() ) isnt false
  else                yield line                  while ( line = readlines.next() ) isnt false
  return null

#-----------------------------------------------------------------------------------------------------------
@walk_circular_lines = ( path, cfg ) ->
  validate.guy_walk_circular_lines_cfg ( cfg = { defaults.guy_walk_circular_lines_cfg..., cfg..., } )
  return if ( cfg.line_count is 0 ) or ( cfg.loop_count is 0 )
  line_count = 0
  loop_count = 0
  loop
    for line from @walk_lines path
      yield line
      line_count++; return null if line_count >= cfg.line_count
    loop_count++; return null if loop_count >= cfg.loop_count
  return null


