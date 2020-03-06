import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private router: Router, private authService: AuthService) { }
    public logUserData: any = {};
    ngOnInit() {
        this.authService.logOutUser();
        console.log("login component");
    }
    logUser() {
        this.authService.loginStudent(this.logUserData).subscribe(
            res => {
                console.log(res)
                localStorage.setItem('token', res.token);
                this.router.navigate(['admission']);
            }, err => {
                console.log(err)
            }
        )
    }

    redirectToReg() {
        this.router.navigate(['register']);
    }
}
