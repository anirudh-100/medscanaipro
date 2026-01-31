import { forwardRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Scan,
  History,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const AppSidebar = forwardRef<HTMLDivElement, AppSidebarProps>(
  ({ isCollapsed, onToggle }, ref) => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
      { icon: Home, label: "Dashboard", path: "/" },
      { icon: History, label: "Scan History", path: "/history" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ];

    const handleSignOut = async () => {
      await signOut();
      navigate("/auth");
    };

    return (
      <motion.aside
        ref={ref}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0"
      >
        {/* Header */}
        <div className="h-16 flex items-center px-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg medical-gradient">
              <Stethoscope className="h-4 w-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="font-semibold text-sm text-sidebar-foreground truncate">
                  MedScan AI
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={`w-full justify-start gap-3 h-10 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                } ${isCollapsed ? "px-2" : "px-3"}`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-2 border-t border-sidebar-border space-y-1">
          {user && (
            <div
              className={`flex items-center gap-2 p-2 rounded-lg bg-sidebar-accent/30 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-sidebar-foreground truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={`w-full justify-start gap-3 h-10 text-destructive hover:bg-destructive/10 hover:text-destructive ${
              isCollapsed ? "px-2" : "px-3"
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </Button>
        </div>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={onToggle}
            className="w-full h-8 text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </motion.aside>
    );
  }
);

AppSidebar.displayName = "AppSidebar";
