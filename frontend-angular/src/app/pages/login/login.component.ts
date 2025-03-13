import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 form!: FormGroup;
  

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient, 
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
 
  submit(): void {
    const formData = this.form.getRawValue();


    this.http.post('http://localhost:3000/api/login', formData)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Error in login process:', err),
      });
  }
  
}

