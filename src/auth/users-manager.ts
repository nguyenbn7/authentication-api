import db from "../db";
import { hash } from "bcrypt";
import { normalizeEmail } from "../lib";
import { emailSchema } from "./schemas";

async function makePassword(
  password: string,
  saltOrRounds: string | number = 12
) {
  return hash(password, saltOrRounds);
}

export async function createUser(
  registry: {
    email: string;
    firstName: string;
    lastName: string;
  },
  password: string
) {
  let { email, firstName, lastName } = registry;
  email = normalizeEmail(email);

  password = await makePassword(password);

  return db
    .insertInto("user")
    .values({
      username: email.toLowerCase(),
      email,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      password,
    })
    .returning([
      "id",
      "username",
      "email",
      "password",
      "first_name as firstName",
      "last_name as lastName",
      "created_at as createdAt",
      "updated_at as updatedAt",
      "last_login as lastLogin",
    ])
    .executeTakeFirst();
}

function isEmail(value: string) {
  const result = emailSchema.safeParse({ value });
  return result.success;
}

export async function getUserByUsername(username: string) {
  if (isEmail(username)) {
    username = normalizeEmail(username).toLowerCase();
  } else {
    username = username.normalize("NFKC");
  }

  return db
    .selectFrom("user as u")
    .where("u.username", "=", username)
    .select(["u.id"])
    .executeTakeFirst();
}
