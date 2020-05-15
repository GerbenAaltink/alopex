# Alopex

This libary is a copy of https://dataset.readthedocs.io/en/latest/ 

Features on top of the original library:
 - filtering by __like or __gt like in Django ORM
 - limit fields you want to have returned while fetching data 

Missing features:
 - only support for SQLITE. Original library supports more 

## Supported filters
Filters used below can be used by update, upsert, delete and count.
 - __eq
 - __lt
 - __lte
 - __gt
 - __gte
 - __like (Is case instenstive. Is default sqlite behavior)

Example usage:
```
db.myTable.find(null, name__like="%test%")
```
## Indexes

### Automatic create
Find record method creates indexes automatically.
For example: 
```
dataSet.find(null, 'z': 1, 'y__eq': 2})
```
will create index `idx_y_z`. 
It only applies to fields filtered with `=` operator. 

### Manual create
Promise returns false if index already exist. 
```
dataSet.myNewTable.createIndex(['age', 'length']).then(isIndexCreated=>{
    console.info('Created new index is ', isIndexCreated)
})
```

## Connect
Giving up a database name to connect is optional. Default database if none given is ':memory:'
```
const connect = require('./alopex')
const dataSet = connect()
```

## Insert
This code will create a new table called `myNewTable` and will add the required fields automatically.
```
dataSet.myNewTable.insert({'name': 'John', 'surname': 'Snow'}).then(pk=>{
    console.info('Inserted record has primary key', pk)
})
```

## Select
### Select all columns by using null
```
dataSet.myNewTable.find(null, {'name': 'John'}).then(records=>{
    console.info('Found records', records)
})
```
### Select specific columns by column of field names
```
dataSet.myNewTable.find(['surname'], {'name': 'John'}).then(records=>{
    console.info('Found records', records)
})
```

## Update
### Update using array of column names
```
dataSet.myNewTable.update({'name': 'John', 'id': 5}, ['id']).then(updateCount=>{
    console.info('Updated records', updateCount)
})
```

### Update using object
```
dataSet.myNewTable.update({'name': 'John'}, {'surname__like': 'Snow'}).then(updateCount=>{
    console.info('Updated records', updateCount)
})
```

## Delete 
```
dataSet.myNewTable.delete{'name': 'John'}).then(changeCount=>{
    console.info('Total deleted', changeCount)
})
```

## Count
```
dataSet.myNewTable.count{'name': 'John'}).then(total=>{
    console.info('Total records matcing criterea', total)
})
```

