import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdmissionComponent } from './components/admission/admission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './components/auth.service';
import { AuthGuard } from './components/auth.guard';
import { TokenInterceptorService } from './components/token-interceptor.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PopupComponent } from './components/popup/popup.component';
import { FileUploadModule } from "ng2-file-upload";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HeaderComponent,
        FooterComponent,
        AdmissionComponent,
        PopupComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FileUploadModule
    ],
    providers: [AuthService, AuthGuard, {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptorService,
        multi: true
    }, {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        }],
    bootstrap: [AppComponent],
    entryComponents: [
        PopupComponent
    ]
})
export class AppModule { }
