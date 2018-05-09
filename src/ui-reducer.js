import { types } from './actions';

const reducers = {
  [types.selectColor]: (state, { payload }) => (
    { ...state, selectedColor: payload.color }
  ),
  [types.unselectColor]: state => (
    { ...state, selectedColor: null }
  ),
};

const defaultState = { selectedColor: null };

export default function uiReducer(state = defaultState, action) {
  const reducer = reducers[action.type];
  if (reducer) return reducer(state, action);
  return state;
}
