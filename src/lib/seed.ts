// IMPORTANT: This file is only used for seeding the database for demonstration purposes.
// In a real-world application, you would likely have a more robust system for managing initial data.

import {
  collection,
  doc,
  writeBatch,
  getDocs,
  type Firestore,
} from 'firebase/firestore';
import placeholderImages from './placeholder-images.json';

// Function to seed the menuItems collection
export async function seedMenuItems(db: Firestore) {
  const menuItemsCollection = collection(db, 'menuItems');
  const snapshot = await getDocs(menuItemsCollection);

  // If the collection is not empty, don't seed
  if (!snapshot.empty) {
    console.log('Menu items collection already has data. Skipping seed.');
    return;
  }

  console.log('Seeding menu items...');

  const batch = writeBatch(db);

  const itemsToSeed = [
    {
      name: 'Classic Burger',
      description:
        'A juicy beef patty with fresh lettuce, tomato, and our special sauce.',
      price: 12.99,
      category: 'Main Course',
      isAvailable: true,
      imageUrl: placeholderImages.menuItems[2].imageUrl,
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, tomatoes, and basil.',
      price: 15.5,
      category: 'Main Course',
      isAvailable: true,
      imageUrl: placeholderImages.menuItems[3].imageUrl,
    },
    {
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with Caesar dressing, croutons, and parmesan.',
      price: 9.99,
      category: 'Appetizer',
      isAvailable: true,
      imageUrl: placeholderImages.menuItems[0].imageUrl,
    },
    {
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a gooey molten center.',
      price: 7.5,
      category: 'Dessert',
      isAvailable: true,
      imageUrl: placeholderImages.menuItems[4].imageUrl,
    },
     {
      name: 'Spring Rolls',
      description: 'Crispy rolls filled with vegetables and served with a sweet chili sauce.',
      price: 8.50,
      category: 'Appetizer',
      isAvailable: true,
      imageUrl: placeholderImages.menuItems[1].imageUrl,
    },
    {
      name: 'New York Cheesecake',
      description: 'Creamy New York-style cheesecake with a graham cracker crust.',
      price: 7.99,
      category: 'Dessert',
      isAvailable: true,
      imageUrl: placeholderImages.menuItems[5].imageUrl,
    },
    {
        name: 'Iced Tea',
        description: 'Freshly brewed iced tea, sweetened or unsweetened.',
        price: 2.99,
        category: 'Beverage',
        isAvailable: true,
        imageUrl: placeholderImages.menuItems[6].imageUrl,
    },
    {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk foam.',
        price: 4.50,
        category: 'Beverage',
        isAvailable: true,
        imageUrl: placeholderImages.menuItems[7].imageUrl,
    }
  ];

  itemsToSeed.forEach((item) => {
    const docRef = doc(menuItemsCollection); // Create a new doc with a random ID
    batch.set(docRef, item);
  });

  try {
    await batch.commit();
    console.log('Menu items seeded successfully!');
  } catch (error) {
    console.error('Error seeding menu items:', error);
  }
}
