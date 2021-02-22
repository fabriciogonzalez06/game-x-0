import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoadingComponent } from './loading/loading.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [SidebarComponent, LoadingComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    RouterModule,
  ],
  exports:[
    SidebarComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
