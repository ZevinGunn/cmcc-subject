const path = require('node:path');
const { worker } = require('../grid-catalog');

const [command = 'summary', ...ids] = process.argv.slice(2);
const args = command === 'collect' ? { operation: 'scan', ids: ids.length ? ids : undefined }
  : command === 'discover' ? { operation: 'scan', mode: 'discover' }
  : command === 'add' ? { operation: 'configure', ids }
  : command === 'export' ? { operation: 'export', directory: path.resolve(ids[0] || 'data/grid-exports') }
  : { operation: command };
worker(args, (value) => console.log(JSON.stringify(value)))
  .then((result) => { if (args.operation !== 'scan') console.log(JSON.stringify(result)); })
  .catch((error) => { console.error(error.message); process.exitCode = 1; });
