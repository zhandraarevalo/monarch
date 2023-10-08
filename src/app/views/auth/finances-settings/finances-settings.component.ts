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
  selector: 'app-finances-settings',
  templateUrl: './finances-settings.component.html',
  styleUrls: ['./finances-settings.component.scss']
})
export class FinancesSettingsComponent implements OnInit {
  
  private catalogue: any;
  content: any;
  activeModule: any;
  notification: INotification;

  currencyList: any[] = [];
  accountList: any[] = [];
  walletList: any[] = [];
  groupList: any[] = [];
  categoryList: any[] = [];

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
    this.notification = this.utils.getGenericNotification;

    const completeRoute = this.route.snapshot?.routeConfig?.path;
    const activeRoute = completeRoute?.split('/')[0];
    this.activeModule = this.catalogue.modules.find((item: any) => {
      return item.route === activeRoute;
    });
    
    this.navigation.addLocation({
      name: this.content.modules.finances.settings,
      url: `/${completeRoute}`
    });
  }

  ngOnInit(): void {
    this.getCurrencyList();
    this.getAccountList();
    this.getWalletList();
    this.getGroupList();
    this.getCategoryList();
  }

  getCurrencyList() {
    this.server.get('/api/finances/currency')
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { currencyList } = this.security.decryptResponse(token as string, data as string);
      this.currencyList = currencyList;
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  getAccountList() {
    this.server.get('/api/finances/account')
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { accountList } = this.security.decryptResponse(token as string, data as string);
      this.accountList = accountList;
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  getWalletList() {
    this.server.get('/api/finances/wallet')
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

  getGroupList() {
    this.server.get('/api/finances/group')
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { groupList } = this.security.decryptResponse(token as string, data as string);
      this.groupList = groupList;
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  getCategoryList() {
    this.server.get('/api/finances/category')
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { categoryList } = this.security.decryptResponse(token as string, data as string);
      this.categoryList = categoryList;
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

}
