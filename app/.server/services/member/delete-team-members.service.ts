import { initializeDatabase, TeamMembers } from "~/.server/db";

export async function deleteTeamMembers(teamMemberId: number) {
  await initializeDatabase();

  await TeamMembers.delete(teamMemberId);
}