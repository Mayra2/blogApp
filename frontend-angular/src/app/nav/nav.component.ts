import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../classes/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav',
  imports: [
    RouterLink, 
    RouterLinkActive, 
    RouterOutlet, 
    CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})

export class NavComponent {
  authenticated = false;

  constructor(
    private http: HttpClient,
    private router: Router  
  ) {
   
    Auth.authEmitter.subscribe(
      (authenticated:boolean)=>{
        this.authenticated = authenticated;
      }
    )
  }

  logout() {
   this.http.post('http://localhost:3000/api/logout', {})
   .subscribe(()=>{this.router.navigate(['/login'])})
    ;  
  }
}

  