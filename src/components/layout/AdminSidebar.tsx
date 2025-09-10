// import { NavLink, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   UserCheck,
//   Users,
//   Calendar,
//   UserCog,
//   DollarSign,
//   Bell,
//   CalendarDays,
// } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";

// const menuItems = [
//   { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
//   { title: "Doctors", url: "/doctors", icon: UserCheck },
//   { title: "Patients", url: "/patients", icon: Users },
//   { title: "Appointments", url: "/appointments", icon: Calendar },
//   { title: "Admins", url: "/admins", icon: UserCog },
//   { title: "Expense Management", url: "/expense-management", icon: DollarSign },
//   { title: "Contacts", url: "/contacts", icon: Users },
//   { title: "Notifications", url: "/notifications", icon: Bell },
//   { title: "Calendar", url: "/calendar", icon: CalendarDays },
// ];

// export function AdminSidebar() {
//   const location = useLocation();

//   const isActive = (path: string) => location.pathname === path;
//   const getNavCls = ({ isActive }: { isActive: boolean }) =>
//     isActive 
//       ? "bg-gradient-primary text-primary-foreground font-medium shadow-card" 
//       : "hover:bg-accent hover:text-accent-foreground transition-all duration-200";

//   return (
//     <Sidebar className="w-64 transition-all duration-300"
//     >
//       <SidebarContent className="bg-card border-r shadow-card">
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground px-4 py-2">
//             Navigation
//           </SidebarGroupLabel>
          
//           <SidebarGroupContent>
//             <SidebarMenu className="space-y-1 px-2">
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <NavLink 
//                       to={item.url} 
//                       className={({ isActive }) => 
//                         `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavCls({ isActive })}`
//                       }
//                     >
//                       <item.icon className="h-5 w-5 flex-shrink-0" />
//                       <span className="truncate">{item.title}</span>
//                     </NavLink>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }

import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Calendar,
  UserCog,
  DollarSign,
  Bell,
  CalendarDays,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Doctors", url: "/doctors", icon: UserCheck },
  { title: "Patients", url: "/patients", icon: Users },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Admins", url: "/admins", icon: UserCog },
  { title: "Expense Management", url: "/expense-management", icon: DollarSign },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Calendar", url: "/calendar", icon: CalendarDays },
];

export function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  const getNavCls = (isActive: boolean) =>
    isActive
      ? "bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-700"
      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300";

  return (
    <Sidebar className="w-60 bg-white shadow-lg transition-all duration-300">
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase px-6 py-3">
            Menu
          </SidebarGroupLabel>
          <div>
            <SidebarMenu className="space-y-1 px-3">
              {menuItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-4 px-4 py-3 rounded-r-lg ${getNavCls(active)}`}
                      >
                        <item.icon 
                          className={`h-5 w-5 flex-shrink-0 transition-colors duration-300 ${active ? "text-blue-700" : "text-gray-500"}`} 
                        />
                        <span className="text-sm truncate">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}