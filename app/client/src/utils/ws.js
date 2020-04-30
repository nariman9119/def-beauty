import io from 'socket.io-client';

import { DEPTH_RETRY_INTERVAL, SERVER_URL } from '../constants';

export let ws = null;

export const initWs = (wsUrl = `${SERVER_URL}?token=${localStorage.getItem('token')}`) => {
  if (!localStorage.getItem('token')) return;

  ws = io(wsUrl);

  ws.on('connect', () => {
    console.log('WS Opened!');
  });

  ws.on('disconnect', () => {
    console.log('WS Closed!');
  });

  ws.on('error', err => {
    console.error('WS error occurred: ', err);
  });

  ws.on('connect_error', err => {
    console.error('WS connection error occurred: ', err);
  });

  ws.on('like', info => {
    console.log('LIKE', info);
  });
};

export const onEvent = (event, cb) => {
  console.log('on event', ws);
  // !ws && initWs();
  ws.on(event, cb);
};

export const emit = (event, data, prompt, toast) => {
  !ws && initWs();
  ws.emit(event, data);
};

export const cancelWs = () => {
  !!ws && ws.close();
};
