require 'coffee-errors'

chai = require 'chai'
winston = require 'winston'
logentries = require 'logentries'
sinon = require 'sinon'
{Logentries} = require '../src/winston-logentries'

expect = chai.expect
chai.use require 'sinon-chai'

describe 'Logentries', ->
  logger = null
  service = null

  beforeEach ->
    service = logentries.logger token: ''
    transport = new Logentries service
    logger = new winston.Logger transports: [transport]

    sinon.spy service, 'log'

  it 'calls service `log` method without meta', ->
    logger.info 'hello!'
    expect(service.log).to.have.been.calledWith 'info', 'hello!'

  it 'calls service `log` method with meta', ->
    logger.info 'hello!', foo: 123
    expect(service.log).to.have.been.calledWith 'info', 'hello! {"foo":123}'
