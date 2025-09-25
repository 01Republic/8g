
import { defaultLogo } from '~/assets/image';
import { LoginSection } from './LoginSection';

interface LoginPageProps {
    orgImage?: string | null ;
    orgName?: string;
}

export default function LoginPage(props: LoginPageProps) {
    const { orgImage, orgName } = props;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center gap-2 font-medium">
          <img 
                src={orgImage || defaultLogo} 
                alt={orgName || 'Organization'}
                className="size-6 object-cover" 
            />
          {orgName||"Organization"}
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <LoginSection />
        </div>
      </div>
    </div>
    <div className="bg-muted relative lg:flex flex items-center justify-center p-8">
        <img
            src={orgImage || defaultLogo} 
            alt="Organization Image"
            className="max-w-2xl max-h-[80vh] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
        />
    </div>
  </div>
  )
}