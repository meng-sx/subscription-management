import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, BookOpen, CreditCard, Bell, TrendingUp, Trash2 } from 'lucide-react';
import { useSubscriptions } from '../contexts/SubscriptionContext.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const Welcome = () => {
  const { addSubscription, clearAllSubscriptions } = useSubscriptions();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadSampleData = () => {
    const sampleSubscriptions = [
      {
        name: 'ChatGPT Plus',
        amount: 20,
        billingCycle: 'monthly',
        nextPaymentDate: '2026-05-10',
        paymentMethod: '信用卡',
        category: '工具',
        notes: 'AI助手订阅'
      },
      {
        name: 'Netflix',
        amount: 68,
        billingCycle: 'monthly',
        nextPaymentDate: '2026-05-08',
        paymentMethod: '支付宝',
        category: '娱乐',
        notes: '视频流媒体'
      },
      {
        name: 'Spotify',
        amount: 15,
        billingCycle: 'monthly',
        nextPaymentDate: '2026-05-12',
        paymentMethod: '微信支付',
        category: '娱乐',
        notes: '音乐流媒体'
      },
      {
        name: 'iCloud',
        amount: 21,
        billingCycle: 'monthly',
        nextPaymentDate: '2026-05-15',
        paymentMethod: 'Apple Pay',
        category: '存储',
        notes: '云存储服务'
      },
      {
        name: '健身房会员',
        amount: 299,
        billingCycle: 'monthly',
        nextPaymentDate: '2026-05-20',
        paymentMethod: '银行卡',
        category: '健康',
        notes: '月度健身卡'
      }
    ];

    sampleSubscriptions.forEach(sub => {
      addSubscription(sub);
    });
  };

  const handleClearSampleData = () => {
    clearAllSubscriptions();
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-md mx-auto px-4 py-12">
        {/* 头部Logo和标题 */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">订阅管家</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            智能管理您的订阅服务，<br />
            告别意外扣费，掌控每一分支出
          </p>
        </div>

        {/* 核心功能介绍 */}
        <div className="space-y-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">统一管理</h3>
                <p className="text-sm text-gray-600">集中管理所有订阅服务</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">智能提醒</h3>
                <p className="text-sm text-gray-600">及时提醒即将扣费项目</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">支出分析</h3>
                <p className="text-sm text-gray-600">识别浪费性支出，优化消费</p>
              </div>
            </div>
          </div>
        </div>

        {/* 快速操作按钮 */}
        <div className="space-y-4">
          <Link
            to="/add"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>添加第一个订阅</span>
          </Link>

          <button
            onClick={loadSampleData}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>导入示例数据</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            <span>清空示例数据</span>
          </button>

          <Link
            to="/tutorial"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-colors"
          >
            <BookOpen className="h-5 w-5" />
            <span>查看使用教程</span>
          </Link>
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            数据本地存储，保护您的隐私安全
          </p>
        </div>
      </div>

      {/* 清空确认弹窗 */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearSampleData}
        title="确认清空"
        message="确定要清空所有示例数据吗？此操作无法撤销，所有订阅记录将被永久删除。"
        confirmText="清空"
        type="danger"
      />
    </div>
  );
};

export default Welcome;
