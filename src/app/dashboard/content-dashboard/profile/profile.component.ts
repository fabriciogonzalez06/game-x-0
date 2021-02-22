import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessagesToastService } from 'src/app/utils/messages-toast.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public name: string;
  public password: { password: string, password2: string };

  constructor(
    private _authService: AuthService,
    private _messageToastService: MessagesToastService
  ) {
    this.password = { password: '', password2: '' }
  }


  ngOnInit(): void {
    this._authService.getCurrentUser().then((cu: any) => {
      this.name = cu.displayName;
    })
  }

  public saveName() {
    if (this.name.trim() === "") {
      this._messageToastService.warning('name cannot be empty');
      return;
    }

    this._authService.updateName(this.name);
  }

  public updatePassword() {
    if (this.password.password.length < 5 || this.password.password2.length < 5) {
      this._messageToastService.warning('minimum size 6 characters');
      return;
    }
    if (this.password.password !== this.password.password2) {
      this._messageToastService.warning('passwords do not match');
      return;
    }

    this._authService.updatePassword(this.password.password);
  }

}
