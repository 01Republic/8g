import type { AppType } from '~/models/apps/types';
import { AppsTable } from '~/client/private/apps/AppsTable';

interface AppsPageProps {
    apps: AppType[];
}

export default function AppsPage(props: AppsPageProps) {
    const { apps } = props;
  return (
    <div className="h-full w-full p-8">
    <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Apps</h1>
        <AppsTable apps={apps} />
    </div>
</div>
  )
}