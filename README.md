# Express Views 👀

### Learning Objectives 
- Describe the concept of "templating" at a high level
- Create templates and render views in an Express application
- Apply EJS syntax to insert data into HTML
- Render partials and iterate over data in views
- Differentiate between `res.send`, `res.render`, and `res.redirect`
- Analyze pages to spot what elements could be abstracted into partials

# What _is_ a view, anyway?

We made a pretty cool app yesterday that serves quotes in JSON format based on what route you visit. But what if we wanted to look at those quotes on a page instead of just looking at a big JSON object? That's where views come in. 

**The term "view" in the context of a full-stack application refers to what a visitor to the site sees when the page loads.** Views are how the information in the database -- the model -- is represented in the browser.

### View engines (a.k.a templating engines)

We're probably all familiar with the term "template" -- a document that already has some details in place, but needs to have the rest of them filled in. **Templating engines** in JavaScript allow us to fill in the blanks in our HTML with JavaScript without having to do a ton of string concatenation or DOM manipulation (😖).

For example, consider the following two blocks of code, which have more or less the same end result:

```js
// adding a paragraph with DOM methods
const myName = 'j';
const myDiv = document.querySelector('#mydiv');
const newParagraph = document.createElement('p');
newParagraph.innerHTML = `Hello, my name is ${myName}.`;
const newLink = document.createElement('a');
newLink.setAttribute('href', `/${myName}`);
newLink.innerHTML = 'Learn more!';
newParagraph.appendChild(newLink);
myDiv.appendChild(newParagraph);
```

```js
// adding a paragraph with string concatenation
const myName = 'j';
const myDiv = document.querySelector('#myDiv');
let nameParagraph = '<p>';
nameParagraph +=       `Hello, my name is ${myName}.`;
nameParagraph +=       `<a href='/${myName}'>Learn More</a>`;
nameParagraph +=    '</p>';
myDiv.innerHTML = nameParagraph;
```

Neither of these are particularly fun. The first is tedious, and the second -- while looking like HTML, more or less -- just feels bad. Having a Node backend gives us the ability to use a templating engine, which is one solution to this problem.

## We'll be using a templating engine called EJS.

EJS stands for **Effective JavaScript** (or Embedded JavaScript), and it lets us inject JavaScript directly into our HTML by surrounding it with special marker tags.

Here's what the above blocks of code would look like in EJS:

```html
<% const myName = 'j'; %>
<div id='mydiv'>
  <p>
    Hello, my name is <%= myName %>. 
    <a href='/<%= myName %>'>Learn more</a>
  </p>
</div>
```

Short and sweet, right? Notice the `<% %>` and `<%= %>` tags in the above block. These are what allow us to inject JavaScript into our HTML. (Personally, I think they look like sideways ice cream cones 🍦 but usually end up calling them clown tags.)

