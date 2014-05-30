winston = require 'winston'

class Logentries extends winston.Transport
  constructor: (@logentries, options = {}) ->
    super

    @name = 'logentries'
    @level = options.level or 'info'

    if @level?
      logentries.level @level

  log: (level, msg, meta, callback) ->
    if meta?
      meta = JSON.stringify meta
      meta = if meta is '{}' then '' else " #{meta}"
    data = msg + meta
    @logentries.log level, data
    callback null, true

winston.transports.Logentries = Logentries

module.exports = {Logentries}