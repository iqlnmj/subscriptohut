
export type SubscriptionCategory = 
  | 'entertainment' 
  | 'productivity' 
  | 'utilities' 
  | 'music'
  | 'video'
  | 'gaming'
  | 'cloud'
  | 'other';

export type BillingCycle = 'monthly' | 'yearly' | 'quarterly' | 'weekly';

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  logo?: string;
  color?: string;
  nextBillingDate: Date;
  subscriptionDate: Date;
  autoRenew: boolean;
  reminderDays?: number;
  notes?: string;
}

export interface SubscriptionSummary {
  totalMonthly: number;
  totalYearly: number;
  subscriptionCount: number;
  categoryCounts: Record<SubscriptionCategory, number>;
  categoryAmounts: Record<SubscriptionCategory, number>;
  upcomingPayments: Array<{
    id: string;
    name: string;
    date: Date;
    amount: number;
    daysUntil: number;
  }>;
}
