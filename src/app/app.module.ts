
import { DataTablesModule } from 'angular-datatables';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule }    from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';

import { ChartsModule } from  'ng2-charts';
import { AppRoutingModule } from './app-routing.module';

import { EntireReleaseAllComponent } from './components/entire-release-all/entire-release-all.component';
import { IndividualProjectByReleaseComponent } from './components/individual-project-by-release/individual-project-by-release.component';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { IndividualProjectBySprintComponent } from './components/individual-project-by-sprint/individual-project-by-sprint.component';

@NgModule({
  declarations: [
    AppComponent,
    EntireReleaseAllComponent,
    IndividualProjectByReleaseComponent,
    NotFoundComponent,
    IndividualProjectBySprintComponent,
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    HttpClientModule,
    AppRoutingModule

  ],
  exports: [RouterModule],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
