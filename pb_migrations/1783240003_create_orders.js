migrate(
  (app) => {
    // 1. Create 'orders' collection
    const collection = new Collection({
      name: "orders",
      type: "base",
      listRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.role = "admin")',
      viewRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.role = "admin")',
      createRule: "", // Allow anyone to place an order (guests included)
      updateRule: '@request.auth.role = "admin"',
      deleteRule: '@request.auth.role = "admin"',
    });

    collection.fields.add(new RelationField({
      name: "user",
      required: false,
      collectionId: "_pb_users_auth_",
      cascadeDelete: false,
      maxSelect: 1
    }));

    collection.fields.add(new JSONField({
      name: "items",
      required: true
    }));

    collection.fields.add(new NumberField({
      name: "total",
      required: true
    }));

    collection.fields.add(new NumberField({
      name: "subtotal",
      required: true
    }));

    collection.fields.add(new NumberField({
      name: "discount",
      required: false
    }));

    collection.fields.add(new NumberField({
      name: "shipping",
      required: false
    }));

    collection.fields.add(new NumberField({
      name: "tax",
      required: false
    }));

    collection.fields.add(new SelectField({
      name: "status",
      required: true,
      maxSelect: 1,
      values: ["awaiting_payment", "pending", "processing", "shipped", "delivered", "cancelled"]
    }));

    collection.fields.add(new JSONField({
      name: "customer",
      required: true
    }));

    collection.fields.add(new JSONField({
      name: "payment",
      required: false
    }));

    app.save(collection);

    // 2. Add 'cart' and 'wishlist' JSON fields to 'users' collection
    const users = app.findCollectionByNameOrId("users");
    users.fields.add(new JSONField({
      name: "cart",
      required: false
    }));
    users.fields.add(new JSONField({
      name: "wishlist",
      required: false
    }));
    app.save(users);
  },
  (app) => {
    // Down migrations
    try {
      const collection = app.findCollectionByNameOrId("orders");
      app.delete(collection);
    } catch (e) {}

    try {
      const users = app.findCollectionByNameOrId("users");
      users.fields.removeByName("cart");
      users.fields.removeByName("wishlist");
      app.save(users);
    } catch (e) {}
  }
);
