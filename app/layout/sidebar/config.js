import PersonIcon from "@mui/icons-material/Person"
import SettingsIcon from "@mui/icons-material/Settings"
import PeopleIcon from "@mui/icons-material/People"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { getUserType } from "../../../lib/auth"
import HomeIcon from "@mui/icons-material/Home"
import MenuIcon from "@mui/icons-material/Menu"
import DashboardIcon from '@mui/icons-material/Dashboard';

const menuItems = {
  patient: [
    {
      id: "chats",
      label: "Chat",
      icon: HomeIcon,
      route: "/bot/patient",
      isActive: true,
    },
    // {
    //   id: "profile",
    //   label: "My Profile",
    //   icon: PersonIcon,
    //   route: "/profile",
    //   isActive: false,
    // },
    // {
    //   id: "appointments",
    //   label: "My Appointments",
    //   icon: CalendarMonthIcon,
    //   route: "/appointments",
    //   isActive: false,
    // }
  ],
  doctor: [
    {
      id: "chats",
      label: "Chat",
      icon: HomeIcon,
      route: "/bot/staff",
      isActive: true,
    },
    {
      id: "riskBoard",
      label: "Risk Board",
      icon: MenuIcon,
      route: "/riskboard",
      isActive: false,
    },
    // {
    //   id: "patientlist",
    //   label: "Patient List",
    //   icon: CalendarMonthIcon,
    //   route: "/patientlist",
    //   isActive: false,
    // },
    // {
    //   id: "profile",
    //   label: "My Profile",
    //   icon: PersonIcon,
    //   route: "/profile",
    //   isActive: false,
    // }
  ],
  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
      route: "/dashboard",
      isActive: true,
    },
    {
      id: "chats",
      label: "Chat",
      icon: AutoAwesomeOutlinedIcon,
      route: "/bot/admin",
      isActive: false,
    },
    {
      id: "Users",
      label: "Users",
      icon: PersonIcon,
      route: "/users",
      isActive: false,
    },
    // {
    //   id: "appointments",
    //   label: "Appointments",
    //   icon: CalendarMonthIcon,
    //   route: "/appointments",
    //   isActive: false,
    // },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: SettingsIcon,
    //   route: "/settings",
    //   isActive: false,
    // },
    // {
    //   id: "admin",
    //   label: "Admin Panel",
    //   icon: AdminPanelSettingsIcon,
    //   route: "/admin",
    //   isActive: false,
    // }
  ]
}

export const sidebarConfig = () => {
  const userType = getUserType()
  return {
    sections: menuItems[userType?.toLowerCase()] || menuItems.patient, // Default to patient menu if userType is invalid
    styles: {
      iconSize: 24,
      activeColor: "#fff",
      inactiveColor: "#8C92A1",
      activeBackground: "rgba(1, 7, 39, 1)",
      hoverColor: "rgba(1, 7, 39, 0.8)",
    }
  }
} 