- `<% %>` allows us to declare variables, do loops, do conditionals, etc. Normal JavaScript-y things.
- `<%= %>` allows us to output the values of variables.
- There are a few other clown tag variations. You can check them out [in the EJS docs](http://ejs.co/).

Files that use EJS have to have the extension `.ejs`. For example: `index.ejs`.

We'll see some examples of this in a few minutes, after we learn how to...

### Add a templating engine to an Express app!

Adding the view engine is a fairly straightforward process.

- Install the templating engine of choice. We're using EJS, so the command is `npm install ejs --save`.
- Create the `views` directory right inside `begin-express-quotes` -- not in any of the subfolders. Inside it, create a file called `index.ejs`. This will be blank for now.
- In between the port setup and the static file setup in `app.js`, we're going to add two lines, one to tell the app where to look for our templates and the other telling it what kind of template to expect.

```js
// where to look for the template:
//       | what we're setting
//       V           v where to look for the views
app.set('views', path.join(__dirname, 'views'));
// what kind of template:
//       | what we're setting
//       V               v what kind of view engine to expect
app.set('view engine', 'ejs');

```

Now what?

### `res.render`

Yesterday, we used `res.send`, which is a method on the response object that allows us to send data back to the client. `res.render` is a similar concept, except it allows us to first put all that data into a template.

Here's what the syntax for rendering an index page with a `'hello world!` message looks like:

```js
//              | what file to look for (`views/[whatever].ejs`, in this case `views/index.ejs`)
//              V        v an object that contains the data we're sending
res.render('index', { message: 'Hello world!' });
```

This can go in place of `res.send` in the `app.get` function.

```js
app.get('/', function(req, res) {
  res.render('index', { message: 'Hello world!'});
});

```

Then we can use `message` in our `index.ejs` file, like so:

```html
<h1><%= message %></h1>
<!-- outputs `<h1>Hello world!</h1>`  -->
```

This is cool, but not that exciting. Let's pass in some more data.

```js
app.get('/', function(req, res) {
  res.render('index', { 
    message: 'Hello world!',
    documentTitle: 'Ada quotes!!',
    subTitle: 'Read some of the coolest quotes around.'
  });
});
```

Now we can access all of these variables in our EJS.

# Templating with conditionals and loops

One of the powerful things about EJS is that it allows us to adjust the page layout based on what data is passed to it. Let's add some dynamic content to our index page.

### Conditionals

First, let's add a boolean to the object we're sending to the view:

```js
// in app.js
app.get('/', function(req, res) {
  res.render('index', {
    message: 'Hello World!',
    documentTitle: 'Ada quotes!!',
    subTitle: 'Read some of the coolest quotes around.',
    showMore: true,
  });
});
```

Then, we can access it in `index.ejs`:

```html
<% if (showMore === true) { %>
  <div class='more'>
    <p>Ada Quotes is a compilation of favorite quotes from the students of NYC-WDI-Ada. It's super cool and great.</p>
  </div>
<% } %>
```

- What do we notice about this syntax?
- What happens if we change the `showMore` value in `app.js`?

### Loops

Using a loop in your view feels similar to using a conditional. Add this to `index.ejs`:

```html
<% for (let i = 0; i < 10; i++) { %>
  <p>This is loop # <%= i %> </p>
<% } %>
```

And we can loop through arrays that we pass to the view as well.

```js
// in app.js
app.get('/', function(req, res) {
  res.render('index', {
    message: 'Hello World!',
    documentTitle: 'Ada quotes!!',
    subTitle: 'Read some of the coolest quotes around.',
    showMore: true,
    quoteAuthors: ['Unknown', 'Yoda', 'CS Lewis', 'Frank Chimero', 'Pablo Picasso', 'Italo Calvino', 'T. S. Eliot', 'Samuel Beckett', 'Hunter S. Thompson'],
  });
});

```

```html
<!-- in index.ejs -->
<p>We have quotes by <% quoteAuthors.forEach(function(author) { %>
  <%= author %>,
<% }) %>.</p>
```

## 🚀 Mini-Lab: Let's all get on the same...view.

In the `begin-express-quotes` directory, there's a starter express app that's just like the quotes app we built yesterday. Spend 15 or 20 minutes updating it to look like what we just coded in class. Refer back to this lecture markdown for the steps, and if you finish early, help out the people around you.

Here's a refresher on the steps:

1. Install the ejs package from NPM (`npm install --save ejs`)
2. Create a `views` directory with an `index.ejs`
3. Set the view engine and views directory in `app.js`
4. Update `app.get` to use `res.render` and pass in some data
5. Template out `index.ejs` to utilize the data
6. Keep refreshing the page to check your work!

If you're really stuck, here's the source code for how it should look so far:

<details>
<summary><code>app.js</code></summary>

```js
/* setting up express */
const express = require('express');
const logger = require('morgan');
const path = require('path');
const app = express();

/* importing routes */
const quoteRoutes = require('./routes/quotes');

/* setting up port & listen */
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});

/* setting up views */
app.set('views', './views');
app.set('view engine', 'ejs');

/* setting static file */
app.use('/static', express.static(path.join(__dirname, 'public')));
/* setting up logging */
app.use(logger('dev'));

