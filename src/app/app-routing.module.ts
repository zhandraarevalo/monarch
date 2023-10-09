import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisitorGuard } from './guards/visitor/visitor.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { PermissionGuard } from './guards/permission/permission.guard';

import { SignInComponent } from './views/sign-in/sign-in.component';
import { AuthComponent } from './views/auth/auth.component';
  import { FinancesComponent } from './views/auth/finances/finances.component';
    import { FinancesSettingsComponent } from './views/auth/finances-settings/finances-settings.component';
      import { AccountManagerComponent } from './views/auth/account-manager/account-manager.component';
      import { WalletManagerComponent } from './views/auth/wallet-manager/wallet-manager.component';
      import { GroupManagerComponent } from './views/auth/group-manager/group-manager.component';
      import { CategoryManagerComponent } from './views/auth/category-manager/category-manager.component';
    import { BudgetManagerComponent } from './views/auth/budget-manager/budget-manager.component';
    import { TransactionPaymentComponent } from './views/auth/transaction-payment/transaction-payment.component';
    import { TransactionTransferComponent } from './views/auth/transaction-transfer/transaction-transfer.component';

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
          path:'finances/settings',
          component: FinancesSettingsComponent,
          canActivate: [PermissionGuard],
        },
          {
            path:'finances/settings/account',
            component: AccountManagerComponent,
            canActivate: [PermissionGuard],
          },
          {
            path:'finances/settings/account/:id',
            component: AccountManagerComponent,
            canActivate: [PermissionGuard],
          },
          {
            path:'finances/settings/wallet',
            component: WalletManagerComponent,
            canActivate: [PermissionGuard],
          },
          {
            path:'finances/settings/wallet/:id',
            component: WalletManagerComponent,
            canActivate: [PermissionGuard],
          },
          {
            path:'finances/settings/group',
            component: GroupManagerComponent,
            canActivate: [PermissionGuard],
          },
          {
            path:'finances/settings/group/:id',
            component: GroupManagerComponent,
            canActivate: [PermissionGuard],
          },
          {
            path:'finances/settings/category',
            component: CategoryManagerComponent,
            canActivate: [PermissionGuard],
          },
          {
            path:'finances/settings/category/:id',
            component: CategoryManagerComponent,
            canActivate: [PermissionGuard],
          },
        {
          path:'finances/budget',
          component: BudgetManagerComponent,
          canActivate: [PermissionGuard],
        },
        {
          path:'finances/transaction/payment',
          component: TransactionPaymentComponent,
          canActivate: [PermissionGuard],
        },
        {
          path:'finances/transaction/transfer',
          component: TransactionTransferComponent,
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
