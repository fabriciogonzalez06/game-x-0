import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _authService:AuthService
  ){}

  canActivate(): Observable<boolean > | Promise<boolean> | boolean | UrlTree {
    return new Promise( async (resolve,reject)=>{

      const currentUser= await this._authService.getCurrentUser();
      if(currentUser){
        resolve(true);
      }else{
        this._authService.noAuth();
        resolve(false);
      }
    });
  }

}
