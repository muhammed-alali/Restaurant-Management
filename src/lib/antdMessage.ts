/**
 * Antd message static proxy.
 * Stores the message API from App.useApp() so hooks can call it
 * without triggering the "static function can not consume context" warning.
 */

import type { MessageInstance } from 'antd/es/message/interface';

// Fallback to antd static message until the App bridge initialises
import { message as antdStaticMessage } from 'antd';

let _message: MessageInstance = antdStaticMessage;

export function setMessageInstance(api: MessageInstance) {
  _message = api;
}

export const message: MessageInstance = new Proxy({} as MessageInstance, {
  get(_target, prop) {
    return (_message as never)[prop];
  },
});
