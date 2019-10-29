import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { UsersComponent } from './users/users.component';
import { ViewTaskComponent } from './view-task/view-task.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'projects', component:  ProjectsComponent},
  { path: 'tasks', component:  TasksComponent},
  { path: 'users', component: UsersComponent},
  { path: 'viewtasks', component: ViewTaskComponent},
  { path: 'editUser', component: EditUserComponent},
];
export const appRouting = RouterModule.forRoot(routes);
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
