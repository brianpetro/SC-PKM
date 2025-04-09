var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.js
var main_exports = {};
__export(main_exports, {
  default: () => SmartConnectPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var SmartConnectPlugin = class extends import_obsidian.Plugin {
  async onload() {
    console.log("SmartConnectProtocolPlugin loaded.");
    this.registerObsidianProtocolHandler("smart-connect", async (params) => {
      console.log("smart-connect protocol request received:", params);
      this.handle_protocol_request(params);
    });
  }
  onunload() {
    console.log("SmartConnectProtocolPlugin unloaded.");
  }
  /**
   * Main dispatch method for obsidian://smart-connect?handler=XYZ
   */
  async handle_protocol_request(params) {
    if (!params.handler) {
      console.warn("smart-connect called without a 'handler' param");
      return;
    }
    let res = { error: "Unknown handler" };
    try {
      const handler = params.handler;
      if (handler === "exec_dataview_query") {
        const query = decodeURIComponent(params.query || "");
        const source_path = decodeURIComponent(params.source || "");
        res = await this.exec_dataview_query(query, source_path);
      } else if (handler === "render_markdown_path") {
        const filePath = decodeURIComponent(params.rel_path || "");
        res = await this.read_and_render_file(filePath);
      } else if (handler === "render_markdown") {
        const markdown = decodeURIComponent(params.markdown || "");
        const rel_path = decodeURIComponent(params.rel_path || "");
        res = await this.render_markdown(markdown, rel_path);
      } else if (handler === "get_current_note") {
        res = await this.get_current_note();
      } else if (handler === "get_current_notes") {
        res = await this.get_current_notes();
      } else {
        res = { error: `Unrecognized handler: ${handler}` };
      }
    } catch (err) {
      res = { error: err.message || String(err) };
    }
    await this.post_result_to_sc_desktop(res, params.requestId);
  }
  /**
   * Example: get active file path and content
   */
  async get_current_note() {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      return { note: null, content: null };
    }
    const content = await this.app.vault.read(file);
    return {
      note: file.path,
      content
    };
  }
  /**
   * Example: get all open note paths
   */
  async get_current_notes() {
    const openPaths = /* @__PURE__ */ new Set();
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf?.view?.file instanceof import_obsidian.TFile) {
        openPaths.add(leaf.view.file.path);
      }
    });
    return {
      notes: [...openPaths]
    };
  }
  /**
   * Posts the result data to the Smart Connect Desktop endpoint.
   * @param {Object} data - The payload to send
   */
  async post_result_to_sc_desktop(data, requestId) {
    const url = "http://127.0.0.1:37042/message";
    const payload = {
      fx: "pluginProtocol",
      data,
      requestId
    };
    console.log("post_result_to_sc_desktop", payload);
    try {
      const response = await (0, import_obsidian.requestUrl)({
        url,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.warn(`sc-desktop callback error: ${response.status} ${response.statusText}`);
      } else {
        console.log("sc-desktop callback successful:", response.json);
      }
    } catch (err) {
      console.error("sc-desktop callback failed:", err);
    }
  }
  /**
   * Executes a Dataview query if the Dataview API is available.
   * Returns an object with the raw query results or an error.
   * @param {string} query - The Dataview query string (markdown code block contents)
   * @returns {Promise<Object>}
   */
  async exec_dataview_query(query, source_path = "Untitled.md") {
    const dataview = window.DataviewAPI;
    if (!dataview) {
      return { error: "Dataview API not found; please enable Dataview plugin." };
    }
    const results = await dataview.queryMarkdown(query, source_path, null);
    return { handler: "exec_dataview_query", query, results };
  }
  /**
   * Reads a file from the vault by path, renders it to HTML, then converts
   * that HTML back to markdown. This captures dynamic transformations such as
   * Dataview code blocks or other post-processing that Obsidian performs.
   * @param {string} filePath - The note path (e.g. "MyFolder/MyNote").
   * @returns {Promise<Object>} - An object { path, original_md, rendered_md }
   */
  async read_and_render_file(filePath) {
    let norm_path = filePath.trim();
    if (norm_path && !norm_path.endsWith(".md") && !norm_path.includes(".")) {
      norm_path += ".md";
    }
    const file = this.app.vault.getAbstractFileByPath(norm_path);
    if (!file || !(file instanceof import_obsidian.TFile)) {
      return { error: `File not found: ${filePath}` };
    }
    const original_md = await this.app.vault.cachedRead(file);
    return await this.render_markdown(original_md, file.path);
  }
  async render_markdown(original_md, file_path) {
    const container = document.createElement("div");
    await import_obsidian.MarkdownRenderer.render(
      this.app,
      original_md,
      container,
      file_path,
      new import_obsidian.Component()
    );
    await this.wait_for_render_stable(container, 2e3);
    const rendered_md = (0, import_obsidian.htmlToMarkdown)(container);
    return { rendered_md };
  }
  /**
   * Utility to wait for the container's HTML to stabilize or a timeout.
   * @param {HTMLElement} container
   * @param {number} timeoutMs
   */
  async wait_for_render_stable(container, timeoutMs) {
    let elapsed = 0;
    const interval = 200;
    let prev = container.innerHTML;
    while (elapsed < timeoutMs) {
      await this.delay(interval);
      elapsed += interval;
      if (container.innerHTML === prev && !prev.includes("Loading")) {
        break;
      }
      prev = container.innerHTML;
    }
  }
  /**
   * Simple async delay
   * @param {number} ms
   */
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbWFpbi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgUGx1Z2luLCBNYXJrZG93blJlbmRlcmVyLCBodG1sVG9NYXJrZG93biwgVEZpbGUsIHJlcXVlc3RVcmwsIENvbXBvbmVudCB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU21hcnRDb25uZWN0UGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIlNtYXJ0Q29ubmVjdFByb3RvY29sUGx1Z2luIGxvYWRlZC5cIik7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgdGhlIGN1c3RvbSBvYnNpZGlhbjovL3NtYXJ0LWNvbm5lY3QgcHJvdG9jb2wgaGFuZGxlclxyXG4gICAgdGhpcy5yZWdpc3Rlck9ic2lkaWFuUHJvdG9jb2xIYW5kbGVyKFwic21hcnQtY29ubmVjdFwiLCBhc3luYyAocGFyYW1zKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwic21hcnQtY29ubmVjdCBwcm90b2NvbCByZXF1ZXN0IHJlY2VpdmVkOlwiLCBwYXJhbXMpO1xyXG4gICAgICAvLyBIYW5kbGVyIHBhcmFtIGRlY2lkZXMgd2hpY2ggYWN0aW9uIHRvIHBlcmZvcm1cclxuICAgICAgdGhpcy5oYW5kbGVfcHJvdG9jb2xfcmVxdWVzdChwYXJhbXMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbnVubG9hZCgpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiU21hcnRDb25uZWN0UHJvdG9jb2xQbHVnaW4gdW5sb2FkZWQuXCIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFpbiBkaXNwYXRjaCBtZXRob2QgZm9yIG9ic2lkaWFuOi8vc21hcnQtY29ubmVjdD9oYW5kbGVyPVhZWlxyXG4gICAqL1xyXG4gIGFzeW5jIGhhbmRsZV9wcm90b2NvbF9yZXF1ZXN0KHBhcmFtcykge1xyXG4gICAgaWYgKCFwYXJhbXMuaGFuZGxlcikge1xyXG4gICAgICBjb25zb2xlLndhcm4oXCJzbWFydC1jb25uZWN0IGNhbGxlZCB3aXRob3V0IGEgJ2hhbmRsZXInIHBhcmFtXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlcyA9IHsgZXJyb3I6IFwiVW5rbm93biBoYW5kbGVyXCIgfTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBoYW5kbGVyID0gcGFyYW1zLmhhbmRsZXI7XHJcbiAgICAgIGlmIChoYW5kbGVyID09PSBcImV4ZWNfZGF0YXZpZXdfcXVlcnlcIikge1xyXG4gICAgICAgIC8vIChleGlzdGluZyBjb2RlKVxyXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcmFtcy5xdWVyeSB8fCBcIlwiKTtcclxuICAgICAgICBjb25zdCBzb3VyY2VfcGF0aCA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbXMuc291cmNlIHx8IFwiXCIpO1xyXG4gICAgICAgIHJlcyA9IGF3YWl0IHRoaXMuZXhlY19kYXRhdmlld19xdWVyeShxdWVyeSwgc291cmNlX3BhdGgpO1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChoYW5kbGVyID09PSBcInJlbmRlcl9tYXJrZG93bl9wYXRoXCIpIHtcclxuICAgICAgICAvLyAoZXhpc3RpbmcgY29kZSlcclxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbXMucmVsX3BhdGggfHwgXCJcIik7XHJcbiAgICAgICAgcmVzID0gYXdhaXQgdGhpcy5yZWFkX2FuZF9yZW5kZXJfZmlsZShmaWxlUGF0aCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaGFuZGxlciA9PT0gXCJyZW5kZXJfbWFya2Rvd25cIikge1xyXG4gICAgICAgIC8vIE5FVzogUmVuZGVyIG1hcmtkb3duIGZyb20gYSBzdHJpbmdcclxuICAgICAgICBjb25zdCBtYXJrZG93biA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbXMubWFya2Rvd24gfHwgXCJcIik7XHJcbiAgICAgICAgY29uc3QgcmVsX3BhdGggPSBkZWNvZGVVUklDb21wb25lbnQocGFyYW1zLnJlbF9wYXRoIHx8IFwiXCIpO1xyXG4gICAgICAgIHJlcyA9IGF3YWl0IHRoaXMucmVuZGVyX21hcmtkb3duKG1hcmtkb3duLCByZWxfcGF0aCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaGFuZGxlciA9PT0gXCJnZXRfY3VycmVudF9ub3RlXCIpIHtcclxuICAgICAgICAvLyBORVc6IFJldHVybiB0aGUgKmFjdGl2ZSogbm90ZSBpbiBPYnNpZGlhblxyXG4gICAgICAgIHJlcyA9IGF3YWl0IHRoaXMuZ2V0X2N1cnJlbnRfbm90ZSgpO1xyXG5cclxuICAgICAgfSBlbHNlIGlmIChoYW5kbGVyID09PSBcImdldF9jdXJyZW50X25vdGVzXCIpIHtcclxuICAgICAgICAvLyBORVc6IFJldHVybiAqYWxsIG9wZW4qIG5vdGVzIGluIE9ic2lkaWFuXHJcbiAgICAgICAgcmVzID0gYXdhaXQgdGhpcy5nZXRfY3VycmVudF9ub3RlcygpO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXMgPSB7IGVycm9yOiBgVW5yZWNvZ25pemVkIGhhbmRsZXI6ICR7aGFuZGxlcn1gIH07XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICByZXMgPSB7IGVycm9yOiBlcnIubWVzc2FnZSB8fCBTdHJpbmcoZXJyKSB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZvcndhcmQgdGhlIHJlc3VsdCBiYWNrIHRvIHRoZSBsb2NhbCBTbWFydCBDb25uZWN0IGFwcFxyXG4gICAgYXdhaXQgdGhpcy5wb3N0X3Jlc3VsdF90b19zY19kZXNrdG9wKHJlcywgcGFyYW1zLnJlcXVlc3RJZCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeGFtcGxlOiBnZXQgYWN0aXZlIGZpbGUgcGF0aCBhbmQgY29udGVudFxyXG4gICAqL1xyXG4gIGFzeW5jIGdldF9jdXJyZW50X25vdGUoKSB7XHJcbiAgICAvLyBjb25zdCBhY3RpdmVMZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUodGhpcy5hcHAucGx1Z2lucy5nZXRQbHVnaW4oJ2ZpbGUtZXhwbG9yZXInKT8udmlld1R5cGUpO1xyXG4gICAgLy8gLy8gSWYgdGhhdCBkb2Vzbid0IHdvcmsgZm9yIHlvdXIgdXNhZ2UsIHlvdSBjYW4gaXRlcmF0ZSByb290IGxlYXZlcywgb3Igc2ltcGx5IGRvOlxyXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XHJcbiAgICBpZiAoIWZpbGUpIHtcclxuICAgICAgcmV0dXJuIHsgbm90ZTogbnVsbCwgY29udGVudDogbnVsbCB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9wdGlvbmFsbHkgcmVhZCBmaWxlIGNvbnRlbnQ6XHJcbiAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5vdGU6IGZpbGUucGF0aCxcclxuICAgICAgY29udGVudDogY29udGVudCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeGFtcGxlOiBnZXQgYWxsIG9wZW4gbm90ZSBwYXRoc1xyXG4gICAqL1xyXG4gIGFzeW5jIGdldF9jdXJyZW50X25vdGVzKCkge1xyXG4gICAgY29uc3Qgb3BlblBhdGhzID0gbmV3IFNldCgpO1xyXG4gICAgLy8gU29tZSB3YXlzIHRvIGdhdGhlciBvcGVuIGxlYWYgZmlsZXM6XHJcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUFsbExlYXZlcygobGVhZikgPT4ge1xyXG4gICAgICBpZiAobGVhZj8udmlldz8uZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XHJcbiAgICAgICAgb3BlblBhdGhzLmFkZChsZWFmLnZpZXcuZmlsZS5wYXRoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBub3RlczogWy4uLm9wZW5QYXRoc10sXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUG9zdHMgdGhlIHJlc3VsdCBkYXRhIHRvIHRoZSBTbWFydCBDb25uZWN0IERlc2t0b3AgZW5kcG9pbnQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXHJcbiAgICovXHJcbiAgYXN5bmMgcG9zdF9yZXN1bHRfdG9fc2NfZGVza3RvcChkYXRhLCByZXF1ZXN0SWQpIHtcclxuICAgIGNvbnN0IHVybCA9IFwiaHR0cDovLzEyNy4wLjAuMTozNzA0Mi9tZXNzYWdlXCI7XHJcbiAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICBmeDogXCJwbHVnaW5Qcm90b2NvbFwiLFxyXG4gICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICByZXF1ZXN0SWQ6IHJlcXVlc3RJZFxyXG4gICAgfTtcclxuICAgIGNvbnNvbGUubG9nKFwicG9zdF9yZXN1bHRfdG9fc2NfZGVza3RvcFwiLCBwYXlsb2FkKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdFVybCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF5bG9hZClcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGBzYy1kZXNrdG9wIGNhbGxiYWNrIGVycm9yOiAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwic2MtZGVza3RvcCBjYWxsYmFjayBzdWNjZXNzZnVsOlwiLCByZXNwb25zZS5qc29uKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJzYy1kZXNrdG9wIGNhbGxiYWNrIGZhaWxlZDpcIiwgZXJyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4ZWN1dGVzIGEgRGF0YXZpZXcgcXVlcnkgaWYgdGhlIERhdGF2aWV3IEFQSSBpcyBhdmFpbGFibGUuXHJcbiAgICogUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgcmF3IHF1ZXJ5IHJlc3VsdHMgb3IgYW4gZXJyb3IuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5IC0gVGhlIERhdGF2aWV3IHF1ZXJ5IHN0cmluZyAobWFya2Rvd24gY29kZSBibG9jayBjb250ZW50cylcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fVxyXG4gICAqL1xyXG4gIGFzeW5jIGV4ZWNfZGF0YXZpZXdfcXVlcnkocXVlcnksIHNvdXJjZV9wYXRoPVwiVW50aXRsZWQubWRcIikge1xyXG4gICAgY29uc3QgZGF0YXZpZXcgPSB3aW5kb3cuRGF0YXZpZXdBUEk7XHJcbiAgICBpZiAoIWRhdGF2aWV3KSB7XHJcbiAgICAgIHJldHVybiB7IGVycm9yOiBcIkRhdGF2aWV3IEFQSSBub3QgZm91bmQ7IHBsZWFzZSBlbmFibGUgRGF0YXZpZXcgcGx1Z2luLlwiIH07XHJcbiAgICB9XHJcbiAgICAvLyBUaGUgJ3F1ZXJ5TWFya2Rvd24nIHNpZ25hdHVyZSBpcyBxdWVyeU1hcmtkb3duKHF1ZXJ5U3RyLCBzb3VyY2VQYXRoLCByZWZyZXNoRnVuYz8pXHJcbiAgICAvLyBGb3IgYSBwYXRoIGNvbnRleHQsIHlvdSBjYW4gcHJvdmlkZSBzb21lIGZhbGxiYWNrLCBsaWtlICdNeU5vdGUubWQnLlxyXG4gICAgLy8gSWYgdGhlIHVzZXIgcHJvdmlkZWQgYSBwYXRoIHBhcmFtLCBpbmNvcnBvcmF0ZSBpdCwgb3IgdXNlIGEgcGxhY2Vob2xkZXIuXHJcbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgZGF0YXZpZXcucXVlcnlNYXJrZG93bihxdWVyeSwgc291cmNlX3BhdGgsIG51bGwpO1xyXG4gICAgcmV0dXJuIHsgaGFuZGxlcjogXCJleGVjX2RhdGF2aWV3X3F1ZXJ5XCIsIHF1ZXJ5LCByZXN1bHRzIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWFkcyBhIGZpbGUgZnJvbSB0aGUgdmF1bHQgYnkgcGF0aCwgcmVuZGVycyBpdCB0byBIVE1MLCB0aGVuIGNvbnZlcnRzXHJcbiAgICogdGhhdCBIVE1MIGJhY2sgdG8gbWFya2Rvd24uIFRoaXMgY2FwdHVyZXMgZHluYW1pYyB0cmFuc2Zvcm1hdGlvbnMgc3VjaCBhc1xyXG4gICAqIERhdGF2aWV3IGNvZGUgYmxvY2tzIG9yIG90aGVyIHBvc3QtcHJvY2Vzc2luZyB0aGF0IE9ic2lkaWFuIHBlcmZvcm1zLlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIFRoZSBub3RlIHBhdGggKGUuZy4gXCJNeUZvbGRlci9NeU5vdGVcIikuXHJcbiAgICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gLSBBbiBvYmplY3QgeyBwYXRoLCBvcmlnaW5hbF9tZCwgcmVuZGVyZWRfbWQgfVxyXG4gICAqL1xyXG4gIGFzeW5jIHJlYWRfYW5kX3JlbmRlcl9maWxlKGZpbGVQYXRoKSB7XHJcbiAgICAvLyAxKSBSZXNvbHZlIHRoZSBURmlsZSBmcm9tIHRoZSB2YXVsdFxyXG4gICAgbGV0IG5vcm1fcGF0aCA9IGZpbGVQYXRoLnRyaW0oKTtcclxuICAgIGlmIChub3JtX3BhdGggJiYgIW5vcm1fcGF0aC5lbmRzV2l0aChcIi5tZFwiKSAmJiAhbm9ybV9wYXRoLmluY2x1ZGVzKFwiLlwiKSkge1xyXG4gICAgICBub3JtX3BhdGggKz0gXCIubWRcIjtcclxuICAgIH1cclxuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgobm9ybV9wYXRoKTtcclxuICAgIGlmICghZmlsZSB8fCAhKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHtcclxuICAgICAgcmV0dXJuIHsgZXJyb3I6IGBGaWxlIG5vdCBmb3VuZDogJHtmaWxlUGF0aH1gIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gMikgUmVhZCB0aGUgb3JpZ2luYWwgbWFya2Rvd25cclxuICAgIGNvbnN0IG9yaWdpbmFsX21kID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY2FjaGVkUmVhZChmaWxlKTtcclxuXHJcbiAgICAvLyAzKSBSZW5kZXIgdGhhdCBtYXJrZG93biBpbnRvIEhUTUxcclxuICAgIHJldHVybiBhd2FpdCB0aGlzLnJlbmRlcl9tYXJrZG93bihvcmlnaW5hbF9tZCwgZmlsZS5wYXRoKTtcclxuXHJcbiAgfVxyXG5cclxuICBhc3luYyByZW5kZXJfbWFya2Rvd24ob3JpZ2luYWxfbWQsIGZpbGVfcGF0aCkge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGF3YWl0IE1hcmtkb3duUmVuZGVyZXIucmVuZGVyKFxyXG4gICAgICB0aGlzLmFwcCxcclxuICAgICAgb3JpZ2luYWxfbWQsXHJcbiAgICAgIGNvbnRhaW5lcixcclxuICAgICAgZmlsZV9wYXRoLFxyXG4gICAgICBuZXcgQ29tcG9uZW50KClcclxuICAgICk7XHJcblxyXG4gICAgLy8gV2FpdCBicmllZmx5IGZvciBhc3luY2hyb25vdXMgcG9zdC1wcm9jZXNzaW5nIChEYXRhdmlldywgZXRjLilcclxuICAgIC8vIEluIHByYWN0aWNlLCB5b3UgbWF5IHdhbnQgYSBtb3JlIHJvYnVzdCBhcHByb2FjaCB0byBlbnN1cmUgZHluYW1pYyBsb2FkcyBhcmUgZG9uZVxyXG4gICAgYXdhaXQgdGhpcy53YWl0X2Zvcl9yZW5kZXJfc3RhYmxlKGNvbnRhaW5lciwgMjAwMCk7XHJcblxyXG4gICAgLy8gNCkgQ29udmVydCB0aGUgcmVzdWx0aW5nIEhUTUwgYmFjayB0byBtYXJrZG93blxyXG4gICAgY29uc3QgcmVuZGVyZWRfbWQgPSBodG1sVG9NYXJrZG93bihjb250YWluZXIpO1xyXG4gICAgcmV0dXJuIHsgcmVuZGVyZWRfbWQgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFV0aWxpdHkgdG8gd2FpdCBmb3IgdGhlIGNvbnRhaW5lcidzIEhUTUwgdG8gc3RhYmlsaXplIG9yIGEgdGltZW91dC5cclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcclxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZW91dE1zXHJcbiAgICovXHJcbiAgYXN5bmMgd2FpdF9mb3JfcmVuZGVyX3N0YWJsZShjb250YWluZXIsIHRpbWVvdXRNcykge1xyXG4gICAgbGV0IGVsYXBzZWQgPSAwO1xyXG4gICAgY29uc3QgaW50ZXJ2YWwgPSAyMDA7XHJcbiAgICBsZXQgcHJldiA9IGNvbnRhaW5lci5pbm5lckhUTUw7XHJcbiAgICB3aGlsZSAoZWxhcHNlZCA8IHRpbWVvdXRNcykge1xyXG4gICAgICBhd2FpdCB0aGlzLmRlbGF5KGludGVydmFsKTtcclxuICAgICAgZWxhcHNlZCArPSBpbnRlcnZhbDtcclxuICAgICAgaWYgKGNvbnRhaW5lci5pbm5lckhUTUwgPT09IHByZXYgJiYgIXByZXYuaW5jbHVkZXMoXCJMb2FkaW5nXCIpKSB7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgcHJldiA9IGNvbnRhaW5lci5pbm5lckhUTUw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaW1wbGUgYXN5bmMgZGVsYXlcclxuICAgKiBAcGFyYW0ge251bWJlcn0gbXNcclxuICAgKi9cclxuICBhc3luYyBkZWxheShtcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1l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
