import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, CreditCard, Tag, FileText, Home, Plus, BarChart3, Settings } from 'lucide-react';
import { useSubscriptions } from '../contexts/SubscriptionContext.jsx';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import SubscriptionTags from '../components/SubscriptionTags.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const SubscriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptions, deleteSubscription } = useSubscriptions();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const subscription = subscriptions.find(sub => sub.id === id);

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <p className="text-gray-500 mb-4">订阅不存在</p>
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteSubscription(id);
    navigate('/');
  };

  const getMonthlyAmount = () => {
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

  const getNextPaymentInfo = () => {
    const today = new Date();
    const nextPayment = new Date(subscription.nextPaymentDate);
    const daysDiff = Math.ceil((nextPayment - today) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return { text: '已过期', color: 'text-red-600', bgColor: 'bg-red-50' };
    } else if (daysDiff === 0) {
      return { text: '今天', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    } else if (daysDiff <= 3) {
      return { text: `${daysDiff}天后`, color: 'text-orange-600', bgColor: 'bg-orange-50' };
    } else {
      return { text: `${daysDiff}天后`, color: 'text-green-600', bgColor: 'bg-green-50' };
    }
  };

  const paymentInfo = getNextPaymentInfo();

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
              to="/subscriptions"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-semibold">订阅详情</h1>
            <div className="flex space-x-2">
              <Link
                to={`/edit/${id}`}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit className="h-5 w-5 text-blue-600" />
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{subscription.name}</h2>
              <p className="text-gray-600">{subscription.category}</p>
            </div>
          </div>

          {/* 智能标签 */}
          <SubscriptionTags subscription={subscription} />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">月均费用</p>
              <p className="text-xl font-bold text-gray-900">
                ¥{getMonthlyAmount().toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">计费周期</p>
              <p className="text-xl font-bold text-gray-900">
                {getBillingCycleText(subscription.billingCycle)}
              </p>
            </div>
          </div>
        </div>

        {/* 扣费信息 */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">扣费信息</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">下次扣费</span>
              <div className="text-right">
                <p className="font-semibold">
                  {format(new Date(subscription.nextPaymentDate), 'yyyy年MM月dd日', { locale: zhCN })}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${paymentInfo.color} ${paymentInfo.bgColor}`}>
                  {paymentInfo.text}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">单次金额</span>
              <span className="font-semibold">¥{subscription.amount.toFixed(2)}</span>
            </div>
            
            {subscription.paymentMethod && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">支付方式</span>
                <span className="font-semibold">{subscription.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>

        {/* 备注 */}
        {subscription.notes && (
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">备注</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{subscription.notes}</p>
          </div>
        )}

        {/* 删除确认弹窗 */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="确认删除"
          message={`确定要删除订阅 "${subscription.name}" 吗？此操作无法撤销，订阅记录将被永久删除。`}
          confirmText="删除"
          type="danger"
        />
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

export default SubscriptionDetail;
