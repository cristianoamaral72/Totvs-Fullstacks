import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private visibilitySubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  // Método para obter o observable de visibilidade
  getVisibility(): Observable<boolean> {
    return this.visibilitySubject.asObservable();
  }

  show(): void {
    this.visibilitySubject.next(true);
  }

  hide(): void {
    this.visibilitySubject.next(false);
  }
}
