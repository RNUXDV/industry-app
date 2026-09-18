(function exposeIndustrySecurity(root, factory) {
  const security = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = security;
  }

  if (root) {
    root.IndustrySecurity = security;
  }
})(typeof globalThis === "undefined" ? null : globalThis, () => {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  return Object.freeze({ escapeHtml });
});
