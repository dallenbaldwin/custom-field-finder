const finder = require('./index');

let args = process.argv.slice(2);
[input, ...others] = args;
let options;
if (input === undefined) {
   options = require('./options.json');
   console.log('Using default options');
} else {
   options = require(input);
   console.log(`Using JSON defined at "${input}"`);
}
if (others.length > 0) console.log(`Can't use these inputs\n\t${others.toString()}`);

finder(options);
