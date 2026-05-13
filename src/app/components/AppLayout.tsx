import { LogOut } from "lucide-react";
import { Link, Outlet } from "react-router";
import { Button } from "@/components/ui";

type AppLayoutProps = {
  isAuthenticated: boolean;
  isSigningOut: boolean;
  onSignOut: () => void;
  userName: string;
};

export const AppLayout = ({
  isAuthenticated,
  isSigningOut,
  onSignOut,
  userName,
}: AppLayoutProps) => {
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Header
          isAuthenticated={isAuthenticated}
          isSigningOut={isSigningOut}
          onSignOut={onSignOut}
          userName={userName}
        />
        <Outlet />
      </div>
    </main>
  );
};

const Header = ({
  isAuthenticated,
  isSigningOut,
  onSignOut,
  userName,
}: AppLayoutProps) => (
  <header className="flex min-h-12 items-center justify-between gap-3">
    <Link className="text-lg font-semibold tracking-normal" to="/todos">
      Todo
    </Link>
    {isAuthenticated ? (
      <UserActions
        isSigningOut={isSigningOut}
        onSignOut={onSignOut}
        userName={userName}
      />
    ) : (
      <GuestActions />
    )}
  </header>
);

const GuestActions = () => (
  <nav className="flex items-center gap-2">
    <Button asChild size="sm" variant="ghost">
      <Link to="/signin">로그인</Link>
    </Button>
    <Button asChild size="sm" variant="outline">
      <Link to="/signup">회원가입</Link>
    </Button>
  </nav>
);

type UserActionsProps = Pick<
  AppLayoutProps,
  "isSigningOut" | "onSignOut" | "userName"
>;

const UserActions = ({
  isSigningOut,
  onSignOut,
  userName,
}: UserActionsProps) => (
  <div className="flex min-w-0 items-center gap-2">
    <span className="truncate text-sm text-muted-foreground">{userName}</span>
    <Button
      disabled={isSigningOut}
      onClick={onSignOut}
      size="sm"
      type="button"
      variant="outline"
    >
      <LogOut className="mr-2 h-4 w-4" />
      로그아웃
    </Button>
  </div>
);
