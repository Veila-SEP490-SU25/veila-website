'use client';

import { useFirebase } from '@/services/firebase';
import {
  collection,
  onSnapshot,
  query,
  where,
  type WhereFilterOp,
  type FieldPath,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

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
