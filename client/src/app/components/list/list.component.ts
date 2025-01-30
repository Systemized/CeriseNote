import { Component } from '@angular/core';
import { ListTaskService } from '../../services/list-task.service';

@Component({
  selector: 'app-list',
  imports: [ListTaskService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

}
