import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/constants/firebase";

export const migrateChatData = async (firestore: any) => {
  try {
    console.log("Starting Firebase data migration...");

    const oldCollections = ["chatrooms", "messages"];
    const newCollections = [
      FIREBASE_COLLECTIONS.CHATROOMS,
      FIREBASE_COLLECTIONS.MESSAGES,
    ];

    for (let i = 0; i < oldCollections.length; i++) {
      const oldCollectionName = oldCollections[i];
      const newCollectionName = newCollections[i];

      const oldCollectionRef = collection(firestore, oldCollectionName);
      const oldSnapshot = await getDocs(oldCollectionRef);

      if (!oldSnapshot.empty) {
        console.log(
          `Found ${oldSnapshot.size} documents in old collection: ${oldCollectionName}`
        );

        // Check if new collection has data
        const newCollectionRef = collection(firestore, newCollectionName);
        const newSnapshot = await getDocs(newCollectionRef);

        if (newSnapshot.empty) {
          console.log(
            `New collection ${newCollectionName} is empty, migration needed`
          );
        } else {
          console.log(
            `New collection ${newCollectionName} already has data, skipping migration`
          );
        }
      }
    }

    console.log("Firebase data migration check completed");
  } catch (error) {
    console.error("Error during Firebase migration:", error);
  }
};

export const cleanupOldCollections = async (firestore: any) => {
  try {
    console.log("Starting cleanup of old collections...");

    const oldCollections = ["chatrooms", "messages"];

    for (const oldCollectionName of oldCollections) {
      const oldCollectionRef = collection(firestore, oldCollectionName);
      const oldSnapshot = await getDocs(oldCollectionRef);

      if (!oldSnapshot.empty) {
        console.log(
          `Cleaning up ${oldSnapshot.size} documents from ${oldCollectionName}`
        );

        for (const oldDoc of oldSnapshot.docs) {
          await deleteDoc(doc(firestore, oldCollectionName, oldDoc.id));
        }

        console.log(`Cleaned up collection: ${oldCollectionName}`);
      }
    }

    console.log("Cleanup completed");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};
