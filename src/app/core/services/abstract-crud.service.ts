import { Subject, BehaviorSubject, Observable, tap, catchError, throwError } from "rxjs";
import { PaginatedData } from "../models/paginated-data.class";
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";

export abstract class AbstractCrudService<T> {
  // Subject used to notify that an entity has changed, use it if you need refresh list of entities thas has changed from another components for example.
  protected entityChanged: Subject<void> = new Subject();
  entityChanged$ = this.entityChanged.asObservable();

    // BehaviorSubject used to do somethings between components, like patchvalue a form after creation.
  private activeEntity = new BehaviorSubject<T | null>(null);
  activeEntity$ = this.activeEntity.asObservable();

  // Inject `HttpClient` automatically
  protected http = inject(HttpClient);

  constructor(protected apiUrl: string) {}

  clearActiveEntity(): void {
    this.activeEntity.next(null);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  getAll(params: any = { pagination: false }): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl, { params });
  }

  // The entity that is created is automatically added to the behavior subject, so if you want to patch something after creation, just use the observable entityState$.
  create(data: Partial<T>, save: boolean = true): Observable<T> {
    return this.http.post<T>(this.apiUrl, data).pipe(
      tap((createdEntity: T) => {
        if (save) this.activeEntity.next(createdEntity); // !Save the created entity in the behavior subject, it's true by default, but maybe you don't want to save it, so you can set it to false if needed.
        this.entityChanged.next(); // notify that the entity has changed
      }),
    );
  }

  update(data: Partial<T>, save: boolean = false): Observable<T> {
    const id = (data as any).id;
    if (!id) {
      throw new Error('ID is required to update the entity.');
    }
    return this.http.patch<T>(`${this.apiUrl}/${id}`, data).pipe(
      tap((updatedEntity: T) => {
        if (save) this.activeEntity.next(updatedEntity); //!Save the updated entity in the behavior subject, it's false by default unlike create, but maybe you want to save it, so you can set it to true if needed.
        this.entityChanged.next(); // notify that the entity has changed
      }),
    );
  }

  getPaginated(page: number = 1, pagesize: number = 20): Observable<PaginatedData<T>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pagesize.toString());

    return this.http.get<PaginatedData<T>>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching paginated data', error);
        return throwError(() => new Error('Error fetching paginated data'));
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.entityChanged.next()) // notify that the entity has changed
    );
  }
}
