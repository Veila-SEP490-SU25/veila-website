'use client';

import { useFirebase } from '@/services/firebase';
import {
  collection,
  onSnapshot,
  query,
  where,
  type WhereFilterOp,
  type FieldPath,
  doc,
  updateDoc,
  addDoc,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

export interface Condition {
  field: string | FieldPath;
  operator: WhereFilterOp;
  value: string | number | boolean;
}

export function useFirestore(collectionName: string, condition?: Condition) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { firestore } = useFirebase();

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      return;
    }

    try {
      const collectionRef = collection(firestore, collectionName);
      let q = query(collectionRef);

      if (condition) {
        q = query(collectionRef, where(condition.field, condition.operator, condition.value));
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const documents = snapshot.docs.map((doc) => ({
            docId: doc.id,
            ...doc.data(),
          }));
          setData(documents);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Firestore error:', err);
          setError(err.message);
          setLoading(false);
        },
      );

      return unsubscribe;
    } catch (err: any) {
      console.error('Firestore setup error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [firestore, collectionName, condition]);

  return { data, loading, error };
}

export function useFirestoreDoc() {
  const { firestore } = useFirebase();

  const updateDocument = useCallback(
    async (collectionPath: string, docId: string, data: any) => {
      if (!firestore) return;
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      );
      const docRef = doc(firestore, collectionPath, docId);
      await updateDoc(docRef, { ...cleanData, updatedAt: new Date() });
    },
    [firestore],
  );

  const addDocument = useCallback(
    async (collectionPath: string, data: any) => {
      if (!firestore) return;
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      );
      const query = collection(firestore, collectionPath);
      const docRef = await addDoc(query, {
        ...cleanData,
        createdAt: new Date(),
      });
      return docRef.id;
    },
    [firestore],
  );

  return { updateDocument, addDocument };
}
