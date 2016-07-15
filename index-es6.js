import winston from 'winston';
import logentries from 'logentries';

export class Logentries extends winston.Transport {
  constructor({ token, level, levels = winston.levels, secure = true }) {
    super();

    this.name = 'logentries';
    this.level = level || 'info';
    this.logentries = new logentries.logger({ token, levels, secure });
    this.logentries.level(this.level);
  }

  log(level, msg, meta, callback) {
    if (meta != null) {
      meta = JSON.stringify(meta);
      meta = meta === '{}' ? '' : ` ${meta}`;
    }

    let data = msg + meta;
    this.logentries.log(level, data);
    return callback(null, true);
  }
}

winston.transports.Logentries = Logentries;
