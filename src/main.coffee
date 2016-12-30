
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
_read_latest_version      = require 'latest-version'
{ step, }                 = require 'coffeenode-suspend'
D                         = require 'pipedreams'
{ $, $async, }            = D
require                   'pipedreams/lib/plugin-tabulate'
moment                    = require 'moment'
SEMVER                    = require 'semver'
#...........................................................................................................
σ_module_path             = Symbol.for 'module-path'


#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
@_request = ( url, handler ) ->
  _request url, ( error, response, body ) =>
    return handler error if error?
    switch status = response.statusCode
      when 404
        handler null, {}
      when 200
        handler null, JSON.parse body
      else
        return handler new Error "#{url}\n#{status} -- #{response.statusMessage}"
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@_new_state = ( settings ) ->
  ### TAINT use multimix for options handling ###
  return Object.assign {}, ( require '../options' )

#-----------------------------------------------------------------------------------------------------------
@_find_max_semvers = ( semvers ) ->
  ### choose whether you want all max major versions ###
  #.........................................................................................................
  max_all_semver  = null
  max_v0_semver   = null
  # v0_matcher      = '^0.x' # OK but not so clear; see https://github.com/npm/node-semver#caret-ranges-123-025-004
  v0_matcher      = '>=0.0.0 <1.0.0'
  is_semver       = ( x ) -> ( SEMVER.valid x )?
  is_v0           = ( semver ) -> SEMVER.satisfies semver, v0_matcher
  for semver in semvers
    continue unless is_semver semver
    if max_all_semver? then max_all_semver = semver if SEMVER.gt semver, max_all_semver
    else                    max_all_semver = semver
    if is_v0 semver
      if max_v0_semver? then  max_v0_semver = semver if SEMVER.gt semver, max_v0_semver
      else                    max_v0_semver = semver
  #.........................................................................................................
  return [ max_v0_semver, max_all_semver, ]

#-----------------------------------------------------------------------------------------------------------
@read_latest_version = ( package_name, handler ) ->
  ### TAINT error handling? ###
  ( _read_latest_version package_name ).then ( version ) => handler null, version
  return null


#===========================================================================================================
# TRANFORMS
#-----------------------------------------------------------------------------------------------------------
@$read_package_json = ( S ) ->
  return $ ( package_path, send ) =>
    package_json                  = require PATH.resolve package_path, 'package.json'
    package_json[ σ_module_path ] = package_path
    send package_json

#-----------------------------------------------------------------------------------------------------------
@$compile_pkgnfo = ( S ) ->
  ### `pkgnfo`: package info object ###
  return $ ( package_json, send ) =>
    pkgnfo = {}
    pkgnfo[ 'path' ]                = package_json[ σ_module_path ]
    pkgnfo[ 'name' ]                = package_json[ 'name' ]
    pkgnfo[ 'local' ]               = { version: package_json[ 'version' ], }
    pkgnfo[ 'dependencies' ]        = package_json[ 'dependencies' ]
    #.......................................................................................................
    if package_json[ 'devDependencies' ]?
      for dependency_name, semver_term of package_json[ 'devDependencies' ]
        pkgnfo[ 'dependencies' ][ dependency_name ] = semver_term
    #.......................................................................................................
    send pkgnfo

#-----------------------------------------------------------------------------------------------------------
@$read_npm = ( S ) ->
  version_cache = {}
  return $async ( pkgnfo, send, end ) =>
    #.......................................................................................................
    if pkgnfo?
      pkgnfo[ 'npm' ]                       = {}
      pkgnfo[ 'npm' ][ 'date-by-versions' ] = date_by_versions = {}
      package_name                          = pkgnfo[ 'name' ]
      url                                   = "http://registry.npmjs.org/#{package_name}"
      #.....................................................................................................
      step ( resume ) =>
        npm_info = yield @_request url, resume
        # debug '33372', npm_info[ 'time' ]
        if npm_info[ 'time' ]?
          for npm_version, date_txt of npm_info[ 'time' ]
            ### choose local or universal time ###
            date_by_versions[ npm_version ] = moment date_txt
            # date_by_versions[ npm_version ] = moment.utc date_txt
        for dependency_name, version of pkgnfo[ 'dependencies' ]
          unless ( latest_version = version_cache[ dependency_name ] )?
            latest_version                    = yield @read_latest_version dependency_name, resume
            version_cache[ dependency_name ]  = latest_version
          # debug '88721', package_name, dependency_name, version, latest_version
          ### TAINT shouldn't modify struture, just add data ###
          ### TAINT naming: version, latest_version? ###
          ### TAINT what is called 'version' here is really a version range like '^3.4.5' ###
          pkgnfo[ 'dependencies' ][ dependency_name ] = { version, latest_version, }
        send.done pkgnfo
        return null
    #.......................................................................................................
    if end?
      end()
    #.......................................................................................................
    return null

