if(Meteor.isServer){
  var COUNTER_COLLECTION_NAME = 'atomic_mongo_counter';

  // simple validation function
  isAvailable = function(value){
    return typeof value !== "undefined" && value !== null;
  };

  getRawMongoCollection = function(collectionName){
    return MongoInternals.defaultRemoteCollectionDriver().mongo.rawCollection(collectionName);
  };

  getCounterCollection = function(){
    return getRawMongoCollection(COUNTER_COLLECTION_NAME);
  };

  callCounter = function(method){
    var args = [];  
    for(var i = 1; i < arguments.length; i++){
      args.push(arguments[i]);
    }
    var Counters = getCounterCollection();
    return Meteor.wrapAsync(Counters[method]).apply(Counters, args);
  };

  _deleteCounters = function(){
    callCounter('remove', {}, {safe: true})
  };

  _incrementCounter = function(counterName, amount){
    if(!isAvailable(amount)){
      amount = 1;
    }
    var newDoc = callCounter(
      'findAndModify',
      {_id: counterName},         // query
      null,                       // sort
      {$inc: {seq: amount}},      // update
      {new: true, upsert: true}   // options
    )                             // callback added by wrapAsync
    return newDoc.seq;
  };

  _decrementCounter = function(counterName, amount){
    if(!isAvailable(amount)){
      amount = 1;
    }
    return _incrementCounter(counterName, -amount)
  };

  _setCounter = function(counterName, value){
    if(!isAvailable(amount)){
      amount = 1;
    }
    var newDoc = callCounter(
      'findAndModify',
      {_id: counterName},         // query
      null,                       // sort
      {$set: {seq: value}},       // update
      {new: true, upsert: true}   // options
    )                             // callback added by wrapAsync
    return newDoc.seq;
  };

  _createCounter = function(counterName, initialValue){
    return callCounter( 'insert', {_id: counterName, seq: initialValue} );
  };

  Meteor.methods({
    '/_atomic_counter/increment': function(name, amount){
      return _incrementCounter(name, amount);
    }
    , '/_atomic_counter/decrement': function(name, amount){
      return _decrementCounter(name, amount)
    }
    , '/_atomic_counter/set': function(name, value){
      return _setCounter(name, value)
    }
  });
}

AtomicCounter = {};

AtomicCounter.increment = function(name, amount, cb){
  if(typeof amount === "function"){
    cb = amount;
    amount = 1;
  }
  if(Meteor.isClient){
    Meteor.call('/_atomic_counter/increment', name, amount, cb)
  }else{
    return _incrementCounter(name, amount);
  }
};

AtomicCounter.decrement = function(name, amount, cb){
  if(typeof amount === "function"){
    cb = amount;
    amount = 1;
  }
  if(Meteor.isClient){
    Meteor.call('/_atomic_counter/decrement', name, amount, cb)
  }else{
    return _decrementCounter(name, amount);
  }
};

AtomicCounter.set = function(name, value, cb){
  if(typeof value === "function"){
    cb = value;
    value = 1;
  }
  if(Meteor.isClient){
    Meteor.call('/_atomic_counter/set', name, value, cb)
  }else{
    return _setCounter(name, value);
  }
};

if(Package){
  Package.deleteCounters = _deleteCounters;
}