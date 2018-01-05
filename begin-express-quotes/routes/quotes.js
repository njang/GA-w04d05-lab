/* setting up router */
const express = require('express');
const quoteRoutes = express.Router();

/* getting quotes from database */
const quotesData = require('../db/quotes');

/* get all quotes */
quoteRoutes.get('/', function(req, res) {
  res.render('quotes/quotes-index', {
    quotes: quotesData,
    quoteClass: 'my-quote',
    documentTitle: 'Ada quotes!!'
  });
});

quoteRoutes.post('/', function(req, res) {
  quotesData.push({
    quote: req.body.quote,
    author: req.body.author,
    genre: req.body.genre,
  });
  res.redirect('/quotes');
});

/* add quote */

quoteRoutes.get('/add', function(req, res) {
  res.render('quotes/quotes-add', {
    documentTitle: 'Ada\'s Quotes!!',
  });
});

/* get individual quote */
quoteRoutes.get('/:id', function(req, res) {
  const id = req.params.id;
  res.render('quotes/quotes-single', { 
    documentTitle: 'Ada quotes!!',
    quoteClass: 'single-quote',
    quote: quotesData[id] 
  });
});

/* exporting */
module.exports = quoteRoutes;