import type { Equipment, Category } from './types';

export const INITIAL_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Chest', imageUrl: 'https://source.unsplash.com/600x400/?chest-press' },
  { name: 'Back', imageUrl: 'https://source.unsplash.com/600x400/?rowing-machine' },
  { name: 'Legs', imageUrl: 'https://source.unsplash.com/600x400/?leg-workout' },
  { name: 'Shoulders', imageUrl: 'https://source.unsplash.com/600x400/?shoulder-press' },
  { name: 'Arms', imageUrl: 'https://source.unsplash.com/600x400/?arm-workout' },
  { name: 'Core', imageUrl: 'https://source.unsplash.com/600x400/?ab-workout' },
  { name: 'Full Body', imageUrl: 'https://source.unsplash.com/600x400/?dumbbell-rack-gym' },
  { name: 'Cardio', imageUrl: 'https://source.unsplash.com/600x400/?running-treadmill' },
];

// The ID and categoryId are now omitted as Firestore will generate them.
// The seeder will link them using the categoryName.
export const INITIAL_EQUIPMENT: Omit<Equipment, 'id' | 'categoryId'>[] = [
  { name: 'Bench Press', imageUrl: 'https://source.unsplash.com/600x400/?bench-press-gym', type: 'strength', categoryName: 'Chest' },
  { name: 'Lat Pulldown Machine', imageUrl: 'https://source.unsplash.com/600x400/?lat-pulldown-machine', type: 'strength', categoryName: 'Back' },
  { name: 'Seated Cable Row Machine', imageUrl: 'https://source.unsplash.com/600x400/?seated-cable-row', type: 'strength', categoryName: 'Back' },
  { name: 'Leg Press Machine', imageUrl: 'https://source.unsplash.com/600x400/?leg-press', type: 'strength', categoryName: 'Legs' },
  { name: 'Squat Rack', imageUrl: 'https://source.unsplash.com/600x400/?squat-rack', type: 'strength', categoryName: 'Legs' },
  { name: 'Leg Extension Machine', imageUrl: 'https://source.unsplash.com/600x400/?leg-extension-machine', type: 'strength', categoryName: 'Legs' },
  { name: 'Hamstring Curl Machine', imageUrl: 'https://source.unsplash.com/600x400/?hamstring-curl-machine', type: 'strength', categoryName: 'Legs' },
  { name: 'Shoulder Press Machine', imageUrl: 'https://source.unsplash.com/600x400/?shoulder-press-machine', type: 'strength', categoryName: 'Shoulders' },
  { name: 'Preacher Curl Bench', imageUrl: 'https://source.unsplash.com/600x400/?preacher-curl', type: 'strength', categoryName: 'Arms' },
  { name: 'Dumbbell Rack', imageUrl: 'https://source.unsplash.com/600x400/?dumbbell-rack', type: 'strength', categoryName: 'Full Body' },
  { name: 'Treadmill', imageUrl: 'https://source.unsplash.com/600x400/?treadmill', type: 'cardio', categoryName: 'Cardio' },
  { name: 'Elliptical Trainer', imageUrl: 'https://source.unsplash.com/600x400/?elliptical-trainer', type: 'cardio', categoryName: 'Cardio' },
];