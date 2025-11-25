import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You don't have the access to view this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              This page is restricted to administrators only. If you believe this is an error, please contact your system administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

