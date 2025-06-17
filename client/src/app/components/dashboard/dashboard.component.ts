import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

// ChangeDetectorRef fixes New post modal not working upon login.
// Without this, Page needs to be reloaded first make new posts.
// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotesService } from '../../services/notes/notes.service';
import { FilesService } from '../../services/files/files.service';
import { FormsModule } from '@angular/forms';
import { INote, IFile } from '../../Interfaces';


@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(
    public notesService: NotesService,
    public filesService: FilesService,
    private cdr: ChangeDetectorRef
  ) { }

  notes: INote[] = []
  noteTitle = '';
  noteContent = '';
  selectedNote: INote | null = null;

  ngOnInit() {
    this.fetchNotes();
    this.fetchFiles();     // After fetchFiles is implemented
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
    this.fetchNotes();
    // this.cdr.detectChanges();
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
          // this.fetchNotes();
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
        // this.fetchNotes();
      }
    });
  }


  deleteNote(noteId: string) {
    this.notesService.deleteNote(noteId).subscribe({
      next: () => {
        this.closeModal();
        // this.fetchNotes();
      }
    });
  }



  // ------- FILES -------

  files: IFile[] = [];
  isUploading = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  fetchFiles() {
    this.filesService.getFiles().subscribe({
      next: (data: IFile[]) => {
        this.files = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching files:', err)
    });
  }

  openFile(key: string) {
    console.log(key);
    
  }

  // This method is triggered by the button click
  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  // This method is triggered by the (change) event on the input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isUploading = true;

      this.filesService.uploadFile(file).subscribe({
        next: (res) => {
          console.log('Upload successful', res);
          this.isUploading = false;
          this.fetchFiles();
        },
        error: (err) => {
          console.error('Error uploading file:', err);
          this.isUploading = false;
          alert('File upload failed!'); // To be replaced with better notification
        }
      });
    }
  }
  deleteFile(fileKey: string) {
    // Add a confirmation dialog for better UX
    if (confirm('Are you sure you want to delete this file?')) {
      this.filesService.deleteFile(fileKey).subscribe({
        next: () => {
          console.log('File deleted successfully');
          this.fetchFiles(); // Refresh list after deleting
        },
        error: (err) => {
          console.error('Error deleting file:', err);
          alert('Failed to delete file.'); // Replace with a better notification
        }
      });
    }
  }
}