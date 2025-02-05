import { Component, Input } from '@angular/core';
import { ListTaskService } from '../../services/list-task.service';
import { ListComponent } from '../list/list.component';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Task } from '../../interfaces';

@Component({
  selector: 'app-task',
  imports: [CommonModule, ListComponent, MatListModule, MatCardModule, MatDividerModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() listId: string | null = null;
  tasks: Task[] = [];

  constructor(private listTaskService: ListTaskService) { }

  ngOnChanges(): void {
    if (this.listId) {
      this.fetchTasks();
    }
  }

  fetchTasks(): void {
    if (!this.listId) return;
    this.listTaskService.getTasks(this.listId).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }
}
