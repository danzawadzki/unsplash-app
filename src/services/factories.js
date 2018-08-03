// @flow

/**
 * Async Reducer Factory to reduce duplicated code in async reducers.
 * Higher Order Reducer.
 *
 * @param {String} name - Reducer name.
 * @returns {Function}
 */
export const asyncReducerFactory = (name: String) => {
    return (state = { data: null, isLoading: false, error: null }, action) => {
        switch (action.type) {
            case `FETCH_${name}_STARTED`:
                return { data: null, isLoading: true, error: null };
            case `FETCH_${name}_SUCCESS`:
                return { data: action.payload, isLoading: false, error: null };
            case `FETCH_${name}_ERROR`:
                return { data: null, isLoading: false, error: action.payload };
            default:
                return state;
        }
    };
};

/**
 * Async Action Creator Factory to reduce duplicated code in async action creators.
 * Higher Order Action Creator.
 *
 * @param {String} name - Action name.
 * @param {function} thunk - Async action returning promise to resolve.
 * @returns {function(): function(*): (Promise|*|Promise<T>)}
 */
export const asyncActionCreatorFactory = (
    name: String,
    thunk: Function
) => () => {
    return dispatch => {
        dispatch({ type: `FETCH_${name}_STARTED` });

        return dispatch(thunk)
            .then(data => data.json())
            .then(json =>
                dispatch({ type: `FETCH_${name}_SUCCESS`, payload: json })
            )
            .catch(err =>
                dispatch({ type: `FETCH_${name}_ERROR`, payload: err })
            );
    };
};
