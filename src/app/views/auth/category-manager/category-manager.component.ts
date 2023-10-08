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
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss']
})
export class CategoryManagerComponent implements OnInit {

  private catalogue: any;
  content: any;
  activeModule: any;
  completeRoute: string | undefined;
  notification: INotification;
  
  title: string;
  categoryId: string | undefined;
  categoryForm: FormGroup = this.fb.group({});

  groupList: any[] = [];
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
    this.categoryId = this.route.snapshot.params['id'];
    const action = this.categoryId ? 'update' : 'create';

    this.content = this.data.get();
    this.catalogue = this.session.getCatalogue;
    this.notification = this.utils.getGenericNotification;

    this.completeRoute = this.route.snapshot?.routeConfig?.path;
    const activeRoute = this.completeRoute?.split('/')[0];
    this.activeModule = this.catalogue.modules.find((item: any) => {
      return item.route === activeRoute;
    });
    this.typeList = this.catalogue.categoryTypeList;
    
    this.title = action === 'create' ? this.content.modules.finances.categoryCreate : this.content.modules.finances.categoryUpdate
    this.navigation.addLocation({
      name: this.title,
      url: `/${this.completeRoute}`
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.getGroupList();
    
    if (this.categoryId) {
      this.server.get('/api/finances/category/'+this.categoryId)
      .subscribe({ next: (response) => {
        const { token, data } = response;
        const { category } = this.security.decryptResponse(token as string, data as string);
        this.categoryForm.controls['group'].setValue(category.group.id);
        this.categoryForm.controls['type'].setValue(category.type);
        this.categoryForm.controls['name'].setValue(category.name);
        this.categoryForm.controls['budget'].setValue(category.budget.amount / 100);
        this.categoryForm.controls['accumulates'].setValue(Boolean(category.accumulates));
      }, error: ({ error }) => {
        this.notification.httpCode = error.httpCode;
        this.notification.internalCode = error.internalCode;
        this.notification.message = error.userMessage;
        this.utils.turnOnModal('notification');
      }});
    }
  }

  buildForm() {
    this.categoryForm = this.fb.group({
      group: [null, Validators.required],
      type: [null, Validators.required],
      name: [null, Validators.required],
      budget: [null, Validators.required],
      accumulates: [false, Validators.required],
    });
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

  execute() {
    const requestData: any = {
      group: parseInt(this.categoryForm.value.group),
      type: this.categoryForm.value.type,
      name: this.categoryForm.value.name,
      accumulates: this.categoryForm.value.accumulates,
      budget: Math.trunc(this.categoryForm.value.budget * 100),
    }

    if (this.categoryId) {
      this.update(requestData);
    } else {
      this.create(requestData);
    }
  }

  create(requestData: any) {
    this.server.post('/api/finances/category', requestData)
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
    this.server.put('/api/finances/category/'+this.categoryId, requestData)
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
