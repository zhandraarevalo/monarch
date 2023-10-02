import { Injectable } from '@angular/core';
import CryptoES from 'crypto-es';
import * as Forge from 'node-forge';
import { clientPrivate, serverPublic } from './certs';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private utils: UtilsService,
  ) { }

  encryptWithCipher(key: string, obj: any) {
    return CryptoES.AES.encrypt(JSON.stringify(obj), key).toString();
  }

  decryptWithCipher(key: string, encrypted: string) {
    const bytes = CryptoES.AES.decrypt(encrypted, key);
    return JSON.parse(bytes.toString(CryptoES.enc.Utf8));
  }

  encryptWithCert(data: any) {
    const key = Forge.pki.publicKeyFromPem(serverPublic);
    const encrypted = key.encrypt(JSON.stringify(data), 'RSA-OAEP');
    return Forge.util.encode64(encrypted);
  }

  decryptWithCert(encrypted: string) {
    const key = Forge.pki.privateKeyFromPem(clientPrivate);
    const decode = Forge.util.decode64(encrypted);
    return JSON.parse(key.decrypt(decode, 'RSA-OAEP'));
  }

  encryptRequest(obj: any) {
    const key = this.utils.generateToken(15);
    const data = this.encryptWithCipher(key, obj);
    const token = this.encryptWithCert(key);
    return { data, token };
  }

  decryptResponse(token: string, data: string) {
    const { key } = this.decryptWithCert(token);
    return this.decryptWithCipher(key, data);
  }
  
}
