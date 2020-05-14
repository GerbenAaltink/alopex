# dataset.js

This libary is a copy of https://dataset.readthedocs.io/en/latest/ 

Futures on top of the original library:
 - filtering by __like or __gt like in Django ORM
 - limit fields you want to have returned while fetching data 

Mising futures:
 - creating auto indexes (in development)
 - only support for SQLITE. Original library supports more 


## Connecting to a database
Giving up a database name to connect is optional. If none given, ':memory:' is used.
```
const connect = require('./dataset')
const dataSet = connect()
```

## Inserting data to table
This code will create a new table called `myNewTable` and will add the required fields automatically
```
const connect = require('./dataset')
const dataSet = connect()
dataSet.myNewTable.insert({'name': 'John', 'surname': 'Snow'}).then(pk=>{
    console.info('Inserted record has primary key', pk)
})
```

## Selecting data of a table
### Select all fields
```
const connect = require('./dataset')
const dataSet = connect()
dataSet.myNewTable.select(null, {'name': 'John'}).then(pk=>{
    console.info('Inserted record has primary key', pk)
})
```

### Select specific fields
```
const connect = require('./dataset')
const dataSet = connect()
dataSet.myNewTable.select(['surname'], {'name': 'John'}).then(rows=>{
    console.info('Found rows', rows)
})
```