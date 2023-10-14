import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { SecurityService } from 'src/app/services/security/security.service';
import { ServerService } from 'src/app/services/server/server.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { INotification } from 'src/app/interfaces';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {

  content: any;
  catalogue: any;
  mainCurrency: any;
  notification: INotification;

  category: any;
  categoryId: string;
  transactionList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private navigation: NavigationService,
    private security: SecurityService,
    private server: ServerService,
    private session: SessionService,
    private utils: UtilsService,
  ) {
    this.categoryId = this.route.snapshot.params['id'];
    this.catalogue = this.session.getCatalogue;
    this.mainCurrency = this.catalogue.mainCurrency;

    this.content = this.data.get();
    this.notification = this.utils.getGenericNotification;
    
    const completeRoute = this.route.snapshot?.routeConfig?.path;
    this.navigation.addLocation({
      name: this.content.modules.finances.transactionDetail,
      url: `/${completeRoute}`
    });
  }

  ngOnInit(): void {
    const date = new Date();
    const data = {
      year: date.getFullYear(),
      month: date.getMonth(),
    }
    this.getTransactionList(data);
  }

  getTransactionList(data: any) {
    this.server.post(`/api/finances/category/${this.categoryId}/transactions`, data)
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { category, transactionList } = this.security.decryptResponse(token as string, data as string);
      this.category = category;
      this.transactionList = transactionList;
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

}
