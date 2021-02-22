import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { UserService } from 'src/app/auth/services/user.service';
import { Invitation } from '../../models/invitation.model';
import { PlayerService } from '../../services/player.service';

import Swal from 'sweetalert2';
import { MessagesToastService } from 'src/app/utils/messages-toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public _userService:UserService,
    public _playerService:PlayerService,
    private _messagesToastService:MessagesToastService
  ) {
   }


   public connectedUsers:Observable<User[]>;

  ngOnInit(): void {



  }

  public sendInvitation(userTo:User){

    if(userTo.playing){
      this._messagesToastService.info(`user ${userTo.name} currently playing`);
      return;
    }

    Swal.fire({
      title: 'Number of rounds ',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Send',
      showLoaderOnConfirm: true,
      reverseButtons:true,
      preConfirm: (rounds) => {
        return rounds;
      },
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        if(isNaN(result.value)){
            this._messagesToastService.warning('only numbers accepted');
        }else{

          const rounds= parseInt(result.value);
          if(rounds>5 || rounds<1){
            this._messagesToastService.warning('minimum 1 and  maximum 5 rounds');
            return;
          }
          this._playerService.newIvitation(userTo,rounds);
        }

      }
    })
  }

  public acceptInvitation(invitation:Invitation){
      this._playerService.updateInvitation(invitation.uidInvitation,true,invitation);
  }

  public rejectInvitation(invitation:Invitation){
    this._playerService.updateInvitation(invitation.uidInvitation,false,invitation);

  }

}
