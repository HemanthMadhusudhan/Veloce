migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("users");

    collection.otp.enabled = true;
    collection.otp.duration = 300; // 5 minutes
    collection.otp.length = 6;     // 6 digits

    collection.authRule = "disabled = false";

    app.save(collection);
  },
  (app) => {}
);
