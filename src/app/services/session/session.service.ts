import { Injectable } from '@angular/core';
import { ConstantService } from '../constant/constant.service';
import { SecurityService } from '../security/security.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private constant: ConstantService,
    private security: SecurityService,
  ) { }

  set(session: string) {
    const encrypt = this.security.encryptWithCipher(this.constant.getSessionKey, session);
    localStorage.setItem('session', encrypt);
  }

  get get() {
    const encrypted = localStorage.getItem('session');

    if (encrypted) {
      const session = this.security.decryptWithCipher(this.constant.getSessionKey, encrypted);
      return session;
    }

    return null;
  }

  get getValue() {
    const encrypted = localStorage.getItem('session');

    if (encrypted) {
      const deciphered = this.security.decryptWithCipher(this.constant.getSessionKey, encrypted);
      const session = this.security.decryptWithCert(deciphered);
      return session || null;
    }

    return null;
  }

  finish() {
    localStorage.clear();
  }

  saveCatalogue(data: any) {
    let local = this.getCatalogue;
    local = Object.assign(local, data);
    const encrypted = this.security.encryptWithCipher(this.constant.getSessionKey, local);
    localStorage.setItem('catalogue', encrypted);
  }
  
  get getCatalogue() {
    const encrypted = localStorage.getItem('catalogue');
    return encrypted ? this.security.decryptWithCipher(this.constant.getSessionKey, encrypted) : {};
  }

}
