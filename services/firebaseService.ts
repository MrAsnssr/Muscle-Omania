
import firebase from 'firebase/compat/app';
import { auth, db } from '../firebaseConfig';
import { INITIAL_EQUIPMENT, INITIAL_CATEGORIES } from '../constants';
import type { Equipment, UserProfile, WorkoutSession, Category } from '../types';

// --- Authentication Functions ---

export const registerUser = async (email: string, password: string) => {
    // Fix: Use compat API for authentication and Firestore
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user!;
    const userDocRef = db.collection('users').doc(user.uid);
    await userDocRef.set({ role: 'user' });
    return userCredential;
}

export const loginUser = (email: string, password: string) => {
    // Fix: Use compat API for authentication
    return auth.signInWithEmailAndPassword(email, password);
}

export const logoutUser = () => {
    // Fix: Use compat API for authentication
    return auth.signOut();
}

export const onAuthStateChangedListener = (callback: (user: firebase.User | null) => void) => {
    // Fix: Use compat API for authentication
    return auth.onAuthStateChanged(callback);
}

// --- User Profile Functions ---

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    // Fix: Use compat API for Firestore
    const userDocRef = db.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();
    // Fix: Use `exists` property instead of `exists()` method
    if (userDocSnap.exists) {
        return userDocSnap.data() as UserProfile;
    }
    return null;
}

// --- Firestore Category Functions ---
const CATEGORIES_COLLECTION = 'categories';

export const getCategories = async (): Promise<Category[]> => {
    // Fix: Use compat API for Firestore
    const categoriesCollectionRef = db.collection(CATEGORIES_COLLECTION);
    const q = categoriesCollectionRef.orderBy('name');
    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Category));
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
    const docSnap = await db.collection(CATEGORIES_COLLECTION).doc(id).get();
    if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as Category;
    }
    return null;
}

export const addCategory = (data: Omit<Category, 'id'>) => {
    // Fix: Use compat API for Firestore
    return db.collection(CATEGORIES_COLLECTION).add(data);
};

export const updateCategory = (id: string, data: Partial<Omit<Category, 'id'>>) => {
    // Fix: Use compat API for Firestore
    return db.collection(CATEGORIES_COLLECTION).doc(id).update(data);
};

export const deleteCategory = (id: string) => {
    // Fix: Use compat API for Firestore
    return db.collection(CATEGORIES_COLLECTION).doc(id).delete();
};

// --- Firestore Equipment Functions ---

const EQUIPMENT_COLLECTION = 'equipment';

export const getEquipmentListByCategory = async (categoryId: string): Promise<Equipment[]> => {
    // Fix: Use compat API for Firestore
    const equipmentCollectionRef = db.collection(EQUIPMENT_COLLECTION);
    // Removed .orderBy('name') to avoid needing a composite index in Firestore.
    // Sorting will be handled client-side.
    const q = equipmentCollectionRef
        .where('categoryId', '==', categoryId);
    const querySnapshot = await q.get();
    const equipment = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Equipment));
    
    // Sort the results on the client side to ensure consistent ordering.
    return equipment.sort((a, b) => a.name.localeCompare(b.name));
};

export const getEquipmentById = async (id: string): Promise<Equipment | null> => {
    // Fix: Use compat API for Firestore
    const docSnap = await db.collection(EQUIPMENT_COLLECTION).doc(id).get();
    // Fix: Use `exists` property instead of `exists()` method
    if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as Equipment;
    }
    return null;
}

export const addEquipment = (data: Omit<Equipment, 'id'>) => {
    // Fix: Use compat API for Firestore
    return db.collection(EQUIPMENT_COLLECTION).add(data);
};

export const deleteEquipment = (id: string) => {
    // Fix: Use compat API for Firestore
    return db.collection(EQUIPMENT_COLLECTION).doc(id).delete();
};

export const updateEquipmentInDb = (id: string, data: Partial<Omit<Equipment, 'id'>>) => {
    // Fix: Use compat API for Firestore
    return db.collection(EQUIPMENT_COLLECTION).doc(id).update(data);
};

export const seedDatabase = async () => {
    // Fix: Use compat API for Firestore
    const categoriesCollectionRef = db.collection(CATEGORIES_COLLECTION);
    const q = categoriesCollectionRef.limit(1);
    const categoriesSnapshot = await q.get();

    if (!categoriesSnapshot.empty) {
        console.log("Database already contains categories. Seeding aborted.");
        return;
    }

    console.log("Seeding database...");
    
    // 1. Seed Categories
    // Fix: Use compat API for Firestore batch writes
    const categoryBatch = db.batch();
    const categoryNameMap = new Map<string, string>();

    for (const categoryData of INITIAL_CATEGORIES) {
        // Fix: Use compat API to generate a new doc ref
        const categoryRef = db.collection(CATEGORIES_COLLECTION).doc();
        categoryBatch.set(categoryRef, categoryData);
        categoryNameMap.set(categoryData.name, categoryRef.id);
    }
    await categoryBatch.commit();
    console.log("Categories seeded successfully.");

    // 2. Seed Equipment
    const equipmentBatch = db.batch();
    const equipmentCollectionRef = db.collection(EQUIPMENT_COLLECTION);
    INITIAL_EQUIPMENT.forEach((equipmentData) => {
        const categoryId = categoryNameMap.get(equipmentData.categoryName);
        if (categoryId) {
            const equipmentRef = equipmentCollectionRef.doc(); // Auto-generates ID
            const fullEquipmentData: Omit<Equipment, 'id'> = {
                ...equipmentData,
                categoryId: categoryId,
            };
            equipmentBatch.set(equipmentRef, fullEquipmentData);
        } else {
            console.warn(`Could not find category ID for "${equipmentData.categoryName}"`);
        }
    });
    await equipmentBatch.commit();
    console.log("Equipment seeded successfully.");
};

// --- Workout History Functions ---

export const saveWorkoutSession = (sessionData: Omit<WorkoutSession, 'id'>) => {
    if (!sessionData.userId) {
        throw new Error("User is not logged in.");
    }
    // Fix: Use compat API for Firestore subcollections
    const historyCollectionRef = db.collection('users').doc(sessionData.userId).collection('workoutHistory');
    return historyCollectionRef.add(sessionData);
};

export const getWorkoutHistory = async (userId: string): Promise<WorkoutSession[]> => {
    // Fix: Use compat API for Firestore subcollections
    const historyCollectionRef = db.collection('users').doc(userId).collection('workoutHistory');
    const q = historyCollectionRef.orderBy('createdAt', 'desc');
    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as WorkoutSession));
};