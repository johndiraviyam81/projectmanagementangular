import { Component, Inject, OnInit } from '@angular/core';
import { formatDate,DatePipe  } from '@angular/common';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {User} from '../../model/user';
import {Project} from '../../model/project';
import {Task} from '../../model/task';
import {Router} from "@angular/router";
import {UsersService} from "../../users.service";
import {ProjectsService} from "../../projects.service";
import {TasksService} from "../../tasks.service";

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormArray,FormGroup, FormControl,  FormBuilder, Validators } from "@angular/forms";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatSnackBar} from '@angular/material/snack-bar';
 
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  assignedProjectmanager=new User();
  assignedproject=new Project();
  assignedTask=new Task();
  editTask=new Task();
  task=new Task();
  user=new User();
  getByUser=new User();
  panelOpenState = false;
  userId = new FormControl();
  priority:number;
  editTaskForm: FormGroup;
  userLists: User[];
  startDatevalue=new Date();
  editDatevalue=new Date();
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

  
  color = 'primary';
  mode = 'determinate';
 

  constructor(public dialogRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,private _snackBar: MatSnackBar,private usersService:UsersService,private tasksService:TasksService,private projectsService:ProjectsService,private router: Router,public fb: FormBuilder ) {
  
      this.priority=Number.parseInt(data.priority);
      this.task.taskId=data.taskId;
      this.getUserById(data.userId);
      this.getProjectById(data.projectId);
      this.getParentTaskById(data.parentTaskId);
       this.editTaskForm = this.fb.group({
         taskName: ['', [Validators.required]],
         startDate: new Date(data.startDate),
         endDate:  new Date(data.endDate),
         priority: this.priority
         
       });
       this.startDatevalue=new Date(data.startDate);
       this.editDatevalue=new Date(data.endDate);
       this.editTaskForm.controls["priority"].setValue(this.priority);
     
       this.editTaskForm.patchValue(data);
       this.editTask=data;
      
   }

   getUserById(userId : any): void {    
    if(userId){ 
    this.usersService.getUserById(userId).subscribe((newUser:User) => {
           
      this.assignedProjectmanager=newUser;
    }, err=>console.log(err));
  }
     
   
  }

  getProjectById(projectId : any): void {   
    if(projectId){ 
    this.projectsService.getProjectById(projectId).subscribe((projectDto:Project) => {
         
      this.assignedproject=projectDto;
    }, err=>console.log(err));
  }
     
   
  }

  getParentTaskById(parentById : any): void {    
     
    if(parentById){
    this.tasksService.gettaskById(parentById).subscribe((gettheNewTask:Task) => {
        
      this.assignedTask=gettheNewTask;
    }, err=>console.log(err));
  }
     
   
  }

  ngOnInit() {
  
    this.getUsers();  
    this.getProjects();
    this.getParentTasks();
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
      return this.editTaskForm.controls[control].hasError(error);
    }
    
   
  getUsers(): void {
   
    this.usersService.getUsers().subscribe(users => {
      this.userLists = users;      
    this.options = users;  
    if(this.assignedProjectmanager) {
    this.myControl.patchValue(this.assignedProjectmanager);
    this.myControl.setValue(this.assignedProjectmanager);
    }
    });
    
  }
  
  getProjects(): void {
   
    this.projectsService.getProjects().subscribe(projects => {this.projects = projects;
      this.projectOptions=projects;  
      if(this.assignedproject) {
      this.projectsControl.patchValue(this.assignedproject);
      this.projectsControl.setValue(this.assignedproject);   
      } 
    });
    
  }

  getParentTasks(): void {

    this.tasksService.getParenttasks().subscribe(tasks => {this.tasks = tasks;
      this.parentOptions=tasks; 
      if(this.assignedTask) {
      this.parentsControl.patchValue(this.assignedTask);
      this.parentsControl.setValue(this.assignedTask);     
      }  
    });
    
  }

  updateTask() {

    this.assignedProjectmanager=  this.myControl.value;
    this.assignedproject=  this.projectsControl.value;
    this.assignedTask=  this.parentsControl.value;
    this.task.taskName=this.editTaskForm.value.taskName;
    this.task.startDate=this.pipe.transform(this.editTaskForm.value.startDate,"yyyy-MM-dd");
    this.task.endDate=this.pipe.transform(this.editTaskForm.value.endDate,"yyyy-MM-dd");
    this.task.priority=this.editTaskForm.value.priority;
    this.task.status=this.editTask.status;
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
    

    
    this.tasksService.updatetask(this.task).subscribe(task => {

      this._snackBar.open(task.message, "!!!!", {
        duration: 2000,
      });
      this.router.navigateByUrl('/projects', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/viewtasks']);
    });

      });

      this.dialogRef.close();
     
  }
  closePop(): void {
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
