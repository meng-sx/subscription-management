import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, CreditCard, Home, Plus, BarChart3, Settings } from 'lucide-react';
import { useSubscriptions } from '../contexts/SubscriptionContext.jsx';
import { format, differenceInDays, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const Reminders = () => {
  const { subscriptions } = useSubscriptions();
  const location = useLocation();
  
  // 获取即将扣费的订阅（3天内）
  const getUpcomingPayments = () => {
    const today = new Date();
    return subscriptions
      .filter(sub => {
        const nextPayment = new Date(sub.nextPaymentDate);
        const daysDiff = differenceInDays(nextPayment, today);
        return daysDiff >= 0 && daysDiff <= 3;
      })
      .sort((a, b) => new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate));
  };

  // 获取即将年度续费的订阅（7天内）
  const getUpcomingAnnualRenewals = () => {
    const today = new Date();
    return subscriptions
      .filter(sub => {
        if (sub.billingCycle !== 'yearly') return false;
        const nextPayment = new Date(sub.nextPaymentDate);
        const daysDiff = differenceInDays(nextPayment, today);
        return daysDiff >= 0 && daysDiff <= 7;
      })
      .sort((a, b) => new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate));
  };

  // 获取高额订阅（月均超过50元）
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
      });
  };

  const upcomingPayments = getUpcomingPayments();
  const upcomingAnnualRenewals = getUpcomingAnnualRenewals();
  const expensiveSubscriptions = getExpensiveSubscriptions();

  const getDaysUntilPayment = (date) => {
    const today = new Date();
    const paymentDate = new Date(date);
    return differenceInDays(paymentDate, today);
  };

  const getMonthlyAmount = (subscription) => {
    switch (subscription.billingCycle) {
      case 'yearly':
        return subscription.amount / 12;
      case 'quarterly':
        return subscription.amount / 3;
      default:
        return subscription.amount;
    }
  };

  // 底部导航项
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/subscriptions', icon: CreditCard, label: '订阅' },
    { path: '/add', icon: Plus, label: '添加' },
    { path: '/statistics', icon: BarChart3, label: '统计' },
    { path: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-semibold">提醒中心</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 即将扣费 */}
        {upcomingPayments.length > 0 && (
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold">即将扣费</h2>
            </div>
            <div className="space-y-3">
              {upcomingPayments.map(subscription => {
                const daysLeft = getDaysUntilPayment(subscription.nextPaymentDate);
                return (
                  <Link
                    key={subscription.id}
                    to={`/subscription/${subscription.id}`}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                  >
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
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 年度续费提醒 */}
        {upcomingAnnualRenewals.length > 0 && (
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold">年度续费</h2>
            </div>
            <div className="space-y-3">
              {upcomingAnnualRenewals.map(subscription => {
                const daysLeft = getDaysUntilPayment(subscription.nextPaymentDate);
                return (
                  <Link
                    key={subscription.id}
                    to={`/subscription/${subscription.id}`}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
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
                      <p className="text-xs text-gray-500">年付</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 高额订阅提醒 */}
        {expensiveSubscriptions.length > 0 && (
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold">高额订阅</h2>
            </div>
            <div className="space-y-3">
              {expensiveSubscriptions.map(subscription => {
                const monthlyAmount = getMonthlyAmount(subscription);
                return (
                  <Link
                    key={subscription.id}
                    to={`/subscription/${subscription.id}`}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                  >
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
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {upcomingPayments.length === 0 && upcomingAnnualRenewals.length === 0 && expensiveSubscriptions.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无提醒事项</p>
          </div>
        )}
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

export default Reminders;
