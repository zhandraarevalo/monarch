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
  selector: 'app-finances',
  templateUrl: './finances.component.html',
  styleUrls: ['./finances.component.scss']
})
export class FinancesComponent implements OnInit {
  
  catalogue: any;
  content: any;
  activeModule: any;
  mainCurrency: any;
  notification: INotification;

  boxBudget: any;
  boxTotal: any;

  walletList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private navigation: NavigationService,
    private security: SecurityService,
    private server: ServerService,
    private session: SessionService,
    private utils: UtilsService,
  ) {
    this.content = this.data.get();
    this.catalogue = this.session.getCatalogue;
    this.mainCurrency = this.catalogue.mainCurrency;
    this.notification = this.utils.getGenericNotification;

    const activeRoute = this.route.snapshot?.routeConfig?.path;
    this.activeModule = this.catalogue.modules.find((item: any) => {
      return item.route === activeRoute;
    });
    
    this.navigation.set([{
      name: this.content.modules[this.activeModule.tag].title,
      url: `/${activeRoute}`
    }]);
  }

  ngOnInit(): void {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const data = { year, month };
    this.getBankStatement(data);
    this.getBoxBudget(data);
    this.getBoxTotal(data);
  }

  getBankStatement(data: any) {
    this.server.post('/api/finances/dashboard/account-statement', data)
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { walletList } = this.security.decryptResponse(token as string, data as string);
      this.walletList = walletList;
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  getBoxBudget(data: any) {
    this.server.post('/api/finances/dashboard/box-budget', data)
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { boxBudget } = this.security.decryptResponse(token as string, data as string);
      this.boxBudget = boxBudget;
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  getBoxTotal(data: any) {
    this.server.post('/api/finances/dashboard/box-total', data)
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { boxTotal } = this.security.decryptResponse(token as string, data as string);
      this.boxTotal = boxTotal;
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

}
