import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from 'src/app/services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class VisitorGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private session: SessionService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.session.get) {
      this.router.navigate(['']);
    }

    return true;
  }
  
}
