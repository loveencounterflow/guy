
'use strict'


############################################################################################################
props                     = require './props'


#===========================================================================================================
class Guy

  #---------------------------------------------------------------------------------------------------------
  # constructor: ( target = null ) ->
  constructor: ( @settings = null ) ->
    #.......................................................................................................
    props.def_oneoff @, 'async',    { enumerable: true, }, -> require './async'
    props.def_oneoff @, 'lft',      { enumerable: true, }, -> require 'letsfreezethat'
    props.def_oneoff @, 'process',  { enumerable: true, }, -> require './process'
    props.def_oneoff @, 'fs',       { enumerable: true, }, -> require './fs'
    props.def_oneoff @, 'str',      { enumerable: true, }, -> require './str'
    props.def_oneoff @, 'src',      { enumerable: true, }, -> require './src'
    return undefined

  #---------------------------------------------------------------------------------------------------------
  props: props


############################################################################################################
# if require.main is module then do =>
module.exports = new Guy()




