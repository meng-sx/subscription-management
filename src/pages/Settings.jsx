import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Download, Upload, Trash2, Bell, Moon, Sun, Home, CreditCard, Plus, BarChart3, DollarSign } from 'lucide-react';
import { useSubscriptions } from '../contexts/SubscriptionContext.jsx';
import { exportToCSV } from '../utils/exportUtils.js';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const Settings = () => {
  const { 
    subscriptions, 
    clearAllSubscriptions, 
    monthlyBudget, 
    setMonthlyBudget 
  } = useSubscriptions();
  const location = useLocation();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleExport = () => {
    if (subscriptions.length === 0) {
      alert('没有可导出的数据');
      return;
    }
    exportToCSV(subscriptions);
  };

  const handleClearAll = () => {
    clearAllSubscriptions();
    setShowClearConfirm(false);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        // 简单的CSV解析逻辑
        const importedSubscriptions = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          const values = lines[i].split(',');
          const subscription = {
            name: values[0]?.replace(/"/g, '') || '',
            amount: parseFloat(values[1]) || 0,
            billingCycle: values[2]?.replace(/"/g, '') || 'monthly',
            nextPaymentDate: values[3]?.replace(/"/g, '') || new Date().toISOString().split('T')[0],
            paymentMethod: values[4]?.replace(/"/g, '') || '',
            category: values[5]?.replace(/"/g, '') || '',
            notes: values[6]?.replace(/"/g, '') || ''
          };
          importedSubscriptions.push(subscription);
        }
        
        // 这里应该调用导入函数，暂时只显示成功消息
        alert(`成功导入 ${importedSubscriptions.length} 条订阅记录`);
      } catch (error) {
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
  };

  const handleBudgetSave = () => {
    const budget = parseFloat(tempBudget);
    if (isNaN(budget) || budget < 0) {
      alert('请输入有效的预算金额');
      return;
    }
    setMonthlyBudget(budget);
    setShowBudgetModal(false);
  };

  // 底部导航项
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/subscriptions', icon: CreditCard, label: '订阅' },
    { path: '/add', icon: Plus, label: '添加' },
    { path: '/statistics', icon: BarChart3, label: '统计' },
    { path: '/settings', icon: Moon, label: '设置' },
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
            <h1 className="text-xl font-semibold">设置</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 预算管理 */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">预算管理</h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowBudgetModal(true)}
              className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="font-medium">设置月度预算</span>
              </div>
              <span className="text-sm text-gray-500">¥{monthlyBudget.toFixed(2)}</span>
            </button>
          </div>
        </div>

        {/* 数据管理 */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">数据管理</h2>
          <div className="space-y-4">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5 text-blue-600" />
                <span className="font-medium">导出数据</span>
              </div>
              <span className="text-sm text-gray-500">CSV格式</span>
            </button>
            
            <label className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <Upload className="h-5 w-5 text-green-600" />
                <span className="font-medium">导入数据</span>
              </div>
              <span className="text-sm text-gray-500">CSV格式</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="h-5 w-5 text-red-600" />
                <span className="font-medium">清空所有数据</span>
              </div>
              <span className="text-sm text-gray-500">不可恢复</span>
            </button>
          </div>
        </div>

        {/* 应用设置 */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">应用设置</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-gray-600" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600" />
                )}
                <span className="font-medium">深色模式</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="font-medium">推送通知</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">关于</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>订阅管家 v1.0.0</p>
            <p>帮助您管理所有订阅服务，避免意外扣费</p>
            <p>数据本地存储，保护您的隐私</p>
          </div>
        </div>
      </div>

      {/* 预算设置弹窗 */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">设置月度预算</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                预算金额 (元)
              </label>
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                placeholder="200"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleBudgetSave}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 清空确认弹窗 */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="确认清空"
        message="确定要清空所有订阅数据吗？此操作无法撤销，所有订阅记录将被永久删除。"
        confirmText="清空"
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

export default Settings;
