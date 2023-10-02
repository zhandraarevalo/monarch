import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-finances',
  templateUrl: './finances.component.html',
  styleUrls: ['./finances.component.scss']
})
export class FinancesComponent implements OnInit {
  
  private catalogue: any;
  content: any;
  activeModule: any;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private navigation: NavigationService,
    private session: SessionService,
  ) {
    this.content = this.data.get();
    this.catalogue = this.session.getCatalogue;

    const activeRoute = this.route.snapshot?.routeConfig?.path;
    this.activeModule = this.catalogue.modules.find((item: any) => {
      return item.route === activeRoute;
    });
    
    this.navigation.set([{
      name: this.content.modules[this.activeModule.tag].title,
      url: `/${activeRoute}`
    }]);
  }

  ngOnInit(): void {
  }

}
