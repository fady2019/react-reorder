import {
    EReactReorderReducerActionType,
    IReactReorderReducerAction,
    IReactReorderReducerState,
} from '../models/react-reorder.model';

class ReactReorderUtil {
    static isItemVisitedByAnotherItem(params: {
        DOMRect?: DOMRect;
        draggingItemX?: number;
        draggingItemY?: number;
        notDragging?: boolean;
    }) {
        const { DOMRect, draggingItemX, draggingItemY, notDragging } = params;

        let isVisitedByAnotherItem = false;

        if (DOMRect && draggingItemX !== undefined && draggingItemY !== undefined && notDragging) {
            const { left, top, width, height } = DOMRect;

            isVisitedByAnotherItem =
                draggingItemX > left &&
                draggingItemX < left + width &&
                draggingItemY > top &&
                draggingItemY < top + height;
        }

        return isVisitedByAnotherItem;
    }

    static reactReorderReducer(
        state: IReactReorderReducerState,
        action: IReactReorderReducerAction
    ): IReactReorderReducerState {
        if (action.type === EReactReorderReducerActionType.END_DRAGGING) {
            return {};
        }

        if (action.type === EReactReorderReducerActionType.UPDATE_DRAGGING_DEST) {
            const { draggingDestId, isDraggingDestVisited } = action.payload;

            if (
                state.draggingDestId !== undefined &&
                !isDraggingDestVisited &&
                state.draggingDestId !== draggingDestId
            ) {
                return { ...state };
            }

            return {
                ...state,
                draggingDestId: isDraggingDestVisited ? draggingDestId : undefined,
            };
        }

        return { ...state, ...action.payload };
    }
}

export default ReactReorderUtil;
