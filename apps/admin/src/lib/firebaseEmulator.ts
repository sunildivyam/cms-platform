import { connectAuthEmulator } from "firebase/auth";
import { auth, db } from "./firebase";
import { connectFirestoreEmulator } from "firebase/firestore";

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "http://localhost", 8080);
}
