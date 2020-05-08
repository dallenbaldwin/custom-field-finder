// TODO: return csv of jrxmls that have custom field stuff
// TODO: return csv of jaspers who don't have a jrxml

const fs = require('fs');
const xml2js = require('xml2js');
const o2c = require('objects-to-csv');

function hasCustomFields(xml = {}) {
   const KEYWORDS = [
      'customdecimal',
      'customfield',
      'customfieldview',
      'custominteger',
      'customlist',
      'customlistitem',
      'customset',
      'customtimestamp',
      'customvarchar',
      'customvarcharlong',
   ];
   let queries;

   if (xml.subDataset === undefined) queries = xml.queryString;
   else {
      queries = xml.queryString;
      xml.subDataset.forEach(dataset => {
         queries.push(...dataset.queryString);
      });
   }
   fs.writeFileSync(`./logs/results`, queries, { flag: 'a+' });
   console.log('done');
   return true;
}

function getInfo(dirItem) {
   let fileData = fs.readFileSync(dirItem, 'utf-8');
   let parser = new xml2js.Parser();
   let data;
   parser.parseString(fileData, function (err, result) {
      if (err) data = err;
      else data = result.jasperReport;
   });
   return { jrxml: data, path: dirItem.split('/') };
}

function readdir(currentPath = '.', dataset = []) {
   let fItems = fs.readdirSync(currentPath);
   fItems = fItems.filter(i => !i.startsWith('.')).filter(i => !i.startsWith('_'));
   fItems.forEach(item => {
      let itemPath = `./${currentPath}/${item}`;
      let itemStats = fs.statSync(itemPath);
      let customReports = currentPath.split('/').indexOf('custom-reports');
      let customer = currentPath.split('/')[customReports + 1];
      if (itemStats.isDirectory()) {
         readdir(itemPath, dataset);
      } else if (item.endsWith('.jrxml')) {
         let itemInfo = getInfo(itemPath);
         if (hasCustomFields(itemInfo.jrxml)) {
            dataset.push({
               customer: customer,
               filename: item,
            });
         }
      } else if (item.endsWith('.jasper')) {
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

async function main() {
   [rootPath, ...options] = process.argv.slice(2);

   rootPath = '../custom-reports/ADAGIO MEDICAL';
   let dataset = [];
   readdir(rootPath, dataset);
   let customFields = dataset.filter(x => x.filename.endsWith('.jrxml'));
   let loners = dataset.filter(x => x.filename.endsWith('.jasper'));
   // const customFieldCSV = new o2c(customFields);
   // await customFieldCSV.toDisk('./customFields.csv');
}

main();
