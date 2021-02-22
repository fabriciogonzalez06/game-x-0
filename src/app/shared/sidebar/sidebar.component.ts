import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import  Swal from 'sweetalert2';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  public async logout() {
    this._authService.logout();

  }

  public showInfoProgrammer(){
    Swal.fire({
      title: 'Angel Fabricio González González',
      icon: 'info',
      html:
        '<a href="https://portafolio-fabricio.web.app/" target="_blank" >Go to portfolio</a> ' ,
      showCloseButton: true,
      // showCancelButton: true,
      focusConfirm: false,
      cancelButtonAriaLabel: 'Thumbs down'
    })
  }

}
