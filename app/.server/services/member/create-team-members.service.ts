import { initializeDatabase, TeamMembers, Organizations } from "~/.server/db";

export interface CreateTeamMembersDto {
  name: string;
  email: string;
  phone: string;
  jobName: string;
  organizationId: number;
}

export async function createTeamMembers(payload: CreateTeamMembersDto) {
  await initializeDatabase();

  const organization = await Organizations.findOne({
    where: { id: payload.organizationId },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  const teamMember = TeamMembers.create({
    name: payload.name,
    email: payload.email || null,
    phone: payload.phone || null,
    jobName: payload.jobName || null,
    organization: organization,
    subscriptionCount: 0,
  });

  await TeamMembers.save(teamMember);
}
