import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { CONNECTED_USERS, GAMES } from 'src/app/constants/db';
import { ID_CONNECTED_USER } from 'src/app/constants/utils';
import { getDataLocalStorage } from 'src/app/utils/localstorage';
import { MessagesToastService } from 'src/app/utils/messages-toast.service';
import { getCurrentDateString, getHoursAndMinutes } from 'src/app/utils/utilDate';
import { Game } from '../models/game.model';
import { Invitation } from '../models/invitation.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gamesRef= this.db.list(GAMES);
  private connectedUsersRef= this.db.list(CONNECTED_USERS);



  constructor(
    private db:AngularFireDatabase,
    private router:Router,
    private _messagesToastService:MessagesToastService
  ) {
    this.listenGame();
   }



  public newGame(uidInvitation:string,rounds:number,invitation:Invitation){

      return new Promise( async(resolve,reject)=>{
          try {
            const game:Game={
              canceled:false,
              created_at:getCurrentDateString(),
              loser:{} as User,
              ended_at:"",
              numRounds:rounds,
              rounds:[],
              stated_at:getHoursAndMinutes(),
              uidInvitation:uidInvitation,
              winner:{} as User,
              challenger:invitation.userFrom,
              challenged:invitation.userTo,
              finished:false
            }
           const newGame= await this.gamesRef.push(game);

           resolve(newGame.key);
          } catch (error) {
            reject(error.message);
          }
      });

  }


  public listenGame(){
    this.gamesRef.snapshotChanges(['child_added','child_changed','child_removed','child_moved'])
      .pipe(
        map(changes=>{

          const games:Game[]=[];
          changes.forEach(g=>{
              games.push({uidGame:g.key,...g.payload.val() as Game});
          })

          const uidConnecteduser=getDataLocalStorage(ID_CONNECTED_USER);

          return games.filter(g=>{
            return g.challenger.uidConnetedUser===uidConnecteduser && (g.finished==false || g.canceled===false)
          });
        }),

      )
     .subscribe( async game=>{

        if(game.length===0)return;

         const goGame=game[game.length-1];

         try {

           this.connectedUsersRef.update(goGame.challenger.uidConnetedUser ,{playing:true});
           this.router.navigate(['/game'],{queryParams:{game:goGame.uidGame}});
         } catch (error) {
           this._messagesToastService.warning(`somenthing went wrong ${error.message}`);
         }


     });
  }
}
