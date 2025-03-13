import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {
 form!: FormGroup;
 cls ='';
 msg ='';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
 
  submit(): void {
    const formData = this.form.getRawValue();
    const email = formData.email

    this.http.post(`http://localhost:3000/api/reset/forgot`, {email: email})
      .subscribe({
        next: () => {
          this.cls='success'
          this.msg='Email was sent!'
        },
        error: (err) => {
          this.cls='danger'
          this.msg='Email does not exist!'
        },
      });
  }
}
