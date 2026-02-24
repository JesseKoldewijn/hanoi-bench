import { c as createMemoryHistory } from "../_libs/tanstack__history.mjs";
import { r as rootRouteId, i as isNotFound, g as getNormalizedURL, a as getOrigin, b as attachRouterServerSsrUtils, d as defineHandlerCallback, c as isRedirect, e as defaultGetScrollRestorationKey, f as restoreScroll, h as escapeHtml, s as storageKey, j as createSerializationAdapter, k as createRawStreamRPCPlugin, l as isResolvedRedirect, m as mergeHeaders, n as executeRewriteInput, o as defaultSerovalPlugins, p as makeSerovalPlugin, q as getLocationChangeInfo, t as makeSsrSerovalPlugin, u as transformReadableStreamWithRouter } from "../_libs/tanstack__router-core.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { H as H3Event, t as toResponse } from "../_libs/h3-v2.mjs";
import { i as invariant } from "../_libs/tiny-invariant.mjs";
import { a as au, I as Iu, o as ou } from "../_libs/seroval.mjs";
import { u as useContext, c as createComponent, a as createContext, b as createMemo, S as Show, d as Suspense, D as Dynamic, e as Switch, M as Match$1, m as mergeProps, f as createResource, s as ssr, g as ssrHydrationKey, h as ssrStyleProperty, i as escape, j as createEffect, o as on, k as createSignal, E as ErrorBoundary, l as ssrAttribute, r as renderToStream } from "../_libs/solid-js.mjs";
import { w as warning } from "../_libs/tiny-warning.mjs";
import { i as isbot } from "../_libs/isbot.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream";
import "node:https";
import "node:http2";
var _tmpl$$2 = ["<div", ' style="', '"><div style="', '"><strong style="', '">Something went wrong!</strong><button style="', '">', '</button></div><div style="', '"></div><!--$-->', "<!--/--></div>"], _tmpl$2 = ["<div", '><pre style="', '">', "</pre></div>"], _tmpl$3 = ["<code", ">", "</code>"];
function CatchBoundary(props) {
  return createComponent(ErrorBoundary, {
    fallback: (error, reset) => {
      props.onCatch?.(error);
      createEffect(on([props.getResetKey], () => reset(), {
        defer: true
      }));
      return createComponent(Dynamic, {
        get component() {
          return props.errorComponent ?? ErrorComponent;
        },
        error,
        reset
      });
    },
    get children() {
      return props.children;
    }
  });
}
function ErrorComponent({
  error
}) {
  const [show] = createSignal(false);
  return ssr(_tmpl$$2, ssrHydrationKey(), ssrStyleProperty("padding:", ".5rem") + ssrStyleProperty(";max-width:", "100%"), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";align-items:", "center") + ssrStyleProperty(";gap:", ".5rem"), ssrStyleProperty("font-size:", "1rem"), ssrStyleProperty("appearance:", "none") + ssrStyleProperty(";font-size:", ".6em") + ssrStyleProperty(";border:", "1px solid currentColor") + ssrStyleProperty(";padding:", ".1rem .2rem") + ssrStyleProperty(";font-weight:", "bold") + ssrStyleProperty(";border-radius:", ".25rem"), show() ? "Hide Error" : "Show Error", ssrStyleProperty("height:", ".25rem"), show() ? ssr(_tmpl$2, ssrHydrationKey(), ssrStyleProperty("font-size:", ".7em") + ssrStyleProperty(";border:", "1px solid red") + ssrStyleProperty(";border-radius:", ".25rem") + ssrStyleProperty(";padding:", ".3rem") + ssrStyleProperty(";color:", "red") + ssrStyleProperty(";overflow:", "auto"), error.message ? ssr(_tmpl$3, ssrHydrationKey(), escape(error.message)) : escape(null)) : escape(null));
}
const routerContext = createContext(null);
function useRouter(opts) {
  const value = useContext(routerContext);
  warning(!((opts?.warn ?? true) && !value));
  return value;
}
function useRouterState(opts) {
  const contextRouter = useRouter({
    warn: opts?.router === void 0
  });
  const router = opts?.router || contextRouter;
  {
    const state = router.state;
    const selected = opts?.select ? opts.select(state) : state;
    return () => selected;
  }
}
function useIntersectionObserver(ref, callback, intersectionObserverOptions = {}, options = {}) {
  let observerRef = null;
  return () => observerRef;
}
const matchContext = createContext(() => void 0);
const dummyMatchContext = createContext(() => void 0);
function Transitioner() {
  useRouter();
  useRouterState({
    select: ({
      isLoading: isLoading2
    }) => isLoading2
  });
  {
    return null;
  }
}
function SafeFragment(props) {
  return props.children;
}
var _tmpl$$1 = ["<p", ">Not Found</p>"];
function CatchNotFound(props) {
  const resetKey = useRouterState({
    select: (s) => `not-found-${s.location.pathname}-${s.status}`
  });
  return createComponent(CatchBoundary, {
    getResetKey: () => resetKey(),
    onCatch: (error) => {
      if (isNotFound(error)) {
        props.onCatch?.(error);
      } else {
        throw error;
      }
    },
    errorComponent: ({
      error
    }) => {
      if (isNotFound(error)) {
        return props.fallback?.(error);
      } else {
        throw error;
      }
    },
    get children() {
      return props.children;
    }
  });
}
function DefaultGlobalNotFound() {
  return ssr(_tmpl$$1, ssrHydrationKey());
}
function renderRouteNotFound(router, route, data) {
  if (!route.options.notFoundComponent) {
    if (router.options.defaultNotFoundComponent) {
      return createComponent(router.options.defaultNotFoundComponent, data);
    }
    return createComponent(DefaultGlobalNotFound, {});
  }
  return createComponent(route.options.notFoundComponent, data);
}
var _tmpl$ = ["<script", ' class="$tsr">', "<\/script>"];
function ScriptOnce({
  children
}) {
  const router = useRouter();
  return ssr(_tmpl$, ssrHydrationKey() + ssrAttribute("nonce", escape(router.options.ssr?.nonce, true)), children + ";document.currentScript.remove()");
}
function ScrollRestoration() {
  const router = useRouter();
  if (!router.isScrollRestoring || false) {
    return null;
  }
  if (typeof router.options.scrollRestoration === "function") {
    const shouldRestore = router.options.scrollRestoration({
      location: router.latestLocation
    });
    if (!shouldRestore) {
      return null;
    }
  }
  const getKey = router.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
  const userKey = getKey(router.latestLocation);
  const resolvedKey = userKey !== defaultGetScrollRestorationKey(router.latestLocation) ? userKey : void 0;
  const restoreScrollOptions = {
    storageKey,
    shouldScrollRestoration: true
  };
  if (resolvedKey) {
    restoreScrollOptions.key = resolvedKey;
  }
  return createComponent(ScriptOnce, {
    get children() {
      return `(${restoreScroll.toString()})(${escapeHtml(JSON.stringify(restoreScrollOptions))})`;
    }
  });
}
const Match = (props) => {
  const router = useRouter();
  const matchState = useRouterState({
    select: (s) => {
      const match = s.matches.find((d) => d.id === props.matchId);
      if (!match) {
        return null;
      }
      return {
        routeId: match.routeId,
        ssr: match.ssr,
        _displayPending: match._displayPending
      };
    }
  });
  if (!matchState()) return null;
  const route = () => router.routesById[matchState().routeId];
  const resolvePendingComponent = () => route().options.pendingComponent ?? router.options.defaultPendingComponent;
  const routeErrorComponent = () => route().options.errorComponent ?? router.options.defaultErrorComponent;
  const routeOnCatch = () => route().options.onCatch ?? router.options.defaultOnCatch;
  const routeNotFoundComponent = () => route().isRoot ? (
    // If it's the root route, use the globalNotFound option, with fallback to the notFoundRoute's component
    route().options.notFoundComponent ?? router.options.notFoundRoute?.options.component
  ) : route().options.notFoundComponent;
  const resolvedNoSsr = matchState().ssr === false || matchState().ssr === "data-only";
  const ResolvedSuspenseBoundary = () => Suspense;
  const ResolvedCatchBoundary = () => routeErrorComponent() ? CatchBoundary : SafeFragment;
  const ResolvedNotFoundBoundary = () => routeNotFoundComponent() ? CatchNotFound : SafeFragment;
  const resetKey = useRouterState({
    select: (s) => s.loadedAt
  });
  const parentRouteId = useRouterState({
    select: (s) => {
      const index = s.matches.findIndex((d) => d.id === props.matchId);
      return s.matches[index - 1]?.routeId;
    }
  });
  const ShellComponent = route().isRoot ? route().options.shellComponent ?? SafeFragment : SafeFragment;
  return createComponent(ShellComponent, {
    get children() {
      return [createComponent(matchContext.Provider, {
        value: () => props.matchId,
        get children() {
          return createComponent(Dynamic, {
            get component() {
              return ResolvedSuspenseBoundary();
            },
            get fallback() {
              return (
                // Don't show fallback on server when using no-ssr mode to avoid hydration mismatch
                void 0
              );
            },
            get children() {
              return createComponent(Dynamic, {
                get component() {
                  return ResolvedCatchBoundary();
                },
                getResetKey: () => resetKey(),
                get errorComponent() {
                  return routeErrorComponent() || ErrorComponent;
                },
                onCatch: (error) => {
                  if (isNotFound(error)) throw error;
                  warning(false, `Error in route match: ${matchState().routeId}`);
                  routeOnCatch()?.(error);
                },
                get children() {
                  return createComponent(Dynamic, {
                    get component() {
                      return ResolvedNotFoundBoundary();
                    },
                    fallback: (error) => {
                      if (!routeNotFoundComponent() || error.routeId && error.routeId !== matchState().routeId || !error.routeId && !route().isRoot) throw error;
                      return createComponent(Dynamic, mergeProps({
                        get component() {
                          return routeNotFoundComponent();
                        }
                      }, error));
                    },
                    get children() {
                      return createComponent(Switch, {
                        get children() {
                          return [createComponent(Match$1, {
                            when: resolvedNoSsr,
                            get children() {
                              return createComponent(Show, {
                                get when() {
                                  return false;
                                },
                                get fallback() {
                                  return createComponent(Dynamic, {
                                    get component() {
                                      return resolvePendingComponent();
                                    }
                                  });
                                },
                                get children() {
                                  return createComponent(MatchInner, {
                                    get matchId() {
                                      return props.matchId;
                                    }
                                  });
                                }
                              });
                            }
                          }), createComponent(Match$1, {
                            when: !resolvedNoSsr,
                            get children() {
                              return createComponent(MatchInner, {
                                get matchId() {
                                  return props.matchId;
                                }
                              });
                            }
                          })];
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }), parentRouteId() === rootRouteId ? [createComponent(OnRendered, {}), createComponent(ScrollRestoration, {})] : null];
    }
  });
};
function OnRendered() {
  const router = useRouter();
  const location = useRouterState({
    select: (s) => {
      return s.resolvedLocation?.state.__TSR_key;
    }
  });
  createEffect(on([location], () => {
    router.emit({
      type: "onRendered",
      ...getLocationChangeInfo(router.state)
    });
  }));
  return null;
}
const MatchInner = (props) => {
  const router = useRouter();
  const matchState = useRouterState({
    select: (s) => {
      const match2 = s.matches.find((d) => d.id === props.matchId);
      if (!match2) {
        return null;
      }
      const routeId = match2.routeId;
      const remountFn = router.routesById[routeId].options.remountDeps ?? router.options.defaultRemountDeps;
      const remountDeps = remountFn?.({
        routeId,
        loaderDeps: match2.loaderDeps,
        params: match2._strictParams,
        search: match2._strictSearch
      });
      const key = remountDeps ? JSON.stringify(remountDeps) : void 0;
      return {
        key,
        routeId,
        match: {
          id: match2.id,
          status: match2.status,
          error: match2.error,
          _forcePending: match2._forcePending,
          _displayPending: match2._displayPending
        }
      };
    }
  });
  if (!matchState()) return null;
  const route = () => router.routesById[matchState().routeId];
  const match = () => matchState().match;
  const componentKey = () => matchState().key ?? matchState().match.id;
  const out = () => {
    const Comp = route().options.component ?? router.options.defaultComponent;
    if (Comp) {
      return createComponent(Comp, {});
    }
    return createComponent(Outlet, {});
  };
  const keyedOut = () => createComponent(Show, {
    get when() {
      return componentKey();
    },
    keyed: true,
    children: (_key) => out()
  });
  return createComponent(Switch, {
    get children() {
      return [createComponent(Match$1, {
        get when() {
          return match()._displayPending;
        },
        children: (_) => {
          const [displayPendingResult] = createResource(() => router.getMatch(match().id)?._nonReactive.displayPendingPromise);
          return displayPendingResult();
        }
      }), createComponent(Match$1, {
        get when() {
          return match()._forcePending;
        },
        children: (_) => {
          const [minPendingResult] = createResource(() => router.getMatch(match().id)?._nonReactive.minPendingPromise);
          return minPendingResult();
        }
      }), createComponent(Match$1, {
        get when() {
          return match().status === "pending";
        },
        children: (_) => {
          const pendingMinMs = route().options.pendingMinMs ?? router.options.defaultPendingMinMs;
          if (pendingMinMs) {
            const routerMatch = router.getMatch(match().id);
            if (routerMatch && !routerMatch._nonReactive.minPendingPromise) ;
          }
          const [loaderResult] = createResource(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return router.getMatch(match().id)?._nonReactive.loadPromise;
          });
          const FallbackComponent = route().options.pendingComponent ?? router.options.defaultPendingComponent;
          return [FallbackComponent && pendingMinMs > 0 ? createComponent(Dynamic, {
            component: FallbackComponent
          }) : null, loaderResult()];
        }
      }), createComponent(Match$1, {
        get when() {
          return match().status === "notFound";
        },
        children: (_) => {
          invariant(isNotFound(match().error));
          return createComponent(Show, {
            get when() {
              return matchState().routeId;
            },
            keyed: true,
            children: (_routeId) => renderRouteNotFound(router, route(), match().error)
          });
        }
      }), createComponent(Match$1, {
        get when() {
          return match().status === "redirected";
        },
        children: (_) => {
          invariant(isRedirect(match().error));
          const [loaderResult] = createResource(async () => {
            await new Promise((r) => setTimeout(r, 0));
            return router.getMatch(match().id)?._nonReactive.loadPromise;
          });
          return loaderResult();
        }
      }), createComponent(Match$1, {
        get when() {
          return match().status === "error";
        },
        children: (_) => {
          {
            const RouteErrorComponent = (route().options.errorComponent ?? router.options.defaultErrorComponent) || ErrorComponent;
            return createComponent(RouteErrorComponent, {
              get error() {
                return match().error;
              },
              info: {
                componentStack: ""
              }
            });
          }
        }
      }), createComponent(Match$1, {
        get when() {
          return match().status === "success";
        },
        get children() {
          return keyedOut();
        }
      })];
    }
  });
};
const Outlet = () => {
  const router = useRouter();
  const matchId = useContext(matchContext);
  const routeId = useRouterState({
    select: (s) => s.matches.find((d) => d.id === matchId())?.routeId
  });
  const route = () => router.routesById[routeId()];
  const parentGlobalNotFound = useRouterState({
    select: (s) => {
      const matches = s.matches;
      const parentMatch = matches.find((d) => d.id === matchId());
      if (!parentMatch) {
        return false;
      }
      return parentMatch.globalNotFound;
    }
  });
  const childMatchId = useRouterState({
    select: (s) => {
      const matches = s.matches;
      const index = matches.findIndex((d) => d.id === matchId());
      const v = matches[index + 1]?.id;
      return v;
    }
  });
  const childMatchStatus = useRouterState({
    select: (s) => {
      const matches = s.matches;
      const index = matches.findIndex((d) => d.id === matchId());
      return matches[index + 1]?.status;
    }
  });
  const shouldShowNotFound = () => childMatchStatus() !== "redirected" && parentGlobalNotFound();
  return createComponent(Show, {
    get when() {
      return !shouldShowNotFound() && childMatchId();
    },
    get fallback() {
      return createComponent(Show, {
        get when() {
          return shouldShowNotFound();
        },
        get children() {
          return renderRouteNotFound(router, route(), void 0);
        }
      });
    },
    children: (matchIdAccessor) => {
      const currentMatchId = createMemo(() => matchIdAccessor());
      return createComponent(Show, {
        get when() {
          return routeId() === rootRouteId;
        },
        get fallback() {
          return createComponent(Match, {
            get matchId() {
              return currentMatchId();
            }
          });
        },
        get children() {
          return createComponent(Suspense, {
            get fallback() {
              return createComponent(Dynamic, {
                get component() {
                  return router.options.defaultPendingComponent;
                }
              });
            },
            get children() {
              return createComponent(Match, {
                get matchId() {
                  return currentMatchId();
                }
              });
            }
          });
        }
      });
    }
  });
};
function Matches() {
  const router = useRouter();
  const ResolvedSuspense = SafeFragment;
  const rootRoute = () => router.routesById[rootRouteId];
  const PendingComponent = rootRoute().options.pendingComponent ?? router.options.defaultPendingComponent;
  const OptionalWrapper = router.options.InnerWrap || SafeFragment;
  return createComponent(OptionalWrapper, {
    get children() {
      return createComponent(ResolvedSuspense, {
        get fallback() {
          return PendingComponent ? createComponent(PendingComponent, {}) : null;
        },
        get children() {
          return [createComponent(Transitioner, {}), createComponent(MatchesInner, {})];
        }
      });
    }
  });
}
function MatchesInner() {
  const router = useRouter();
  const matchId = useRouterState({
    select: (s) => {
      return s.matches[0]?.id;
    }
  });
  const resetKey = useRouterState({
    select: (s) => s.loadedAt
  });
  const matchComponent = () => {
    return createComponent(Show, {
      get when() {
        return matchId();
      },
      get children() {
        return createComponent(Match, {
          get matchId() {
            return matchId();
          }
        });
      }
    });
  };
  return createComponent(matchContext.Provider, {
    value: matchId,
    get children() {
      return router.options.disableGlobalCatchBoundary ? matchComponent() : createComponent(CatchBoundary, {
        getResetKey: () => resetKey(),
        errorComponent: ErrorComponent,
        get onCatch() {
          return void 0;
        },
        get children() {
          return matchComponent();
        }
      });
    }
  });
}
function RouterContextProvider({
  router,
  children,
  ...rest
}) {
  router.update({
    ...router.options,
    ...rest,
    context: {
      ...router.options.context,
      ...rest.context
    }
  });
  const OptionalWrapper = router.options.Wrap || SafeFragment;
  return createComponent(OptionalWrapper, {
    get children() {
      return createComponent(routerContext.Provider, {
        value: router,
        get children() {
          return children();
        }
      });
    }
  });
}
function RouterProvider({
  router,
  ...rest
}) {
  return createComponent(RouterContextProvider, mergeProps({
    router
  }, rest, {
    children: () => createComponent(Matches, {})
  }));
}
function StartServer(props) {
  return createComponent(RouterProvider, {
    get router() {
      return props.router;
    }
  });
}
const TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
const TSS_SERVER_FUNCTION = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION");
const X_TSS_SERIALIZED = "x-tss-serialized";
const X_TSS_RAW_RESPONSE = "x-tss-raw";
const TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
const FrameType = {
  /** Seroval JSON chunk (NDJSON line) */
  JSON: 0,
  /** Raw stream data chunk */
  CHUNK: 1,
  /** Raw stream end (EOF) */
  END: 2,
  /** Raw stream error */
  ERROR: 3
};
const FRAME_HEADER_SIZE = 9;
const TSS_FRAMED_PROTOCOL_VERSION = 1;
const TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=${TSS_FRAMED_PROTOCOL_VERSION}`;
const GLOBAL_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:start-storage-context");
const globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_STORAGE_KEY]) {
  globalObj$1[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
}
const startStorage = globalObj$1[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && opts?.throwIfNotFound !== false) {
    throw new Error(
      `No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return context;
}
const getStartOptions = () => getStartContext().startOptions;
function isSafeKey(key) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
function safeObjectMerge(target, source) {
  const result = /* @__PURE__ */ Object.create(null);
  if (target) {
    for (const key of Object.keys(target)) {
      if (isSafeKey(key)) result[key] = target[key];
    }
  }
  if (source && typeof source === "object") {
    for (const key of Object.keys(source)) {
      if (isSafeKey(key)) result[key] = source[key];
    }
  }
  return result;
}
function createNullProtoObject(source) {
  if (!source) return /* @__PURE__ */ Object.create(null);
  const obj = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(source)) {
    if (isSafeKey(key)) obj[key] = source[key];
  }
  return obj;
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware, depth) => {
    if (depth > maxDepth) {
      throw new Error(
        `Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`
      );
    }
    middleware.forEach((m) => {
      if (m.options.middleware) {
        recurse(m.options.middleware, depth + 1);
      }
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares, 0);
  return flattened;
}
function getDefaultSerovalPlugins() {
  const start = getStartOptions();
  const adapters = start?.serializationAdapters;
  return [
    ...adapters?.map(makeSerovalPlugin) ?? [],
    ...defaultSerovalPlugins
  ];
}
const GLOBAL_EVENT_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:event-storage");
const globalObj = globalThis;
if (!globalObj[GLOBAL_EVENT_STORAGE_KEY]) {
  globalObj[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
}
const eventStorage = globalObj[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
  return typeof value.then === "function";
}
function getSetCookieValues(headers) {
  const headersWithSetCookie = headers;
  if (typeof headersWithSetCookie.getSetCookie === "function") {
    return headersWithSetCookie.getSetCookie();
  }
  const value = headers.get("set-cookie");
  return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
  if (response.ok) {
    return;
  }
  const eventSetCookies = getSetCookieValues(event.res.headers);
  if (eventSetCookies.length === 0) {
    return;
  }
  const responseSetCookies = getSetCookieValues(response.headers);
  response.headers.delete("set-cookie");
  for (const cookie of responseSetCookies) {
    response.headers.append("set-cookie", cookie);
  }
  for (const cookie of eventSetCookies) {
    response.headers.append("set-cookie", cookie);
  }
}
function attachResponseHeaders(value, event) {
  if (isPromiseLike(value)) {
    return value.then((resolved) => {
      if (resolved instanceof Response) {
        mergeEventResponseHeaders(resolved, event);
      }
      return resolved;
    });
  }
  if (value instanceof Response) {
    mergeEventResponseHeaders(value, event);
  }
  return value;
}
function requestHandler(handler) {
  return (request, requestOpts) => {
    const h3Event = new H3Event(request);
    const response = eventStorage.run(
      { h3Event },
      () => handler(request, requestOpts)
    );
    return toResponse(attachResponseHeaders(response, h3Event), h3Event);
  };
}
function getH3Event() {
  const event = eventStorage.getStore();
  if (!event) {
    throw new Error(
      `No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return event.h3Event;
}
function getResponse() {
  const event = getH3Event();
  return event.res;
}
async function getStartManifest(matchedRoutes) {
  const { tsrStartManifest } = await import("../_tanstack-start-manifest_v-Ykr5pOMY.mjs");
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let injectedHeadScripts;
  const manifest2 = {
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).flatMap(([k, v]) => {
        const result = {};
        let hasData = false;
        if (v.preloads && v.preloads.length > 0) {
          result["preloads"] = v.preloads;
          hasData = true;
        }
        if (v.assets && v.assets.length > 0) {
          result["assets"] = v.assets;
          hasData = true;
        }
        if (!hasData) {
          return [];
        }
        return [[k, result]];
      })
    )
  };
  return {
    manifest: manifest2,
    clientEntry: startManifest.clientEntry,
    injectedHeadScripts
  };
}
const textEncoder$1 = new TextEncoder();
const EMPTY_PAYLOAD = new Uint8Array(0);
function encodeFrame(type, streamId, payload) {
  const frame = new Uint8Array(FRAME_HEADER_SIZE + payload.length);
  frame[0] = type;
  frame[1] = streamId >>> 24 & 255;
  frame[2] = streamId >>> 16 & 255;
  frame[3] = streamId >>> 8 & 255;
  frame[4] = streamId & 255;
  frame[5] = payload.length >>> 24 & 255;
  frame[6] = payload.length >>> 16 & 255;
  frame[7] = payload.length >>> 8 & 255;
  frame[8] = payload.length & 255;
  frame.set(payload, FRAME_HEADER_SIZE);
  return frame;
}
function encodeJSONFrame(json) {
  return encodeFrame(FrameType.JSON, 0, textEncoder$1.encode(json));
}
function encodeChunkFrame(streamId, chunk) {
  return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
function encodeEndFrame(streamId) {
  return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
function encodeErrorFrame(streamId, error) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return encodeFrame(FrameType.ERROR, streamId, textEncoder$1.encode(message));
}
function createMultiplexedStream(jsonStream, rawStreams) {
  let activePumps = 1 + rawStreams.size;
  let controllerRef = null;
  let cancelled = false;
  const cancelReaders = [];
  const safeEnqueue = (chunk) => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.enqueue(chunk);
    } catch {
    }
  };
  const safeError = (err) => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.error(err);
    } catch {
    }
  };
  const safeClose = () => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.close();
    } catch {
    }
  };
  const checkComplete = () => {
    activePumps--;
    if (activePumps === 0) {
      safeClose();
    }
  };
  return new ReadableStream({
    start(controller) {
      controllerRef = controller;
      cancelReaders.length = 0;
      const pumpJSON = async () => {
        const reader = jsonStream.getReader();
        cancelReaders.push(() => {
          reader.cancel().catch(() => {
          });
        });
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (cancelled) break;
            if (done) break;
            safeEnqueue(encodeJSONFrame(value));
          }
        } catch (error) {
          safeError(error);
        } finally {
          reader.releaseLock();
          checkComplete();
        }
      };
      const pumpRawStream = async (streamId, stream) => {
        const reader = stream.getReader();
        cancelReaders.push(() => {
          reader.cancel().catch(() => {
          });
        });
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (cancelled) break;
            if (done) {
              safeEnqueue(encodeEndFrame(streamId));
              break;
            }
            safeEnqueue(encodeChunkFrame(streamId, value));
          }
        } catch (error) {
          safeEnqueue(encodeErrorFrame(streamId, error));
        } finally {
          reader.releaseLock();
          checkComplete();
        }
      };
      pumpJSON();
      for (const [streamId, stream] of rawStreams) {
        pumpRawStream(streamId, stream);
      }
    },
    cancel() {
      cancelled = true;
      controllerRef = null;
      for (const cancelReader of cancelReaders) {
        cancelReader();
      }
      cancelReaders.length = 0;
    }
  });
}
const manifest = {};
async function getServerFnById(id) {
  const serverFnInfo = manifest[id];
  if (!serverFnInfo) {
    throw new Error("Server function info not found for " + id);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + id);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(
      `Server function module export not resolved for serverFn ID: ${id}`
    );
  }
  return action;
}
let serovalPlugins = void 0;
const textEncoder = new TextEncoder();
const FORM_DATA_CONTENT_TYPES = [
  "multipart/form-data",
  "application/x-www-form-urlencoded"
];
const MAX_PAYLOAD_SIZE = 1e6;
const handleServerAction = async ({
  request,
  context,
  serverFnId
}) => {
  const method = request.method;
  const methodUpper = method.toUpperCase();
  const methodLower = method.toLowerCase();
  const url = new URL(request.url);
  const action = await getServerFnById(serverFnId);
  const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
  if (!serovalPlugins) {
    serovalPlugins = getDefaultSerovalPlugins();
  }
  const contentType = request.headers.get("Content-Type");
  function parsePayload(payload) {
    const parsedPayload = Iu(payload, { plugins: serovalPlugins });
    return parsedPayload;
  }
  const response = await (async () => {
    try {
      let serializeResult = function(res2) {
        let nonStreamingBody = void 0;
        const alsResponse = getResponse();
        if (res2 !== void 0) {
          const rawStreams = /* @__PURE__ */ new Map();
          const rawStreamPlugin = createRawStreamRPCPlugin(
            (id, stream2) => {
              rawStreams.set(id, stream2);
            }
          );
          const plugins = [rawStreamPlugin, ...serovalPlugins || []];
          let done = false;
          const callbacks = {
            onParse: (value) => {
              nonStreamingBody = value;
            },
            onDone: () => {
              done = true;
            },
            onError: (error) => {
              throw error;
            }
          };
          au(res2, {
            refs: /* @__PURE__ */ new Map(),
            plugins,
            onParse(value) {
              callbacks.onParse(value);
            },
            onDone() {
              callbacks.onDone();
            },
            onError: (error) => {
              callbacks.onError(error);
            }
          });
          if (done && rawStreams.size === 0) {
            return new Response(
              nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0,
              {
                status: alsResponse.status,
                statusText: alsResponse.statusText,
                headers: {
                  "Content-Type": "application/json",
                  [X_TSS_SERIALIZED]: "true"
                }
              }
            );
          }
          if (rawStreams.size > 0) {
            const jsonStream = new ReadableStream({
              start(controller) {
                callbacks.onParse = (value) => {
                  controller.enqueue(JSON.stringify(value) + "\n");
                };
                callbacks.onDone = () => {
                  try {
                    controller.close();
                  } catch {
                  }
                };
                callbacks.onError = (error) => controller.error(error);
                if (nonStreamingBody !== void 0) {
                  callbacks.onParse(nonStreamingBody);
                }
              }
            });
            const multiplexedStream = createMultiplexedStream(
              jsonStream,
              rawStreams
            );
            return new Response(multiplexedStream, {
              status: alsResponse.status,
              statusText: alsResponse.statusText,
              headers: {
                "Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
                [X_TSS_SERIALIZED]: "true"
              }
            });
          }
          const stream = new ReadableStream({
            start(controller) {
              callbacks.onParse = (value) => controller.enqueue(
                textEncoder.encode(JSON.stringify(value) + "\n")
              );
              callbacks.onDone = () => {
                try {
                  controller.close();
                } catch (error) {
                  controller.error(error);
                }
              };
              callbacks.onError = (error) => controller.error(error);
              if (nonStreamingBody !== void 0) {
                callbacks.onParse(nonStreamingBody);
              }
            }
          });
          return new Response(stream, {
            status: alsResponse.status,
            statusText: alsResponse.statusText,
            headers: {
              "Content-Type": "application/x-ndjson",
              [X_TSS_SERIALIZED]: "true"
            }
          });
        }
        return new Response(void 0, {
          status: alsResponse.status,
          statusText: alsResponse.statusText
        });
      };
      let res = await (async () => {
        if (FORM_DATA_CONTENT_TYPES.some(
          (type) => contentType && contentType.includes(type)
        )) {
          invariant(
            methodLower !== "get",
            "GET requests with FormData payloads are not supported"
          );
          const formData = await request.formData();
          const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
          formData.delete(TSS_FORMDATA_CONTEXT);
          const params = {
            context,
            data: formData,
            method: methodUpper
          };
          if (typeof serializedContext === "string") {
            try {
              const parsedContext = JSON.parse(serializedContext);
              const deserializedContext = Iu(parsedContext, {
                plugins: serovalPlugins
              });
              if (typeof deserializedContext === "object" && deserializedContext) {
                params.context = safeObjectMerge(
                  context,
                  deserializedContext
                );
              }
            } catch (e) {
              if (false) ;
            }
          }
          return await action(params);
        }
        if (methodLower === "get") {
          const payloadParam = url.searchParams.get("payload");
          if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) {
            throw new Error("Payload too large");
          }
          const payload2 = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
          payload2.context = safeObjectMerge(context, payload2.context);
          payload2.method = methodUpper;
          return await action(payload2);
        }
        if (methodLower !== "post") {
          throw new Error("expected POST method");
        }
        let jsonPayload;
        if (contentType?.includes("application/json")) {
          jsonPayload = await request.json();
        }
        const payload = jsonPayload ? parsePayload(jsonPayload) : {};
        payload.context = safeObjectMerge(payload.context, context);
        payload.method = methodUpper;
        return await action(payload);
      })();
      const unwrapped = res.result || res.error;
      if (isNotFound(res)) {
        res = isNotFoundResponse(res);
      }
      if (!isServerFn) {
        return unwrapped;
      }
      if (unwrapped instanceof Response) {
        if (isRedirect(unwrapped)) {
          return unwrapped;
        }
        unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
        return unwrapped;
      }
      return serializeResult(res);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if (isNotFound(error)) {
        return isNotFoundResponse(error);
      }
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      const serializedError = JSON.stringify(
        await Promise.resolve(
          ou(error, {
            refs: /* @__PURE__ */ new Map(),
            plugins: serovalPlugins
          })
        )
      );
      const response2 = getResponse();
      return new Response(serializedError, {
        status: response2.status ?? 500,
        statusText: response2.statusText,
        headers: {
          "Content-Type": "application/json",
          [X_TSS_SERIALIZED]: "true"
        }
      });
    }
  })();
  return response;
};
function isNotFoundResponse(error) {
  const { headers, ...rest } = error;
  return new Response(JSON.stringify(rest), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
function resolveTransformConfig(transform) {
  if (typeof transform === "string") {
    const prefix = transform;
    return {
      type: "transform",
      transformFn: ({ url }) => `${prefix}${url}`,
      cache: true
    };
  }
  if (typeof transform === "function") {
    return {
      type: "transform",
      transformFn: transform,
      cache: true
    };
  }
  if ("createTransform" in transform && transform.createTransform) {
    return {
      type: "createTransform",
      createTransform: transform.createTransform,
      cache: transform.cache !== false
    };
  }
  const transformFn = typeof transform.transform === "string" ? (({ url }) => `${transform.transform}${url}`) : transform.transform;
  return {
    type: "transform",
    transformFn,
    cache: transform.cache !== false
  };
}
function buildClientEntryScriptTag(clientEntry, injectedHeadScripts) {
  const clientEntryLiteral = JSON.stringify(clientEntry);
  let script = `import(${clientEntryLiteral})`;
  if (injectedHeadScripts) {
    script = `${injectedHeadScripts};${script}`;
  }
  return {
    tag: "script",
    attrs: {
      type: "module",
      async: true
    },
    children: script
  };
}
function transformManifestUrls(source, transformFn, opts) {
  return (async () => {
    const manifest2 = opts?.clone ? structuredClone(source.manifest) : source.manifest;
    for (const route of Object.values(manifest2.routes)) {
      if (route.preloads) {
        route.preloads = await Promise.all(
          route.preloads.map(
            (url) => Promise.resolve(transformFn({ url, type: "modulepreload" }))
          )
        );
      }
      if (route.assets) {
        for (const asset of route.assets) {
          if (asset.tag === "link" && asset.attrs?.href) {
            asset.attrs.href = await Promise.resolve(
              transformFn({
                url: asset.attrs.href,
                type: "stylesheet"
              })
            );
          }
        }
      }
    }
    const transformedClientEntry = await Promise.resolve(
      transformFn({
        url: source.clientEntry,
        type: "clientEntry"
      })
    );
    const rootRoute = manifest2.routes[rootRouteId];
    if (rootRoute) {
      rootRoute.assets = rootRoute.assets || [];
      rootRoute.assets.push(
        buildClientEntryScriptTag(
          transformedClientEntry,
          source.injectedHeadScripts
        )
      );
    }
    return manifest2;
  })();
}
function buildManifestWithClientEntry(source) {
  const scriptTag = buildClientEntryScriptTag(
    source.clientEntry,
    source.injectedHeadScripts
  );
  const baseRootRoute = source.manifest.routes[rootRouteId];
  const routes = {
    ...source.manifest.routes,
    ...baseRootRoute ? {
      [rootRouteId]: {
        ...baseRootRoute,
        assets: [...baseRootRoute.assets || [], scriptTag]
      }
    } : {}
  };
  return { routes };
}
const HEADERS = {
  TSS_SHELL: "X-TSS_SHELL"
};
const ServerFunctionSerializationAdapter = createSerializationAdapter({
  key: "$TSS/serverfn",
  test: (v) => {
    if (typeof v !== "function") return false;
    if (!(TSS_SERVER_FUNCTION in v)) return false;
    return !!v[TSS_SERVER_FUNCTION];
  },
  toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
  fromSerializable: ({ functionId }) => {
    const fn = async (opts, signal) => {
      const serverFn = await getServerFnById(functionId);
      const result = await serverFn(opts ?? {}, signal);
      return result.result;
    };
    return fn;
  }
});
function getStartResponseHeaders(opts) {
  const headers = mergeHeaders(
    {
      "Content-Type": "text/html; charset=utf-8"
    },
    ...opts.router.state.matches.map((match) => {
      return match.headers;
    })
  );
  return headers;
}
let entriesPromise;
let baseManifestPromise;
let cachedFinalManifestPromise;
async function loadEntries() {
  const routerEntry = await import("./router-PIQq-s-a.mjs");
  const startEntry = await import("./start-HYkvq4Ni.mjs");
  return { startEntry, routerEntry };
}
function getEntries() {
  if (!entriesPromise) {
    entriesPromise = loadEntries();
  }
  return entriesPromise;
}
function getBaseManifest(matchedRoutes) {
  if (!baseManifestPromise) {
    baseManifestPromise = getStartManifest();
  }
  return baseManifestPromise;
}
async function resolveManifest(matchedRoutes, transformFn, cache) {
  const base = await getBaseManifest();
  const computeFinalManifest = async () => {
    return transformFn ? await transformManifestUrls(base, transformFn, { clone: !cache }) : buildManifestWithClientEntry(base);
  };
  if (!transformFn || cache) {
    if (!cachedFinalManifestPromise) {
      cachedFinalManifestPromise = computeFinalManifest();
    }
    return cachedFinalManifestPromise;
  }
  return computeFinalManifest();
}
const ROUTER_BASEPATH = "/";
const SERVER_FN_BASE = "/_serverFn/";
const IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
const IS_SHELL_ENV = process.env.TSS_SHELL === "true";
const ERR_NO_RESPONSE = "Internal Server Error";
const ERR_NO_DEFER = "Internal Server Error";
function throwRouteHandlerError() {
  throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
  throw new Error(ERR_NO_DEFER);
}
function isSpecialResponse(value) {
  return value instanceof Response || isRedirect(value);
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) {
    return { response: result };
  }
  return result;
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (nextCtx) => {
    if (nextCtx) {
      if (nextCtx.context) {
        ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
      }
      for (const key of Object.keys(nextCtx)) {
        if (key !== "context") {
          ctx[key] = nextCtx[key];
        }
      }
    }
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx;
    let result;
    try {
      result = await middleware({ ...ctx, next });
    } catch (err) {
      if (isSpecialResponse(err)) {
        ctx.response = err;
        return ctx;
      }
      throw err;
    }
    const normalized = handleCtxResult(result);
    if (normalized) {
      if (normalized.response !== void 0) {
        ctx.response = normalized.response;
      }
      if (normalized.context) {
        ctx.context = safeObjectMerge(ctx.context, normalized.context);
      }
    }
    return ctx;
  };
  return next();
}
function handlerToMiddleware(handler, mayDefer = false) {
  if (mayDefer) {
    return handler;
  }
  return async (ctx) => {
    const response = await handler({ ...ctx, next: throwIfMayNotDefer });
    if (!response) {
      throwRouteHandlerError();
    }
    return response;
  };
}
function createStartHandler(cbOrOptions) {
  const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
  const transformAssetUrlsOption = typeof cbOrOptions === "function" ? void 0 : cbOrOptions.transformAssetUrls;
  const warmupTransformManifest = !!transformAssetUrlsOption && typeof transformAssetUrlsOption === "object" && transformAssetUrlsOption.warmup === true;
  const resolvedTransformConfig = transformAssetUrlsOption ? resolveTransformConfig(transformAssetUrlsOption) : void 0;
  const cache = resolvedTransformConfig ? resolvedTransformConfig.cache : true;
  let cachedCreateTransformPromise;
  const getTransformFn = async (opts) => {
    if (!resolvedTransformConfig) return void 0;
    if (resolvedTransformConfig.type === "createTransform") {
      if (cache) {
        if (!cachedCreateTransformPromise) {
          cachedCreateTransformPromise = Promise.resolve(
            resolvedTransformConfig.createTransform(opts)
          );
        }
        return cachedCreateTransformPromise;
      }
      return resolvedTransformConfig.createTransform(opts);
    }
    return resolvedTransformConfig.transformFn;
  };
  if (warmupTransformManifest && cache && true && !cachedFinalManifestPromise) {
    const warmupPromise = (async () => {
      const base = await getBaseManifest();
      const transformFn = await getTransformFn({ warmup: true });
      return transformFn ? await transformManifestUrls(base, transformFn, { clone: false }) : buildManifestWithClientEntry(base);
    })();
    cachedFinalManifestPromise = warmupPromise;
    warmupPromise.catch(() => {
      if (cachedFinalManifestPromise === warmupPromise) {
        cachedFinalManifestPromise = void 0;
      }
      cachedCreateTransformPromise = void 0;
    });
  }
  const startRequestResolver = async (request, requestOpts) => {
    let router = null;
    let cbWillCleanup = false;
    try {
      const { url, handledProtocolRelativeURL } = getNormalizedURL(request.url);
      const href = url.pathname + url.search + url.hash;
      const origin = getOrigin(request);
      if (handledProtocolRelativeURL) {
        return Response.redirect(url, 308);
      }
      const entries = await getEntries();
      const startOptions = await entries.startEntry.startInstance?.getOptions() || {};
      const serializationAdapters = [
        ...startOptions.serializationAdapters || [],
        ServerFunctionSerializationAdapter
      ];
      const requestStartOptions = {
        ...startOptions,
        serializationAdapters
      };
      const flattenedRequestMiddlewares = startOptions.requestMiddleware ? flattenMiddlewares(startOptions.requestMiddleware) : [];
      const executedRequestMiddlewares = new Set(
        flattenedRequestMiddlewares
      );
      const getRouter = async () => {
        if (router) return router;
        router = await entries.routerEntry.getRouter();
        let isShell = IS_SHELL_ENV;
        if (IS_PRERENDERING && !isShell) {
          isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
        }
        const history = createMemoryHistory({
          initialEntries: [href]
        });
        router.update({
          history,
          isShell,
          isPrerendering: IS_PRERENDERING,
          origin: router.options.origin ?? origin,
          ...{
            defaultSsr: requestStartOptions.defaultSsr,
            serializationAdapters: [
              ...requestStartOptions.serializationAdapters,
              ...router.options.serializationAdapters || []
            ]
          },
          basepath: ROUTER_BASEPATH
        });
        return router;
      };
      if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
        const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
        if (!serverFnId) {
          throw new Error("Invalid server action param for serverFnId");
        }
        const serverFnHandler = async ({ context }) => {
          return runWithStartContext(
            {
              getRouter,
              startOptions: requestStartOptions,
              contextAfterGlobalMiddlewares: context,
              request,
              executedRequestMiddlewares
            },
            () => handleServerAction({
              request,
              context: requestOpts?.context,
              serverFnId
            })
          );
        };
        const middlewares2 = flattenedRequestMiddlewares.map(
          (d) => d.options.server
        );
        const ctx2 = await executeMiddleware([...middlewares2, serverFnHandler], {
          request,
          pathname: url.pathname,
          context: createNullProtoObject(requestOpts?.context)
        });
        return handleRedirectResponse(ctx2.response, request, getRouter);
      }
      const executeRouter = async (serverContext, matchedRoutes) => {
        const acceptHeader = request.headers.get("Accept") || "*/*";
        const acceptParts = acceptHeader.split(",");
        const supportedMimeTypes = ["*/*", "text/html"];
        const isSupported = supportedMimeTypes.some(
          (mimeType) => acceptParts.some((part) => part.trim().startsWith(mimeType))
        );
        if (!isSupported) {
          return Response.json(
            { error: "Only HTML requests are supported here" },
            { status: 500 }
          );
        }
        const manifest2 = await resolveManifest(
          matchedRoutes,
          await getTransformFn({ warmup: false, request }),
          cache
        );
        const routerInstance = await getRouter();
        attachRouterServerSsrUtils({
          router: routerInstance,
          manifest: manifest2
        });
        routerInstance.update({ additionalContext: { serverContext } });
        await routerInstance.load();
        if (routerInstance.state.redirect) {
          return routerInstance.state.redirect;
        }
        await routerInstance.serverSsr.dehydrate();
        const responseHeaders = getStartResponseHeaders({
          router: routerInstance
        });
        cbWillCleanup = true;
        return cb({
          request,
          router: routerInstance,
          responseHeaders
        });
      };
      const requestHandlerMiddleware = async ({ context }) => {
        return runWithStartContext(
          {
            getRouter,
            startOptions: requestStartOptions,
            contextAfterGlobalMiddlewares: context,
            request,
            executedRequestMiddlewares
          },
          async () => {
            try {
              return await handleServerRoutes({
                getRouter,
                request,
                url,
                executeRouter,
                context,
                executedRequestMiddlewares
              });
            } catch (err) {
              if (err instanceof Response) {
                return err;
              }
              throw err;
            }
          }
        );
      };
      const middlewares = flattenedRequestMiddlewares.map(
        (d) => d.options.server
      );
      const ctx = await executeMiddleware(
        [...middlewares, requestHandlerMiddleware],
        {
          request,
          pathname: url.pathname,
          context: createNullProtoObject(requestOpts?.context)
        }
      );
      return handleRedirectResponse(ctx.response, request, getRouter);
    } finally {
      if (router && !cbWillCleanup) {
        router.serverSsr?.cleanup();
      }
      router = null;
    }
  };
  return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter) {
  if (!isRedirect(response)) {
    return response;
  }
  if (isResolvedRedirect(response)) {
    if (request.headers.get("x-tsr-serverFn") === "true") {
      return Response.json(
        { ...response.options, isSerializedRedirect: true },
        { headers: response.headers }
      );
    }
    return response;
  }
  const opts = response.options;
  if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) {
    throw new Error(
      `Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`
    );
  }
  if (["params", "search", "hash"].some(
    (d) => typeof opts[d] === "function"
  )) {
    throw new Error(
      `Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(
        opts
      ).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`
    );
  }
  const router = await getRouter();
  const redirect = router.resolveRedirect(response);
  if (request.headers.get("x-tsr-serverFn") === "true") {
    return Response.json(
      { ...response.options, isSerializedRedirect: true },
      { headers: response.headers }
    );
  }
  return redirect;
}
async function handleServerRoutes({
  getRouter,
  request,
  url,
  executeRouter,
  context,
  executedRequestMiddlewares
}) {
  const router = await getRouter();
  const rewrittenUrl = executeRewriteInput(router.rewrite, url);
  const pathname = rewrittenUrl.pathname;
  const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname);
  const isExactMatch = foundRoute && routeParams["**"] === void 0;
  const routeMiddlewares = [];
  for (const route of matchedRoutes) {
    const serverMiddleware = route.options.server?.middleware;
    if (serverMiddleware) {
      const flattened = flattenMiddlewares(serverMiddleware);
      for (const m of flattened) {
        if (!executedRequestMiddlewares.has(m)) {
          routeMiddlewares.push(m.options.server);
        }
      }
    }
  }
  const server2 = foundRoute?.options.server;
  if (server2?.handlers && isExactMatch) {
    const handlers = typeof server2.handlers === "function" ? server2.handlers({ createHandlers: (d) => d }) : server2.handlers;
    const requestMethod = request.method.toUpperCase();
    const handler = handlers[requestMethod] ?? handlers["ANY"];
    if (handler) {
      const mayDefer = !!foundRoute.options.component;
      if (typeof handler === "function") {
        routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
      } else {
        if (handler.middleware?.length) {
          const handlerMiddlewares = flattenMiddlewares(handler.middleware);
          for (const m of handlerMiddlewares) {
            routeMiddlewares.push(m.options.server);
          }
        }
        if (handler.handler) {
          routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
        }
      }
    }
  }
  routeMiddlewares.push(
    (ctx2) => executeRouter(ctx2.context, matchedRoutes)
  );
  const ctx = await executeMiddleware(routeMiddlewares, {
    request,
    context,
    params: routeParams,
    pathname
  });
  return ctx.response;
}
const renderRouterToStream = async ({
  request,
  router,
  responseHeaders,
  children
}) => {
  const {
    writable,
    readable
  } = new TransformStream();
  const docType = ssr("<!DOCTYPE html>");
  const serializationAdapters = router.options?.serializationAdapters || router.options.ssr?.serializationAdapters;
  const serovalPlugins2 = serializationAdapters?.map((adapter) => {
    const plugin = makeSsrSerovalPlugin(adapter, {
      didRun: false
    });
    return plugin;
  });
  const stream = renderToStream(() => [docType, children()], {
    nonce: router.options.ssr?.nonce,
    plugins: serovalPlugins2
  });
  if (isbot(request.headers.get("User-Agent"))) {
    await stream;
  }
  stream.pipeTo(writable);
  const responseStream = transformReadableStreamWithRouter(router, readable);
  return new Response(responseStream, {
    status: router.state.statusCode,
    headers: responseHeaders
  });
};
const defaultStreamHandler = defineHandlerCallback(async ({
  request,
  router,
  responseHeaders
}) => await renderRouterToStream({
  request,
  router,
  responseHeaders,
  children: () => createComponent(StartServer, {
    router
  })
}));
const fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
  return {
    async fetch(...args) {
      return await entry.fetch(...args);
    }
  };
}
const server = createServerEntry({ fetch });
export {
  Outlet as O,
  useRouterState as a,
  useIntersectionObserver as b,
  createServerEntry,
  dummyMatchContext as d,
  server as default,
  matchContext as m,
  useRouter as u
};
