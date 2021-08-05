import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import axios from 'axios';
import { Card, Row, Col, Button, Modal } from 'react-bootstrap';

const Giphy = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [search, setSearch] = useState('');
    const [show, setShow] = useState(false);
    const [gif, setGif] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
       const fetchData = async () => {
           setIsError(false);
           setIsLoading(true);

           try {
                const results = await axios('https://api.giphy.com/v1/gifs/trending', {
                    params: {
                        api_key: 'mTJ4fJICNLMJzaeOZjJL7ZA7RKMold3z',
                        limit: 100,
                    }
                });
                
                setData(results.data.data);
           } catch (ex) {
               setIsError(true);

               setTimeout(() => setIsError(false), 1000);
           }

           setIsLoading(false);
       };

       fetchData();
    }, []);

    const showModal = (id) => {
        const gif = data[data.findIndex(gif => gif.id === id)];
        console.log(gif);
        setGif(gif);
        handleShow();
    }

    const renderGifs = () => {
        if (isLoading) {
            return <Loader />
        }

        return (
            <Row xs={1} md={2} lg={3} className="g-4">
                {data.map(el => (
                    <Col key={el.id}>
                        <Card>
                            <Card.Img variant="top" src={el.images.fixed_width.url} onClick={() => showModal(el.id)} />
                        </Card>
                    </Col>
                ))}
            </Row>
        )
    };

    const renderError = () => {
        if (isError) {
            return (
                <div className="alert alert-warning alert-dismissable fade show" role="alert">
                    Unable to get Gifs, please try again
                </div>
            )
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsError(false);
        setIsLoading(true);

        try {
            const results = await axios('https://api.giphy.com/v1/gifs/search', {
                params: {
                    api_key: 'mTJ4fJICNLMJzaeOZjJL7ZA7RKMold3z',
                    q: search,
                    limit: 100,
                }
            });

            setData(results.data.data);
        } catch (ex) {
            setIsError(true);
            setTimeout(() => setIsError(false), 1000);
        }
        
        setIsLoading(false);        
    };

    const openGif = (url) => {
        window.navigator.clipboard.writeText(url);
        handleClose();
    }

    const viewGif = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
        handleClose();
    }

    return (
        <div className="m-2">
            {renderError()}
            <form className="form-inline justify-content-center m-2">
                <input 
                    value={search}
                    onChange={handleSearchChange}
                    type="text" 
                    placeholder="search" 
                    className="form-control" 
                />
                <Button 
                    type="submit" 
                    onClick={handleSubmit}
                    variant="primary"
                >Go
                </Button>
            </form>
            {gif && 
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{gif.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{gif.user && gif.user.description}</p>
                        <p>Click to copy: 
                            <a href="!#" onClick={() => openGif(gif.bitly_url)}>{gif.embed_url}</a>
                        </p>
                    </Modal.Body>            
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="secondary" onClick={() => viewGif(gif.bitly_url)}>Click to view</Button> 
                    </Modal.Footer>
                </Modal>
            }
            <div className="container gifs">{renderGifs()}</div>
        </div>
    )
};

export default Giphy;