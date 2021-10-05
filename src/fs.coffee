
'use strict'

############################################################################################################
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  type_of }               = types.export()


#-----------------------------------------------------------------------------------------------------------
@walk_lines = ( path ) ->
  ### TAINT make newline, buffersize configurable ###
  ### thx to https://github.com/nacholibre/node-readlines ###
  validate.nonempty_text path
  cfg =
    readChunk:          4 * 1024 # chunk_size, byte_count
    newLineCharacter:   '\n'      # nl
  readlines = new ( require '../dependencies/n-readlines-patched' ) path, cfg
  yield line.toString 'utf-8' while ( line = readlines.next() ) isnt false
  return null



