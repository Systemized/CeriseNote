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
    this.noteTitle = this.selectedNote.title;
    this.noteContent = this.selectedNote.content
  }

  closeModal() {
    this.noteTitle = '';
    this.noteContent = '';
    this.selectedNote = null;
    this.fetchNotes();
  }

  createNote() {
    this.selectedNote = {
      _id: '',
      user_id: '',
      title: '',
      content: ''
    }
  }

  postNote() {
    this.noteTitle = this.selectedNote!.title;
    this.noteContent = this.selectedNote!.content;
    console.log(this.noteContent);
    console.log(this.noteTitle);
    
    this.noteTitle = this.noteTitle.trim();
    if (this.noteTitle) {   // Only runs if noteTitle isn't an empty string after trimming
      this.notesService.createNote(this.noteTitle, this.noteContent).subscribe({
        next: () => {
          this.closeModal();
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
      }
    });
  }


  deleteNote(noteId: string) {
    this.notesService.deleteNote(noteId).subscribe({
      next: () => {
        this.closeModal();
      }
    });
  }
}
