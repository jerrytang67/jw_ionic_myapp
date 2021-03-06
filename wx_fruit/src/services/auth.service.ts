import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
    public getToken(): string {
        return localStorage.getItem('token') ? localStorage.getItem('token') : "";
    }

    public logout(): boolean {
        return true;
    }
}