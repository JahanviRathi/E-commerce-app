import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {

  setPassword : FormGroup;
  constructor(private auth: AngularFireAuth, private router: Router, private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.setPassword = new FormGroup({
      password: new FormControl("", [Validators.required , Validators.minLength(6)]),
      confirmPassword: new FormControl("", [Validators.required , Validators.minLength(6)])
    })
  }

  setPass(){
    const {password , confirmPassword} = this.setPassword.value;
    if(password !== confirmPassword)
      alert("Password doesn't match!");
    else{
      const code = this.route.snapshot.queryParams['oobCode'];
      this.auth.confirmPasswordReset(code, password).then(() => {
        this.router.navigate(['/login']);
      }).catch(err => {
        alert(err.code);
      })
    }
  }

}
