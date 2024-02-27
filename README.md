# Re:read

Your Personal library for adding your favorite quotes and notes on your digital book  
this is a place to store and Re:read the notes for your favorite books.

#### Why Did I Build It

Reading is a hobby of mine and I love to jot down notes on my books whenever there are things that are interesting on the page that I'm currently reading, but the problem with this approach is that there isn't enough real estate to write long paragraphs, as if you're conversing with the author.

#### What Did I Learn

- I've learned to create an in-memory database to easily update, add and delete items from the local storage api of the browser using a singleton design pattern which holds the data and the core functionality of the web application. The reason why I used a singleton pattern for my in-memory storage was that so I could have a global object that acts as an interface to the browser's local storage api to easily reuse these functionalities and also to abstract the complicated parts from the client (the functions or code that uses the LibraryStorage or the in-memory database).

- I learned how to use TypeScript's Generics for reusabilty of a function that can have an arbitrary type defined by the user.

##### TODOs

- [ ] Fix Page Header Jerking when users scroll down on the page.

#### Preview
![Screenshot from 2024-02-28 01-20-54](https://github.com/Sty6x/re-read/assets/53662191/5062405d-20e9-4ed1-8f14-88b5ae955e61)
![Screenshot from 2024-02-28 01-21-16](https://github.com/Sty6x/re-read/assets/53662191/1cb199a0-d660-4c10-a850-5bf1cae02d29)
![Screenshot from 2024-02-28 01-21-16](https://github.com/Sty6x/re-read/assets/53662191/6fae13a2-c416-460a-9e79-50d0c82f77e5)
![Screenshot from 2024-02-28 01-23-21](https://github.com/Sty6x/re-read/assets/53662191/e395972d-b820-4184-b82e-4df9f2c858fb)
