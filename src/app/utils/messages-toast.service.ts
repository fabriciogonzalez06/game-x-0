import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessagesToastService {

  constructor(
    private _toastService:ToastrService
  ) { }

  public success(message:string){
    this._toastService.success(message,'Message',{closeButton:true,progressBar:true,timeOut:5000});
  }
  public info(message:string){
    this._toastService.info(message,'Message',{closeButton:true,progressBar:true,timeOut:5000});
  }
  public warning(message:string){
    this._toastService.warning(message,'Message',{closeButton:true,progressBar:true,timeOut:5000});
  }
  public error(message:string){
    this._toastService.error(message,'Message',{closeButton:true,progressBar:true,timeOut:5000});
  }
}
