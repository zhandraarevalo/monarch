import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data/data.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { SecurityService } from 'src/app/services/security/security.service';
import { ServerService } from 'src/app/services/server/server.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { INotification } from 'src/app/interfaces';

@Component({
  selector: 'app-budget-manager',
  templateUrl: './budget-manager.component.html',
  styleUrls: ['./budget-manager.component.scss']
})
export class BudgetManagerComponent implements OnInit {

  content: any;
  catalogue: any;
  currentRoute: any;

  mainCurrency: any;
  typeList: any[] = [];
  groupList: any[] = [];

  notification: INotification;
  
  categoryList: any[] = [];
  categoryForm: FormGroup = this.fb.group({});
  budgetArray: FormArray = this.fb.array([]);

  totalAmount: number = 0;
  currentTotalAmount: number = 0;

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
    this.mainCurrency = this.catalogue.mainCurrency;
    this.notification = this.utils.getGenericNotification;
    this.typeList = this.catalogue.categoryTypeList;

    this.currentRoute = this.route.snapshot?.routeConfig?.path;
    
    this.navigation.addLocation({
      name: this.content.modules.finances.budget,
      url: `/${this.currentRoute}`
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.getCategoryList();
    this.getGroupList();
  }

  buildForm() {
    this.categoryForm = this.fb.group({
      budget: this.budgetArray,
    });
  }

  addBudget(item?: any) {
    this.budgetArray.push(this.fb.group({
      id: [item?.id || null],
      group: [item?.group?.id || null, Validators.required],
      name: [item?.name || null, Validators.required],
      type: [item?.type || null, Validators.required],
      accumulates: [item?.accumulates ? Boolean(item.accumulates) : false, Validators.required],
      amount: [item?.budget?.amount / 100 || null, Validators.required]
    }));
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
      this.setFormValues();
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

  setFormValues() {
    for (const item of this.categoryList) {
      this.addBudget(item);
      this.currentTotalAmount += item.type === 'income' ? item.budget.amount : -item.budget.amount;
    }
    this.totalAmount = this.getTotal();
  }

  getTotal() {
    let total = 0;
    for (const item of this.categoryForm.value.budget) {
      total += (item.type === 'income' ? item.amount : -item.amount) * 100;
    }
    return total;
  }

  changeAmount() {
    this.totalAmount = this.getTotal();
  }

  execute() {
    const formValue = this.categoryForm.value;
    const budget = [];

    for (const item of formValue.budget) {
      budget.push({
        id: item.id ? parseInt(item.id) : null,
        group: parseInt(item.group),
        name: item.name,
        type: item.type,
        accumulates: item.accumulates,
        amount: Math.trunc(item.amount * 100),
      });
    }

    this.server.post('/api/finances/category/budget', { budget })
    .subscribe({ next: () => {
      this.navigation.returnOne(`/${this.currentRoute}`);
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

}
