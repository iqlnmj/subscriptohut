
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export const PageHeader = ({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 py-4 md:py-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
};

export const EmptyState = ({
  title,
  description,
  action,
  icon
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 w-full animate-fade-in">
      {icon && <div className="w-16 h-16 mb-4 text-muted-foreground opacity-70">{icon}</div>}
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
};

export const CategoryBadge = ({
  category,
  className
}: {
  category: string;
  className?: string;
}) => {
  const getColor = () => {
    switch (category.toLowerCase()) {
      case 'entertainment':
        return 'bg-blue-100 text-blue-800';
      case 'productivity':
        return 'bg-green-100 text-green-800';
      case 'utilities':
        return 'bg-purple-100 text-purple-800';
      case 'music':
        return 'bg-pink-100 text-pink-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'gaming':
        return 'bg-orange-100 text-orange-800';
      case 'cloud':
        return 'bg-cyan-100 text-cyan-800';
      case 'other':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={cn('category-badge', getColor(), className)}>
      {category}
    </span>
  );
};

export const PriceDisplay = ({
  amount,
  period,
  className,
  size = 'default'
}: {
  amount: number;
  period?: string;
  className?: string;
  size?: 'small' | 'default' | 'large';
}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  });

  const sizeClasses = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <div className={cn('font-semibold', sizeClasses[size], className)}>
      <span>{formatter.format(amount)}</span>
      {period && <span className="text-sm font-normal text-muted-foreground ml-1">/{period}</span>}
    </div>
  );
};

export const LoadingCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-0">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </CardFooter>
    </Card>
  );
};

export const ConfirmationDialog = ({
  title,
  description,
  trigger,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'destructive'
}: {
  title: string;
  description: string;
  trigger: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}) => {
  const [open, setOpen] = React.useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-end mt-5">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {cancelText}
          </Button>
          <Button variant={variant === 'destructive' ? 'destructive' : 'default'} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function showNotification(
  message: string,
  type: 'success' | 'error' | 'info' = 'info'
) {
  if (type === 'success') {
    toast.success(message);
  } else if (type === 'error') {
    toast.error(message);
  } else {
    toast(message);
  }
}
