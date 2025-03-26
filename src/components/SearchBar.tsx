
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SubscriptionCategory } from '@/lib/types';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
}

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'music', label: 'Music' },
  { value: 'video', label: 'Video' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'other', label: 'Other' }
];

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A to Z)' },
  { value: 'name-desc', label: 'Name (Z to A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'date-asc', label: 'Next Payment (Soonest)' },
  { value: 'date-desc', label: 'Next Payment (Latest)' }
];

const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  setSearchText,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption
}) => {
  const hasFilters = searchText || selectedCategory !== 'all' || sortOption !== 'name-asc';

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategory('all');
    setSortOption('name-asc');
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full max-w-4xl animate-fade-in">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subscriptions..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-9"
        />
        {searchText && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => setSearchText('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-4">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Sort by</h4>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
        
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="text-sm">
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
