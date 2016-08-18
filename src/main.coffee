
############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
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
#...........................................................................................................
{ step, }                 = require 'coffeenode-suspend'
D                         = require 'pipedreams'
{ $, }                    = D
#...........................................................................................................
σ_module_path             = Symbol.for 'module-path'

#-----------------------------------------------------------------------------------------------------------
@_new_state = ( settings ) -> {}

#-----------------------------------------------------------------------------------------------------------
@$read_package_info = ( S ) ->
  return $ ( module_path, send ) =>
    package_info                  = require PATH.resolve module_path, 'package.json'
    package_info[ σ_module_path ] = module_path
    send package_info

#-----------------------------------------------------------------------------------------------------------
@$compile_package_info = ( S ) ->
  return $ ( package_info, send ) =>
    Z = {}
    Z[ 'path' ]         = package_info[ σ_module_path ]
    Z[ 'name' ]         = package_info[ 'name' ]
    Z[ 'version' ]      = package_info[ 'version' ]
    Z[ 'dependencies' ] = package_info[ 'dependencies' ]
    send Z

#-----------------------------------------------------------------------------------------------------------
@f = ( handler ) ->
  S     = @_new_state()
  input = D.new_stream()
  #.........................................................................................................
  input
    .pipe @$read_package_info     S
    .pipe @$compile_package_info  S
    .pipe D.$show()
    .pipe $ 'finish', -> handler()
  #.........................................................................................................
  module_path   = '/home/flow/io/mingkwai-ncr'
  D.send  input, module_path
  D.end   input
  #.........................................................................................................
  return null


# ############################################################################################################
# unless module.parent?
#   @f()




