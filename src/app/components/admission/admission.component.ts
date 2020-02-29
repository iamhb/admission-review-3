import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { Observable, Subscriber } from 'rxjs';

@Component({
    selector: 'app-admission',
    templateUrl: './admission.component.html',
    styleUrls: ['./admission.component.css']
})
export class AdmissionComponent implements OnInit {

    constructor(public dialog: MatDialog, public http: HttpClient, public router: Router, public activatedRoute: ActivatedRoute, public authService: AuthService) { }

    public finalised: boolean = false;
    public test$;
    ngOnInit() {
        console.log("---on init-");
        // route poc
        // this.activatedRoute.paramMap.subscribe(params => {
        //     this.value = params.get("animal");
        //     console.log("-----durrrr");
        //     console.log(this.value);
        // });
        this.getStudDetails();
    }

    value: any = undefined;
    stud: any = {
        twelve: {},
        lateral: {
            sem1: {},
            sem2: {},
            sem3: {},
            sem4: {},
            sem5: {},
            sem6: {},
        }
    };
    gender: string;
    fname: string;
    test = "test"
    isPrmntAdrs: Boolean = false;

    getStudDetails() {
        this.authService.getStudentAdmission().subscribe(
            res => {
                console.log("res")
                if (res.docs != null) {
                    this.stud = res.docs
                    if (this.stud.status == "F") {
                        this.finalised = true;
                    }
                }
                // this.submitForm(null);
            }, err => {
                console.log("err")
                console.log(err)
                if (err.error && err.error.code && err.error.code === "TokenExpiredError") {
                    alert("Session Expired");
                    this.authService.logOutUser();
                    this.logOut();
                }
            }
        )
    }

    setUndefined() {
        this.stud.twelve = false
        if (!this.stud.twelve) {
            this.stud.twelve = {}
        }
    }

    showAlertMsg(header: string, alertMessage: string, warning: boolean, confirmation: boolean) {
        let dialogRef = this.dialog.open(PopupComponent, {
            width: "42%",
            disableClose: true,
            height: "28%",
            data: {
                headerMsg: header,
                message: alertMessage,
                isConfirmation: confirmation,
                isWarning: warning,
            }
        });
        return dialogRef.afterClosed();
    }

    // save and finalise button click
    submitForm(status: string): void {

        console.log("submit button clicked....", status);
        if (!this.stud.isPrmntAdrs) {
            this.stud.prmntAdrs = undefined;
        }

        if (status) {
            console.log('finalise')
            this.stud.status = "F";
        }

        if (!this.finalised) {
            console.log(this.stud);
            this.authService.doAdmission(this.stud).subscribe(
                res => {
                    this.showAlertMsg("Success", "Saved Successfully", true, false).subscribe();
                    console.log(res)
                    this.stud = res;
                    this.getStudDetails();
                    this.setUndefined();
                }, err => {
                    this.showAlertMsg("Error", "Server Error", true, false).subscribe();
                    console.log(err)
                }
            )
        } else {
            this.showAlertMsg("Warning", "Admission form finalised already. Can't save.", true, false).subscribe();
            // console.log("finalisde cant save again");
        }
    }

    logOut(): void {
        // this.auth.logoutUser();
        this.router.navigate(['login']);
    }

    focusFunction() {
        console.log("focusing...")
        console.log("stud.twelve");
        console.log(this.stud.twelve);
        let twelveTotal: number = 0;
        let tweleCutOff = 0;
        if (this.stud.twelve.language) {
            twelveTotal = twelveTotal + Number(this.stud.twelve.language);
        }
        if (this.stud.twelve.english) {
            twelveTotal = twelveTotal + Number(this.stud.twelve.english);
        }
        if (this.stud.twelve.physics) {
            twelveTotal = twelveTotal + Number(this.stud.twelve.physics);
            tweleCutOff = tweleCutOff + Number(this.stud.twelve.physics) / 4;
        }
        if (this.stud.twelve.chemistry) {
            twelveTotal = twelveTotal + Number(this.stud.twelve.chemistry);
            tweleCutOff = tweleCutOff + Number(this.stud.twelve.chemistry) / 4;
        }
        if (this.stud.twelve.maths) {
            twelveTotal = twelveTotal + Number(this.stud.twelve.maths);
            tweleCutOff = tweleCutOff + Number(this.stud.twelve.maths) / 2;
        }
        this.stud.twelve.total = twelveTotal;
        this.stud.twelve.cutoff = tweleCutOff;
    }

    getDobValue(dob: any): void {
        console.log(dob)
        this.stud.dob = dob;
    }
}
