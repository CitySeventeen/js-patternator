/* global expect, it, describe, beforeEach, Function */

import createNew from '../../../src/helpers/createPatternBuilder.js';

describe('build pattern helper', function() {
  let pattern;
  let PatternBuilder;
  let PatternClass;
  let patternInstance;
  beforeEach(function() {
    pattern = createNew(options => {
      function Pattern(...args) {
        this.implementsPattern = true;
        options.constructor.apply(this, args);
      }
      return Pattern;
    });

    PatternBuilder = pattern({
      constructor(t) {
        this.test = t;
      }
    });

    PatternClass = PatternBuilder.build();

    patternInstance = new PatternClass(true);
  });
  it('should return a function', function() {
    expect(typeof pattern).toEqual('function');
  });
  it('should return a builder object', function() {
    expect(PatternBuilder instanceof Object).toBeTruthy();
    expect(PatternBuilder.build instanceof Function).toBeTruthy();
  });
  it('should encapsulate the options with a pattern', function() {
    expect(patternInstance.implementsPattern).toBeTruthy();
    expect(patternInstance.test).toBeTruthy();
  });
});
