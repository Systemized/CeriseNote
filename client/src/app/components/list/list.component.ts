import { Component, EventEmitter, Output, inject, Inject } from '@angular/core';
import { ListTaskService } from '../../services/list-task.service';
import { List } from '../../interfaces';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
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
import { DialogRef } from '@angular/cdk/dialog';
import { MatTabsModule } from '@angular/material/tabs'

@Component({
  selector: 'app-list',
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly listTaskService = inject(ListTaskService);

  lists: List[] = [];
  selectedListId: string | null = null;
  newListName: string = '';

  @Output() listSelected = new EventEmitter<string>();

  ngOnInit(): void {
    this.fetchLists();
  }

  fetchLists(): void {
    this.listTaskService.getLists().subscribe((lists) => {
      this.lists = lists;
    });
  }

  selectList(listId: string): void {
    this.selectedListId = listId;
    this.listSelected.emit(listId);
  }

  // KEEP BECAUSE IT WORKS, BUT NOT USED SINCE "createList() and deleteList()" USED IN DIALOGS
  // createList(): void {
  //   this.listTaskService.createList({ name: this.newListName }).subscribe(() => {
  //     this.newListName = '';
  //     this.fetchLists();
  //   });
  // }
  // deleteList(listId: string): void {
  //   this.listTaskService.deleteList(listId).subscribe(() => {
  //     this.fetchLists();
  //   })
  // }


  // Edit Dialog
  readonly dialog = inject(MatDialog);

  openEditList(): void {
    const dialogRef = this.dialog.open(listEditComponent, {
      data: { lists: this.lists, name: this.newListName }, height:'425px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.lists.some(list => list._id === result)) { // If result exists in lists, it's a delete action
        this.listTaskService.deleteList(result).subscribe(() => {
          this.fetchLists();
        });
      } else { // Otherwise, new list creation
        this.listTaskService.createList({ name: result }).subscribe(() => {
          this.fetchLists();
        });
      }

    });
  }
}


// ------------------------------ EDIT LIST DIALOG COMPONENT ------------------------------
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'listEdit',
  templateUrl: './listEdit.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatListModule,
    MatTabsModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
})
export class listEditComponent {

  newListName: string = '';
  selectedListId: string | null = null;
  lists: List[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { lists: List[], name: string }
  ) {
    this.lists = data.lists || [];  // Assign lists from dialog data
  }

  readonly dialogRef = inject(MatDialogRef<listEditComponent>);

  createList(): void {
    if (this.newListName.trim()) {
      this.dialogRef.close(this.newListName)
    }
  }

  selectList(listId: string): void {
    this.selectedListId = listId;
  }

  deleteList(): void {
    if (this.selectedListId) {
      this.dialogRef.close(this.selectedListId);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}