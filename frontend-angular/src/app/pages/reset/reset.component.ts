import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent {
 form!: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required],
    });
  }


  submit(): void {
    const formData = this.form.getRawValue();
    const data = {
      token: this.route.snapshot.params['token'],
      password: formData.password,
      passwordConfirm: formData.passwordConfirm
    }
    this.http.post('http://localhost:3000/api/reset/reset', formData)
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => console.error('Error in registration process:', err),
      });
  }
  
}

