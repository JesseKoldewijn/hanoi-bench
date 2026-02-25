import { s as ssr, g as ssrHydrationKey, i as escape, k as createSignal, c as createComponent, m as mergeProps, u as useContext, b as createMemo, n as splitProps, p as ssrElement, D as Dynamic, f as createResource, d as Suspense, H as HydrationScript, N as NoHydration, F as For, l as ssrAttribute, q as useAssets, a as createContext, t as createUniqueId, v as createRenderEffect, w as onCleanup } from "../_libs/solid-js.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { R as RouterCore, B as BaseRootRoute, v as isModuleNotFoundError, w as isDangerousProtocol, x as exactPathTest, y as removeTrailingSlash, z as deepEqual, A as isServer, C as functionalUpdate, D as BaseRoute, E as preloadWarning, h as escapeHtml } from "../_chunks/_libs/@tanstack/router-core.mjs";
import { m as mergeRefs } from "../_chunks/_libs/@solid-primitives/refs.mjs";
import { d as dummyMatchContext, m as matchContext, a as useRouterState, u as useRouter, b as useIntersectionObserver, O as Outlet } from "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "node:stream/web";
import "../_chunks/_libs/@solid-primitives/utils.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream";
import "node:https";
import "node:http2";
import "../_libs/tiny-warning.mjs";
import "../_libs/isbot.mjs";
function useHydrated() {
  const [hydrated] = createSignal(false);
  return hydrated;
}
var _tmpl$$5 = ["<svg", ">", "</svg>"];
const timeoutMap = /* @__PURE__ */ new WeakMap();
function useLinkProps(options) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = createSignal(false);
  const shouldHydrateHash = !isServer;
  const hasHydrated = useHydrated();
  const [local, rest] = splitProps(mergeProps({
    activeProps: () => ({
      class: "active"
    }),
    inactiveProps: () => ({})
  }, options), ["activeProps", "inactiveProps", "activeOptions", "to", "preload", "preloadDelay", "hashScrollIntoView", "replace", "startTransition", "resetScroll", "viewTransition", "target", "disabled", "style", "class", "onClick", "onBlur", "onFocus", "onMouseEnter", "onMouseLeave", "onMouseOver", "onMouseOut", "onTouchStart", "ignoreBlocker"]);
  const [_, propsSafeToSpread] = splitProps(rest, ["params", "search", "hash", "state", "mask", "reloadDocument", "unsafeRelative"]);
  const currentLocation = useRouterState({
    select: (s) => s.location
  });
  const currentSearch = useRouterState({
    select: (s) => s.location.searchStr
  });
  const from = options.from;
  const _options = () => {
    return {
      ...options,
      from
    };
  };
  const next = createMemo(() => {
    currentSearch();
    return router.buildLocation(_options());
  });
  const hrefOption = createMemo(() => {
    if (_options().disabled) return void 0;
    const location = next().maskedLocation ?? next();
    const publicHref = location.publicHref;
    const external = location.external;
    if (external) {
      return {
        href: publicHref,
        external: true
      };
    }
    return {
      href: router.history.createHref(publicHref) || "/",
      external: false
    };
  });
  const externalLink = createMemo(() => {
    const _href = hrefOption();
    if (_href?.external) {
      if (isDangerousProtocol(_href.href, router.protocolAllowlist)) {
        return void 0;
      }
      return _href.href;
    }
    const to = _options().to;
    const isSafeInternal = typeof to === "string" && to.charCodeAt(0) === 47 && // '/'
    to.charCodeAt(1) !== 47;
    if (isSafeInternal) return void 0;
    try {
      new URL(to);
      if (isDangerousProtocol(to, router.protocolAllowlist)) {
        if (false) ;
        return void 0;
      }
      return to;
    } catch {
    }
    return void 0;
  });
  const preload = createMemo(() => {
    if (_options().reloadDocument || externalLink()) {
      return false;
    }
    return local.preload ?? router.options.defaultPreload;
  });
  const preloadDelay = () => local.preloadDelay ?? router.options.defaultPreloadDelay ?? 0;
  const isActive = createMemo(() => {
    if (externalLink()) return false;
    if (local.activeOptions?.exact) {
      const testExact = exactPathTest(currentLocation().pathname, next().pathname, router.basepath);
      if (!testExact) {
        return false;
      }
    } else {
      const currentPathSplit = removeTrailingSlash(currentLocation().pathname, router.basepath).split("/");
      const nextPathSplit = removeTrailingSlash(next()?.pathname, router.basepath)?.split("/");
      const pathIsFuzzyEqual = nextPathSplit?.every((d, i) => d === currentPathSplit[i]);
      if (!pathIsFuzzyEqual) {
        return false;
      }
    }
    if (local.activeOptions?.includeSearch ?? true) {
      const searchTest = deepEqual(currentLocation().search, next().search, {
        partial: !local.activeOptions?.exact,
        ignoreUndefined: !local.activeOptions?.explicitUndefined
      });
      if (!searchTest) {
        return false;
      }
    }
    if (local.activeOptions?.includeHash) {
      const currentHash = shouldHydrateHash && !hasHydrated() ? "" : currentLocation().hash;
      return currentHash === next().hash;
    }
    return true;
  });
  const doPreload = () => router.preloadRoute(_options()).catch((err) => {
    console.warn(err);
    console.warn(preloadWarning);
  });
  const preloadViewportIoCallback = (entry) => {
    if (entry?.isIntersecting) {
      doPreload();
    }
  };
  const [ref, setRef] = createSignal(null);
  useIntersectionObserver(ref, preloadViewportIoCallback, {}, {
    disabled: !!local.disabled || !(preload() === "viewport")
  });
  if (externalLink()) {
    return mergeProps(propsSafeToSpread, {
      ref: mergeRefs(setRef, _options().ref),
      href: externalLink()
    }, splitProps(local, ["target", "disabled", "style", "class", "onClick", "onBlur", "onFocus", "onMouseEnter", "onMouseLeave", "onMouseOut", "onMouseOver", "onTouchStart"])[0]);
  }
  const handleClick = (e) => {
    const elementTarget = e.currentTarget.getAttribute("target");
    const effectiveTarget = local.target !== void 0 ? local.target : elementTarget;
    if (!local.disabled && !isCtrlEvent(e) && !e.defaultPrevented && (!effectiveTarget || effectiveTarget === "_self") && e.button === 0) {
      e.preventDefault();
      setIsTransitioning(true);
      const unsub = router.subscribe("onResolved", () => {
        unsub();
        setIsTransitioning(false);
      });
      router.navigate({
        ..._options(),
        replace: local.replace,
        resetScroll: local.resetScroll,
        hashScrollIntoView: local.hashScrollIntoView,
        startTransition: local.startTransition,
        viewTransition: local.viewTransition,
        ignoreBlocker: local.ignoreBlocker
      });
    }
  };
  const enqueueIntentPreload = (e) => {
    if (local.disabled || preload() !== "intent") return;
    if (!preloadDelay()) {
      doPreload();
      return;
    }
    const eventTarget = e.currentTarget || e.target;
    if (!eventTarget || timeoutMap.has(eventTarget)) return;
    timeoutMap.set(eventTarget, setTimeout(() => {
      timeoutMap.delete(eventTarget);
      doPreload();
    }, preloadDelay()));
  };
  const handleTouchStart = (_2) => {
    if (local.disabled || preload() !== "intent") return;
    doPreload();
  };
  const handleLeave = (e) => {
    if (local.disabled) return;
    const eventTarget = e.currentTarget || e.target;
    if (eventTarget) {
      const id = timeoutMap.get(eventTarget);
      clearTimeout(id);
      timeoutMap.delete(eventTarget);
    }
  };
  function callHandler(event, handler) {
    if (handler) {
      if (typeof handler === "function") {
        handler(event);
      } else {
        handler[0](handler[1], event);
      }
    }
    return event.defaultPrevented;
  }
  function composeEventHandlers(handlers) {
    return (event) => {
      for (const handler of handlers) {
        callHandler(event, handler);
      }
    };
  }
  const resolvedActiveProps = () => isActive() ? functionalUpdate(local.activeProps, {}) ?? {} : {};
  const resolvedInactiveProps = () => isActive() ? {} : functionalUpdate(local.inactiveProps, {});
  const resolvedClassName = () => [local.class, resolvedActiveProps().class, resolvedInactiveProps().class].filter(Boolean).join(" ");
  const resolvedStyle = () => ({
    ...local.style,
    ...resolvedActiveProps().style,
    ...resolvedInactiveProps().style
  });
  return mergeProps(propsSafeToSpread, resolvedActiveProps, resolvedInactiveProps, () => {
    return {
      href: hrefOption()?.href,
      ref: mergeRefs(setRef, _options().ref),
      onClick: composeEventHandlers([local.onClick, handleClick]),
      onBlur: composeEventHandlers([local.onBlur, handleLeave]),
      onFocus: composeEventHandlers([local.onFocus, enqueueIntentPreload]),
      onMouseEnter: composeEventHandlers([local.onMouseEnter, enqueueIntentPreload]),
      onMouseOver: composeEventHandlers([local.onMouseOver, enqueueIntentPreload]),
      onMouseLeave: composeEventHandlers([local.onMouseLeave, handleLeave]),
      onMouseOut: composeEventHandlers([local.onMouseOut, handleLeave]),
      onTouchStart: composeEventHandlers([local.onTouchStart, handleTouchStart]),
      disabled: !!local.disabled,
      target: local.target,
      ...(() => {
        const s = resolvedStyle();
        return Object.keys(s).length ? {
          style: s
        } : {};
      })(),
      ...(() => {
        const c = resolvedClassName();
        return c ? {
          class: c
        } : {};
      })(),
      ...local.disabled && {
        role: "link",
        "aria-disabled": true
      },
      ...isActive() && {
        "data-status": "active",
        "aria-current": "page"
      },
      ...isTransitioning() && {
        "data-transitioning": "transitioning"
      }
    };
  });
}
const Link$1 = (props) => {
  const [local, rest] = splitProps(props, ["_asChild", "children"]);
  const [_, linkProps] = splitProps(useLinkProps(rest), ["type"]);
  const children = createMemo(() => {
    const ch = local.children;
    if (typeof ch === "function") {
      return ch({
        get isActive() {
          return linkProps["data-status"] === "active";
        },
        get isTransitioning() {
          return linkProps["data-transitioning"] === "transitioning";
        }
      });
    }
    return ch;
  });
  if (local._asChild === "svg") {
    const [_2, svgLinkProps] = splitProps(linkProps, ["class"]);
    return ssr(_tmpl$$5, ssrHydrationKey(), ssrElement("a", svgLinkProps, () => escape(children()), false));
  }
  return createComponent(Dynamic, mergeProps({
    get component() {
      return local._asChild ? local._asChild : "a";
    }
  }, linkProps, {
    get children() {
      return children();
    }
  }));
};
function isCtrlEvent(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function useMatch(opts) {
  const nearestMatchId = useContext(opts.from ? dummyMatchContext : matchContext);
  const matchState = useRouterState({
    select: (state) => {
      const match = state.matches.find((d) => opts.from ? opts.from === d.routeId : d.id === nearestMatchId());
      if (match === void 0) {
        const pendingMatch = state.pendingMatches?.find((d) => opts.from ? opts.from === d.routeId : d.id === nearestMatchId());
        const shouldThrowError = !pendingMatch && !state.isTransitioning && (opts.shouldThrow ?? true);
        return {
          match: void 0,
          shouldThrowError
        };
      }
      return {
        match: opts.select ? opts.select(match) : match,
        shouldThrowError: false
      };
    }
  });
  return createMemo(() => matchState().match);
}
function useLoaderData(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    select: (s) => {
      return opts.select ? opts.select(s.loaderData) : s.loaderData;
    }
  });
}
function useLoaderDeps(opts) {
  const {
    select,
    ...rest
  } = opts;
  return useMatch({
    ...rest,
    select: (s) => {
      return select ? select(s.loaderDeps) : s.loaderDeps;
    }
  });
}
function useParams(opts) {
  return useMatch({
    from: opts.from,
    shouldThrow: opts.shouldThrow,
    strict: opts.strict,
    select: (match) => {
      const params = opts.strict === false ? match.params : match._strictParams;
      return opts.select ? opts.select(params) : params;
    }
  });
}
function useSearch(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    select: (match) => {
      return opts.select ? opts.select(match.search) : match.search;
    }
  });
}
function useNavigate(_defaultOpts) {
  const router = useRouter();
  return (options) => {
    return router.navigate({
      ...options,
      from: options.from ?? _defaultOpts?.from
    });
  };
}
let Route$2 = class Route extends BaseRoute {
  /**
   * @deprecated Use the `createRoute` function instead.
   */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id
      });
    };
    this.useRouteContext = (opts) => {
      return useMatch({
        ...opts,
        from: this.id,
        select: (d) => opts?.select ? opts.select(d.context) : d.context
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({
        from: this.fullPath
      });
    };
    this.Link = (props) => {
      const _self$ = this;
      return createComponent(Link$1, mergeProps({
        get from() {
          return _self$.fullPath;
        }
      }, props));
    };
  }
};
function createRoute(options) {
  return new Route$2(options);
}
class RootRoute extends BaseRootRoute {
  /**
   * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
   */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id
      });
    };
    this.useRouteContext = (opts) => {
      return useMatch({
        ...opts,
        from: this.id,
        select: (d) => opts?.select ? opts.select(d.context) : d.context
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({
        from: this.fullPath
      });
    };
    this.Link = (props) => {
      const _self$2 = this;
      return createComponent(Link$1, mergeProps({
        get from() {
          return _self$2.fullPath;
        }
      }, props));
    };
  }
}
function createRootRoute(options) {
  return new RootRoute(options);
}
function createFileRoute(path) {
  if (typeof path === "object") {
    return new FileRoute(path, {
      silent: true
    }).createRoute(path);
  }
  return new FileRoute(path, {
    silent: true
  }).createRoute;
}
class FileRoute {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      const route = createRoute(options);
      route.isRoot = false;
      return route;
    };
    this.silent = _opts?.silent;
  }
}
class LazyRoute {
  constructor(opts) {
    this.useMatch = (opts2) => {
      return useMatch({
        select: opts2?.select,
        from: this.options.id
      });
    };
    this.useRouteContext = (opts2) => {
      return useMatch({
        from: this.options.id,
        select: (d) => opts2?.select ? opts2.select(d.context) : d.context
      });
    };
    this.useSearch = (opts2) => {
      return useSearch({
        select: opts2?.select,
        from: this.options.id
      });
    };
    this.useParams = (opts2) => {
      return useParams({
        select: opts2?.select,
        from: this.options.id
      });
    };
    this.useLoaderDeps = (opts2) => {
      return useLoaderDeps({ ...opts2, from: this.options.id });
    };
    this.useLoaderData = (opts2) => {
      return useLoaderData({ ...opts2, from: this.options.id });
    };
    this.useNavigate = () => {
      const router = useRouter();
      return useNavigate({ from: router.routesById[this.options.id].fullPath });
    };
    this.options = opts;
  }
}
function createLazyFileRoute(id) {
  if (typeof id === "object") {
    return new LazyRoute(id);
  }
  return (opts) => new LazyRoute({ id, ...opts });
}
function lazyRouteComponent(importer, exportName) {
  let loadPromise;
  let comp;
  let error;
  const load = () => {
    if (!loadPromise) {
      loadPromise = importer().then((res) => {
        loadPromise = void 0;
        comp = res[exportName];
        return comp;
      }).catch((err) => {
        error = err;
      });
    }
    return loadPromise;
  };
  const lazyComp = function Lazy(props) {
    if (error) {
      if (isModuleNotFoundError(error)) {
        if (error instanceof Error && typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
          const storageKey = `tanstack_router_reload:${error.message}`;
          if (!sessionStorage.getItem(storageKey)) {
            sessionStorage.setItem(storageKey, "1");
            window.location.reload();
            return {
              default: () => null
            };
          }
        }
      }
      throw error;
    }
    if (!comp) {
      const [compResource] = createResource(load, {
        initialValue: comp,
        ssrLoadFrom: "initial"
      });
      return createComponent(Dynamic, mergeProps({
        get component() {
          return compResource();
        }
      }, props));
    }
    return createComponent(Dynamic, mergeProps({
      component: comp
    }, props));
  };
  lazyComp.preload = load;
  return lazyComp;
}
const createRouter = (options) => {
  return new Router(options);
};
class Router extends RouterCore {
  constructor(options) {
    super(options);
  }
}
if (typeof globalThis !== "undefined") {
  globalThis.createFileRoute = createFileRoute;
  globalThis.createLazyFileRoute = createLazyFileRoute;
} else if (typeof window !== "undefined") {
  window.createFileRoute = createFileRoute;
  window.createLazyFileRoute = createLazyFileRoute;
}
const MetaContext = createContext();
const cascadingTags = ["title", "meta"];
const titleTagProperties = [];
const metaTagProperties = (
  // https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element
  ["name", "http-equiv", "content", "charset", "media"].concat(["property"])
);
const getTagKey = (tag, properties) => {
  const tagProps = Object.fromEntries(Object.entries(tag.props).filter(([k]) => properties.includes(k)).sort());
  if (Object.hasOwn(tagProps, "name") || Object.hasOwn(tagProps, "property")) {
    tagProps.name = tagProps.name || tagProps.property;
    delete tagProps.property;
  }
  return tag.tag + JSON.stringify(tagProps);
};
function initServerProvider() {
  const tags = [];
  useAssets(() => ssr(renderTags(tags)));
  return {
    addTag(tagDesc) {
      if (cascadingTags.indexOf(tagDesc.tag) !== -1) {
        const properties = tagDesc.tag === "title" ? titleTagProperties : metaTagProperties;
        const tagDescKey = getTagKey(tagDesc, properties);
        const index = tags.findIndex((prev) => prev.tag === tagDesc.tag && getTagKey(prev, properties) === tagDescKey);
        if (index !== -1) {
          tags.splice(index, 1);
        }
      }
      tags.push(tagDesc);
      return tags.length;
    },
    removeTag(tag, index) {
    }
  };
}
const MetaProvider = (props) => {
  const actions = initServerProvider();
  return createComponent(MetaContext.Provider, {
    value: actions,
    get children() {
      return props.children;
    }
  });
};
const MetaTag = (tag, props, setting) => {
  useHead({
    tag,
    props,
    setting,
    id: createUniqueId(),
    get name() {
      return props.name || props.property;
    }
  });
  return null;
};
function useHead(tagDesc) {
  const c = useContext(MetaContext);
  if (!c) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const index = c.addTag(tagDesc);
    onCleanup(() => c.removeTag(tagDesc, index));
  });
}
function renderTags(tags) {
  return tags.map((tag) => {
    const keys = Object.keys(tag.props);
    const props = keys.map((k) => k === "children" ? "" : ` ${k}="${// @ts-expect-error
    escape(tag.props[k], true)}"`).join("");
    let children = tag.props.children;
    if (Array.isArray(children)) {
      children = children.join("");
    }
    if (tag.setting?.close) {
      return `<${tag.tag} data-sm="${tag.id}"${props}>${// @ts-expect-error
      tag.setting?.escape ? escape(children) : children || ""}</${tag.tag}>`;
    }
    return `<${tag.tag} data-sm="${tag.id}"${props}/>`;
  }).join("");
}
const Title = (props) => MetaTag("title", props, {
  escape: true,
  close: true
});
const Style = (props) => MetaTag("style", props, {
  close: true
});
const Meta = (props) => MetaTag("meta", props);
const Link = (props) => MetaTag("link", props);
function Asset({
  tag,
  attrs,
  children
}) {
  switch (tag) {
    case "title":
      return createComponent(Title, mergeProps(attrs, {
        children
      }));
    case "meta":
      return createComponent(Meta, attrs);
    case "link":
      return createComponent(Link, attrs);
    case "style":
      return createComponent(Style, mergeProps(attrs, {
        children
      }));
    case "script":
      return createComponent(Script, {
        attrs,
        children
      });
    default:
      return null;
  }
}
function Script({
  attrs,
  children
}) {
  useRouter();
  typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
  if (attrs?.src && typeof attrs.src === "string") {
    return ssrElement("script", attrs, void 0, true);
  }
  if (typeof children === "string") {
    return ssrElement("script", mergeProps(attrs, {
      innerHTML: children
    }), void 0, true);
  }
  return null;
}
const useTags = () => {
  const router = useRouter();
  const nonce = router.options.ssr?.nonce;
  const routeMeta = useRouterState({
    select: (state) => {
      return state.matches.map((match) => match.meta).filter(Boolean);
    }
  });
  const meta = createMemo(() => {
    const resultMeta = [];
    const metaByAttribute = {};
    let title;
    const routeMetasArray = routeMeta();
    for (let i = routeMetasArray.length - 1; i >= 0; i--) {
      const metas = routeMetasArray[i];
      for (let j = metas.length - 1; j >= 0; j--) {
        const m = metas[j];
        if (!m) continue;
        if (m.title) {
          if (!title) {
            title = {
              tag: "title",
              children: m.title
            };
          }
        } else if ("script:ld+json" in m) {
          try {
            const json = JSON.stringify(m["script:ld+json"]);
            resultMeta.push({
              tag: "script",
              attrs: {
                type: "application/ld+json"
              },
              children: escapeHtml(json)
            });
          } catch {
          }
        } else {
          const attribute = m.name ?? m.property;
          if (attribute) {
            if (metaByAttribute[attribute]) {
              continue;
            } else {
              metaByAttribute[attribute] = true;
            }
          }
          resultMeta.push({
            tag: "meta",
            attrs: {
              ...m,
              nonce
            }
          });
        }
      }
    }
    if (title) {
      resultMeta.push(title);
    }
    if (router.options.ssr?.nonce) {
      resultMeta.push({
        tag: "meta",
        attrs: {
          property: "csp-nonce",
          content: router.options.ssr.nonce
        }
      });
    }
    resultMeta.reverse();
    return resultMeta;
  });
  const links = useRouterState({
    select: (state) => {
      const constructed = state.matches.map((match) => match.links).filter(Boolean).flat(1).map((link) => ({
        tag: "link",
        attrs: {
          ...link,
          nonce
        }
      }));
      const manifest = router.ssr?.manifest;
      const assets = state.matches.map((match) => manifest?.routes[match.routeId]?.assets ?? []).filter(Boolean).flat(1).filter((asset) => asset.tag === "link").map((asset) => ({
        tag: "link",
        attrs: {
          ...asset.attrs,
          nonce
        }
      }));
      return [...constructed, ...assets];
    }
  });
  const preloadLinks = useRouterState({
    select: (state) => {
      const preloadLinks2 = [];
      state.matches.map((match) => router.looseRoutesById[match.routeId]).forEach((route) => router.ssr?.manifest?.routes[route.id]?.preloads?.filter(Boolean).forEach((preload) => {
        preloadLinks2.push({
          tag: "link",
          attrs: {
            rel: "modulepreload",
            href: preload,
            nonce
          }
        });
      }));
      return preloadLinks2;
    }
  });
  const styles = useRouterState({
    select: (state) => state.matches.map((match) => match.styles).flat(1).filter(Boolean).map(({
      children,
      ...style
    }) => ({
      tag: "style",
      attrs: {
        ...style,
        nonce
      },
      children
    }))
  });
  const headScripts = useRouterState({
    select: (state) => state.matches.map((match) => match.headScripts).flat(1).filter(Boolean).map(({
      children,
      ...script
    }) => ({
      tag: "script",
      attrs: {
        ...script,
        nonce
      },
      children
    }))
  });
  return () => uniqBy([...meta(), ...preloadLinks(), ...links(), ...styles(), ...headScripts()], (d) => {
    return JSON.stringify(d);
  });
};
function uniqBy(arr, fn) {
  const seen = /* @__PURE__ */ new Set();
  return arr.filter((item) => {
    const key = fn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function HeadContent() {
  const tags = useTags();
  return createComponent(MetaProvider, {
    get children() {
      return createComponent(For, {
        get each() {
          return tags();
        },
        children: (tag) => createComponent(Asset, tag)
      });
    }
  });
}
const Scripts = () => {
  const router = useRouter();
  const nonce = router.options.ssr?.nonce;
  const assetScripts = useRouterState({
    select: (state) => {
      const assetScripts2 = [];
      const manifest = router.ssr?.manifest;
      if (!manifest) {
        return [];
      }
      state.matches.map((match) => router.looseRoutesById[match.routeId]).forEach((route) => manifest.routes[route.id]?.assets?.filter((d) => d.tag === "script").forEach((asset) => {
        assetScripts2.push({
          tag: "script",
          attrs: {
            ...asset.attrs,
            nonce
          },
          children: asset.children
        });
      }));
      return assetScripts2;
    }
  });
  const scripts = useRouterState({
    select: (state) => ({
      scripts: state.matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({
        children,
        ...script
      }) => ({
        tag: "script",
        attrs: {
          ...script,
          nonce
        },
        children
      }))
    })
  });
  let serverBufferedScript = void 0;
  if (router.serverSsr) {
    serverBufferedScript = router.serverSsr.takeBufferedScripts();
  }
  const allScripts = [...scripts().scripts, ...assetScripts()];
  if (serverBufferedScript) {
    allScripts.unshift(serverBufferedScript);
  }
  return allScripts.map((asset, i) => createComponent(Asset, asset));
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var _tmpl$$4 = ["<button", ' type="button"', ">", "</button>"], _tmpl$2$2 = ["<span", ' aria-hidden="true">Sun</span>'], _tmpl$3$1 = ["<span", ' aria-hidden="true">Moon</span>'];
function ThemeToggle() {
  const [theme] = createSignal("light");
  return ssr(_tmpl$$4, ssrHydrationKey(), ssrAttribute("class", escape(cn("inline-flex size-9 items-center justify-center rounded-md", "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"), true)) + ssrAttribute("aria-label", theme() === "dark" ? "Switch to light mode" : "Switch to dark mode"), theme() === "dark" ? _tmpl$2$2[0] + ssrHydrationKey() + _tmpl$2$2[1] : _tmpl$3$1[0] + ssrHydrationKey() + _tmpl$3$1[1]);
}
var _tmpl$$3 = ["<header", ' class="border-b border-[var(--border)] bg-[var(--background)]"><div class="container mx-auto flex h-14 items-center justify-between px-4"><h1 class="text-lg font-semibold">Hanoi Benchmark</h1><div class="flex items-center justify-end">', "</div></div></header>"];
function Header() {
  return ssr(_tmpl$$3, ssrHydrationKey(), escape(createComponent(ThemeToggle, {})));
}
var _tmpl$$2 = ["<div", ' style="padding:0.5rem;max-width:100%"><div style="display:flex;align-items:center;gap:0.5rem"><strong style="font-size:1rem">Something went wrong!</strong><button type="button" style="font-size:0.6em;padding:0.1rem 0.2rem">', "</button></div><!--$-->", "<!--/--></div>"], _tmpl$2$1 = ["<pre", ' style="font-size:0.7em;border:1px solid red;padding:0.3rem;color:red">', "</pre>"];
function DefaultCatchBoundary(props) {
  const [show] = createSignal(false);
  return ssr(_tmpl$$2, ssrHydrationKey(), show() ? "Hide Error" : "Show Error", show() && ssr(_tmpl$2$1, ssrHydrationKey(), escape(props.error.message)));
}
var _tmpl$$1 = ["<p", ">Not Found</p>"];
function NotFound() {
  return ssr(_tmpl$$1, ssrHydrationKey());
}
const appCss = "/assets/app-BryGXPqJ.css";
var _tmpl$ = ["<head>", "", "</head>"], _tmpl$2 = ["<div", ' class="flex min-h-screen flex-col"><!--$-->', '<!--/--><main class="container mx-auto flex-1 px-4 py-6">', "</main></div>"], _tmpl$3 = ["<html", ' lang="en">', "<body><!--$-->", "<!--/--><!--$-->", "<!--/--></body></html>"], _tmpl$4 = ["<p", ">Loading...</p>"];
const Route$1 = createRootRoute({
  head: () => ({
    meta: [{
      charset: "utf-8"
    }, {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    }, {
      title: "Hanoi Benchmark"
    }],
    links: [{
      rel: "stylesheet",
      href: appCss
    }]
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: NotFound,
  shellComponent: RootShell
});
function RootShell() {
  return ssr(_tmpl$3, ssrHydrationKey(), createComponent(NoHydration, {
    get children() {
      return ssr(_tmpl$, escape(createComponent(HydrationScript, {})), escape(createComponent(HeadContent, {})));
    }
  }), escape(createComponent(Suspense, {
    get fallback() {
      return ssr(_tmpl$4, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(Header, {})), escape(createComponent(Outlet, {})));
    }
  })), escape(createComponent(Scripts, {})));
}
const $$splitComponentImporter = () => import("./index-D-idgYn4.mjs");
const Route2 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$1
});
const rootRouteChildren = {
  IndexRoute
};
const routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true
  });
  return router;
}
export {
  getRouter
};
