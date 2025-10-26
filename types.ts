
export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Equipment {
  id: string; // Changed to string for Firestore document IDs
  name: string;
  imageUrl: string;
  info?: string; // Optional field for additional info
  videoUrl?: string; // Optional field for a YouTube video link
  type: 'strength' | 'cardio';
  categoryId: string;
  categoryName: string;
}

// Represents the data structure for a set as it is stored in Firestore.
export interface SetData {
  weight?: string;
  reps?: string;
  side?: 'Left' | 'Right';
  duration?: string; // in minutes
  distance?: string; // in km
}

// Represents a set in the client-side application state, with a temporary ID for UI management.
export interface WorkoutSet extends SetData {
  id: number;
}


export interface UserProfile {
  role: 'admin' | 'user';
}

export interface WorkoutSession {
    id?: string;
    userId: string;
    equipmentId: string;
    equipmentName: string;
    createdAt: string; // Using ISO string for consistency
    sets: SetData[];
}