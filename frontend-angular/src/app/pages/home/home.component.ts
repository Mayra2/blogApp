import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Auth } from '../../classes/auth';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  message = "";

  constructor( private http: HttpClient){
    this.http.get('http://localhost:3000/api/user')
    .subscribe(
      (user: any)=>{
        this.message = `Hi ${user.first_name} ${user.last_name}.
        Good to see you again!`;
        Auth.authEmitter.emit(true);
      },
      ()=>{
        this.message = 'Not logged in!';
        Auth.authEmitter.emit(false);
      }    )
  }


}
