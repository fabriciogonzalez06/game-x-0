import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessagesToastService } from 'src/app/utils/messages-toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit ,OnDestroy{

  constructor(
    private _authService:AuthService,
    private _messagesToastService:MessagesToastService,
    private fb:FormBuilder
  ) {
    this.loading= false;
    this.subscriptions= new Subscription();
    this.init();
  }

  private subscriptions:Subscription;

  public frmRegister:FormGroup;

  public loading:boolean;


  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
  }

  private init(){
    this.frmRegister= this.fb.group({
      name:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(5)]],
      password2:['',[Validators.required,Validators.minLength(5)]],
    });

    this.subscriptions.add(
      this._authService.loading$.subscribe(loading=>this.loading=loading)
    );
  }

  public register(){
      if(this.frmRegister.invalid){
        console.log(this.frmRegister)
        this._messagesToastService.warning('missing or invalid data');
        return;
      }

      if(this.frmRegister.value?.password!==this.frmRegister.value?.password2){
        this._messagesToastService.warning('passwords do not match');
        return;
      }

      this._authService.register({...this.frmRegister.value});


  }



}
