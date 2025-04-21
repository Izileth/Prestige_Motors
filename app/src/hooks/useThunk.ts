import { useAppDispatch } from '~/src/hooks/hooks';
import { useCallback } from 'react';
import type { AsyncThunkAction } from '@reduxjs/toolkit';
import { unwrapResult } from '@reduxjs/toolkit';

    export function useThunk() {
    const dispatch = useAppDispatch();

    return useCallback(<T>(thunkAction: AsyncThunkAction<T, any, any>) => {
        return dispatch(thunkAction).then(unwrapResult);
    }, [dispatch]);
}