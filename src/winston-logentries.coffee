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
    level = @remapLevels level

    if meta?
      meta = JSON.stringify meta
      meta = if meta is '{}' then '' else " #{meta}"

    data = msg + meta
    @logentries.log level, data
    callback null, true

  remapLevels: (level) ->
    return 'warning' if level is 'warn'
    return 'err' if level is 'error'
    level

winston.transports.Logentries = Logentries

module.exports = {Logentries}