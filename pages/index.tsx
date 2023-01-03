import { useState } from "react";
import type { NextPage, GetServerSideProps } from "next";
import { Container, Header, Item } from 'semantic-ui-react'
import "semantic-ui-css/semantic.min.css";

//レスポンスの型
interface Book {
  id: number
  isbn: number
}
type Books = Book[];

interface BookDetail {
  id: number
  isbn: number
  items: [
    {
      volumeInfo: {
        title: string
        imageLinks: {
          smallThumbnail: string,
          thumbnail: string
        }
      }
    }
  ]
}
type BookDetails = BookDetail[];

const fetchBooks = async (): Promise<Books> => {
  const books = await fetch("http://localhost:80/books")
  const res = (await books.json()) as Books
  return res;
};

const fetchBookDetail = async (id:number, isbn: number): Promise<BookDetail> => {
  const detail = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
  const res = (await detail.json()) as BookDetail
  res.id = id
  res.isbn = isbn
  return res
};

interface IndexPageProps {
  books: Books
  bookDetails: BookDetails,
}

const IndexPage: NextPage<IndexPageProps> = ({ books, bookDetails }) => {
  return (
    <Container text>
      <Header as='h2'>BOOK</Header>
      <p>BOOK</p>
      <Item.Group divided>
          {bookDetails.map((data, index) => {
            return (
              <Item key={index}>
                <Item.Image size='tiny' src={data.items[0].volumeInfo.imageLinks.smallThumbnail} />
                <Item.Content verticalAlign='middle'>{ data.items[0].volumeInfo.title }</Item.Content>
              </Item>
            );
          })}
      </Item.Group>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<
  IndexPageProps
> = async () => {
  const books = await fetchBooks();
  const bookDetails = await Promise.all(books.map(async (element) => {
    return fetchBookDetail(element.id, element.isbn)
  }))

  return {
    props: {
      books: books,
      bookDetails: bookDetails,
    },
  };
};

export default IndexPage;