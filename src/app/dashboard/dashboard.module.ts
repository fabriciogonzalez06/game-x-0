import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ContentDashboardComponent } from './content-dashboard/content-dashboard.component';
import { HomeComponent } from './content-dashboard/home/home.component';
import { GameComponent } from './content-dashboard/game/game.component';
import { GamesPlayedComponent } from './content-dashboard/games-played/games-played.component';
import { ProfileComponent } from './content-dashboard/profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ContentDashboardComponent, HomeComponent, GameComponent, GamesPlayedComponent, ProfileComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DashboardModule { }
