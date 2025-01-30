import { Component } from '@angular/core';
import { ListComponent } from '../list/list.component';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-dashboard',
  imports: [ListComponent, TaskComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
