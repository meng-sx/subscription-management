import React from 'react';
import { differenceInDays, addDays } from 'date-fns';

const SubscriptionTags = ({ subscription, monthlyThreshold = 50 }) => {
  const tags = [];
  
  // 计算月均金额
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

  // 获取距离下次扣费的天数
  const getDaysUntilPayment = () => {
    const today = new Date();
    const paymentDate = new Date(subscription.nextPaymentDate);
    return differenceInDays(paymentDate, today);
  };

  const monthlyAmount = getMonthlyAmount();
  const daysUntilPayment = getDaysUntilPayment();

  // 高额订阅标签
  if (monthlyAmount > monthlyThreshold) {
    tags.push({
      text: '高额订阅',
      color: 'bg-red-100 text-red-800 border-red-200'
    });
  }

  // 即将扣费标签
  if (daysUntilPayment >= 0 && daysUntilPayment <= 3) {
    tags.push({
      text: daysUntilPayment === 0 ? '今日扣费' : `${daysUntilPayment}天后扣费`,
      color: 'bg-orange-100 text-orange-800 border-orange-200'
    });
  }

  // 年度续费标签
  if (subscription.billingCycle === 'yearly' && daysUntilPayment >= 0 && daysUntilPayment <= 7) {
    tags.push({
      text: '年度续费',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    });
  }

  // 已暂停标签
  if (subscription.status === 'paused') {
    tags.push({
      text: '已暂停',
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    });
  }

  // 已取消标签
  if (subscription.status === 'cancelled') {
    tags.push({
      text: '已取消',
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    });
  }

  // 试用即将结束标签（假设有trialEndDate字段）
  if (subscription.trialEndDate) {
    const daysUntilTrialEnd = differenceInDays(new Date(subscription.trialEndDate), new Date());
    if (daysUntilTrialEnd >= 0 && daysUntilTrialEnd <= 3) {
      tags.push({
        text: '试用即将结束',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      });
    }
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`px-2 py-1 text-xs font-medium rounded-full border ${tag.color}`}
        >
          {tag.text}
        </span>
      ))}
    </div>
  );
};

export default SubscriptionTags;
