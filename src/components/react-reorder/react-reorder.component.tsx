import React from 'react';

import ReactReorderItem from './react-reorder-item.component';

import { EReactReorderReducerActionType, TReactReorderComponent } from '../../models/react-reorder.model';
import ReactReorderUtil from '../../utils/react-reorder.utils';
import ReactReorderScroller from '../../models/react-reorder-scroller.model';

import classes from './react-reorder.styles.module.css';

function ReactReorder<T>(props: TReactReorderComponent<T>) {
    const { items, itemClasses, className, getReorderedItemHandler, itemFormatter, ...restProps } = props;

    const [state, dispatch] = React.useReducer(ReactReorderUtil.reactReorderReducer, {});

    const itemsContainerRef = React.useRef<HTMLUListElement>(null);

    const scroller = React.useRef(
        new ReactReorderScroller(() => {
            // this function gets called while the closest scrollable parent is scrolling
            // make current draggingDestId not visited while scroll
            handleDraggingDestinationSetting(false, state.draggingDestId);
        })
    );

    const handleDragStarting = (e: React.PointerEvent<HTMLLIElement>, draggingItemId: string) => {
        // if we drag using a mouse then drag only when we hold the element by the left mouse button
        if (e.pointerType === 'mouse' && e.button !== 0) {
            return;
        }

        dispatch({
            payload: {
                draggingItemId,
                draggingId: e.pointerId,
                draggingItemX: e.clientX,
                draggingItemY: e.clientY,
            },
        });
    };

    const handleDragging = (e: React.PointerEvent<HTMLUListElement>) => {
        if (e.pointerId !== state.draggingId) {
            return;
        }

        // get dragging element and scroll its scrollable parent if any and required
        const element = e.target as HTMLElement;
        const draggingElement = element.closest(`.${classes['list__item']}`) as HTMLElement;
        scroller.current.scrollParent(draggingElement, e.clientX, e.clientY);

        dispatch({
            payload: {
                draggingItemX: e.clientX,
                draggingItemY: e.clientY,
            },
        });
    };

    const handleDragEnding = () => {
        const srcId = state.draggingItemId;
        const destId = state.draggingDestId;

        /*
            in case that an item is dragged and dropped over another item. 
            So we have to update their positions. Well, how we do that?

            Let's take two examples1

            items = [0, 1, 2, 3, 4]

            EX1: 
            - let's simulate dragging 0 over 2 then drop it there (in items array)
            - here we don't want to swap between them but we want to move 0 to the position of 2
              and shift all the elements starting from 1 (the next item to 0) and ending with 2
              to the left

            - updated items = [1, 2, 0, 3, 4]

            EX2:
            - let's simulate dragging 3 over 0 then drop it there (in items array) 
            - here we want to move 3 to the position of 0 and shift all the elements 
              starting from 0 and ending with 2 (the item before 3) to the right
              
            - updated items = [3, 0, 1, 2, 4]

            HOW CAN WE DO THAT IN JS?
            using the "splice" method! we need to use it twice.
            one time for deleting the src item (the item that starts dragging),
            and another time for inserting it after the dest item (the item that the src item is dropped on)

            this is how to do it in code  ==>  _items.splice(destIdx, 0, _items.splice(srcIdx, 1)[0]);
                
        */
        if (srcId !== undefined && destId !== undefined && getReorderedItemHandler) {
            const srcIdx = items.findIndex((item) => item.id === srcId);
            const destIdx = items.findIndex((item) => item.id === destId);

            let _items = [...items];
            _items.splice(destIdx, 0, _items.splice(srcIdx, 1)[0]);

            getReorderedItemHandler(_items);
        }

        // cleanup the parent scrolling if any
        scroller.current.parentScrollingCleanup();

        dispatch({
            type: EReactReorderReducerActionType.END_DRAGGING,
        });
    };

    const handleDraggingDestinationSetting = (isVisited: boolean, draggingDestId?: string) => {
        dispatch({
            type: EReactReorderReducerActionType.UPDATE_DRAGGING_DEST,
            payload: {
                draggingDestId,
                isDraggingDestVisited: isVisited,
            },
        });
    };

    return (
        <ul
            {...restProps}
            ref={itemsContainerRef}
            className={`${classes['list__container']} ${className}`}
            onPointerMove={handleDragging}
            onPointerUp={handleDragEnding}
            onPointerCancel={handleDragEnding}
            onPointerLeave={handleDragEnding}
        >
            {items.map((item) => {
                const isDragging = state.draggingItemId === item.id;

                return (
                    <React.Fragment key={item.id}>
                        {isDragging && (
                            <ReactReorderItem itemClasses={`${classes['list__item-copy']} ${itemClasses}`}>
                                {itemFormatter(item)}
                            </ReactReorderItem>
                        )}

                        <ReactReorderItem
                            itemId={item.id}
                            draggingItemId={state.draggingItemId}
                            draggingItemX={state.draggingItemX}
                            draggingItemY={state.draggingItemY}
                            itemClasses={itemClasses}
                            draggingDestinationSettingHandler={handleDraggingDestinationSetting}
                            onPointerDown={(e) => handleDragStarting(e, item.id)}
                        >
                            {itemFormatter(item)}
                        </ReactReorderItem>
                    </React.Fragment>
                );
            })}
        </ul>
    );
}

export default ReactReorder;
