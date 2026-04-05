import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GoogleSignInButton } from '@/components/auth/social-buttons';
import { LoginForm } from '@/components/auth/login-form';
import { APP_NAME } from '@/lib/constants';

export const metadata = { title: `Sign in - ${APP_NAME}` };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{APP_NAME}</CardTitle>
        <CardDescription>
          AI-powered expense tracking for landlords
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <p className="text-sm text-destructive text-center">
            Something went wrong. Please try again.
          </p>
        )}
        {message && (
          <p className="text-sm text-muted-foreground text-center">{message}</p>
        )}

        <GoogleSignInButton />

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <LoginForm />
      </CardContent>
    </Card>
  );
}
