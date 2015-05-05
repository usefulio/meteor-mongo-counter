Package.describe({
	name: 'useful:mongo-counter',
	version: '0.1.0',
	summary: 'Atomic counters stored in MongoDB',
	git: 'https://github.com/usefulio/meteor-mongo-counter',
	documentation: 'README.md'
});

Package.onUse(function(api) {

	api.versionsFrom('1.0');
	api.use(['mongo-livedata'], 'server');
	api.addFiles('counter.js', ['client','server']);
	api.export('AtomicCounter', ['client','server']);
});

Package.onTest(function(api) {
	api.use(['tinytest']);
	api.use(['mongo-livedata'], 'server');
	api.addFiles('counter.js', ['client','server']);
	api.addFiles('counter-tests.js', 'server');
});
