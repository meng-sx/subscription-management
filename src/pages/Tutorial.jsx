import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CreditCard, Plus, BarChart3, Bell, Settings } from 'lucide-react';

const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: '添加订阅',
      description: '点击"添加订阅"按钮，填写订阅名称、金额、扣费周期等信息',
      icon: Plus,
      color: 'bg-blue-500'
    },
    {
      title: '查看统计',
      description: '在统计页面查看分类支出、支付方式分布和月度趋势分析',
      icon: BarChart3,
      color: 'bg-green-500'
    },
    {
      title: '管理提醒',
      description: '在提醒中心查看即将扣费、年度续费和高额订阅提醒',
      icon: Bell,
      color: 'bg-orange-500'
    },
    {
      title: '个性化设置',
      description: '在设置页面配置预算、导出数据、调整应用偏好',
      icon: Settings,
      color: 'bg-purple-500'
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-xl font-semibold">使用教程</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* 进度指示器 */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 教程内容 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="text-center">
            <div className={`w-20 h-20 ${currentTutorial.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <currentTutorial.icon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentTutorial.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {currentTutorial.description}
            </p>
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>上一步</span>
          </button>

          {currentStep === tutorialSteps.length - 1 ? (
            <Link
              to="/"
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <span>开始使用</span>
            </Link>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <span>下一步</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 跳过链接 */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            跳过教程
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
