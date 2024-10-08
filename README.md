# Alopex

Alopex is an easy to use data store. It can be used for persistent data in a sqlite file or just blazing fast in memory. It automatically synchronizes schema when you have have new fields or a new table. It has only TWO dependencies. Critical packages working with data like alopex shouldn't have much requirements. Alopex is future proof! 

Features:
 - insert
 - update
 - upsert
 - delete 
 - count 
 - find 
 - findOne 
 - automatic index creation
 - manual index creation
 - persistent storage
 - memory storage 
 - easy filtering while fetching data like in Django ORM
 - fetching specific fields by providing an array with column names

This libary is the NodeJS version of my favorite python module: https://dataset.readthedocs.io/en/latest/

Try it out on: https://npm.runkit.com/alopex

## Installation
```
npm install -g npm@latest
npm install alopex --save
```

## Connect
Giving up a database name to connect is optional. Default database if none given is ':memory:'
```
const alopex = require('alopex')
const dataSet = await alopex()
```

## Insert
This code will create a new table called `myNewTable` and will add the required fields automatically.
```
dataSet.myNewTable.insert({'name': 'John', 'surname': 'Snow'}).then(pk=>{
    console.info('Inserted record has primary key', pk)
})
```

## Select
#### Select all columns by using null
```
dataSet.myNewTable.find({'name': 'John'}, null).then(records=>{
    console.info('Found records', records)
})
```
#### Select specific columns by column of field names
```
dataSet.myNewTable.find({'name': 'John'}, ['surname']).then(records=>{
    console.info('Found records', records)
})
```
#### Order by ascending
```
dataSet.myNewTable.find({'_orderBy': 'id'}).then(records=>{
    console.info('Found records', records)
})
```
#### Order by descending
Descending sorting is done by adding `-` in front of the column name.
```
dataSet.myNewTable.find({'_orderBy': '-id'}).then(records=>{
    console.info('Found records', records)
})
```
#### Limit
```
dataSet.myNewTable.find({'_limit': 100}).then(records=>{
    console.info('Found 100 records', records)
})
```
#### Offset 
Using _offset without _limit is ignored.
```
dataSet.myNewTable.find({'_limit': 100, '_offset': 100}).then(records=>{
    console.info('Found 100 records starting from offset 100', records)
})
```

## Update
#### Update using array of column names
```
dataSet.myNewTable.update({'name': 'John', 'id': 5}, ['id']).then(updateCount=>{
    console.info('Updated records', updateCount)
})
```

#### Update using object
```
dataSet.myNewTable.update({'name': 'John'}, {'surname__like': '%Snow%'}).then(updateCount=>{
    console.info('Updated records', updateCount)
})
```
## Delete 
```
dataSet.myNewTable.delete({'name': 'John'}).then(changeCount=>{
    console.info('Total deleted', changeCount)
})
```

## Count
```
dataSet.myNewTable.count({'name': 'John'}).then(total=>{
    console.info('Total records matcing criteria', total)
})
```

## Supported filters
Filters used below can be used by update, upsert, delete and count.
 - __eq
 - __lt
 - __lte
 - __gt
 - __gte
 - __isnull
 - __like (Case instenstive. This is default sqlite behavior)

Example usage:
```
dataSet.myTable.find({'name__like': '%test%', 'age__isnull': false, 'id__gte': 5, '_orderBy': '-id', '_limit': 5, '_offset': 10})
```

## Indexes

#### Automatic create
Find record method creates indexes automatically.
For example: 
```
dataSet.find({'z': 1, 'y__eq': 2})
```
will create index `idx_y_z`. 
It only applies to fields filtered with `=` operator. 

#### Manual create
Promise returns false if index already exist. 
```
dataSet.myNewTable.createIndex(['age', 'length']).then(isIndexCreated=>{
    console.info('Created new index is ', isIndexCreated)
})
```

