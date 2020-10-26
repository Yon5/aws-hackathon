import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  title = 'engineering-excellence-ss';

  toggle = true;
  status = "Enable";

  enableDisableRule(job) {

    this.toggle = !this.toggle;
    this.status = this.toggle ? "Enable" : "Disable";
  }
  ngOnInit(){

  }
}
