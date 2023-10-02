import cryptoRandomString from 'crypto-random-string';
import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { INotification } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private content: any;
  private genericNotification: INotification;

  constructor(
    private data: DataService,
  ) {
    this.content = this.data.get();
    this.genericNotification = {
      httpCode: 500,
      internalCode: 500,
      title: this.content.notificationStatus.error,
      message: this.content.notificationStatus.error,
      options: [
        {
          value: this.content.button.accept,
        }
      ]
    };
  }

  get getGenericNotification() {
    return this.genericNotification;
  }

  generateToken(size: number) {
    return cryptoRandomString({ length: size });
  }

  turnOnModal(id: string) {
    const element = document.getElementById(id) as HTMLElement;
    element.style.display = 'flex';
  }

  turnOffModal(id: string) {
    const element = document.getElementById(id) as HTMLElement;
    element.style.display = 'none';
  }

}
