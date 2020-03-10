import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    constructor(public authService: AuthService, public router: Router) { }
    public regUserData: any = {};
    public otpVerified: boolean;
    ngOnInit() {
        this.authService.logOutUser();
    }

    regStudent() {
        this.authService.registerStudent(this.regUserData).subscribe(
            res => {
                console.log(res)
                // if(res.code == )
                if (res.token) {
                    localStorage.setItem('token', res.token)
                    this.router.navigate(['pdf']);
                    // this.router.navigate(['admission']);
                }
            }, err => {
                console.log(err)
            }
        )
    }

    genOtp() {
        this.otpVerified = false;
        console.log("----")
        if (this.regUserData.mobNum && this.regUserData.mobNum.length) {
            this.authService.genOtp({ mob: this.regUserData.mobNum }).subscribe(
                res => {
                    console.log(res);
                }
            )
        }
    }
}
