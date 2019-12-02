import { Component, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {User} from '../model/user';
import {UsersService} from "../users.service";
import {Router} from "@angular/router";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent  {
user=new User();
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  addUserForm: FormGroup;
 

  constructor(private _snackBar: MatSnackBar,private usersService:UsersService,public fb: FormBuilder,private router: Router) {}

  ngOnInit(): void {
    this.reactiveForm()
  }

  /* Reactive form */
  reactiveForm() {
    this.addUserForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      employeeId: ['', [Validators.required]],
      
    })
   
  }

 
  
  /* Handle form errors in Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.addUserForm.controls[control].hasError(error);
  }

  submitUserForm() {
    this.user.firstName=this.addUserForm.value.firstName;
    this.user.lastName=this.addUserForm.value.lastName;
    this.user.employeeId=this.addUserForm.value.employeeId;
    console.log(this.addUserForm.value);
    console.log(JSON.stringify(this.user));
    this.usersService.addUser(this.user).subscribe(user => {
      console.log(JSON.stringify(user));
      this._snackBar.open(user.message, "!!!!", {
        duration: 2000,
      });
      this.router.navigateByUrl('/tasks', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/users']);
    });

      });
     
  }

}
