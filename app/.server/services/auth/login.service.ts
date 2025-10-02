import { compare } from "bcryptjs";
import { initializeDatabase, Organizations, Users } from "~/.server/db";

interface LoginRequest {
  email: string;
  password: string;
  subdomain: string;
}

interface LoginResponse {
  user: Users;
  org: Organizations;
}

export async function login({
  email,
  password,
  subdomain,
}: LoginRequest): Promise<LoginResponse> {
  await initializeDatabase();

  const user = await Users.findOne({
    where: {
      email,
    },
  });

  if (!user || !(await compare(password, user.password))) {
    throw new Error("invalid credentials");
  }

  const org = await Organizations.findOne({
    where: {
      slug: subdomain,
    },
    relations: ["memberships", "memberships.user"],
  });

  if (!org || !org.isAdmin(user)) {
    throw new Error("You do not have access to this organization");
  }

  return { user, org };
}
