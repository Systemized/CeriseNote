import { Component } from '@angular/core';
import { ListTaskService } from '../../services/list-task.service';

@Component({
  selector: 'app-task',
  imports: [ListTaskService],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

}
