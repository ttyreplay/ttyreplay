
Binary Search
=============

Example
-------

Suppose you have an array of chapters in a book.

    var book = [
      { page: 0, chapter: 'Front Cover' }
    , { page: 2, chapter: 'Preamble' }
    , { page: 5, chapter: 'Table of Contents' }
    , { page: 8, chapter: 'Chapter 1' }
    , { page: 29, chapter: 'Chapter 2' }
    , { page: 48, chapter: 'Chapter 3' }
    ]

You can create an array that contains just the page number of each chapter

    var pages = book.map(function(chapter) { return chapter.page })
      , search = Bsearch(pages)

...and pass it to `Bsearch`.  
It returns a function you can use.

Now let's ask: I'm on page 20, what chapter I'm in?

    console.log(book[search(20)].chapter)

