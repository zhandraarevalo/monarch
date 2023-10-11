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
  selector: 'app-wallet-manager',
  templateUrl: './wallet-manager.component.html',
  styleUrls: ['./wallet-manager.component.scss']
})
export class WalletManagerComponent implements OnInit {

  private catalogue: any;
  content: any;
  activeModule: any;
  completeRoute: string | undefined;
  notification: INotification;
  
  title: string;
  wallet: any;
  walletId: string | undefined;
  walletForm: FormGroup = this.fb.group({});

  accountList: any[] = [];
  typeList: any[] = [];

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
    this.walletId = this.route.snapshot.params['id'];
    const action = this.walletId ? 'update' : 'create';

    this.content = this.data.get();
    this.catalogue = this.session.getCatalogue;
    this.notification = this.utils.getGenericNotification;

    this.completeRoute = this.route.snapshot?.routeConfig?.path;
    const activeRoute = this.completeRoute?.split('/')[0];
    this.activeModule = this.catalogue.modules.find((item: any) => {
      return item.route === activeRoute;
    });
    this.typeList = this.catalogue.walletTypeList;
    
    this.title = action === 'create' ? this.content.modules.finances.walletCreate : this.content.modules.finances.walletUpdate
    this.navigation.addLocation({
      name: this.title,
      url: `/${this.completeRoute}`
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.getAccountList();
    
    if (this.walletId) {
      this.server.get('/api/finances/wallet/'+this.walletId)
      .subscribe({ next: (response) => {
        const { token, data } = response;
        const { wallet } = this.security.decryptResponse(token as string, data as string);
        this.walletForm.controls['account'].setValue(wallet.account.id);
        this.walletForm.controls['type'].setValue(wallet.type);
        this.walletForm.controls['name'].setValue(wallet.name);
        this.walletForm.controls['balance'].setValue(wallet.balance / 100);
        this.walletForm.controls['balance'].disable();
        this.wallet = wallet;
      }, error: ({ error }) => {
        this.notification.httpCode = error.httpCode;
        this.notification.internalCode = error.internalCode;
        this.notification.message = error.userMessage;
        this.utils.turnOnModal('notification');
      }});
    }
  }

  buildForm() {
    this.walletForm = this.fb.group({
      account: [null, Validators.required],
      type: [null, Validators.required],
      name: [null, Validators.required],
      balance: [null, Validators.required],
    });
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

  execute() {
    const requestData: any = {
      account: parseInt(this.walletForm.value.account),
      type: this.walletForm.value.type,
      name: this.walletForm.value.name,
      balance: Math.trunc(this.walletForm.value.balance * 100),
    }

    if (this.walletId) {
      this.update(requestData);
    } else {
      this.create(requestData);
    }
  }

  create(requestData: any) {
    this.server.post('/api/finances/wallet', requestData)
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
    requestData.balance = this.wallet.balance;
    this.server.put('/api/finances/wallet/'+this.walletId, requestData)
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
