import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramSearchComponent } from './program-search/program-search.component';
import { ProgramDashboardComponent } from './program-dashboard/program-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: ProgramSearchComponent,
  },
  {
    path: 'dashboard',
    component: ProgramDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
