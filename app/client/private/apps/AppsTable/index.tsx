import { Avatar, AvatarImage } from "~/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { AppType } from "~/models/apps/types";

interface ProductTableProps {
  apps: AppType[];
}

const getStatusBadge = (status: string) => {
  const statusColors = {
    PAYMENT_SUCCESS: "bg-green-100 text-green-800",
    PAYMENT_PENDING: "bg-yellow-100 text-yellow-800",
    PAYMENT_FAILURE: "bg-red-100 text-red-800",
    FREE_TRIAL_STARTED: "bg-blue-100 text-blue-800",
    FREE_TRIAL_EXPIRED: "bg-gray-100 text-gray-800",
    NONE: "bg-gray-100 text-gray-800",
  } as const;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

const formatDate = (date: Date | null) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
};

export const AppsTable = ({ apps }: ProductTableProps) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-900">
              Application
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Users</TableHead>
            <TableHead className="font-semibold text-gray-900">
              Next Billing
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => (
            <TableRow key={app.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={app.appLogo} alt={app.appKoreanName} />
                  </Avatar>
                  <div>
                    <div className="font-medium">{app.appKoreanName}</div>
                    <div className="text-sm text-gray-500">
                      {app.appEnglishName}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(app.status)}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>Paid: {app.paidMemberCount.toLocaleString()}</div>
                  <div className="text-gray-500">
                    Used: {app.usedMemberCount.toLocaleString()}
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatDate(app.nextBillingDate)}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(app.nextBillingAmount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
