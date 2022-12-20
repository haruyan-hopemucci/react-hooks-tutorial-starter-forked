import React from "react";
import { BookDescription } from "./BookDescription";
import noImage from './no-image.jpg';

type BookSearchItemProps = {
    description: BookDescription;
    onBookAdd: (book: BookDescription) => void;
};

const BookSearchItem = (props: BookSearchItemProps) => {
    const { title, authors, thumbnail } = props.description;
    const handleAddBookClick = () => {
        props.onBookAdd(props.description);
    };

    return (
        <div className="book-search-item">
            <h2 title={title}>{title}</h2>
            <div className="authors" title={authors}>
                {authors}
            </div>
            {thumbnail ? <img src={thumbnail} alt="" /> : <img src={noImage} alt="" /> }
            <div className="add-book" onClick={handleAddBookClick}>
                <span>+</span>
            </div>
        </div>
    );
};

export default BookSearchItem;