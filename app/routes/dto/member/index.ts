export interface FindAllTeamMembersDto {
  orgId: number;
}

export interface TeamMemberResponseDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  jobName: string;
  profileImgUrl: string | null;
  subscriptionCount: number;
  createdAt: Date;
}
