import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NotificationComponent } from './complements/notification/notification.component';

import { SignInComponent } from './views/sign-in/sign-in.component';
import { AuthComponent } from './views/auth/auth.component';
import { SideBarComponent } from './complements/side-bar/side-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    SignInComponent,
    AuthComponent,
    SideBarComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
