import { Component, OnInit, } from '@angular/core';
import { NotesService } from '../../services/notes/notes.service';
import { FormsModule } from '@angular/forms';
import { INote } from '../../INote';

// ChangeDetectorRef fixes New post modal not working upon login.
// Without this, Page needs to be reloaded first make new posts.
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(public notesService: NotesService, private cdr: ChangeDetectorRef) { }

  notes: INote[] = []
  noteTitle = '';
  noteContent = '';
  selectedNote: INote | null = null;

  ngOnInit() {
    this.fetchNotes();
    // this.fetchFiles();     // After fetchFiles is implemented
  }

  // ------- NOTES -------
  fetchNotes() {
    this.notesService.getNotes().subscribe({
      next: (data: INote[]) => {
        this.notes = data;
        this.cdr.detectChanges();
      }
    })
  }

  openModal(note: INote) {
    this.selectedNote = note;
    this.noteTitle = this.selectedNote.title;
    this.noteContent = this.selectedNote.content;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.noteTitle = '';
    this.noteContent = '';
    this.selectedNote = null;
    this.cdr.detectChanges();
  }

  createNote() {
    this.selectedNote = {
      _id: '',
      user_id: '',
      title: '',
      content: ''
    }
    this.cdr.detectChanges();
  }

  postNote() {
    this.noteTitle = this.selectedNote!.title;
    this.noteContent = this.selectedNote!.content;

    this.noteTitle = this.noteTitle.trim();
    if (this.noteTitle) {   // Only runs if noteTitle isn't an empty string after trimming
      this.notesService.createNote(this.noteTitle, this.noteContent).subscribe({
        next: () => {
          this.closeModal();
          this.fetchNotes();
        }
      });
    }
  }


  updateNote(noteId: string) {
    this.noteTitle = this.selectedNote!.title;
    this.noteContent = this.selectedNote!.content;

    this.notesService.updateNote(noteId, this.noteTitle, this.noteContent).subscribe({
      next: () => {
        this.closeModal();
        this.fetchNotes();
      }
    });
  }


  deleteNote(noteId: string) {
    this.notesService.deleteNote(noteId).subscribe({
      next: () => {
        this.closeModal();
        this.fetchNotes();
      }
    });
  }

  // ------- FILES -------
  uploadFile() {
    // To be added
  }
}
