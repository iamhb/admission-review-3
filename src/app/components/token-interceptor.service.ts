import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service'

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

    constructor(public injector: Injector) { }

    intercept(req, next) {
        console.log("in intercept")
        let authService = this.injector.get(AuthService);
        let tokenisedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authService.getToken()}`
            }
        })
        return next.handle(tokenisedReq);
    }
}
