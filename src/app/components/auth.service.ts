import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public ipUrl = "http://localhost:3000/";
    // public ipUrl = "http://3.17.4.158:3000/";
    public fileUploadUrl = this.ipUrl + "file/upload";
    public showPhoto: string = this.ipUrl + "uploads/";
    public downloadPdf: string = this.ipUrl + "file/download";

    public registerUrl = this.ipUrl + "student/register";
    public loginUrl = this.ipUrl + "student/login";
    public otpUrl = this.ipUrl + "student/genOtp";

    public doAdmissionUrl = this.ipUrl + "admission/saveAdmission";
    public getStudentAdmissionUrl = this.ipUrl + "admission/studentAdmission";

    public setFileForStudentUrl = this.ipUrl + "file/setFileForStudent";


    constructor(public http: HttpClient) { }

    registerStudent(student) {
        return this.http.post<any>(this.registerUrl, student);
    }

    loginStudent(student) {
        return this.http.post<any>(this.loginUrl, student);
    }

    doAdmission(studentAdmission) {
        return this.http.post<any>(this.doAdmissionUrl, studentAdmission);
    }

    setFileForStudent(data) {
        return this.http.post<any>(this.setFileForStudentUrl, data);
    }

    getStudentAdmission() {
        return this.http.get<any>(this.getStudentAdmissionUrl);
    }

    genOtp(data) {
        return this.http.post<any>(this.otpUrl, data);
    }
    loggedIn() {
        // console.log("loggedIn function..")
        // console.log(localStorage.getItem('token'))
        return !!localStorage.getItem('token');
    }

    logOutUser() {
        localStorage.removeItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }
}
