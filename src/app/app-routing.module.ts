import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ManagerComponent } from './manager/manager.component';

import { AuthGuard} from './guards/auth.guard';


const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'manager', component: ManagerComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
