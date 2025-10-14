# TODO: Update Alerts Screen to Use RTK Query and Cache Alerts

- [x] Add `getAlertsBySerial` endpoint to `store/api/authApi.ts`
- [x] Update `app/(tabs)/alerts.tsx` to use RTK Query hook `useGetAlertsBySerialQuery` instead of manual fetch
- [x] Add `console.log` to log the alerts object in `alerts.tsx`
- [x] Remove manual fetch logic, loading/error states from `alerts.tsx` (handled by RTK Query)
- [x] Test the app to ensure alerts load and cache properly
- [x] Verify console logs show the alerts object

# TODO: Update Home Screen Badge for Unseen Critical Alerts

- [x] Add logic in `app/(tabs)/_layout.tsx` to fetch alerts for all vehicles with serials using RTK Query
- [x] Calculate total number of critical alerts across all vehicles
- [x] Display the count in the badge next to the bell icon (updated to 0 for now)
- [x] Reset the badge to 0 when navigating to alerts screen, but keep alerts data cached for 24-hour cycle
- [x] Add WebSocket listener for live alerts updates and invalidate cache on new alerts
