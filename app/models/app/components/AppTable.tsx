import { Avatar, AvatarImage } from "~/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "~/components/ui/table"
  
  interface AppTableProps {
    apps: {
        appLogo: string;
        appKoreanName: string;
        appEnglishName: string;
        numberOfUsers: number;
        annualSpend: string;
        category: string;
        businessUnit: string;
        licenses: number;
        users: number;
        activeUsers: number;
        contractRenewalDate: string;
    }[];
  }

  export function AppTable({ apps }: AppTableProps) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-900">Application</TableHead>
              <TableHead className="font-semibold text-gray-900">Annual Spend</TableHead>
              <TableHead className="font-semibold text-gray-900">Category</TableHead>
              <TableHead className="font-semibold text-gray-900">Business Unit</TableHead>
              <TableHead className="font-semibold text-gray-900">Licenses</TableHead>
              <TableHead className="font-semibold text-gray-900">Users</TableHead>
              <TableHead className="font-semibold text-gray-900">Active Users</TableHead>
              <TableHead className="font-semibold text-gray-900">Contract Renewal Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.map((app, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={app.appLogo} />
                    </Avatar>
                    <span>{app.appKoreanName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-green-600 font-semibold">{app.annualSpend}</TableCell>
                <TableCell>{app.category}</TableCell>
                <TableCell>{app.businessUnit}</TableCell>
                <TableCell>{app.licenses.toLocaleString()}</TableCell>
                <TableCell>{app.users.toLocaleString()}</TableCell>
                <TableCell>{app.activeUsers}</TableCell>
                <TableCell>{app.contractRenewalDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
  