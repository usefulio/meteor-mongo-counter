Package.describe({
  summary: "Atomic counters stored in MongoDB"
});

Package.on_use(function (api) {
  api.use(['mongo-livedata'], 'server');
  api.add_files('counter.js', ['client','server']);
  api.export('AtomicCounter', ['client','server']);
});

Package.on_test(function(api) {
  api.use(['tinytest']);
  api.use(['mongo-livedata'], 'server');
  api.add_files('counter.js', ['client','server']);
  api.add_files('counter-tests.js', 'server');
});
