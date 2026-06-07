import LoginForm from "./LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-2xl border border-nam-border bg-nam-card p-8">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Sign in with your admin password to manage influencer campaigns.
        </p>
        <div className="mt-6">
          <LoginForm nextPath={next} />
        </div>
      </div>
    </div>
  );
}
