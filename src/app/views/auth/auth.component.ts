import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security/security.service';
import { ServerService } from 'src/app/services/server/server.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { INotification } from 'src/app/interfaces';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  private catalogue: any;
  
  notification: INotification;

  constructor(
    private security: SecurityService,
    private server: ServerService,
    private session: SessionService,
    private utils: UtilsService,
  ) {
    this.notification = this.utils.getGenericNotification;
    this.catalogue = this.session.getCatalogue;
    this.catalogueData();
  }

  ngOnInit(): void {
  }

  catalogueData() {
    if (!this.catalogue.walletTypeList) {
      this.getWalletTypeCatalogue();
    }
    if (!this.catalogue.categoryTypeList) {
      this.getCategoryTypeCatalogue();
    }
    if (!this.catalogue.transactionTypeList) {
      this.getTransactionTypeCatalogue();
    }
    if (!this.catalogue.paymentTypeList) {
      this.getPaymentTypeCatalogue();
    }
  }

  getWalletTypeCatalogue() {
    this.server.get('/api/catalogue/wallet_type')
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { list: walletTypeList } = this.security.decryptResponse(token as string, data as string);
      this.session.saveCatalogue({ walletTypeList });
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  getCategoryTypeCatalogue() {
    this.server.get('/api/catalogue/category_type')
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { list: categoryTypeList } = this.security.decryptResponse(token as string, data as string);
      this.session.saveCatalogue({ categoryTypeList });
    }, error: ({ error }) => {
     this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  getTransactionTypeCatalogue() {
    this.server.get('/api/catalogue/transaction_type')
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { list: transactionTypeList } = this.security.decryptResponse(token as string, data as string);
      this.session.saveCatalogue({ transactionTypeList });
    }, error: ({ error }) => {
     this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  getPaymentTypeCatalogue() {
    this.server.get('/api/catalogue/payment_type')
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { list: paymentTypeList } = this.security.decryptResponse(token as string, data as string);
      this.session.saveCatalogue({ paymentTypeList });
    }, error: ({ error }) => {
     this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

}
