import { expect } from 'chai';
import 'mocha';
import {
  findMangledDefine,
  getModuleIndex,
  ParsedFile,
} from '../src/cli/metadata';

describe('getModuleIndex', () => {
  it('returns a module index if we detect a define ident', () => {
    let index = getModuleIndex('let a=1;define("foo-bar",["exports"],function(exports) {', 'define');

    expect(index).to.not.equal(-1);
    expect(index).to.equal(8);
  });
  it('returns a module index if we detect a mangled define identifier', () => {
    let index = getModuleIndex('let a=1;e("foo-bar",["exports"],function(exports) {', 'e');

    expect(index).to.not.equal(-1);
    expect(index).to.equal(8);
  });

  it('does not get confused with other calls', () => {
    let index = getModuleIndex('let f=()=> e();e("foo-bar",["exports"],function(exports) {', 'e');

    expect(index).to.not.equal(-1);
    expect(index).to.equal(15);
  });

  it('returns EOF if nothing found', () => {
    let index = getModuleIndex('let f=()=> e();', 'e');

    expect(index).to.equal(-1);
  });
});

describe('findMangledDefine', () => {
  it('finds the internal loader ident index', () => {
    let content = 'if (false) {woot=undefined;}else woot=n.__loader.define; b="b";';
    let ident = findMangledDefine(content);
    expect(ident).to.equal('woot');
  });
});

describe('ParsedFile', () => {
  it ('can find module names', () => {
    let content = `
      let a = 'b';
      let d = 'd';
      define("foo-bar",["exports"],function(e) {
        let something = 'woot';
        function barbar() {
          return 'bar';
        }
        let other = 'bar';
      });
    `;
    let file = new ParsedFile(content);

    let moduleName = file.moduleNameFor({
      url: 'thing',
      columnNumber: 17,
      lineNumber: 5,
      scriptId: 1,
      functionName: 'barbar',
    });

    expect(moduleName).to.equal('foo-bar');
  });

  it ('can find module name in mangled ident', () => {
    let content = `
      if (false) {woot=undefined;}else woot=n.__loader.define;
      let a = 'b';
      let d = 'd';
      woot("foo-bar",["exports"],function(e) {
        let something = 'woot';
        function barbar() {
          return 'bar';
        }
        let other = 'bar';
      });
    `;
    let file = new ParsedFile(content);

    let moduleName = file.moduleNameFor({
      url: 'thing',
      columnNumber: 17,
      lineNumber: 5,
      scriptId: 1,
      functionName: 'barbar',
    });

    expect(moduleName).to.equal('foo-bar');
  });

  it ('gracefully handles unknown modules', () => {
    let content = `
      if (false) {woot=undefined;}else woot=n.__loader.define;
      let a = 'b';
      let d = 'd';
      function barbar() {
        return 'bar';
      }
    `;
    let file = new ParsedFile(content);

    let moduleName = file.moduleNameFor({
      url: 'thing',
      columnNumber: 14,
      lineNumber: 4,
      scriptId: 1,
      functionName: 'barbar',
    });

    expect(moduleName).to.equal('unknown');
  });
});
