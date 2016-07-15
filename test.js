import logentries from 'logentries';
import chai from 'chai';
import winston from 'winston';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Logentries } from './index-es6';

const { expect } = chai;
chai.use(sinonChai);

describe('winston-logentries', () => {
  describe('options', () => {
    let spy;

    beforeEach(() => spy = sinon.spy(logentries, 'logger'));
    afterEach(() => logentries.logger.restore());

    it('can set token', () => {
      const transport = new Logentries({ token: 'test' });
      expect(spy.args[0][0].token).to.equal('test');
    });

    it('defaults to secure transport', () => {
      const transport = new Logentries({ token: '' });
      expect(spy.args[0][0].secure).to.equal(true);
    });

    it('can use insecure transport', () => {
      const transport = new Logentries({ token: '', secure: false });
      expect(spy.args[0][0].secure).to.equal(false);
    });

    it('adopts log levels from winston', () => {
      const transport = new Logentries({ token: '', secure: false });
      expect(transport.logentries.levels).to.be.equal(winston.levels);
    });

    it('defaults to level `info`', () => {
      const levels = {
        level0: 0,
        level1: 1
      };
      const transport = new Logentries({ token: '' });
      expect(transport.level).to.equal('info');
    });

    it('can set custom levels', () => {
      const levels = {
        level0: 0,
        level1: 1
      };
      const transport = new Logentries({ token: '', level: 'level0', levels });
      expect(transport.level).to.equal("level0");
      expect(spy.args[0][0].levels).to.equal(levels);
    });
  });

  describe('log levels', () => {
    let logger = null;
    let transport = null;

    beforeEach(() => {
      transport = new Logentries({
        token: '',
        level: 'silly',
        levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 },
      });
      logger = new winston.Logger({ transports: [ transport ] });

      sinon.spy(transport.logentries, 'log');
    });

    it('calls service `log` method without meta using own level', () => {
      logger.silly('hello!');
      expect(transport.logentries.log).to.have.been.calledWith('silly', 'hello!');
    });

    it('calls service `log` method without meta', () => {
      logger.info('hello!');
      expect(transport.logentries.log).to.have.been.calledWith('info', 'hello!');
    });

    it('calls service `log` method with meta', () => {
      logger.info('hello!', { foo: 123 });
      expect(transport.logentries.log).to.have.been.calledWith('info', 'hello! {"foo":123}');
    });

    it('calls `log` method with `warning` level which has been translated from  `warn`', () => {
      logger.warn('hello!', { foo: 123 });
      expect(transport.logentries.log).to.have.been.calledWith('warn', 'hello! {"foo":123}');
    });

    it('calls `log` method with `err` level which has been translated from  `error`', () => {
      logger.error('hello!', { foo: 123 });
      expect(transport.logentries.log).to.have.been.calledWith('error', 'hello! {"foo":123}');
    });
  });
});
