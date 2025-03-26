
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Subscription, SubscriptionCategory, BillingCycle } from '@/lib/types';
import { generateId, getNextBillingDate } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface AddSubscriptionModalProps {
  subscription?: Subscription;
  onSave: (subscription: Subscription) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: { value: SubscriptionCategory; label: string }[] = [
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'music', label: 'Music' },
  { value: 'video', label: 'Video' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'other', label: 'Other' }
];

const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'weekly', label: 'Weekly' }
];

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  subscription,
  onSave,
  open,
  onOpenChange
}) => {
  const isEditMode = !!subscription;
  
  // Default values for a new subscription
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [category, setCategory] = useState<SubscriptionCategory>('other');
  const [logo, setLogo] = useState('');
  const [color, setColor] = useState('');
  const [nextBillingDate, setNextBillingDate] = useState<Date>(new Date());
  const [subscriptionDate, setSubscriptionDate] = useState<Date>(new Date());
  const [autoRenew, setAutoRenew] = useState(true);
  const [reminderDays, setReminderDays] = useState('3');
  const [notes, setNotes] = useState('');

  // Reset form when opening or when subscription changes
  useEffect(() => {
    if (open) {
      if (subscription) {
        // Edit mode - populate with subscription data
        setName(subscription.name);
        setDescription(subscription.description || '');
        setPrice(subscription.price.toString());
        setBillingCycle(subscription.billingCycle);
        setCategory(subscription.category);
        setLogo(subscription.logo || '');
        setColor(subscription.color || '');
        setNextBillingDate(new Date(subscription.nextBillingDate));
        setSubscriptionDate(new Date(subscription.subscriptionDate));
        setAutoRenew(subscription.autoRenew);
        setReminderDays(subscription.reminderDays?.toString() || '3');
        setNotes(subscription.notes || '');
      } else {
        // New subscription - reset form
        setName('');
        setDescription('');
        setPrice('');
        setBillingCycle('monthly');
        setCategory('other');
        setLogo('');
        setColor('');
        setNextBillingDate(new Date());
        setSubscriptionDate(new Date());
        setAutoRenew(true);
        setReminderDays('3');
        setNotes('');
      }
    }
  }, [open, subscription]);

  const handleSave = () => {
    // Validate required fields
    if (!name || !price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      // Show validation error
      return;
    }

    const newSubscription: Subscription = {
      id: subscription?.id || generateId(),
      name,
      description: description || undefined,
      price: parseFloat(price),
      billingCycle,
      category,
      logo: logo || undefined,
      color: color || undefined,
      nextBillingDate,
      subscriptionDate,
      autoRenew,
      reminderDays: reminderDays ? parseInt(reminderDays, 10) : undefined,
      notes: notes || undefined
    };

    onSave(newSubscription);
    onOpenChange(false);
  };

  const handleSubscriptionDateChange = (date: Date | undefined) => {
    if (date) {
      setSubscriptionDate(date);
      // Update next billing date based on subscription date and billing cycle
      setNextBillingDate(getNextBillingDate(date, billingCycle));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditMode ? `Edit ${subscription.name}` : 'Add New Subscription'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Subscription Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Subscription Name</Label>
            <Input
              id="name"
              placeholder="Netflix, Spotify, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Streaming service, music, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          {/* Price and Billing Cycle - 2 column grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="9.99"
                  className="pl-8"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select 
                value={billingCycle} 
                onValueChange={(val) => setBillingCycle(val as BillingCycle)}
              >
                <SelectTrigger id="billingCycle">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_CYCLES.map((cycle) => (
                    <SelectItem key={cycle.value} value={cycle.value}>
                      {cycle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={(val) => setCategory(val as SubscriptionCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Logo and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo (Emoji)</Label>
              <Input
                id="logo"
                placeholder="📺"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Brand Color (Hex)</Label>
              <div className="flex space-x-2">
                <Input
                  id="color"
                  placeholder="#FF0000"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                {color && (
                  <div 
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: color }}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Subscription Date */}
          <div className="space-y-2">
            <Label htmlFor="subscriptionDate">First Payment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="subscriptionDate"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {subscriptionDate ? format(subscriptionDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={subscriptionDate}
                  onSelect={handleSubscriptionDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Next Billing Date */}
          <div className="space-y-2">
            <Label htmlFor="nextBillingDate">Next Payment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="nextBillingDate"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {nextBillingDate ? format(nextBillingDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={nextBillingDate}
                  onSelect={(date) => date && setNextBillingDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Auto Renew and Reminder Days */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoRenew" className="cursor-pointer">Auto Renewal</Label>
              <Switch
                id="autoRenew"
                checked={autoRenew}
                onCheckedChange={setAutoRenew}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminderDays">Remind me (days before)</Label>
              <Input
                id="reminderDays"
                type="number"
                min="0"
                max="30"
                placeholder="3"
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)}
              />
            </div>
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional information about this subscription"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-end gap-2 py-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditMode ? 'Save Changes' : 'Add Subscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;
