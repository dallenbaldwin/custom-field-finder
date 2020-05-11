const fs = require('fs');
const xml2js = require('xml2js');
const o2c = require('objects-to-csv');

function hasCustomFields(xml = {}, options = {}) {
   if (options.log.hasCustomFields) console.log(xml);
   let queries = [];
   if (xml.subDataset === undefined) queries.concat(xml.queryString);
   else {
      queries.concat(xml.queryString);
      let subQueries = xml.subDataset
         .map(x => x.queryString)
         .filter(x => x !== undefined);
      queries.push(...subQueries);
   }
   for (line of queries) {
      for (keyword of options.keywords) {
         let lower;
         if (typeof line === 'string') {
            lower = line.toLowerCase();
         } else if (typeof line === 'object') {
            lower = JSON.stringify(line).toLowerCase();
         }
         if (lower.includes(keyword)) return true;
      }
   }
   return false;
}

function getInfo(dirItem = '', options = {}) {
   let fileData = fs.readFileSync(dirItem, 'utf-8');
   let parser = new xml2js.Parser();
   let data;
   parser.parseString(fileData, function (err, result) {
      if (err) data = err;
      else data = result.jasperReport;
   });
   return { jrxml: data, path: dirItem.split('/') };
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
         if (options.log.group) console.group(itemPath);
         readdir(itemPath, dataset, options);
         if (options.log.group) console.groupEnd();
      } else if (item.endsWith('.jrxml')) {
         if (options.log.item) console.log(itemPath);
         let itemInfo = getInfo(itemPath, options);
         let customFieldCheck = hasCustomFields(itemInfo.jrxml, options);
         if (customFieldCheck) {
            dataset.push({
               customer: customer,
               filename: item,
            });
         }
      } else if (item.endsWith('.jasper')) {
         if (options.log.item) console.log(itemPath);
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
      createCSV(customFields, `custom-fields`, options.output.customFields.path);
   }
   if (options.output.loneJaspers.run) {
      let loners = dataset.filter(x => x.filename.endsWith('.jasper'));
      createCSV(loners, `lone-jaspers`, options.output.loneJaspers.path);
   }
};
