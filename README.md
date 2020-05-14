# dataset.js

This libary is a copy of https://dataset.readthedocs.io/en/latest/ 

Futures on top of the original library:
 - filtering by __like or __gt like in Django ORM
 - limit fields you want to have returned while fetching data 

Mising futures:
 - creating auto indexes (in development)
 - only support for SQLITE. Original library supports more 

## Supported filters
Filters used below can be used by update, upsert, delete and count.
 - __eq
 - __lt
 - __lte
 - __gt
 - __gte
 - __like (Is case instenstive. Is default sqlite behavior

Example usage:
```
db.myTable.search(null, name__like="%test%")
```


## Connecting to a database
Giving up a database name to connect is optional. If none given, ':memory:' is used.
```
const connect = require('./alopex')
const dataSet = connect()
```

## Insert records
This code will create a new table called `myNewTable` and will add the required fields automatically
```
const connect = require('./alopex')
const dataSet = connect()
dataSet.myNewTable.insert({'name': 'John', 'surname': 'Snow'}).then(pk=>{
    console.info('Inserted record has primary key', pk)
})
```

## Select records
### Select all fields by using null
```
const connect = require('./alopex')
const dataSet = connect()
dataSet.myNewTable.select(null, {'name': 'John'}).then(pk=>{
    console.info('Inserted record has primary key', pk)
})
```
### Select specific fields by array of field names
```
const connect = require('./alopex')
const dataSet = connect()
dataSet.myNewTable.select(['surname'], {'name': 'John'}).then(rows=>{
    console.info('Found rows', rows)
})
```

## Delete records
```
const connect = require('./alopex')
const dataSet = connect()
dataSet.myNewTable.delete{'name': 'John'}).then(changeCount=>{
    console.info('Total deleted', changeCount)
})
```

## Count records
```
const connect = require('./alopex')
const dataSet = connect()
dataSet.myNewTable.count{'name': 'John'}).then(total=>{
    console.info('Total records matcing criterea', total)
})
```
