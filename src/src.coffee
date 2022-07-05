
'use strict'

# @PARSER                   = require 'acorn-loose'
@STRICT_PARSER            = require 'acorn'
@LOOSE_PARSER             = require 'acorn-loose'
@AST_walk                 = require 'acorn-walk'
@ASTRING                  = require 'astring'
types                     = new ( require 'intertype' ).Intertype()
types.defaults            = {}
misfit                    = Symbol 'misfit'


#-----------------------------------------------------------------------------------------------------------
types.declare 'guy_src_parse_use', tests:
  "x in [ 'strict', 'loose', 'strict,loose', ]": ( x ) -> x in [ 'strict', 'loose', 'strict,loose', ]

#-----------------------------------------------------------------------------------------------------------
types.declare 'guy_src_parse_cfg', tests:
  "@isa.object x":                          ( x ) -> @isa.object x
  "@isa_optional.text x.text":              ( x ) -> @isa_optional.text x.text
  "@isa.guy_src_parse_use x.use":           ( x ) -> @isa.guy_src_parse_use x.use
  "@isa_optional.callable x.function":      ( x ) -> @isa_optional.callable x.function
  "must have either x.text or x.function":  ( x ) ->
    return ( x.text? and not x.function? ) or ( x.function? and not x.text? )
types.defaults.guy_src_parse_cfg =
  text:         null
  function:     null
  fallback:     misfit
  use:          'strict,loose'
  ecmaVersion:  'latest'

#-----------------------------------------------------------------------------------------------------------
@parse = ( cfg ) =>
  types.validate.guy_src_parse_cfg cfg = { types.defaults.guy_src_parse_cfg..., cfg..., }
  text          = if cfg.function? then cfg.function.toString() else cfg.text
  { use
    fallback  } = cfg
  delete cfg.fallback
  delete cfg.function
  delete cfg.text
  delete cfg.use
  try
    switch use
      when 'strict'       then return @STRICT_PARSER.parse  text, cfg
      when 'loose'        then return @LOOSE_PARSER.parse   text, cfg
      when 'strict,loose'
        try return @STRICT_PARSER.parse text, cfg catch _
        return @LOOSE_PARSER.parse text, cfg
  catch error
    throw error if fallback is misfit
  return fallback

#-----------------------------------------------------------------------------------------------------------
@_generate = ( P... ) => @ASTRING.generate P...

#-----------------------------------------------------------------------------------------------------------
@slug_node_from_simple_function = ( cfg ) =>
  collector =
    rtn:    []
    blk:    []
  ast       = @parse cfg
  @AST_walk.simple ast,
    ReturnStatement:      ( node ) -> collector.rtn.push node
    BlockStatement:       ( node ) -> collector.blk.push node
  R = null
  if collector.rtn.length is 1 then return collector.rtn.at 0
  if collector.blk.length >  0 then return collector.blk.at -1
  return cfg.fallback unless cfg.fallback is misfit
  throw new Error "^guy.props.src@1^ unable to parse input"

#-----------------------------------------------------------------------------------------------------------
@slug_from_simple_function = ( cfg ) =>
  ast = @slug_node_from_simple_function cfg
  switch ast.type
    when 'ReturnStatement'
      R = @_generate ast
      R = R.trim().replace /\s*\n\s*/g, ' '
      R = R.replace /^return\s*/, ''
      R = R.replace /;$/, ''
    when 'BlockStatement'
      R = @_generate ast
      R = R.trim().replace /\s*\n\s*/g, ' '
      R = R.replace /^\{\s*(.*?)\s*\}$/, '$1'
    else
      throw new Error "^guy.props.src@1^ unable to parse input"
  return R



