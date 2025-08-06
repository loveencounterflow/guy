(function() {
  'use strict';
  var H, defaults;

  //###########################################################################################################
  H = require('./_helpers');

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_str_walk_lines_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.boolean x.trim": function(x) {
        return this.isa.boolean(x.trim);
      },
      "@isa.text x.prepend": function(x) {
        return this.isa.text(x.prepend);
      },
      "@isa.text x.append": function(x) {
        return this.isa.text(x.append);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  defaults = {
    guy_str_walk_lines_cfg: {
      trim: true,
      prepend: '',
      append: ''
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  /* thx to https://stackoverflow.com/a/6969486/7568091 and
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping */
  this.escape_for_regex = function(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  //---------------------------------------------------------------------------------------------------------
  /* thx to https://www.designcise.com/web/tutorial/which-characters-need-to-be-escaped-in-a-regular-expression-class */
  this.escape_for_regex_class = function(text) {
    return text.replace(/([\^\-\]\/])/g, '\\$1');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines = function*(text, cfg) {
    var line, y;
    for (y of this.walk_lines_with_positions(text, cfg)) {
      ({line} = y);
      yield line;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines_with_positions = function*(text, cfg) {
    var append, eol, idx, last_position, line, linenl, lnr, match, pattern, prepend, trim;
    H.types.validate.guy_str_walk_lines_cfg((cfg = {...defaults.guy_str_walk_lines_cfg, ...cfg}));
    ({trim, prepend, append} = cfg);
    //.........................................................................................................
    if (text === '') {
      yield ({
        lnr: 1,
        line: '',
        eol: ''
      });
      return null;
    }
    //.........................................................................................................
    lnr = 0;
    pattern = /(.*?)(\r\n|\r|\n|$)/suy;
    last_position = text.length - 1;
    while (true) {
      //.........................................................................................................
      idx = pattern.lastIndex;
      if (pattern.lastIndex > last_position) {
        break;
      }
      if ((match = text.match(pattern)) == null) {
        break;
      }
      [linenl, line, eol] = match;
      lnr++;
      line = match[1];
      if (trim) {
        line = line.trimEnd();
      }
      if (prepend !== '') {
        line = prepend + line;
      }
      if (append !== '') {
        line = line + append;
      }
      yield ({lnr, line, eol});
    }
    //.........................................................................................................
    if ((text.match(/(\r|\n)$/)) != null) {
      lnr++;
      yield ({
        lnr,
        line: '',
        eol: ''
      });
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pluralize = function(word) {
    var R, to_upper;
    /* thx to https://github.com/sindresorhus/plur/blob/main/index.js */
    H.types.validate.text(word);
    if (word === '') {
      return '';
    }
    R = word;
    R = R.replace(/(?:s|x|z|ch|sh)$/i, '$&e');
    R = R.replace(/([^aeiou])y$/i, '$1ie');
    R += 's';
    if ((to_upper = /\p{Lu}$/u.test(word))) {
      R = R.replace(/i?e?s$/i, (match) => {
        return match.toUpperCase();
      });
    }
    return R;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.SQL = function(parts, ...expressions) {
    var R, expression, i, idx, len;
    R = parts[0];
    for (idx = i = 0, len = expressions.length; i < len; idx = ++i) {
      expression = expressions[idx];
      R += expression.toString() + parts[idx + 1];
    }
    return R;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N0ci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQTtBQUFBLE1BQUEsQ0FBQSxFQUFBLFFBQUE7OztFQUdBLENBQUEsR0FBNEIsT0FBQSxDQUFRLFlBQVIsRUFINUI7OztFQU9BLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBUixDQUFnQix3QkFBaEIsRUFBMEM7SUFBQSxLQUFBLEVBQ3hDO01BQUEsZUFBQSxFQUEwQixRQUFBLENBQUUsQ0FBRixDQUFBO2VBQVMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLENBQVksQ0FBWjtNQUFULENBQTFCO01BQ0EscUJBQUEsRUFBMEIsUUFBQSxDQUFFLENBQUYsQ0FBQTtlQUFTLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFhLENBQUMsQ0FBQyxJQUFmO01BQVQsQ0FEMUI7TUFFQSxxQkFBQSxFQUEwQixRQUFBLENBQUUsQ0FBRixDQUFBO2VBQVMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLENBQVUsQ0FBQyxDQUFDLE9BQVo7TUFBVCxDQUYxQjtNQUdBLG9CQUFBLEVBQTBCLFFBQUEsQ0FBRSxDQUFGLENBQUE7ZUFBUyxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBVSxDQUFDLENBQUMsTUFBWjtNQUFUO0lBSDFCO0VBRHdDLENBQTFDLEVBUEE7OztFQWNBLFFBQUEsR0FDRTtJQUFBLHNCQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQWdCLElBQWhCO01BQ0EsT0FBQSxFQUFnQixFQURoQjtNQUVBLE1BQUEsRUFBZ0I7SUFGaEI7RUFERixFQWZGOzs7OztFQXdCQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsUUFBQSxDQUFFLElBQUYsQ0FBQTtXQUFZLElBQUksQ0FBQyxPQUFMLENBQWEscUJBQWIsRUFBb0MsTUFBcEM7RUFBWixFQXhCcEI7Ozs7RUE0QkEsSUFBQyxDQUFBLHNCQUFELEdBQTBCLFFBQUEsQ0FBRSxJQUFGLENBQUE7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QUROOztBQUVBLFdBQU87RUFWSSxFQXRFYjs7Ozs7RUFzRkEsSUFBQyxDQUFBLEdBQUQsR0FBTyxRQUFBLENBQUUsS0FBRixFQUFBLEdBQVMsV0FBVCxDQUFBO0FBQ1AsUUFBQSxDQUFBLEVBQUEsVUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUE7SUFBRSxDQUFBLEdBQUksS0FBSyxDQUFFLENBQUY7SUFDVCxLQUFBLHlEQUFBOztNQUNFLENBQUEsSUFBSyxVQUFVLENBQUMsUUFBWCxDQUFBLENBQUEsR0FBd0IsS0FBSyxDQUFFLEdBQUEsR0FBTSxDQUFSO0lBRHBDO0FBRUEsV0FBTztFQUpGO0FBdEZQIiwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5IICAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9faGVscGVycydcblxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkgudHlwZXMuZGVjbGFyZSAnZ3V5X3N0cl93YWxrX2xpbmVzX2NmZycsIHRlc3RzOlxuICBcIkBpc2Eub2JqZWN0IHhcIjogICAgICAgICAgKCB4ICkgLT4gQGlzYS5vYmplY3QgeFxuICBcIkBpc2EuYm9vbGVhbiB4LnRyaW1cIjogICAgKCB4ICkgLT4gQGlzYS5ib29sZWFuIHgudHJpbVxuICBcIkBpc2EudGV4dCB4LnByZXBlbmRcIjogICAgKCB4ICkgLT4gQGlzYS50ZXh0IHgucHJlcGVuZFxuICBcIkBpc2EudGV4dCB4LmFwcGVuZFwiOiAgICAgKCB4ICkgLT4gQGlzYS50ZXh0IHguYXBwZW5kXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZGVmYXVsdHMgPVxuICBndXlfc3RyX3dhbGtfbGluZXNfY2ZnOlxuICAgIHRyaW06ICAgICAgICAgICB0cnVlXG4gICAgcHJlcGVuZDogICAgICAgICcnXG4gICAgYXBwZW5kOiAgICAgICAgICcnXG5cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIyMgdGh4IHRvIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82OTY5NDg2Lzc1NjgwOTEgYW5kXG5odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L0d1aWRlL1JlZ3VsYXJfRXhwcmVzc2lvbnMjZXNjYXBpbmcgIyMjXG5AZXNjYXBlX2Zvcl9yZWdleCA9ICggdGV4dCApIC0+IHRleHQucmVwbGFjZSAvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMjIyB0aHggdG8gaHR0cHM6Ly93d3cuZGVzaWduY2lzZS5jb20vd2ViL3R1dG9yaWFsL3doaWNoLWNoYXJhY3RlcnMtbmVlZC10by1iZS1lc2NhcGVkLWluLWEtcmVndWxhci1leHByZXNzaW9uLWNsYXNzICMjI1xuQGVzY2FwZV9mb3JfcmVnZXhfY2xhc3MgPSAoIHRleHQgKSAtPiB0ZXh0LnJlcGxhY2UgLyhbXFxeXFwtXFxdXFwvXSkvZywgJ1xcXFwkMSdcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5Ad2Fsa19saW5lcyA9ICggdGV4dCwgY2ZnICkgLT5cbiAgZm9yIHsgbGluZSwgfSBmcm9tIEB3YWxrX2xpbmVzX3dpdGhfcG9zaXRpb25zIHRleHQsIGNmZ1xuICAgIHlpZWxkIGxpbmVcbiAgcmV0dXJuIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5Ad2Fsa19saW5lc193aXRoX3Bvc2l0aW9ucyA9ICggdGV4dCwgY2ZnICkgLT5cbiAgSC50eXBlcy52YWxpZGF0ZS5ndXlfc3RyX3dhbGtfbGluZXNfY2ZnICggY2ZnID0geyBkZWZhdWx0cy5ndXlfc3RyX3dhbGtfbGluZXNfY2ZnLi4uLCBjZmcuLi4sIH0gKVxuICB7IHRyaW1cbiAgICBwcmVwZW5kXG4gICAgYXBwZW5kICB9ICA9IGNmZ1xuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGlmIHRleHQgaXMgJydcbiAgICB5aWVsZCB7IGxucjogMSwgbGluZTogJycsIGVvbDogJycsIH1cbiAgICByZXR1cm4gbnVsbFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGxuciAgICAgICAgICAgPSAwXG4gIHBhdHRlcm4gICAgICAgPSAvKC4qPykoXFxyXFxufFxccnxcXG58JCkvc3V5XG4gIGxhc3RfcG9zaXRpb24gPSB0ZXh0Lmxlbmd0aCAtIDFcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBsb29wXG4gICAgaWR4ID0gcGF0dGVybi5sYXN0SW5kZXhcbiAgICBicmVhayBpZiBwYXR0ZXJuLmxhc3RJbmRleCA+IGxhc3RfcG9zaXRpb25cbiAgICBicmVhayB1bmxlc3MgKCBtYXRjaCA9IHRleHQubWF0Y2ggcGF0dGVybiApP1xuICAgIFsgbGluZW5sLCBsaW5lLCBlb2wsIF0gPSBtYXRjaFxuICAgIGxucisrXG4gICAgbGluZSAgPSBtYXRjaFsgMSBdXG4gICAgbGluZSAgPSBsaW5lLnRyaW1FbmQoKSBpZiB0cmltXG4gICAgbGluZSAgPSBwcmVwZW5kICsgbGluZSAgdW5sZXNzIHByZXBlbmQgIGlzICcnXG4gICAgbGluZSAgPSBsaW5lICArIGFwcGVuZCAgdW5sZXNzIGFwcGVuZCAgIGlzICcnXG4gICAgeWllbGQgeyBsbnIsIGxpbmUsIGVvbCwgfVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGlmICggdGV4dC5tYXRjaCAvKFxccnxcXG4pJC8gKT9cbiAgICBsbnIrK1xuICAgIHlpZWxkIHsgbG5yLCBsaW5lOiAnJywgZW9sOiAnJywgfVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHJldHVybiBudWxsXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQHBsdXJhbGl6ZSA9ICggd29yZCApIC0+XG4gICMjIyB0aHggdG8gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9wbHVyL2Jsb2IvbWFpbi9pbmRleC5qcyAjIyNcbiAgSC50eXBlcy52YWxpZGF0ZS50ZXh0IHdvcmRcbiAgcmV0dXJuICcnIGlmIHdvcmQgaXMgJydcbiAgUiAgICAgICAgID0gd29yZFxuICBSICAgICAgICAgPSBSLnJlcGxhY2UgLyg/OnN8eHx6fGNofHNoKSQvaSwgJyQmZSdcbiAgUiAgICAgICAgID0gUi5yZXBsYWNlIC8oW15hZWlvdV0peSQvaSwgICAgICckMWllJ1xuICBSICAgICAgICArPSAncydcbiAgaWYgKCB0b191cHBlciA9ICggL1xccHtMdX0kL3UgKS50ZXN0IHdvcmQgKVxuICAgIFIgPSBSLnJlcGxhY2UgL2k/ZT9zJC9pLCAoIG1hdGNoICkgPT4gbWF0Y2gudG9VcHBlckNhc2UoKVxuICByZXR1cm4gUlxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AU1FMID0gKCBwYXJ0cywgZXhwcmVzc2lvbnMuLi4gKSAtPlxuICBSID0gcGFydHNbIDAgXVxuICBmb3IgZXhwcmVzc2lvbiwgaWR4IGluIGV4cHJlc3Npb25zXG4gICAgUiArPSBleHByZXNzaW9uLnRvU3RyaW5nKCkgKyBwYXJ0c1sgaWR4ICsgMSBdXG4gIHJldHVybiBSXG5cblxuXG5cblxuXG5cblxuIl19
//# sourceURL=../src/str.coffee