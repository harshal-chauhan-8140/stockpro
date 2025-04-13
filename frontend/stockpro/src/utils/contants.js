const API_CONNECTION_HOST_URL = 'http://localhost:4000';
const AUTH_LOGIN_ENDPOINT = '/auth/login';
const AUTH_SIGNUP_ENDPOINT = '/auth/signup';
const ORDER_CREATE_ENDPOINT = '/order/create';
const PORTFOLIO_ENDPOINT = '/portfolio';
const PORTFOLIO_FUND_ADD_ENDPOINT = '/portfolio/fund/add';
const PORTFOLIO_FUND_REMOVE_ENDPOINT = '/portfolio/fund/remove';
const STOCK_ENDPOINT = '/stocks';

const API_RESPONSE_STATUS_SUCCESS = 'success';
const API_RESPONSE_STATUS_ERROR = 'error';

const WS_CONNECTION_HOST_URL = 'ws://localhost:5000';
const TRANSPORT_WEBSOCKET = 'websocket';

const ROOM_PREFIX_CANDLE = 'candle';
const ROOM_PREFIX_TRADE = 'trade';
const ROOM_PREFIX_ORDERBOOK = 'order-book';

const WS_EVENT_CONNECT = 'connect';
const WS_EVENT_DISCONNECT = 'disconnect';
const WS_EVENT_CANDLE_INIT = 'candle:init';
const WS_EVENT_ROOM_JOIN = 'room:join';
const WS_EVENT_LEAVE_ROOM = 'room:left';
const WS_EVENT_ORDERBOOK = 'order-book';
const WS_EVENT_CANDLE_UPDATE = 'candle:update';
const WS_EVENT_TRADE = 'trade';
const WS_EVENT_ORDER_EXECUTION_UPDATE = 'order:execution:update';
const WS_EVENT_CONNECTION_ERROR = 'connect_error';

const ORDER_SIDE_BUY = 'BUY';
const ORDER_SIDE_SELL = 'SELL';
const ORDER_BOUGHT = 'bought';
const ORDER_SOLD = 'sold';
const ORDER_STATUS_FILLED = 'FILLED';

export {
    STOCK_ENDPOINT,
    PORTFOLIO_ENDPOINT,
    PORTFOLIO_FUND_REMOVE_ENDPOINT,
    PORTFOLIO_FUND_ADD_ENDPOINT,
    ORDER_CREATE_ENDPOINT,
    API_CONNECTION_HOST_URL,
    AUTH_LOGIN_ENDPOINT,
    AUTH_SIGNUP_ENDPOINT,
    API_RESPONSE_STATUS_SUCCESS,
    API_RESPONSE_STATUS_ERROR,
    ORDER_STATUS_FILLED,
    ORDER_BOUGHT,
    ORDER_SOLD,
    ORDER_SIDE_BUY,
    ORDER_SIDE_SELL,
    WS_EVENT_CONNECTION_ERROR,
    ROOM_PREFIX_CANDLE,
    ROOM_PREFIX_ORDERBOOK,
    ROOM_PREFIX_TRADE,
    TRANSPORT_WEBSOCKET,
    WS_CONNECTION_HOST_URL,
    WS_EVENT_CANDLE_INIT,
    WS_EVENT_CANDLE_UPDATE,
    WS_EVENT_CONNECT,
    WS_EVENT_DISCONNECT,
    WS_EVENT_LEAVE_ROOM,
    WS_EVENT_ORDERBOOK,
    WS_EVENT_ROOM_JOIN,
    WS_EVENT_TRADE,
    WS_EVENT_ORDER_EXECUTION_UPDATE
}