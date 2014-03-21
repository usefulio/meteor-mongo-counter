Tinytest.add('mongo-counter', function(test){
	Package.deleteCounters();
	test.equal( AtomicCounter.increment('foo'), 1 )
	test.equal( AtomicCounter.increment('foo'), 2 )
	test.equal( AtomicCounter.increment('foo'), 3 )
	test.equal( AtomicCounter.increment('foo', 10), 13 )
	test.equal( AtomicCounter.decrement('foo'), 12 )
	test.equal( AtomicCounter.decrement('foo', 10), 2 )
	AtomicCounter.set( 'foo', 100 )
	test.equal( AtomicCounter.increment('foo'), 101 )
	test.equal( AtomicCounter.increment('bar'), 1 )
});
