import { c as createComponent, k as createSignal, s as ssr, i as escape, S as Show, g as ssrHydrationKey, h as ssrStyleProperty } from "../_libs/solid-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
var _tmpl$$2 = ["<p", ' class="text-muted-foreground">Loading moves...</p>'], _tmpl$2$2 = ["<p", ' class="text-red-600 dark:text-red-400">Error: <!--$-->', "<!--/--></p>"], _tmpl$3$1 = ["<div", ' class="space-y-4"><p class="text-muted-foreground text-sm">Step <!--$-->', "<!--/--> / <!--$-->", '<!--/--></p><div class="flex items-end justify-around gap-4" style="', '">', "</div></div>"], _tmpl$4$1 = ["<div", ' class="flex max-w-[120px] flex-1 flex-col items-center"><div class="mb-1 text-sm font-medium">', '</div><div class="bg-muted-foreground/30 w-1 flex-1 rounded-b" style="', '"></div><div class="mt-1 flex w-full flex-col-reverse items-center gap-0.5">', "</div></div>"], _tmpl$5 = ["<div", ' class="bg-primary h-5 rounded transition-all duration-300 ease-out" style="', '"></div>'];
const ROD_LABELS$1 = ["A", "B", "C"];
function HanoiAnimate(props) {
  const [moves] = createSignal([]);
  const [error] = createSignal(null);
  const [loading] = createSignal(true);
  const [stepIndex] = createSignal(0);
  const [rods] = createSignal([[], [], []]);
  if (loading()) return ssr(_tmpl$$2, ssrHydrationKey());
  if (error()) return ssr(_tmpl$2$2, ssrHydrationKey(), escape(error()));
  const moveList = moves();
  const step = stepIndex();
  const maxHeight = props.n;
  return ssr(_tmpl$3$1, ssrHydrationKey(), escape(Math.min(step, moveList.length)), escape(moveList.length), ssrStyleProperty("min-height:", `${escape(maxHeight, true) * 24 + 80}px`), escape([0, 1, 2].map((rodIndex) => ssr(_tmpl$4$1, ssrHydrationKey(), escape(ROD_LABELS$1[rodIndex]), ssrStyleProperty("min-height:", `${escape(maxHeight, true) * 20}px`), escape((rods()[rodIndex] ?? []).map((size, i) => ssr(_tmpl$5, ssrHydrationKey(), ssrStyleProperty("width:", `${escape(Math.max(24, 24 + size * 16), true)}px`) + ssrStyleProperty(";min-width:", "24px"))))))));
}
var _tmpl$$1 = ["<p", ' class="text-[var(--muted-foreground)]">Loading moves...</p>'], _tmpl$2$1 = ["<p", ' class="text-red-600 dark:text-red-400">Error: <!--$-->', "<!--/--></p>"], _tmpl$3 = ["<div", ' class="space-y-4"><p class="text-sm text-[var(--muted-foreground)]">Total moves: <!--$-->', "<!--/--> (2^<!--$-->", "<!--/--> - 1 = <!--$-->", '<!--/-->)</p><div class="overflow-hidden rounded-md border border-[var(--border)]"><table class="w-full text-sm"><thead><tr class="border-b border-[var(--border)] bg-[var(--muted)]"><th class="p-3 text-left font-medium">Step</th><th class="p-3 text-left font-medium">From</th><th class="p-3 text-left font-medium">To</th></tr></thead><tbody>', "</tbody></table></div></div>"], _tmpl$4 = ["<tr", ' class="border-b border-[var(--border)] last:border-0"><td class="p-3">', '</td><td class="p-3">', '</td><td class="p-3">', "</td></tr>"];
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
  return [loading() && moves().length === 0 && ssr(_tmpl$$1, ssrHydrationKey()), error() && ssr(_tmpl$2$1, ssrHydrationKey(), escape(error())), !loading() && !error() && ssr(_tmpl$3, ssrHydrationKey(), escape(totalMoves()) ?? escape(moves().length), escape(props.n), escape(Math.pow(2, props.n)) - 1, escape(moves().map((move, i) => ssr(_tmpl$4, ssrHydrationKey(), escape(i) + 1, escape(ROD_LABELS[move.from]) ?? escape(move.from), escape(ROD_LABELS[move.to]) ?? escape(move.to)))))];
}
var _tmpl$ = ["<span", ' class="text-xs">Speed: <!--$-->', "<!--/--> ms/move</span>"], _tmpl$2 = ["<div", ' class="space-y-6"><div class="text-muted-foreground flex flex-wrap items-center gap-4 text-sm"><span>Disks: <!--$-->', "<!--/--></span><span>Backend: <!--$-->", "<!--/--></span><!--$-->", "<!--/--><span>View: <!--$-->", '<!--/--></span><span class="text-xs">Query: ?n=<!--$-->', "<!--/-->&backend=<!--$-->", "<!--/-->&view=<!--$-->", "<!--/--><!--$-->", "<!--/--></span></div><!--$-->", "<!--/--></div>"];
function parseSearch() {
  if (typeof window === "undefined") {
    return {
      n: 5,
      speed: 400,
      backend: "rust",
      view: "table"
    };
  }
  const search = new URLSearchParams(window.location.search);
  const n = Math.min(32, Math.max(1, parseInt(search.get("n") ?? "5", 10) || 5));
  const speed = Math.max(50, parseInt(search.get("speed") ?? "400", 10) || 400);
  const backend = search.get("backend") === "go" ? "go" : "rust";
  const view = search.get("view") === "animate" ? "animate" : "table";
  return {
    n,
    speed,
    backend,
    view
  };
}
function HanoiPageClient() {
  const [params] = createSignal(parseSearch());
  return ssr(_tmpl$2, ssrHydrationKey(), escape(params().n), escape(params().backend), escape(createComponent(Show, {
    get when() {
      return params().view === "animate";
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(params().speed));
    }
  })), escape(params().view), escape(params().n), escape(params().backend), escape(params().view), params().view === "animate" ? `&speed=${escape(params().speed)}` : "", escape(createComponent(Show, {
    get when() {
      return params().view === "table";
    },
    get fallback() {
      return createComponent(HanoiAnimate, {
        get n() {
          return params().n;
        },
        get backend() {
          return params().backend;
        },
        get speedMs() {
          return params().speed;
        }
      });
    },
    get children() {
      return createComponent(HanoiTable, {
        get n() {
          return params().n;
        },
        get backend() {
          return params().backend;
        }
      });
    }
  })));
}
function Home() {
  return createComponent(HanoiPageClient, {});
}
export {
  Home as component
};
