"use client";
import { useFirebase } from "@/services/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

export const addDocument = async (collectionPath: string, data: any) => {
  const { firestore } = useFirebase();
  if (!firestore) return;
  const query = collection(firestore, collectionPath);
  await addDoc(query, { ...data, createdAt: new Date() });
};

export const updateDocument = async (
  collectionPath: string,
  docId: string,
  data: any
) => {
  const { firestore } = useFirebase();
  if (!firestore) return;
  const docRef = doc(firestore, collectionPath, docId);
  await updateDoc(docRef, { ...data, updatedAt: new Date() });
};
