winston = require 'winston'
logentries = require 'logentries'

class Logentries extends winston.Transport
  constructor: ({token, level, levels = winston.levels, secure = true}) ->
    super

    @name = 'logentries'
    @level = level or 'info'
    @logentries = new logentries.logger {token, levels, secure}
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