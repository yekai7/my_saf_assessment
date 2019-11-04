import { Injectable } from "@angular/core";
import { SearchCriteria, BooksResponse, BookResponse, ReviewResponse } from './models';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class BookService {
  constructor(private http: HttpClient) { }

  getBooks(searchCriteria: SearchCriteria): Promise<BooksResponse> {
    //TODO - for Task 3 and Task 4
    const f = this.http.get<BooksResponse>(`http://localhost:3000/api/search?terms=${searchCriteria.terms}&limit=${searchCriteria.limit}&offset=${searchCriteria.offset}`).toPromise();
    return (f);
  }

  getBook(bookId: string): Promise<BookResponse> {
    //TODO - for Task 5
    const f = this.http.get<BookResponse>(`http://localhost:3000/api/book/${bookId}`).toPromise();
    return (f);
  }

  getReview(bookId:string, title: string): Promise<ReviewResponse> {
    const params = new HttpParams().set("title",title)
    // console.log("TITLE in getViewSvc", params)
    const f = this.http.get<ReviewResponse>(`http://localhost:3000/api/book/${bookId}/review`,{params}).toPromise();
    return f;
  }
}
