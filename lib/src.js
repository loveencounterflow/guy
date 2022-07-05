(function() {
  'use strict';
  var misfit, types;

  // @PARSER                   = require 'acorn-loose'
  this.STRICT_PARSER = require('acorn');

  this.LOOSE_PARSER = require('acorn-loose');

  this.AST_walk = require('acorn-walk');

  this.ASTRING = require('astring');

  types = new (require('intertype')).Intertype();

  types.defaults = {};

  misfit = Symbol('misfit');

  //-----------------------------------------------------------------------------------------------------------
  types.declare('guy_src_parse_use', {
    tests: {
      "x in [ 'strict', 'loose', 'strict,loose', ]": function(x) {
        return x === 'strict' || x === 'loose' || x === 'strict,loose';
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  types.declare('guy_src_parse_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa_optional.text x.text": function(x) {
        return this.isa_optional.text(x.text);
      },
      "@isa.guy_src_parse_use x.use": function(x) {
        return this.isa.guy_src_parse_use(x.use);
      },
      "@isa_optional.callable x.function": function(x) {
        return this.isa_optional.callable(x.function);
      },
      "must have either x.text or x.function": function(x) {
        return ((x.text != null) && (x.function == null)) || ((x.function != null) && (x.text == null));
      }
    }
  });

  types.defaults.guy_src_parse_cfg = {
    text: null,
    function: null,
    fallback: misfit,
    use: 'strict,loose',
    ecmaVersion: 'latest'
  };

  //-----------------------------------------------------------------------------------------------------------
  types.defaults.guy_src_acorn_cfg = {
    ecmaVersion: 'latest',
    sourceType: void 0,
    onInsertedSemicolon: void 0,
    onTrailingComma: void 0,
    allowReserved: void 0,
    allowReturnOutsideFunction: void 0,
    allowImportExportEverywhere: void 0,
    allowAwaitOutsideFunction: void 0,
    allowSuperOutsideMethod: void 0,
    allowHashBang: void 0,
    locations: void 0,
    onToken: void 0,
    onComment: void 0,
    ranges: void 0,
    program: void 0,
    sourceFile: void 0,
    directSourceFile: void 0,
    preserveParens: void 0
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse = (cfg) => {
    types.validate.guy_src_parse_cfg(cfg = {...types.defaults.guy_src_parse_cfg, ...cfg});
    return this._parse(cfg);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._parse = (cfg) => {
    var _, acorn_cfg, error, fallback, k, text, use;
    text = cfg.function != null ? cfg.function.toString() : cfg.text;
    ({use, fallback} = cfg);
    acorn_cfg = {...types.defaults.guy_src_acorn_cfg};
    for (k in types.defaults.guy_src_acorn_cfg) {
      if (cfg[k] !== void 0) {
        acorn_cfg[k] = cfg[k];
      }
    }
    try {
      switch (use) {
        case 'strict':
          return this.STRICT_PARSER.parse(text, acorn_cfg);
        case 'loose':
          return this.LOOSE_PARSER.parse(text, acorn_cfg);
        case 'strict,loose':
          try {
            return this.STRICT_PARSER.parse(text, acorn_cfg);
          } catch (error1) {
            _ = error1;
          }
          return this.LOOSE_PARSER.parse(text, acorn_cfg);
      }
    } catch (error1) {
      error = error1;
      if (fallback === misfit) {
        throw error;
      }
    }
    return fallback;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._generate = (...P) => {
    return this.ASTRING.generate(...P);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.slug_node_from_simple_function = (cfg) => {
    types.validate.guy_src_parse_cfg(cfg = {...types.defaults.guy_src_parse_cfg, ...cfg});
    return this._slug_node_from_simple_function(cfg);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._slug_node_from_simple_function = (cfg) => {
    var R, ast, collector;
    collector = {
      rtn: [],
      blk: []
    };
    ast = this._parse(cfg);
    if ((ast !== misfit) && (ast === cfg.fallback)) {
      return cfg.fallback;
    }
    this.AST_walk.simple(ast, {
      ReturnStatement: function(node) {
        return collector.rtn.push(node);
      },
      BlockStatement: function(node) {
        return collector.blk.push(node);
      }
    });
    R = null;
    if (collector.rtn.length === 1) {
      return collector.rtn.at(0);
    }
    if (collector.blk.length > 0) {
      return collector.blk.at(-1);
    }
    return ast;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.slug_from_simple_function = (cfg) => {
    var R, ast;
    types.validate.guy_src_parse_cfg(cfg = {...types.defaults.guy_src_parse_cfg, ...cfg});
    ast = this._slug_node_from_simple_function(cfg);
    if ((ast !== misfit) && (ast === cfg.fallback)) {
      return cfg.fallback;
    }
    R = this._generate(ast);
    R = R.trim().replace(/\s*\n\s*/g, ' ');
    switch (ast.type) {
      case 'ReturnStatement':
        R = R.replace(/^return\s*/, '');
        R = R.replace(/;$/, '');
        break;
      case 'BlockStatement':
        R = R.replace(/^\{\s*(.*?)\s*\}$/, '$1');
    }
    return R;
  };

}).call(this);

//# sourceMappingURL=src.js.map