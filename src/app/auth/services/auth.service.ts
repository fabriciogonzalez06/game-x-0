import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LOGS_LOGININ } from 'src/app/constants/db';
import { ID_CONNECTED_USER } from 'src/app/constants/utils';
import { deleteDataLocalStorage, getDataLocalStorage } from 'src/app/utils/localstorage';
import { MessagesToastService } from 'src/app/utils/messages-toast.service';
import { getCurrentDateString, getHoursAndMinutes } from 'src/app/utils/utilDate';
import { Login } from '../models/login.model';
import { Register } from '../models/register.model';
import { UserService } from './user.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private logsRef= this.db.list(LOGS_LOGININ);

  constructor(
    private _userService: UserService,
    private fauth: AngularFireAuth,
    private db:AngularFireDatabase,
    private _messagesToastService: MessagesToastService,
    private router: Router,
  ) {
    this.loadingBs = new BehaviorSubject<boolean>(false);
    this.statusChanged();
  }

  private loadingBs: BehaviorSubject<boolean>;
  public get loading$(): Observable<boolean> {
    return this.loadingBs.asObservable();
  }

  private startLoading() {
    this.loadingBs.next(true);
  }

  private finishLoading() {
    this.loadingBs.next(false);
  }


  public async register(newUser: Register) {

    const { name, password, email } = newUser;
    this.startLoading();
    try {
      const user = await this.fauth.createUserWithEmailAndPassword(email, password);
      await user.user.updateProfile({ displayName: name });
      this._messagesToastService.success(`User ${name} created successfully`);
      this.finishLoading();
      this.router.navigateByUrl('auth/login');

    } catch (error) {
      this._messagesToastService.error(`Error creating user ${error.message}`);
      this.finishLoading();
    }

  }

  public async login(userLogin: Login) {
    const { email, password } = userLogin;
    this.startLoading();
    try {
      const user = await this.fauth.signInWithEmailAndPassword(email, password);
      this._messagesToastService.info(`Welcome ${user.user.displayName}`);
      this._userService.newConnetUser({ email, uidUser: user.user.uid, name: user.user.displayName, created_at: getCurrentDateString(), playing: false });
      await this.logsRef.push({email,time:getCurrentDateString() + ':'+getHoursAndMinutes()});
      this.router.navigateByUrl('');
      this.finishLoading();
    } catch (error) {
      this._messagesToastService.error(`Could not login ${error.message}`);
      this.finishLoading();
    }
  }

  public logout():void {
    this.fauth.signOut().then(() => {

      const idConnectedUserToDelete=getDataLocalStorage(ID_CONNECTED_USER);
      if(!idConnectedUserToDelete){return}
      this._userService.deleteUserConneted(idConnectedUserToDelete);
      deleteDataLocalStorage(ID_CONNECTED_USER);
      this.router.navigateByUrl('auth/login');
    }).catch(console.error)
  }

  public noAuth():void {
    deleteDataLocalStorage(ID_CONNECTED_USER);
    this.router.navigateByUrl('auth/login');
  }

  public loggedIn():void {
    this.router.navigateByUrl('');
  }



  public getCurrentUser() {

    return new Promise((resolve,reject)=>{
      this.fauth.authState.subscribe(res=>{

         resolve(res);
      });
    });
    // return this.fauth.currentUser;
  }

  private statusChanged() {
    this.fauth.onAuthStateChanged((user) => {
    });
  }

  public updateName(name:string){
      this.fauth.currentUser.then( async user=>{
          try {
            await user.updateProfile({displayName:name});
            this._messagesToastService.success(`name updated`);
          } catch (error) {
            this._messagesToastService.warning(`Name could not be updated ${error.message}`);
          }
      });
  }

  public updatePassword(newPassword:string){
    this.fauth.currentUser.then( async user=>{
      try {
        await user.updatePassword(newPassword);
        this._messagesToastService.success(`Password updated`);

      } catch (error) {
        this._messagesToastService.warning(`Password could not be updated ${error.message}`);
      }
  });
  }



}
