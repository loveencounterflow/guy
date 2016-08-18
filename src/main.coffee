
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
require                   'pipedreams/lib/plugin-tabulate'
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
@$compile_nfo = ( S ) ->
  ### `nfo`: package info object ###
  return $ ( package_json, send ) =>
    Z = {}
    Z[ 'path' ]           = package_json[ σ_module_path ]
    Z[ 'name' ]           = package_json[ 'name' ]
    Z[ 'local-version' ]  = package_json[ 'version' ]
    Z[ 'dependencies' ]   = package_json[ 'dependencies' ]
    send Z

#-----------------------------------------------------------------------------------------------------------
@$read_npm = ( S ) ->
  return $async ( nfo, send, end ) =>
    #.......................................................................................................
    if nfo?
      package_name  = nfo[ 'name' ]
      url           = "http://registry.npmjs.org/#{package_name}"
      step ( resume ) =>
        npm_info = yield @_request url, resume
        nfo[ 'npm-latest-version'  ] = npm_info[ 'dist-tags' ]?[ 'latest' ] ? null
        nfo[ 'npm-all-versions'    ] = Object.keys npm_info[ 'versions' ] ? {}
        send.done nfo
    #.......................................................................................................
    if end?
      end()

#-----------------------------------------------------------------------------------------------------------
@$as_table = ( S ) ->
  # column_count = 2
  # if ( console_width = process.stdout.columns )
  #   width = console_width - column_count * 4 - 1
  # else
  #   width = 108
  table_settings =
    headings:       [ 'name', 'local', 'npm', ]
    alignment:      'left'
    # keys:           [ 'name', 'local-version', ]
    # width:          width
    widths:         [ 30, 12, ]
    # alignments:     [ null, null, 'left', ]
  #.........................................................................................................
  $cast = =>
    return $ ( nfo, send ) =>
      local_version               = nfo[ 'local-version' ]
      local_version_is_published  = no
      #.....................................................................................................
      if ( npm_versions = nfo[ 'npm-all-versions' ] )?
        name_display = nfo[ 'name' ]
        for npm_version in npm_versions
          if local_version is npm_version
            local_version_is_published = yes
            send [ name_display, local_version, npm_version, ]
          else
            send [ name_display, '— ··· —', npm_version, ]
          name_display = '  — ··· —'
        unless local_version_is_published
          send [ name_display, local_version, '-/-', ]
      #.....................................................................................................
      else
        send [ nfo[ 'name' ], local_version, '-/-', ]
      #.....................................................................................................
      for name, version of nfo[ 'dependencies' ]
        ### TAINT ###
        send [ name, version, '', ]
  #.........................................................................................................
  $colorize = =>
    return $ ( row, send ) =>
      # row[ 'date' ] = CND.yellow  row[ 'date' ]
      # row[ 'size' ] = CND.steel   row[ 'size' ]
      # row[ 'name' ] = CND.lime    row[ 'name' ]
      send row
  #.........................................................................................................
  $show = =>
    return $ ( row ) => echo row
  #.........................................................................................................
  return D.new_stream pipeline: [
    $cast()
    $colorize()
    ( D.$tabulate table_settings )
    $show()
    ]


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@f = ( handler ) ->
  S     = @_new_state()
  input = D.new_stream()
  #.........................................................................................................
  input
    .pipe @$read_package_json     S
    .pipe @$compile_nfo           S
    .pipe @$read_npm              S
    # .pipe D.$show()
    .pipe @$as_table              S
    .pipe $ 'finish', -> handler()
  #.........................................................................................................
  package_paths = [
    '/home/flow/io/mingkwai-ncr'
    '/home/flow/io/interskiplist'
    '/home/flow/io/pipedreams'
    ]
  for package_path in package_paths
    D.send  input, package_path
  D.end   input
  #.........................................................................................................
  return null


# ############################################################################################################
# unless module.parent?
#   @f()




