import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { EntireReleaseAllComponent } from './components/entire-release-all/entire-release-all.component';
import { IndividualProjectByReleaseComponent } from './components/individual-project-by-release/individual-project-by-release.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { IndividualProjectBySprintComponent } from './components/individual-project-by-sprint/individual-project-by-sprint.component';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';


const  routes: Routes = [
{ path: '', component: MainDashboardComponent},
{ path: 'report/all', component: EntireReleaseAllComponent},
{ path: 'report/release', component: IndividualProjectByReleaseComponent},
{ path: 'report/sprint', component: IndividualProjectBySprintComponent},
{ path: '**', component: NotFoundComponent},
];

@NgModule(
  {imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  })
export class AppRoutingModule {
}
