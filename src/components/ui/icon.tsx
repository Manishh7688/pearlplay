import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * One icon set for every widget. Keys are the names already used in screens.
 * Values are Material Community glyphs, so the whole app shares one style.
 */
const MAP: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  'add-circle': 'plus-circle',
  'add-circle-outline': 'plus-circle-outline',
  alert: 'alert-rhombus',
  'alert-circle-outline': 'alert-circle-outline',
  'arrow-back': 'arrow-left',
  'arrow-forward': 'arrow-right',
  'arrow-up-circle': 'arrow-up-circle',
  'business-outline': 'bank-outline',
  calendar: 'calendar-check',
  'calendar-outline': 'calendar-month-outline',
  'call-outline': 'phone-outline',
  card: 'card-account-details',
  'card-outline': 'credit-card-outline',
  cash: 'cash-multiple',
  'cash-outline': 'cash',
  checkmark: 'check',
  'checkmark-circle': 'check-decagram',
  'checkmark-circle-outline': 'check-circle-outline',
  'checkmark-done': 'check-all',
  'chatbubbles': 'message-text',
  'chatbubbles-outline': 'message-text-outline',
  'chevron-forward': 'chevron-right',
  close: 'close',
  'close-circle': 'close-circle',
  'copy-outline': 'content-copy',
  'create-outline': 'pencil-outline',
  'download-outline': 'download',
  'earth-outline': 'earth',
  'eye-off-outline': 'eye-off-outline',
  'eye-outline': 'eye-outline',
  'file-tray-outline': 'inbox-outline',
  flash: 'lightning-bolt',
  'flash-outline': 'lightning-bolt',
  gift: 'gift',
  'gift-outline': 'gift-open-outline',
  grid: 'view-grid',
  'grid-outline': 'view-dashboard-outline',
  'hardware-chip-outline': 'chip',
  'headset-outline': 'lifebuoy',
  'help-circle-outline': 'help-circle-outline',
  home: 'home-variant',
  'home-outline': 'home-variant-outline',
  'information-circle': 'information',
  'information-circle-outline': 'information-outline',
  'key-outline': 'key-variant',
  leaf: 'sprout',
  'leaf-outline': 'sprout-outline',
  'location-outline': 'map-marker-outline',
  'lock-closed-outline': 'lock-outline',
  'log-out-outline': 'logout',
  'logo-whatsapp': 'whatsapp',
  medal: 'medal',
  'notifications-outline': 'bell-badge-outline',
  'paper-plane': 'send',
  people: 'account-group',
  'people-outline': 'account-group-outline',
  person: 'account-circle',
  'person-outline': 'account-outline',
  'phone-portrait-outline': 'cellphone',
  pricetag: 'tag-outline',
  receipt: 'receipt-text',
  'receipt-outline': 'receipt-text-outline',
  refresh: 'refresh',
  ribbon: 'ribbon',
  'rocket-outline': 'rocket-launch-outline',
  'save-outline': 'content-save-outline',
  send: 'send',
  'share-social-outline': 'share-variant',
  'shield-checkmark': 'shield-check',
  'shield-checkmark-outline': 'shield-check-outline',
  sparkles: 'auto-fix',
  star: 'star-four-points',
  'star-outline': 'crown-outline',
  'swap-horizontal': 'swap-horizontal',
  time: 'clock-outline',
  'time-outline': 'clock-time-four-outline',
  'trending-up': 'chart-line',
  'trending-up-outline': 'chart-line',
  wallet: 'wallet-plus',
  'wallet-outline': 'wallet-outline',
  warning: 'alert',
};

export function Icon({
  name,
  size = 22,
  color,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  const glyph = MAP[name] ?? (name as React.ComponentProps<typeof MaterialCommunityIcons>['name']);
  return <MaterialCommunityIcons name={glyph} size={size} color={color} style={style} />;
}
