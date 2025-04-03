import { EVENTS } from '../src/constants.js';

console.log('[LowestBidAnalytics] Adapter loaded. Listening for events:', Object.values(EVENTS));

let bidCPMs = [];

const lowestBidAnalyticsAdapter = {
  enableAnalytics(config) {
    console.log('[LowestBidAnalytics] Adapter enabled with config:', config);
  },

  track({ eventType, args }) {
    console.log('[LowestBidAnalytics] Event:', eventType, args);

    if (eventType === EVENTS.BID_RESPONSE) {
      bidCPMs.push(args.cpm);
    }

    if (eventType === EVENTS.AUCTION_END) {
      if (bidCPMs.length > 0) {
        const lowest = Math.min(...bidCPMs);
        console.log('[LowestBidAnalytics] Lowest bid CPM:', lowest);
      } else {
        console.log('[LowestBidAnalytics] No bids received.');
      }
      bidCPMs = [];
    }
  }
};

import adapterManager from '../src/adapterManager.js';

adapterManager.registerAnalyticsAdapter({
  adapter: lowestBidAnalyticsAdapter,
  code: 'lowestBid'
});

// Be able to test fake bids in console
if (typeof window !== 'undefined') {
  window.__lowestBidAnalyticsAdapter = lowestBidAnalyticsAdapter;
}

export default lowestBidAnalyticsAdapter;
