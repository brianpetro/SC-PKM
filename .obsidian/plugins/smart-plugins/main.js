const id='a8c206aaf23bcc0a2ac318b2f12a0cf42191df0c9fd11fcb2576f50c7f3e115b';
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

var main_exports = {};
__export(main_exports, {
default: () => SmartPluginsPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

var import_obsidian2 = require("obsidian");

var import_obsidian = require("obsidian");
function get_smart_server_url() {
if (typeof window !== "undefined" && window.SMART_SERVER_URL_OVERRIDE) {
return window.SMART_SERVER_URL_OVERRIDE;
}
return "https://connect.smartconnections.app";
}
function try_get_zlib() {
if (typeof window?.require === "function") {
try {
return window.require("zlib");
} catch {
}
}
return null;
}
function inflate_deflate_data(compressed) {
const zlib = try_get_zlib();
if (!zlib) {
throw new Error("zlib not available (maybe Obsidian mobile?).");
}
const buf = Buffer.from(compressed);
const out = zlib.inflateRawSync(buf);
return new Uint8Array(out.buffer, out.byteOffset, out.length);
}
async function parse_zip_into_files(zipBuffer) {
const dv = new DataView(zipBuffer);
let offset = 0;
const length = dv.byteLength;
const files = [];
let pluginManifest = null;
while (offset + 4 <= length) {
const localSig = dv.getUint32(offset, true);
if (localSig === 33639248 || localSig === 134695760) {
break;
}
if (localSig !== 67324752) {
break;
}
offset += 4;
const versionNeeded = dv.getUint16(offset, true);
const generalPurposeBitFlag = dv.getUint16(offset + 2, true);
const compressionMethod = dv.getUint16(offset + 4, true);
offset += 6;
const lastModTimeDate = dv.getUint32(offset, true);
offset += 4;
let crc32 = dv.getUint32(offset, true);
let compressedSize = dv.getUint32(offset + 4, true);
let uncompressedSize = dv.getUint32(offset + 8, true);
offset += 12;
const fileNameLen = dv.getUint16(offset, true);
const extraLen = dv.getUint16(offset + 2, true);
offset += 4;
const fileNameBytes = new Uint8Array(zipBuffer.slice(offset, offset + fileNameLen));
const fileName = new TextDecoder("utf-8").decode(fileNameBytes);
offset += fileNameLen;
offset += extraLen;
const hasDataDescriptor = (generalPurposeBitFlag & 8) !== 0;
let compDataStart = offset;
let compDataEnd;
if (!hasDataDescriptor) {
compDataEnd = compDataStart + compressedSize;
} else {
let scanPos = compDataStart;
let foundSig = false;
while (scanPos + 4 <= length) {
const sig = dv.getUint32(scanPos, true);
if (sig === 134695760 || sig === 67324752 || sig === 33639248) {
foundSig = true;
break;
}
scanPos++;
}
compDataEnd = foundSig ? scanPos : length;
}
if (compDataEnd > length) {
break;
}
const fileDataCompressed = new Uint8Array(zipBuffer.slice(compDataStart, compDataEnd));
offset = compDataEnd;
if (hasDataDescriptor) {
if (offset + 4 <= length) {
const ddSig = dv.getUint32(offset, true);
if (ddSig === 134695760) {
offset += 4;
}
if (offset + 12 <= length) {
crc32 = dv.getUint32(offset, true);
compressedSize = dv.getUint32(offset + 4, true);
uncompressedSize = dv.getUint32(offset + 8, true);
offset += 12;
} else {
break;
}
}
}
let rawData;
if (compressionMethod === 0) {
rawData = fileDataCompressed;
} else if (compressionMethod === 8) {
rawData = inflate_deflate_data(fileDataCompressed);
} else {
continue;
}
files.push({ fileName, data: rawData });
if (fileName.toLowerCase().endsWith("manifest.json") && !fileName.includes("/")) {
try {
pluginManifest = JSON.parse(new TextDecoder("utf-8").decode(rawData));
} catch {
}
}
}
return { files, pluginManifest };
}
async function write_files_with_adapter(adapter, baseFolder, files) {
console.log("Writing files to:", adapter, baseFolder, files);
const hasWriteBinary = typeof adapter.writeBinary === "function";
if (!await adapter.exists(baseFolder)) {
await adapter.mkdir(baseFolder);
}
for (const { fileName, data } of files) {
const fullPath = baseFolder + "/" + fileName;
if (hasWriteBinary) {
console.log("Writing file binary:", fullPath);
await adapter.writeBinary(fullPath, data);
} else {
console.log("Writing file non-binary:", fullPath);
const base64 = btoa(String.fromCharCode(...data));
await adapter.write(fullPath, base64);
}
}
}
function is_server_version_newer(localVer, serverVer) {
if (!serverVer || serverVer === "unknown")
return false;
const lv = localVer.replace(/[^\d.]/g, "");
const sv = serverVer.replace(/[^\d.]/g, "");
const la = lv.split(".").map(Number);
const sa = sv.split(".").map(Number);
for (let i = 0; i < Math.max(la.length, sa.length); i++) {
const l = la[i] || 0;
const s = sa[i] || 0;
if (s > l)
return true;
if (s < l)
return false;
}
return false;
}
async function fetch_plugin_zip(repoName, token) {
const resp = await (0, import_obsidian.requestUrl)({
url: `${get_smart_server_url()}/plugin_download`,
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${token}`
},
body: JSON.stringify({ repo: repoName })
});
if (resp.status !== 200) {
throw new Error(`plugin_download error ${resp.status}: ${resp.text}`);
}
const ab = resp.arrayBuffer;
if (ab.byteLength < 4) {
throw new Error("Server returned too few bytes, not a valid ZIP.");
}
const dv = new DataView(ab);
if (dv.getUint32(0, true) !== 67324752) {
const txt = new TextDecoder().decode(new Uint8Array(ab));
throw new Error(`Server did not return a valid ZIP. Text:
${txt}`);
}
return ab;
}
async function enable_plugin(app, plugin_id) {
await app.plugins.enablePlugin(plugin_id);
app.plugins.enabledPlugins.add(plugin_id);
app.plugins.requestSaveConfig();
app.plugins.loadManifests();
}

var SmartPluginsSettingTab = class extends import_obsidian2.PluginSettingTab {
constructor(app, plugin) {
super(app, plugin);
this.app = app;
this.plugin = plugin;
}
/**
* Renders the entire settings UI. If user is logged in, fetches plugin list from server.
*/
async display() {
const { containerEl } = this;
containerEl.empty();
containerEl.createEl("h2", { text: "Smart Plugins Settings" });
this._render_oauth_login_section(containerEl);
const token = localStorage.getItem(this.plugin.oauth_storage_prefix + "token") || "";
if (token) {
const installedMap = await this._get_installed_info();
await this._render_plugin_list_section(containerEl, token, installedMap);
}
}
/**
* Grabs local installed plugin info from Obsidian's internal manifests,
* returning an object: { [pluginId]: { name, version } }
*/
async _get_installed_info() {
const installedMap = {};
let { manifests } = this.app.plugins;
while (Object.keys(manifests).length === 0) {
manifests = this.app.plugins.manifests;
await new Promise((resolve) => setTimeout(resolve, 100));
}
for (const pluginId in manifests) {
const { name, version } = manifests[pluginId];
installedMap[pluginId] = { name, version };
}
console.log("installedMap", installedMap);
return installedMap;
}
/**
* Renders the login or logout setting control.
* @param {HTMLElement} containerEl
*/
_render_oauth_login_section(containerEl) {
const token = localStorage.getItem(this.plugin.oauth_storage_prefix + "token") || "";
if (!token) {
this.plugin.settings_tab_callback = () => {
this.display();
this.plugin.settings_tab_callback = null;
};
new import_obsidian2.Setting(containerEl).setName("Connect Account").setDesc("Log in with your Smart Connections supporter key.").addButton((btn) => {
btn.setButtonText("Login");
btn.onClick(() => this._initiate_oauth_login());
});
} else {
new import_obsidian2.Setting(containerEl).setName("OAuth Token").setDesc(token.slice(0, 16) + "...").addButton((btn) => {
btn.setButtonText("Logout");
btn.onClick(() => {
localStorage.removeItem(this.plugin.oauth_storage_prefix + "token");
localStorage.removeItem(this.plugin.oauth_storage_prefix + "refresh");
new import_obsidian2.Notice("Logged out of Smart Plugins");
this.display();
});
});
}
}
/**
* Opens the user's browser to do the OAuth login flow.
*/
_initiate_oauth_login() {
const state = Math.random().toString(36).slice(2);
const redirect_uri = encodeURIComponent("obsidian://smart-plugins/callback");
const url = `${get_smart_server_url()}/oauth?client_id=smart-plugins-app&redirect_uri=${redirect_uri}&state=${state}`;
window.open(url, "_blank");
new import_obsidian2.Notice("Please complete the login in your browser.");
}
/**
* Fetches the plugin list from server and displays each plugin row,
* showing a 'loading available plugins' message during the fetch.
* @param {HTMLElement} containerEl
* @param {string} token
* @param {{[pluginId:string]: {name:string,version:string}}} installedMap
*/
async _render_plugin_list_section(containerEl, token, installedMap) {
let loading_el;
try {
loading_el = containerEl.createEl("p", { text: "Loading available plugins..." });
const resp = await (0, import_obsidian2.requestUrl)({
url: `${get_smart_server_url()}/plugin_list`,
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${token}`
},
body: JSON.stringify({})
});
if (resp.status !== 200) {
throw new Error(`Failed to fetch plugin list: ${resp.status} ${resp.text}`);
}
loading_el.remove();
loading_el = null;
const { list } = resp.json;
console.log("list", list);
if (!Array.isArray(list) || list.length === 0) {
containerEl.createEl("p", { text: "No plugins found." });
return;
}
containerEl.createEl("h3", { text: "Available Plugins" });
for (const item of list) {
const repoName = item.repo;
const serverVersion = item.version || "unknown";
const pluginId = item.manifest_id || repoName.replace("/", "_");
if (pluginId === "smart-plugins") {
continue;
}
const local = installedMap[pluginId] || null;
const localName = local ? local.name : null;
const localVersion = local ? local.version : null;
const displayName = localName || item.name || repoName;
let desc = `Server version: ${serverVersion}`;
let buttonLabel = "Install";
let isDisabled = false;
if (localVersion) {
desc += ` | Installed version: ${localVersion}`;
const isUpdate = is_server_version_newer(localVersion, serverVersion);
if (isUpdate) {
buttonLabel = "Update";
} else {
buttonLabel = "Installed";
isDisabled = true;
}
}
if (item.description) {
desc += `
${item.description}`;
}
new import_obsidian2.Setting(containerEl).setName(displayName).setDesc(desc).addButton((btn) => {
btn.setButtonText(buttonLabel);
btn.setDisabled(isDisabled);
btn.onClick(() => this._install_plugin(item, token));
});
}
} catch (err) {
console.error("Failed to fetch plugin list:", err);
containerEl.createEl("p", { text: "Error fetching plugin list. Check console." });
} finally {
if (loading_el) {
loading_el.remove();
}
}
}
/**
* Download a plugin ZIP => parse => write => load plugin if manifest has `id`.
* @param {{repo:string, name?:string, version?:string, manifest_id?:string}} item
* @param {string} token
*/
async _install_plugin(item, token) {
try {
const repoName = item.repo;
new import_obsidian2.Notice(`Installing "${repoName}" ...`);
const zipData = await fetch_plugin_zip(repoName, token);
const { files, pluginManifest } = await parse_zip_into_files(zipData);
let folderName = "";
if (pluginManifest?.id) {
folderName = pluginManifest.id.trim();
} else if (item.manifest_id) {
folderName = item.manifest_id.trim();
} else {
folderName = repoName.replace("/", "_");
}
folderName = folderName.replace(/[^\w-]/g, "_");
const baseFolder = this.app.vault.configDir + "/plugins/" + folderName;
await write_files_with_adapter(this.app.vault.adapter, baseFolder, files);
await this.app.plugins.loadManifests();
const pluginId = pluginManifest?.id || item.manifest_id || folderName;
if (this.app.plugins.enabledPlugins.has(pluginId)) {
await this.app.plugins.disablePlugin(pluginId);
}
await enable_plugin(this.app, pluginId);
new import_obsidian2.Notice(`${repoName} installed successfully.`);
this.display();
} catch (err) {
console.error("Install error:", err);
new import_obsidian2.Notice(`Install failed: ${err.message}`);
}
}
};

