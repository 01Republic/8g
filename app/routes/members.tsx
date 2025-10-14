import type { Route } from "./+types/members";
import { authMiddleware } from "~/middleware/auth";
import { useFetcher, useLoaderData } from "react-router";
import { userContext } from "~/context";
import { findAllTeamMembers } from "~/.server/services";
import MembersPage, {
  type TeamMemberAddPayload,
  type TeamMemberUpdatePayload,
} from "~/client/private/members/MembersPage";
import { deleteTeamMembers } from "~/.server/services/member/delete-all-team-members.service";
import { createTeamMembers } from "~/.server/services/member/create-team-members.service";
import { updateTeamMember } from "~/.server/services/member/update-team-member.service";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const organizationId = user!.orgId;

  const members = await findAllTeamMembers({
    orgId: organizationId,
  });

  return { members };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const user = context.get(userContext);
  const organizationId = user!.orgId;

  if (request.method === "DELETE") {
    const teamMemberIdStr = formData.get("teamMemberId")?.toString();
    const teamMemberIdsStr = formData.get("teamMemberIds")?.toString();

    if (teamMemberIdsStr) {
      // 일괄 삭제
      const teamMemberIds = JSON.parse(teamMemberIdsStr).map((id: string) =>
        parseInt(id)
      );
      await deleteTeamMembers(teamMemberIds);
    } else if (teamMemberIdStr) {
      // 단일 삭제
      await deleteTeamMembers([parseInt(teamMemberIdStr)]);
    }
    return null;
  }

  if (request.method === "POST") {
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

  if (request.method === "PUT") {
    const payload = {
      id: parseInt(formData.get("id")!.toString()),
      name: formData.get("name")!.toString(),
      email: formData.get("email")!.toString(),
      phone: formData.get("phone")!.toString(),
      jobName: formData.get("position")!.toString(),
    };
    await updateTeamMember(payload);
    return null;
  }
}

export default function Members({ loaderData }: Route.ComponentProps) {
  const { members } = loaderData;

  const fetcher = useFetcher();

  const onAddMember = (payload: TeamMemberAddPayload) => {
    fetcher.submit(payload, { method: "POST" });
  };

  const onUpdateMember = (payload: TeamMemberUpdatePayload) => {
    fetcher.submit(payload, { method: "PUT" });
  };

  const onDeleteMember = (teamMemberId: number) => {
    fetcher.submit({ teamMemberId }, { method: "DELETE" });
  };

  const onDeleteAllMembers = (teamMemberIds: number[]) => {
    fetcher.submit(
      { teamMemberIds: JSON.stringify(teamMemberIds) },
      { method: "DELETE" }
    );
  };

  return (
    <MembersPage
      members={members}
      addMember={onAddMember}
      updateMember={onUpdateMember}
      deleteMember={onDeleteMember}
      deleteAllMembers={onDeleteAllMembers}
    />
  );
}
