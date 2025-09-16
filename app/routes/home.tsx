import { SearchCommand } from "~/models/home/components/SearchCommand";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full w-full p-8 pt-64">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            안녕하세요 선진님, 어떤 앱을 쓰고 계신가요?
          </h1>
        </div>
        
        <div className="relative w-full">
          <SearchCommand />
        </div>
      </div>
    </div>
  )
}
