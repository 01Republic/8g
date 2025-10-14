import { initializeDatabase, Organizations, TeamMembers } from "~/.server/db";
import type { FindAllTeamMembersDto, TeamMemberResponseDto } from "~/routes/dto/member";

export async function findAllTeamMembers(
  dto: FindAllTeamMembersDto,
): Promise<TeamMemberResponseDto[]> {
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

  return teamMembers.map((teamMember) => ({
    id: teamMember.id,
    name: teamMember.name,
    email: teamMember.email || "",
    phone: teamMember.phone || "",
    jobName: teamMember.jobName || "",
    profileImgUrl: teamMember.profileImgUrl,
    subscriptionCount: teamMember.subscriptionCount,
    createdAt: teamMember.createdAt,
  }));
}
