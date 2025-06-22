import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFile } from '../../Interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  getFiles(): Observable<IFile[]> {
    return this.http.get<IFile[]>(`${this.apiUrl}/files`, {
      withCredentials: true
    });
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.apiUrl}/files/upload`, formData, {
      withCredentials: true
    });
  }

  deleteFile(fileKey: string): Observable<any> {
    const encodedKey = encodeURIComponent(fileKey);
    return this.http.delete(`${this.apiUrl}/files/${encodedKey}`, {
      withCredentials: true
    });
  }
}
