import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantService } from '../constant/constant.service';
import { SecurityService } from '../security/security.service';
import { SessionService } from '../session/session.service';
import { IServerResponse } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(
    private http: HttpClient,
    private constant: ConstantService,
    private security: SecurityService,
    private session: SessionService,
  ) { }

  getHttpOptions() {
    const session = this.session.get;
    return session ? {
      headers: new HttpHeaders({
        'monarch-session': session,
      })
    } : {}
  }

  get(path: string) {
    return this.http.get<IServerResponse>(this.constant.getUrlServer + path, this.getHttpOptions());
  }

  post(path: string, data?: any) {
    const requestData = data ? this.security.encryptRequest(data) : {};
    return this.http.post<IServerResponse>(this.constant.getUrlServer + path, requestData, this.getHttpOptions());
  }

  put(path: string, data?: any) {
    const requestData = data ? this.security.encryptRequest(data) : {};
    return this.http.put<IServerResponse>(this.constant.getUrlServer + path, requestData, this.getHttpOptions());
  }

  delete(path: string) {
    return this.http.delete<IServerResponse>(this.constant.getUrlServer + path, this.getHttpOptions());
  }

}
