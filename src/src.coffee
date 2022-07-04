
'use strict'

# @PARSER                   = require 'acorn-loose'
@STRICT_PARSER            = require 'acorn'
@LOOSE_PARSER             = require 'acorn-loose'
@AST_WALKER               = require 'acorn-walk'
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
  ast = @parse cfg

#-----------------------------------------------------------------------------------------------------------
@slug_from_simple_function = ( cfg ) => @_generate @slug_node_from_simple_function cfg

  # debug parser.parse ( ( x ) -> @isa.foo x ).toString(), { ecmaVersion: '2022', }
  # urge generate { type: 'Program', start: 0, end: 49, body: [ { type: 'FunctionDeclaration', start: 0, end: 49, id: { type: 'Identifier', start: 8, end: 8, name: '✖' }, params: [ { type: 'Identifier', start: 9, end: 10, name: 'x' } ], generator: false, expression: false, async: false, body: { type: 'BlockStatement', start: 12, end: 49, body: [ { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } } ] } } ], sourceType: 'script' }
  # urge generate { type: 'BlockStatement', start: 12, end: 49, body: [ { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } } ] }
  # urge generate { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } }



