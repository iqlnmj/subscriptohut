
import React from 'react';
import { Subscription, SubscriptionSummary } from '@/lib/types';
import { calculateSubscriptionSummary, formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryBadge, PriceDisplay } from './ui-components';
import { CheckCircle2, ClockIcon, CalendarIcon, CreditCard } from 'lucide-react';

interface DashboardSummaryProps {
  subscriptions: Subscription[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ subscriptions }) => {
  const summary = calculateSubscriptionSummary(subscriptions);
  
  // If there are no subscriptions, don't display the summary
  if (subscriptions.length === 0) {
    return null;
  }

  const getPaymentStatusClasses = (daysUntil: number) => {
    if (daysUntil <= 3) return 'text-red-500';
    if (daysUntil <= 7) return 'text-amber-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 w-full mb-8 animate-fade-in">
      {/* Overview Card */}
      <Card className="glass-panel lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col p-3">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Monthly Cost</span>
              <PriceDisplay amount={summary.totalMonthly} size="large" />
            </div>
            
            <div className="flex flex-col p-3">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Yearly Cost</span>
              <PriceDisplay amount={summary.totalYearly} size="large" />
            </div>
            
            <div className="flex flex-col p-3">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Active Subscriptions</span>
              <div className="text-4xl font-semibold flex items-center">
                {summary.subscriptionCount}
                <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
              </div>
            </div>

            <div className="flex flex-col p-3">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Top Category</span>
              {Object.entries(summary.categoryCounts).length > 0 && (
                <div className="mt-1">
                  {(() => {
                    const sortedCategories = Object.entries(summary.categoryCounts)
                      .sort(([, a], [, b]) => b - a);
                    
                    if (sortedCategories.length > 0) {
                      const [topCategory, count] = sortedCategories[0];
                      return (
                        <>
                          <CategoryBadge category={topCategory} className="mr-2" />
                          <span className="text-sm text-muted-foreground">
                            {count} subscription{count !== 1 ? 's' : ''}
                          </span>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Spending by Category</div>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {Object.entries(summary.categoryAmounts)
                .filter(([, amount]) => amount > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex flex-col bg-secondary rounded-lg p-3">
                    <CategoryBadge category={category} className="self-start mb-2" />
                    <PriceDisplay amount={amount} period="mo" size="small" />
                  </div>
                ))
              }
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming Payments Card */}
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.upcomingPayments.length > 0 ? (
            <div className="space-y-4">
              {summary.upcomingPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className={`h-5 w-5 ${getPaymentStatusClasses(payment.daysUntil)}`} />
                    <div>
                      <div className="font-medium">{payment.name}</div>
                      <div className={`text-sm ${getPaymentStatusClasses(payment.daysUntil)}`}>
                        {formatDate(payment.date)}
                        {payment.daysUntil === 0 && <span className="ml-1 text-red-500 font-medium">(Today)</span>}
                        {payment.daysUntil > 0 && (
                          <span className="ml-1">
                            ({payment.daysUntil} day{payment.daysUntil !== 1 ? 's' : ''})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(payment.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-48 text-muted-foreground">
              <ClockIcon className="h-12 w-12 mb-3 opacity-30" />
              <p>No upcoming payments in the next 30 days</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
