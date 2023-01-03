import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-loader',
  templateUrl: './project-loader.component.html',
  styleUrls: ['./project-loader.component.css']
})

export class ProjectLoaderComponent implements OnInit {
length:any  = [0,1,3,4,5]
  constructor() { }

  ngOnInit() {
  }

}
