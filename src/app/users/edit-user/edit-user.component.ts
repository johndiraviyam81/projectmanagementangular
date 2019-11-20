import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User } from '../../model/user';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {UsersService} from "../../users.service";
import {Router} from "@angular/router";

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
    @Inject(MAT_DIALOG_DATA) public data: User,private usersService:UsersService,public fb: FormBuilder,private router: Router) {
      
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
  this.user=this.data;
  this.user.userId=this.editUserForm.value.userId;
  this.user.firstName=this.editUserForm.value.firstName;
  this.user.lastName=this.editUserForm.value.lastName;
  this.user.employeeId=this.editUserForm.value.employeeId;
  console.log(this.editUserForm.value);
  console.log(JSON.stringify(this.user));
  this.usersService.updateUser(this.user).subscribe(user => {
    console.log(JSON.stringify(user));
 
    //this.router.navigate(["/users", {relativeTo: this.router, skipLocationChange: true}]);
    this.router.navigateByUrl('/tasks', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/users']);
  });

    this.dialogRef.close();

  
    });
 
   
}
  onNoClick(): void {
    this.dialogRef.close();
  }
  closePop(): void {
    this.dialogRef.close();
  }

}
