import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  resetPassword : FormGroup;
  constructor(private auth: AngularFireAuth, private router : Router) { }

  ngOnInit(): void {
    this.resetPassword = new FormGroup({
      email: new FormControl("", [Validators.required , Validators.email])
    })
  }

  resetPass(){
    const {email} = this.resetPassword.value;
    this.auth.sendPasswordResetEmail(email).then(()=>{
      alert("Password reset details sent to email address!")
    }).catch(err => {
      alert(err);
    })
  }
  
  login(){
    this.router.navigate(['/login']);
  }
}
