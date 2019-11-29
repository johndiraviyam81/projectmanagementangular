import {Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import {Sort} from '@angular/material/sort';
import {User} from '../../model/user';
import {UsersService} from "../../users.service";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormArray,FormGroup, FormControl,  FormBuilder, Validators } from "@angular/forms";
import  {EditUserComponent} from '../edit-user/edit-user.component';
import {DeleteRecord} from '../../model/deleterecord';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from "@angular/router";

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
  searchAllUser:User[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userFiNameCtrl = new FormControl();
  filtereduserFiNames: Observable<string[]>;
  userFiNames: string[] = [];
  alluserFiNames: string[] = [];
  
  @ViewChild('userFiNameInput', {static: false}) userFiNameInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  myUserSearchForm: FormGroup;
  
  
  
  
  
   
  constructor(private _snackBar: MatSnackBar,private router: Router,private usersService:UsersService,public fb: FormBuilder,public dialog: MatDialog) {

    this.filtereduserFiNames = this.userFiNameCtrl.valueChanges.pipe(
      startWith(null),
      map((userFiName: string | null) => userFiName ? this._filter(userFiName) : this.alluserFiNames.slice()));
   }
  
   add(event: MatChipInputEvent): void {
    // Add userFiName only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
  
      // Add our userFiName
      if ((value || '').trim()) {
        this.userFiNames.push(value.trim());
      }
  
      // Reset the input value
      if (input) {
        input.value = '';
      }
  
      this.userFiNameCtrl.setValue(null);
    }
  }
  
  remove(userFiName: string): void {
    const index = this.userFiNames.indexOf(userFiName);
  
    if (index >= 0) {
      this.userFiNames.splice(index, 1);
    }
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    this.userFiNames.push(event.option.viewValue);
    this.userFiNameInput.nativeElement.value = '';
    this.userFiNameCtrl.setValue(null);
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
  
    return this.alluserFiNames.filter(userFiName => userFiName.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    this.getUsers();   
    
  }


  
  getUsers(): void {
    console.log('fetched user');
    this.usersService.getUsers().subscribe(users => {this.users = users;
      this.searchAllUser=users;
      this.searchAllUser.forEach(user=>{ 
        this.alluserFiNames.push(user.firstName)
      });
    });
    
  }
  searchUser():void{
    console.log('fetched user');
    this.users=this.searchAllUser;
    this.usersService.searchUser(this.userFiNames).subscribe(users => this.users = users);
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
     
        default: return 0;
      }
    });
  }
  editUser(userIdDialog: any): void {
    console.log("getting user ::"+userIdDialog);
    this.getUserById(userIdDialog);    
  }

  removeUser(userIdDialog: any): void {
    console.log("deleting user ::"+userIdDialog);
    this.usersService.deleteUser(userIdDialog).subscribe(deleteRecord => {
      console.log('user message :: '+deleteRecord.message);
      
        this._snackBar.open(deleteRecord.message, "!!!!", {
          duration: 2000,
        });
        this.router.navigateByUrl('/tasks', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/users']);
      });
    }, err=>console.log(err));    
  }
  
 
}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}








