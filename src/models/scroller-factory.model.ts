export interface IScrollerParams {
    element: HTMLElement;
    clientPos: number;
    observeScrolling?: () => void;
}

class ScrollerFactory {
    static createScroller(direction: 'horizontal' | 'vertical', scrollDelay: number = 50) {
        let interval: NodeJS.Timer | null = null;

        const scrollDirection = direction === 'horizontal' ? 'left' : 'top';
        const destinationDiff = 100;
        const scrollingValue = 25;

        const scrollingCleanup = () => {
            if (interval !== null) {
                clearInterval(interval);
            }
        };

        const scroller = (params: IScrollerParams) => {
            const { element, clientPos, observeScrolling } = params;

            scrollingCleanup();

            interval = setInterval(() => {
                const offsetLeftOrTop = direction === 'horizontal' ? element.offsetLeft : element.offsetTop;
                const scrollLeftOrTop = direction === 'horizontal' ? element.scrollLeft : element.scrollTop;
                const clientWidthOrHeight =
                    direction === 'horizontal' ? element.clientWidth : element.clientHeight;
                const scrollWidthOrHeight =
                    direction === 'horizontal' ? element.scrollWidth : element.scrollHeight;

                const pos = Math.ceil(clientPos - offsetLeftOrTop);
                const currScrollPos = Math.ceil(scrollLeftOrTop);
                const maxScroll = Math.ceil(scrollWidthOrHeight - clientWidthOrHeight);

                if (pos < destinationDiff && currScrollPos > 0) {
                    element.scroll({ [scrollDirection]: currScrollPos - scrollingValue });
                } else if (clientWidthOrHeight - pos < destinationDiff && currScrollPos < maxScroll) {
                    element.scroll({
                        [scrollDirection]: currScrollPos + scrollingValue,
                    });
                } else {
                    return scrollingCleanup();
                }

                if (observeScrolling) {
                    observeScrolling();
                }
            }, scrollDelay);
        };

        return { scroller, scrollingCleanup };
    }
}

export default ScrollerFactory;
