import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INote } from '../../Interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  // getNotes() {
  //   return this.http.get('http://localhost:3000/api/notes', { withCredentials: true });
  // }
  getNotes(): Observable<INote[]> {
    return this.http.get<INote[]>(`${this.apiUrl}/notes`, { 
      withCredentials: true 
    });
  }

  createNote(title: string, content: string) {    
    return this.http.post(`${this.apiUrl}/notes`, { title, content }, { 
      withCredentials: true 
    });
  }

  updateNote(noteId: string, title: string, content: string) {
    return this.http.patch(`${this.apiUrl}/notes/${noteId}`, { title, content }, {
      withCredentials: true
    });
  }

  deleteNote(noteId: string) {
    return this.http.delete(`${this.apiUrl}/notes/${noteId}`, {
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

