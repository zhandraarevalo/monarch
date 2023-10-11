import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  urlServer: string = 'https://server.zhandraarevalo.com';
  sessionKey: string = 'ASVSDF$4fasce34rvdfc34fvxvD';

  constructor() { }

  get getUrlServer() {
    return this.urlServer;
  }

  get getSessionKey() {
    return this.sessionKey;
  }

}
