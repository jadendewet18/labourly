import { db, auth } from "../config/firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";

// Fetch workers belonging ONLY to the logged-in contractor
export async function fetchWorkersFromCloud() {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "workers"),
    where("ownerId", "==", user.uid)
  );

  const querySnapshot = await getDocs(q);
  const workers = [];
  querySnapshot.forEach((doc) => {
    workers.push({ id: doc.id, ...doc.data() });
  });
  return workers;
}

// Fetch weekly logs for ONLY the logged-in contractor
export async function fetchLogsFromCloud(weekKey) {
  const user = auth.currentUser;
  if (!user) return {};

  const logDocRef = doc(db, "weekly_logs", weekKey);
  const docSnap = await getDoc(logDocRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data[user.uid] || {};
  }
  return {};
}

// Save a new worker with the ownerId attached
export async function saveWorkerToCloud(workerData) {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to add workers.");

  const payload = {
    ...workerData,
    ownerId: user.uid,
  };

  const docRef = await addDoc(collection(db, "workers"), payload);
  return docRef.id;
}

// Delete a worker
export async function deleteWorkerFromCloud(id) {
  await deleteDoc(doc(db, "workers", id));
}

// Save weekly logs scoped to user.uid
export async function saveLogsToCloud(weekKey, weekLogs) {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to save logs.");

  const logDocRef = doc(db, "weekly_logs", weekKey);
  await setDoc(
    logDocRef,
    {
      [user.uid]: weekLogs,
    },
    { merge: true }
  );
}