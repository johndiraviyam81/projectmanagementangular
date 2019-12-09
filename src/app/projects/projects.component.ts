import { Component, OnInit } from '@angular/core';
import { formatDate,DatePipe  } from '@angular/common';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {User} from '../model/user';
import {ProjectAppConstants,ENUMERATION_TYPES, Enumeration} from '../model/projectappconstants';
import {Project} from '../model/project';
import {Router} from "@angular/router";
import {UsersService} from "../users.service";
import {ProjectsService} from "../projects.service";

import { FormArray,FormGroup, FormControl,  FormBuilder, Validators } from "@angular/forms";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatSnackBar} from '@angular/material/snack-bar';
 
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  assignedProjectmanager=new User();
  project=new Project();
  user=new User();
  getByUser=new User();
  panelOpenState = false;
  userId = new FormControl();
  
  addProject: FormGroup;
  userLists: User[];
  projectConstant:ProjectAppConstants;
  myControl = new FormControl();
  options: User[] ;
  filteredOptions: Observable<User[]>;
  pipe = new DatePipe('en-US'); // Use your own locale
 
  startDatevalue=new Date();
  endDatevalue=new Date();
  
  color = 'primary';
  mode = 'determinate';
 

  constructor(private _snackBar: MatSnackBar,private usersService:UsersService,private projectsService:ProjectsService,private router: Router,public fb: FormBuilder ) {
    
   }

  ngOnInit() {
    this.reactiveForm();
    this.getUsers();  
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options)
    );
     
   
  }

  displayFn(user?: User): string | undefined {
    return user ? user.firstName : undefined;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0);
  }
  /* Reactive form */
  reactiveForm() {
    this.addProject = this.fb.group({
      projectName: ['', [Validators.required]],
      startDate: {value:null,disabled: true},
      endDate:  {value:null,disabled: true},
      disabled:'',
      priority: 0
      
    })
   
  }
  enableDates()
  {
    this.endDatevalue.setDate(this.startDatevalue.getDate()+1);
if(this.addProject.controls["startDate"].disabled)
{
    this.addProject.controls["startDate"].enable();
        this.addProject.controls["endDate"].enable();
        this.addProject.controls["startDate"].setValue(new Date());
        this.addProject.controls["endDate"].setValue(this.endDatevalue);
        this.startDatevalue= this.endDatevalue ;
}
else
{
  this.addProject.controls["startDate"].disable();
        this.addProject.controls["endDate"].disable();
        this.addProject.controls["startDate"].setValue(null);
        this.addProject.controls["endDate"].setValue(null);
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
      return this.addProject.controls[control].hasError(error);
    }
    
   
  getUsers(): void {
    console.log('fetched user');
    this.usersService.getUsers().subscribe(users => {
      this.userLists = users;      
    this.options = users;  
    });
    
  }
  


  submitProject() {
    console.log(this.addProject.value);
    this.assignedProjectmanager=  this.myControl.value;
    this.project.projectName=this.addProject.value.projectName;
    this.project.startDate=this.pipe.transform(this.addProject.value.startDate,"yyyy-MM-dd");
    this.project.endDate=this.pipe.transform(this.addProject.value.endDate,"yyyy-MM-dd");
    this.project.priority=this.addProject.value.priority;
   
          
    if(this.assignedProjectmanager!=null)
    {
    this.project.userId=this.assignedProjectmanager.userId;
    this.project.userName=this.assignedProjectmanager.firstName;
    }
    this.project.projectId="";
    console.log(this.myControl.value);
    
    console.log(this.project);
    this.projectsService.addProject(this.project).subscribe(project => {
      console.log(JSON.stringify(project));
      this._snackBar.open(project.message, "!!!!", {
        duration: 2000,
      });
      this.router.navigateByUrl('/tasks', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/projects']);
    });

      });
     
  }

}
