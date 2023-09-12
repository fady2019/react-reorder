export enum EReactReorderReducerActionType {
    UPDATE_DRAGGING_DEST,
    END_DRAGGING,
}

export interface IReactReorderReducerAction {
    type?: EReactReorderReducerActionType;
    payload?: any;
}

export interface IReactReorderReducerState {
    draggingItemId?: string;
    draggingId?: number;
    draggingItemX?: number;
    draggingItemY?: number;
    draggingDestId?: string;
    isDraggingDestVisited?: boolean;
}

export type TReactReorderItemComponent = React.PropsWithChildren<
    {
        itemId?: string;
        draggingItemId?: string;
        draggingItemX?: number;
        draggingItemY?: number;
        itemClasses: React.HTMLAttributes<HTMLLIElement>['className'];
        draggingDestinationSettingHandler?: (isVisited: boolean, draggingDestId: string) => void;
    } & React.HTMLAttributes<HTMLLIElement>
>;

export type TReactReorderComponent<T> = React.PropsWithChildren<
    {
        items: (T & { id: string })[];
        itemClasses?: React.HTMLAttributes<HTMLLIElement>['className'];
        getReorderedItemHandler?: (items: (T & { id: string })[]) => void;
        itemFormatter: (item: T & { id: string }) => React.ReactNode;
    } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>
>;
