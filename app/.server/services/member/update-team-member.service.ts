import { initializeDatabase, TeamMembers } from "~/.server/db";

export interface UpdateTeamMemberDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  jobName: string;
}

export async function updateTeamMember(payload: UpdateTeamMemberDto) {
  await initializeDatabase();

  const teamMember = await TeamMembers.findOne({
    where: { id: payload.id },
  });

  if (!teamMember) {
    throw new Error("Team member not found");
  }
}