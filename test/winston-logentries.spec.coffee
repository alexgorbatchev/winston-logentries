logentries = require 'logentries'
require 'coffee-errors'

chai = require 'chai'
winston = require 'winston'
sinon = require 'sinon'
{Logentries} = require '../src/winston-logentries'

expect = chai.expect
chai.use require 'sinon-chai'

describe 'Logentries options', ->
  spy = sinon.spy logentries, "logger"
  i = 0

  it 'can set token', ->
    transport = new Logentries token: 'test'
    expect(spy.args[i][0].token).to.equal "test"
    i++

  it 'defaults to secure transport', ->
    transport = new Logentries token: ''
    expect(spy.args[i][0].secure).to.equal true
    i++

  it 'can use insecure transport', ->
    transport = new Logentries token: '', secure: false
    expect(spy.args[i][0].secure).to.equal false
    i++

  it 'adopts log levels from winston', ->
    transport = new Logentries token: '', secure: false
    expect(transport.logentries.levels).to.be.equal winston.levels
    i++

  it 'defaults to level `info`', ->
    levels =
      level0: 0
      level1: 1
    transport = new Logentries token: ''
    expect(transport.level).to.equal "info"
    i++

  it 'can set custom levels', ->
    levels =
      level0: 0
      level1: 1
    transport = new Logentries token: '', level: "level0", levels: levels
    expect(transport.level).to.equal "level0"
    expect(spy.args[i][0].levels).to.equal levels
    i++

describe 'Logentries log levels', ->
  logger = null
  transport = null

  beforeEach ->
    transport = new Logentries token: ''
    logger = new winston.Logger transports: [transport]

    sinon.spy transport.logentries, 'log'

  it 'calls service `log` method without meta', ->
    logger.info 'hello!'
    expect(transport.logentries.log).to.have.been.calledWith 'info', 'hello!'

  it 'calls service `log` method with meta', ->
    logger.info 'hello!', foo: 123
    expect(transport.logentries.log).to.have.been.calledWith 'info', 'hello! {"foo":123}'

  it 'calls `log` method with `warning` level which has been translated from  `warn`', ->
    logger.warn 'hello!', foo: 123
    expect(transport.logentries.log).to.have.been.calledWith 'warn', 'hello! {"foo":123}'

  it 'calls `log` method with `err` level which has been translated from  `error`', ->
    logger.error 'hello!', foo: 123
    expect(transport.logentries.log).to.have.been.calledWith 'error', 'hello! {"foo":123}'