import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, PieChart, BarChart, TrendingUp, Home, CreditCard, Plus, Settings, DollarSign, TrendingDown } from 'lucide-react';
import { useSubscriptions } from '../contexts/SubscriptionContext.jsx';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import BudgetProgress from '../components/BudgetProgress.jsx';

const Statistics = () => {
  const { subscriptions, getTotalMonthlyExpense, getBudgetStatus } = useSubscriptions();
  const location = useLocation();
  const budgetStatus = getBudgetStatus();
  
  // 计算分类支出
  const getCategoryExpenses = () => {
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
    return Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  // 计算支付方式分布
  const getPaymentMethodDistribution = () => {
    const methods = {};
    subscriptions.forEach(sub => {
      if (sub.paymentMethod) {
        if (methods[sub.paymentMethod]) {
          methods[sub.paymentMethod] += 1;
        } else {
          methods[sub.paymentMethod] = 1;
        }
      }
    });
    return Object.entries(methods)
      .map(([method, count]) => ({ method, count }))
      .sort((a, b) => b.count - a.count);
  };

  // 计算月度支出趋势（模拟过去6个月数据）
  const getMonthlyTrend = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      // 模拟数据 - 实际应用中应该从历史数据计算
      const monthlyTotal = getTotalMonthlyExpense() * (0.8 + Math.random() * 0.4);
      
      months.push({
        month: format(date, 'MM月', { locale: zhCN }),
        amount: monthlyTotal
      });
    }
    
    return months;
  };

  const categoryExpenses = getCategoryExpenses();
  const paymentMethods = getPaymentMethodDistribution();
  const monthlyTrend = getMonthlyTrend();
  const totalMonthly = getTotalMonthlyExpense();
  const totalYearly = totalMonthly * 12;

  // 底部导航项
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/subscriptions', icon: CreditCard, label: '订阅' },
    { path: '/add', icon: Plus, label: '添加' },
    { path: '/statistics', icon: TrendingUp, label: '统计' },
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
            <h1 className="text-xl font-semibold">统计分析</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 预算进度 */}
        <BudgetProgress budgetStatus={budgetStatus} />

        {/* 支出概览 */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">支出概览</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">月度支出</p>
              <p className="text-2xl font-bold text-blue-600">
                ¥{totalMonthly.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">年度预计</p>
              <p className="text-2xl font-bold text-green-600">
                ¥{totalYearly.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* 分类支出 */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">分类支出</h2>
          </div>
          {categoryExpenses.length > 0 ? (
            <div className="space-y-3">
              {categoryExpenses.map((item, index) => {
                const percentage = (item.amount / totalMonthly * 100).toFixed(1);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-700">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">¥{item.amount.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 ml-2">{percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无分类数据</p>
          )}
        </div>

        {/* 支付方式分布 */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">支付方式</h2>
          </div>
          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">{item.method}</span>
                  </div>
                  <span className="font-semibold">{item.count} 个订阅</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无支付方式数据</p>
          )}
        </div>

        {/* 月度趋势 */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">月度趋势</h2>
          </div>
          <div className="space-y-3">
            {monthlyTrend.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{item.month}</span>
                <span className="font-semibold">¥{item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 年度报告链接 */}
        <Link
          to="/annual-report"
          className="block bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">查看年度报告</h3>
              <p className="text-sm text-white text-opacity-90">了解您的订阅消费详情</p>
            </div>
          </div>
        </Link>
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

export default Statistics;
