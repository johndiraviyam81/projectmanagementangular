import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {ExtendedMaterialModule} from './material-module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { UsersComponent } from './users/users.component';
import { ViewTaskComponent } from './tasks/view-task/view-task.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { ListProjectsComponent } from './projects/list-projects/list-projects.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { EditTaskComponent } from './tasks/edit-task/edit-task.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProjectsComponent,
    TasksComponent,
    UsersComponent,
    ViewTaskComponent,
    ListUsersComponent,
    EditUserComponent,
    ListProjectsComponent,
    EditProjectComponent,
    EditTaskComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ExtendedMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  entryComponents: [EditProjectComponent,EditTaskComponent,EditUserComponent],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }



