import { Command } from 'commander';
const program = new Command();

program
  .option('-c, --config <file>');

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;
console.log(program.args[0].split(options.separator, limit));
