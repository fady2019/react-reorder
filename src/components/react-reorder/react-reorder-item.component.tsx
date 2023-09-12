import React from 'react';

import useResize from '../../hooks/resize.hook';
import { TReactReorderItemComponent } from '../../models/react-reorder.model';
import ReactReorderUtil from '../../utils/react-reorder.utils';

import classes from './react-reorder.styles.module.css';

const ReactReorderItem: React.FC<TReactReorderItemComponent> = (props) => {
    const {
        itemId,
        draggingItemId,
        draggingItemX,
        draggingItemY,
        itemClasses,
        children,
        draggingDestinationSettingHandler,
        ...restProps
    } = props;

    const itemRef = React.useRef<HTMLLIElement>(null);

    // is this item dragging
    const isDragging = draggingItemId !== undefined && draggingItemId === itemId;
    // there's an item drags but it's not this item
    const notDragging = draggingItemId !== undefined && !isDragging;

    // is there any item drags over this item
    const isVisitedByAnotherItem = ReactReorderUtil.isItemVisitedByAnotherItem({
        DOMRect: itemRef.current?.getBoundingClientRect(),
        draggingItemX,
        draggingItemY,
        notDragging,
    });

    const [itemInitWidth, setItemInitWidth] = React.useState<number | undefined>();
    const [itemInitHeight, setItemInitHeight] = React.useState<number | undefined>();

    const itemsContainerResizingEntry = useResize(itemRef.current);
    const { inlineSize, blockSize } = itemsContainerResizingEntry?.borderBoxSize[0] || {};

    const draggingDestinationSettingHandlerRef = React.useRef(draggingDestinationSettingHandler);

    //--------------------------------------------------------------------------------------------------------------

    React.useLayoutEffect(() => {
        draggingDestinationSettingHandlerRef.current = draggingDestinationSettingHandler;
    });

    React.useLayoutEffect(() => {
        if (!isDragging) {
            setItemInitWidth(inlineSize);
            setItemInitHeight(blockSize);
        }
    }, [isDragging, inlineSize, blockSize]);

    React.useEffect(() => {
        if (!itemId || !draggingDestinationSettingHandlerRef.current) {
            return;
        }

        draggingDestinationSettingHandlerRef.current(isVisitedByAnotherItem, itemId);
    }, [isVisitedByAnotherItem, itemId]);

    //--------------------------------------------------------------------------------------------------------------

    const itemStyles: any = isDragging
        ? {
              '--dragging-item-x': `${draggingItemX}px`,
              '--dragging-item-y': `${draggingItemY}px`,
              '--dragging-item-width': `${itemInitWidth}px`,
              '--dragging-item-height': `${itemInitHeight}px`,
          }
        : {};

    const itemClassNameArray = [
        classes['list__item'],
        isDragging ? classes['list__item--dragging'] : '',
        notDragging ? classes['list__item--not-dragging'] : '',
        isVisitedByAnotherItem ? classes['list__item--visited'] : '',
        itemClasses,
    ];

    const itemClassName = itemClassNameArray.filter((c) => !!c?.trim()).join(' ');

    return (
        <li {...restProps} ref={itemRef} style={itemStyles} className={itemClassName}>
            {children}
        </li>
    );
};

export default ReactReorderItem;
