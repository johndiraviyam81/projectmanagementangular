import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User } from '../model/user';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {UsersService} from "../users.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  user=new User();
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  editUserForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,private usersService:UsersService,public fb: FormBuilder) {
      
      this.editUserForm = this.fb.group({
        userId: [''],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        employeeId: ['']        
      });
      this.editUserForm.patchValue(data);
    }

    ngOnInit(): void {     
   
    }
 /* Reactive form */
  

/* Handle form errors in Angular 8 */
public errorHandling = (control: string, error: string) => {
  return this.editUserForm.controls[control].hasError(error);
}

modifyUserForm() {
  this.user.userId=this.editUserForm.value.userId;
  this.user.firstName=this.editUserForm.value.firstName;
  this.user.lastName=this.editUserForm.value.lastName;
  this.user.employeeId=this.editUserForm.value.employeeId;
  console.log(this.editUserForm.value);
  console.log(JSON.stringify(this.user));
  /*this.usersService.addUser(this.user).subscribe(user => {
    console.log(JSON.stringify(user));
    });*/
   
}
  onNoClick(): void {
    this.dialogRef.close();
  }

}
