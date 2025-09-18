import { AppTable } from "~/models/app/components/AppTable";

const apps = [
    {
      appLogo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      appKoreanName: "옵스나우",
      appEnglishName: "Opsnow",
      category: "Sales",
      licenses: 1000,
      users: 1792,
      activeUsers: 878,
    },
    {
      appLogo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      appKoreanName: "워크데이",
      appEnglishName: "Workday",
      category: "HR",
      licenses: 1400,
      users: 1357,
      activeUsers: 963,
    },
    {
      appLogo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      appKoreanName: "마이크로소프트",
      appEnglishName: "Microsoft Office 365",
      category: "Collaboration & Productivity",
      licenses: 1400,
      users: 1343,
      activeUsers: 805,
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