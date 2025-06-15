import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFile } from '../../Interfaces';


@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) { }

  getFiles(): Observable<IFile[]> {
    return this.http.get<IFile[]>('http://localhost:3000/api/files', {
      withCredentials: true
    });
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`http://localhost:3000/api/files/upload`, formData, {
      withCredentials: true
    });
  }

  deleteFile(fileKey: string): Observable<any> {
    const encodedKey = encodeURIComponent(fileKey);
    return this.http.delete(`http://localhost:3000/api/files/${encodedKey}`, {
      withCredentials: true
    });
  }
}
