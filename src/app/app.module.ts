import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavigationComponent } from './complements/navigation/navigation.component';
import { NotificationComponent } from './complements/notification/notification.component';
import { SideBarComponent } from './complements/side-bar/side-bar.component';

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
    import { PaymentDetailComponent } from './views/auth/payment-detail/payment-detail.component';
    import { TransactionDetailComponent } from './views/auth/transaction-detail/transaction-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    // complements
    NavigationComponent,
    NotificationComponent,
    SideBarComponent,
    // views
    SignInComponent,
    AuthComponent,
      FinancesComponent,
        FinancesSettingsComponent,
          AccountManagerComponent,
          WalletManagerComponent,
          GroupManagerComponent,
          CategoryManagerComponent,
        BudgetManagerComponent,
        TransactionPaymentComponent,
        TransactionTransferComponent,
        PaymentDetailComponent,
        TransactionDetailComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
