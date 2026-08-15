# Grocy MCP tool catalog

Generated from the vendored Grocy OpenAPI specification (86 operations) plus the source-discovered OpenAPI serving endpoint. Do not edit manually; run `npm run generate:tools`.

Equipment, products, locations, shopping lists, recipes, quantity units, and other Grocy master-data entities use the generic `grocy_*_objects_by_entity` tools. Pass the supported entity name (for example `equipment` or `products`).

## System (6)

| Tool                                         | Method | Grocy endpoint                     | Capability                                                                |
| -------------------------------------------- | ------ | ---------------------------------- | ------------------------------------------------------------------------- |
| `grocy_get_system_info`                      | GET    | `/system/info`                     | Returns information about the installed Grocy version, PHP runtime and OS |
| `grocy_get_system_db_changed_time`           | GET    | `/system/db-changed-time`          | Returns the time when the database was last changed                       |
| `grocy_get_system_config`                    | GET    | `/system/config`                   | Returns all config settings                                               |
| `grocy_get_system_time`                      | GET    | `/system/time`                     | Returns the current server time                                           |
| `grocy_get_system_localization_strings`      | GET    | `/system/localization-strings`     | Returns all localization strings (in the by the user desired language)    |
| `grocy_post_system_log_missing_localization` | POST   | `/system/log-missing-localization` | Logs a missing localization string                                        |

## Master data, users, files, and custom entities (22)

| Tool                                         | Method | Grocy endpoint                    | Capability                                                                       |
| -------------------------------------------- | ------ | --------------------------------- | -------------------------------------------------------------------------------- |
| `grocy_get_objects_by_entity`                | GET    | `/objects/{entity}`               | Returns all objects of the given entity                                          |
| `grocy_post_objects_by_entity`               | POST   | `/objects/{entity}`               | Adds a single object of the given entity                                         |
| `grocy_get_objects_by_entity_by_objectid`    | GET    | `/objects/{entity}/{objectId}`    | Returns a single object of the given entity                                      |
| `grocy_put_objects_by_entity_by_objectid`    | PUT    | `/objects/{entity}/{objectId}`    | Edits the given object of the given entity                                       |
| `grocy_delete_objects_by_entity_by_objectid` | DELETE | `/objects/{entity}/{objectId}`    | Deletes a single object of the given entity                                      |
| `grocy_get_userfields_by_entity_by_objectid` | GET    | `/userfields/{entity}/{objectId}` | Returns all userfields with their values of the given object of the given entity |
| `grocy_put_userfields_by_entity_by_objectid` | PUT    | `/userfields/{entity}/{objectId}` | Edits the given userfields of the given object of the given entity               |
| `grocy_get_files_by_group_by_filename`       | GET    | `/files/{group}/{fileName}`       | Serves the given file                                                            |
| `grocy_put_files_by_group_by_filename`       | PUT    | `/files/{group}/{fileName}`       | Uploads a single file                                                            |
| `grocy_delete_files_by_group_by_filename`    | DELETE | `/files/{group}/{fileName}`       | Deletes the given file                                                           |
| `grocy_get_users`                            | GET    | `/users`                          | Returns all users                                                                |
| `grocy_post_users`                           | POST   | `/users`                          | Creates a new user                                                               |
| `grocy_put_users_by_userid`                  | PUT    | `/users/{userId}`                 | Edits the given user                                                             |
| `grocy_delete_users_by_userid`               | DELETE | `/users/{userId}`                 | Deletes the given user                                                           |
| `grocy_get_users_by_userid_permissions`      | GET    | `/users/{userId}/permissions`     | Returns the assigned permissions of the given user                               |
| `grocy_post_users_by_userid_permissions`     | POST   | `/users/{userId}/permissions`     | Adds a permission to the given user                                              |
| `grocy_put_users_by_userid_permissions`      | PUT    | `/users/{userId}/permissions`     | Replaces the assigned permissions of the given user                              |
| `grocy_get_user`                             | GET    | `/user`                           | Returns the currently authenticated user                                         |
| `grocy_get_user_settings`                    | GET    | `/user/settings`                  | Returns all settings of the currently logged in user                             |
| `grocy_get_user_settings_by_settingkey`      | GET    | `/user/settings/{settingKey}`     | Returns the given setting of the currently logged in user                        |
| `grocy_put_user_settings_by_settingkey`      | PUT    | `/user/settings/{settingKey}`     | Sets the given setting of the currently logged in user                           |
| `grocy_delete_user_settings_by_settingkey`   | DELETE | `/user/settings/{settingKey}`     | Deletes the given setting of the currently logged in user                        |

