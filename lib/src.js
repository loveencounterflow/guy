(function() {
  'use strict';
  var H, misfit,
    indexOf = [].indexOf;

  // @PARSER                   = require 'acorn-loose'
  this.STRICT_PARSER = require('acorn');

  this.LOOSE_PARSER = require('acorn-loose');

  this.AST_walk = require('acorn-walk');

  this.ASTRING = require('astring');

  H = require('./_helpers');

  misfit = Symbol('misfit');

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_src_parse_use', {
    tests: {
      "x in [ 'strict', 'loose', 'strict,loose', ]": function(x) {
        return x === 'strict' || x === 'loose' || x === 'strict,loose';
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_src_parse_cfg', {
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

  H.types.defaults.guy_src_parse_cfg = {
    text: null,
    function: null,
    fallback: misfit,
    use: 'strict,loose'
  };

  //-----------------------------------------------------------------------------------------------------------
  H.types.defaults.guy_src_acorn_cfg = {
    ecmaVersion: 'latest'
  };

  // # sourceType:                   'script'
  // onInsertedSemicolon:          undefined
  // onTrailingComma:              undefined
  // allowReserved:                undefined
  // allowReturnOutsideFunction:   undefined
  // allowImportExportEverywhere:  undefined
  // allowAwaitOutsideFunction:    undefined
  // allowSuperOutsideMethod:      undefined
  // allowHashBang:                undefined
  // locations:                    undefined
  // onToken:                      undefined
  // onComment:                    undefined
  // ranges:                       undefined
  // program:                      undefined
  // sourceFile:                   undefined
  // directSourceFile:             undefined
  // preserveParens:               undefined

  //-----------------------------------------------------------------------------------------------------------
  this.parse = (cfg) => {
    H.types.validate.guy_src_parse_cfg(cfg = {...H.types.defaults.guy_src_parse_cfg, ...cfg});
    return this._parse(cfg);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._parse = (cfg) => {
    var _, acorn_cfg, error, fallback, k, text, use;
    text = cfg.function != null ? cfg.function.toString() : cfg.text;
    ({use, fallback} = cfg);
    acorn_cfg = {...H.types.defaults.guy_src_acorn_cfg};
    if (indexOf.call(H.types.defaults.guy_src_parse_cfg, k) < 0) {
      for (k in cfg) {
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
    H.types.validate.guy_src_parse_cfg(cfg = {...H.types.defaults.guy_src_parse_cfg, ...cfg});
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
    H.types.validate.guy_src_parse_cfg(cfg = {...H.types.defaults.guy_src_parse_cfg, ...cfg});
    ast = this._slug_node_from_simple_function(cfg);
    if ((ast !== misfit) && (ast === cfg.fallback)) {
      return cfg.fallback;
    }
    R = this._generate(ast);
    R = R.trim().replace(/\s*\n\s*/g, ' ');
    if (R === '{ [native, code]; }') {
      if (cfg.fallback !== misfit) {
        return cfg.fallback;
      }
      throw new Error("^guy.src.slug_node_from_simple_function@1^ unable to parse native code");
    }
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