#-----------------------------------------------------------------------------------------------------------
@$identify_interesting_versions = ( S ) ->
  return $ ( pkgnfo ) =>
    pkgnfo[ 'interesting-versions' ] = target = []
    target.push 'created'
    target.push 'modified'
    for version in @_find_max_semvers Object.keys pkgnfo[ 'npm' ][ 'date-by-versions' ]
      target.push version
    #.......................................................................................................
    return null

#-----------------------------------------------------------------------------------------------------------
@$as_table = ( S ) ->
  # column_count = 2
  # if ( console_width = process.stdout.columns )
  #   width = console_width - column_count * 4 - 1
  # else
  #   width = 108
  table_settings =
    headings:       [ 'package', 'dependency', 'local', 'npm', 'date', ]
    alignment:      'left'
    widths:         [ 30, 30, 12, 12, 25, ]
    # alignments:     [ null, null, 'left', ]
  #.........................................................................................................
  $cast = =>
    return $ ( pkgnfo, send ) =>
      # debug '99928', pkgnfo
      local_version     = pkgnfo[ 'local' ][ 'version'          ]
      date_by_versions  = pkgnfo[ 'npm'   ][ 'date-by-versions' ]
      package_name      = pkgnfo[ 'name' ]
      name_display      = pkgnfo[ 'name' ]
      line_count        = 0
      #.....................................................................................................
      for npm_version, date of date_by_versions
        continue unless npm_version in pkgnfo[ 'interesting-versions' ]
        line_count += +1
        date_txt    = ( date.format 'YYYY MM DD' ) + " (#{date.fromNow()})"
        send [ package_name, '', local_version, npm_version, date_txt, ]
      if line_count < 1
        send [ package_name, '', local_version, '-/-', '-/-', ]
      #.....................................................................................................
      for name, { version, latest_version, } of pkgnfo[ 'dependencies' ]
        send [ package_name, name, version, latest_version, '', ]
  #.........................................................................................................
  $colorize = =>
    prv_package_name = null
    return $ ( row, send ) =>
      # row[ 'date' ] = CND.yellow  row[ 'date' ]
      # row[ 'size' ] = CND.steel   row[ 'size' ]
      # row[ 'name' ] = CND.lime    row[ 'name' ]
      [ package_name, dependency_name, version, latest_version, date, ] = row
      if prv_package_name isnt package_name
        send [ '────────────────────', '────────────────────', '──────', '──────', '──────', ] if package_name?
        prv_package_name = package_name
      color = null
      if dependency_name? and dependency_name.length > 0
        if version? and version.length > 0
          if latest_version? and latest_version.length > 0
            # clean_version = SEMVER.clean version
            clean_version = version.replace /[^.0-9]/g, ''
            # debug '88873',  [ version, latest_version, clean_version]
            try
              diff = SEMVER.diff clean_version, latest_version
            catch error
              diff ?= 'N/A'
            diff ?= 'ok'
            color = CND.grey
            switch diff
              when 'major'  then color = CND.red
              when 'minor'  then color = CND.lime
              when 'patch'  then color = CND.yellow
            # debug '55222', [ version, latest_version, color diff, ]
      if color?
        send [ package_name, dependency_name, version, ( color latest_version ), date, ]
      else
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
    .pipe @$read_package_json               S
    .pipe @$compile_pkgnfo                  S
    .pipe @$read_npm                        S
    .pipe @$identify_interesting_versions   S
    .pipe @$as_table                        S
    .pipe $ 'finish', -> handler()
  #.........................................................................................................
  package_paths = [
    # 'io/guy-test'
    # 'io/guy'
    # 'io/cnd'
    # 'io/kleinbild'
    'io/jizura-datasources'
    # 'io-b/coffeenode-chr'
    # 'io/multimix'
    # 'io/ncr'
    # 'io/pipedreams'
    # 'io/interskiplist'
    # 'io/mingkwai-ncr'
    # 'io/mingkwai-rack'
    # 'io/mingkwai-typesetter'
    # 'io/mingkwai-typesetter-jizura'
    'io/hollerith'
    'io/hollerith-codec'
    # 'io/jizura-db-feeder'
    ]
  for package_path in package_paths
    package_locator = PATH.resolve __dirname, '../../..', package_path
    D.send input, package_locator
  D.end input
  #.........................................................................................................
  return null


# ############################################################################################################
# unless module.parent?
#   @f()




