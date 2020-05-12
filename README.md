# Custom Field Finding Utility

## Summary

Intended for use by those with access to the Fishbowl custom-reports Repository.

Recursively searches a given folder for .jrxml files with keywords defined in the options.json and outputs csv files to a given location.

**_ALL RELATIVE PATHS ARE RELATIVE TO THE FOLDER OF THE PROGRAM'S EXECUTION_**

## Usage

### CLI

-  Default options
   -  `node bin.js`
   -  `custom-field-finder-{OS(.exe)}`
-  Custom options
   -  `node bin.js ./customOptions.json`
   -  `node bin.js "C:/Users/{user}/Desktop/customOptions.json"`
   -  `custom-field-finder-{OS(.exe)} ./customOptions.json`
   -  `custom-field-finder-{OS(.exe)} "C:/Users/{user}/Desktop/customOptions.json"`
   -  Custom JSON structure must match `options.json`

### Packaged Executable

-  Double click to run with default options
-  Call executable in terminal of choice to pass custom options

## Options

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

-  structure.group : logs folders
-  structure.item: logs .jrxml and .jasper files that are checked
-  hasCustomFields.found: logs the keyword and line of found line
-  getInfo.fileData: logs the full contents of the .jrxml file

#### Defaults

-  structure.group : true
-  structure.item: false
-  hasCustomFields.found: false
-  getInfo.fileData: false

---

### keywords

List of keywords to include in search. Keywords are expected to be all lowercase.

The default list is ordered by expected volume. Tweaking the order may yield faster runtime, but probably not by much as the program executes asynchronously with the following logic

```txt
for every line in .jrxml
   for every keyword
      go to next file if found
```

#### Defaults

-  customvarchar
-  customfieldview
-  customfield
-  customset
-  customdecimal
-  custominteger
-  customtimestamp
-  customvarcharlong
-  customlistitem
-  customlist
