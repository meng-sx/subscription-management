import { HomeIcon, CreditCard, Plus, Edit, BarChart3, Bell, Settings, BookOpen, TrendingDown } from "lucide-react";
import Index from "./pages/Index.jsx";
import AddSubscription from "./pages/AddSubscription.jsx";
import SubscriptionList from "./pages/SubscriptionList.jsx";
import SubscriptionDetail from "./pages/SubscriptionDetail.jsx";
import EditSubscription from "./pages/EditSubscription.jsx";
import Statistics from "./pages/Statistics.jsx";
import Reminders from "./pages/Reminders.jsx";
import SettingsPage from "./pages/Settings.jsx";
import Welcome from "./pages/Welcome.jsx";
import Tutorial from "./pages/Tutorial.jsx";
import AnnualReport from "./pages/AnnualReport.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "首页",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "订阅列表",
    to: "/subscriptions",
    icon: <CreditCard className="h-4 w-4" />,
    page: <SubscriptionList />,
  },
  {
    title: "添加订阅",
    to: "/add",
    icon: <Plus className="h-4 w-4" />,
    page: <AddSubscription />,
  },
  {
    title: "统计分析",
    to: "/statistics",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Statistics />,
  },
  {
    title: "提醒中心",
    to: "/reminders",
    icon: <Bell className="h-4 w-4" />,
    page: <Reminders />,
  },
  {
    title: "设置",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    page: <SettingsPage />,
  },
  {
    title: "订阅详情",
    to: "/subscription/:id",
    icon: <CreditCard className="h-4 w-4" />,
    page: <SubscriptionDetail />,
  },
  {
    title: "编辑订阅",
    to: "/edit/:id",
    icon: <Edit className="h-4 w-4" />,
    page: <EditSubscription />,
  },
  {
    title: "欢迎页面",
    to: "/welcome",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Welcome />,
  },
  {
    title: "使用教程",
    to: "/tutorial",
    icon: <BookOpen className="h-4 w-4" />,
    page: <Tutorial />,
  },
  {
    title: "年度报告",
    to: "/annual-report",
    icon: <TrendingDown className="h-4 w-4" />,
    page: <AnnualReport />,
  },
];
