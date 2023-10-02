import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() { }

  initializeApp() {
    const firebaseConfig = {
      apiKey: "AIzaSyBWRZkBuc5KCMozdNEls6tuuqRMcEP9Rto",
      authDomain: "monarch-cms.firebaseapp.com",
      projectId: "monarch-cms",
      storageBucket: "monarch-cms.appspot.com",
      messagingSenderId: "562244843531",
      appId: "1:562244843531:web:614a7b4ab14911e1d02f0e"
    };

    return initializeApp(firebaseConfig);
  }

  async getUserData() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      auth.languageCode = 'en';

      const response = await signInWithPopup(auth, provider);
      return response.user.providerData[0];
    } catch (error) {
      throw error;
    }
  }

}
