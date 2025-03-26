
import React from 'react';
import { Subscription } from '@/lib/types';
import SubscriptionCard from './SubscriptionCard';
import { EmptyState } from './ui-components';
import { SearchX } from 'lucide-react';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  searchText: string;
  selectedCategory: string;
  sortOption: string;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  searchText,
  selectedCategory,
  sortOption,
  onEdit,
  onDelete
}) => {
  // Filter subscriptions based on search text and category
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const textMatch = searchText
      ? sub.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (sub.description?.toLowerCase().includes(searchText.toLowerCase()) ?? false)
      : true;
    
    const categoryMatch = selectedCategory === 'all' || sub.category === selectedCategory;
    
    return textMatch && categoryMatch;
  });

  // Sort subscriptions based on the selected sort option
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'date-asc':
        return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
      case 'date-desc':
        return new Date(b.nextBillingDate).getTime() - new Date(a.nextBillingDate).getTime();
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (sortedSubscriptions.length === 0) {
    if (searchText || selectedCategory !== 'all') {
      return (
        <EmptyState
          title="No matching subscriptions"
          description="Try adjusting your search or filter criteria."
          icon={<SearchX className="h-12 w-12" />}
        />
      );
    }
    
    return (
      <EmptyState
        title="No subscriptions yet"
        description="You haven't added any subscriptions yet. Add your first subscription to get started."
      />
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full animate-fade-in">
      {sortedSubscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SubscriptionList;
