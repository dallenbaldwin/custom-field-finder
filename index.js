const fs = require('fs');
const o2c = require('objects-to-csv');

function hasCustomFields(xml, options = {}) {
   let lines = xml.split('\r\n');
   for (line of lines) {
      for (keyword of options.keywords) {
         let lower = line.toLowerCase();
         if (lower.includes(keyword)) {
            if (options.log.hasCustomFields.found) {
               console.log(keyword);
               console.log(line);
            }
            return true;
         }
      }
   }
   return false;
}

function getInfo(dirItem = '', options = {}) {
   let fileData = fs.readFileSync(dirItem, 'utf-8');
   if (options.log.getInfo.fileData) console.log(fileData);
   return fileData;
}

function readdir(currentPath = '.', dataset = [], options = {}) {
   let fItems = fs.readdirSync(currentPath);
   fItems = fItems
      .filter(i => !i.startsWith('.'))
      .filter(i => !options.ignore.includes(i));
   fItems.forEach(item => {
      let itemPath = `${currentPath}/${item}`;
      let itemStats = fs.statSync(itemPath);
      let customReports = currentPath.split('/').indexOf('custom-reports');
      let customer = currentPath.split('/')[customReports + 1];
      if (itemStats.isDirectory()) {
         if (options.log.structure.group) console.group(itemPath);
         readdir(itemPath, dataset, options);
         if (options.log.structure.group) console.groupEnd();
      } else if (item.endsWith('.jrxml')) {
         if (options.log.structure.item) console.group(itemPath);
         let itemInfo = getInfo(itemPath, options);
         let customFieldCheck = hasCustomFields(itemInfo, options);
         if (customFieldCheck) {
            dataset.push({
               customer: customer,
               filename: item,
            });
         }
         if (options.log.structure.item) console.groupEnd();
      } else if (item.endsWith('.jasper')) {
         if (options.log.structure.item) console.log(itemPath);
         let partnerItems = fItems
            .filter(i => i !== item)
            .map(i => i.replace('.jrxml', '.jasper'))
            .filter(i => i === item).length;
         if (partnerItems === 0) {
            dataset.push({
               customer: customer,
               filename: item,
            });
         }
      }
   });
   return;
}

function fdate(number = 0) {
   return number.toString().padStart(2, '0');
}

async function createCSV(dataset = [], filename = 'dataset', rootdir = '.') {
   if (!fs.existsSync(rootdir)) fs.mkdirSync(`./${rootdir}`);
   const csv = new o2c(dataset);
   let now = new Date();
   let dateString = `${now.getFullYear()}-${fdate(now.getMonth())}-${fdate(
      now.getDate()
   )}`;
   let timeString = `${fdate(now.getHours())}-${fdate(now.getMinutes())}-${fdate(
      now.getSeconds()
   )}`;
   await csv.toDisk(`${rootdir}/${filename} ${dateString}_${timeString}.csv`);
}

module.exports = function (options) {
   let dataset = [];
   let start = options.rootPath;
   readdir(start, dataset, options);
   if (options.output.customFields.run) {
      let customFields = dataset.filter(x => x.filename.endsWith('.jrxml'));
      console.log(`Creating custom-fields csv at ${options.output.customFields.path}`);
      createCSV(customFields, `custom-fields`, options.output.customFields.path);
   }
   if (options.output.loneJaspers.run) {
      let loners = dataset.filter(x => x.filename.endsWith('.jasper'));
      console.log(`Creating lone-jaspers csv at ${options.output.loneJaspers.path}`);
      createCSV(loners, `lone-jaspers`, options.output.loneJaspers.path);
   }
   console.log('Done!');
};
