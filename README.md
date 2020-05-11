# Custom Field Finding Utility

## Summary

Intended for use by those with access to the Fishbowl custom-reports Repository.

Recursively searches a given folder for .jrxml files with keywords defined in the options.json and outputs csv files to a given location.

**_ALL RELATIVE PATHS ARE RELATIVE TO THE FOLDER OF THE PROGRAM'S EXECUTION_**

## Usage

node bin.js

## Options

*_These options can only be modified if used with Node.js_*

---

### rootPath

Starting folder for the search.

Can be a relative or an absolute path.

#### Default : "custom-reports"

---

### ignore

A list of folders to ignore during the search. No need to enter the full path, just the folder names.

Note\* Linux and MacOS folders are case sensitive while Window's are not.

#### Defaults

-  2017 (Reports to update)
-  \_fishbowl-custom-reports-util
-  matt's backup

---

### output

The program has two outputs.

1. A CSV of files that include the keywords
2. A CSV of files that do not have an accompanying .jrxml file (i.e. can't verify whether they contain the keywords or not).

"run" determines whether to include the output file.

"path" determines where to put the output file. This path can be relative or absolute. If a folder does not exist at the given path, the program will create one.

#### Defaults

customFields

-  run : true,
-  path : "./custom-field-finder-output"

loneJaspers

-  run : true,
-  path : "./custom-field-finder-output"

---

### log

Enables console logging for the program. Intended for testing purposes.

-  group : logs folders
-  item: logs .jrxml and .jasper files that are checked
-  hasCustomFields: logs the parsed jrxml object

#### Defaults

-  group: false
-  item: false
-  hasCustomFields: false

---

### keywords

List of keywords to include in search. Keywords are expected to be all lowercase.

#### Defaults

-  customdecimal
-  customfield
-  customfieldview
-  custominteger
-  customlist
-  customlistitem
-  customset
-  customtimestamp
-  customvarchar
-  customvarcharlong
