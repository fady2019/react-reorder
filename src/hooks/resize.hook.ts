import React from 'react';

const useResize = (target: Element | null) => {
    const [entry, setEntry] = React.useState<ResizeObserverEntry | null>(null);

    const resizeObserverRef = React.useRef(
        new ResizeObserver(([entry]) => {
            setEntry(entry);
        })
    );

    React.useEffect(() => {
        const observer = resizeObserverRef.current;

        if (target !== null) {
            observer.observe(target);
        }

        return () => {
            observer.disconnect();
        };
    }, [target]);

    return entry;
};

export default useResize;
