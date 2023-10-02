import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { SecurityService } from 'src/app/services/security/security.service';
import { ServerService } from 'src/app/services/server/server.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { INotification } from 'src/app/interfaces';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  content: any;
  notification: INotification;

  constructor(
    private router: Router,
    private data: DataService,
    private firebase: FirebaseService,
    private security: SecurityService,
    private server: ServerService,
    private session: SessionService,
    private utils: UtilsService,
  ) {
    this.content = this.data.get();
    this.notification = this.utils.getGenericNotification;
  }

  ngOnInit(): void {
  }

  async googleSignIn() {
    try {
      this.firebase.initializeApp();
      const userData = await this.firebase.getUserData();
      const requestData = {
        email: userData.email,
        googleId: userData.uid,
      };
      this.signIn(requestData);
    } catch (error: any) {
      console.log('Firebase Error:', error);
      this.notification.message = error.message;
      this.utils.turnOnModal('notification');
    }
  }

  signIn(requestData: any) {
    this.server.post('/api/auth/sign-in', requestData)
    .subscribe({ next: (response) => {
      const { token, data } = response;
      const { modules, sessionToken } = this.security.decryptResponse(token as string, data as string);
      this.session.saveCatalogue({ modules });
      this.session.set(sessionToken);
      this.router.navigate(['']);
    }, error: ({ error }) => {
      this.notification.httpCode = error.httpCode;
      this.notification.internalCode = error.internalCode;
      this.notification.message = error.userMessage;
      this.utils.turnOnModal('notification');
    }});
  }

}
