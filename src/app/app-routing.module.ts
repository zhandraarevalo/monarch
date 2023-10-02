import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisitorGuard } from './guards/visitor/visitor.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { PermissionGuard } from './guards/permission/permission.guard';

import { SignInComponent } from './views/sign-in/sign-in.component';
import { AuthComponent } from './views/auth/auth.component';
  import { FinancesComponent } from './views/auth/finances/finances.component';

const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [VisitorGuard],
  },
  {
    path: '',
    component: AuthComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path:'finances',
        component: FinancesComponent,
        canActivate: [PermissionGuard],
      },
      {
        path: '**',
        redirectTo: 'finances',
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'sign-in'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
