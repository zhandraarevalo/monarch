import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data/data.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { SecurityService } from 'src/app/services/security/security.service';
import { ServerService } from 'src/app/services/server/server.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { INotification } from 'src/app/interfaces';

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit {

  private catalogue: any;
  content: any;
  activeModule: any;
  completeRoute: string | undefined;
  notification: INotification;
  
  action: string;
  title: string;
  accountId: string | undefined;
  accountForm: FormGroup = this.fb.group({});

  currencyList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private data: DataService,
    private navigation: NavigationService,
    private security: SecurityService,
    private server: ServerService,
    private session: SessionService,
    private utils: UtilsService,
  ) {
    this.accountId = this.route.snapshot.params['id'];
    this.action = this.accountId ? 'update' : 'create';

    this.content = this.data.get();
    this.catalogue = this.session.getCatalogue;
    this.notification = this.utils.getGenericNotification;

    this.completeRoute = this.route.snapshot?.routeConfig?.path;
    const activeRoute = this.completeRoute?.split('/')[0];
    this.activeModule = this.catalogue.modules.find((item: any) => {
      return item.route === activeRoute;
    });
    
    this.title = this.action === 'create' ? this.content.modules.finances.accountCreate : this.content.modules.finances.accountUpdate
    this.navigation.addLocation({
      name: this.title,
      url: `/${this.completeRoute}`
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.getCurrencyList();
    
    if (this.accountId) {
      this.server.get('/api/finances/account/'+this.accountId)
      .subscribe({ next: (response) => {
        const { token, data } = response;
        const { account } = this.security.decryptResponse(token as string, data as string);
        this.accountForm.controls['name'].setValue(account.name);
        this.accountForm.controls['currency'].setValue(account.currency.id);
      }, error: ({ error }) => {
        this.notification.httpCode = error.httpCode;
        this.notification.internalCode = error.internalCode;
        this.notification.message = error.userMessage;
        this.utils.turnOnModal('notification');
      }});
    }
  }

  buildForm() {
    this.accountForm = this.fb.group({
      name: [null, Validators.required],
      currency: [null, Validators.required],
    });
  }

  getCurrencyList() {
    this.server.get('/api/finances/currency')
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { currencyList } = this.security.decryptResponse(token as string, data as string);
      this.currencyList = currencyList.filter((item: any) => item.active);
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  execute() {
    const requestData: any = {
      name: this.accountForm.value.name,
      currency: parseInt(this.accountForm.value.currency),
    }

    if (this.accountId) {
      this.update(requestData);
    } else {
      this.create(requestData);
    }
  }

  create(requestData: any) {
    this.server.post('/api/finances/account', requestData)
    .subscribe({ next: () => {
      this.navigation.returnOne(`/${this.completeRoute}`);
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  update(requestData: any) {
    this.server.put('/api/finances/account/'+this.accountId, requestData)
    .subscribe({ next: () => {
      this.navigation.returnOne(`/${this.completeRoute}`);
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

}
