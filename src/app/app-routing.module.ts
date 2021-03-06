import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdmissionComponent } from './components/admission/admission.component';
import { AuthGuard } from './components/auth.guard';
import { PdfViewComponent } from './components/pdf-view/pdf-view.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    // {
    //     path: 'admission/:animal',
    //     component: AdmissionComponent,
    //     canActivate: [AuthGuard]
    // },
    {
        path: '',
        component: PdfViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admission',
        component: AdmissionComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'pdf',
        component: PdfViewComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
