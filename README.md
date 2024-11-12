# React Reorder

Simple drag and drop functionality built in React.js using the JavaScript pointer events. Mainly it's made to reorder a list of items, images and so on.

## Example
```React.js
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

function App() {
    const [boxes, setBoxes] = React.useState(BOXES);
  
    return (
        <ReactReorder
            className="container"
            itemClasses="box"
            items={boxes}
            itemFormatter={({ content }) => content}
            getReorderedItemHandler={(reorderedItems) => setBoxes(reorderedItems)}
        />;
    )
}
```

Check out the [App.tsx](https://github.com/fady2019/react-reorder/blob/master/src/App.tsx) file for more examples

## Demo
[See the live Demo](https://fady2019.github.io/react-reorder/)

<br/>

<h3 align="center">Don’t hesitate to reach out to me for any optimization suggestions or any collaboration.</h3>
