import { Hono } from "hono";
import { validateSession } from "../auth/middlewares";
import { getFullName } from "../lib";
import { getResources } from "./service";

const app = new Hono().get("/", validateSession, async (c) => {
  const { firstName, lastName } = c.get("user");

  return c.json({
    data: {
      userFullName: getFullName(firstName, lastName),
      resources: await getResources(),
    },
  });
});

export default app;
