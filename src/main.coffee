
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
_request                  = require 'request'
{ step, }                 = require 'coffeenode-suspend'
D                         = require 'pipedreams'
{ $, $async, }            = D
#...........................................................................................................
σ_module_path             = Symbol.for 'module-path'


#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
@_request = ( url, handler ) ->
  _request url, ( error, response, body ) =>
    return handler error if error?
    unless ( status = response.statusCode ) is 200
      return handler new Error "#{url}\n#{status} -- #{response.statusMessage}"
    handler null, JSON.parse body
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@_new_state = ( settings ) ->
  ### TAINT use multimix for options handling ###
  return Object.assign {}, ( require '../options' )


#===========================================================================================================
# TRANFORMS
#-----------------------------------------------------------------------------------------------------------
@$read_package_json = ( S ) ->
  return $ ( package_path, send ) =>
    package_json                  = require PATH.resolve package_path, 'package.json'
    package_json[ σ_module_path ] = package_path
    send package_json

#-----------------------------------------------------------------------------------------------------------
@$compile_package_info = ( S ) ->
  return $ ( package_json, send ) =>
    Z = {}
    Z[ 'path' ]           = package_json[ σ_module_path ]
    Z[ 'name' ]           = package_json[ 'name' ]
    Z[ 'local-version' ]  = package_json[ 'version' ]
    Z[ 'dependencies' ]   = package_json[ 'dependencies' ]
    send Z

#-----------------------------------------------------------------------------------------------------------
@$read_npm = ( S ) ->
  return $async ( package_info, send, end ) =>
    #.......................................................................................................
    if package_info?
      package_name  = package_info[ 'name' ]
      url           = "http://registry.npmjs.org/#{package_name}"
      step ( resume ) =>
        npm_info = yield @_request url, resume
        debug package_name
        package_info[ 'npm-latest-version'  ] = npm_info[ 'dist-tags' ]?[ 'latest' ] ? null
        package_info[ 'npm-all-versions'    ] = Object.keys npm_info[ 'versions' ] ? {}
        send.done package_info
    #.......................................................................................................
    if end?
      end()


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@f = ( handler ) ->
  S     = @_new_state()
  debug '9921', S
  input = D.new_stream()
  #.........................................................................................................
  input
    .pipe @$read_package_json     S
    .pipe @$compile_package_info  S
    .pipe @$read_npm              S
    .pipe D.$show()
    .pipe $ 'finish', -> handler()
  #.........................................................................................................
  package_path = '/home/flow/io/mingkwai-ncr'
  package_path = '/home/flow/io/interskiplist'
  D.send  input, package_path
  D.end   input
  #.........................................................................................................
  return null


# ############################################################################################################
# unless module.parent?
#   @f()




