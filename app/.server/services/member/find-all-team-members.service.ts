import { initializeDatabase, Organizations, TeamMembers } from "~/.server/db";
import type { FindAllTeamMembersDto } from "~/routes/dto/member";

export async function findAllTeamMembers(dto: FindAllTeamMembersDto): Promise<TeamMembers[]> {
  const { orgId } = dto;

  await initializeDatabase();

  const organization = await Organizations.findOne({
    where: {
      id: orgId,
    },
    relations: {
      teamMembers: true,
    },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  const teamMembers = organization.teamMembers;

  return teamMembers;
}