
import React, { useState } from 'react';
import { PageHeader, EmptyState, showNotification } from '@/components/ui-components';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/lib/types';
import { demoSubscriptions } from '@/lib/utils';
import SubscriptionList from '@/components/SubscriptionList';
import SearchBar from '@/components/SearchBar';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import DashboardSummary from '@/components/DashboardSummary';
import { PlusCircle, CreditCard } from 'lucide-react';

const Index: React.FC = () => {
  // State for subscriptions
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(demoSubscriptions);
  
  // State for search and filters
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');
  
  // State for the add/edit subscription modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>(undefined);
  
  const handleAddSubscription = () => {
    setEditingSubscription(undefined);
    setModalOpen(true);
  };
  
  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setModalOpen(true);
  };
  
  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    showNotification('Subscription deleted successfully', 'success');
  };
  
  const handleSaveSubscription = (subscription: Subscription) => {
    if (editingSubscription) {
      // Update existing subscription
      setSubscriptions(subscriptions.map((sub) => 
        sub.id === subscription.id ? subscription : sub
      ));
      showNotification('Subscription updated successfully', 'success');
    } else {
      // Add new subscription
      setSubscriptions([...subscriptions, subscription]);
      showNotification('Subscription added successfully', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Subscription Manager" 
          description="Track and manage all your subscriptions in one place."
        >
          <Button onClick={handleAddSubscription} className="hover:shadow-md transition-all">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Subscription
          </Button>
        </PageHeader>
        
        {/* Dashboard Summary */}
        <DashboardSummary subscriptions={subscriptions} />
        
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>
        
        {/* Subscription List */}
        <SubscriptionList
          subscriptions={subscriptions}
          searchText={searchText}
          selectedCategory={selectedCategory}
          sortOption={sortOption}
          onEdit={handleEditSubscription}
          onDelete={handleDeleteSubscription}
        />
        
        {/* Add/Edit Subscription Modal */}
        <AddSubscriptionModal
          subscription={editingSubscription}
          onSave={handleSaveSubscription}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
        
        {/* Empty State - shown if no subscriptions */}
        {subscriptions.length === 0 && (
          <EmptyState
            title="No subscriptions yet"
            description="Start managing your subscriptions by adding your first one."
            icon={<CreditCard className="h-12 w-12" />}
            action={
              <Button onClick={handleAddSubscription}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Subscription
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Index;
