import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const BudgetProgress = ({ budgetStatus }) => {
  const { totalExpense, monthlyBudget, percentage, remaining, isOverBudget, overAmount } = budgetStatus;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">预算进度</h3>
        {isOverBudget ? (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">超预算</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">正常</span>
          </div>
        )}
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>已使用 ¥{totalExpense.toFixed(2)}</span>
          <span>预算 ¥{monthlyBudget.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {isOverBudget && (
          <div className="mt-2 text-right">
            <span className="text-sm text-red-600 font-medium">
              超出 ¥{overAmount.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* 预算状态 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">剩余预算</p>
          <p className={`text-lg font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            ¥{isOverBudget ? '-' : remaining.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">使用比例</p>
          <p className={`text-lg font-bold ${isOverBudget ? 'text-red-600' : 'text-blue-600'}`}>
            {percentage.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress;
