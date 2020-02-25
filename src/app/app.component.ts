import { Component } from '@angular/core';
import { AuthService } from './components/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'onlyAdmission';
    constructor(private auth: AuthService) { }
    changeOfRoutes() {

    }
}
