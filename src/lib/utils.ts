
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  BillingCycle, 
  Subscription, 
  SubscriptionCategory, 
  SubscriptionSummary 
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function convertToMonthlyPrice(price: number, billingCycle: BillingCycle): number {
  switch (billingCycle) {
    case 'yearly':
      return price / 12;
    case 'quarterly':
      return price / 3;
    case 'weekly':
      return price * 4.33; // Average weeks in a month
    default:
      return price;
  }
}

export function calculateSubscriptionSummary(subscriptions: Subscription[]): SubscriptionSummary {
  let totalMonthly = 0;
  let totalYearly = 0;
  const categoryCounts: Record<SubscriptionCategory, number> = {
    entertainment: 0,
    productivity: 0,
    utilities: 0,
    music: 0,
    video: 0,
    gaming: 0,
    cloud: 0,
    other: 0
  };
  
  const categoryAmounts: Record<SubscriptionCategory, number> = {
    entertainment: 0,
    productivity: 0,
    utilities: 0,
    music: 0,
    video: 0,
    gaming: 0,
    cloud: 0,
    other: 0
  };
  
  const today = new Date();
  const upcomingPayments = [];
  
  for (const sub of subscriptions) {
    const monthlyPrice = convertToMonthlyPrice(sub.price, sub.billingCycle);
    totalMonthly += monthlyPrice;
    
    if (categoryCounts[sub.category] !== undefined) {
      categoryCounts[sub.category]++;
      categoryAmounts[sub.category] += monthlyPrice;
    }
    
    // Calculate next payment date
    const nextDate = new Date(sub.nextBillingDate);
    const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Only include upcoming payments in the next 30 days
    if (daysUntil >= 0 && daysUntil <= 30) {
      upcomingPayments.push({
        id: sub.id,
        name: sub.name,
        date: nextDate,
        amount: sub.price,
        daysUntil
      });
    }
  }
  
  // Sort upcoming payments by date
  upcomingPayments.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Calculate yearly total (12 * monthly)
  totalYearly = totalMonthly * 12;
  
  return {
    totalMonthly,
    totalYearly,
    subscriptionCount: subscriptions.length,
    categoryCounts,
    categoryAmounts,
    upcomingPayments
  };
}

export function getCategoryColor(category: SubscriptionCategory): string {
  switch (category) {
    case 'entertainment':
      return 'bg-blue-500 text-white';
    case 'productivity':
      return 'bg-green-500 text-white';
    case 'utilities':
      return 'bg-purple-500 text-white';
    case 'music':
      return 'bg-pink-500 text-white';
    case 'video':
      return 'bg-red-500 text-white';
    case 'gaming':
      return 'bg-orange-500 text-white';
    case 'cloud':
      return 'bg-cyan-500 text-white';
    case 'other':
    default:
      return 'bg-gray-500 text-white';
  }
}

export function getNextBillingDate(date: Date, cycle: BillingCycle): Date {
  const newDate = new Date(date);
  
  switch (cycle) {
    case 'yearly':
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
    case 'quarterly':
      newDate.setMonth(newDate.getMonth() + 3);
      break;
    case 'monthly':
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    case 'weekly':
      newDate.setDate(newDate.getDate() + 7);
      break;
  }
  
  return newDate;
}

export function getDaysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export const demoSubscriptions: Subscription[] = [
  {
    id: generateId(),
    name: 'Netflix',
    description: 'Streaming service',
    price: 15.99,
    billingCycle: 'monthly',
    category: 'entertainment',
    logo: '📺',
    color: '#E50914',
    nextBillingDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    subscriptionDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    autoRenew: true,
    reminderDays: 3
  },
  {
    id: generateId(),
    name: 'Spotify',
    description: 'Music streaming',
    price: 9.99,
    billingCycle: 'monthly',
    category: 'music',
    logo: '🎵',
    color: '#1DB954',
    nextBillingDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    subscriptionDate: new Date(new Date().setMonth(new Date().getMonth() - 8)),
    autoRenew: true,
    reminderDays: 3
  },
  {
    id: generateId(),
    name: 'Adobe Creative Cloud',
    description: 'Design software suite',
    price: 52.99,
    billingCycle: 'monthly',
    category: 'productivity',
    logo: '🎨',
    color: '#FF0000',
    nextBillingDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    subscriptionDate: new Date(new Date().setMonth(new Date().getMonth() - 12)),
    autoRenew: true,
    reminderDays: 5
  },
  {
    id: generateId(),
    name: 'iCloud Storage',
    description: '200GB plan',
    price: 2.99,
    billingCycle: 'monthly',
    category: 'cloud',
    logo: '☁️',
    color: '#3498DB',
    nextBillingDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    subscriptionDate: new Date(new Date().setMonth(new Date().getMonth() - 15)),
    autoRenew: true,
    reminderDays: 2
  },
  {
    id: generateId(),
    name: 'Amazon Prime',
    description: 'Shopping and streaming',
    price: 139,
    billingCycle: 'yearly',
    category: 'entertainment',
    logo: '📦',
    color: '#FF9900',
    nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 8)),
    subscriptionDate: new Date(new Date().setMonth(new Date().getMonth() - 4)),
    autoRenew: true,
    reminderDays: 7
  },
  {
    id: generateId(),
    name: 'YouTube Premium',
    description: 'Ad-free videos',
    price: 11.99,
    billingCycle: 'monthly',
    category: 'video',
    logo: '▶️',
    color: '#FF0000',
    nextBillingDate: new Date(new Date().setDate(new Date().getDate() + 21)),
    subscriptionDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    autoRenew: true,
    reminderDays: 3
  }
];
