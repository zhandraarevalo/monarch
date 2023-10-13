import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from 'src/app/services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(
    private router: Router,
    private session: SessionService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const activeRoute = route.routeConfig?.path?.split('/')[0];
    const activeModules = this.session.getCatalogue.modules.filter((item: any) => item.active).map((item: any) => item.route);
    if (!activeModules.includes(activeRoute)) {
      this.router.navigate(['']);
    }
    return true;
  }
  
}
