import type { Route } from "./+types/members";
import { authMiddleware } from "~/middleware/auth";
import { useFetcher, useLoaderData } from "react-router";
import { userContext } from "~/context";
import { findAllTeamMembers } from "~/.server/services";
import MembersPage, { type TeamMemberAddPayload } from "~/client/private/members/MembersPage";
import { deleteTeamMembers } from "~/.server/services/member/delete-all-team-members.service";
import { createTeamMembers } from "~/.server/services/member/create-team-members.service";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const user = context.get(userContext);
  const organizationId = user!.orgId;

  if(request.method === "DELETE")  {
    const teamMemberIdStr = formData.get("teamMemberId")?.toString();
    const teamMemberIdsStr = formData.get("teamMemberIds")?.toString();
    
    if (teamMemberIdsStr) {
      // 일괄 삭제
      const teamMemberIds = JSON.parse(teamMemberIdsStr).map((id: string) => parseInt(id));
      await deleteTeamMembers(teamMemberIds);
    } else if (teamMemberIdStr) {
      // 단일 삭제
      await deleteTeamMembers([parseInt(teamMemberIdStr)]);
    }
    return null;
  }

  if(request.method === "POST") {
    const payload = {
      name: formData.get("name")!.toString(),
      email: formData.get("email")!.toString(),
      phone: formData.get("phone")!.toString(),
      jobName: formData.get("position")!.toString(),
      organizationId: organizationId,
    };
    await createTeamMembers(payload);
    return null;
  }
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const organizationId = user!.orgId;

  const members = await findAllTeamMembers({
    orgId: organizationId,
  });

  return { members };
}

export default function Members() {
  const { members } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  const onAddMember = (payload: TeamMemberAddPayload) => {
    fetcher.submit(payload, { method: "POST" });
  };

  const onDeleteMember = (teamMemberId: number) => {
    fetcher.submit({ teamMemberId }, { method: "DELETE" });
  };

  const onDeleteAllMembers = (teamMemberIds: number[]) => {
    fetcher.submit({ teamMemberIds: JSON.stringify(teamMemberIds) }, { method: "DELETE" });
  };

  return <MembersPage members={members} addMember={onAddMember} deleteMember={onDeleteMember} deleteAllMembers={onDeleteAllMembers} />;
}
