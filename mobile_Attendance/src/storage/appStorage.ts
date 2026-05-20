import { MMKV } from 'react-native-mmkv';

/** Single MMKV instance — tokens and persisted auth live here (`authStore` + `api/client`). */
export const appStorage = new MMKV();
