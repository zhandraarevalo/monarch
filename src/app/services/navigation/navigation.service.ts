import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { INavigation } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router: Router,
  ) { }

  set(locations: INavigation[]) {
    sessionStorage.setItem('nav', JSON.stringify(locations));
  }

  get get(): INavigation[] {
    const locations = sessionStorage.getItem('nav');
    return locations ? JSON.parse(locations) : null;
  }

  addLocation(location: INavigation) {
    const locations = this.get;

    let index = null;
    const found = locations.find((v: INavigation, i: number) => {
      if (v.url === location.url) {
        index = i + 1;
        return true;
      }
      return false;
    });

    if (!found) {
      locations.push(location);
      this.set(locations);
    } else if (index && index < locations.length) {
      this.set(locations.slice(0, index));
    }
  }

  returnOne(route: string) {
    const locations = this.get;

    let index = null;
    const found = locations.find((v: INavigation, i: number) => {
      if (v.url === route) {
        index = i - 1;
        return true;
      }
      return false;
    });

    if (found && index) {
      this.router.navigate([locations[index].url]);
    }
  }

}
