import db from "../db";

export async function getResources() {
  return db.selectFrom("resouce").selectAll().execute();
}
