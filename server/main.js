const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mkQuery = require('./db');
const request = require('request-promise-native');
const app = express();

app.use(morgan('tiny'));
app.use(cors());
const PORTNUMBER = parseInt(process.env.PORT) || 3000;

const SEARCH_BOOK_BY_TITLE_OR_AUTHOR = 'select * from book2018 where authors like ? or title like ? limit ? offset ?';
const SEARCH_BOOK_BY_BOOKID = 'select * from book2018 where book_id = ?';

const searchBookByTitleOrAuthor = mkQuery(SEARCH_BOOK_BY_TITLE_OR_AUTHOR);
const searchBookByBookdID = mkQuery(SEARCH_BOOK_BY_BOOKID);

app.get('/api/search', (req, resp) => {
    const terms = req.query.terms;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    searchBookByTitleOrAuthor([`%${terms}%`, `%${terms}%`, limit, offset]).then(results => {

        let booksResponse = {
            data: results.map(v => {
                v.authors = v.authors.split("|");
                return v
            }),
            terms: terms,
            timestamp: (new Date()).getTime(),
            total: results.length,
            limit: limit,
            offset: offset
        }
        resp.status(200).json(booksResponse)
    }).catch(err => {
        resp.status(404).json({ status: 404, message: err, timestamp: (new Date()).getTime() });
    })
})


app.get('/api/book/:book_id', (req, resp) => {
    const book_id = req.params.book_id;
    searchBookByBookdID([book_id]).then(result => {
        if (result.length == 0) {
            resp.status(404).json({
                status: 404,
                message: err,
                timestamp: (new Date()).getTime()
            })
        }
        let bookResponse = {
            data: result.map(v => {
                v.genres = v.genres.split("|")
                return v;
            }),
            timestamp: (new Date()).getTime()
        }
        resp.status(200).json(bookResponse);
    }).catch(err => {
        resp.status(404).json({
            status: 404,
            message: err,
            timestamp: (new Date()).getTime()
        })
    })

})

app.get('/api/book/:book_id/review', (req, resp) => {
    const title = req.query.title;
    const url = `https://api.nytimes.com/svc/books/v3/reviews.json?title=${title}&api-key=${require('./API_token').token}`;
    request.get(url).then(result => {
        let reviewResponse = {
            data: JSON.parse(result).results,
            timestamp: (new Date()).getTime()
        }
        console.log("before retuning ,", reviewResponse)
        resp.status(200).json(reviewResponse)
    }).catch(err => {
        resp.status(404).json({
            status: 404,
            message: err,
            timestamp: (new Date()).getTime()
        })
    })

})
app.listen(PORTNUMBER, () => {
    console.log(`App started, listening on ${PORTNUMBER}`)
})