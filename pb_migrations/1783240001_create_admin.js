migrate((app) => {
  try {
    const record = app.findAuthRecordByEmail("users", "hemanthmadhusudhan@gmail.com");
    record.setPassword("Hemanth@1234");
    record.set("role", "admin");
    record.set("verified", true);
    record.set("disabled", false);
    app.save(record);
    console.log("Admin user hemanthmadhusudhan@gmail.com successfully updated with password Hemanth@1234.");
  } catch (e) {
    // If not found, create a new record
    const collection = app.findCollectionByNameOrId("users");
    const record = new Record(collection);
    record.setEmail("hemanthmadhusudhan@gmail.com");
    record.setPassword("Hemanth@1234");
    record.set("role", "admin");
    record.set("verified", true);
    record.set("disabled", false);
    app.save(record);
    console.log("Admin user hemanthmadhusudhan@gmail.com successfully created with password Hemanth@1234.");
  }
}, (app) => {
  // Rollback logic is not needed for this setup script
});
