import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data/data.service';
import { SecurityService } from 'src/app/services/security/security.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { ServerService } from 'src/app/services/server/server.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { INotification } from 'src/app/interfaces';

@Component({
  selector: 'app-transaction-transfer',
  templateUrl: './transaction-transfer.component.html',
  styleUrls: ['./transaction-transfer.component.scss']
})
export class TransactionTransferComponent implements OnInit {

  content: any;
  catalogue: any;
  completeRoute: string | undefined;
  notification: INotification;

  groupList: any[] = [];
  categoryList: any[] = [];
  groupCategoryList: any[] = [];

  accountList: any[] = [];
  walletList: any[] = [];
  entryWalletList: any[] = [];
  exitWalletList: any[] = [];

  transactionForm: FormGroup = this.fb.group({});

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
    this.content = this.data.get();
    this.catalogue = this.session.getCatalogue;
    this.notification = this.utils.getGenericNotification;
    
    this.completeRoute = this.route.snapshot?.routeConfig?.path;
    this.navigation.addLocation({
      name: this.content.modules.finances.transactionTransfer,
      url: `/${this.completeRoute}`
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.getAccountList();
    this.getWalletList();
    this.getGroupList();
    this.getCategoryList();
  }

  buildForm() {
    this.transactionForm = this.fb.group({
      date: [null, Validators.required],
      group: [null, Validators.required],
      category: [null, Validators.required],
      amount: [null, Validators.required],
      entryAccount: [null, Validators.required],
      entryWallet: [null, Validators.required],
      exitAccount: [null, Validators.required],
      exitWallet: [null, Validators.required],
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

  selectGroup() {
    const groupId = parseInt(this.transactionForm.value.group);
    this.groupCategoryList = this.categoryList.filter((item: any) => item.group.id === groupId);
  }

  selectAccount(type: string) {
    const accountId = parseInt(this.transactionForm.value[`${type}Account`]);
    if (type === 'entry') {
      this.entryWalletList = this.walletList.filter((item: any) => item.account.id === accountId);
    } else if (type === 'exit') {
      this.exitWalletList = this.walletList.filter((item: any) => item.account.id === accountId);
    }
  }

  execute() {
    const formValue = this.transactionForm.value;
    const requestData = {
      date: formValue.date,
      type: 'transfer',
      category: parseInt(formValue.category),
      amount: Math.trunc(formValue.amount * 100),
      entryWallet: parseInt(formValue.entryWallet),
      exitWallet: parseInt(formValue.exitWallet),
    }
    console.log(requestData);

    this.server.post('/api/finances/transaction/transfer', requestData)
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