/* setting routes */
app.get('/', function(req, res) {
  res.render('index', {
    message: 'Hello World!',
    documentTitle: 'Ada quotes!!',
    subTitle: 'Read some of the coolest quotes around.',
    showMore: true,
    quoteAuthors: ['Unknown', 'Yoda', 'CS Lewis', 'Frank Chimero', 'Pablo Picasso', 'Italo Calvino', 'T. S. Eliot', 'Samuel Beckett', 'Hunter S. Thompson'],
  });
});
app.use('/quotes', quoteRoutes);

/* handling 404 */
app.get('*', function(req, res) {
  res.status(404).send({message: 'Oops! Not found.'});
});

```
</details>

<details>
<summary><code>views/index.ejs</code></summary>

```html
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <meta http-equiv='X-UA-Compatible' content='ie=edge' />
  <title><%= documentTitle %></title>
  <link rel='stylesheet' type='text/css' href='static/styles/reset.css'>
<link rel='stylesheet' type='text/css' href='static/styles/style.css'>
</head>
<body>

<div class='hero'>
  <h1><%= message %></h1>
  <h3><%= subTitle %></h3>
</div>

<% if (showMore === true) { %>
<div class='more'>
<p>Ada Quotes is a compilation of favorite quotes from the students of NYC-WDI-Ada. It's super cool and great.</p>
</div>
<% } %>

<p>We have quotes by <% quoteAuthors.forEach(function(author, index) { %>
  <% if (index !== quoteAuthors.length - 1) { %>
    <%= author %>,
  <% } else { %>
    <%= author%>
  <% } %>
<% }) %>.</p>
  
</body>
</html>
```

</details>


**NOTE:** VSCode is pretty good with EJS code hinting. [This extension](https://marketplace.visualstudio.com/items?itemName=QassimFarid.ejs-language-support) adds a little extra color coding.

# Adding additional views & using partials

### All quotes view

Yesterday, we had a `/` route and a `/quotes` route. We already have the routes set up. Let's set up some views for them!

- In `views` make a new directory `quotes`. 
- In the `views/quotes` directory, make a new file, `quotes-index.ejs`. (**NOTE**: It's a good idea to separate the views for your different routes into different folders, and name them as descriptively as possible. Otherwise, as your app grows, you'll lose track of what goes where and so on.)
- Change the route for `/` in `routes/quotes.js` so that it uses `res.render` instead of `res.send`. Pass in the `quotes/quotes-index` view and the `quotesData` object, as well as the document title.
- In `quotes-index.ejs`, make sure there's an HTML5 boilerplate (don't forget the stylesheets!) and then loop through the quotes array, adding the title, author, and genre of each one to the page.
- Check out the page in the browser!!


#### Result: 

<details>
<summary><code>routes/quotes.js</code></summary>

```js
/* setting up router */
const express = require('express');
const quoteRoutes = express.Router();

/* getting quotes from database */
const quotesData = require('../db/quotes');

/* get all quotes */
quoteRoutes.get('/', function(req, res) {
  res.render('quotes/quotes-index', {
    documentTitle: 'Ada\'s Quotes!!',
    quotesData: quotesData,
  });
});

/* get individual quote */
quoteRoutes.get('/:id', function(req, res) {
  const id = req.params.id;
  res.send(quotesData[id]);
});

/* exporting */
module.exports = quoteRoutes;
```

</details>

<details>
<summary><code>views/quotes/quote-index.ejs</code></summary>

```html
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <meta http-equiv='X-UA-Compatible' content='ie=edge' />
  <title><%= documentTitle %></title>
  <link rel='stylesheet' type='text/css' href='/static/styles/reset.css'>
  <link rel='stylesheet' type='text/css' href='/static/styles/style.css'>
</head>
<body>

<a href='/quotes/add'>Add a quote!</a>

<div class='quotes'>
  <% quotesData.forEach(function(quote, index) { %>
    <div class='my-quote'>
      <h3><%=quote.quote%></h3>
      <div class='meta'>
        <span class='author'><%=quote.author%></span>
        <span class='genre'><%=quote.genre.toUpperCase()%></span>
      </div>
      <a href='/quotes/<%= index %>'>Go to page</a>
    </div>
  <% }) %>
