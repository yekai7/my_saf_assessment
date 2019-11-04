import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BookResponse, ErrorResponse } from './../models';
import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  constructor(private bookSvc: BookService, private actRoute: ActivatedRoute, private router: Router) { }
  book: BookResponse = null;
  id;
  title;
  ngOnInit() {
    this.id = this.actRoute.snapshot.params.book_id;
    this.bookSvc.getBook(this.id).then(result => {
      this.book = result;
      this.title = result.data[0].title;
    }).catch(err => {
      const errorResponse = err as ErrorResponse;
      alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
    })

    this.bookSvc.getReview(this.id, this.title).then(reviewResult => {
      console.log("review result", reviewResult)
    }).catch(err => {
      const errorResponse = err as ErrorResponse;
      alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
    })
  }

  back() {
    this.router.navigate(['/']);
  }



}
