import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SubscriptionContext = createContext();

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(200);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  // 从本地存储加载数据
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('subscriptions');
    const savedBudget = localStorage.getItem('monthlyBudget');
    const savedWelcomeStatus = localStorage.getItem('hasSeenWelcome');
    
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }
    if (savedBudget) {
      setMonthlyBudget(parseFloat(savedBudget));
    }
    if (savedWelcomeStatus) {
      setHasSeenWelcome(JSON.parse(savedWelcomeStatus));
    }
  }, []);

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem('hasSeenWelcome', JSON.stringify(hasSeenWelcome));
  }, [hasSeenWelcome]);

  const addSubscription = (subscription) => {
    const newSubscription = {
      ...subscription,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setSubscriptions(prev => [...prev, newSubscription]);
  };

  const updateSubscription = (id, updatedSubscription) => {
    setSubscriptions(prev =>
      prev.map(sub => sub.id === id ? { ...sub, ...updatedSubscription } : sub)
    );
  };

  const deleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const clearAllSubscriptions = () => {
    setSubscriptions([]);
    localStorage.removeItem('subscriptions');
  };

  const getTotalMonthlyExpense = () => {
    return subscriptions.reduce((total, sub) => {
      const monthlyAmount = sub.billingCycle === 'yearly' 
        ? sub.amount / 12 
        : sub.billingCycle === 'quarterly'
        ? sub.amount / 3
        : sub.amount;
      return total + monthlyAmount;
    }, 0);
  };

  const getUpcomingPayments = () => {
    const today = new Date();
    const upcoming = subscriptions.filter(sub => {
      const nextPayment = new Date(sub.nextPaymentDate);
      const daysDiff = Math.ceil((nextPayment - today) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 7;
    });
    return upcoming.sort((a, b) => new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate));
  };

  const getBudgetStatus = () => {
    const totalExpense = getTotalMonthlyExpense();
    const percentage = (totalExpense / monthlyBudget) * 100;
    const remaining = monthlyBudget - totalExpense;
    
    return {
      totalExpense,
      monthlyBudget,
      percentage: Math.min(percentage, 100),
      remaining: Math.max(remaining, 0),
      isOverBudget: totalExpense > monthlyBudget,
      overAmount: Math.max(totalExpense - monthlyBudget, 0)
    };
  };

  const completeWelcome = () => {
    setHasSeenWelcome(true);
  };

  const value = {
    subscriptions,
    monthlyBudget,
    setMonthlyBudget,
    hasSeenWelcome,
    completeWelcome,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    clearAllSubscriptions,
    getTotalMonthlyExpense,
    getUpcomingPayments,
    getBudgetStatus,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
