import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./App.css";
import { BookToRead } from "./BookToRead";
import BookRow from "./BookRow";
import BookSearchDialog from "./BookSearchDialog";
import { BookDescription } from "./BookDescription";

Modal.setAppElement('#root');
// モーダル用カスタムスタイル
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)"
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: 0,
    transform: "translate(-50%, -50%)"
  }
};

// localStorageのアクセスキー
const APP_KEY = 'haruyan-react-hooks-tutorial';

const App = () => {
  const [books, setBooks] = useState([] as BookToRead[]);
  // モーダルの開閉に関するstate
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // 初回ロード時にbooksをlocalStorageから取得する
  useEffect(() => {
    const storedBooksJson = localStorage.getItem(APP_KEY);
    if(storedBooksJson){
      const storedBooks: BookToRead[] = JSON.parse(storedBooksJson);
      setBooks(storedBooks);
    }
  }, []);

  // booksが変更されたら内容をlocalStorageに書き込む
  useEffect(() => {
    localStorage.setItem(APP_KEY, JSON.stringify(books));
  }, [books]);

  /** 指定idの書籍をstateから削除する */
  const handleBookDelete = (id: number) => {
    const newBooks = books.filter(b => id !== b.id);
    setBooks(newBooks);
  }
  const handleBookAdd = (book: BookDescription) => {
    const newBook: BookToRead = {...book, id: Date.now(), memo: ""};
    const newBooks = [...books, newBook];
    setBooks(newBooks);
    setModalIsOpen(false);
  }
  // モーダル開閉処理
  const handleAddClick = () => {
    setModalIsOpen(true);
  }
  const handleModalClose = () => {
    setModalIsOpen(false);
  }

  const handleBookMemoChanged = (id: number, memo: string) => {
    const newBooks = books.map(b => {
      return b.id === id ? { ...b, memo: memo } : b
    });
    setBooks(newBooks);
  }

  const bookRows = books.map(b => {
    return (
      <BookRow book={b} key={b.id} onMemoChange={(id, memo) => handleBookMemoChanged(id, memo)} onDelete={id => handleBookDelete(id)} />
    );
  });

  return (
    <div className="App">
      <section className="nav">
        <h1>読みたい本リスト</h1>
        <div className="button-like" onClick={handleAddClick}>本を追加</div>
      </section>
      <section className="main">
        {bookRows}
      </section>

      <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose} style={customStyles}>
        <BookSearchDialog maxResults={20} onBookAdd={(b) => handleBookAdd(b)} />
      </Modal>

    </div>
  );
};

export default App;
