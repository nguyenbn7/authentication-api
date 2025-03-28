import { Kyselify } from "drizzle-orm/kysely";
import { resouceTable, userTable } from "./schemas";

interface Database {
  user: Kyselify<typeof userTable>;
  resouce: Kyselify<typeof resouceTable>;
}
