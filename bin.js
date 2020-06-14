const finder = require('./index');
const prompt = require('prompt-sync', { sigint: true })();

// cli args
let args = process.argv.slice(2);
[...inputs] = args;

// default options
let options = {
   ignore: [
      '2017 (Reports to update)',
      '_fishbowl-custom-reports-util',
      "matt's backup",
      'Pre 20.5',
      'pre 20.5',
      'pre20.5',
      'Pre20.5',
      'Pre 2020.5',
      'Pre2020.5',
      'pre2020.5',
      'pre 2020.5',
   ],
   output: {
      customFields: {
         run: inputs.includes('--output-disable-customFields') ? false : true,
         path: inputs.includes('--output-path-customFields')
            ? inputs[inputs.indexOf('--output-path-customFields') + 1]
            : './custom-field-finder-output',
      },
      loneJaspers: {
         run: inputs.includes('--output-disable-loneJaspers') ? false : true,
         path: inputs.includes('--output-path-loneJaspers')
            ? inputs[inputs.indexOf('--output-path-loneJaspers') + 1]
            : './custom-field-finder-output',
      },
   },
   log: {
      all: inputs.includes('--log-all') ? true : false,
      structure: {
         group: inputs.includes('--log-structure-group') ? true : false,
         item: inputs.includes('--log-structure-item') ? true : false,
      },
      hasCustomFields: {
         found: inputs.includes('--log-hasCustomFields') ? true : false,
      },
      getInfo: {
         fileData: inputs.includes('--log-getInfo') ? true : false,
      },
   },
   keywords: [
      'customvarchar',
      'customfieldview',
      'customfield',
      'customset',
      'customdecimal',
      'custominteger',
      'customtimestamp',
      'customvarcharlong',
      'customlistitem',
      'customlist',
   ],
};

if (inputs.includes('-h') || inputs.includes('--help')) {
   let help = require('./help.json');
   console.group(`${help.header}\n${''.padEnd(help.header.length, '-')}`);
   console.group(help.path.header);
   console.log(help.path.details);
   console.groupEnd(help.path.header);
   console.group(help.output.header);
   console.log(help.output.customFieldPath);
   console.log(help.output.loneJasperPath);
   console.log(help.output.disableCustomFields);
   console.log(help.output.disableLoneJaspers);
   console.groupEnd(help.output.header);
   console.group(help.log.header);
   console.log(help.log.all);
   console.log(help.log.structureGroup);
   console.log(help.log.structureItem);
   console.log(help.log.hasCustomFields);
   console.log(help.log.getInfo);
   console.groupEnd(help.log.header);
   console.groupEnd(help.header);
   return;
}

let start;

if (inputs.length === 0 || !inputs.includes('--path'))
   start = prompt('Enter a starting path: ');

if (inputs.includes('--path')) start = inputs[inputs.indexOf('--path') + 1];

finder(start, options);
