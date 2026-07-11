migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("users");

    collection.listRule = '@request.auth.role = "admin"';
    collection.viewRule = 'id = @request.auth.id || @request.auth.role = "admin"';
    collection.createRule =
      '(@request.body.role:isset = false || @request.body.role = "user") && @request.body.disabled:isset = false';
    collection.updateRule =
      '(id = @request.auth.id && @request.body.role:changed = false && @request.body.disabled:changed = false) || @request.auth.role = "admin"';
    collection.deleteRule = '@request.auth.role = "admin" && id != @request.auth.id';
    collection.authRule = "verified = true && disabled = false";

    collection.options = {
      ...collection.options,
      oauth2: {
        enabled: true,
        providers: [
          {
            name: "google",
            clientId: "GOOGLE_CLIENT_ID",
            clientSecret: "GOOGLE_CLIENT_SECRET",
            displayName: "Google"
          }
        ]
      }
    };

    collection.fields.add(
      new SelectField({
        name: "role",
        required: false,
        maxSelect: 1,
        values: ["user", "admin"],
      }),
    );
    collection.fields.add(new BoolField({ name: "disabled" }));
    collection.fields.add(new TextField({ name: "fullName", max: 120 }));
    collection.fields.add(new TextField({ name: "phone", max: 30 }));
    collection.fields.add(new TextField({ name: "addressLine1", max: 200 }));
    collection.fields.add(new TextField({ name: "addressLine2", max: 200 }));
    collection.fields.add(new TextField({ name: "city", max: 80 }));
    collection.fields.add(new TextField({ name: "state", max: 80 }));
    collection.fields.add(new TextField({ name: "postalCode", max: 20 }));
    collection.fields.add(new TextField({ name: "country", max: 80 }));

    app.save(collection);
  },
  (app) => {},
);