var SMART_CLIENT_ID = "smart-plugins-op";
var SMART_CLIENT_SECRET = "smart-plugins-op-secret";
var SmartPluginsPlugin = class extends import_obsidian3.Plugin {
onload() {
console.log("Loading Smart Plugins plugin...");
this.app.workspace.onLayoutReady(this.initialize.bind(this));
}
async initialize() {
this.attempt_auto_sign_in_or_refresh().then(async () => {
await this.check_self_update();
}).catch((err) => {
console.error("Auto sign-in/refresh failed", err);
});
this.addSettingTab(new SmartPluginsSettingTab(this.app, this));
this.registerObsidianProtocolHandler("smart-plugins/callback", async (params) => {
await this.handleProtocol(params);
});
}
onunload() {
console.log("Unloading Smart Plugins plugin...");
}
get oauth_storage_prefix() {
if (!this._oauth_storage_prefix) {
this._oauth_storage_prefix = this.app.vault.getName().toLowerCase().replace(/[^a-z0-9]/g, "_") + "_smart_plugins_oauth_";
}
return this._oauth_storage_prefix;
}
/**
* Called when user completes login in their browser => obsidian://smart-plugins/callback?code=XXX
* @param {Record<string, any>} params
*/
async handleProtocol(params) {
console.log("handleProtocol", params);
try {
const code = params.code;
if (!code) {
new import_obsidian3.Notice("No OAuth code provided in URL. Login failed.");
return;
}
await this.exchange_code_for_tokens(code);
new import_obsidian3.Notice("Successfully logged in to Smart Plugins!");
this.app.commands.executeCommandById("app:open-settings");
if (this.settings_tab_callback) {
this.settings_tab_callback();
}
} catch (err) {
console.error("Error handling protocol callback:", err);
new import_obsidian3.Notice(`Smart Plugins login failed: ${err.message}`);
}
}
/**
* If refresh token is present in localStorage => try refresh
*/
async attempt_auto_sign_in_or_refresh() {
const existing_refresh = localStorage.getItem(this.oauth_storage_prefix + "refresh") || "";
if (!existing_refresh) {
return;
}
console.log("Found refresh token; attempting to refresh tokens...");
try {
const refreshed = await this.exchange_refresh_token(existing_refresh);
if (refreshed) {
new import_obsidian3.Notice("Smart Plugins tokens refreshed successfully.");
}
} catch (err) {
console.error("Could not refresh token:", err);
}
}
/**
* Exchange code for tokens, store in localStorage
* @param {string} code
*/
async exchange_code_for_tokens(code) {
const resp = await (0, import_obsidian3.requestUrl)({
url: `${get_smart_server_url()}/auth/oauth_exchange2`,
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
client_id: SMART_CLIENT_ID,
client_secret: SMART_CLIENT_SECRET,
code
})
});
if (resp.status !== 200) {
throw new Error(`Exchange code failed ${resp.status}: ${resp.text}`);
}
const { access_token, refresh_token } = resp.json;
if (!access_token) {
throw new Error("No access_token returned.");
}
localStorage.setItem(this.oauth_storage_prefix + "token", access_token);
if (refresh_token) {
localStorage.setItem(this.oauth_storage_prefix + "refresh", refresh_token);
}
}
/**
* Exchange refresh token for new tokens
* @param {string} old_refresh
* @returns {Promise<boolean>}
*/
async exchange_refresh_token(old_refresh) {
const resp = await (0, import_obsidian3.requestUrl)({
url: `${get_smart_server_url()}/auth/oauth_exchange2`,
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
client_id: SMART_CLIENT_ID,
client_secret: SMART_CLIENT_SECRET,
refresh_token: old_refresh
})
});
if (resp.status !== 200) {
throw new Error(`Refresh tokens failed ${resp.status}: ${resp.text}`);
}
const { access_token, refresh_token } = resp.json;
if (!access_token) {
return false;
}
localStorage.setItem(this.oauth_storage_prefix + "token", access_token);
if (refresh_token) {
localStorage.setItem(this.oauth_storage_prefix + "refresh", refresh_token);
}
return true;
}
/**
* Checks if there is a newer version of this plugin on the server.
* If so, automatically downloads and installs it.
*/
async check_self_update() {
const token = localStorage.getItem(this.oauth_storage_prefix + "token") || "";
if (!token) {
return;
}
const localManifest = this.app.plugins.manifests["smart-plugins"];
if (!localManifest) {
console.log("No local manifest for smart-plugins. Skipping self-update check.");
return;
}
const localVer = localManifest.version || "0.0.0";
let listData;
try {
const resp = await (0, import_obsidian3.requestUrl)({
url: `${get_smart_server_url()}/plugin_list`,
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${token}`
},
body: JSON.stringify({})
});
if (resp.status !== 200) {
console.log("check_self_update: plugin_list request failed", resp.status, resp.text);
return;
}
listData = resp.json;
} catch (err) {
console.error("check_self_update: fetch plugin_list error", err);
return;
}
const items = Array.isArray(listData.list) ? listData.list : [];
const selfInfo = items.find((i) => i.manifest_id === "smart-plugins");
if (!selfInfo) {
console.log('check_self_update: server did not return "smart-plugins" in list.');
return;
}
const serverVer = selfInfo.version || "0.0.0";
if (!is_server_version_newer(localVer, serverVer)) {
return;
}
console.log("check_self_update: found new version", serverVer, "Installing...");
try {
await this._install_ourselves(selfInfo.repo, token);
new import_obsidian3.Notice(`Smart Plugins updated to version ${serverVer}. Reloading...`);
} catch (err) {
console.error("Auto-update error:", err);
new import_obsidian3.Notice(`Auto-update failed: ${err.message}`);
}
}
/**
* Internal method to fetch+install the plugin from the server.
* @param {string} repoName
* @param {string} token
*/
async _install_ourselves(repoName, token) {
const zipData = await fetch_plugin_zip(repoName, token);
const { files, pluginManifest } = await parse_zip_into_files(zipData);
let folderName = pluginManifest?.id?.trim() || repoName.replace("/", "_");
folderName = folderName.replace(/[^\w-]/g, "_");
const baseFolder = this.app.vault.configDir + "/plugins/" + folderName;
await write_files_with_adapter(this.app.vault.adapter, baseFolder, files);
await this.app.plugins.loadManifests();
if (this.app.plugins.enabledPlugins.has("smart-plugins")) {
await this.app.plugins.disablePlugin("smart-plugins");
}
await enable_plugin(this.app, "smart-plugins");
await this.app.plugins.loadManifests();
}
};
