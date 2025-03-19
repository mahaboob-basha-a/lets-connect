import { configureStore } from '@reduxjs/toolkit';
import { globalStore } from './reducer';

export const store = configureStore({
    reducer:{chatStore: globalStore}
})