## Stock (28)

| Tool                                                                      | Method | Grocy endpoint                                                | Capability                                                                                                                                                              |
| ------------------------------------------------------------------------- | ------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grocy_get_stock`                                                         | GET    | `/stock`                                                      | Returns all products which are currently in stock incl. the next due date per product                                                                                   |
| `grocy_get_stock_entry_by_entryid`                                        | GET    | `/stock/entry/{entryId}`                                      | Returns details of the given stock                                                                                                                                      |
| `grocy_put_stock_entry_by_entryid`                                        | PUT    | `/stock/entry/{entryId}`                                      | Edits the stock entry                                                                                                                                                   |
| `grocy_get_stock_entry_by_entryid_printlabel`                             | GET    | `/stock/entry/{entryId}/printlabel`                           | Prints the Grocycode / stock entry label of the given entry on the configured label printer                                                                             |
| `grocy_get_stock_volatile`                                                | GET    | `/stock/volatile`                                             | Returns all products which are due soon, overdue, expired or currently missing                                                                                          |
| `grocy_get_stock_products_by_productid`                                   | GET    | `/stock/products/{productId}`                                 | Returns details of the given product                                                                                                                                    |
| `grocy_get_stock_products_by_productid_locations`                         | GET    | `/stock/products/{productId}/locations`                       | Returns all locations where the given product currently has stock                                                                                                       |
| `grocy_get_stock_products_by_productid_entries`                           | GET    | `/stock/products/{productId}/entries`                         | Returns all stock entries of the given product in order of next use (Opened first, then first due first, then first in first out)                                       |
| `grocy_get_stock_products_by_productid_price_history`                     | GET    | `/stock/products/{productId}/price-history`                   | Returns the price history of the given product                                                                                                                          |
| `grocy_post_stock_products_by_productid_add`                              | POST   | `/stock/products/{productId}/add`                             | Adds the given amount of the given product to stock                                                                                                                     |
| `grocy_post_stock_products_by_productid_consume`                          | POST   | `/stock/products/{productId}/consume`                         | Removes the given amount of the given product from stock                                                                                                                |
| `grocy_post_stock_products_by_productid_transfer`                         | POST   | `/stock/products/{productId}/transfer`                        | Transfers the given amount of the given product from one location to another (this is currently not supported for tare weight handling enabled products)                |
| `grocy_post_stock_products_by_productid_inventory`                        | POST   | `/stock/products/{productId}/inventory`                       | Inventories the given product (adds/removes based on the given new amount)                                                                                              |
| `grocy_post_stock_products_by_productid_open`                             | POST   | `/stock/products/{productId}/open`                            | Marks the given amount of the given product as opened                                                                                                                   |
| `grocy_get_stock_products_by_productid_printlabel`                        | GET    | `/stock/products/{productId}/printlabel`                      | Prints the Grocycode label of the given product on the configured label printer                                                                                         |
| `grocy_post_stock_products_by_productidtokeep_merge_by_productidtoremove` | POST   | `/stock/products/{productIdToKeep}/merge/{productIdToRemove}` | Merges two products into one                                                                                                                                            |
| `grocy_get_stock_products_by_barcode_by_barcode`                          | GET    | `/stock/products/by-barcode/{barcode}`                        | Returns details of the given product by its barcode                                                                                                                     |
| `grocy_post_stock_products_by_barcode_by_barcode_add`                     | POST   | `/stock/products/by-barcode/{barcode}/add`                    | Adds the given amount of the by its barcode given product to stock                                                                                                      |
| `grocy_post_stock_products_by_barcode_by_barcode_consume`                 | POST   | `/stock/products/by-barcode/{barcode}/consume`                | Removes the given amount of the by its barcode given product from stock                                                                                                 |
| `grocy_post_stock_products_by_barcode_by_barcode_transfer`                | POST   | `/stock/products/by-barcode/{barcode}/transfer`               | Transfers the given amount of the by its barcode given product from one location to another (this is currently not supported for tare weight handling enabled products) |
| `grocy_post_stock_products_by_barcode_by_barcode_inventory`               | POST   | `/stock/products/by-barcode/{barcode}/inventory`              | Inventories the by its barcode given product (adds/removes based on the given new amount)                                                                               |
| `grocy_post_stock_products_by_barcode_by_barcode_open`                    | POST   | `/stock/products/by-barcode/{barcode}/open`                   | Marks the given amount of the by its barcode given product as opened                                                                                                    |
| `grocy_get_stock_locations_by_locationid_entries`                         | GET    | `/stock/locations/{locationId}/entries`                       | Returns all stock entries of the given location                                                                                                                         |
| `grocy_get_stock_bookings_by_bookingid`                                   | GET    | `/stock/bookings/{bookingId}`                                 | Returns the given stock booking                                                                                                                                         |
| `grocy_post_stock_bookings_by_bookingid_undo`                             | POST   | `/stock/bookings/{bookingId}/undo`                            | Undoes a booking                                                                                                                                                        |
| `grocy_get_stock_transactions_by_transactionid`                           | GET    | `/stock/transactions/{transactionId}`                         | Returns all stock bookings of the given transaction id                                                                                                                  |
| `grocy_post_stock_transactions_by_transactionid_undo`                     | POST   | `/stock/transactions/{transactionId}/undo`                    | Undoes a transaction                                                                                                                                                    |
| `grocy_get_stock_barcodes_external_lookup_by_barcode`                     | GET    | `/stock/barcodes/external-lookup/{barcode}`                   | Executes an external barcode lookoup via the configured plugin with the given barcode                                                                                   |

## Shopping list (6)

| Tool                                                 | Method | Grocy endpoint                             | Capability                                                                                   |
| ---------------------------------------------------- | ------ | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `grocy_post_stock_shoppinglist_add_missing_products` | POST   | `/stock/shoppinglist/add-missing-products` | Adds currently missing products (below defined min. stock amount) to the given shopping list |
| `grocy_post_stock_shoppinglist_add_overdue_products` | POST   | `/stock/shoppinglist/add-overdue-products` | Adds overdue products to the given shopping list                                             |
| `grocy_post_stock_shoppinglist_add_expired_products` | POST   | `/stock/shoppinglist/add-expired-products` | Adds expired products to the given shopping list                                             |
| `grocy_post_stock_shoppinglist_clear`                | POST   | `/stock/shoppinglist/clear`                | Removes all items from the given shopping list                                               |
| `grocy_post_stock_shoppinglist_add_product`          | POST   | `/stock/shoppinglist/add-product`          | Adds the given amount of the given product to the given shopping list                        |
| `grocy_post_stock_shoppinglist_remove_product`       | POST   | `/stock/shoppinglist/remove-product`       | Removes the given amount of the given product from the given shopping list, if it is on it   |

## Recipes (6)

| Tool                                                                        | Method | Grocy endpoint                                                   | Capability                                                                                                                                     |
| --------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `grocy_post_recipes_by_recipeid_add_not_fulfilled_products_to_shoppinglist` | POST   | `/recipes/{recipeId}/add-not-fulfilled-products-to-shoppinglist` | Adds all missing products for the given recipe to the shopping list                                                                            |
| `grocy_get_recipes_by_recipeid_fulfillment`                                 | GET    | `/recipes/{recipeId}/fulfillment`                                | Get stock fulfillment information for the given recipe                                                                                         |
| `grocy_post_recipes_by_recipeid_consume`                                    | POST   | `/recipes/{recipeId}/consume`                                    | Consumes all in stock ingredients of the given recipe (for ingredients that are only partially in stock, the in stock amount will be consumed) |
| `grocy_get_recipes_fulfillment`                                             | GET    | `/recipes/fulfillment`                                           | Get stock fulfillment information for all recipe                                                                                               |
| `grocy_post_recipes_by_recipeid_copy`                                       | POST   | `/recipes/{recipeId}/copy`                                       | Copies a recipe                                                                                                                                |
| `grocy_get_recipes_by_recipeid_printlabel`                                  | GET    | `/recipes/{recipeId}/printlabel`                                 | Prints the Grocycode label of the given recipe on the configured label printer                                                                 |

## Chores (7)

| Tool                                                          | Method | Grocy endpoint                                    | Capability                                                                    |
| ------------------------------------------------------------- | ------ | ------------------------------------------------- | ----------------------------------------------------------------------------- |
| `grocy_get_chores`                                            | GET    | `/chores`                                         | Returns all chores incl. the next estimated execution time per chore          |
| `grocy_get_chores_by_choreid`                                 | GET    | `/chores/{choreId}`                               | Returns details of the given chore                                            |
| `grocy_post_chores_by_choreid_execute`                        | POST   | `/chores/{choreId}/execute`                       | Tracks an execution of the given chore                                        |
| `grocy_post_chores_executions_by_executionid_undo`            | POST   | `/chores/executions/{executionId}/undo`           | Undoes a chore execution                                                      |
| `grocy_post_chores_executions_calculate_next_assignments`     | POST   | `/chores/executions/calculate-next-assignments`   | (Re)calculates all next user assignments of all chores                        |
| `grocy_get_chores_by_choreid_printlabel`                      | GET    | `/chores/{choreId}/printlabel`                    | Prints the Grocycode label of the given chore on the configured label printer |
| `grocy_post_chores_by_choreidtokeep_merge_by_choreidtoremove` | POST   | `/chores/{choreIdToKeep}/merge/{choreIdToRemove}` | Merges two chores into one                                                    |

## Batteries (5)

| Tool                                                       | Method | Grocy endpoint                                  | Capability                                                                      |
| ---------------------------------------------------------- | ------ | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| `grocy_get_batteries`                                      | GET    | `/batteries`                                    | Returns all batteries incl. the next estimated charge time per battery          |
| `grocy_get_batteries_by_batteryid`                         | GET    | `/batteries/{batteryId}`                        | Returns details of the given battery                                            |
| `grocy_post_batteries_by_batteryid_charge`                 | POST   | `/batteries/{batteryId}/charge`                 | Tracks a charge cycle of the given battery                                      |
| `grocy_post_batteries_charge_cycles_by_chargecycleid_undo` | POST   | `/batteries/charge-cycles/{chargeCycleId}/undo` | Undoes a battery charge cycle                                                   |
| `grocy_get_batteries_by_batteryid_printlabel`              | GET    | `/batteries/{batteryId}/printlabel`             | Prints the Grocycode label of the given battery on the configured label printer |

## Tasks (3)

| Tool                                  | Method | Grocy endpoint             | Capability                               |
| ------------------------------------- | ------ | -------------------------- | ---------------------------------------- |
| `grocy_get_tasks`                     | GET    | `/tasks`                   | Returns all tasks which are not done yet |
| `grocy_post_tasks_by_taskid_complete` | POST   | `/tasks/{taskId}/complete` | Marks the given task as completed        |
| `grocy_post_tasks_by_taskid_undo`     | POST   | `/tasks/{taskId}/undo`     | Marks the given task as not completed    |

## Calendar (2)

| Tool                                   | Method | Grocy endpoint                | Capability                                                      |
| -------------------------------------- | ------ | ----------------------------- | --------------------------------------------------------------- |
| `grocy_get_calendar_ical`              | GET    | `/calendar/ical`              | Returns the calendar in iCal format                             |
| `grocy_get_calendar_ical_sharing_link` | GET    | `/calendar/ical/sharing-link` | Returns a (public) sharing link for the calendar in iCal format |

## Printing (1)

| Tool                                   | Method | Grocy endpoint                | Capability                                     |
| -------------------------------------- | ------ | ----------------------------- | ---------------------------------------------- |
| `grocy_get_print_shoppinglist_thermal` | GET    | `/print/shoppinglist/thermal` | Prints the shoppinglist with a thermal printer |

## OpenAPI (1)

| Tool                              | Method | Grocy endpoint           | Capability                                 |
| --------------------------------- | ------ | ------------------------ | ------------------------------------------ |
| `grocy_get_openapi_specification` | GET    | `/openapi/specification` | Returns Grocy's generated OpenAPI document |
