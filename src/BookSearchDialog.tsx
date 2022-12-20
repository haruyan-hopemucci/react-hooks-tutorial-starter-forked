import React, { useState, useEffect } from "react";
import { BookDescription } from "./BookDescription";
import BookSearchItem from "./BookSearchItem";

// 書籍検索APIに関する処理群
const buildSearchUrl = (title: string, author: string, maxResults: number): string => {
    const url = "https://www.googleapis.com/books/v1/volumes?q=";
    const conditions: string[] = [];
    if (title) {
        conditions.push(`intitle:${title}`);
    }
    if (author) {
        conditions.push(`inauthor:${author}`);
    }
    return `${url}${conditions.join('+')}&maxResults=${maxResults}`;
}

const extractBooks = (json: any): BookDescription[] => {
    const items: any = json.items;
    return items.map((item: any) => {
        const volumeInfo: any = item.volumeInfo;
        return {
            title: volumeInfo.title,
            authors: volumeInfo.authors ? volumeInfo.authors.join(',') : "著者名なし",
            thumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.smallThumbnail : ""
        };
    });
}

type BookSearchDialogProps = {
    maxResults: number;
    onBookAdd: (book: BookDescription) => void;
};

const BookSearchDialog = (props: BookSearchDialogProps) => {
    const [books, setBooks] = useState([] as BookDescription[]);
    // 検索条件のタイトルと著者
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    // 検索中状態
    const [isSearching, setIsSearching] = useState(false);

    // effect
    useEffect(() => {
        if (isSearching) {
            const url = buildSearchUrl(title, author, props.maxResults);
            fetch(url)
                .then(res => res.json())
                .then(json => extractBooks(json))
                .then(books => setBooks(books))
                .catch(error => console.error(error));

        };
        setIsSearching(false);
    }, [isSearching, title, author, props]);


    // inputのコールバック関数
    const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    const handleAuthorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(e.target.value);
    };
    const handleSearchClick = () => {
        if (!title && !author) {
            alert('タイトルまたは著者を入力してください。');
            return;
        }
        // TODO: 検索処理
        setIsSearching(true);
    }
    const handleBookAdd = (book: BookDescription) => {
        props.onBookAdd(book);
    }

    // bookItem一覧
    const bookItems = books.map((b, idx) => {
        return (
            <BookSearchItem
                key={idx}
                description={b}
                onBookAdd={b => handleBookAdd(b)}
            />
        );
    });

    return (
        <div className="dialog">
            <div className="operation">
                <div className="conditions">
                    <input
                        type="text"
                        onChange={handleTitleInputChange}
                        placeholder="タイトルで検索"
                    />
                    <input
                        type="text"
                        onChange={handleAuthorInputChange}
                        placeholder="著者名で検索"
                    />
                </div>
                <div className="button-like" onClick={handleSearchClick}>
                    検索
                </div>
            </div>
            <div className="search-results">{bookItems}</div>
        </div>
    );
};

export default BookSearchDialog;