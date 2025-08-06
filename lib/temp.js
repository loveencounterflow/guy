(function() {
  // 'use strict'

  // ############################################################################################################
// H                         = require './_helpers'
// debug                     = console.log
// defaults                  = { keep: false, prefix: 'guy.temp-', suffix: '', }

  // #-----------------------------------------------------------------------------------------------------------
// @with_file = ( cfg, handler ) ->
//   switch arity = arguments.length
//     when 1 then [ cfg, handler, ] = [ null, cfg, ]
//     when 2 then null
//     else throw new Error "expected 1 or 2 arguments, got #{arity}"
//   cfg   = { defaults..., cfg..., }
//   type  = Object::toString.call handler
//   return @_with_file_async cfg, handler if type is '[object AsyncFunction]'
//   return @_with_file_sync  cfg, handler if type is '[object Function]'
//   throw new Error "^guy.temp@1^ expected an (sync or async) function, got a #{type}"

  // #-----------------------------------------------------------------------------------------------------------
// @with_directory = ( cfg, handler ) ->
//   switch arity = arguments.length
//     when 1 then [ cfg, handler, ] = [ null, cfg, ]
//     when 2 then null
//     else throw new Error "expected 1 or 2 arguments, got #{arity}"
//   cfg   = { defaults..., cfg..., }
//   type  = Object::toString.call handler
//   return @_with_directory_async cfg, handler if type is '[object AsyncFunction]'
//   return @_with_directory_sync  cfg, handler if type is '[object Function]'
//   throw new Error "^guy.temp@2^ expected an (sync or async) function, got a #{type}"

  // #-----------------------------------------------------------------------------------------------------------
// @_with_file_sync = ( cfg, handler ) ->
//   TEMP          = require 'tmp'
//   { name: path
//     fd
//     removeCallback } = TEMP.fileSync cfg
//   try handler { path, fd, } finally
//     removeCallback() unless cfg.keep
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @_with_directory_sync = ( cfg, handler ) ->
//   FS              = require 'node:fs'
//   TEMP            = require 'tmp'
//   { name: path, } = TEMP.dirSync cfg
//   try handler { path, } finally
//     FS.rmSync path, { recursive: true, } unless cfg.keep
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @_with_file_async = ( cfg, handler ) ->
//   TEMP          = require 'tmp'
//   { name: path
//     fd
//     removeCallback } = TEMP.fileSync cfg
//   try await handler { path, fd, } finally
//     removeCallback() unless cfg.keep
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @_with_directory_async = ( cfg, handler ) ->
//   switch arity = arguments.length
//     when 1 then [ cfg, handler, ] = [ null, cfg, ]
//     when 2 then null
//     else throw new Error "expected 1 or 2 arguments, got #{arity}"
//   cfg             = { defaults..., cfg..., }
//   FS              = require 'node:fs'
//   TEMP            = require 'tmp'
//   { name: path, } = TEMP.dirSync cfg
//   try await handler { path, } finally
//     FS.rmSync path, { recursive: true, } unless cfg.keep
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @create_directory = ( cfg ) ->
//   FS              = require 'node:fs'
//   TEMP            = require 'tmp'
//   cfg             = { defaults..., cfg..., }
//   { name: path, } = TEMP.dirSync cfg
//   rm              = -> FS.rmSync path, { recursive: true, }
//   return { path, rm, }


}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RlbXAuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1Gd0I7RUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAndXNlIHN0cmljdCdcblxuIyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgSCAgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vX2hlbHBlcnMnXG4jIGRlYnVnICAgICAgICAgICAgICAgICAgICAgPSBjb25zb2xlLmxvZ1xuIyBkZWZhdWx0cyAgICAgICAgICAgICAgICAgID0geyBrZWVwOiBmYWxzZSwgcHJlZml4OiAnZ3V5LnRlbXAtJywgc3VmZml4OiAnJywgfVxuXG5cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEB3aXRoX2ZpbGUgPSAoIGNmZywgaGFuZGxlciApIC0+XG4jICAgc3dpdGNoIGFyaXR5ID0gYXJndW1lbnRzLmxlbmd0aFxuIyAgICAgd2hlbiAxIHRoZW4gWyBjZmcsIGhhbmRsZXIsIF0gPSBbIG51bGwsIGNmZywgXVxuIyAgICAgd2hlbiAyIHRoZW4gbnVsbFxuIyAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCJleHBlY3RlZCAxIG9yIDIgYXJndW1lbnRzLCBnb3QgI3thcml0eX1cIlxuIyAgIGNmZyAgID0geyBkZWZhdWx0cy4uLiwgY2ZnLi4uLCB9XG4jICAgdHlwZSAgPSBPYmplY3Q6OnRvU3RyaW5nLmNhbGwgaGFuZGxlclxuIyAgIHJldHVybiBAX3dpdGhfZmlsZV9hc3luYyBjZmcsIGhhbmRsZXIgaWYgdHlwZSBpcyAnW29iamVjdCBBc3luY0Z1bmN0aW9uXSdcbiMgICByZXR1cm4gQF93aXRoX2ZpbGVfc3luYyAgY2ZnLCBoYW5kbGVyIGlmIHR5cGUgaXMgJ1tvYmplY3QgRnVuY3Rpb25dJ1xuIyAgIHRocm93IG5ldyBFcnJvciBcIl5ndXkudGVtcEAxXiBleHBlY3RlZCBhbiAoc3luYyBvciBhc3luYykgZnVuY3Rpb24sIGdvdCBhICN7dHlwZX1cIlxuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBAd2l0aF9kaXJlY3RvcnkgPSAoIGNmZywgaGFuZGxlciApIC0+XG4jICAgc3dpdGNoIGFyaXR5ID0gYXJndW1lbnRzLmxlbmd0aFxuIyAgICAgd2hlbiAxIHRoZW4gWyBjZmcsIGhhbmRsZXIsIF0gPSBbIG51bGwsIGNmZywgXVxuIyAgICAgd2hlbiAyIHRoZW4gbnVsbFxuIyAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCJleHBlY3RlZCAxIG9yIDIgYXJndW1lbnRzLCBnb3QgI3thcml0eX1cIlxuIyAgIGNmZyAgID0geyBkZWZhdWx0cy4uLiwgY2ZnLi4uLCB9XG4jICAgdHlwZSAgPSBPYmplY3Q6OnRvU3RyaW5nLmNhbGwgaGFuZGxlclxuIyAgIHJldHVybiBAX3dpdGhfZGlyZWN0b3J5X2FzeW5jIGNmZywgaGFuZGxlciBpZiB0eXBlIGlzICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJ1xuIyAgIHJldHVybiBAX3dpdGhfZGlyZWN0b3J5X3N5bmMgIGNmZywgaGFuZGxlciBpZiB0eXBlIGlzICdbb2JqZWN0IEZ1bmN0aW9uXSdcbiMgICB0aHJvdyBuZXcgRXJyb3IgXCJeZ3V5LnRlbXBAMl4gZXhwZWN0ZWQgYW4gKHN5bmMgb3IgYXN5bmMpIGZ1bmN0aW9uLCBnb3QgYSAje3R5cGV9XCJcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQF93aXRoX2ZpbGVfc3luYyA9ICggY2ZnLCBoYW5kbGVyICkgLT5cbiMgICBURU1QICAgICAgICAgID0gcmVxdWlyZSAndG1wJ1xuIyAgIHsgbmFtZTogcGF0aFxuIyAgICAgZmRcbiMgICAgIHJlbW92ZUNhbGxiYWNrIH0gPSBURU1QLmZpbGVTeW5jIGNmZ1xuIyAgIHRyeSBoYW5kbGVyIHsgcGF0aCwgZmQsIH0gZmluYWxseVxuIyAgICAgcmVtb3ZlQ2FsbGJhY2soKSB1bmxlc3MgY2ZnLmtlZXBcbiMgICByZXR1cm4gbnVsbFxuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBAX3dpdGhfZGlyZWN0b3J5X3N5bmMgPSAoIGNmZywgaGFuZGxlciApIC0+XG4jICAgRlMgICAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiMgICBURU1QICAgICAgICAgICAgPSByZXF1aXJlICd0bXAnXG4jICAgeyBuYW1lOiBwYXRoLCB9ID0gVEVNUC5kaXJTeW5jIGNmZ1xuIyAgIHRyeSBoYW5kbGVyIHsgcGF0aCwgfSBmaW5hbGx5XG4jICAgICBGUy5ybVN5bmMgcGF0aCwgeyByZWN1cnNpdmU6IHRydWUsIH0gdW5sZXNzIGNmZy5rZWVwXG4jICAgcmV0dXJuIG51bGxcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQF93aXRoX2ZpbGVfYXN5bmMgPSAoIGNmZywgaGFuZGxlciApIC0+XG4jICAgVEVNUCAgICAgICAgICA9IHJlcXVpcmUgJ3RtcCdcbiMgICB7IG5hbWU6IHBhdGhcbiMgICAgIGZkXG4jICAgICByZW1vdmVDYWxsYmFjayB9ID0gVEVNUC5maWxlU3luYyBjZmdcbiMgICB0cnkgYXdhaXQgaGFuZGxlciB7IHBhdGgsIGZkLCB9IGZpbmFsbHlcbiMgICAgIHJlbW92ZUNhbGxiYWNrKCkgdW5sZXNzIGNmZy5rZWVwXG4jICAgcmV0dXJuIG51bGxcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQF93aXRoX2RpcmVjdG9yeV9hc3luYyA9ICggY2ZnLCBoYW5kbGVyICkgLT5cbiMgICBzd2l0Y2ggYXJpdHkgPSBhcmd1bWVudHMubGVuZ3RoXG4jICAgICB3aGVuIDEgdGhlbiBbIGNmZywgaGFuZGxlciwgXSA9IFsgbnVsbCwgY2ZnLCBdXG4jICAgICB3aGVuIDIgdGhlbiBudWxsXG4jICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcImV4cGVjdGVkIDEgb3IgMiBhcmd1bWVudHMsIGdvdCAje2FyaXR5fVwiXG4jICAgY2ZnICAgICAgICAgICAgID0geyBkZWZhdWx0cy4uLiwgY2ZnLi4uLCB9XG4jICAgRlMgICAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiMgICBURU1QICAgICAgICAgICAgPSByZXF1aXJlICd0bXAnXG4jICAgeyBuYW1lOiBwYXRoLCB9ID0gVEVNUC5kaXJTeW5jIGNmZ1xuIyAgIHRyeSBhd2FpdCBoYW5kbGVyIHsgcGF0aCwgfSBmaW5hbGx5XG4jICAgICBGUy5ybVN5bmMgcGF0aCwgeyByZWN1cnNpdmU6IHRydWUsIH0gdW5sZXNzIGNmZy5rZWVwXG4jICAgcmV0dXJuIG51bGxcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQGNyZWF0ZV9kaXJlY3RvcnkgPSAoIGNmZyApIC0+XG4jICAgRlMgICAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiMgICBURU1QICAgICAgICAgICAgPSByZXF1aXJlICd0bXAnXG4jICAgY2ZnICAgICAgICAgICAgID0geyBkZWZhdWx0cy4uLiwgY2ZnLi4uLCB9XG4jICAgeyBuYW1lOiBwYXRoLCB9ID0gVEVNUC5kaXJTeW5jIGNmZ1xuIyAgIHJtICAgICAgICAgICAgICA9IC0+IEZTLnJtU3luYyBwYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgfVxuIyAgIHJldHVybiB7IHBhdGgsIHJtLCB9XG5cblxuIl19
//# sourceURL=../src/temp.coffee