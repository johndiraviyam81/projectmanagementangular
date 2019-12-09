import { Component, Inject,OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { User } from '../../model/user';
import { FormArray,FormGroup, FormControl,  FormBuilder, Validators } from "@angular/forms";
import {UsersService} from "../../users.service";
import {Router} from "@angular/router";
import {Project} from '../../model/project';
import {ProjectsService} from "../../projects.service";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  pipe=new DatePipe('en-US');
  assignedProjectmanager=new User();
  project=new Project();
  editProject=new Project();
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  editProjectForm: FormGroup;
  userId = new FormControl();
  myControl = new FormControl();
  options: User[] ;
  filteredOptions: Observable<User[]>;
  userLists: User[];
  startDatevalue=new Date();
  editDatevalue=new Date();
  color = 'primary';
  mode = 'determinate';
  priority:number;

  constructor( public dialogRef: MatDialogRef<EditProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,private _snackBar: MatSnackBar,private projectsService:ProjectsService ,private usersService:UsersService,public fb: FormBuilder,private router: Router) {
      this.priority=Number.parseInt(data.priority);
     this.getUserById(data.userId);
      this.editProjectForm = this.fb.group({
        projectName: ['', [Validators.required]],
        startDate: new Date(data.startDate),
        endDate:  new Date(data.endDate),
        priority: this.priority
        
      });
      this.startDatevalue=new Date(data.startDate);
      this.editDatevalue=new Date(data.endDate);
      this.editProjectForm.controls["priority"].setValue(this.priority);
    
      this.editProjectForm.patchValue(data);
      this.editProject=data;
      
     console.log(this.editProjectForm.value);
      }


       ngOnInit(): void {  
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

      getUsers(): void {
        console.log('fetched user');
        this.usersService.getUsers().subscribe(users => {
          this.userLists = users;      
        this.options = users;  
        console.log("userName::"+this.editProject.userName);  
        this.myControl.patchValue(this.assignedProjectmanager);
        this.myControl.setValue(this.assignedProjectmanager);
        });
        
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
  

      public errorHandling = (control: string, error: string) => {
        return this.editProjectForm.controls[control].hasError(error);
      }

      getUserById(userId : any): void {    
        this.usersService.getUserById(userId).subscribe((newUser:User) => {
          console.log('get new user');
          console.log(JSON.stringify(newUser));         
          this.assignedProjectmanager=newUser;
        }, err=>console.log(err));
         
       
      }
      updateProject() {
        console.log(this.editProjectForm.value);
        this.assignedProjectmanager=  this.myControl.value;
        this.project.projectId=this.editProject.projectId;
        this.project.projectName=this.editProjectForm.value.projectId;
        this.project.projectName=this.editProjectForm.value.projectName;
        this.project.startDate=this.pipe.transform(this.editProjectForm.value.startDate,"yyyy-MM-dd");
        this.project.endDate=this.pipe.transform(this.editProjectForm.value.endDate,"yyyy-MM-dd");
        this.project.priority=this.editProjectForm.value.priority;
        
        if(this.assignedProjectmanager!=null)
        {
        this.project.userId=this.assignedProjectmanager.userId;
        this.project.userName=this.assignedProjectmanager.firstName;
        }
        console.log(this.myControl.value);
        
        console.log(this.project);
        this.projectsService.updateProject(this.project).subscribe(project => {
          console.log(JSON.stringify(project));
          this._snackBar.open(project.message, "!!!!", {
            duration: 2000,
          });
          this.router.navigateByUrl('/tasks', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/projects']);
        });
        this.dialogRef.close();
      });
        
    }
    closePop(): void {
      this.dialogRef.close();
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
}