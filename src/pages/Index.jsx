import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, CreditCard, Bell, TrendingUp, Home, BarChart3, Settings, DollarSign } from 'lucide-react';
import { useSubscriptions } from '../contexts/SubscriptionContext.jsx';
import { format, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import BudgetProgress from '../components/BudgetProgress.jsx';
import SubscriptionTags from '../components/SubscriptionTags.jsx';

const Index = () => {
  const { 
    subscriptions, 
    getTotalMonthlyExpense, 
    getUpcomingPayments, 
    getBudgetStatus,
    completeWelcome 
  } = useSubscriptions();
  
  const totalExpense = getTotalMonthlyExpense();
  const upcomingPayments = getUpcomingPayments();
  const budgetStatus = getBudgetStatus();
  const location = useLocation();

  useEffect(() => {
    if (subscriptions.length > 0) {
      completeWelcome();
    }
  }, [subscriptions.length, completeWelcome]);

  const getDaysUntilPayment = (date) => {
    const today = new Date();
    const paymentDate = new Date(date);
    return differenceInDays(paymentDate, today);
  };

  const getExpensiveSubscriptions = () => {
    return subscriptions
      .filter(sub => {
        const monthlyAmount = sub.billingCycle === 'yearly' 
          ? sub.amount / 12 
          : sub.billingCycle === 'quarterly'
          ? sub.amount / 3
          : sub.amount;
        return monthlyAmount > 50;
      })
      .sort((a, b) => {
        const aMonthly = a.billingCycle === 'yearly' ? a.amount / 12 : a.billingCycle === 'quarterly' ? a.amount / 3 : a.amount;
        const bMonthly = b.billingCycle === 'yearly' ? b.amount / 12 : b.billingCycle === 'quarterly' ? b.amount / 3 : b.amount;
        return bMonthly - aMonthly;
      })
      .slice(0, 3);
  };

  const expensiveSubs = getExpensiveSubscriptions();

  // 底部导航项
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/subscriptions', icon: CreditCard, label: '订阅' },
    { path: '/add', icon: Plus, label: '添加' },
    { path: '/statistics', icon: BarChart3, label: '统计' },
    { path: '/settings', icon: Settings, label: '设置' },
  ];

  // 空状态页面
  if (subscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
        {/* 头部 */}
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">订阅管理</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {format(new Date(), 'yyyy年MM月', { locale: zhCN })}
                </p>
              </div>
              <Link
                to="/add"
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
              >
                <Plus className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-12">
          {/* 空状态插画 */}
          <div className="text-center mb-8">
            <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
              <img 
                src="https://photo.bj.ide.test.sankuai.com/?keyword=person,organizing,bills&width=200&height=200" 
                alt="整理账单" 
                className="mx-auto object-cover w-40 h-40 rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              还没有订阅？
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              快来添加第一个订阅吧！<br />
              让我们帮您更好地管理订阅支出
            </p>
          </div>

          {/* 快速操作 */}
          <div className="space-y-4">
            <Link
              to="/add"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>添加第一个订阅</span>
            </Link>

            <Link
              to="/welcome"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-colors"
            >
              <DollarSign className="h-5 w-5" />
              <span>导入示例数据</span>
            </Link>
          </div>

          {/* 功能预览 */}
          <div className="mt-12 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">统一管理</h3>
                  <p className="text-sm text-gray-600">集中管理所有订阅服务</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">智能提醒</h3>
                  <p className="text-sm text-gray-600">及时提醒即将扣费项目</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">支出分析</h3>
                  <p className="text-sm text-gray-600">识别浪费性支出，优化消费</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="max-w-md mx-auto px-4">
            <div className="flex justify-around py-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 正常首页内容
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">订阅管理</h1>
              <p className="text-sm text-gray-600 mt-1">
                {format(new Date(), 'yyyy年MM月', { locale: zhCN })}
              </p>
            </div>
            <Link
              to="/add"
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
            >
              <Plus className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 预算进度 */}
        <BudgetProgress budgetStatus={budgetStatus} />

        {/* 月度支出概览 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">本月支出</h2>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ¥{totalExpense.toFixed(2)}
          </div>
          <p className="text-sm text-gray-600">
            共 {subscriptions.length} 个订阅服务
          </p>
        </div>

        {/* 即将扣费 */}
        {upcomingPayments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">即将扣费</h2>
              <Bell className="h-5 w-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              {upcomingPayments.map(subscription => {
                const daysLeft = getDaysUntilPayment(subscription.nextPaymentDate);
                return (
                  <Link
                    key={subscription.id}
                    to={`/subscription/${subscription.id}`}
                    className="block p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{subscription.name}</p>
                          <p className="text-sm text-gray-600">
                            {daysLeft === 0 ? '今天' : `${daysLeft}天后`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">¥{subscription.amount}</p>
                        <p className="text-xs text-gray-500">{subscription.category}</p>
                      </div>
                    </div>
                    <SubscriptionTags subscription={subscription} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 高额订阅提醒 */}
        {expensiveSubs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">高额订阅</h2>
            <div className="space-y-3">
              {expensiveSubs.map(subscription => {
                const monthlyAmount = subscription.billingCycle === 'yearly' 
                  ? subscription.amount / 12 
                  : subscription.billingCycle === 'quarterly'
                  ? subscription.amount / 3
                  : subscription.amount;
                return (
                  <Link
                    key={subscription.id}
                    to={`/subscription/${subscription.id}`}
                    className="block p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{subscription.name}</p>
                          <p className="text-sm text-gray-600">{subscription.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">¥{monthlyAmount.toFixed(2)}/月</p>
                        <p className="text-xs text-gray-500">建议检查</p>
                      </div>
                    </div>
                    <SubscriptionTags subscription={subscription} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 快速操作 */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/add"
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl text-center transition-colors"
          >
            <Plus className="h-6 w-6 mx-auto mb-2" />
            <p className="font-medium">添加订阅</p>
          </Link>
          <Link
            to="/subscriptions"
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 p-4 rounded-xl text-center transition-colors"
          >
            <CreditCard className="h-6 w-6 mx-auto mb-2" />
            <p className="font-medium">查看所有</p>
          </Link>
        </div>
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
