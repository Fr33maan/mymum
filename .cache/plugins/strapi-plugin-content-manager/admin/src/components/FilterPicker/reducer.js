import { fromJS } from 'immutable';
import moment from 'moment';

const initialState = fromJS({
  attributes: {},
  initialData: [],
  modifiedData: [],
});

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FILTER':
      return state.update('modifiedData', list =>
        list.push(fromJS(action.filter))
      );
    case 'ON_CHANGE': {
      const [index, key] = action.keys;

      return state
        .updateIn(['modifiedData', ...action.keys], () => {
          if (action.value._isAMomentObject === true) {
            return moment(action.value, 'YYYY-MM-DD HH:mm:ss').format();
          }
          return action.value;
        })
        .updateIn(['modifiedData', index, 'value'], value => {
          if (key === 'name') {
            const attributeType = state.getIn([
              'attributes',
              action.value,
              'type',
            ]);

            return attributeType === 'boolean' ? 'true' : '';
          }

          return value;
        });
    }
    case 'REMOVE_FILTER':
      return state.removeIn(['modifiedData', action.index]);
    case 'RESET_FILTERS':
      return initialState;
    case 'SET_FILTERS':
      return state
        .update('attributes', () => fromJS(action.attributes))
        .update('initialData', () => fromJS(action.initialFilters))
        .update('modifiedData', () => fromJS(action.initialFilters));
    default:
      return state;
  }
}

export default reducer;
export { initialState };
