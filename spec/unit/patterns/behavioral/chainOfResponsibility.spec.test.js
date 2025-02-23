/* global expect, beforeEach, it, describe, jasmine */
import chainOfResponsibilityBuilder from '../../../../src/patterns/behavioral/chainOfResponsibility.js';

describe('chain of responsibility', function() {
  let arraySpy;
  let functionSpy;
  let constructorSpy;
  let shouldNotRunSpy;
  let defaultSpy;
  let ChainOfResponsibility;
  let chain;
  beforeEach(function() {
    constructorSpy = jasmine.createSpy('constructor');
    arraySpy = jasmine.createSpy('array');
    functionSpy = jasmine.createSpy('object');
    shouldNotRunSpy = jasmine.createSpy('shouldNotRun');
    defaultSpy = jasmine.createSpy('default');
    ChainOfResponsibility = chainOfResponsibilityBuilder({
      constructor: function() {
        constructorSpy();
      },
      publics: {
        test: 'test'
      }
    }).build();
    chain = new ChainOfResponsibility()
      .add((next, t) => {
        if(t instanceof Array) {
          arraySpy();
          return 'array';
        }
        next();
      })
      .add((next, t) => {
        if(t instanceof Function) {
          functionSpy();
          return 'function';
        }
        next();
      })
      .add((next, t) => {
        if(t instanceof Function) {
          shouldNotRunSpy();
          return 'shouldNotRun';
        }
        next();
      })
      .add((next, t) => {
        if(t === 'continue') {
          next();
          return 'shouldNotReturnThis';
        }
        next();
      })
      .add(defaultSpy);
  });
  it('should allow empty options', function() {
    let emptyOptions = undefined;
    let ChainOfResponsibility = chainOfResponsibilityBuilder(emptyOptions).build();
    let chain = new ChainOfResponsibility();
    let result = chain.add((next, t) => {
      return t;
    }).run('test');
    expect(result).toEqual('test');
  });
  it('should wrap a constructor with the pattern', function() {
    expect(chain.test).toEqual('test');
    expect(constructorSpy).toHaveBeenCalled();
  });
  it('should chain callbacks', function() {
    chain.run();
    expect(chain.run([])).toEqual('array');
    expect(chain.run(() => {})).toEqual('function');
    expect(defaultSpy).toHaveBeenCalled();
    expect(functionSpy).toHaveBeenCalled();
    expect(arraySpy).toHaveBeenCalled();
  });
  it('can shadow callbacks', function() {
    expect(chain.run(() => {})).not.toEqual('shouldNotRun');
    expect(shouldNotRunSpy).not.toHaveBeenCalled();
  });
  it('can continue the chain even if callback was used', function() {
    let t = chain.run('continue');
    expect(t).not.toEqual('shouldNotReturnThis');
    expect(defaultSpy).toHaveBeenCalled();
  });
  it('should run regardless of the context allowing to pass as callback', function(done) {
    setTimeout(chain.run);
    setTimeout(() => {
      expect(defaultSpy).toHaveBeenCalled();
      done();
    }, 30);
  });
  it('should count the callbacks', function() {
    expect(chain.count()).toEqual(5);
  });
  it('should find callbacks', function() {
    expect(chain.contains(defaultSpy)).toBeTruthy();
    expect(chain.contains(() => {})).toBeFalsy();
  });
});
