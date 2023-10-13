import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { SecurityService } from 'src/app/services/security/security.service';
import { ServerService } from 'src/app/services/server/server.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { INotification } from 'src/app/interfaces';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {

  content: any;
  notification: INotification;

  wallet: any;
  walletId: string;
  paymentList: any[] = [];
  previousBalance: any;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private navigation: NavigationService,
    private security: SecurityService,
    private server: ServerService,
    private utils: UtilsService,
  ) {
    this.walletId = this.route.snapshot.params['id'];

    this.content = this.data.get();
    this.notification = this.utils.getGenericNotification;
    
    const completeRoute = this.route.snapshot?.routeConfig?.path;
    this.navigation.addLocation({
      name: this.content.modules.finances.paymentDetail,
      url: `/${completeRoute}`
    });
  }

  ngOnInit(): void {
    const date = new Date();
    const data = {
      year: date.getFullYear(),
      month: date.getMonth(),
    }
    this.getPaymentList(data);
  }

  getPaymentList(data: any) {
    
    this.server.post(`/api/finances/wallet/${this.walletId}/payments`, data)
      .subscribe({ next: (response) => {
        const { token, data } = response;
        const { wallet, paymentList, previousBalance } = this.security.decryptResponse(token as string, data as string);
        this.wallet = wallet;
        this.paymentList = paymentList;
        this.previousBalance = previousBalance;
      }, error: ({ error }) => {
        this.notification.httpCode = error.httpCode;
        this.notification.internalCode = error.internalCode;
        this.notification.message = error.userMessage;
        this.utils.turnOnModal('notification');
      }});
  }

}
