import { Component, OnInit, } from '@angular/core';
import { NotesService } from '../../services/notes/notes.service';
import { FormsModule } from '@angular/forms';
import { INote } from '../../INote';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(public notesService: NotesService) { }

  notes: INote[] = []
  noteTitle = '';
  noteContent = '';
  selectedNote: INote | null = null;

  ngOnInit() {
    this.fetchNotes();
  }

  fetchNotes() {
    this.notesService.getNotes().subscribe({
      next: (data: INote[]) => {
        this.notes = data;
      }
    })
  }

  openModal(note: INote) {
    this.selectedNote = note;
    console.log(this.selectedNote);
  }

  closeModal() {
    this.selectedNote = null;
  }

  createNote() {
    this.noteTitle = this.noteTitle.trim();
    if (this.noteTitle) {   // Only runs if noteTitle isn't an empty string after trimming
      this.notesService.createNote(this.noteTitle, this.noteContent).subscribe({
        next: () => {
          this.noteTitle = '';
          this.noteContent = '';
          this.fetchNotes();
        }
      });
    }
  }


  updateNote() {

  }

  deleteNote() {

  }
}
