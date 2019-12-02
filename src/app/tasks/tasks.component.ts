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
    this.getTasks();
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options)
    );
    this.filteredprojectVo = this.projectsControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._projectFilter(name) : this.projectOptions)
    );

    this.filteredtaskVo = this.parentsControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._taskFilter(name) : this.parentOptions)
    );
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
      priority: [20, [Validators.required]]
      
    })
   
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
    console.log('fetched user');
    this.usersService.getUsers().subscribe(users => {
      this.userLists = users;      
    this.options = users;  
    });
    
  }
  
  getProjects(): void {
    console.log('fetched project');
    this.projectsService.getProjects().subscribe(projects => {this.projects = projects;
      this.projectOptions=projects;       
    });
    
  }

  getTasks(): void {
    console.log('fetched task');
    this.tasksService.gettasks().subscribe(tasks => {this.tasks = tasks;
      this.parentOptions=tasks;       
    });
    
  }

  submitTask() {
    console.log(this.addTask.value);
    console.log(this.myControl.value);
    console.log(this.projectsControl.value);
    console.log(this.parentsControl.value);
    if(this.addTask.value.taskName && this.addTask.value.endDate) {
    this.assignedProjectmanager=  this.myControl.value;
    this.assignedproject=  this.projectsControl.value;
    this.assignedTask=  this.parentsControl.value;
    this.task.taskName=this.addTask.value.taskName;
    this.task.startDate=this.pipe.transform(this.addTask.value.startDate,"yyyy-MM-dd");
    this.task.endDate=this.pipe.transform(this.addTask.value.endDate,"yyyy-MM-dd");
    this.task.priority=this.addTask.value.priority;
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
    
    console.log(this.task);
    
    this.tasksService.addtask(this.task).subscribe(task => {
      console.log(JSON.stringify(task));
      this._snackBar.open(task.message, "!!!!", {
        duration: 2000,
      });
      this.router.navigateByUrl('/projects', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/tasks']);
    });

      });

    }
     
  }

}
