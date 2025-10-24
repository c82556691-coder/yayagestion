'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MenuItem } from '@/lib/definitions';

interface MenuItemFormProps {
  item: MenuItem | null;
  onSave: (item: Partial<MenuItem>) => void;
  onCancel: () => void;
}

export function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    isAvailable: true,
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Main Course',
        isAvailable: true,
      });
    }
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value as any }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Appetizer">Appetizer</SelectItem>
              <SelectItem value="Main Course">Main Course</SelectItem>
              <SelectItem value="Dessert">Dessert</SelectItem>
              <SelectItem value="Beverage">Beverage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isAvailable"
          checked={formData.isAvailable}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isAvailable: checked }))
          }
        />
        <Label htmlFor="isAvailable">Available</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Item</Button>
      </div>
    </form>
  );
}
