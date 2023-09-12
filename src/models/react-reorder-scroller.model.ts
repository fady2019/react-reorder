import ScrollerFactory, { IScrollerParams } from './scroller-factory.model';

export class ReactReorderScroller {
    private static getFirstVerticalScrollableParent(element: HTMLElement | null): HTMLElement | null {
        if (element == null) {
            return null;
        }

        if (element.scrollHeight > element.clientHeight) {
            return element;
        } else {
            return this.getFirstVerticalScrollableParent(element.parentElement);
        }
    }

    private static getFirstHorizontalScrollableParent(element: HTMLElement | null): HTMLElement | null {
        if (element == null) {
            return null;
        }

        if (element.scrollWidth > element.clientWidth) {
            return element;
        } else {
            return this.getFirstHorizontalScrollableParent(element.parentElement);
        }
    }

    // -----------------------------------------------------------------------------------------------

    private horizontalScroller: (params: IScrollerParams) => void;
    private horizontalScrollerCleanup: () => void;
    private verticalScroller: (params: IScrollerParams) => void;
    private verticalScrollerCleanup: () => void;

    constructor(private observeScrolling?: () => void) {
        const horizontalScroll = ScrollerFactory.createScroller('horizontal');
        this.horizontalScroller = horizontalScroll.scroller;
        this.horizontalScrollerCleanup = horizontalScroll.scrollingCleanup;

        const verticalScroll = ScrollerFactory.createScroller('vertical');
        this.verticalScroller = verticalScroll.scroller;
        this.verticalScrollerCleanup = verticalScroll.scrollingCleanup;
    }

    private scrollParentVertically(target: HTMLElement | null, clientY: number) {
        const verticalElement = ReactReorderScroller.getFirstVerticalScrollableParent(target);

        if (verticalElement === null) {
            return;
        }

        this.verticalScroller({
            element: verticalElement,
            clientPos: clientY,
            observeScrolling: this.observeScrolling,
        });
    }

    private scrollParentHorizontally(target: HTMLElement | null, clientX: number) {
        const horizontalElement = ReactReorderScroller.getFirstHorizontalScrollableParent(target);

        if (horizontalElement === null) {
            return;
        }

        this.horizontalScroller({
            element: horizontalElement,
            clientPos: clientX,
            observeScrolling: this.observeScrolling,
        });
    }

    scrollParent(target: HTMLElement | null, clientX: number, clientY: number) {
        if (target === null) {
            return;
        }

        this.scrollParentVertically(target.parentElement, clientY);
        this.scrollParentHorizontally(target.parentElement, clientX);
    }

    parentScrollingCleanup() {
        this.verticalScrollerCleanup();
        this.horizontalScrollerCleanup();
    }
}

export default ReactReorderScroller;
