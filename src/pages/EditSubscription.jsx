import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Home, CreditCard, Plus, BarChart3, Settings } from 'lucide-react';
import { useSubscriptions } from '../contexts/SubscriptionContext.jsx';

const EditSubscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptions, updateSubscription } = useSubscriptions();
  
  const subscription = subscriptions.find(sub => sub.id === id);
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly',
    nextPaymentDate: '',
    paymentMethod: '',
    category: '',
    notes: ''
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        amount: subscription.amount.toString(),
        billingCycle: subscription.billingCycle,
        nextPaymentDate: subscription.nextPaymentDate,
        paymentMethod: subscription.paymentMethod || '',
        category: subscription.category || '',
        notes: subscription.notes || ''
      });
    }
  }, [subscription]);

  const categories = [
    '娱乐', '工具', '健康', '存储', '教育', '购物', '交通', '其他'
  ];

  const paymentMethods = [
    '支付宝', '微信支付', '银行卡', '信用卡', 'Apple Pay', 'Google Pay', '其他'
  ];

  const billingCycles = [
    { value: 'monthly', label: '月付' },
    { value: 'quarterly', label: '季付' },
    { value: 'yearly', label: '年付' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.nextPaymentDate) {
      alert('请填写必要信息');
      return;
    }

    updateSubscription(id, {
      ...formData,
      amount: parseFloat(formData.amount)
    });

    navigate(`/subscription/${id}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <p className="text-gray-500 mb-4">订阅不存在</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-600"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

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
            <button
              onClick={() => navigate(`/subscription/${id}`)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">编辑订阅</h1>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>保存</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 订阅名称 */}
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              订阅名称 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例如：Netflix、Spotify"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 金额和周期 */}
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              金额 *
            </label>
            <div className="flex space-x-3">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {billingCycles.map(cycle => (
                  <option key={cycle.value} value={cycle.value}>
                    {cycle.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 下次扣费日期 */}
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              下次扣费日期 *
            </label>
            <input
              type="date"
              name="nextPaymentDate"
              value={formData.nextPaymentDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 支付方式 */}
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              支付方式
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">选择支付方式</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* 分类 */}
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">选择分类</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 备注 */}
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              备注
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="添加备注信息..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </form>
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

export default EditSubscription;
