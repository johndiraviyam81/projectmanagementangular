import {Component, OnInit,Inject} from '@angular/core';
import {Sort} from '@angular/material/sort';
import {User} from '../model/user';
import {UsersService} from "../users.service";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormArray,FormGroup, FormControl,  FormBuilder, Validators } from "@angular/forms";
import  {EditUserComponent} from '../edit-user/edit-user.component';
import { UsersComponent } from '../users/users.component';

 

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit{ 
  user=new User();
  getByUser=new User();
  panelOpenState = false;
  users: User[];
 
  
  
  submitUpdateForm(emp :any):void
  {
    console.log("submitUpdateForm");
    console.log(emp);
  }
  constructor(private usersService:UsersService,public fb: FormBuilder,public dialog: MatDialog) { }
  
  ngOnInit() {
    this.getUsers();     
  }

  
  
  
  getUsers(): void {
    console.log('fetched user');
    this.usersService.getUsers().subscribe(users => this.users = users);
    
  }
  getUserById(userId : any): void {
    
    this.usersService.getUserById(userId).subscribe((newUser:User) => {
      console.log('get new user');
      console.log(JSON.stringify(newUser));
     
      const dialogRef = this.dialog.open(EditUserComponent, {
        width: '400px',
        height: '400px',
        data: newUser
      }); 
    
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
         
      });
    }, err=>console.log(err));
     
   
  }
  sortData(sort: Sort) {
    console.log('sort usersort::'+sort);
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.users = data;
      return;
    }

    this.users = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstName': return compare(a.firstName, b.firstName, isAsc);
        case 'lastName': return compare(a.lastName, b.lastName, isAsc);
        case 'employeeId': return compare(a.employeeId, b.employeeId, isAsc);
        case 'projectId': return compare(a.projectId, b.projectId, isAsc);
        case 'taskId': return compare(a.taskId, b.taskId, isAsc);
        default: return 0;
      }
    });
  }
  editUser(userIdDialog: any): void {
    console.log("getting user ::"+userIdDialog);
    this.getUserById(userIdDialog);    
  }
  
 
}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}





