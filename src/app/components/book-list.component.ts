import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { SearchCriteria, ErrorResponse, BooksResponse } from '../models';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  limit = 10;
  offset = 0;
  terms = '';

  books: BooksResponse = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute
    , private bookSvc: BookService) { }

  ngOnInit() {
    const state = window.history.state;
    console.log(state)
    if (!state['terms'])
      return this.router.navigate(['/']);

    this.terms = state.terms;
    this.limit = state.limit || 10;

    const searchCriterial: SearchCriteria = {
      terms: this.terms,
      limit: this.limit,
    }
    this.bookSvc.getBooks(searchCriterial)
      .then(result => {
        this.books = result;
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
  }

  next() {
    //TODO - for Task 4
    this.bookSvc.getBooks({
      terms: this.terms,
      offset: this.offset += 10,
      limit: this.limit
    })
      .then(result => {
        if (result.data.length == 0) {
          alert("You've reached the end of results.");
        } else {
          this.books = result;
        }
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
  }

  previous() {
    //TODO - for Task 4
    if ((this.offset - 10) < 0) {
      alert("You've reach the first result!")
    } else {
      this.bookSvc.getBooks({
        terms: this.terms,
        offset: this.offset -= 10,
        limit: this.limit
      })
        .then(result => {
          this.books = result;
        }).catch(error => {
          const errorResponse = error as ErrorResponse;
          alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
        })
    }
  }
  bookDetails(book_id: string) {
    //TODO
    console.info('Book id: ', book_id);
    this.router.navigate(['/book', book_id]);
  }

  back() {
    this.router.navigate(['/']);
  }

}
