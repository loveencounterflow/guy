
############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  type_of }               = types.export()


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------

#===========================================================================================================
class @Guy

  #---------------------------------------------------------------------------------------------------------
  # @extend   object_with_class_properties
  # @include require './cataloguing'
  # @include require './sizing'
  # @include require './declaring'

  #---------------------------------------------------------------------------------------------------------
  # filenames = FS.readdirSync __dirname
  # for filename in filenames
  #   continue unless filename.endsWith '.js'
  #   continue if filename.startsWith '_'
  #   continue if filename is 'main.js'
  #   continue if filename is 'types.js'
  #   path = './' + filename
  #   @include require path

  #---------------------------------------------------------------------------------------------------------
  # constructor: ( target = null ) ->
  constructor: ( @settings = null ) ->
    super()
  #   @specs            = {}
  #   @isa              = Multimix.get_keymethod_proxy @, isa
  #   @isa_list_of      = Multimix.get_keymethod_proxy @, isa_list_of
  #   @cast             = Multimix.get_keymethod_proxy @, cast
  #   @validate         = Multimix.get_keymethod_proxy @, validate
  #   @validate_list_of = Multimix.get_keymethod_proxy @, validate_list_of
  #   declarations.declare_types.apply @
  #   @export target if target?

############################################################################################################
module.exports  = L = new Guy()
L.Guy           = Guy


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@main = ->


############################################################################################################
if require.main is module then do =>
  @main()




