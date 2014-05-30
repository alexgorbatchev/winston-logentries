winston = require 'winston'
logentries = require 'logentries'

class Logentries extends winston.Transport
  constructor: ({token, level}) ->
    super

    @name = 'logentries'
    @level = level or 'info'
    @logentries = new logentries.logger {token}
    @logentries.level @level

  log: (level, msg, meta, callback) ->
    if meta?
      meta = JSON.stringify meta
      meta = if meta is '{}' then '' else " #{meta}"
    data = msg + meta
    @logentries.log level, data
    callback null, true

winston.transports.Logentries = Logentries

module.exports = {Logentries}