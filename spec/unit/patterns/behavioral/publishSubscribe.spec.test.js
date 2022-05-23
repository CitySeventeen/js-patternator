/* globals expect, beforeEach, afterEach, it, describe, jasmine */
import publishSubscribeBuilder from '../../../../src/patterns/behavioral/publishSubscribe.js';

describe('publish subscribe pattern', function() {
  let updateSpy;
  let PublishSubscribe;
  let publishSubscribe;
  beforeEach(function() {
    updateSpy = jasmine.createSpy('test');
    PublishSubscribe = publishSubscribeBuilder().build();
    publishSubscribe = new PublishSubscribe();
    publishSubscribe.subscribe('test', updateSpy);
  });
  afterEach(function() {
    publishSubscribe.unsubscribe('test', updateSpy);
  });
  it('should allow empty options', function() {
    let emptyOptions = undefined;
    let PublishSubscribe = publishSubscribeBuilder(emptyOptions).build();
    let publishSubscribe = new PublishSubscribe();
    publishSubscribe.subscribe('test', (arg) => {
      expect(arg).toEqual('testing');
    });
    publishSubscribe.publish('test', 'testing');
  });
  it('should create an publishSubscribe', function() {
    expect(publishSubscribe).toBeDefined();
  });
  it('should publish the publishSubscribe', function() {
    publishSubscribe.publish('test');
    publishSubscribe.publish('test');
    expect(updateSpy).toHaveBeenCalled();
    expect(updateSpy.calls.count()).toEqual(2);
  });
  it('should implement method chainable pattern', function() {
    let t = 'test';
    publishSubscribe.subscribe(t, ()=>{}).subscribe(t, ()=>{});
    expect(publishSubscribe.count(t)).toEqual(3);
  });
});