</div>
  
</body>
</html>
```

</details>

## 🚀 Lab 2: Keep working in `begin-express-quotes` directory!

By the end of this lab, your app should have:

- A view for the `/quotes` route.

## Single quote view

We already have the route for a single quote set up, and it already delivers just one quote. Let's build it out just like we did the all-quotes page.

- In `views/quotes`, make a file `quotes-single.ejs`.
- Change the route for `/:id` in `routes/quotes.js` so that it uses `res.render` instead of `res.send`. Pass in the `quotes/quotes-single` view and the element of the `quotesData` array that matches the given id, as well as the document title.
- In `quotes-single.ejs`, make sure there's an HTML5 boilerplate (don't forget the stylesheets!) and then display the quote on the page.
- Check out a few quotes in the browser!
- Also, now we can add a link to each individual quote page in `quotes-index.ejs`.

#### Result

<details>
<summary><code>routes/quotes.js</code></summary>

```js
/* setting up router */
const express = require('express');
const quoteRoutes = express.Router();

/* getting quotes from database */
const quotesData = require('../db/quotes');

/* get all quotes */
quoteRoutes.get('/', function(req, res) {
  res.render('quotes/quotes-index', {
    documentTitle: 'Ada\'s Quotes!!',
    quotesData: quotesData,
  });
});

/* get individual quote */
quoteRoutes.get('/:id', function(req, res) {
  const id = req.params.id;
  res.render('quotes/quotes-single', {
    documentTitle: 'Ada\'s Quotes!!',
    quote: quotesData[id],
  });
});

/* exporting */
module.exports = quoteRoutes;
```

</details>

<details>
<summary><code>views/quotes/quotes-single.ejs</code></summary>

```html
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <meta http-equiv='X-UA-Compatible' content='ie=edge' />
  <title><%= documentTitle %></title>
  <link rel='stylesheet' type='text/css' href='/static/styles/reset.css'>
  <link rel='stylesheet' type='text/css' href='/static/styles/style.css'>
</head>
<body>
  <div class='single-quote'>
    <h3><%= quote.quote %></h3>
    <div class='meta'>
      <span class='author'><%= quote.author %></span>
      <span class='genre'><%= quote.genre.toUpperCase() %></span>
    </div>
  </div>


  <a href='/quotes'>Return to quotes index</a>

</body>
</html>
```

</details>

### Modularizing our EJS

Let's take a look at the views files we have so far. What do they all have in common? We can abstract some of those out using **partials**.

Partials are pretty much what the name sounds like -- parts of your HTML that can be inserted into any document. For example, if we were to abstract the HTML5 boilerplate to its own `boilerplate.ejs` file, we could put it at the top of any file by saying:

```html
<% include ./partials/boilerplate %>
```

OR

```html
<% include ../partials/boilerplate %>
```

(Depending on where in the views directory you are.)

Let's do this together. I also like abstracting the `</body></html>` tags to their own partial, for neatness: `end.ejs`.

You can even nest partials inside of other partials. For example, if we decided to make a `navigation.ejs` partial and add a menu bar, we could include it in the `boilerplate.ejs` partial.

## 🚀 Lab 3: Keep working in `begin-express-quotes` directory!

By the end of this lab, your app should have:

- A view for the `/quotes/[number]` route
- A `boilerplate.ejs` partial and an `end.ejs` partial
- BONUS: Try creating a navigation partial or a footer partial. Include them in the boilerplate or end partials, respectively.

# The CRUD view pattern

### What is CRUD?

CRUD, in the web development context, stands for **C**reate, **R**ead, **U**pdate, **D**elete. Most apps are, at their core, CRUD apps: creating, updating, editing, and deleting information like Facebook posts, Pinterest pins, Etsy listings, etc. is essential. 

So in the end, our `views/quotes` directory would look something like this:

```bash
quotes
  ├── quotes-index [`/quotes`]
  ├── quotes-add [`/quotes/add`]
  ├── quotes-single [`/quotes/:id`]
  └── quotes-single-edit [`/quotes/:id/edit`]
