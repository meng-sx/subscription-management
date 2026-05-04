import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, TrendingDown, Award, Target, Calendar, Home, CreditCard, Plus, BarChart3, Settings } from 'lucide-react';
import { useSubscriptions } from '../contexts/SubscriptionContext.jsx';

const AnnualReport = () => {
  const { subscriptions } = useSubscriptions();
  const location = useLocation();

  // 计算年度总支出
  const getAnnualTotal = () => {
    return subscriptions.reduce((total, sub) => {
      const monthlyAmount = sub.billingCycle === 'yearly' 
        ? sub.amount 
        : sub.billingCycle === 'quarterly'
        ? sub.amount * 4
        : sub.amount * 12;
      return total + monthlyAmount;
    }, 0);
  };

  // 获取最贵的订阅
  const getMostExpensiveSubscription = () => {
    if (subscriptions.length === 0) return null;
    
    return subscriptions.reduce((mostExpensive, current) => {
      const currentMonthly = current.billingCycle === 'yearly' 
        ? current.amount / 12 
        : current.billingCycle === 'quarterly'
        ? current.amount / 3
        : current.amount;
      
      const mostExpensiveMonthly = mostExpensive.billingCycle === 'yearly' 
        ? mostExpensive.amount / 12 
        : mostExpensive.billingCycle === 'quarterly'
        ? mostExpensive.amount / 3
        : mostExpensive.amount;
      
      return currentMonthly > mostExpensiveMonthly ? current : mostExpensive;
    });
  };

  // 获取支出最高的分类
  const getHighestCategory = () => {
    const categories = {};
    subscriptions.forEach(sub => {
      const monthlyAmount = sub.billingCycle === 'yearly' 
        ? sub.amount / 12 
        : sub.billingCycle === 'quarterly'
        ? sub.amount / 3
        : sub.amount;
      
      if (categories[sub.category]) {
        categories[sub.category] += monthlyAmount;
      } else {
        categories[sub.category] = monthlyAmount;
      }
    });
    
    const sortedCategories = Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
    
    return sortedCategories[0] || null;
  };

  // 计算潜在节省金额（假设取消低频订阅）
  const getPotentialSavings = () => {
    const lowFrequencySubs = subscriptions.filter(sub => {
      const monthlyAmount = sub.billingCycle === 'yearly' 
        ? sub.amount / 12 
        : sub.billingCycle === 'quarterly'
        ? sub.amount / 3
        : sub.amount;
      return monthlyAmount < 20; // 假设月费低于20元的为低频订阅
    });
    
    const monthlySavings = lowFrequencySubs.reduce((total, sub) => {
      const monthlyAmount = sub.billingCycle === 'yearly' 
        ? sub.amount / 12 
        : sub.billingCycle === 'quarterly'
        ? sub.amount / 3
        : sub.amount;
      return total + monthlyAmount;
    }, 0);
    
    return {
      count: lowFrequencySubs.length,
      monthlySavings,
      annualSavings: monthlySavings * 12
    };
  };

  const annualTotal = getAnnualTotal();
  const mostExpensive = getMostExpensiveSubscription();
  const highestCategory = getHighestCategory();
  const potentialSavings = getPotentialSavings();

  // 底部导航项
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/subscriptions', icon: CreditCard, label: '订阅' },
    { path: '/add', icon: Plus, label: '添加' },
    { path: '/statistics', icon: BarChart3, label: '统计' },
    { path: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
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
            <h1 className="text-xl font-semibold">年度省钱报告</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 报告标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">2026年度订阅报告</h2>
          <p className="text-gray-600">您的订阅消费分析</p>
        </div>

        {/* 年度总支出 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">年度总支出</h3>
              <p className="text-sm text-gray-600">全年订阅费用</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            ¥{annualTotal.toFixed(2)}
          </div>
        </div>

        {/* 最贵订阅 */}
        {mostExpensive && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">最贵订阅</h3>
                <p className="text-sm text-gray-600">花费最多的服务</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{mostExpensive.name}</p>
                <p className="text-sm text-gray-600">{mostExpensive.category}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-600">
                  ¥{mostExpensive.amount}
                </p>
                <p className="text-sm text-gray-500">
                  {mostExpensive.billingCycle === 'monthly' ? '月付' : 
                   mostExpensive.billingCycle === 'quarterly' ? '季付' : '年付'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 支出最高分类 */}
        {highestCategory && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">支出最高分类</h3>
                <p className="text-sm text-gray-600">消费最多的类别</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{highestCategory.category}</p>
                <p className="text-sm text-gray-600">月均支出</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  ¥{highestCategory.amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 未来一年预计支出 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">未来一年预计</h3>
              <p className="text-sm text-gray-600">基于当前订阅</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600">
            ¥{annualTotal.toFixed(2)}
          </div>
        </div>

        {/* 省钱建议 */}
        {potentialSavings.count > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">省钱建议</h3>
                <p className="text-sm text-white text-opacity-90">优化订阅支出</p>
              </div>
            </div>
            <p className="text-lg font-medium leading-relaxed">
              如果取消 {potentialSavings.count} 个低频订阅，<br />
              您每年可以节省 <span className="text-2xl font-bold">¥{potentialSavings.annualSavings.toFixed(2)}</span>
            </p>
          </div>
        )}

        {/* 分享按钮 */}
        <div className="text-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            分享报告
          </button>
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

export default AnnualReport;
