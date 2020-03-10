import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-pdf-view',
    templateUrl: './pdf-view.component.html',
    styleUrls: ['./pdf-view.component.css']
})
export class PdfViewComponent implements OnInit {

    page: number = 1;
    pdfSrc: string = '';

    constructor(public router: Router) { }

    ngOnInit() {
        this.pdfSrc = "assets/sample-two-page.pdf"
    }

    goToAdmission() {
        this.router.navigate(['admission']);

    }

    downloadPdf() {
        console.log('download clicked...')
        saveAs('../../../assets/sample-two-page.pdf', "sample.pdf")
    }

}
