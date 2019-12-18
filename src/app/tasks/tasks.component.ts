import { Component, OnInit } from '@angular/core';
import { formatDate,DatePipe  } from '@angular/common';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {User} from '../model/user';
import {Project} from '../model/project';
import {Task} from '../model/task';
import {Router} from "@angular/router";
import {UsersService} from "../users.service";
import {ProjectsService} from "../projects.service";
import {TasksService} from "../tasks.service";
import {MatSnackBar} from '@angular/material/snack-bar';

import { FormArray,FormGroup, FormControl,  FormBuilder, Validators } from "@angular/forms";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {ENUMERATION_TYPES} from '../model/projectappconstants';
 
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  assignedProjectmanager=new User();
  assignedproject=new Project();
  assignedTask=new Task();
  task=new Task();
  user=new User();
  getByUser=new User();
  panelOpenState = false;
  userId = new FormControl();
  
  addTask: FormGroup;
  userLists: User[];
  
  myControl = new FormControl();
  projectsControl = new FormControl();
  parentsControl = new FormControl();
  options: User[] ;
  projectOptions: Project[] ;
  parentOptions: Task[] ;
  projects:Project[];
  tasks:Task[];
  filteredOptions: Observable<User[]>;
  filteredprojectVo: Observable<Project[]>;
  filteredtaskVo: Observable<Task[]>;
  pipe = new DatePipe('en-US'); // Use your own locale

  startDatevalue=new Date();
  color = 'primary';
  mode = 'determinate';
 

  constructor(private _snackBar: MatSnackBar,private usersService:UsersService,private tasksService:TasksService,private projectsService:ProjectsService,private router: Router,public fb: FormBuilder ) {
    
   }

  ngOnInit() {
    this.reactiveForm();
    this.getUsers();  
    this.getProjects();
    this.getParentTasks();
   if(this.addTask.controls["startDate"].enabled)
   {
    this.reactiveControlChange();
   }
  }

  reactiveControlChange()
  {
   
    if(this.myControl.enabled)
    {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string'? value : value),
      map(value => name ? this._filter(name) : this.options)
    );
    this.filteredprojectVo = this.projectsControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(value => name ? this._projectFilter(name) : this.projectOptions)
    );

    this.filteredtaskVo = this.parentsControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(value => name ? this._taskFilter(name) : this.parentOptions)
    );
    }
  }
  displayFn(user?: User): string | undefined {
    return user ? user.firstName : undefined;
  }
  displayProjectFn(project?: Project): string | undefined {
    return project ? project.projectName : undefined;
  }
  displayTaskFn(task?: Task): string | undefined {
    return task ? task.taskName : undefined;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _projectFilter(name: string): Project[] {
    const filterValue = name.toLowerCase();

    return this.projectOptions.filter(option => option.projectName.toLowerCase().indexOf(filterValue) === 0);
  }
  private _taskFilter(name: string): Task[] {
    const filterValue = name.toLowerCase();

    return this.parentOptions.filter(option => option.taskName.toLowerCase().indexOf(filterValue) === 0);
  }
  /* Reactive form */
  reactiveForm() {
    this.addTask = this.fb.group({
      taskName: ['', [Validators.required]],
      startDate: [new Date(), [Validators.required]],
      endDate:  [new Date(), [Validators.required]],
      priority: [0, [Validators.required]],
      setParentTask:''
      
    })
   
  }

  enableParentTask(){
    if(this.addTask.controls["startDate"].enabled)
    {
    this.addTask.controls["startDate"].disable();
    this.addTask.controls["endDate"].disable();
    this.addTask.controls["priority"].disable();
    this.myControl.disable();
    this.projectsControl.disable();
   this.parentsControl.disable();
    }
    else
    {
      this.addTask.controls["startDate"].enable();
    this.addTask.controls["endDate"].enable();
    this.addTask.controls["priority"].enable();
    this.myControl.enable();
    this.projectsControl.enable();
   this.parentsControl.enable();
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if(type=="startDate")
  { 
    // this.addProject.value.startDate=event.value;
    this.startDatevalue=event.value;
  }
    //else
    //this.addProject.value.endDate=event.value;
   // this.events.push(`${type}: ${event.value}`);
  }
    /* Handle form errors in Angular 8 */
    public errorHandling = (control: string, error: string) => {
      return this.addTask.controls[control].hasError(error);
    }
    
   
  getUsers(): void {
 
    this.usersService.getUsers().subscribe(users => {
      this.userLists = users;      
    this.options = users;  
    });
    
  }
  
  getProjects(): void {
     
    this.projectsService.getProjects().subscribe(projects => {this.projects = projects;
      this.projectOptions=projects;       
    });
    
  }

  getParentTasks(): void {
     this.tasksService.getParenttasks().subscribe(tasks => {this.tasks = tasks;
      this.parentOptions=tasks;    
        
    });
    
  }

  submitTask() {

    
    if(this.addTask.value.taskName ) {
      this.task.taskName=this.addTask.value.taskName;
      this.task.setParentTask=(this.addTask.value.setParentTask)?"1":"0";
      if(this.addTask.value.endDate)
      {
          this.assignedProjectmanager=  this.myControl.value;
          this.assignedproject=  this.projectsControl.value;
          this.assignedTask=  this.parentsControl.value;    
          this.task.startDate=this.pipe.transform(this.addTask.value.startDate,"yyyy-MM-dd");
          this.task.endDate=this.pipe.transform(this.addTask.value.endDate,"yyyy-MM-dd");
          this.task.priority=this.addTask.value.priority;
          this.task.status=ENUMERATION_TYPES[1];
          if(this.assignedProjectmanager!=null)
          {
          this.task.userId=this.assignedProjectmanager.userId;
          this.task.userName=this.assignedProjectmanager.firstName;
          }
          if(this.assignedproject!=null)
          {
          this.task.projectId=this.assignedproject.projectId;
          this.task.projectName=this.assignedproject.projectName;
          }
          if(this.assignedTask!=null && this.assignedTask.taskId!=null)
          {
          this.task.parentTaskId=this.assignedTask.taskId;
          this.task.parentTaskName=this.assignedTask.taskName;
          }
  }
   
    
    this.tasksService.addtask(this.task).subscribe(task => {
     
      this._snackBar.open(task.message, "!!!!", {
        duration: 2000,
      });
      this.router.navigateByUrl('/projects', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/viewtasks']);
    });

      });

    }
     
  }

}
