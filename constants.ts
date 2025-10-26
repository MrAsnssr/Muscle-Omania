import type { Equipment } from './types';

// The ID is now a string to match what will be used in Firestore, but it's omitted here
// as Firestore will generate it. This is for seeding data.
export const INITIAL_EQUIPMENT: Omit<Equipment, 'id'>[] = [
  { name: 'Lat Pulldown Machine', imageUrl: 'https://source.unsplash.com/600x400/?lat-pulldown-machine' },
  { name: 'Leg Press Machine', imageUrl: 'https://source.unsplash.com/600x400/?leg-press' },
  { name: 'Dumbbell Rack', imageUrl: 'https://source.unsplash.com/600x400/?dumbbell-rack' },
  { name: 'Seated Cable Row Machine', imageUrl: 'https://source.unsplash.com/600x400/?seated-cable-row' },
  { name: 'Bench Press', imageUrl: 'https://source.unsplash.com/600x400/?bench-press-gym' },
  { name: 'Squat Rack', imageUrl: 'https://source.unsplash.com/600x400/?squat-rack' },
  { name: 'Shoulder Press Machine', imageUrl: 'https://source.unsplash.com/600x400/?shoulder-press-machine' },
  { name: 'Leg Extension Machine', imageUrl: 'https://source.unsplash.com/600x400/?leg-extension-machine' },
  { name: 'Hamstring Curl Machine', imageUrl: 'https://source.unsplash.com/600x400/?hamstring-curl-machine' },
  { name: 'Preacher Curl Bench', imageUrl: 'https://source.unsplash.com/600x400/?preacher-curl' },
  { name: 'Treadmill', imageUrl: 'https://source.unsplash.com/600x400/?treadmill' },
  { name: 'Elliptical Trainer', imageUrl: 'https://source.unsplash.com/600x400/?elliptical-trainer' },
];
