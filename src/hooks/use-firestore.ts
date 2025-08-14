"use client";
import { useFirebase } from "@/services/firebase";
import {
  collection,
  FieldPath,
  onSnapshot,
  orderBy,
  query,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export interface Condition {
  field: string | FieldPath;
  operator: WhereFilterOp;
  value: string | number;
}

export const useFirestore = (collectionPath: string, condition?: Condition) => {
  const [document, setDocument] = useState<any[]>([]);
  const { firestore } = useFirebase();

  useEffect(() => {
    if (!firestore) return;
    let collectionRef = query(
      collection(firestore, collectionPath),
      orderBy("updatedAt", "desc")
    );
    if (condition) {
      collectionRef = query(
        collectionRef,
        where(condition.field, condition.operator, condition.value)
      );
    }

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data: any[] = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), docId: doc.id });
      });
      setDocument(data);
    });

    return () => unsubscribe();
  }, [collectionPath, condition]);

  return document;
};
