import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-admission',
    templateUrl: './admission.component.html',
    styleUrls: ['./admission.component.css']
})
export class AdmissionComponent implements OnInit {

    constructor(public dialog: MatDialog, public http: HttpClient, public router: Router, public activatedRoute: ActivatedRoute, public authService: AuthService) {
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            response = JSON.parse(response);
            if (response.error && response.error.code && response.error.code == "LIMIT_FILE_SIZE") {
                alert("Maximum file size is 5 MB")
            }
            this.attachmentList.push(response);
            let data = response;
            data.attachmentName = "PP";
            this.authService.setFileForStudent(data).subscribe((res: any) => {
                this.imageSrc = this.authService.showPhoto + res.fileName;
                this.stud.fileNames = {};
                this.stud.fileNames.profilePhoto = res.fileName;
            });
        }
    }

    uploader: FileUploader = new FileUploader({ url: this.authService.fileUploadUrl, authToken: `Bearer ${this.authService.getToken()}` });
    attachmentList: any = [];
    public finalised: boolean = false;
    public imageSrc: string;
    ngOnInit() {
        this.getStudDetails();
    }

    stud: any = {
        fileNames: {},
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
    isPrmntAdrs: Boolean = false;


    selectedFileOnChanged(event) {
        // console.log("selectedFileOnChanged")
        // console.log(event)
    }

    getStudDetails() {
        this.authService.getStudentAdmission().subscribe(
            res => {
                console.log("res")
                console.log(res)
                if (res.docs != null) {
                    this.stud = res.docs

                    if (this.stud.fileNames && this.stud.fileNames.profilePhoto) {
                        this.imageSrc = this.authService.showPhoto + this.stud.fileNames.profilePhoto;
                    }
                    if (this.stud.status == "F") {
                        this.finalised = true;
                    }
                }
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


    // showAlertMsg(header: string, alertMessage: string, warning: boolean, confirmation: boolean) {
    //     let dialogRef = this.dialog.open(PopupComponent, {
    //         width: "42%",
    //         disableClose: true,
    //         height: "28%",
    //         data: {
    //             headerMsg: header,
    //             message: alertMessage,
    //             isConfirmation: confirmation,
    //             isWarning: warning,
    //         }
    //     });
    //     return dialogRef.afterClosed();
    // }

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
                    alert("Saved Successfully")
                    // this.showAlertMsg("Success", "Saved Successfully", true, false).subscribe();
                    console.log(res)
                    this.stud = res;
                    this.getStudDetails();
                    this.setUndefined();
                }, err => {
                    alert("Server Error");
                    // this.showAlertMsg("Error", "Server Error", true, false).subscribe();
                    console.log(err)
                }
            )
        } else {
            alert("Admission form finalised already. Can't save.")
            // this.showAlertMsg("Warning", "Admission form finalised already. Can't save.", true, false).subscribe();
            // console.log("finalisde cant save again");
        }
    }

    logOut(): void {
        // this.auth.logoutUser();
        this.router.navigate(['login']);
    }

    navBarLogOut(): void {
        let confirmBool = confirm("Are you sure ? You want to logout");
        if (confirmBool) {
            this.logOut();
        }
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

    download() {
        console.log("download clicked...")
        this.http.post("http://localhost:3000/file/download", {}, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        }).subscribe(res => {

            console.log(res)
            saveAs(res, "filename")
        }, err => {
            console.log(err)
        });
    }
}
