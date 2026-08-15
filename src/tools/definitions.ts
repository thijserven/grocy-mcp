// Generated from openapi/grocy.openapi.json. Do not edit manually; run npm run generate:tools.
import * as z from "zod/v4";

import type { ApiRequest, HttpMethod, QueryValue } from "../api/client.js";

export interface ToolDefinition {
  description: string;
  inputSchema: z.ZodType<Record<string, unknown>>;
  method: HttpMethod;
  name: string;
  request: (input: Record<string, unknown>) => ApiRequest;
  title: string;
}

function tool(
  name: string,
  title: string,
  description: string,
  method: HttpMethod,
  path: string,
  inputSchema: z.ZodType<Record<string, unknown>>,
): ToolDefinition {
  return {
    name,
    title,
    description,
    method,
    inputSchema,
    request: (input) => requestFor(method, path, input),
  };
}

function requestFor(
  method: HttpMethod,
  template: string,
  input: Record<string, unknown>,
): ApiRequest {
  const path = template.replace(/\{([^}]+)\}/g, (_match, key: string) =>
    encodeURIComponent(String(input[key])),
  );
  const query: Record<string, QueryValue> = {};
  for (const [key, value] of Object.entries(input)) {
    if (
      !template.includes("{" + key + "}") &&
      key !== "body" &&
      value !== undefined
    )
      query[key] = value as QueryValue;
  }
  return {
    method,
    path,
    ...(Object.keys(query).length > 0 ? { query } : {}),
    ...(input.body === undefined ? {} : { body: input.body }),
  };
}

