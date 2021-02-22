import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { CONNECTED_USERS, INVITATIONS } from 'src/app/constants/db';
import { CURRENT_CONNECTED_USER, ID_CONNECTED_USER } from 'src/app/constants/utils';
import { getDataLocalStorage } from 'src/app/utils/localstorage';
import { MessagesToastService } from 'src/app/utils/messages-toast.service';
import { getCurrentDateString } from 'src/app/utils/utilDate';
import { Invitation } from '../models/invitation.model';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private invitationsRef = this.db.list(INVITATIONS);
  private connectedUsersRef= this.db.list(CONNECTED_USERS);


  private invitationsBs: BehaviorSubject<Invitation[]>;
  public get myInvitations$(): Observable<Invitation[]> {
    return this.invitationsBs.asObservable();
  }

  constructor(
    private db: AngularFireDatabase,
    private router:Router,
    private _messagesToast: MessagesToastService,
    private _gameService:GameService

  ) {
    this.invitationsBs = new BehaviorSubject<Invitation[]>([]);
    this.getMyInvitationsChanges();
  }




  public async newIvitation(userToInvite: User,rounds:number) {

    try {
      const currentUser: User = JSON.parse(getDataLocalStorage(CURRENT_CONNECTED_USER));

      const params: Invitation = {
        accepted: false,
        pending:true,
        rejected:false,
        created_at: getCurrentDateString(),
        userFrom: currentUser,
        userTo: userToInvite,
        to: userToInvite.uidConnetedUser,
        from: currentUser.uidConnetedUser,
        rounds
      }

      const invitation = await this.invitationsRef.push(params);
      this._messagesToast.success(`Invitation send to ${userToInvite.name}`);

    } catch (error) {
      this._messagesToast.warning(`can't send invitation ${error.message}`);
    }



  }

  private getMyInvitationsChanges(){
      this.invitationsRef.snapshotChanges(['child_added','child_changed','child_removed','child_moved'])
      .pipe(
        map(changes=>{

          let invitations:Invitation[]=[];
          changes.forEach(i=>{
            invitations.push({uidInvitation:i.key,...i.payload.val() as Invitation});
          });

          const idConneteduser=getDataLocalStorage(ID_CONNECTED_USER);
          return invitations.filter(i=>i.to===idConneteduser && i.pending===true);
        }),

      )
      .subscribe(res=>{
        this.invitationsBs.next(res);
      })
  }


  public async updateInvitation(uidInvitation:string,accepted:boolean,invitation:Invitation){
    let obj={};

    if(accepted){
      obj={pending:false, accepted:true};
    }else{
      obj={pending:false, rejected:true};

    }
    try {
     await  this.invitationsRef.update(uidInvitation,obj);
      this._messagesToast.success(`Invitation ${accepted ? 'accepted': 'rejected'}`);

      if(accepted){
      const uidGame=  await this._gameService.newGame(uidInvitation,invitation.rounds,invitation);

      this.connectedUsersRef.update(invitation.userTo.uidConnetedUser,{playing:true});

       this.router.navigate(['/game'],{queryParams:{game:uidGame}});
      }

    } catch (error) {
      this._messagesToast.warning(`action could not be preformed ${error.message}`);
    }
  }
}
