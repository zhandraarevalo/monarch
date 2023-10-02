import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { ServerService } from 'src/app/services/server/server.service';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  content: any;
  topItems: any[] = [];
  bottomItems: any[] = [];

  constructor(
    private router: Router,
    private data: DataService,
    private server: ServerService,
    private session: SessionService,
  ) {
    this.content = this.data.get();
    this.topItems = this.session.getCatalogue.modules.filter((item: any) => item.sequence > 0 && item.active);
    this.bottomItems = this.session.getCatalogue.modules.filter((item: any) => item.sequence < 0 && item.active);
  }

  ngOnInit(): void {
  }

  signOut() {
    this.server.get('/api/auth/sign-out').subscribe();
    this.session.finish();
    this.router.navigate(['/sign-in']);
  }

}
