import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { CONNECTED_USERS } from 'src/app/constants/db';
import { CURRENT_CONNECTED_USER, ID_CONNECTED_USER } from 'src/app/constants/utils';
import { getDataLocalStorage, saveLocalStorage } from 'src/app/utils/localstorage';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersConnectedRef = this.db.list(CONNECTED_USERS);
  private connectedUsersBs: BehaviorSubject<User[]>;

  public get connectedUsers$(): Observable<User[]> {
    return this.connectedUsersBs.asObservable();
  }

  constructor(
    private db: AngularFireDatabase,
  ) {

    this.getConnectedUsersSnapShot$();
    this.connectedUsersBs = new BehaviorSubject<User[]>([]);

  }

  public newConnetUser(user: any) {
    this.usersConnectedRef.push({ ...user }).then(res => {
      saveLocalStorage(res.key, ID_CONNECTED_USER);
      saveLocalStorage(JSON.stringify({...user,uidConnetedUser:res.key}),CURRENT_CONNECTED_USER);
      this.usersConnectedRef.snapshotChanges()
        .pipe(
          map(res => this.structureConnectedUsers(res))
        )
        .subscribe(res=>{
          this.connectedUsersBs.next(res);
        });
    }).catch((e) => console.error('No se pudo registrar usuario conectado ', e.message));
  }

  public deleteUserConneted(uid: string) {
    this.usersConnectedRef.remove(uid).then(res => {
    }).catch(e => console.error('nu se pudo borrar usuario de la lista de connectados', e.message));
  }

  // public get connectedUsers$() {
  //   return this.usersConnectedRef.valueChanges();
  // }

  public getConnectedUsersSnapShot$() {
    this.usersConnectedRef.snapshotChanges()
      .pipe(
        map(changes => this.structureConnectedUsers(changes))
      ).subscribe(res => {
        this.connectedUsersBs.next(res);
      });
  }

  private structureConnectedUsers(changes: any) {
    //don't show my own user in the list of connected users
    const connectedUsers: User[] = [];
    changes.forEach(snapshot => {
      const userData = snapshot.payload.val();
      connectedUsers.push({ uidConnetedUser: snapshot.key, ...userData as any });
    });

    const idConnecteduser = getDataLocalStorage(ID_CONNECTED_USER);
    return connectedUsers.filter(u => u.uidConnetedUser !== idConnecteduser);
  }




}
