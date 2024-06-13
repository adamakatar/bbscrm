import { createContext, useEffect, useReducer, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { apiUrl } from "../config/apiUrl";
import { Get } from "../Axios/AxiosFunctions";
import { BaseURL } from "../config/apiUrl";
import { INTERVAL_FOR_RUNTIME_2, MSG_ERROR } from "../utils/contants";

const initialState = {
    unreadEmailCount: 0,
    unreadCallCount: 0,
    unreadSMSCount: 0,
};

const handlers = {
    SET_UNREAD_EMAIL_COUNT: (state, action) => ({
        ...state,
        unreadEmailCount: action.payload,
    }),
    SET_UNREAD_CALL_COUNT: (state, action) => ({
        ...state,
        unreadCallCount: action.payload,
    }),
    SET_UNREAD_SMS_COUNT: (state, action) => ({
        ...state,
        unreadSMSCount: action.payload,
    })
};

const reducer = (state, action) => handlers[action.type] ? handlers[action.type](state, action) : state;

const RuntimeDataContext = createContext({
    ...initialState,
    getRuntimeDataAct: () => { },
});

const RuntimeDataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { user, access_token: accessToken } = useSelector((s) => s.authReducer || {});

    let notification = '';

    useEffect(() => {
        const intervalId = setInterval(() => {
            getRuntimeDataAct();
        }, INTERVAL_FOR_RUNTIME_2);
        return () => clearInterval(intervalId);
    }, []);

    const getRuntimeDataAct = async () => {
        if (user?._id) {
            await Get(BaseURL(`users/get-runtime-data/${user._id}`), accessToken)
                .then((res) => {
                    const { unreadEmailCount, unreadCallCount, unreadSMSCount } = res.data || {};

                    const favicon = document.getElementById('favicon');
                    if (unreadEmailCount + unreadCallCount + unreadSMSCount > 0) {
                        favicon.href = '/favicon1.png';
                    } else {
                        favicon.href = '/favicon.png';
                    }

                    dispatch({
                        type: 'SET_UNREAD_EMAIL_COUNT',
                        payload: unreadEmailCount,
                    });
                    dispatch({
                        type: 'SET_UNREAD_CALL_COUNT',
                        payload: unreadCallCount,
                    });
                    dispatch({
                        type: 'SET_UNREAD_SMS_COUNT',
                        payload: unreadSMSCount,
                    });
                })
                .catch((err) => {
                    toast.error(err?.response?.data || MSG_ERROR);
                });
        }
    };

    return (
        <RuntimeDataContext.Provider
            value={{
                ...state,
                notification,
                getRuntimeDataAct,
            }}
        >
            {children}
        </RuntimeDataContext.Provider>
    );
}

export { RuntimeDataContext, RuntimeDataProvider };