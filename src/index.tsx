import ReactDOM from "react-dom/client";
import App from "./App";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { RecoilRoot } from "recoil";

//파이어 베이스 설정
const firebaseConfig = {
  apiKey: process.env.FIRE_BASE_API_KEY,
  authDomain: process.env.FIRE_BASE_AUTH_DOMAIN,
  projectId: process.env.FIRE_BASE_PROJECT_ID,
  storageBucket: process.env.FIRE_BASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIRE_BASE_MESSAGING_SENDER_ID,
  appId: process.env.FIRE_BASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
