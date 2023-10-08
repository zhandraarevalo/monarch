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
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.scss']
})
export class GroupManagerComponent implements OnInit {

  private catalogue: any;
  content: any;
  activeModule: any;
  completeRoute: string | undefined;
  notification: INotification;
  
  title: string;
  groupId: string | undefined;
  groupForm: FormGroup = this.fb.group({});

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
    this.groupId = this.route.snapshot.params['id'];
    const action = this.groupId ? 'update' : 'create';

    this.content = this.data.get();
    this.catalogue = this.session.getCatalogue;
    this.notification = this.utils.getGenericNotification;

    this.completeRoute = this.route.snapshot?.routeConfig?.path;
    const activeRoute = this.completeRoute?.split('/')[0];
    this.activeModule = this.catalogue.modules.find((item: any) => {
      return item.route === activeRoute;
    });
    
    this.title = action === 'create' ? this.content.modules.finances.groupCreate : this.content.modules.finances.groupUpdate
    this.navigation.addLocation({
      name: this.title,
      url: `/${this.completeRoute}`
    });
  }

  ngOnInit(): void {
    this.buildForm();
    
    if (this.groupId) {
      this.server.get('/api/finances/group/'+this.groupId)
      .subscribe({ next: (response) => {
        const { token, data } = response;
        const { group } = this.security.decryptResponse(token as string, data as string);
        this.groupForm.controls['name'].setValue(group.name);
      }, error: ({ error }) => {
        this.notification.httpCode = error.httpCode;
        this.notification.internalCode = error.internalCode;
        this.notification.message = error.userMessage;
        this.utils.turnOnModal('notification');
      }});
    }
  }

  buildForm() {
    this.groupForm = this.fb.group({
      name: [null, Validators.required],
    });
  }

  execute() {
    if (this.groupId) {
      this.update(this.groupForm.value);
    } else {
      this.create(this.groupForm.value);
    }
  }

  create(requestData: any) {
    this.server.post('/api/finances/group', requestData)
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
    this.server.put('/api/finances/group/'+this.groupId, requestData)
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
