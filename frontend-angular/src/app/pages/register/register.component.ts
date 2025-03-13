import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form!: FormGroup;
  

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient, 
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required],
    });
  }
    
  isPasswordValid(): boolean {
    const passwordControl = this.form.get('password');
    return passwordControl ? passwordControl.value.length >= 8 : false;
  }

  submit(): void {
    const formData = this.form.getRawValue();

    if ( !this.isPasswordValid()) {
      console.error('Password is too short.');
      return;
    }

    this.http.post('http://localhost:3000/api/register', formData)
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => console.error('Error in registration process:', err),
      });
  }
  
}