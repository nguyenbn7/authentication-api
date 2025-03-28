import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { registerSchema } from "./schemas";
import { createUser, getUserByUsername } from "./users-manager";
import { generateAccessToken, getExpiresAt } from "./service";
import { setCookie } from "hono/cookie";
import { ACCESS_TOKEN } from "./constants";

const app = new Hono().post(
  "/register",
  zValidator("json", registerSchema),
  async (c) => {
    const { email, password, firstName, lastName } = c.req.valid("json");

    const existedUser = await getUserByUsername(email);

    if (existedUser) return c.json({ message: "User existed" }, 400);

    const user = await createUser({ email, firstName, lastName }, password);

    if (!user) return c.json({ message: "Cannot create user" }, 400);

    const expiresAt = getExpiresAt();
    const accessToken = await generateAccessToken(user, expiresAt);

    if (!accessToken)
      return c.json({ message: "Something went wrong. I'm a teapot" }, 418);

    setCookie(c, ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: true,
      expires: expiresAt,
      path: "/",
    });

    return c.json({
      login: true,
    });
  }
);

export default app;
