import { redirect } from "react-router";
import { initializeDatabase, Users } from "~/.server/db";
import { userContext } from "~/context";
import { getSession } from "~/session";

export const authMiddleware = async ({
  request,
  context,
}) => {
  const session = await getSession(
    request.headers.get("Cookie"),
  );
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  await initializeDatabase()
  const user = await Users.findOne({
    where: {
        id: parseInt(userId)
    }
  })
  context.set(userContext, user);
};
