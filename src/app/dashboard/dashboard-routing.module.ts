import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentDashboardComponent } from './content-dashboard/content-dashboard.component';
import { GameComponent } from './content-dashboard/game/game.component';
import { GamesPlayedComponent } from './content-dashboard/games-played/games-played.component';
import { HomeComponent } from './content-dashboard/home/home.component';
import { ProfileComponent } from './content-dashboard/profile/profile.component';

const DASHBOAR_ROUTES: Routes = [
  {
    path:'',
    component:ContentDashboardComponent,
    children:[
      {
        path:'',
        component:HomeComponent
      },
      {
        path:'game',
        component:GameComponent,
      },
      {
        path:'games-played',
        component:GamesPlayedComponent
      },
      {
        path:'profile',
        component:ProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DASHBOAR_ROUTES)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
