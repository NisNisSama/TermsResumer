import { useState, useEffect } from 'react';

const Blog = () =>{

    const [fetchedPage, setFetchedPage] = useState('');

    const isValidUrl = url => {
        let pattern =
          '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$'
        let regexQuery = new RegExp(pattern, 'i')
        return regexQuery.test(url) ? true : false
    }

    useEffect(
        () => {
            fetch("https://reactjs.org/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022.html", )
                .then(response => response.text())
                .then(responseText => {
                const responseDocument = (new DOMParser()).parseFromString(responseText, 'text/html');
                console.log(responseDocument.head.textContent);
                console.log(responseDocument.body.textContent);
                setFetchedPage(responseDocument);
            });
        }
    )

    return (<><div>{fetchedPage.body}</div></>);
};

export default Blog;