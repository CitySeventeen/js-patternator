import extend from '../../helpers/extend.js';
import createPatternBuilder from '../../helpers/createPatternBuilder.js';

export default createPatternBuilder(options => {
  function Mediator(...args) {
    this.participants = {};
    options.constructor.apply(this, args);
  }
  extend(Mediator.prototype, {
    register(alias, callback) {
      if(this.participants[alias] !== undefined) {
        throw new Error('participant already exists');
      }
      this.participants[alias] = callback;
      return this;
    },

    send({message, from, to}) {
      this.participants[to] && this.participants[to](message, from);
      return this;
    },

    broadcast({message, from}) {
      for(let prop in this.participants) {
        if(this.participants.hasOwnProperty(prop)) {
          this.participants[prop] && this.participants[prop](message, from);
        }
      }
      return this;
    },

    count() {
      return Object.keys(this.participants).length;
    }
  });
  return Mediator;
});
