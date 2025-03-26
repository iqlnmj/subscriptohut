
import React from 'react';
import { Subscription } from '@/lib/types';
import { 
  formatCurrency, 
  formatDate, 
  convertToMonthlyPrice, 
  getDaysUntil 
} from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryBadge, ConfirmationDialog } from './ui-components';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete
}) => {
  const { 
    id, 
    name, 
    description, 
    price, 
    billingCycle, 
    category,
    logo,
    color,
    nextBillingDate
  } = subscription;

  const monthlyPrice = convertToMonthlyPrice(price, billingCycle);
  const daysUntil = getDaysUntil(nextBillingDate);
  
  // Determine billing cycle label
  const cycleLabel = {
    monthly: 'month',
    yearly: 'year',
    quarterly: 'quarter',
    weekly: 'week'
  }[billingCycle];

  // Dynamic styling based on urgency
  const getPaymentStatusClasses = () => {
    if (daysUntil <= 3) return 'text-red-500 font-medium';
    if (daysUntil <= 7) return 'text-amber-500 font-medium';
    return 'text-muted-foreground';
  };

  return (
    <Card className="card-subscription overflow-hidden transition-all duration-300 hover:shadow-lg animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {logo && (
              <div 
                className="w-10 h-10 flex items-center justify-center rounded-md"
                style={color ? { backgroundColor: color } : undefined}
              >
                <span className="text-lg">{logo}</span>
              </div>
            )}
            <div>
              <CardTitle className="font-semibold text-xl">{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <CategoryBadge category={category} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-sm">Price</span>
            <div className="font-semibold text-xl">
              {formatCurrency(price)}
              <span className="text-sm text-muted-foreground ml-1">/{cycleLabel}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-sm">Monthly equivalent</span>
            <div className="font-medium">
              {formatCurrency(monthlyPrice)}/month
            </div>
          </div>
          
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-sm">Next payment</span>
            <div className={getPaymentStatusClasses()}>
              {formatDate(nextBillingDate)}
              {daysUntil === 0 && <span className="ml-2">(Today)</span>}
              {daysUntil > 0 && <span className="ml-2">({daysUntil} days)</span>}
              {daysUntil < 0 && <span className="ml-2">(Past due)</span>}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(subscription)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <ConfirmationDialog 
          title="Delete Subscription"
          description={`Are you sure you want to delete ${name}? This action cannot be undone.`}
          trigger={
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          }
          onConfirm={() => onDelete(id)}
        />
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
