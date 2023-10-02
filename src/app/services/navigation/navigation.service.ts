import { Injectable } from '@angular/core';
import { INavigation } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() { }

  set(navs: INavigation[]) {
    sessionStorage.setItem('nav', JSON.stringify(navs));
  }

  get get(): INavigation[] {
    const navs = sessionStorage.getItem('nav');
    return navs ? JSON.parse(navs) : null;
  }

  addNav(nav: INavigation) {
    const navs = this.get;
    const found = navs.find((v: INavigation) => v.url === nav.url);

    if (!found) {
      navs.push(nav);
      this.set(navs);
    }
  }

  goTo(nav: INavigation) {
    const navs = this.get;

    if (navs) {
      let index = 0;
      const found = navs.find((v: INavigation, i: number) => {
        if (v.url === nav.url) {
          index = i;
          return true;
        }
        return false;
      });

      if (found) {
        const remove = navs.length - (index + 1);
        navs.splice(index, remove);
        this.set(navs);
      }
    } 
  }

}
