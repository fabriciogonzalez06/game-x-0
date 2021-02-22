import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessagesToastService } from 'src/app/utils/messages-toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {

  constructor(
    private fb:FormBuilder,
    private _authService:AuthService,
    private _messagesToastService:MessagesToastService
  ) {
    this.loading=false;
    this.subscriptions= new Subscription();
    this.init();
  }

  public loading:boolean;

  private subscriptions:Subscription;

  public frmLogin:FormGroup;


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
  }

  private init():void{
    this.frmLogin= this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
    });

    this.subscriptions.add(
      this._authService.loading$.subscribe(loading=>this.loading=loading)
    );
  }

  public login(){
      if(this.frmLogin.invalid){
        this._messagesToastService.warning('Missing or invalid data');
        return;
      }

      this._authService.login({...this.frmLogin.value});
  }

}