export const TOOL_DEFINITIONS: readonly ToolDefinition[] = [
  tool(
    "grocy_get_system_info",
    "Returns information about the installed Grocy version, PHP runtime and OS",
    "Returns information about the installed Grocy version, PHP runtime and OS. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/system/info",
    z.object({}) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_system_db_changed_time",
    "Returns the time when the database was last changed",
    "Returns the time when the database was last changed. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/system/db-changed-time",
    z.object({}) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_system_config",
    "Returns all config settings",
    "Returns all config settings. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/system/config",
    z.object({}) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_system_time",
    "Returns the current server time",
    "Returns the current server time. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/system/time",
    z.object({
      offset: z
        .number()
        .int()
        .describe(
          "Offset of timestamp in seconds. Can be positive or negative.",
        )
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_system_localization_strings",
    "Returns all localization strings (in the by the user desired language)",
    "Returns all localization strings (in the by the user desired language). Calls the corresponding Grocy REST API operation.",
    "GET",
    "/system/localization-strings",
    z.object({}) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_system_log_missing_localization",
    "Logs a missing localization string",
    "Logs a missing localization string. Only when MODE == 'dev', so should only be called then",
    "POST",
    "/system/log-missing-localization",
    z.object({
      body: z
        .object({ text: z.string().describe("Grocy text.").optional() })
        .describe("A valid MissingLocalizationRequest object"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_objects_by_entity",
    "Returns all objects of the given entity",
    "Returns all objects of the given entity. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/objects/{entity}",
    z.object({
      entity: z.unknown().describe("A valid entity name"),
      "query[]": z
        .array(z.string())
        .describe(
          "An array of filter conditions, each of them is a string in the form of `<field><condition><value>` where<br>`<field>` is a valid field name<br>`<condition>` is a comparison operator, one of<br>&nbsp;&nbsp;`=` equal<br>&nbsp;&nbsp;`!=` not equal<br>&nbsp;&nbsp;`~` LIKE<br>&nbsp;&nbsp;`!~` not LIKE<br>&nbsp;&nbsp;`<` less<br>&nbsp;&nbsp;`>` greater<br>&nbsp;&nbsp;`<=` less or equal<br>&nbsp;&nbsp;`>=` greater or equal<br>&nbsp;&nbsp;`§` regular expression<br>`<value>` is the value to search for",
        )
        .optional(),
      order: z
        .string()
        .describe(
          "A valid field name by which the response should be ordered, use the separator `:` to specify the sort order (`asc` or `desc`, defaults to `asc` when omitted)",
        )
        .optional(),
      limit: z
        .number()
        .int()
        .describe("The maximum number of objects to return")
        .optional(),
      offset: z
        .number()
        .int()
        .describe("The number of objects to skip")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_objects_by_entity",
    "Adds a single object of the given entity",
    "Adds a single object of the given entity. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/objects/{entity}",
    z.object({
      entity: z.unknown().describe("A valid entity name"),
      body: z
        .union([
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            name: z.string().describe("Grocy name.").optional(),
            description: z.string().describe("Grocy description.").optional(),
            location_id: z
              .number()
              .int()
              .describe("Grocy location id.")
              .optional(),
            qu_id_purchase: z
              .number()
              .int()
              .describe("Grocy qu id purchase.")
              .optional(),
            qu_id_stock: z
              .number()
              .int()
              .describe("Grocy qu id stock.")
              .optional(),
            enable_tare_weight_handling: z
              .number()
              .int()
              .describe("Grocy enable tare weight handling.")
              .optional(),
            not_check_stock_fulfillment_for_recipes: z
              .number()
              .int()
              .describe("Grocy not check stock fulfillment for recipes.")
              .optional(),
            product_group_id: z
              .number()
              .int()
              .describe("Grocy product group id.")
              .optional(),
            tare_weight: z.number().describe("Grocy tare weight.").optional(),
            min_stock_amount: z
              .number()
              .describe("Grocy min stock amount.")
              .optional(),
            default_best_before_days: z
              .number()
              .int()
              .describe("Grocy default best before days.")
              .optional(),
            default_best_before_days_after_open: z
              .number()
              .int()
              .describe("Grocy default best before days after open.")
              .optional(),
            picture_file_name: z
              .string()
              .describe("Grocy picture file name.")
              .optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            shopping_location_id: z
              .number()
              .int()
              .describe("Grocy shopping location id.")
              .optional(),
            treat_opened_as_out_of_stock: z
              .number()
              .int()
              .describe("Grocy treat opened as out of stock.")
              .optional(),
            auto_reprint_stock_label: z
              .number()
              .int()
              .describe("Grocy auto reprint stock label.")
              .optional(),
            no_own_stock: z
              .number()
              .int()
              .describe("Grocy no own stock.")
              .optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
            should_not_be_frozen: z
              .number()
              .int()
              .describe("Grocy should not be frozen.")
              .optional(),
            default_consume_location_id: z
              .number()
              .int()
              .describe("Grocy default consume location id.")
              .optional(),
            move_on_open: z
              .number()
              .int()
              .describe("Grocy move on open.")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            name: z.string().describe("Grocy name.").optional(),
            description: z.string().describe("Grocy description.").optional(),
            period_type: z
              .enum(["manually", "hourly", "daily", "weekly", "monthly"])
              .describe("Grocy period type.")
              .optional(),
            period_config: z
              .string()
              .describe("Grocy period config.")
              .optional(),
            period_days: z
              .number()
              .int()
              .describe("Grocy period days.")
              .optional(),
            track_date_only: z
              .boolean()
              .describe("Grocy track date only.")
              .optional(),
            rollover: z.boolean().describe("Grocy rollover.").optional(),
            assignment_type: z
              .enum([
                "no-assignment",
                "who-least-did-first",
                "random",
                "in-alphabetical-order",
              ])
              .describe("Grocy assignment type.")
              .optional(),
            assignment_config: z
              .string()
              .describe("Grocy assignment config.")
              .optional(),
            next_execution_assigned_to_user_id: z
              .number()
              .int()
              .describe("Grocy next execution assigned to user id.")
              .optional(),
            start_date: z.iso
              .datetime()
              .describe("Grocy start date.")
              .optional(),
            rescheduled_date: z.iso
              .datetime()
              .describe("Grocy rescheduled date.")
              .optional(),
            rescheduled_next_execution_assigned_to_user_id: z
              .number()
              .int()
              .describe("Grocy rescheduled next execution assigned to user id.")
              .optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            name: z.string().describe("Grocy name.").optional(),
            description: z.string().describe("Grocy description.").optional(),
            used_in: z.string().describe("Grocy used in.").optional(),
            charge_interval_days: z
              .number()
              .int()
              .describe("Grocy charge interval days.")
              .optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            name: z.string().describe("Grocy name.").optional(),
            description: z.string().describe("Grocy description.").optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            name: z.string().describe("Grocy name.").optional(),
            name_plural: z.string().describe("Grocy name plural.").optional(),
            description: z.string().describe("Grocy description.").optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            plural_forms: z.string().describe("Grocy plural forms.").optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            shopping_list_id: z
              .number()
              .int()
              .describe("Grocy shopping list id.")
              .optional(),
            product_id: z
              .number()
              .int()
              .describe("Grocy product id.")
              .optional(),
            note: z.string().describe("Grocy note.").optional(),
            amount: z.number().describe("The manual entered amount").optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            product_id: z
              .number()
              .int()
              .describe("Grocy product id.")
              .optional(),
            location_id: z
              .number()
              .int()
              .describe("Grocy location id.")
              .optional(),
            shopping_location_id: z
              .number()
              .int()
              .describe("Grocy shopping location id.")
              .optional(),
            amount: z.number().describe("Grocy amount.").optional(),
            best_before_date: z
              .string()
              .describe("Grocy best before date.")
              .optional(),
            purchased_date: z
              .string()
              .describe("Grocy purchased date.")
              .optional(),
            stock_id: z
              .string()
              .describe(
                "A unique id which references this stock entry during its lifetime",
              )
              .optional(),
            price: z.number().describe("Grocy price.").optional(),
            open: z.number().int().describe("Grocy open.").optional(),
            opened_date: z.string().describe("Grocy opened date.").optional(),
            note: z.string().describe("Grocy note.").optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
          }),
          z.object({
            product_id: z
              .number()
              .int()
              .describe("Grocy product id.")
              .optional(),
            barcode: z.string().describe("Grocy barcode.").optional(),
            qu_id: z.number().int().describe("Grocy qu id.").optional(),
            shopping_location_id: z
              .number()
              .int()
              .describe("Grocy shopping location id.")
              .optional(),
            amount: z.number().describe("Grocy amount.").optional(),
            last_price: z.number().describe("Grocy last price.").optional(),
            note: z.string().describe("Grocy note.").optional(),
          }),
        ])
        .describe(
          "A valid entity object of the entity specified in parameter *entity*",
        ),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_objects_by_entity_by_objectid",
    "Returns a single object of the given entity",
    "Returns a single object of the given entity. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/objects/{entity}/{objectId}",
    z.object({
      entity: z.unknown().describe("A valid entity name"),
      objectId: z
        .number()
        .int()
        .describe("A valid object id of the given entity"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_put_objects_by_entity_by_objectid",
    "Edits the given object of the given entity",
    "Edits the given object of the given entity. Calls the corresponding Grocy REST API operation.",
    "PUT",
    "/objects/{entity}/{objectId}",
    z.object({
      entity: z.unknown().describe("A valid entity name"),
      objectId: z
        .number()
        .int()
        .describe("A valid object id of the given entity"),
      body: z
        .union([
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            name: z.string().describe("Grocy name.").optional(),
            description: z.string().describe("Grocy description.").optional(),
            location_id: z
              .number()
              .int()
              .describe("Grocy location id.")
              .optional(),
            qu_id_purchase: z
              .number()
              .int()
              .describe("Grocy qu id purchase.")
              .optional(),
            qu_id_stock: z
              .number()
              .int()
              .describe("Grocy qu id stock.")
              .optional(),
            enable_tare_weight_handling: z
              .number()
              .int()
              .describe("Grocy enable tare weight handling.")
              .optional(),
            not_check_stock_fulfillment_for_recipes: z
              .number()
              .int()
              .describe("Grocy not check stock fulfillment for recipes.")
              .optional(),
            product_group_id: z
              .number()
              .int()
              .describe("Grocy product group id.")
              .optional(),
            tare_weight: z.number().describe("Grocy tare weight.").optional(),
            min_stock_amount: z
              .number()
              .describe("Grocy min stock amount.")
              .optional(),
            default_best_before_days: z
              .number()
              .int()
              .describe("Grocy default best before days.")
              .optional(),
            default_best_before_days_after_open: z
              .number()
              .int()
              .describe("Grocy default best before days after open.")
              .optional(),
            picture_file_name: z
              .string()
              .describe("Grocy picture file name.")
              .optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            shopping_location_id: z
              .number()
              .int()
              .describe("Grocy shopping location id.")
              .optional(),
            treat_opened_as_out_of_stock: z
              .number()
              .int()
              .describe("Grocy treat opened as out of stock.")
              .optional(),
            auto_reprint_stock_label: z
              .number()
              .int()
              .describe("Grocy auto reprint stock label.")
              .optional(),
            no_own_stock: z
              .number()
              .int()
              .describe("Grocy no own stock.")
              .optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
            should_not_be_frozen: z
              .number()
              .int()
              .describe("Grocy should not be frozen.")
              .optional(),
            default_consume_location_id: z
              .number()
              .int()
              .describe("Grocy default consume location id.")
              .optional(),
            move_on_open: z
              .number()
              .int()
              .describe("Grocy move on open.")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            name: z.string().describe("Grocy name.").optional(),
            description: z.string().describe("Grocy description.").optional(),
            period_type: z
              .enum(["manually", "hourly", "daily", "weekly", "monthly"])
              .describe("Grocy period type.")
              .optional(),
            period_config: z
              .string()
              .describe("Grocy period config.")
              .optional(),
            period_days: z
              .number()
              .int()
              .describe("Grocy period days.")
              .optional(),
            track_date_only: z
              .boolean()
              .describe("Grocy track date only.")
              .optional(),
            rollover: z.boolean().describe("Grocy rollover.").optional(),
            assignment_type: z
              .enum([
                "no-assignment",
                "who-least-did-first",
                "random",
                "in-alphabetical-order",
              ])
              .describe("Grocy assignment type.")
              .optional(),
            assignment_config: z
              .string()
              .describe("Grocy assignment config.")
              .optional(),
            next_execution_assigned_to_user_id: z
              .number()
              .int()
              .describe("Grocy next execution assigned to user id.")
              .optional(),
            start_date: z.iso
              .datetime()
              .describe("Grocy start date.")
              .optional(),
            rescheduled_date: z.iso
              .datetime()
              .describe("Grocy rescheduled date.")
              .optional(),
            rescheduled_next_execution_assigned_to_user_id: z
              .number()
              .int()
              .describe("Grocy rescheduled next execution assigned to user id.")
              .optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            name: z.string().describe("Grocy name.").optional(),
            description: z.string().describe("Grocy description.").optional(),
            used_in: z.string().describe("Grocy used in.").optional(),
            charge_interval_days: z
              .number()
              .int()
              .describe("Grocy charge interval days.")
              .optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            name: z.string().describe("Grocy name.").optional(),
            description: z.string().describe("Grocy description.").optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            name: z.string().describe("Grocy name.").optional(),
            name_plural: z.string().describe("Grocy name plural.").optional(),
            description: z.string().describe("Grocy description.").optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            plural_forms: z.string().describe("Grocy plural forms.").optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            shopping_list_id: z
              .number()
              .int()
              .describe("Grocy shopping list id.")
              .optional(),
            product_id: z
              .number()
              .int()
              .describe("Grocy product id.")
              .optional(),
            note: z.string().describe("Grocy note.").optional(),
            amount: z.number().describe("The manual entered amount").optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
            userfields: z
              .record(z.string(), z.unknown())
              .describe("Key/value pairs of userfields")
              .optional(),
          }),
          z.object({
            id: z.number().int().describe("Grocy id.").optional(),
            product_id: z
              .number()
              .int()
              .describe("Grocy product id.")
              .optional(),
            location_id: z
              .number()
              .int()
              .describe("Grocy location id.")
              .optional(),
            shopping_location_id: z
              .number()
              .int()
              .describe("Grocy shopping location id.")
              .optional(),
            amount: z.number().describe("Grocy amount.").optional(),
            best_before_date: z
              .string()
              .describe("Grocy best before date.")
              .optional(),
            purchased_date: z
              .string()
              .describe("Grocy purchased date.")
              .optional(),
            stock_id: z
              .string()
              .describe(
                "A unique id which references this stock entry during its lifetime",
              )
              .optional(),
            price: z.number().describe("Grocy price.").optional(),
            open: z.number().int().describe("Grocy open.").optional(),
            opened_date: z.string().describe("Grocy opened date.").optional(),
            note: z.string().describe("Grocy note.").optional(),
            row_created_timestamp: z.iso
              .datetime()
              .describe("Grocy row created timestamp.")
              .optional(),
          }),
          z.object({
            product_id: z
              .number()
              .int()
              .describe("Grocy product id.")
              .optional(),
            barcode: z.string().describe("Grocy barcode.").optional(),
            qu_id: z.number().int().describe("Grocy qu id.").optional(),
            shopping_location_id: z
              .number()
              .int()
              .describe("Grocy shopping location id.")
              .optional(),
            amount: z.number().describe("Grocy amount.").optional(),
            last_price: z.number().describe("Grocy last price.").optional(),
            note: z.string().describe("Grocy note.").optional(),
          }),
        ])
        .describe(
          "A valid entity object of the entity specified in parameter *entity*",
        ),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_delete_objects_by_entity_by_objectid",
    "Deletes a single object of the given entity",
    "Deletes a single object of the given entity. Calls the corresponding Grocy REST API operation.",
    "DELETE",
    "/objects/{entity}/{objectId}",
    z.object({
      entity: z.unknown().describe("A valid entity name"),
      objectId: z
        .number()
        .int()
        .describe("A valid object id of the given entity"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_userfields_by_entity_by_objectid",
    "Returns all userfields with their values of the given object of the given entity",
    "Returns all userfields with their values of the given object of the given entity. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/userfields/{entity}/{objectId}",
    z.object({
      entity: z.unknown().describe("A valid entity name"),
      objectId: z.string().describe("A valid object id of the given entity"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_put_userfields_by_entity_by_objectid",
    "Edits the given userfields of the given object of the given entity",
    "Edits the given userfields of the given object of the given entity. Calls the corresponding Grocy REST API operation.",
    "PUT",
    "/userfields/{entity}/{objectId}",
    z.object({
      entity: z.unknown().describe("A valid entity name"),
      objectId: z.string().describe("A valid object id of the given entity"),
      body: z
        .unknown()
        .describe(
          "A valid entity object of the entity specified in parameter *entity*",
        ),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_files_by_group_by_filename",
    "Serves the given file",
    "Serves the given file. With proper Content-Type header",
    "GET",
    "/files/{group}/{fileName}",
    z.object({
      group: z
        .enum([
          "equipmentmanuals",
          "recipepictures",
          "productpictures",
          "userfiles",
          "userpictures",
        ])
        .describe("The file group"),
      fileName: z
        .string()
        .describe("The file name (including extension)<br>**BASE64 encoded**"),
      force_serve_as: z
        .enum(["picture"])
        .describe("Force the file to be served as the given type")
        .optional(),
      best_fit_height: z
        .number()
        .describe(
          "Only when using `force_serve_as` = `picture`: Downscale the picture to the given height while maintaining the aspect ratio",
        )
        .optional(),
      best_fit_width: z
        .number()
        .describe(
          "Only when using `force_serve_as` = `picture`: Downscale the picture to the given width while maintaining the aspect ratio",
        )
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_put_files_by_group_by_filename",
    "Uploads a single file",
    "Uploads a single file. The file will be stored at /data/storage/{group}/{file_name} (you need to remember the group and file name to get or delete it again)",
    "PUT",
    "/files/{group}/{fileName}",
    z.object({
      group: z
        .enum([
          "equipmentmanuals",
          "recipepictures",
          "productpictures",
          "userfiles",
          "userpictures",
        ])
        .describe("The file group"),
      fileName: z
        .string()
        .describe("The file name (including extension)<br>**BASE64 encoded**"),
      body: z
        .string()
        .describe("JSON request body sent unchanged to Grocy.")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_delete_files_by_group_by_filename",
    "Deletes the given file",
    "Deletes the given file. Calls the corresponding Grocy REST API operation.",
    "DELETE",
    "/files/{group}/{fileName}",
    z.object({
      group: z
        .enum([
          "equipmentmanuals",
          "recipepictures",
          "productpictures",
          "userfiles",
          "userpictures",
        ])
        .describe("The file group"),
      fileName: z
        .string()
        .describe("The file name (including extension)<br>**BASE64 encoded**"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_users",
    "Returns all users",
    "Returns all users. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/users",
    z.object({
      "query[]": z
        .array(z.string())
        .describe(
          "An array of filter conditions, each of them is a string in the form of `<field><condition><value>` where<br>`<field>` is a valid field name<br>`<condition>` is a comparison operator, one of<br>&nbsp;&nbsp;`=` equal<br>&nbsp;&nbsp;`!=` not equal<br>&nbsp;&nbsp;`~` LIKE<br>&nbsp;&nbsp;`!~` not LIKE<br>&nbsp;&nbsp;`<` less<br>&nbsp;&nbsp;`>` greater<br>&nbsp;&nbsp;`<=` less or equal<br>&nbsp;&nbsp;`>=` greater or equal<br>&nbsp;&nbsp;`§` regular expression<br>`<value>` is the value to search for",
        )
        .optional(),
      order: z
        .string()
        .describe(
          "A valid field name by which the response should be ordered, use the separator `:` to specify the sort order (`asc` or `desc`, defaults to `asc` when omitted)",
        )
        .optional(),
      limit: z
        .number()
        .int()
        .describe("The maximum number of objects to return")
        .optional(),
      offset: z
        .number()
        .int()
        .describe("The number of objects to skip")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_users",
    "Creates a new user",
    "Creates a new user. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/users",
    z.object({
      body: z
        .object({
          id: z.number().int().describe("Grocy id.").optional(),
          username: z.string().describe("Grocy username.").optional(),
          first_name: z.string().describe("Grocy first name.").optional(),
          last_name: z.string().describe("Grocy last name.").optional(),
          password: z.string().describe("Grocy password.").optional(),
          picture_file_name: z
            .string()
            .describe("Grocy picture file name.")
            .optional(),
          row_created_timestamp: z.iso
            .datetime()
            .describe("Grocy row created timestamp.")
            .optional(),
        })
        .describe("A valid user object"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_put_users_by_userid",
    "Edits the given user",
    "Edits the given user. Calls the corresponding Grocy REST API operation.",
    "PUT",
    "/users/{userId}",
    z.object({
      userId: z.number().int().describe("A valid user id"),
      body: z
        .object({
          id: z.number().int().describe("Grocy id.").optional(),
          username: z.string().describe("Grocy username.").optional(),
          first_name: z.string().describe("Grocy first name.").optional(),
          last_name: z.string().describe("Grocy last name.").optional(),
          password: z.string().describe("Grocy password.").optional(),
          picture_file_name: z
            .string()
            .describe("Grocy picture file name.")
            .optional(),
          row_created_timestamp: z.iso
            .datetime()
            .describe("Grocy row created timestamp.")
            .optional(),
        })
        .describe("A valid user object"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_delete_users_by_userid",
    "Deletes the given user",
    "Deletes the given user. Calls the corresponding Grocy REST API operation.",
    "DELETE",
    "/users/{userId}",
    z.object({
      userId: z.number().int().describe("A valid user id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_users_by_userid_permissions",
    "Returns the assigned permissions of the given user",
    'Returns the assigned permissions of the given user. See "GET /objects/permission_hierarchy" for a permission name / id mapping',
    "GET",
    "/users/{userId}/permissions",
    z.object({
      userId: z.number().int().describe("A valid user id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_users_by_userid_permissions",
    "Adds a permission to the given user",
    'Adds a permission to the given user. See "GET /objects/permission_hierarchy" for a permission name / id mapping',
    "POST",
    "/users/{userId}/permissions",
    z.object({
      userId: z.number().int().describe("A valid user id"),
      body: z
        .object({
          permissions_id: z
            .number()
            .int()
            .describe("A permission ids")
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_put_users_by_userid_permissions",
    "Replaces the assigned permissions of the given user",
    'Replaces the assigned permissions of the given user. See "GET /objects/permission_hierarchy" for a permission name / id mapping',
    "PUT",
    "/users/{userId}/permissions",
    z.object({
      userId: z.number().int().describe("A valid user id"),
      body: z
        .object({
          permissions: z
            .array(z.number().int())
            .describe("A list of permission ids")
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_user",
    "Returns the currently authenticated user",
    "Returns the currently authenticated user. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/user",
    z.object({}) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_user_settings",
    "Returns all settings of the currently logged in user",
    "Returns all settings of the currently logged in user. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/user/settings",
    z.object({}) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_user_settings_by_settingkey",
    "Returns the given setting of the currently logged in user",
    "Returns the given setting of the currently logged in user. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/user/settings/{settingKey}",
    z.object({
      settingKey: z.string().describe("The key of the user setting"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_put_user_settings_by_settingkey",
    "Sets the given setting of the currently logged in user",
    "Sets the given setting of the currently logged in user. Calls the corresponding Grocy REST API operation.",
    "PUT",
    "/user/settings/{settingKey}",
    z.object({
      settingKey: z.string().describe("The key of the user setting"),
      body: z
        .object({ value: z.string().describe("Grocy value.").optional() })
        .describe("A valid UserSetting object"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_delete_user_settings_by_settingkey",
    "Deletes the given setting of the currently logged in user",
    "Deletes the given setting of the currently logged in user. Calls the corresponding Grocy REST API operation.",
    "DELETE",
    "/user/settings/{settingKey}",
    z.object({
      settingKey: z.string().describe("The key of the user setting"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock",
    "Returns all products which are currently in stock incl. the next due date per product",
    "Returns all products which are currently in stock incl. the next due date per product. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock",
    z.object({}) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_entry_by_entryid",
    "Returns details of the given stock",
    "Returns details of the given stock. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/entry/{entryId}",
    z.object({
      entryId: z.number().int().describe("A valid stock entry id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_put_stock_entry_by_entryid",
    "Edits the stock entry",
    "Edits the stock entry. Calls the corresponding Grocy REST API operation.",
    "PUT",
    "/stock/entry/{entryId}",
    z.object({
      entryId: z.number().int().describe("A valid stock entry id"),
      body: z
        .object({
          amount: z
            .number()
            .describe(
              "The amount to add - please note that when tare weight handling for the product is enabled, this needs to be the amount including the container weight (gross), the amount to be posted will be automatically calculated based on what is in stock and the defined tare weight",
            )
            .optional(),
          best_before_date: z
            .string()
            .describe(
              "The due date of the product to add, when omitted, the current date is used",
            )
            .optional(),
          price: z
            .number()
            .describe(
              "The price per stock quantity unit in configured currency",
            )
            .optional(),
          open: z
            .boolean()
            .describe("If the stock entry was already opened or not")
            .optional(),
          location_id: z
            .number()
            .int()
            .describe("If omitted, the default location of the product is used")
            .optional(),
          shopping_location_id: z
            .number()
            .int()
            .describe("If omitted, no store will be affected")
            .optional(),
          purchased_date: z
            .string()
            .describe("The date when this stock entry was purchased")
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_entry_by_entryid_printlabel",
    "Prints the Grocycode / stock entry label of the given entry on the configured label printer",
    "Prints the Grocycode / stock entry label of the given entry on the configured label printer. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/entry/{entryId}/printlabel",
    z.object({
      entryId: z.number().int().describe("A valid stock entry id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_volatile",
    "Returns all products which are due soon, overdue, expired or currently missing",
    "Returns all products which are due soon, overdue, expired or currently missing. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/volatile",
    z.object({
      due_soon_days: z
        .number()
        .int()
        .describe(
          "The number of days in which products are considered to be due soon",
        )
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_products_by_productid",
    "Returns details of the given product",
    "Returns details of the given product. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/products/{productId}",
    z.object({
      productId: z.number().int().describe("A valid product id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_products_by_productid_locations",
    "Returns all locations where the given product currently has stock",
    "Returns all locations where the given product currently has stock. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/products/{productId}/locations",
    z.object({
      productId: z.number().int().describe("A valid product id"),
      include_sub_products: z
        .boolean()
        .describe(
          "If sub product locations should be included (if the given product is a parent product and in addition to the ones of the given product)",
        )
        .optional(),
      "query[]": z
        .array(z.string())
        .describe(
          "An array of filter conditions, each of them is a string in the form of `<field><condition><value>` where<br>`<field>` is a valid field name<br>`<condition>` is a comparison operator, one of<br>&nbsp;&nbsp;`=` equal<br>&nbsp;&nbsp;`!=` not equal<br>&nbsp;&nbsp;`~` LIKE<br>&nbsp;&nbsp;`!~` not LIKE<br>&nbsp;&nbsp;`<` less<br>&nbsp;&nbsp;`>` greater<br>&nbsp;&nbsp;`<=` less or equal<br>&nbsp;&nbsp;`>=` greater or equal<br>&nbsp;&nbsp;`§` regular expression<br>`<value>` is the value to search for",
        )
        .optional(),
      order: z
        .string()
        .describe(
          "A valid field name by which the response should be ordered, use the separator `:` to specify the sort order (`asc` or `desc`, defaults to `asc` when omitted)",
        )
        .optional(),
      limit: z
        .number()
        .int()
        .describe("The maximum number of objects to return")
        .optional(),
      offset: z
        .number()
        .int()
        .describe("The number of objects to skip")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_products_by_productid_entries",
    "Returns all stock entries of the given product in order of next use (Opened first, then first due first, then first in first out)",
    "Returns all stock entries of the given product in order of next use (Opened first, then first due first, then first in first out). Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/products/{productId}/entries",
    z.object({
      productId: z.number().int().describe("A valid product id"),
      include_sub_products: z
        .boolean()
        .describe(
          "If sub products should be included (if the given product is a parent product and in addition to the ones of the given product)",
        )
        .optional(),
      "query[]": z
        .array(z.string())
        .describe(
          "An array of filter conditions, each of them is a string in the form of `<field><condition><value>` where<br>`<field>` is a valid field name<br>`<condition>` is a comparison operator, one of<br>&nbsp;&nbsp;`=` equal<br>&nbsp;&nbsp;`!=` not equal<br>&nbsp;&nbsp;`~` LIKE<br>&nbsp;&nbsp;`!~` not LIKE<br>&nbsp;&nbsp;`<` less<br>&nbsp;&nbsp;`>` greater<br>&nbsp;&nbsp;`<=` less or equal<br>&nbsp;&nbsp;`>=` greater or equal<br>&nbsp;&nbsp;`§` regular expression<br>`<value>` is the value to search for",
        )
        .optional(),
      order: z
        .string()
        .describe(
          "A valid field name by which the response should be ordered, use the separator `:` to specify the sort order (`asc` or `desc`, defaults to `asc` when omitted)",
        )
        .optional(),
      limit: z
        .number()
        .int()
        .describe("The maximum number of objects to return")
        .optional(),
      offset: z
        .number()
        .int()
        .describe("The number of objects to skip")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_products_by_productid_price_history",
    "Returns the price history of the given product",
    "Returns the price history of the given product. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/products/{productId}/price-history",
    z.object({
      productId: z.number().int().describe("A valid product id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_products_by_productid_add",
    "Adds the given amount of the given product to stock",
    "Adds the given amount of the given product to stock. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/{productId}/add",
    z.object({
      productId: z.number().int().describe("A valid product id"),
      body: z
        .object({
          amount: z
            .number()
            .describe(
              "The amount to add - please note that when tare weight handling for the product is enabled, this needs to be the amount including the container weight (gross), the amount to be posted will be automatically calculated based on what is in stock and the defined tare weight",
            )
            .optional(),
          best_before_date: z
            .string()
            .describe(
              "The due date of the product to add, when omitted, the current date is used",
            )
            .optional(),
          transaction_type: z
            .enum([
              "purchase",
              "consume",
              "inventory-correction",
              "product-opened",
            ])
            .describe("Grocy transaction type.")
            .optional(),
          price: z
            .number()
            .describe(
              "The price per stock quantity unit in configured currency",
            )
            .optional(),
          location_id: z
            .number()
            .int()
            .describe("If omitted, the default location of the product is used")
            .optional(),
          shopping_location_id: z
            .number()
            .int()
            .describe("If omitted, no store will be affected")
            .optional(),
          stock_label_type: z
            .number()
            .int()
            .describe(
              "`1` = No label, `2` = Single label, `3` = Label per unit",
            )
            .optional(),
          note: z
            .string()
            .describe("An optional note for the corresponding stock entry")
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_products_by_productid_consume",
    "Removes the given amount of the given product from stock",
    "Removes the given amount of the given product from stock. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/{productId}/consume",
    z.object({
      productId: z.number().int().describe("A valid product id"),
      body: z
        .object({
          amount: z
            .number()
            .describe(
              "The amount to remove - please note that when tare weight handling for the product is enabled, this needs to be the amount including the container weight (gross), the amount to be posted will be automatically calculated based on what is in stock and the defined tare weight",
            )
            .optional(),
          transaction_type: z
            .enum([
              "purchase",
              "consume",
              "inventory-correction",
              "product-opened",
            ])
            .describe("Grocy transaction type.")
            .optional(),
          spoiled: z
            .boolean()
            .describe(
              "True when the given product was spoiled, defaults to false",
            )
            .optional(),
          stock_entry_id: z
            .string()
            .describe(
              "A specific stock entry id to consume, if used, the amount has to be 1",
            )
            .optional(),
          recipe_id: z
            .number()
            .int()
            .describe(
              "A valid recipe id for which this product was used (for statistical purposes only)",
            )
            .optional(),
          location_id: z
            .number()
            .int()
            .describe(
              "A valid location id (if supplied, only stock at the given location is considered, if ommitted, stock of any location is considered)",
            )
            .optional(),
          exact_amount: z
            .boolean()
            .describe(
              "For tare weight handling enabled products, `true` when the given is the absolute amount to be consumed, not the amount including the container weight",
            )
            .optional(),
          allow_subproduct_substitution: z
            .boolean()
            .describe(
              "`true` when any in stock sub product should be used when the given product is a parent product and currently not in stock",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_products_by_productid_transfer",
    "Transfers the given amount of the given product from one location to another (this is currently not supported for tare weight handling enabled products)",
    "Transfers the given amount of the given product from one location to another (this is currently not supported for tare weight handling enabled products). Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/{productId}/transfer",
    z.object({
      productId: z.number().int().describe("A valid product id"),
      body: z
        .object({
          amount: z
            .number()
            .describe(
              "The amount to transfer - please note that when tare weight handling for the product is enabled, this needs to be the amount including the container weight (gross), the amount to be posted will be automatically calculated based on what is in stock and the defined tare weight",
            )
            .optional(),
          location_id_from: z
            .number()
            .int()
            .describe(
              "A valid location id, the location from where the product should be transfered",
            )
            .optional(),
          location_id_to: z
            .number()
            .int()
            .describe(
              "A valid location id, the location to where the product should be transfered",
            )
            .optional(),
          stock_entry_id: z
            .string()
            .describe(
              "A specific stock entry id to transfer, if used, the amount has to be 1",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_products_by_productid_inventory",
    "Inventories the given product (adds/removes based on the given new amount)",
    "Inventories the given product (adds/removes based on the given new amount). Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/{productId}/inventory",
    z.object({
      productId: z.number().int().describe("A valid product id"),
      body: z
        .object({
          new_amount: z
            .number()
            .describe(
              "The new current amount for the given product - please note that when tare weight handling for the product is enabled, this needs to be the amount including the container weight (gross), the amount to be posted will be automatically calculated based on what is in stock and the defined tare weight",
            )
            .optional(),
          best_before_date: z
            .string()
            .describe("The due date which applies to added products")
            .optional(),
          shopping_location_id: z
            .number()
            .int()
            .describe("If omitted, no store will be affected")
            .optional(),
          location_id: z
            .number()
            .int()
            .describe(
              "If omitted, the default location of the product is used (only applies to added products)",
            )
            .optional(),
          price: z
            .number()
            .describe(
              "If omitted, the last price of the product is used (only applies to added products)",
            )
            .optional(),
          stock_label_type: z
            .number()
            .int()
            .describe(
              "`1` = No label, `2` = Single label, `3` = Label per unit (only applies to added products)",
            )
            .optional(),
          note: z
            .string()
            .describe(
              "An optional note for the corresponding stock entry (only applies to added products)",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_products_by_productid_open",
    "Marks the given amount of the given product as opened",
    "Marks the given amount of the given product as opened. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/{productId}/open",
    z.object({
      productId: z.number().int().describe("A valid product id"),
      body: z
        .object({
          amount: z
            .number()
            .describe("The amount to mark as opened")
            .optional(),
          stock_entry_id: z
            .string()
            .describe(
              "A specific stock entry id to open, if used, the amount has to be 1",
            )
            .optional(),
          allow_subproduct_substitution: z
            .boolean()
            .describe(
              "`true` when any in stock sub product should be used when the given product is a parent product and currently not in stock",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_products_by_productid_printlabel",
    "Prints the Grocycode label of the given product on the configured label printer",
    "Prints the Grocycode label of the given product on the configured label printer. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/products/{productId}/printlabel",
    z.object({
      productId: z.number().int().describe("A valid product id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_products_by_productidtokeep_merge_by_productidtoremove",
    "Merges two products into one",
    "Merges two products into one. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/{productIdToKeep}/merge/{productIdToRemove}",
    z.object({
      productIdToKeep: z
        .number()
        .int()
        .describe("A valid product id of the product to keep"),
      productIdToRemove: z
        .number()
        .int()
        .describe("A valid product id of the product to remove"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_products_by_barcode_by_barcode",
    "Returns details of the given product by its barcode",
    "Returns details of the given product by its barcode. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/products/by-barcode/{barcode}",
    z.object({ barcode: z.string().describe("Barcode") }) as z.ZodType<
      Record<string, unknown>
    >,
  ),
  tool(
    "grocy_post_stock_products_by_barcode_by_barcode_add",
    "Adds the given amount of the by its barcode given product to stock",
    "Adds the given amount of the by its barcode given product to stock. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/by-barcode/{barcode}/add",
    z.object({
      barcode: z.string().describe("Barcode"),
      body: z
        .object({
          amount: z
            .number()
            .describe(
              "The amount to add - please note that when tare weight handling for the product is enabled, this needs to be the amount including the container weight (gross), the amount to be posted will be automatically calculated based on what is in stock and the defined tare weight",
            )
            .optional(),
          best_before_date: z
            .string()
            .describe(
              "The due date of the product to add, when omitted, the current date is used",
            )
            .optional(),
          transaction_type: z
            .enum([
              "purchase",
              "consume",
              "inventory-correction",
              "product-opened",
            ])
            .describe("Grocy transaction type.")
            .optional(),
          price: z
            .number()
            .describe(
              "The price per stock quantity unit in configured currency",
            )
            .optional(),
          location_id: z
            .number()
            .int()
            .describe("If omitted, the default location of the product is used")
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_products_by_barcode_by_barcode_consume",
    "Removes the given amount of the by its barcode given product from stock",
    "Removes the given amount of the by its barcode given product from stock. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/by-barcode/{barcode}/consume",
    z.object({
      barcode: z.string().describe("Barcode"),
      body: z
        .object({
          amount: z
            .number()
            .describe(
              "The amount to remove - please note that when tare weight handling for the product is enabled, this needs to be the amount including the container weight (gross), the amount to be posted will be automatically calculated based on what is in stock and the defined tare weight",
            )
            .optional(),
          transaction_type: z
            .enum([
              "purchase",
              "consume",
              "inventory-correction",
              "product-opened",
            ])
            .describe("Grocy transaction type.")
            .optional(),
          spoiled: z
            .boolean()
            .describe(
              "True when the given product was spoiled, defaults to false",
            )
            .optional(),
          stock_entry_id: z
            .string()
            .describe(
              "A specific stock entry id to consume, if used, the amount has to be 1",
            )
            .optional(),
          recipe_id: z
            .number()
            .int()
            .describe(
              "A valid recipe id for which this product was used (for statistical purposes only)",
            )
            .optional(),
          location_id: z
            .number()
            .int()
            .describe(
              "A valid location id (if supplied, only stock at the given location is considered, if ommitted, stock of any location is considered)",
            )
            .optional(),
          exact_amount: z
            .boolean()
            .describe(
              "For tare weight handling enabled products, `true` when the given is the absolute amount to be consumed, not the amount including the container weight",
            )
            .optional(),
          allow_subproduct_substitution: z
            .boolean()
            .describe(
              "`rue` when any in stock sub product should be used when the given product is a parent product and currently not in stock",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_products_by_barcode_by_barcode_transfer",
    "Transfers the given amount of the by its barcode given product from one location to another (this is currently not supported for tare weight handling enabled products)",
    "Transfers the given amount of the by its barcode given product from one location to another (this is currently not supported for tare weight handling enabled products). Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/by-barcode/{barcode}/transfer",
    z.object({
      barcode: z.string().describe("Barcode"),
      body: z
        .object({
          amount: z
            .number()
            .describe(
              "The amount to transfer - please note that when tare weight handling for the product is enabled, this needs to be the amount including the container weight (gross), the amount to be posted will be automatically calculated based on what is in stock and the defined tare weight",
            )
            .optional(),
          location_id_from: z
            .number()
            .int()
            .describe(
              "A valid location id, the location from where the product should be transfered",
            )
            .optional(),
          location_id_to: z
            .number()
            .int()
            .describe(
              "A valid location id, the location to where the product should be transfered",
            )
            .optional(),
          stock_entry_id: z
            .string()
            .describe(
              "A specific stock entry id to transfer, if used, the amount has to be 1",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_products_by_barcode_by_barcode_inventory",
    "Inventories the by its barcode given product (adds/removes based on the given new amount)",
    "Inventories the by its barcode given product (adds/removes based on the given new amount). Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/by-barcode/{barcode}/inventory",
    z.object({
      barcode: z.string().describe("Barcode"),
      body: z
        .object({
          new_amount: z
            .number()
            .describe(
              "The new current amount for the given product - please note that when tare weight handling for the product is enabled, this needs to be the amount including the container weight (gross), the amount to be posted will be automatically calculated based on what is in stock and the defined tare weight",
            )
            .optional(),
          best_before_date: z
            .string()
            .describe("The due date which applies to added products")
            .optional(),
          location_id: z
            .number()
            .int()
            .describe(
              "If omitted, the default location of the product is used (only applies to added products)",
            )
            .optional(),
          price: z
            .number()
            .describe(
              "If omitted, the last price of the product is used (only applies to added products)",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_products_by_barcode_by_barcode_open",
    "Marks the given amount of the by its barcode given product as opened",
    "Marks the given amount of the by its barcode given product as opened. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/products/by-barcode/{barcode}/open",
    z.object({
      barcode: z.string().describe("Barcode"),
      body: z
        .object({
          amount: z
            .number()
            .describe("The amount to mark as opened")
            .optional(),
          stock_entry_id: z
            .string()
            .describe(
              "A specific stock entry id to open, if used, the amount has to be 1",
            )
            .optional(),
          allow_subproduct_substitution: z
            .boolean()
            .describe(
              "`rue` when any in stock sub product should be used when the given product is a parent product and currently not in stock",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_locations_by_locationid_entries",
    "Returns all stock entries of the given location",
    "Returns all stock entries of the given location. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/locations/{locationId}/entries",
    z.object({
      locationId: z.number().int().describe("A valid location id"),
      "query[]": z
        .array(z.string())
        .describe(
          "An array of filter conditions, each of them is a string in the form of `<field><condition><value>` where<br>`<field>` is a valid field name<br>`<condition>` is a comparison operator, one of<br>&nbsp;&nbsp;`=` equal<br>&nbsp;&nbsp;`!=` not equal<br>&nbsp;&nbsp;`~` LIKE<br>&nbsp;&nbsp;`!~` not LIKE<br>&nbsp;&nbsp;`<` less<br>&nbsp;&nbsp;`>` greater<br>&nbsp;&nbsp;`<=` less or equal<br>&nbsp;&nbsp;`>=` greater or equal<br>&nbsp;&nbsp;`§` regular expression<br>`<value>` is the value to search for",
        )
        .optional(),
      order: z
        .string()
        .describe(
          "A valid field name by which the response should be ordered, use the separator `:` to specify the sort order (`asc` or `desc`, defaults to `asc` when omitted)",
        )
        .optional(),
      limit: z
        .number()
        .int()
        .describe("The maximum number of objects to return")
        .optional(),
      offset: z
        .number()
        .int()
        .describe("The number of objects to skip")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_shoppinglist_add_missing_products",
    "Adds currently missing products (below defined min. stock amount) to the given shopping list",
    "Adds currently missing products (below defined min. stock amount) to the given shopping list. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/shoppinglist/add-missing-products",
    z.object({
      body: z
        .object({
          list_id: z
            .number()
            .int()
            .describe(
              "The shopping list to use, when omitted, the default shopping list (with id 1) is used",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy.")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_shoppinglist_add_overdue_products",
    "Adds overdue products to the given shopping list",
    "Adds overdue products to the given shopping list. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/shoppinglist/add-overdue-products",
    z.object({
      body: z
        .object({
          list_id: z
            .number()
            .int()
            .describe(
              "The shopping list to use, when omitted, the default shopping list (with id 1) is used",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy.")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_shoppinglist_add_expired_products",
    "Adds expired products to the given shopping list",
    "Adds expired products to the given shopping list. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/shoppinglist/add-expired-products",
    z.object({
      body: z
        .object({
          list_id: z
            .number()
            .int()
            .describe(
              "The shopping list to use, when omitted, the default shopping list (with id 1) is used",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy.")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_shoppinglist_clear",
    "Removes all items from the given shopping list",
    "Removes all items from the given shopping list. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/shoppinglist/clear",
    z.object({
      body: z
        .object({
          list_id: z
            .number()
            .int()
            .describe(
              "The shopping list id to clear, when omitted, the default shopping list (with id 1) is used",
            )
            .optional(),
          done_only: z
            .boolean()
            .describe(
              "When `true`, only done items will be removed (defaults to `false` when ommited)",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy.")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_shoppinglist_add_product",
    "Adds the given amount of the given product to the given shopping list",
    "Adds the given amount of the given product to the given shopping list. If the product is already on the shopping list, the given amount will increase the amount of the already existing item, otherwise a new item will be added",
    "POST",
    "/stock/shoppinglist/add-product",
    z.object({
      body: z
        .object({
          product_id: z
            .number()
            .int()
            .describe("A valid product id of the product to be added")
            .optional(),
          qu_id: z
            .number()
            .int()
            .describe(
              "A valid quantity unit id (used only for display; the amount needs to be related to the products stock QU), when omitted, the products stock QU is used",
            )
            .optional(),
          list_id: z
            .number()
            .int()
            .describe(
              "A valid shopping list id, when omitted, the default shopping list (with id 1) is used",
            )
            .optional(),
          product_amount: z
            .number()
            .describe(
              "The amount (related to the products stock QU) to add, when omitted, the default amount of 1 is used",
            )
            .optional(),
          note: z
            .string()
            .describe("The note of the shopping list item")
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_shoppinglist_remove_product",
    "Removes the given amount of the given product from the given shopping list, if it is on it",
    "Removes the given amount of the given product from the given shopping list, if it is on it. If the resulting amount is <= 0, the item will be completely removed from the given list, otherwise the given amount will reduce the amount of the existing item",
    "POST",
    "/stock/shoppinglist/remove-product",
    z.object({
      body: z
        .object({
          product_id: z
            .number()
            .int()
            .describe("A valid product id of the item on the shopping list")
            .optional(),
          list_id: z
            .number()
            .int()
            .describe(
              "A valid shopping list id, when omitted, the default shopping list (with id 1) is used",
            )
            .optional(),
          product_amount: z
            .number()
            .describe(
              "The amount of product units to remove, when omitted, the default amount of 1 is used",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_bookings_by_bookingid",
    "Returns the given stock booking",
    "Returns the given stock booking. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/bookings/{bookingId}",
    z.object({
      bookingId: z.number().int().describe("A valid stock booking id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_bookings_by_bookingid_undo",
    "Undoes a booking",
    "Undoes a booking. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/bookings/{bookingId}/undo",
    z.object({
      bookingId: z.number().int().describe("A valid stock booking id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_transactions_by_transactionid",
    "Returns all stock bookings of the given transaction id",
    "Returns all stock bookings of the given transaction id. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/transactions/{transactionId}",
    z.object({
      transactionId: z.string().describe("A valid stock transaction id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_stock_transactions_by_transactionid_undo",
    "Undoes a transaction",
    "Undoes a transaction. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/stock/transactions/{transactionId}/undo",
    z.object({
      transactionId: z.string().describe("A valid stock transaction id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_stock_barcodes_external_lookup_by_barcode",
    "Executes an external barcode lookoup via the configured plugin with the given barcode",
    "Executes an external barcode lookoup via the configured plugin with the given barcode. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/stock/barcodes/external-lookup/{barcode}",
    z.object({
      barcode: z.string().describe("The barcode to lookup up"),
      add: z
        .boolean()
        .describe(
          "When true, the product is added to the database on a successful lookup and the new product id is in included in the response",
        )
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_recipes_by_recipeid_add_not_fulfilled_products_to_shoppinglist",
    "Adds all missing products for the given recipe to the shopping list",
    "Adds all missing products for the given recipe to the shopping list. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/recipes/{recipeId}/add-not-fulfilled-products-to-shoppinglist",
    z.object({
      recipeId: z.string().describe("A valid recipe id"),
      body: z
        .object({
          excludedProductIds: z
            .array(z.number().int())
            .describe(
              "An optional array of product ids to exclude them from being put on the shopping list",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy.")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_recipes_by_recipeid_fulfillment",
    "Get stock fulfillment information for the given recipe",
    "Get stock fulfillment information for the given recipe. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/recipes/{recipeId}/fulfillment",
    z.object({
      recipeId: z.string().describe("A valid recipe id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_recipes_by_recipeid_consume",
    "Consumes all in stock ingredients of the given recipe (for ingredients that are only partially in stock, the in stock amount will be consumed)",
    "Consumes all in stock ingredients of the given recipe (for ingredients that are only partially in stock, the in stock amount will be consumed). Calls the corresponding Grocy REST API operation.",
    "POST",
    "/recipes/{recipeId}/consume",
    z.object({
      recipeId: z.string().describe("A valid recipe id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_recipes_fulfillment",
    "Get stock fulfillment information for all recipe",
    "Get stock fulfillment information for all recipe. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/recipes/fulfillment",
    z.object({
      "query[]": z
        .array(z.string())
        .describe(
          "An array of filter conditions, each of them is a string in the form of `<field><condition><value>` where<br>`<field>` is a valid field name<br>`<condition>` is a comparison operator, one of<br>&nbsp;&nbsp;`=` equal<br>&nbsp;&nbsp;`!=` not equal<br>&nbsp;&nbsp;`~` LIKE<br>&nbsp;&nbsp;`!~` not LIKE<br>&nbsp;&nbsp;`<` less<br>&nbsp;&nbsp;`>` greater<br>&nbsp;&nbsp;`<=` less or equal<br>&nbsp;&nbsp;`>=` greater or equal<br>&nbsp;&nbsp;`§` regular expression<br>`<value>` is the value to search for",
        )
        .optional(),
      order: z
        .string()
        .describe(
          "A valid field name by which the response should be ordered, use the separator `:` to specify the sort order (`asc` or `desc`, defaults to `asc` when omitted)",
        )
        .optional(),
      limit: z
        .number()
        .int()
        .describe("The maximum number of objects to return")
        .optional(),
      offset: z
        .number()
        .int()
        .describe("The number of objects to skip")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_recipes_by_recipeid_copy",
    "Copies a recipe",
    "Copies a recipe. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/recipes/{recipeId}/copy",
    z.object({
      recipeId: z
        .number()
        .int()
        .describe("A valid recipe id of the recipe to copy"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_recipes_by_recipeid_printlabel",
    "Prints the Grocycode label of the given recipe on the configured label printer",
    "Prints the Grocycode label of the given recipe on the configured label printer. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/recipes/{recipeId}/printlabel",
    z.object({
      recipeId: z.number().int().describe("A valid recipe id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_chores",
    "Returns all chores incl. the next estimated execution time per chore",
    "Returns all chores incl. the next estimated execution time per chore. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/chores",
    z.object({
      "query[]": z
        .array(z.string())
        .describe(
          "An array of filter conditions, each of them is a string in the form of `<field><condition><value>` where<br>`<field>` is a valid field name<br>`<condition>` is a comparison operator, one of<br>&nbsp;&nbsp;`=` equal<br>&nbsp;&nbsp;`!=` not equal<br>&nbsp;&nbsp;`~` LIKE<br>&nbsp;&nbsp;`!~` not LIKE<br>&nbsp;&nbsp;`<` less<br>&nbsp;&nbsp;`>` greater<br>&nbsp;&nbsp;`<=` less or equal<br>&nbsp;&nbsp;`>=` greater or equal<br>&nbsp;&nbsp;`§` regular expression<br>`<value>` is the value to search for",
        )
        .optional(),
      order: z
        .string()
        .describe(
          "A valid field name by which the response should be ordered, use the separator `:` to specify the sort order (`asc` or `desc`, defaults to `asc` when omitted)",
        )
        .optional(),
      limit: z
        .number()
        .int()
        .describe("The maximum number of objects to return")
        .optional(),
      offset: z
        .number()
        .int()
        .describe("The number of objects to skip")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_chores_by_choreid",
    "Returns details of the given chore",
    "Returns details of the given chore. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/chores/{choreId}",
    z.object({
      choreId: z.number().int().describe("A valid chore id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_chores_by_choreid_execute",
    "Tracks an execution of the given chore",
    "Tracks an execution of the given chore. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/chores/{choreId}/execute",
    z.object({
      choreId: z.number().int().describe("A valid chore id"),
      body: z
        .object({
          tracked_time: z.iso
            .datetime()
            .describe(
              "The time of when the chore was executed, when omitted, the current time is used",
            )
            .optional(),
          done_by: z
            .number()
            .int()
            .describe(
              "A valid user id of who executed this chore, when omitted, the currently authenticated user will be used",
            )
            .optional(),
          skipped: z
            .boolean()
            .describe(
              "`true` when the execution should be tracked as skipped, defaults to `false` when omitted",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_chores_executions_by_executionid_undo",
    "Undoes a chore execution",
    "Undoes a chore execution. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/chores/executions/{executionId}/undo",
    z.object({
      executionId: z.number().int().describe("A valid chore execution id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_chores_executions_calculate_next_assignments",
    "(Re)calculates all next user assignments of all chores",
    "(Re)calculates all next user assignments of all chores. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/chores/executions/calculate-next-assignments",
    z.object({
      body: z
        .object({
          chore_id: z
            .number()
            .int()
            .describe(
              "The chore id of the chore which next user assignment should be (re)calculated, when omitted, the next user assignments of all chores will (re)caluclated",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy.")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_chores_by_choreid_printlabel",
    "Prints the Grocycode label of the given chore on the configured label printer",
    "Prints the Grocycode label of the given chore on the configured label printer. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/chores/{choreId}/printlabel",
    z.object({
      choreId: z.number().int().describe("A valid chore id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_chores_by_choreidtokeep_merge_by_choreidtoremove",
    "Merges two chores into one",
    "Merges two chores into one. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/chores/{choreIdToKeep}/merge/{choreIdToRemove}",
    z.object({
      choreIdToKeep: z
        .number()
        .int()
        .describe("A valid chore id of the chore to keep"),
      choreIdToRemove: z
        .number()
        .int()
        .describe("A valid chore id of the chore to remove"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_batteries",
    "Returns all batteries incl. the next estimated charge time per battery",
    "Returns all batteries incl. the next estimated charge time per battery. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/batteries",
    z.object({
      "query[]": z
        .array(z.string())
        .describe(
          "An array of filter conditions, each of them is a string in the form of `<field><condition><value>` where<br>`<field>` is a valid field name<br>`<condition>` is a comparison operator, one of<br>&nbsp;&nbsp;`=` equal<br>&nbsp;&nbsp;`!=` not equal<br>&nbsp;&nbsp;`~` LIKE<br>&nbsp;&nbsp;`!~` not LIKE<br>&nbsp;&nbsp;`<` less<br>&nbsp;&nbsp;`>` greater<br>&nbsp;&nbsp;`<=` less or equal<br>&nbsp;&nbsp;`>=` greater or equal<br>&nbsp;&nbsp;`§` regular expression<br>`<value>` is the value to search for",
        )
        .optional(),
      order: z
        .string()
        .describe(
          "A valid field name by which the response should be ordered, use the separator `:` to specify the sort order (`asc` or `desc`, defaults to `asc` when omitted)",
        )
        .optional(),
      limit: z
        .number()
        .int()
        .describe("The maximum number of objects to return")
        .optional(),
      offset: z
        .number()
        .int()
        .describe("The number of objects to skip")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_batteries_by_batteryid",
    "Returns details of the given battery",
    "Returns details of the given battery. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/batteries/{batteryId}",
    z.object({
      batteryId: z.number().int().describe("A valid battery id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_batteries_by_batteryid_charge",
    "Tracks a charge cycle of the given battery",
    "Tracks a charge cycle of the given battery. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/batteries/{batteryId}/charge",
    z.object({
      batteryId: z.number().int().describe("A valid battery id"),
      body: z
        .object({
          tracked_time: z.iso
            .datetime()
            .describe(
              "The time of when the battery was charged, when omitted, the current time is used",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_batteries_charge_cycles_by_chargecycleid_undo",
    "Undoes a battery charge cycle",
    "Undoes a battery charge cycle. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/batteries/charge-cycles/{chargeCycleId}/undo",
    z.object({
      chargeCycleId: z.number().int().describe("A valid charge cycle id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_batteries_by_batteryid_printlabel",
    "Prints the Grocycode label of the given battery on the configured label printer",
    "Prints the Grocycode label of the given battery on the configured label printer. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/batteries/{batteryId}/printlabel",
    z.object({
      batteryId: z.number().int().describe("A valid battery id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_tasks",
    "Returns all tasks which are not done yet",
    "Returns all tasks which are not done yet. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/tasks",
    z.object({
      "query[]": z
        .array(z.string())
        .describe(
          "An array of filter conditions, each of them is a string in the form of `<field><condition><value>` where<br>`<field>` is a valid field name<br>`<condition>` is a comparison operator, one of<br>&nbsp;&nbsp;`=` equal<br>&nbsp;&nbsp;`!=` not equal<br>&nbsp;&nbsp;`~` LIKE<br>&nbsp;&nbsp;`!~` not LIKE<br>&nbsp;&nbsp;`<` less<br>&nbsp;&nbsp;`>` greater<br>&nbsp;&nbsp;`<=` less or equal<br>&nbsp;&nbsp;`>=` greater or equal<br>&nbsp;&nbsp;`§` regular expression<br>`<value>` is the value to search for",
        )
        .optional(),
      order: z
        .string()
        .describe(
          "A valid field name by which the response should be ordered, use the separator `:` to specify the sort order (`asc` or `desc`, defaults to `asc` when omitted)",
        )
        .optional(),
      limit: z
        .number()
        .int()
        .describe("The maximum number of objects to return")
        .optional(),
      offset: z
        .number()
        .int()
        .describe("The number of objects to skip")
        .optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_tasks_by_taskid_complete",
    "Marks the given task as completed",
    "Marks the given task as completed. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/tasks/{taskId}/complete",
    z.object({
      taskId: z.number().int().describe("A valid task id"),
      body: z
        .object({
          done_time: z.iso
            .datetime()
            .describe(
              "The time of when the task was completed, when omitted, the current time is used",
            )
            .optional(),
        })
        .describe("JSON request body sent unchanged to Grocy."),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_post_tasks_by_taskid_undo",
    "Marks the given task as not completed",
    "Marks the given task as not completed. Calls the corresponding Grocy REST API operation.",
    "POST",
    "/tasks/{taskId}/undo",
    z.object({
      taskId: z.number().int().describe("A valid task id"),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_calendar_ical",
    "Returns the calendar in iCal format",
    "Returns the calendar in iCal format. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/calendar/ical",
    z.object({}) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_calendar_ical_sharing_link",
    "Returns a (public) sharing link for the calendar in iCal format",
    "Returns a (public) sharing link for the calendar in iCal format. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/calendar/ical/sharing-link",
    z.object({}) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_print_shoppinglist_thermal",
    "Prints the shoppinglist with a thermal printer",
    "Prints the shoppinglist with a thermal printer. Calls the corresponding Grocy REST API operation.",
    "GET",
    "/print/shoppinglist/thermal",
    z.object({
      list: z.number().int().describe("Shopping list id").optional(),
      printHeader: z.boolean().describe("Prints Grocy logo if true").optional(),
    }) as z.ZodType<Record<string, unknown>>,
  ),
  tool(
    "grocy_get_openapi_specification",
    "Returns Grocy's generated OpenAPI document",
    "Returns Grocy's generated OpenAPI document. Use this to inspect the live instance API contract.",
    "GET",
    "/openapi/specification",
    z.object({}) as z.ZodType<Record<string, unknown>>,
  ),
];
