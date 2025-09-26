import { initializeDatabase, Organizations } from "../db";

interface GetOrganizationRequest {
  subdomain: string;
}

interface GetOrganizationResponse {
  org: Organizations | null;
}

export async function getOrganization({
  subdomain,
}: GetOrganizationRequest): Promise<GetOrganizationResponse> {
  await initializeDatabase();
  const org = await Organizations.findOne({
    where: {
      slug: subdomain,
    },
    relations: ["memberships", "memberships.user"],
  });

  return { org };
}
