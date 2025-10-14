import { initializeDatabase, TeamMembers } from "~/.server/db";

export async function deleteTeamMembers(teamMemberIds: number[]) {
  await initializeDatabase();

  await TeamMembers.delete(teamMemberIds);
}