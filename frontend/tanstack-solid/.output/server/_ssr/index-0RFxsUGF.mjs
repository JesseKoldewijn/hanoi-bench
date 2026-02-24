import { s as ssr, i as escape, c as createComponent, g as ssrHydrationKey, l as ssrAttribute, h as ssrStyleProperty, k as createSignal } from "../_libs/solid-js.mjs";
import { a as useRouterState } from "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tiny-invariant.mjs";
import "node:stream/web";
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
function useLocation(opts) {
  return useRouterState({
    select: (state) => state.location
  });
}
var _tmpl$$3 = ["<p", ' class="text-muted-foreground">Loading moves...</p>'], _tmpl$2$2 = ["<p", ' class="text-red-600 dark:text-red-400">Error: <!--$-->', "<!--/--></p>"], _tmpl$3$1 = ["<div", ' class="space-y-4"><p class="text-muted-foreground text-sm">Step <!--$-->', "<!--/--> / <!--$-->", '<!--/--></p><div class="flex items-end justify-around gap-4" style="', '">', "</div></div>"], _tmpl$4$1 = ["<div", ' class="flex max-w-[120px] flex-1 flex-col items-center"><div class="mb-1 text-sm font-medium">', '</div><div class="bg-muted-foreground/30 w-1 flex-1 rounded-b" style="', '"></div><div class="mt-1 flex w-full flex-col-reverse items-center gap-0.5">', "</div></div>"], _tmpl$5 = ["<div", ' key="', '" class="bg-primary h-5 rounded transition-all duration-300 ease-out" style="', '"></div>'];
const ROD_LABELS$1 = ["A", "B", "C"];
function HanoiAnimate(props) {
  const [moves] = createSignal([]);
  const [error] = createSignal(null);
  const [loading] = createSignal(true);
  const [stepIndex] = createSignal(0);
  const [rods] = createSignal([[], [], []]);
  if (loading()) return ssr(_tmpl$$3, ssrHydrationKey());
  if (error()) return ssr(_tmpl$2$2, ssrHydrationKey(), escape(error()));
  const maxHeight = props.n;
  return ssr(_tmpl$3$1, ssrHydrationKey(), escape(Math.min(stepIndex(), moves().length)), escape(moves().length), ssrStyleProperty("min-height:", `${escape(maxHeight, true) * 24 + 80}px`), escape([0, 1, 2].map((rodIndex) => ssr(_tmpl$4$1, ssrHydrationKey() + ssrAttribute("key", escape(rodIndex, true)), escape(ROD_LABELS$1[rodIndex]), ssrStyleProperty("min-height:", `${escape(maxHeight, true) * 20}px`), escape((rods()[rodIndex] ?? []).map((size, i) => ssr(_tmpl$5, ssrHydrationKey(), `${escape(rodIndex, true)}-${escape(i, true)}-${escape(size, true)}`, ssrStyleProperty("width:", `${escape(Math.max(24, 24 + size * 16), true)}px`) + ssrStyleProperty(";min-width:", "24px"))))))));
}
var _tmpl$$2 = ["<p", ' class="text-[var(--muted-foreground)]">Loading moves...</p>'], _tmpl$2$1 = ["<p", ' class="text-red-600 dark:text-red-400">Error: <!--$-->', "<!--/--></p>"], _tmpl$3 = ["<div", ' class="space-y-4"><p class="text-sm text-[var(--muted-foreground)]">Total moves: <!--$-->', "<!--/--> (2^<!--$-->", "<!--/--> − 1 = <!--$-->", '<!--/-->)</p><div class="overflow-hidden rounded-md border border-[var(--border)]"><table class="w-full text-sm"><thead><tr class="border-b border-[var(--border)] bg-[var(--muted)]"><th class="p-3 text-left font-medium">Step</th><th class="p-3 text-left font-medium">From</th><th class="p-3 text-left font-medium">To</th></tr></thead><tbody>', "</tbody></table></div></div>"], _tmpl$4 = ["<tr", ' class="border-b border-[var(--border)] last:border-0"><td class="p-3">', '</td><td class="p-3">', '</td><td class="p-3">', "</td></tr>"];
const ROD_LABELS = {
  0: "A",
  1: "B",
  2: "C"
};
function HanoiTable(props) {
  const [moves] = createSignal([]);
  const [totalMoves] = createSignal(null);
  const [error] = createSignal(null);
  const [loading] = createSignal(true);
  if (loading() && moves().length === 0) {
    return ssr(_tmpl$$2, ssrHydrationKey());
  }
  if (error()) {
    return ssr(_tmpl$2$1, ssrHydrationKey(), escape(error()));
  }
  const total = totalMoves() ?? moves().length;
  return ssr(_tmpl$3, ssrHydrationKey(), escape(total), escape(props.n), escape(Math.pow(2, props.n)) - 1, escape(moves().map((move, i) => ssr(_tmpl$4, ssrHydrationKey() + ssrAttribute("key", escape(i, true)), escape(i) + 1, escape(ROD_LABELS[move.from]) ?? escape(move.from), escape(ROD_LABELS[move.to]) ?? escape(move.to)))));
}
var _tmpl$$1 = ["<div", ' class="space-y-6"><div class="text-muted-foreground flex flex-wrap items-center gap-4 text-sm"><span>Disks: <!--$-->', "<!--/--></span><span>Backend: <!--$-->", "<!--/--></span><!--$-->", "<!--/--><span>View: <!--$-->", '<!--/--></span><span class="text-xs">Query: ?n=<!--$-->', "<!--/-->&backend=<!--$-->", "<!--/-->&view=<!--$-->", "<!--/--><!--$-->", "<!--/--></span></div><!--$-->", "<!--/--></div>"], _tmpl$2 = ["<span", ">Speed: <!--$-->", "<!--/--> ms/move</span>"];
function useSearchParams() {
  useLocation();
  const [params] = createSignal({
    n: 5,
    speed: 400,
    backend: "rust",
    view: "table"
  });
  return params;
}
function HanoiPageClient() {
  const params = useSearchParams();
  const p = () => params();
  return ssr(_tmpl$$1, ssrHydrationKey(), escape(p().n), escape(p().backend), p().view === "animate" && ssr(_tmpl$2, ssrHydrationKey(), escape(p().speed)), escape(p().view), escape(p().n), escape(p().backend), escape(p().view), p().view === "animate" ? `&speed=${escape(p().speed)}` : "", p().view === "table" ? escape(createComponent(HanoiTable, {
    get n() {
      return p().n;
    },
    get backend() {
      return p().backend;
    }
  })) : escape(createComponent(HanoiAnimate, {
    get n() {
      return p().n;
    },
    get backend() {
      return p().backend;
    },
    get speedMs() {
      return p().speed;
    }
  })));
}
var _tmpl$ = ["<main", ' class="container mx-auto flex-1 px-4 py-6">', "</main>"];
function IndexPage() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(HanoiPageClient, {})));
}
export {
  IndexPage as component
};
