(function() {
  // 'use strict'

  // # @PARSER                   = require 'acorn-loose'
// @STRICT_PARSER            = require 'acorn'
// @LOOSE_PARSER             = require 'acorn-loose'
// @AST_walk                 = require 'acorn-walk'
// @ASTRING                  = require 'astring'
// H                         = require './_helpers'
// misfit                    = Symbol 'misfit'

  // #-----------------------------------------------------------------------------------------------------------
// H.types.declare 'guy_src_parse_use', tests:
//   "x in [ 'strict', 'loose', 'strict,loose', ]": ( x ) -> x in [ 'strict', 'loose', 'strict,loose', ]

  // #-----------------------------------------------------------------------------------------------------------
// H.types.declare 'guy_src_parse_cfg', tests:
//   "@isa.object x":                          ( x ) -> @isa.object x
//   "@isa_optional.text x.text":              ( x ) -> @isa_optional.text x.text
//   "@isa.guy_src_parse_use x.use":           ( x ) -> @isa.guy_src_parse_use x.use
//   "@isa_optional.callable x.function":      ( x ) -> @isa_optional.callable x.function
//   "must have either x.text or x.function":  ( x ) ->
//     return ( x.text? and not x.function? ) or ( x.function? and not x.text? )
// H.types.defaults.guy_src_parse_cfg =
//   text:         null
//   function:     null
//   fallback:     misfit
//   use:          'strict,loose'

  // #-----------------------------------------------------------------------------------------------------------
// H.types.defaults.guy_src_acorn_cfg =
//   ecmaVersion:                  'latest'
//   # # sourceType:                   'script'
//   # onInsertedSemicolon:          undefined
//   # onTrailingComma:              undefined
//   # allowReserved:                undefined
//   # allowReturnOutsideFunction:   undefined
//   # allowImportExportEverywhere:  undefined
//   # allowAwaitOutsideFunction:    undefined
//   # allowSuperOutsideMethod:      undefined
//   # allowHashBang:                undefined
//   # locations:                    undefined
//   # onToken:                      undefined
//   # onComment:                    undefined
//   # ranges:                       undefined
//   # program:                      undefined
//   # sourceFile:                   undefined
//   # directSourceFile:             undefined
//   # preserveParens:               undefined

  // #-----------------------------------------------------------------------------------------------------------
// @parse = ( cfg ) =>
//   H.types.validate.guy_src_parse_cfg cfg = { H.types.defaults.guy_src_parse_cfg..., cfg..., }
//   return @_parse cfg

  // #-----------------------------------------------------------------------------------------------------------
// @_parse = ( cfg ) =>
//   text            = if cfg.function? then cfg.function.toString() else cfg.text
//   text            = text.replace /\s*\n\s*/g, ' '
//   { use
//     fallback  }   = cfg
//   acorn_cfg       = { H.types.defaults.guy_src_acorn_cfg..., }
//   acorn_cfg[ k ]  = cfg[ k ] for k of cfg unless k in H.types.defaults.guy_src_parse_cfg
//   try
//     switch use
//       when 'strict'       then return @STRICT_PARSER.parse  text, acorn_cfg
//       when 'loose'        then return @LOOSE_PARSER.parse   text, acorn_cfg
//       when 'strict,loose'
//         try return @STRICT_PARSER.parse text, acorn_cfg catch _
//         return @LOOSE_PARSER.parse text, acorn_cfg
//   catch error
//     throw error if fallback is misfit
//   return fallback

  // #-----------------------------------------------------------------------------------------------------------
// @_generate = ( P... ) => @ASTRING.generate P...

  // #-----------------------------------------------------------------------------------------------------------
// @slug_node_from_simple_function = ( cfg ) =>
//   H.types.validate.guy_src_parse_cfg cfg = { H.types.defaults.guy_src_parse_cfg..., cfg..., }
//   return @_slug_node_from_simple_function cfg

  // #-----------------------------------------------------------------------------------------------------------
// @_slug_node_from_simple_function = ( cfg ) =>
//   collector =
//     rtn:    []
//     blk:    []
//   ast       = @_parse cfg
//   return cfg.fallback if ( ast isnt misfit ) and ( ast is cfg.fallback )
//   @AST_walk.simple ast,
//     ReturnStatement:      ( node ) -> collector.rtn.push node
//     BlockStatement:       ( node ) -> collector.blk.push node
//   R = null
//   return collector.rtn.at 0   if collector.rtn.length is 1
//   return collector.blk.at -1  if collector.blk.length >  0
//   return ast

  // #-----------------------------------------------------------------------------------------------------------
// @slug_from_simple_function = ( cfg ) =>
//   H.types.validate.guy_src_parse_cfg cfg = { H.types.defaults.guy_src_parse_cfg..., cfg..., }
//   ast = @_slug_node_from_simple_function cfg
//   return cfg.fallback if ( ast isnt misfit ) and ( ast is cfg.fallback )
//   R = @_generate ast
//   R = R.trim().replace /\s*\n\s*/g, ' '
//   if R is '{ [native, code]; }'
//     return cfg.fallback unless cfg.fallback is misfit
//     throw new Error "^guy.src.slug_node_from_simple_function@1^ unable to parse native code"
//   switch ast.type
//     when 'ReturnStatement'
//       R = R.replace /^return\s*/, ''
//       R = R.replace /;$/, ''
//     when 'BlockStatement'
//       R = R.replace /^\{\s*(.*?)\s*\}$/, '$1'
//   return R


}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NyYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBa0hZO0VBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICd1c2Ugc3RyaWN0J1xuXG4jICMgQFBBUlNFUiAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2Fjb3JuLWxvb3NlJ1xuIyBAU1RSSUNUX1BBUlNFUiAgICAgICAgICAgID0gcmVxdWlyZSAnYWNvcm4nXG4jIEBMT09TRV9QQVJTRVIgICAgICAgICAgICAgPSByZXF1aXJlICdhY29ybi1sb29zZSdcbiMgQEFTVF93YWxrICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2Fjb3JuLXdhbGsnXG4jIEBBU1RSSU5HICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdhc3RyaW5nJ1xuIyBIICAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9faGVscGVycydcbiMgbWlzZml0ICAgICAgICAgICAgICAgICAgICA9IFN5bWJvbCAnbWlzZml0J1xuXG5cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEgudHlwZXMuZGVjbGFyZSAnZ3V5X3NyY19wYXJzZV91c2UnLCB0ZXN0czpcbiMgICBcInggaW4gWyAnc3RyaWN0JywgJ2xvb3NlJywgJ3N0cmljdCxsb29zZScsIF1cIjogKCB4ICkgLT4geCBpbiBbICdzdHJpY3QnLCAnbG9vc2UnLCAnc3RyaWN0LGxvb3NlJywgXVxuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBILnR5cGVzLmRlY2xhcmUgJ2d1eV9zcmNfcGFyc2VfY2ZnJywgdGVzdHM6XG4jICAgXCJAaXNhLm9iamVjdCB4XCI6ICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLm9iamVjdCB4XG4jICAgXCJAaXNhX29wdGlvbmFsLnRleHQgeC50ZXh0XCI6ICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhX29wdGlvbmFsLnRleHQgeC50ZXh0XG4jICAgXCJAaXNhLmd1eV9zcmNfcGFyc2VfdXNlIHgudXNlXCI6ICAgICAgICAgICAoIHggKSAtPiBAaXNhLmd1eV9zcmNfcGFyc2VfdXNlIHgudXNlXG4jICAgXCJAaXNhX29wdGlvbmFsLmNhbGxhYmxlIHguZnVuY3Rpb25cIjogICAgICAoIHggKSAtPiBAaXNhX29wdGlvbmFsLmNhbGxhYmxlIHguZnVuY3Rpb25cbiMgICBcIm11c3QgaGF2ZSBlaXRoZXIgeC50ZXh0IG9yIHguZnVuY3Rpb25cIjogICggeCApIC0+XG4jICAgICByZXR1cm4gKCB4LnRleHQ/IGFuZCBub3QgeC5mdW5jdGlvbj8gKSBvciAoIHguZnVuY3Rpb24/IGFuZCBub3QgeC50ZXh0PyApXG4jIEgudHlwZXMuZGVmYXVsdHMuZ3V5X3NyY19wYXJzZV9jZmcgPVxuIyAgIHRleHQ6ICAgICAgICAgbnVsbFxuIyAgIGZ1bmN0aW9uOiAgICAgbnVsbFxuIyAgIGZhbGxiYWNrOiAgICAgbWlzZml0XG4jICAgdXNlOiAgICAgICAgICAnc3RyaWN0LGxvb3NlJ1xuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBILnR5cGVzLmRlZmF1bHRzLmd1eV9zcmNfYWNvcm5fY2ZnID1cbiMgICBlY21hVmVyc2lvbjogICAgICAgICAgICAgICAgICAnbGF0ZXN0J1xuIyAgICMgIyBzb3VyY2VUeXBlOiAgICAgICAgICAgICAgICAgICAnc2NyaXB0J1xuIyAgICMgb25JbnNlcnRlZFNlbWljb2xvbjogICAgICAgICAgdW5kZWZpbmVkXG4jICAgIyBvblRyYWlsaW5nQ29tbWE6ICAgICAgICAgICAgICB1bmRlZmluZWRcbiMgICAjIGFsbG93UmVzZXJ2ZWQ6ICAgICAgICAgICAgICAgIHVuZGVmaW5lZFxuIyAgICMgYWxsb3dSZXR1cm5PdXRzaWRlRnVuY3Rpb246ICAgdW5kZWZpbmVkXG4jICAgIyBhbGxvd0ltcG9ydEV4cG9ydEV2ZXJ5d2hlcmU6ICB1bmRlZmluZWRcbiMgICAjIGFsbG93QXdhaXRPdXRzaWRlRnVuY3Rpb246ICAgIHVuZGVmaW5lZFxuIyAgICMgYWxsb3dTdXBlck91dHNpZGVNZXRob2Q6ICAgICAgdW5kZWZpbmVkXG4jICAgIyBhbGxvd0hhc2hCYW5nOiAgICAgICAgICAgICAgICB1bmRlZmluZWRcbiMgICAjIGxvY2F0aW9uczogICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZFxuIyAgICMgb25Ub2tlbjogICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkXG4jICAgIyBvbkNvbW1lbnQ6ICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWRcbiMgICAjIHJhbmdlczogICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZFxuIyAgICMgcHJvZ3JhbTogICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkXG4jICAgIyBzb3VyY2VGaWxlOiAgICAgICAgICAgICAgICAgICB1bmRlZmluZWRcbiMgICAjIGRpcmVjdFNvdXJjZUZpbGU6ICAgICAgICAgICAgIHVuZGVmaW5lZFxuIyAgICMgcHJlc2VydmVQYXJlbnM6ICAgICAgICAgICAgICAgdW5kZWZpbmVkXG5cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEBwYXJzZSA9ICggY2ZnICkgPT5cbiMgICBILnR5cGVzLnZhbGlkYXRlLmd1eV9zcmNfcGFyc2VfY2ZnIGNmZyA9IHsgSC50eXBlcy5kZWZhdWx0cy5ndXlfc3JjX3BhcnNlX2NmZy4uLiwgY2ZnLi4uLCB9XG4jICAgcmV0dXJuIEBfcGFyc2UgY2ZnXG5cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEBfcGFyc2UgPSAoIGNmZyApID0+XG4jICAgdGV4dCAgICAgICAgICAgID0gaWYgY2ZnLmZ1bmN0aW9uPyB0aGVuIGNmZy5mdW5jdGlvbi50b1N0cmluZygpIGVsc2UgY2ZnLnRleHRcbiMgICB0ZXh0ICAgICAgICAgICAgPSB0ZXh0LnJlcGxhY2UgL1xccypcXG5cXHMqL2csICcgJ1xuIyAgIHsgdXNlXG4jICAgICBmYWxsYmFjayAgfSAgID0gY2ZnXG4jICAgYWNvcm5fY2ZnICAgICAgID0geyBILnR5cGVzLmRlZmF1bHRzLmd1eV9zcmNfYWNvcm5fY2ZnLi4uLCB9XG4jICAgYWNvcm5fY2ZnWyBrIF0gID0gY2ZnWyBrIF0gZm9yIGsgb2YgY2ZnIHVubGVzcyBrIGluIEgudHlwZXMuZGVmYXVsdHMuZ3V5X3NyY19wYXJzZV9jZmdcbiMgICB0cnlcbiMgICAgIHN3aXRjaCB1c2VcbiMgICAgICAgd2hlbiAnc3RyaWN0JyAgICAgICB0aGVuIHJldHVybiBAU1RSSUNUX1BBUlNFUi5wYXJzZSAgdGV4dCwgYWNvcm5fY2ZnXG4jICAgICAgIHdoZW4gJ2xvb3NlJyAgICAgICAgdGhlbiByZXR1cm4gQExPT1NFX1BBUlNFUi5wYXJzZSAgIHRleHQsIGFjb3JuX2NmZ1xuIyAgICAgICB3aGVuICdzdHJpY3QsbG9vc2UnXG4jICAgICAgICAgdHJ5IHJldHVybiBAU1RSSUNUX1BBUlNFUi5wYXJzZSB0ZXh0LCBhY29ybl9jZmcgY2F0Y2ggX1xuIyAgICAgICAgIHJldHVybiBATE9PU0VfUEFSU0VSLnBhcnNlIHRleHQsIGFjb3JuX2NmZ1xuIyAgIGNhdGNoIGVycm9yXG4jICAgICB0aHJvdyBlcnJvciBpZiBmYWxsYmFjayBpcyBtaXNmaXRcbiMgICByZXR1cm4gZmFsbGJhY2tcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQF9nZW5lcmF0ZSA9ICggUC4uLiApID0+IEBBU1RSSU5HLmdlbmVyYXRlIFAuLi5cblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQHNsdWdfbm9kZV9mcm9tX3NpbXBsZV9mdW5jdGlvbiA9ICggY2ZnICkgPT5cbiMgICBILnR5cGVzLnZhbGlkYXRlLmd1eV9zcmNfcGFyc2VfY2ZnIGNmZyA9IHsgSC50eXBlcy5kZWZhdWx0cy5ndXlfc3JjX3BhcnNlX2NmZy4uLiwgY2ZnLi4uLCB9XG4jICAgcmV0dXJuIEBfc2x1Z19ub2RlX2Zyb21fc2ltcGxlX2Z1bmN0aW9uIGNmZ1xuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBAX3NsdWdfbm9kZV9mcm9tX3NpbXBsZV9mdW5jdGlvbiA9ICggY2ZnICkgPT5cbiMgICBjb2xsZWN0b3IgPVxuIyAgICAgcnRuOiAgICBbXVxuIyAgICAgYmxrOiAgICBbXVxuIyAgIGFzdCAgICAgICA9IEBfcGFyc2UgY2ZnXG4jICAgcmV0dXJuIGNmZy5mYWxsYmFjayBpZiAoIGFzdCBpc250IG1pc2ZpdCApIGFuZCAoIGFzdCBpcyBjZmcuZmFsbGJhY2sgKVxuIyAgIEBBU1Rfd2Fsay5zaW1wbGUgYXN0LFxuIyAgICAgUmV0dXJuU3RhdGVtZW50OiAgICAgICggbm9kZSApIC0+IGNvbGxlY3Rvci5ydG4ucHVzaCBub2RlXG4jICAgICBCbG9ja1N0YXRlbWVudDogICAgICAgKCBub2RlICkgLT4gY29sbGVjdG9yLmJsay5wdXNoIG5vZGVcbiMgICBSID0gbnVsbFxuIyAgIHJldHVybiBjb2xsZWN0b3IucnRuLmF0IDAgICBpZiBjb2xsZWN0b3IucnRuLmxlbmd0aCBpcyAxXG4jICAgcmV0dXJuIGNvbGxlY3Rvci5ibGsuYXQgLTEgIGlmIGNvbGxlY3Rvci5ibGsubGVuZ3RoID4gIDBcbiMgICByZXR1cm4gYXN0XG5cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEBzbHVnX2Zyb21fc2ltcGxlX2Z1bmN0aW9uID0gKCBjZmcgKSA9PlxuIyAgIEgudHlwZXMudmFsaWRhdGUuZ3V5X3NyY19wYXJzZV9jZmcgY2ZnID0geyBILnR5cGVzLmRlZmF1bHRzLmd1eV9zcmNfcGFyc2VfY2ZnLi4uLCBjZmcuLi4sIH1cbiMgICBhc3QgPSBAX3NsdWdfbm9kZV9mcm9tX3NpbXBsZV9mdW5jdGlvbiBjZmdcbiMgICByZXR1cm4gY2ZnLmZhbGxiYWNrIGlmICggYXN0IGlzbnQgbWlzZml0ICkgYW5kICggYXN0IGlzIGNmZy5mYWxsYmFjayApXG4jICAgUiA9IEBfZ2VuZXJhdGUgYXN0XG4jICAgUiA9IFIudHJpbSgpLnJlcGxhY2UgL1xccypcXG5cXHMqL2csICcgJ1xuIyAgIGlmIFIgaXMgJ3sgW25hdGl2ZSwgY29kZV07IH0nXG4jICAgICByZXR1cm4gY2ZnLmZhbGxiYWNrIHVubGVzcyBjZmcuZmFsbGJhY2sgaXMgbWlzZml0XG4jICAgICB0aHJvdyBuZXcgRXJyb3IgXCJeZ3V5LnNyYy5zbHVnX25vZGVfZnJvbV9zaW1wbGVfZnVuY3Rpb25AMV4gdW5hYmxlIHRvIHBhcnNlIG5hdGl2ZSBjb2RlXCJcbiMgICBzd2l0Y2ggYXN0LnR5cGVcbiMgICAgIHdoZW4gJ1JldHVyblN0YXRlbWVudCdcbiMgICAgICAgUiA9IFIucmVwbGFjZSAvXnJldHVyblxccyovLCAnJ1xuIyAgICAgICBSID0gUi5yZXBsYWNlIC87JC8sICcnXG4jICAgICB3aGVuICdCbG9ja1N0YXRlbWVudCdcbiMgICAgICAgUiA9IFIucmVwbGFjZSAvXlxce1xccyooLio/KVxccypcXH0kLywgJyQxJ1xuIyAgIHJldHVybiBSXG5cblxuXG4iXX0=
//# sourceURL=../src/src.coffee