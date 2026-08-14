# React and Vue profiling

## React

- Use the React DevTools Profiler or `<Profiler>` around the measured subtree.
- Record the interaction before adding `memo`, `useMemo`, or `useCallback`.
- Fix unstable keys, state placed too high, duplicated derived state, context fan-out, and expensive render work at the owning boundary.
- Confirm server/client boundaries and hydration cost. Do not move static content client-side for convenience.
- Memoize only when repeated render cost is material and inputs can remain stable.

Reference: [React Profiler](https://react.dev/reference/react/Profiler).

## Vue

- Enable `app.config.performance` for local profiling and use Vue DevTools or browser performance markers.
- Inspect unstable props, deep reactive structures, unnecessary component instances, and repeated computed work.
- Use route-level lazy loading for code not required initially. Use `shallowRef` or virtualization only for measured large-data costs.
- Confirm SSR hydration output is deterministic before shifting work client-side.

Reference: [Vue performance guide](https://vuejs.org/guide/best-practices/performance).
