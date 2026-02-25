import { createSignal } from "solid-js";

export function DefaultCatchBoundary(props: {
  error: Error;
  reset: () => void;
}) {
  const [show, setShow] = createSignal(false);
  return (
    <div style="padding: 0.5rem; max-width: 100%">
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <strong style="font-size: 1rem">Something went wrong!</strong>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style="font-size: 0.6em; padding: 0.1rem 0.2rem"
        >
          {show() ? "Hide Error" : "Show Error"}
        </button>
      </div>
      {show() && (
        <pre
          style="font-size: 0.7em; border: 1px solid red; padding: 0.3rem; color: red"
        >
          {props.error.message}
        </pre>
      )}
    </div>
  );
}
