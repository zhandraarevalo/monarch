import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data/data.service';
import { SecurityService } from 'src/app/services/security/security.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { ServerService } from 'src/app/services/server/server.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { INotification } from 'src/app/interfaces';

@Component({
  selector: 'app-transaction-payment',
  templateUrl: './transaction-payment.component.html',
  styleUrls: ['./transaction-payment.component.scss']
})
export class TransactionPaymentComponent implements OnInit {

  content: any;
  catalogue: any;
  completeRoute: string | undefined;
  notification: INotification;

  groupList: any[] = [];
  categoryList: any[] = [];
  groupCategoryList: any[] = [];

  accountList: any[] = [];
  walletList: any[] = [];
  accountWalletList: any[][] = [];

  transactionForm: FormGroup = this.fb.group({});
  paymentsArray: FormArray = this.fb.array([]);

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
      name: this.content.modules.finances.transactionPayment,
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
      payments: this.paymentsArray,
    });
    this.addPayment();
  }

  addPayment() {
    this.paymentsArray.push(this.fb.group({
      account: [null, Validators.required],
      wallet: [null, Validators.required],
      type: [null, Validators.required],
      amount: [null, Validators.required],
    }));
    this.accountWalletList.push([]);
  }

  removePayment(i: number) {
    if (this.paymentsArray.controls.length > 1) {
      this.paymentsArray.removeAt(i);
      this.accountWalletList.splice(i, 1);
    }
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

  selectAccount(i: number) {
    const accountId = parseInt(this.paymentsArray.value[i].account);
    this.accountWalletList[i] = this.walletList.filter((item: any) => item.account.id === accountId);
  }

  execute() {
    const formValue = this.transactionForm.value;
    const requestData = {
      date: formValue.date,
      type: 'payment',
      category: parseInt(formValue.category),
      payments: formValue.payments.map((item: any) => {
        return {
          type: item.type,
          amount: Math.trunc(item.amount * 100),
          wallet: parseInt(item.wallet),
        }
      }),
    }

    this.server.post('/api/finances/transaction/payment', requestData)
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
