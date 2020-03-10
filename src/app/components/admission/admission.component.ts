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
        // profile photo
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
                alert("Photo uploaded.Click save to save your changes")
            });
        }
        // pdf upload
        this.uploaderPdf.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log("pdf api")
            console.log(response)
            response = JSON.parse(response);
            if (response.error && response.error.code && response.error.code == "LIMIT_FILE_SIZE") {
                alert("Maximum file size is 5 MB")
            }
            this.attachmentList.push(response);
            let data = response;
            data.attachmentName = "PDFfile";
            this.authService.setFileForStudent(data).subscribe((res: any) => {
                this.stud.fileNames = this.stud.fileNames ? this.stud.fileNames : {};
                this.stud.fileNames.markSheet = res.fileName;
                console.log(this.stud.fileNames)
                this.pdfSrc = this.authService.showPhoto + res.fileName;
                alert("PDF uploaded.Click save to save your changes")
            });
        }
    }

    uploader: FileUploader = new FileUploader({ url: this.authService.fileUploadUrl, authToken: `Bearer ${this.authService.getToken()}` });

    uploaderPdf: FileUploader = new FileUploader({ url: this.authService.fileUploadUrl, authToken: `Bearer ${this.authService.getToken()}` });

    attachmentList: any = [];
    public finalised: boolean = false;
    public imageSrc: string;
    public pdfSrc: string;

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
        // console.log(this.uploaderPdf)
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

                    if (this.stud.fileNames && this.stud.fileNames.markSheet) {
                        this.pdfSrc = this.stud.fileNames.markSheet;
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
                    if (this.stud.status == 'F') {
                        console.log("in f")
                        window.location.href = "https://rzp.io/l/payl";
                    }
                    // this.showAlertMsg("Success", "Saved Successfully", true, false).subscribe();
                    // console.log(res)
                    this.stud = res;
                    console.log("after save response")
                    console.log(this.stud)
                    // console.log("stud status...", this.stud.status)
                    alert("Saved Successfully")
                    this.getStudDetails();
                    this.setUndefined();
                    console.log()
                }, err => {
                    alert("Server Error");
                }
            )
        } else {
            alert("Admission form finalised already. Can't save.")
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

    downloadMarkSheet() {
        // console.log("download clicked...")
        this.http.post(this.authService.downloadPdf, { "pdf": this.pdfSrc }, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        }).subscribe(res => {
            // console.log(res)
            saveAs(res, this.pdfSrc)
        }, err => {
            console.log(err)
        });
    }
}
