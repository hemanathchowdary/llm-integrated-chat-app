import { Link, useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, Upload, Home, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, isAdmin } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/chat", label: "Chat", icon: MessageSquare },
    ...(isAdmin ? [{ path: "/admin", label: "Admin", icon: Upload }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SupportAI
            </span>
          </Link>

          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-accent",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container py-6">{children}</main>
    </div>
  );
};
