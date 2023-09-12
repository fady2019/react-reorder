import React from 'react';

import ReactReorder from './components/react-reorder/react-reorder.component';

import './App.css';

import img1 from './assets/images/img1.jpg';
import img2 from './assets/images/img2.jpg';
import img3 from './assets/images/img3.jpg';
import img4 from './assets/images/img4.jpg';
import img5 from './assets/images/img5.jpg';

const BOXES = [
    { id: '1', content: 'box 1' },
    { id: '2', content: 'box 2' },
    { id: '3', content: 'box 3' },
    { id: '4', content: 'box 4' },
    { id: '5', content: 'box 5' },
    { id: '6', content: 'box 6' },
    { id: '7', content: 'box 7' },
    { id: '8', content: 'box 8' },
    { id: '9', content: 'box 9' },
    { id: '10', content: 'box 10' },
    { id: '11', content: 'box 11' },
    { id: '12', content: 'box 12' },
];

const ITEMS = [
    { id: '1', item: 'Up', icon: '&uarr;' },
    { id: '2', item: 'Right', icon: '&rarr;' },
    { id: '3', item: 'Down', icon: '&darr;' },
    { id: '4', item: 'Left', icon: '&larr;' },
    { id: '5', item: 'Up (2)', icon: '&uarr;' },
    { id: '6', item: 'Right (2)', icon: '&rarr;' },
    { id: '7', item: 'Down (2)', icon: '&darr;' },
    { id: '8', item: 'Left (2)', icon: '&larr;' },
];

const IMAGES = [
    { id: '1', img: img1 },
    { id: '2', img: img2 },
    { id: '3', img: img3 },
    { id: '4', img: img4 },
    { id: '5', img: img5 },
];

function App() {
    const [boxes, setBoxes] = React.useState(BOXES);
    const [items, setItems] = React.useState(ITEMS);
    const [images, setImages] = React.useState(IMAGES);

    return (
        <div>
            <ReactReorder
                className="container"
                itemClasses="box"
                items={boxes}
                itemFormatter={({ content }) => content}
                getReorderedItemHandler={(reorderedItems) => setBoxes(reorderedItems)}
            />

            <br />
            <hr />
            <br />

            <ReactReorder
                className="container list-container"
                itemClasses="item"
                items={items}
                itemFormatter={({ item, icon }) => (
                    <>
                        <span className="item-icon" dangerouslySetInnerHTML={{ __html: icon }}></span>
                        <span>{item}</span>
                    </>
                )}
                getReorderedItemHandler={(reorderedItems) => setItems(reorderedItems)}
            />

            <br />
            <hr />
            <br />

            <ReactReorder
                className="container images-container"
                itemClasses="image"
                items={images}
                itemFormatter={({ id, img }) => <img src={img} alt={`img-${id}`} />}
                getReorderedItemHandler={(reorderedImages) => setImages(reorderedImages)}
            />
        </div>
    );
}

export default App;
