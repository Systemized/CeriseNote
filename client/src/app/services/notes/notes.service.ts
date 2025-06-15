import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INote } from '../../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }


  // getNotes() {
  //   return this.http.get('http://localhost:3000/api/notes', { withCredentials: true });
  // }
  getNotes(): Observable<INote[]> {
    return this.http.get<INote[]>('http://localhost:3000/api/notes', { 
      withCredentials: true 
    });
  }

  createNote(title: string, content: string) {    
    return this.http.post('http://localhost:3000/api/notes', { title, content }, { 
      withCredentials: true 
    });
  }

  updateNote(noteId: string, title: string, content: string) {
    return this.http.patch(`http://localhost:3000/api/notes/${noteId}`, { title, content }, {
      withCredentials: true
    });
  }

  deleteNote(noteId: string) {
    return this.http.delete(`http://localhost:3000/api/notes/${noteId}`, {
      withCredentials: true
    });
  }
}
  // getNotes() {
  //   return this.http.get('http://localhost:3000/api/notes', { withCredentials: true });
  // }

  // createNote(note: { title: string; content: string }) {
  //   return this.http.post('http://localhost:3000/api/notes', note, { withCredentials: true });
  // }

