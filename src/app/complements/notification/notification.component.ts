import { Component, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { INotification } from 'src/app/interfaces';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnChanges {

  @Input() notification: INotification;

  constructor(
    private router: Router,
    private session: SessionService,
    private utils: UtilsService,
  ) {
    this.notification = this.utils.getGenericNotification;
  }

  ngOnChanges(): void {
  }

  trunc(n: number) {
    return Math.trunc(n);
  }

  call(fn: any, route: string | undefined) {
    const internalCode = this.notification.internalCode;

    if (internalCode == 1003 || internalCode == 1004) {
      this.session.finish();
      this.router.navigate(['/sign-in'])
    }

    if (fn) {
      fn();
    }

    if (route) {
      this.router.navigate([route]);
    }

    this.close();
  }

  close() {
    this.utils.turnOffModal('notification');
  }

}
