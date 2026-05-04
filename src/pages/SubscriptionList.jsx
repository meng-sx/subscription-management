import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Filter, CreditCard, Download, Home, Plus, BarChart3, Settings } from 'lucide-react';
import { useSubscriptions } from '../contexts/SubscriptionContext.jsx';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { exportToCSV } from '../utils/exportUtils.js';
import SubscriptionTags from '../components/SubscriptionTags.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const SubscriptionList = () => {
  const { subscriptions } = useSubscriptions();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);

  const categories = ['全部', '娱乐', '工具', '健康', '存储', '教育', '购物', '交通', '其他'];

  const filteredSubscriptions = subscriptions
    .filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || selectedCategory === '全部' || sub.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'amount':
          return b.amount - a.amount;
        case 'nextPayment':
          return new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate);
        default:
          return 0;
      }
    });

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

  const getBillingCycleText = (cycle) => {
    switch (cycle) {
      case 'monthly':
        return '月付';
      case 'quarterly':
        return '季付';
      case 'yearly':
        return '年付';
      default:
        return cycle;
    }
  };

  const handleExport = () => {
    if (filteredSubscriptions.length === 0) {
      alert('没有可导出的数据');
      return;
    }
    exportToCSV(filteredSubscriptions);
  };

  const handleDeleteClick = (subscription) => {
    setSubscriptionToDelete(subscription);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    // 这里应该调用删除函数
    console.log('删除订阅:', subscriptionToDelete);
    setShowDeleteConfirm(false);
    setSubscriptionToDelete(null);
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
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-semibold">所有订阅</h1>
            <button
              onClick={handleExport}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="导出CSV"
            >
              <Download className="h-6 w-6 text-blue-600" />
            </button>
          </div>

          {/* 搜索栏 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订阅..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 筛选器 */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === '全部' ? '' : category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  (selectedCategory === category) || (selectedCategory === '' && category === '全部')
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 排序 */}
          <div className="flex items-center space-x-2 mt-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">按名称排序</option>
              <option value="amount">按金额排序</option>
              <option value="nextPayment">按扣费日期排序</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {filteredSubscriptions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无订阅记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubscriptions.map(subscription => (
              <div
                key={subscription.id}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{subscription.name}</h3>
                      <p className="text-sm text-gray-600">{subscription.category}</p>
                      <p className="text-xs text-gray-500">
                        下次扣费：{format(new Date(subscription.nextPaymentDate), 'MM月dd日', { locale: zhCN })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ¥{getMonthlyAmount(subscription).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getBillingCycleText(subscription.billingCycle)}
                    </p>
                  </div>
                </div>
                
                {/* 智能标签 */}
                <SubscriptionTags subscription={subscription} />
                
                {/* 操作按钮 */}
                <div className="flex justify-end space-x-2 mt-3">
                  <Link
                    to={`/subscription/${subscription.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    查看详情
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(subscription)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="确认删除"
        message={`确定要删除订阅 "${subscriptionToDelete?.name}" 吗？此操作无法撤销。`}
        confirmText="删除"
        type="danger"
      />

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

export default SubscriptionList;
