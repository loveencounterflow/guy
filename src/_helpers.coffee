
'use strict'


############################################################################################################
inspect                   = ( require 'util' ).inspect
@types                    = new ( require 'intertype-legacy' ).Intertype()
@types.defaults           = {}

#-----------------------------------------------------------------------------------------------------------
@_trm_cfg =
  separator: ' '
  #.........................................................................................................
  rpr:
    depth:            Infinity
    maxArrayLength:   Infinity
    breakLength:      Infinity
    compact:          true
    colors:           false
  #.........................................................................................................
  inspect:
    depth:            Infinity
    maxArrayLength:   Infinity
    breakLength:      Infinity
    compact:          false
    colors:           true

#-----------------------------------------------------------------------------------------------------------
@rpr      = ( P... ) => ( ( inspect x, @_trm_cfg.rpr      ) for x in P ).join @_trm_cfg.separator
@inspect  = ( P... ) => ( ( inspect x, @_trm_cfg.inspect  ) for x in P ).join @_trm_cfg.separator

