import { Component, Input, inject, Inject } from '@angular/core';
import { ListTaskService } from '../../services/list-task.service';
// import { ListComponent } from '../list/list.component';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Task } from '../../interfaces';
import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// import { DialogRef } from '@angular/cdk/dialog';       // Not used in this code, but angular materials docs had this, idk y
import { MatTabsModule } from '@angular/material/tabs'


@Component({
  selector: 'app-task',
  imports: [CommonModule, MatListModule, MatCardModule, MatDividerModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() listId: string | null = null;
  tasks: Task[] = [];
  newTaskTitle: string = '';

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

  readonly dialog = inject(MatDialog);

  openEditTask(): void {
    const dialogRef = this.dialog.open(TaskEditComponent, {
      data: { tasks: this.tasks, title: this.newTaskTitle }, height: '400px', width: '325px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {   // If user made changes, and clicked saved or delete
        if (this.tasks.some(task => task._id === result)) { // If result exists in lists, it's a delete action
          this.listTaskService.deleteTask(result).subscribe(() => {
            this.fetchTasks();
          });
        } else if (typeof result === 'object' && result.title) {
          // Ensure result is an object with a task title
          this.listTaskService.createTask({
            title: result.title,
            desc: result.desc || '',  // Use empty string if no description is provided
            listId: this.listId as string
          }).subscribe(() => {
            this.fetchTasks();
          });
        }
      } else {
        console.log('Edit Task Cancelled');
      }
    });
  }
}



import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'taskEdit',
  templateUrl: './taskEdit.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    // MatDialogClose,
    MatListModule,
    MatTabsModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
})
export class TaskEditComponent {

  newTaskTitle: string = '';
  newTaskDesc: string = '';
  selectedTaskId: string | null = null;
  tasks: Task[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tasks: Task[], title: string }
  ) {
    this.tasks = data.tasks || [];  // Assign lists from dialog data
  }

  readonly dialogRef = inject(MatDialogRef<TaskEditComponent>);

  createTask(): void {
    if (this.newTaskTitle.trim()) {
      this.dialogRef.close({ title: this.newTaskTitle, desc: this.newTaskDesc })
    }
  }

  selectTask(taskId: string): void {
    this.selectedTaskId = taskId;
  }

  deleteTask(): void {
    if (this.selectedTaskId) {
      this.dialogRef.close(this.selectedTaskId);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}