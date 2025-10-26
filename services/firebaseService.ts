import type { User } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { INITIAL_EQUIPMENT } from '../constants';
import type { Equipment, UserProfile, WorkoutSession } from '../types';

// --- Authentication Functions ---

export const registerUser = async (email: string, password: string) => {
    // FIX: Reverted to Firebase v8 auth API.
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user!;
    // Create a user profile document in Firestore
    // FIX: Reverted to Firebase v8 Firestore API.
    const userDocRef = db.collection('users').doc(user.uid);
    await userDocRef.set({ role: 'user' });
    return userCredential;
}

export const loginUser = (email: string, password: string) => {
    // FIX: Reverted to Firebase v8 auth API.
    return auth.signInWithEmailAndPassword(email, password);
}

export const logoutUser = () => {
    // FIX: Reverted to Firebase v8 auth API.
    return auth.signOut();
}

export const onAuthStateChangedListener = (callback: (user: User | null) => void) => {
    // FIX: Reverted to Firebase v8 auth API.
    return auth.onAuthStateChanged(callback);
}

// --- User Profile Functions ---

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    // FIX: Reverted to Firebase v8 Firestore API.
    const userDocRef = db.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();
    if (userDocSnap.exists) {
        return userDocSnap.data() as UserProfile;
    }
    return null;
}


// --- Firestore Functions ---

const EQUIPMENT_COLLECTION = 'equipment';

export const getEquipmentList = async (): Promise<Equipment[]> => {
    // FIX: Reverted to Firebase v8 Firestore API.
    const querySnapshot = await db.collection(EQUIPMENT_COLLECTION).orderBy('name').get();
    const equipmentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Equipment));
    return equipmentList;
};

export const addEquipment = async (data: Omit<Equipment, 'id'>) => {
    const docRef = await db.collection(EQUIPMENT_COLLECTION).add(data);
    return docRef;
};

export const deleteEquipment = (id: string) => {
    return db.collection(EQUIPMENT_COLLECTION).doc(id).delete();
};

export const updateEquipment = (id: string, data: Partial<Omit<Equipment, 'id'>>) => {
    // FIX: Reverted to Firebase v8 Firestore API.
    const equipmentDocRef = db.collection(EQUIPMENT_COLLECTION).doc(id);
    return equipmentDocRef.update(data);
};

export const seedDatabase = async () => {
    // FIX: Reverted to Firebase v8 Firestore API.
    const equipmentCollectionRef = db.collection(EQUIPMENT_COLLECTION);
    
    // Check if the collection is empty before seeding
    // FIX: Reverted to Firebase v8 equivalent of getCountFromServer.
    const snapshot = await equipmentCollectionRef.limit(1).get();
    if (!snapshot.empty) {
        console.log("Database already seeded.");
        return;
    }

    console.log("Seeding database...");
    // FIX: Reverted to Firebase v8 Firestore API.
    const batch = db.batch();
    INITIAL_EQUIPMENT.forEach((equipment) => {
        // FIX: Reverted to Firebase v8 Firestore API.
        const docRef = db.collection(EQUIPMENT_COLLECTION).doc();
        batch.set(docRef, equipment);
    });
    await batch.commit();
    console.log("Database seeded successfully.");
};

// --- Workout History Functions ---

export const saveWorkoutSession = (sessionData: Omit<WorkoutSession, 'id'>) => {
    if (!sessionData.userId) {
        throw new Error("User is not logged in.");
    }
    // FIX: Reverted to Firebase v8 Firestore API for subcollections.
    const historyCollectionRef = db.collection('users').doc(sessionData.userId).collection('workoutHistory');
    return historyCollectionRef.add(sessionData);
};

export const getWorkoutHistory = async (userId: string): Promise<WorkoutSession[]> => {
    // FIX: Reverted to Firebase v8 Firestore API.
    const historyCollectionRef = db.collection('users').doc(userId).collection('workoutHistory');
    const q = historyCollectionRef.orderBy('createdAt', 'desc');
    const querySnapshot = await q.get();
    const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as WorkoutSession));
    return history;
};