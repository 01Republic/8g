import { AppTable } from "~/models/app/components/AppTable";

const apps = [
    {
      appLogo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      appKoreanName: "옵스나우",
      appEnglishName: "Opsnow",
      numberOfUsers: 100,
      annualSpend: "$93,000",
      category: "Sales",
      businessUnit: "Sales",
      licenses: 1000,
      users: 1792,
      activeUsers: 878,
      contractRenewalDate: "2/9/2019"
    },
    {
      appLogo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      appKoreanName: "워크데이",
      appEnglishName: "Workday",
      numberOfUsers: 200,
      annualSpend: "$217,950",
      category: "HR",
      businessUnit: "HR",
      licenses: 1400,
      users: 1357,
      activeUsers: 963,
      contractRenewalDate: "4/11/2019"
    },
    {
      appLogo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      appKoreanName: "마이크로소프트",
      appEnglishName: "Microsoft Office 365",
      numberOfUsers: 150,
      annualSpend: "$185,980",
      category: "Collaboration & Productivity",
      businessUnit: "IT",
      licenses: 1400,
      users: 1343,
      activeUsers: 805,
      contractRenewalDate: "2/14/2019"
    }
  ]

export default function Apps() {
    return (
        <div className="h-full w-full p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Apps</h1>
                <AppTable apps={apps} />
            </div>
        </div>
    )
}