```

There's no specific delete page -- we can have delete buttons `quotes-index` and `quotes-single`. And `quotes-single-edit` is specific to the quote we want to edit.

Today we're only going to talk about the post route. Edit and delete are harder to do without a database.

### Creating the `/quotes/add` route

First, let's create a very simple form view, `views/quotes/quotes-add.ejs`:

```html
<% include ../partials/boilerplate %>
 
<form method='POST' action='/quotes'>
  <input name='quote' type='text' />
  <input type='submit' value='Submit!' />
</form>

<% include ../partials/end %>
```

This might look a little different from forms you've seen so far, notably the `method` and `action` attributes.

- `method` just refers to the type of HTTP action we're taking. It will nearly always be `POST` in all caps.
- `action` refers to the endpoint the form will post its data to. In this case, just the `quotes` main route.

Next, we have to create the route for the form. **IMPORTANT**: This **MUST** go above the "get individual quotes" route.

```js
/* add quote route */
quoteRoutes.get('/add', function(req, res) {
  res.render('quotes/quotes-add', {
    documentTitle: 'Ada\'s Quotes!!',
  });
});
```

Okay, now the form is rendering. Cool.

### Getting the data from the form

Because the form is making a `POST` action to the backend, we need a `post` route to catch it. For now, that will look like this:

```js
/* post to quotes */
quoteRoutes.post('/', function(req, res) {
  console.log(req);
});
```

In order to get the data out of the request object, we need to introduce a new middleware: `body-parser`.

1. `npm install --save body-parser`
2. In `app.js`, right below `const logger = require('morgan');`:
    - `const bodyParser = require('body-parser');`
3. In `app.js`, right below `app.use(logger('dev'));`:
    - `app.use(bodyParser.json());`
    - `app.use(bodyParser.urlencoded({ extended: false }));`

Now, back in our quotes routes, let's change our console.log to `req.body`.

### Extending the form and adding the object to the quotes database

Let's add a few more fields to the form.

In `views/quotes/quotes-add.ejs`:

```html
<% include ../partials/boilerplate %>
 
<form method='POST' action='/quotes'>
  <input name='quote' type='text' placeholder='Quote' />
  <input name='author' type='text' placeholder='Author' />
  <input name='genre' type='text' placeholder='Genre' />
  <input type='submit' value='Add it!' />
</form>

<% include ../partials/end %>
```

Now we can access the data in our `quoteRoutes.post` route. How would we add it to the "database"?

And, if you've noticed -- the server just hangs after it logs the data. That's annoying. Let's fix it.

### `res.redirect`

So far, we've used `res.send`, `res.json`, and `res.render`. Another commonly-used response object method is `res.redirect`. It's most commonly used on pages like this, where the desired behavior after an action is complete is to redirect to a page. Pretty self-explanatory.

So far, our `post` route looks like this:

```js
/* post to quotes */
quoteRoutes.post('/', function(req, res) {
  quotesData.push({
    quote: req.body.quote,
    author: req.body.author,
    genre: req.body.genre,
  });
});
```

Let's add another line after the `.push()`:

```js
/* post to quotes */
quoteRoutes.post('/', function(req, res) {
  quotesData.push({
    quote: req.body.quote,
    author: req.body.author,
    genre: req.body.genre,
  });
  res.redirect('/quotes');
});
```

Notice that instead of being able to use a relative url (like we did when we set up the `get` route for quotes), we're using the actual path the browser will follow.

Cool?

Lab time!

## 🚀 Lab 4: Let's get caught up again.

Finally, we're at the end of our adventure -- we have a quotes website that we can add quotes to, visit quote pages, and generally just enjoy. Take the next block of time to make your `begin-express-quotes` directory look like what we did together in class. If you need a hint, check out the `final-express-quotes` directory -- it should look exactly like what we did together. 
