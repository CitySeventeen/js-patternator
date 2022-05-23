/* global expect, beforeEach, it, describe, jasmine, spyOn */
import mementoBuilder from '../../../../src/patterns/behavioral/memento.js';
import commandBuilder from '../../../../src/patterns/behavioral/command.js';
import chainOfResponsibilityBuilder from '../../../../src/patterns/behavioral/chainOfResponsibility.js';
import json from '../../../../src/helpers/json.js';

describe('memento', function() {
  let Memento;
  let memento;
  let history;
  let parsedHistory;
  let key;
  beforeEach(function() {
    spyOn(json, 'stringify').and.callThrough();
    spyOn(json, 'parse').and.callThrough();
    history = {
      test: 'testing'
    };
    Memento = mementoBuilder().build();
    memento = new Memento();
    key = memento.add(history);
    parsedHistory = memento.get(key);
  });
  it('should allow empty options', function() {
    let emptyOptions = undefined;
    let Memento = mementoBuilder(emptyOptions).build();
    let memento = new Memento();
    let key = memento.add({test: 'testing'});
    let result = memento.get(key);
    expect(result.test).toEqual('testing');
  });
  it('should add an object', function() {
    expect(key).toBeDefined();
    expect(key).toEqual(0);
    expect(json.stringify).toHaveBeenCalledWith(history);
  });
  it('should return a parsed object', function() {
    expect(json.parse).toHaveBeenCalled();
    expect(parsedHistory === history).not.toBeTruthy();
    expect(parsedHistory).toEqual(history);
  });
  describe('Advanced Level: Undo Redo using Memento, Command, and ChainOfResponsibility', function() {
    let chain;
    let UndoManager;
    let undoManager;
    let PointInTime;
    let runSpy;
    beforeEach(function() {
      PointInTime = function(index) {
        this.index = index;
        this.previous = null;
        this.next = null;
      };

      chain = (...args) => {
        let ChainOfResponsibility = chainOfResponsibilityBuilder({
          constructor: function() {
            this.add = this.add.bind(this);
          }
        }).build();
        let overloader = new ChainOfResponsibility();
        args.forEach(overloader.add);
        return overloader.run;
      };

      UndoManager = mementoBuilder(commandBuilder({
        constructor: function() {
          this.methods = {};
          this.state = {};
          this.pit = new PointInTime(this.add(this.state));

          let execute = this.execute.bind(this);
          this.execute = chain(
            (next, ...args) => {
              execute(...args);
              next();
            },
            this._onExecute.bind(this)
          );

          let add = this.add.bind(this);
          this.add = chain(
            (next, method, obj) => {
              if(typeof method !== 'string') {
                return next();
              }
              this.methods[method] = obj;
            },
            (_, o) => {
              add(o);
            }
          );
        },
        publics: {
          _onExecute(next, _, ...args) {
            if(_ !== 'run') {
              return this.execute.apply(null, ['run', _].concat(args));
            }
            let o = new PointInTime(this.add(this.state));
            o.previous = this.pit;
            this.pit.next = o;
            this.pit = o;
          },
          run(method, ...args) {
            return this.methods[method] && this.methods[method].apply(null, [this.state].concat(args));
          },
          undo() {
            if(this.pit.previous === null) {
              return;
            }
            this.pit = this.pit.previous;
            this._updateState();
          },
          redo() {
            if(this.pit.next === null) {
              return;
            }
            this.pit = this.pit.next;
            this._updateState();
          },
          _updateState() {
            this.state = this.get(this.pit.index);
          }
        }
      })).build();
      undoManager = new UndoManager();

      runSpy = jasmine.createSpy('run');
      undoManager.add('test', (state, arg) => {
        runSpy(arg);
        state.test = arg;
      });
      undoManager.execute('test', 'testing');
    });
    it('should run a method', function() {
      expect(runSpy).toHaveBeenCalledWith('testing');
      expect(undoManager.state.test).toEqual('testing');
    });
    it('should undo a method', function() {
      undoManager.undo();
      expect(undoManager.state.test).not.toEqual('testing');
    });
    it('should redo a method', function() {
      undoManager.redo();
      expect(undoManager.state.test).toEqual('testing');
    });
  });
});
