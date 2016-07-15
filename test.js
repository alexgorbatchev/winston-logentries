import logentries from 'logentries';
import chai from 'chai';
import winston from 'winston';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Logentries } from './index-es6';

const { expect } = chai;
chai.use(sinonChai);

describe('Logentries options', () => {
  let spy = sinon.spy(logentries, "logger");
  let i = 0;

  it('can set token', () => {
    let transport = new Logentries({token: 'test'});
    expect(spy.args[i][0].token).to.equal("test");
    i++;
  });

  it('defaults to secure transport', () => {
    let transport = new Logentries({token: ''});
    expect(spy.args[i][0].secure).to.equal(true);
    i++;
  });

  it('can use insecure transport', () => {
    let transport = new Logentries({token: '', secure: false});
    expect(spy.args[i][0].secure).to.equal(false);
    i++;
  });

  it('adopts log levels from winston', () => {
    let transport = new Logentries({token: '', secure: false});
    expect(transport.logentries.levels).to.be.equal(winston.levels);
    i++;
  });

  it('defaults to level `info`', () => {
    let levels = {
      level0: 0,
      level1: 1
    };
    let transport = new Logentries({token: ''});
    expect(transport.level).to.equal("info");
    i++;
  });

  it('can set custom levels', () => {
    let levels = {
      level0: 0,
      level1: 1
    };
    let transport = new Logentries({token: '', level: "level0", levels});
    expect(transport.level).to.equal("level0");
    expect(spy.args[i][0].levels).to.equal(levels);
    i++;
  });
});

describe('Logentries log levels', () => {
  let logger = null;
  let transport = null;

  beforeEach(() => {
    transport = new Logentries({token: ''});
    logger = new winston.Logger({transports: [transport]});

    sinon.spy(transport.logentries, 'log');
  });

  it('calls service `log` method without meta', () => {
    logger.info('hello!');
    expect(transport.logentries.log).to.have.been.calledWith('info', 'hello!');
  });

  it('calls service `log` method with meta', () => {
    logger.info('hello!', {foo: 123});
    expect(transport.logentries.log).to.have.been.calledWith('info', 'hello! {"foo":123}');
  });

  it('calls `log` method with `warning` level which has been translated from  `warn`', () => {
    logger.warn('hello!', {foo: 123});
    expect(transport.logentries.log).to.have.been.calledWith('warn', 'hello! {"foo":123}');
  });

  it('calls `log` method with `err` level which has been translated from  `error`', () => {
    logger.error('hello!', {foo: 123});
    expect(transport.logentries.log).to.have.been.calledWith('error', 'hello! {"foo":123}');
  });
});