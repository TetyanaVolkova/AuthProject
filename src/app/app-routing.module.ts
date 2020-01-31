import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryListComponent } from './history/history-list/history-list.component';
import { LabListComponent } from './laboratories/lab-list/lab-list.component';
import { RegulatoryListComponent } from './regulatory/regulatory-list/regulatory-list.component';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'laboratories', component: LabListComponent, canActivate: [AuthGuard] },
  { path: 'regulatory', component: RegulatoryListComponent, canActivate: [AuthGuard] },
  { path : 'history', component: HistoryListComponent, canActivate: [AuthGuard] },
  { path : 'login', component: AuthComponent },
  { path : 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
