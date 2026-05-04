export const exportToCSV = (subscriptions) => {
  const headers = [
    '订阅名称',
    '金额',
    '计费周期',
    '下次扣费日期',
    '支付方式',
    '分类',
    '备注',
    '创建时间'
  ];

  const csvContent = [
    headers.join(','),
    ...subscriptions.map(sub => [
      `"${sub.name}"`,
      sub.amount,
      getBillingCycleText(sub.billingCycle),
      sub.nextPaymentDate,
      `"${sub.paymentMethod || ''}"`,
      `"${sub.category || ''}"`,
      `"${sub.notes || ''}"`,
      sub.createdAt
    ].join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `订阅记录_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
