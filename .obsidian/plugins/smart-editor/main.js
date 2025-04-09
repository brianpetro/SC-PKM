const id='a8c206aaf23bcc0a2ac318b2f12a0cf42191df0c9fd11fcb2576f50c7f3e115b';
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

var main_exports = {};
__export(main_exports, {
default: () => main_default
});
module.exports = __toCommonJS(main_exports);
var import_obsidian22 = require("obsidian");

var import_obsidian11 = require("obsidian");

async function build_html(env, opts = {}) {
const env_settings_html = Object.entries(env.settings_config).map(([setting_key, setting_config]) => {
if (!setting_config.setting)
setting_config.setting = setting_key;
return this.render_setting_html(setting_config);
}).join("\n");
const env_collections_containers_html = Object.entries(env.collections).map(([collection_key, collection]) => {
return `<div data-smart-settings="${collection_key}"></div>`;
}).join("\n");
const html = `
<div class="">
${env_settings_html}
${env_collections_containers_html}
</div>
`;
return html;
}
async function render(env, opts = {}) {
const html = await build_html.call(this, env, opts);
const frag = this.create_doc_fragment(html);
return await post_process.call(this, env, frag, opts);
}
async function post_process(env, frag, opts = {}) {
await this.render_setting_components(frag, { scope: env });
const env_collections_containers = frag.querySelectorAll("[data-smart-settings]");
for (const env_collections_container of env_collections_containers) {
const collection_key = env_collections_container.dataset.smartSettings;
const collection = env[collection_key];
await collection.render_settings(env_collections_container);
}
return frag;
}

var SmartSettings = class {
/**
* Creates an instance of SmartEnvSettings.
* @param {Object} main - The main object to contain the instance (smart_settings) and getter (settings)
* @param {Object} [opts={}] - Configuration options.
*/
constructor(main, opts = {}) {
this.main = main;
this.opts = opts;
this._fs = null;
this._settings = {};
this._saved = false;
this.save_timeout = null;
}
static async create(main, opts = {}) {
const smart_settings = new this(main, opts);
await smart_settings.load();
main.smart_settings = smart_settings;
Object.defineProperty(main, "settings", {
get() {
return smart_settings.settings;
},
set(settings) {
smart_settings.settings = settings;
}
});
return smart_settings;
}
static create_sync(main, opts = {}) {
const smart_settings = new this(main, opts);
smart_settings.load_sync();
main.smart_settings = smart_settings;
Object.defineProperty(main, "settings", {
get() {
return smart_settings.settings;
},
set(settings) {
smart_settings.settings = settings;
}
});
return smart_settings;
}
/**
* Gets the current settings, wrapped with an observer to handle changes.
* @returns {Proxy} A proxy object that observes changes to the settings.
*/
get settings() {
return observe_object(this._settings, (property, value, target) => {
if (this.save_timeout)
clearTimeout(this.save_timeout);
this.save_timeout = setTimeout(() => {
this.save(this._settings);
this.save_timeout = null;
}, 1e3);
});
}
/**
* Sets the current settings.
* @param {Object} settings - The new settings to apply.
*/
set settings(settings) {
this._settings = settings;
}
async save(settings = this._settings) {
if (typeof this.opts.save === "function")
await this.opts.save(settings);
else
await this.main.save_settings(settings);
}
async load() {
if (typeof this.opts.load === "function")
this._settings = await this.opts.load();
else
this._settings = await this.main.load_settings();
}
load_sync() {
if (typeof this.opts.load === "function")
this._settings = this.opts.load();
else
this._settings = this.main.load_settings();
}
};
function observe_object(obj, on_change) {
function create_proxy(target) {
return new Proxy(target, {
set(target2, property, value) {
if (target2[property] !== value) {
target2[property] = value;
on_change(property, value, target2);
}
if (typeof value === "object" && value !== null) {
target2[property] = create_proxy(value);
}
return true;
},
get(target2, property) {
const result = target2[property];
if (typeof result === "object" && result !== null) {
return create_proxy(result);
}
return result;
},
deleteProperty(target2, property) {
if (property in target2) {
delete target2[property];
on_change(property, void 0, target2);
}
return true;
}
});
}
return create_proxy(obj);
}

function is_plain_object(o) {
if (o === null)
return false;
if (typeof o !== "object")
return false;
if (Array.isArray(o))
return false;
if (o instanceof Function)
return false;
if (o instanceof Date)
return false;
return Object.getPrototypeOf(o) === Object.prototype;
}

function deep_merge(target, source) {
for (const key in source) {
if (!Object.prototype.hasOwnProperty.call(source, key))
continue;
if (is_plain_object(source[key]) && is_plain_object(target[key])) {
deep_merge(target[key], source[key]);
} else {
target[key] = source[key];
}
}
return target;
}

function camel_case_to_snake_case(str) {
const result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, "").replace(/2$/, "");
return result;
}

function normalize_opts(opts) {
if (!opts.collections)
opts.collections = {};
if (!opts.modules)
opts.modules = {};
if (!opts.items)
opts.items = {};
Object.entries(opts.collections).forEach(([key, val]) => {
if (typeof val === "function") {
opts.collections[key] = { class: val };
}
const new_key = camel_case_to_snake_case(key);
if (new_key !== key) {
opts.collections[new_key] = opts.collections[key];
delete opts.collections[key];
}
if (!opts.collections[new_key].collection_key)
opts.collections[new_key].collection_key = new_key;
if (val.item_type) {
opts.items[camel_case_to_snake_case(val.item_type.name)] = {
class: val.item_type
};
}
});
Object.entries(opts.modules).forEach(([key, val]) => {
if (typeof val === "function") {
opts.modules[key] = { class: val };
}
const new_key = camel_case_to_snake_case(key);
if (new_key !== key) {
opts.modules[new_key] = opts.modules[key];
delete opts.modules[key];
}
});
if (!opts.item_types)
opts.item_types = {};
if (!opts.items)
opts.items = {};
Object.entries(opts.item_types).forEach(([key, val]) => {
if (typeof val === "function") {
const new_key = camel_case_to_snake_case(key);
opts.items[new_key] = {
class: val,
actions: {},
...opts.items[new_key] || {}
};
}
});
return opts;
}

function is_plain_object2(value) {
if (!value || typeof value !== "object")
return false;
const proto = Object.getPrototypeOf(value);
return proto === Object.prototype || proto === null;
}
function deep_clone_config(input) {
if (Array.isArray(input)) {
return input.map((item) => deep_clone_config(item));
}
if (is_plain_object2(input)) {
const output = {};
for (const [k, v] of Object.entries(input)) {
output[k] = deep_clone_config(v);
}
return output;
}
return input;
}

function deep_merge_no_overwrite(target, source, path = []) {
if (!is_plain_object(target) || !is_plain_object(source)) {
return target;
}
if (path.includes(source)) {
return target;
}
path.push(source);
for (const key of Object.keys(source)) {
if (!Object.prototype.hasOwnProperty.call(source, key)) {
continue;
}
const val = source[key];
if (Array.isArray(target[key]) && Array.isArray(val)) {
target[key].push(...val);
} else if (is_plain_object(val)) {
if (!is_plain_object(target[key])) {
target[key] = {};
}
deep_merge_no_overwrite(target[key], val, [...path]);
} else if (!Object.prototype.hasOwnProperty.call(target, key)) {
target[key] = val;
}
}
return target;
}

function merge_env_config(target, incoming) {
for (const [key, value] of Object.entries(incoming)) {
if (typeof value === "object" && value !== null) {
if (Array.isArray(value)) {
target[key] = [...target[key] || [], ...value];
} else {
if (!target[key])
target[key] = {};
deep_merge_no_overwrite(target[key], value);
}
} else if (value !== target[key]) {
if (target[key] !== void 0) {
console.warn(
`SmartEnv: Overwriting existing property ${key} in smart_env_config`,
{ old: target[key], new: value }
);
}
target[key] = value;
}
}
return target;
}

var SmartEnv = class {
/**
* @type {number} version - Bump this number when shipping a new version of SmartEnv.
* If a newer version is loaded into a runtime that already has an older environment,
* an automatic reload of all existing mains will occur.
*/
static version = 2.139109;
scope_name = "smart_env";
static global_ref = get_global_ref();
global_ref = this.constructor.global_ref;
constructor(opts = {}) {
this.state = "init";
this._components = {};
this.collections = {};
this.load_timeout = null;
if (opts.primary_main_key)
this.primary_main_key = opts.primary_main_key;
}
/**
* Returns the config object for the SmartEnv instance.
* @returns {Object} The config object.
*/
get config() {
if (!this._config) {
this._config = {};
const sorted_configs = Object.entries(this.smart_env_configs).sort(([main_key, { main, opts }]) => {
if (!this.primary_main_key)
return 0;
if (main_key === this.primary_main_key)
return -1;
return 0;
});
for (const [main_key, { main, opts }] of sorted_configs) {
if (!main) {
console.warn(`SmartEnv: '${main_key}' has been unloaded, skipping inclusion in smart_env`);
delete this.smart_env_configs[main_key];
continue;
}
merge_env_config(
this._config,
deep_clone_config(
normalize_opts(opts)
)
);
}
}
return this._config;
}
get env_start_wait_time() {
if (typeof this.config.env_start_wait_time === "number")
return this.config.env_start_wait_time;
return 5e3;
}
static get global_env() {
return this.global_ref.smart_env;
}
static set global_env(env) {
this.global_ref.smart_env = env;
}
static get mains() {
return Object.keys(this.global_ref.smart_env_configs || {});
}
get mains() {
return Object.keys(this.global_ref.smart_env_configs || {});
}
static get should_reload() {
if (!this.global_env)
return true;
if (this.global_env.state === "loaded")
return true;
if (typeof this.global_env?.constructor?.version === "undefined")
return true;
if (this.global_env.constructor.version < this.version) {
console.warn(
"SmartEnv: Reloading environment because of version mismatch",
`${this.version} > ${this.global_env.constructor.version}`
);
return true;
}
return false;
}
static get smart_env_configs() {
if (!this.global_ref.smart_env_configs)
this.global_ref.smart_env_configs = {};
return this.global_ref.smart_env_configs;
}
get smart_env_configs() {
if (!this.global_ref.smart_env_configs)
this.global_ref.smart_env_configs = {};
return this.global_ref.smart_env_configs;
}
/**
* Waits for either a specific main to be registered in the environment,
* or (if `opts.main` is not specified) waits for environment collections to load.
* @param {object} opts
* @param {object} [opts.main] - if set, the function waits until that main is found.
* @returns {Promise<SmartEnv>} Resolves with the environment instance
*/
static wait_for(opts = {}) {
return new Promise((resolve) => {
if (opts.main) {
const interval = setInterval(() => {
if (this.global_env && this.global_env[opts.main]) {
clearInterval(interval);
resolve(this.global_env);
}
}, 1e3);
} else {
const interval = setInterval(() => {
if (this.global_env && this.global_env.state === "loaded") {
clearInterval(interval);
resolve(this.global_env);
}
}, 100);
}
});
}
/**
* Creates or updates a SmartEnv instance.
* - If a global environment exists and is an older version or lacks 'init_main', it is replaced.
* @param {Object} main - The main object to be added to the SmartEnv instance.
* @param {Object} [main_env_opts={}] - Options for configuring the SmartEnv instance.
* @returns {SmartEnv} The SmartEnv instance.
* @throws {TypeError} If an invalid main object is provided.
* @throws {Error} If there's an error creating or updating the SmartEnv instance.
*/
static async create(main, main_env_opts = null) {
if (!main || typeof main !== "object") {
throw new TypeError("SmartEnv: Invalid main object provided");
}
if (!main_env_opts) {
if (!main.smart_env_config) {
throw new Error("SmartEnv: No main_env_opts or main.smart_env_config provided");
}
main_env_opts = main.smart_env_config;
}
this.add_main(main, main_env_opts);
if (this.should_reload) {
const opts = {};
if (this.global_env && this.version > (this.global_env.constructor?.version || 0)) {
opts.primary_main_key = camel_case_to_snake_case(main.constructor.name);
}
if (this.global_env?.load_timeout)
clearTimeout(this.global_env.load_timeout);
this.global_env = new this(opts);
if (!window.all_envs)
window.all_envs = [];
window.all_envs.push(this.global_env);
}
clearTimeout(this.global_env.load_timeout);
this.global_env.load_timeout = setTimeout(async () => {
await this.global_env.load();
this.global_env.load_timeout = null;
}, this.global_env.env_start_wait_time);
return this.global_env;
}
static add_main(main, main_env_opts = null) {
if (this.global_env?._config)
this.global_env._config = null;
const main_key = camel_case_to_snake_case(main.constructor.name);
this.smart_env_configs[main_key] = { main, opts: main_env_opts };
this.create_env_getter(main);
}
/**
* Creates a dynamic environment getter on any instance object.
* The returned 'env' property will yield the global `smart_env`.
* @param {Object} instance_to_receive_getter
*/
static create_env_getter(instance_to_receive_getter) {
Object.defineProperty(instance_to_receive_getter, "env", {
get: () => this.global_env
});
}
create_env_getter(instance_to_receive_getter) {
this.constructor.create_env_getter(instance_to_receive_getter);
}
async load() {
await this.fs.load_files();
if (!this.settings)
await SmartSettings.create(this);
await this.init_collections();
for (const [main_key, { main, opts }] of Object.entries(this.smart_env_configs)) {
this[main_key] = main;
await this.ready_to_load_collections(main);
}
await this.load_collections();
this.state = "loaded";
}
/**
* Initializes collection classes if they have an 'init' function.
* @param {Object} [config=this.config]
*/
async init_collections(config = this.config) {
for (const key of Object.keys(config.collections || {})) {
const _class = config.collections[key]?.class;
if (!_class)
continue;
if (_class.default_settings) {
deep_merge_no_overwrite(
this.settings,
{
[key]: _class.default_settings
}
);
}
if (typeof _class.init !== "function")
continue;
await _class.init(this, { ...config.collections[key] });
this.collections[key] = "init";
}
}
/**
* Hook for main classes that optionally implement `ready_to_load_collections()`.
* @param {Object} main
*/
async ready_to_load_collections(main) {
if (typeof main?.ready_to_load_collections === "function") {
await main.ready_to_load_collections();
}
return true;
}
/**
* Loads any available collections, processing their load queues.
* @param {Object} [collections=this.collections] - Key-value map of collection instances.
*/
async load_collections(collections = this.collections) {
for (const key of Object.keys(collections || {})) {
const time_start = Date.now();
if (typeof this[key]?.process_load_queue === "function") {
if (this.state === "init" && this[key].opts?.prevent_load_on_init === true)
continue;
await this[key].process_load_queue();
}
this.collections[key] = "loaded";
this[key].load_time_ms = Date.now() - time_start;
}
}
/**
* Removes a main from the window.smart_env_configs to exclude it on reload
* @param {Class} main
* @param {Object|null} [unload_config=null]
*/
static unload_main(main) {
const main_key = camel_case_to_snake_case(main.constructor.name);
this.smart_env_configs[main_key] = null;
delete this.smart_env_configs[main_key];
}
unload_main(main) {
this.constructor.unload_main(main);
}
/**
* Triggers a save event in all known collections.
*/
save() {
for (const key of Object.keys(this.collections)) {
this[key].process_save_queue?.();
}
}
/**
* Initialize a module from the configured `this.opts.modules`.
* @param {string} module_key
* @param {object} opts
* @returns {object|null} instance of the requested module or null if not found
*/
init_module(module_key, opts = {}) {
const module_config = this.opts.modules[module_key];
if (!module_config) {
return console.warn(`SmartEnv: module ${module_key} not found`);
}
opts = {
...{ ...module_config, class: null },
...opts
};
return new module_config.class(opts);
}
get notices() {
if (!this._notices) {
const SmartNoticesClass = this.config.modules.smart_notices.class;
this._notices = new SmartNoticesClass(this, {
adapter: this.config.modules.smart_notices.adapter
});
}
return this._notices;
}
/**
* Exposes a settings template function from environment opts or defaults.
* @returns {Function}
*/
get settings_template() {
return this.opts.components?.smart_env?.settings || render;
}
/**
* Renders settings UI into a container, using the environment's `settings_template`.
* @param {HTMLElement} [container=this.settings_container]
*/
async render_settings(container = this.settings_container) {
if (!this.settings_container || container !== this.settings_container) {
this.settings_container = container;
}
if (!container) {
throw new Error("Container is required");
}
const frag = await this.render_component("settings", this, {});
container.innerHTML = "";
container.appendChild(frag);
return frag;
}
/**
* Renders a named component using an optional scope and options.
* @param {string} component_key
* @param {Object} scope
* @param {Object} [opts]
* @returns {Promise<HTMLElement>}
*/
async render_component(component_key, scope, opts = {}) {
const component_renderer = this.get_component(component_key, scope);
if (!component_renderer) {
console.warn(`SmartEnv: component ${component_key} not found for scope ${scope.constructor.name}`);
return this.smart_view.create_doc_fragment(`<div class="smart-env-component-not-found">
<h1>Component Not Found</h1>
<p>The component ${component_key} was not found for scope ${scope.constructor.name}.</p>
</div>`);
}
const frag = await component_renderer(scope, opts);
return frag;
}
/**
* Retrieves or creates a memoized component renderer function.
* @param {string} component_key
* @param {Object} scope
* @returns {Function|undefined}
*/
get_component(component_key, scope) {
const scope_name = scope.collection_key ?? scope.scope_name;
const _cache_key = scope_name ? `${scope_name}-${component_key}` : component_key;
if (!this._components[_cache_key]) {
try {
if (this.opts.components[scope_name]?.[component_key]) {
this._components[_cache_key] = this.opts.components[scope_name][component_key].bind(
this.init_module("smart_view")
);
} else if (this.opts.components[component_key]) {
this._components[_cache_key] = this.opts.components[component_key].bind(
this.init_module("smart_view")
);
} else {
console.warn(
`SmartEnv: component ${component_key} not found for scope ${scope_name}`
);
}
} catch (e) {
console.error("Error getting component", e);
console.log(
`scope_name: ${scope_name}; component_key: ${component_key}; this.opts.components: ${Object.keys(
this.opts.components || {}
).join(", ")}; this.opts.components[scope_name]: ${Object.keys(
this.opts.components[scope_name] || {}
).join(", ")}`
);
}
}
return this._components[_cache_key];
}
/**
* Lazily instantiate the module 'smart_view'.
* @returns {object}
*/
get smart_view() {
if (!this._smart_view) {
this._smart_view = this.init_module("smart_view");
}
return this._smart_view;
}
/**
* A built-in settings schema for this environment.
* @returns {Object}
*/
get settings_config() {
return {
is_obsidian_vault: {
name: "Obsidian Vault",
description: "Toggle on if this is an Obsidian vault.",
type: "toggle",
default: false
},
file_exclusions: {
name: "File Exclusions",
description: "Comma-separated list of files to exclude.",
type: "text",
default: "",
callback: "update_exclusions"
},
folder_exclusions: {
name: "Folder Exclusions",
description: "Comma-separated list of folders to exclude.",
type: "text",
default: "",
callback: "update_exclusions"
},
excluded_headings: {
name: "Excluded Headings",
description: "Comma-separated list of headings to exclude. Note: currently only applies to blocks (2025-04-07).",
type: "text",
default: ""
}
};
}
get global_prop() {
return this.opts.global_prop ?? "smart_env";
}
get item_types() {
return this.opts.item_types;
}
get fs_module_config() {
return this.opts.modules.smart_fs;
}
get fs() {
if (!this.smart_fs) {
this.smart_fs = new this.fs_module_config.class(this, {
adapter: this.fs_module_config.adapter,
fs_path: this.opts.env_path || ""
});
}
return this.smart_fs;
}
get env_data_dir() {
const env_settings_files = this.fs.file_paths?.filter((path) => path.endsWith("smart_env.json")) || [];
let env_data_dir = ".smart-env";
if (env_settings_files.length > 0) {
if (env_settings_files.length > 1) {
const env_data_dir_counts = env_settings_files.map((path) => {
const dir = path.split("/").slice(-2, -1)[0];
return {
dir,
count: this.fs.file_paths.filter((p) => p.includes(dir)).length
};
});
env_data_dir = env_data_dir_counts.reduce(
(max, dirObj) => dirObj.count > max.count ? dirObj : max,
env_data_dir_counts[0]
).dir;
} else {
env_data_dir = env_settings_files[0].split("/").slice(-2, -1)[0];
}
}
return env_data_dir;
}
get data_fs() {
if (!this._fs) {
this._fs = new this.fs_module_config.class(this, {
adapter: this.fs_module_config.adapter,
fs_path: this.data_fs_path
});
}
return this._fs;
}
get data_fs_path() {
if (!this._data_fs_path) {
this._data_fs_path = (this.opts.env_path + (this.opts.env_path ? this.opts.env_path.includes("\\") ? "\\" : "/" : "") + this.env_data_dir).replace(/\\\\/g, "\\").replace(/\/\//g, "/");
}
return this._data_fs_path;
}
/**
* Saves the current settings to the file system.
* @param {Object|null} [settings=null] - Optional settings to override the current settings before saving.
* @returns {Promise<void>}
*/
async save_settings(settings) {
this._saved = false;
if (!await this.data_fs.exists("")) {
await this.data_fs.mkdir("");
}
await this.data_fs.write("smart_env.json", JSON.stringify(settings, null, 2));
this._saved = true;
}
/**
* Loads settings from the file system, merging with any `default_settings` or `smart_env_settings`.
* @returns {Promise<Object>} the loaded settings
*/
async load_settings() {
if (!await this.data_fs.exists("smart_env.json"))
await this.save_settings({});
let settings = JSON.parse(JSON.stringify(this.config.default_settings || {}));
deep_merge(settings, JSON.parse(await this.data_fs.read("smart_env.json")));
deep_merge(settings, this.opts?.smart_env_settings || {});
this._saved = true;
if (this.fs.auto_excluded_files) {
const existing_file_exclusions = settings.file_exclusions.split(",").map((s) => s.trim()).filter(Boolean);
settings.file_exclusions = [...existing_file_exclusions, ...this.fs.auto_excluded_files].filter((value, index, self) => self.indexOf(value) === index).join(",");
}
return settings;
}
/**
* Refreshes file-system state if exclusions changed,
* then re-renders relevant settings UI
*/
async update_exclusions() {
this.smart_sources._fs = null;
await this.smart_sources.fs.init();
}
/** @deprecated access `this.state` and `collection.state` directly instead */
get collections_loaded() {
return this.state === "loaded";
}
/** @deprecated Use this['main_class_name'] instead of this.main/this.plugin */
get main() {
return this.smart_env_configs[this.mains[0]]?.main;
}
/**
* @deprecated use component pattern instead
*/
get ejs() {
return this.opts.ejs;
}
/**
* @deprecated use component pattern instead
*/
get templates() {
return this.opts.templates;
}
/**
* @deprecated use component pattern instead
*/
get views() {
return this.opts.views;
}
/**
* @deprecated use this.config instead
*/
get opts() {
return this.config;
}
/**
* @deprecated Use this.main_class_name instead of this.plugin
*/
get plugin() {
return this.main;
}
};
function get_global_ref() {
if (typeof document !== "undefined" && document.window) {
console.log("using document.window");
return document.window;
}
if (typeof window !== "undefined") {
console.log("using window");
return window;
}
if (typeof global?.window !== "undefined") {
console.log("using global.window");
return global.window;
}
console.log("using global");
return global;
}

var glob_to_regex_pattern = (pattern, extended_glob) => {
let in_class = false;
let in_brace = 0;
let result = "";
for (let i = 0; i < pattern.length; i++) {
const char = pattern[i];
switch (char) {
case "\\":
result += "\\" + (i + 1 < pattern.length ? pattern[++i] : "\\");
break;
case "/":
result += "\\/";
break;
case "[":
if (!in_class) {
in_class = true;
if (pattern[i + 1] === "!") {
result += "[^";
i++;
} else {
result += "[";
}
} else {
result += "\\[";
}
break;
case "]":
if (in_class) {
in_class = false;
result += "]";
} else {
result += "\\]";
}
break;
case "{":
if (!in_class) {
in_brace++;
result += "(";
} else {
result += "{";
}
break;
case "}":
if (!in_class && in_brace > 0) {
in_brace--;
result += ")";
} else {
result += "}";
}
break;
case ",":
if (!in_class && in_brace > 0) {
result += "|";
} else {
result += ",";
}
break;
case "*":
if (!in_class) {
if (pattern[i + 1] === "*") {
result += ".*";
i++;
} else {
result += "[^/]*";
}
} else {
result += "\\*";
}
break;
case "?":
result += in_class ? "\\?" : "[^/]";
break;
case ".":
case "(":
case ")":
case "+":
case "|":
case "^":
case "$":
result += "\\" + char;
break;
default:
result += char;
}
}
if (extended_glob) {
result = result.replace(/\\\+\\\((.*?)\\\)/g, "($1)+").replace(/\\\@\\\((.*?)\\\)/g, "($1)").replace(/\\\!\\\((.*?)\\\)/g, "(?!$1).*").replace(/\\\?\\\((.*?)\\\)/g, "($1)?").replace(/\\\*\\\((.*?)\\\)/g, "($1)*");
}
return result;
};
var adjust_for_windows_paths = (pattern, windows_paths) => windows_paths ? pattern.replace(/\\\//g, "[\\\\/]") : pattern;
var create_regex = (pattern, { case_sensitive, extended_glob, windows_paths }) => {
const regex_pattern = glob_to_regex_pattern(pattern, extended_glob);
const adjusted_pattern = adjust_for_windows_paths(regex_pattern, windows_paths);
const flags = case_sensitive ? "" : "i";
return new RegExp(`^${adjusted_pattern}$`, flags);
};
function glob_to_regex(pattern, options = {}) {
const default_options = { case_sensitive: true, extended_glob: false, windows_paths: false };
const merged_options = { ...default_options, ...options };
if (pattern === "") {
return /^$/;
}
if (pattern === "*" && !merged_options.windows_paths) {
return /^[^/]+$/;
}
if (pattern === "**" && !merged_options.windows_paths) {
return /^.+$/;
}
return create_regex(pattern, merged_options);
}

function fuzzy_search(arr, search_term) {
let matches = [];
for (let i = 0; i < arr.length; i++) {
const search_chars = search_term.toLowerCase().split("");
let match = true;
let distance = 0;
const name = arr[i];
const label_name = name.toLowerCase();
for (let j = 0; j < search_chars.length; j++) {
const search_index = label_name.substring(distance).indexOf(search_chars[j]);
if (search_index >= 0) {
distance += search_index + 1;
} else {
match = false;
break;
}
}
if (match)
matches.push({ name, distance });
}
matches.sort((a, b) => a.distance - b.distance);
return matches.map((match) => match.name);
}

var SmartFs = class {
/**
* Create a new SmartFs instance
*
* @param {Object} env - The Smart Environment instance
* @param {Object} [opts={}] - Optional configuration
* @param {string} [opts.fs_path] - Custom environment path
*/
constructor(env, opts = {}) {
this.env = env;
this.opts = opts;
this.fs_path = opts.fs_path || opts.env_path || "";
if (!opts.adapter)
throw new Error("SmartFs requires an adapter");
this.adapter = new opts.adapter(this);
this.excluded_patterns = [];
if (Array.isArray(opts.exclude_patterns)) {
opts.exclude_patterns.forEach((pattern) => this.add_ignore_pattern(pattern));
}
this.folders = {};
this.files = {};
this.file_paths = [];
this.folder_paths = [];
this.auto_excluded_files = [];
}
async refresh() {
this.files = {};
this.file_paths = [];
this.folders = {};
this.folder_paths = [];
await this.init();
}
async init() {
await this.load_gitignore();
await this.load_files();
}
async load_files() {
const all = await this.list_recursive();
this.file_paths = [];
this.folder_paths = [];
all.forEach((file) => {
if (file.type === "file") {
this.files[file.path] = file;
this.file_paths.push(file.path);
} else if (file.type === "folder") {
this.folders[file.path] = file;
this.folder_paths.push(file.path);
}
});
}
include_file(file_path) {
const file = this.adapter.get_file(file_path);
this.files[file.path] = file;
this.file_paths.push(file.path);
return file;
}
/**
* Load .gitignore patterns
*
* @returns {Promise<RegExp[]>} Array of RegExp patterns
*/
async load_gitignore() {
const gitignore_path = ".gitignore";
const gitignore_exists = await this.adapter.exists(gitignore_path);
if (gitignore_exists) {
const gitignore_content = await this.adapter.read(gitignore_path, "utf-8");
gitignore_content.split("\n").filter((line) => !line.startsWith("#")).filter(Boolean).forEach((pattern) => this.add_ignore_pattern(pattern));
}
this.add_ignore_pattern(".**");
this.add_ignore_pattern("**/.**");
this.add_ignore_pattern("**/.*/**");
this.add_ignore_pattern("**/*.ajson");
this.add_ignore_pattern("**/*.excalidraw.md");
}
/**
* Add a new ignore pattern
*
* @param {string} pattern - The pattern to add
*/
add_ignore_pattern(pattern, opts = {}) {
this.excluded_patterns.push(glob_to_regex(pattern.trim(), opts));
}
/**
* Check if a path is ignored based on gitignore patterns
*
* @param {string} _path - The path to check
* @returns {boolean} True if the path is ignored, false otherwise
*/
is_excluded(_path) {
try {
if (_path.includes("#"))
return true;
if (!this.excluded_patterns.length)
return false;
return this.excluded_patterns.some((pattern) => pattern.test(_path));
} catch (e) {
console.error(`Error checking if path is excluded: ${e.message}`);
console.error(`Path: `, _path);
throw e;
}
}
/**
* Check if any path in an array of paths is excluded
*
* @param {string[]} paths - Array of paths to check
* @returns {boolean} True if any path is excluded, false otherwise
*/
has_excluded_patterns(paths) {
return paths.some((p) => this.is_excluded(p));
}
/**
* Pre-process an array of paths, throwing an error if any path is excluded
*
* @param {string[]} paths - Array of paths to pre-process
* @throws {Error} If any path in the array is excluded
* @returns {string[]} The array of paths
*/
pre_process(paths) {
if (this.has_excluded_patterns(paths)) {
throw new Error(`Path is excluded: ${paths.find((p) => this.is_excluded(p))}`);
}
return paths;
}
/**
* Post-process the result of an operation
*
* @param {any} returned_value - The value returned by the operation
* @returns {any} The post-processed value
*/
post_process(returned_value) {
if (this.adapter.post_process)
return this.adapter.post_process(returned_value);
if (Array.isArray(returned_value)) {
returned_value = returned_value.filter((r) => {
if (typeof r === "string")
return !this.is_excluded(r);
if (typeof r === "object" && r.path)
return !this.is_excluded(r.path);
return true;
});
}
return returned_value;
}
/**
* Use the adapter for a method
* runs pre_process and post_process (checks exclusions)
* @param {string} method - The method to use
* @param {string[]} paths - The paths to use
* @param {...any} args - Additional arguments for the method
* @returns {Promise<any>} The result of the method
*/
async use_adapter(method, paths, ...args) {
if (!this.adapter[method])
throw new Error(`Method ${method} not found in adapter`);
paths = this.pre_process(paths ?? []);
let resp = await this.adapter[method](...paths, ...args);
return this.post_process(resp);
}
/**
* Append content to a file
*
* @param {string} rel_path - The relative path of the file to append to
* @param {string|Buffer} content - The content to append
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async append(rel_path, content) {
return await this.use_adapter("append", [rel_path], content);
}
/**
* Create a new directory
*
* @param {string} rel_path - The relative path of the directory to create
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async mkdir(rel_path, opts = { recursive: true }) {
return await this.use_adapter("mkdir", [rel_path], opts);
}
/**
* Check if a file or directory exists
*
* @param {string} rel_path - The relative path to check
* @returns {Promise<boolean>} True if the path exists, false otherwise
*/
async exists(rel_path) {
return await this.use_adapter("exists", [rel_path]);
}
/**
* List files in a directory
*
* @param {string} rel_path - The relative path to list
* @returns {Promise<string[]>} Array of file paths
*/
async list(rel_path = "/") {
return await this.use_adapter("list", [rel_path]);
}
async list_recursive(rel_path = "/") {
return await this.use_adapter("list_recursive", [rel_path]);
}
async list_files(rel_path = "/") {
return await this.use_adapter("list_files", [rel_path]);
}
async list_files_recursive(rel_path = "/") {
return await this.use_adapter("list_files_recursive", [rel_path]);
}
async list_folders(rel_path = "/") {
return await this.use_adapter("list_folders", [rel_path]);
}
async list_folders_recursive(rel_path = "/") {
return await this.use_adapter("list_folders_recursive", [rel_path]);
}
/**
* Read the contents of a file
*
* @param {string} rel_path - The relative path of the file to read
* @returns {Promise<string|Buffer>} The contents of the file
*/
async read(rel_path, encoding = "utf-8") {
try {
const content = await this.adapter.read(rel_path, encoding);
return content;
} catch (error) {
console.warn("Error during read: " + error.message, rel_path);
if (error.code === "ENOENT")
return null;
return { error: error.message };
}
}
/**
* Remove a file
*
* @param {string} rel_path - The relative path of the file to remove
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async remove(rel_path) {
return await this.use_adapter("remove", [rel_path]);
}
/**
* Remove a directory
*
* @param {string} rel_path - The relative path of the directory to remove
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async remove_dir(rel_path, recursive = false) {
return await this.use_adapter("remove_dir", [rel_path], recursive);
}
/**
* Rename a file or directory
*
* @param {string} rel_path - The current relative path
* @param {string} new_rel_path - The new relative path
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async rename(rel_path, new_rel_path) {
await this.use_adapter("rename", [rel_path, new_rel_path]);
await this.refresh();
}
/**
* Get file or directory statistics
*
* @param {string} rel_path - The relative path to get statistics for
* @returns {Promise<Object>} An object containing file or directory statistics
*/
async stat(rel_path) {
return await this.use_adapter("stat", [rel_path]);
}
/**
* Write content to a file
* Should handle when target path is within a folder that doesn't exist
*
* @param {string} rel_path - The relative path of the file to write to
* @param {string|Buffer} content - The content to write
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async write(rel_path, content) {
try {
await this.adapter.write(rel_path, content);
} catch (error) {
console.error("Error during write:", error);
throw error;
}
}
get_link_target_path(link_target, source_path) {
if (this.adapter.get_link_target_path)
return this.adapter.get_link_target_path(link_target, source_path);
if (!this.file_paths)
return console.warn("get_link_target_path: file_paths not found");
const matching_file_paths = this.file_paths.filter((path) => path.includes(link_target));
return fuzzy_search(matching_file_paths, link_target)[0];
}
get sep() {
return this.adapter.sep || "/";
}
get_full_path(rel_path = "") {
return this.adapter.get_full_path(rel_path);
}
get base_path() {
return this.adapter.get_base_path();
}
};

var obsidian = __toESM(require("obsidian"), 1);
var SmartFsObsidianAdapter = class {
/**
* Create an SmartFsObsidianAdapter instance
*
* @param {Object} smart_fs - The SmartFs instance
*/
constructor(smart_fs) {
this.smart_fs = smart_fs;
this.obsidian = obsidian;
this.obsidian_app = smart_fs.env.main.app;
this.obsidian_adapter = smart_fs.env.main.app.vault.adapter;
}
get fs_path() {
return this.smart_fs.fs_path;
}
get_file(file_path) {
const file = {};
file.path = file_path.replace(/\\/g, "/").replace(this.smart_fs.fs_path, "").replace(/^\//, "");
file.type = "file";
file.extension = file.path.split(".").pop().toLowerCase();
file.name = file.path.split("/").pop();
file.basename = file.name.split(".").shift();
Object.defineProperty(file, "stat", {
get: () => {
const tfile = this.obsidian_app.vault.getAbstractFileByPath(file_path);
if (tfile) {
return {
ctime: tfile.stat.ctime,
mtime: tfile.stat.mtime,
size: tfile.stat.size,
isDirectory: () => tfile instanceof this.obsidian.TFolder,
isFile: () => tfile instanceof this.obsidian.TFile
};
}
return null;
}
});
return file;
}
/**
* Append content to a file
*
* @param {string} rel_path - The relative path of the file to append to
* @param {string} data - The content to append
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async append(rel_path, data) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.append(rel_path, data);
}
/**
* Create a new directory
*
* @param {string} rel_path - The relative path of the directory to create
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async mkdir(rel_path) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.mkdir(rel_path);
}
/**
* Check if a file or directory exists
*
* @param {string} rel_path - The relative path to check
* @returns {Promise<boolean>} True if the path exists, false otherwise
*/
async exists(rel_path) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.exists(rel_path);
}
/**
* List files in a directory (NOT up-to-date with list_recursive)
*
* @param {string} rel_path - The relative path to list
* @returns {Promise<string[]>} Array of file paths
*/
async list(rel_path, opts = {}) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
if (rel_path.startsWith("/"))
rel_path = rel_path.slice(1);
if (rel_path.endsWith("/"))
rel_path = rel_path.slice(0, -1);
if (rel_path.includes(".")) {
const { files: file_paths } = await this.obsidian_adapter.list(rel_path);
const files2 = file_paths.map((file_path) => {
if (this.smart_fs.fs_path)
file_path = file_path.replace(this.smart_fs.fs_path, "").slice(1);
const file_name = file_path.split("/").pop();
const file = {
basename: file_name.split(".")[0],
extension: file_name.split(".").pop().toLowerCase(),
name: file_name,
path: file_path
};
return file;
});
return files2;
}
const files = this.obsidian_app.vault.getAllLoadedFiles().filter((file) => {
const last_slash = file.path.lastIndexOf("/");
if (last_slash === -1 && rel_path !== "")
return false;
const folder_path = file.path.slice(0, last_slash);
if (folder_path !== rel_path)
return false;
return true;
});
return files;
}
async list_recursive(rel_path, opts = {}) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
if (rel_path.startsWith("/"))
rel_path = rel_path.slice(1);
if (rel_path.endsWith("/"))
rel_path = rel_path.slice(0, -1);
const files = this.obsidian_app.vault.getAllLoadedFiles().filter((file) => {
if (file.path.length > 200) {
this.smart_fs.auto_excluded_files.push(file.path);
return false;
}
if (rel_path !== "" && !file.path.startsWith(rel_path))
return false;
if (file instanceof this.obsidian.TFile) {
if (opts.type === "folder")
return false;
file.type = "file";
} else if (file instanceof this.obsidian.TFolder) {
if (opts.type === "file")
return false;
delete file.basename;
delete file.extension;
file.type = "folder";
}
if (this.smart_fs.fs_path)
file.path = file.path.replace(this.smart_fs.fs_path, "").slice(1);
return true;
});
return files;
}
async list_files(rel_path) {
return await this.list(rel_path, { type: "file" });
}
async list_files_recursive(rel_path) {
return await this.list_recursive(rel_path, { type: "file" });
}
async list_folders(rel_path) {
return await this.list(rel_path, { type: "folder" });
}
async list_folders_recursive(rel_path) {
return await this.list_recursive(rel_path, { type: "folder" });
}
/**
* Read the contents of a file
*
* @param {string} rel_path - The relative path of the file to read
* @returns {Promise<string>} The contents of the file
*/
async read(rel_path, encoding, opts = {}) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
if (encoding === "utf-8") {
if (!opts.no_cache) {
const tfile = this.obsidian_app.vault.getFileByPath(rel_path);
if (tfile)
return await this.obsidian_app.vault.cachedRead(tfile);
}
return await this.obsidian_adapter.read(rel_path);
}
if (encoding === "base64") {
const array_buffer2 = await this.obsidian_adapter.readBinary(rel_path, "base64");
const base64 = this.obsidian.arrayBufferToBase64(array_buffer2);
return base64;
}
const array_buffer = await this.obsidian_adapter.readBinary(rel_path);
return array_buffer;
}
/**
* Rename a file or directory
*
* @param {string} old_path - The current path of the file or directory
* @param {string} new_path - The new path for the file or directory
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async rename(old_path, new_path) {
if (!old_path.startsWith(this.fs_path))
old_path = this.fs_path + "/" + old_path;
if (!new_path.startsWith(this.fs_path))
new_path = this.fs_path + "/" + new_path;
return await this.obsidian_adapter.rename(old_path, new_path);
}
/**
* Remove a file
*
* @param {string} rel_path - The relative path of the file to remove
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async remove(rel_path) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
try {
return await this.obsidian_adapter.remove(rel_path);
} catch (error) {
console.warn(`Error removing file: ${rel_path}`, error);
}
}
/**
* Remove a directory
*
* @param {string} rel_path - The relative path of the directory to remove
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async remove_dir(rel_path, recursive = false) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.rmdir(rel_path, recursive);
}
/**
* Get file or directory information
*
* @param {string} rel_path - The relative path of the file or directory
* @returns {Promise<Object>} An object containing file or directory information
*/
async stat(rel_path) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.stat(rel_path);
}
/**
* Write content to a file
*
* @param {string} rel_path - The relative path of the file to write to
* @param {string} data - The content to write
* @returns {Promise<void>} A promise that resolves when the operation is complete
*/
async write(rel_path, data) {
if (!rel_path.startsWith(this.fs_path))
rel_path = this.fs_path + "/" + rel_path;
return await this.obsidian_adapter.write(rel_path, data);
}
get_link_target_path(link_path, file_path) {
return this.obsidian_app.metadataCache.getFirstLinkpathDest(link_path, file_path)?.path;
}
get_base_path() {
return this.obsidian_adapter.basePath;
}
get_full_path(rel_path = "") {
const sep = rel_path.includes("/") ? "/" : "\\";
return this.get_base_path() + sep + rel_path;
}
};

var SmartView = class {
/**
* @constructor
* @param {object} opts - Additional options or overrides for rendering.
*/
constructor(opts = {}) {
this.opts = opts;
this._adapter = null;
}
/**
* Renders all setting components within a container.
* @async
* @param {HTMLElement} container - The container element.
* @param {Object} opts - Additional options for rendering.
* @returns {Promise<void>}
*/
async render_setting_components(container, opts = {}) {
const components = container.querySelectorAll(".setting-component");
for (const component of components) {
await this.render_setting_component(component, opts);
}
return container;
}
/**
* Creates a document fragment from HTML string.
* @param {string} html - The HTML string.
* @returns {DocumentFragment}
*/
create_doc_fragment(html) {
return document.createRange().createContextualFragment(html);
}
/**
* Gets the adapter instance used for rendering (e.g., Obsidian or Node, etc.).
* @returns {Object} The adapter instance.
*/
get adapter() {
if (!this._adapter) {
if (!this.opts.adapter) {
throw new Error("No adapter provided to SmartView. Provide a 'smart_view.adapter' in env config.");
}
const AdapterClass = this.opts.adapter;
this._adapter = new AdapterClass(this);
}
return this._adapter;
}
/**
* Gets an icon (implemented in the adapter).
* @param {string} icon_name - Name of the icon to get.
* @returns {string} The icon HTML string.
*/
get_icon_html(icon_name) {
return this.adapter.get_icon_html(icon_name);
}
/**
* Renders a single setting component (implemented in adapter).
* @async
* @param {HTMLElement} setting_elm - The DOM element for the setting.
* @param {Object} opts - Additional options for rendering.
* @returns {Promise<*>}
*/
async render_setting_component(setting_elm, opts = {}) {
return await this.adapter.render_setting_component(setting_elm, opts);
}
/**
* Renders markdown content (implemented in adapter).
* @param {string} markdown - The markdown content.
* @param {object|null} scope - The scope to pass for rendering.
* @returns {Promise<DocumentFragment>}
*/
async render_markdown(markdown, scope = null) {
return await this.adapter.render_markdown(markdown, scope);
}
/**
* Gets a value from an object by path.
* @param {Object} obj - The object to search in.
* @param {string} path - The path to the value.
* @returns {*}
*/
get_by_path(obj, path, settings_scope = null) {
return get_by_path(obj, path, settings_scope);
}
/**
* Sets a value in an object by path.
* @param {Object} obj - The object to modify.
* @param {string} path - The path to set the value.
* @param {*} value - The value to set.
*/
set_by_path(obj, path, value, settings_scope = null) {
set_by_path(obj, path, value, settings_scope);
}
/**
* Deletes a value from an object by path.
* @param {Object} obj - The object to modify.
* @param {string} path - The path to delete.
*/
delete_by_path(obj, path, settings_scope = null) {
delete_by_path(obj, path, settings_scope);
}
/**
* Escapes HTML special characters in a string.
* @param {string} str - The string to escape.
* @returns {string} The escaped string.
*/
escape_html(str) {
if (typeof str !== "string")
return str;
return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
/**
* A convenience method to build a setting HTML snippet from a config object.
* @param {Object} setting_config
* @returns {string}
*/
render_setting_html(setting_config) {
if (setting_config.type === "html") {
return setting_config.value;
}
const attributes = Object.entries(setting_config).map(([attr, value]) => {
if (attr.includes("class"))
return "";
if (typeof value === "number")
return `data-${attr.replace(/_/g, "-")}=${value}`;
return `data-${attr.replace(/_/g, "-")}="${value}"`;
}).join("\n");
return `<div class="setting-component${setting_config.scope_class ? " " + setting_config.scope_class : ""}"
data-setting="${setting_config.setting}"
${attributes}
></div>`;
}
/**
* Handles the smooth transition effect when opening overlays.
* @param {HTMLElement} overlay_container - The overlay container element.
*/
on_open_overlay(overlay_container) {
overlay_container.style.transition = "background-color 0.5s ease-in-out";
overlay_container.style.backgroundColor = "var(--bold-color)";
setTimeout(() => {
overlay_container.style.backgroundColor = "";
}, 500);
}
/**
* Renders settings from a config, returning a fragment.
* @async
* @param {Object} settings_config
* @param {Object} opts
* @returns {Promise<DocumentFragment>}
*/
async render_settings(settings_config4, opts = {}) {
const html = Object.entries(settings_config4).map(([setting_key, setting_config]) => {
if (!setting_config.setting) {
setting_config.setting = setting_key;
}
return this.render_setting_html(setting_config);
}).join("\n");
const frag = this.create_doc_fragment(`<div>${html}</div>`);
return await this.render_setting_components(frag, opts);
}
/**
* @function add_settings_listeners
* @description
* Scans the given container for elements that have `data-smart-setting` and attaches
* a 'change' event listener. On change, it updates the corresponding path in `scope.settings`.
*
* @param {Object} scope - An object containing a `settings` property, where new values will be stored.
* @param {HTMLElement} [container=document] - The DOM element to scan. Defaults to the entire document.
*/
add_settings_listeners(scope, container = document) {
const elements = container.querySelectorAll("[data-smart-setting]");
elements.forEach((elm) => {
const path = elm.dataset.smartSetting;
if (!path)
return;
if (!elm.dataset.listenerAttached) {
elm.dataset.listenerAttached = "true";
elm.addEventListener("change", () => {
let newValue;
if (elm instanceof HTMLInputElement) {
if (elm.type === "checkbox") {
newValue = elm.checked;
} else if (elm.type === "radio") {
if (elm.checked) {
newValue = elm.value;
} else {
return;
}
} else {
newValue = elm.value;
}
} else if (elm instanceof HTMLSelectElement || elm instanceof HTMLTextAreaElement) {
newValue = elm.value;
} else {
newValue = elm.value ?? elm.textContent;
}
this.set_by_path(scope.settings, path, newValue);
});
}
});
}
apply_style_sheet(sheet) {
if ("adoptedStyleSheets" in Document.prototype) {
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
} else {
const styleEl = document.createElement("style");
if (sheet.cssRules) {
styleEl.textContent = Array.from(sheet.cssRules).map((rule) => rule.cssText).join("\n");
}
document.head.appendChild(styleEl);
}
}
};
function get_by_path(obj, path, settings_scope = null) {
if (!path)
return "";
const keys = path.split(".");
if (settings_scope) {
keys.unshift(settings_scope);
}
const finalKey = keys.pop();
const instance = keys.reduce((acc, key) => acc && acc[key], obj);
if (instance && typeof instance[finalKey] === "function") {
return instance[finalKey].bind(instance);
}
return instance ? instance[finalKey] : void 0;
}
function set_by_path(obj, path, value, settings_scope = null) {
const keys = path.split(".");
if (settings_scope) {
keys.unshift(settings_scope);
}
console.log("keys", keys);
const final_key = keys.pop();
const target = keys.reduce((acc, key) => {
if (!acc[key] || typeof acc[key] !== "object") {
acc[key] = {};
}
return acc[key];
}, obj);
target[final_key] = value;
}
function delete_by_path(obj, path, settings_scope = null) {
const keys = path.split(".");
if (settings_scope) {
keys.unshift(settings_scope);
}
const finalKey = keys.pop();
const instance = keys.reduce((acc, key) => acc && acc[key], obj);
if (instance) {
delete instance[finalKey];
}
}

var SmartViewAdapter = class {
constructor(main) {
this.main = main;
}
/**
* Retrieves the class used for settings.
* Must be overridden by subclasses to return the appropriate setting class.
* @abstract
* @returns {Function} The setting class constructor.
* @throws Will throw an error if not implemented in the subclass.
*/
get setting_class() {
throw new Error("setting_class() not implemented");
}
/**
* Generates the HTML for a specified icon.
* Must be overridden by subclasses to provide the correct icon HTML.
* @abstract
* @param {string} icon_name - The name of the icon to generate HTML for.
* @returns {string} The HTML string representing the icon.
* @throws Will throw an error if not implemented in the subclass.
*/
get_icon_html(icon_name) {
throw new Error("get_icon_html() not implemented");
}
/**
* Renders Markdown content within a specific scope.
* Must be overridden by subclasses to handle Markdown rendering appropriately.
* @abstract
* @param {string} markdown - The Markdown content to render.
* @param {object|null} [scope=null] - The scope within which to render the Markdown.
* @returns {Promise<void>} A promise that resolves when rendering is complete.
* @throws Will throw an error if not implemented in the subclass.
*/
async render_markdown(markdown, scope = null) {
throw new Error("render_markdown() not implemented");
}
/**
* Opens a specified URL.
* Should be overridden by subclasses to define how URLs are opened.
* @abstract
* @param {string} url - The URL to open.
*/
open_url(url) {
throw new Error("open_url() not implemented");
}
/**
* Handles the selection of a folder by invoking the folder selection dialog and updating the setting.
* @abstract
* @param {string} setting - The path of the setting being modified.
* @param {string} value - The current value of the setting.
* @param {HTMLElement} elm - The HTML element associated with the setting.
* @param {object} scope - The current scope containing settings and actions.
*/
handle_folder_select(path, value, elm, scope) {
throw new Error("handle_folder_select not implemented");
}
/**
* Handles the selection of a file by invoking the file selection dialog and updating the setting.
* @abstract
* @param {string} setting - The path of the setting being modified.
* @param {string} value - The current value of the setting.
* @param {HTMLElement} elm - The HTML element associated with the setting.
* @param {object} scope - The current scope containing settings and actions.
*/
handle_file_select(path, value, elm, scope) {
throw new Error("handle_file_select not implemented");
}
/**
* Performs actions before a setting is changed, such as clearing notices and updating the UI.
* @abstract
* @param {string} setting - The path of the setting being changed.
* @param {*} value - The new value for the setting.
* @param {HTMLElement} elm - The HTML element associated with the setting.
* @param {object} scope - The current scope containing settings and actions.
*/
pre_change(path, value, elm) {
}
/**
* Performs actions after a setting is changed, such as updating UI elements.
* @abstract
* @param {string} setting - The path of the setting that was changed.
* @param {*} value - The new value for the setting.
* @param {HTMLElement} elm - The HTML element associated with the setting.
* @param {object} changed - Additional information about the change.
*/
post_change(path, value, elm) {
}
/**
* Reverts a setting to its previous value in case of validation failure or error.
* @abstract
* @param {string} setting - The path of the setting to revert.
* @param {HTMLElement} elm - The HTML element associated with the setting.
* @param {object} scope - The current scope containing settings.
*/
revert_setting(path, elm, scope) {
console.warn("revert_setting() not implemented");
}
get setting_renderers() {
return {
text: this.render_text_component,
string: this.render_text_component,
password: this.render_password_component,
number: this.render_number_component,
dropdown: this.render_dropdown_component,
toggle: this.render_toggle_component,
textarea: this.render_textarea_component,
textarea_array: this.render_textarea_array_component,
button: this.render_button_component,
remove: this.render_remove_component,
folder: this.render_folder_select_component,
"text-file": this.render_file_select_component,
file: this.render_file_select_component,
slider: this.render_slider_component,
html: this.render_html_component,
button_with_confirm: this.render_button_with_confirm_component
};
}
async render_setting_component(elm, opts = {}) {
elm.innerHTML = "";
const path = elm.dataset.setting;
const scope = opts.scope || this.main.main;
const settings_scope = opts.settings_scope || null;
try {
let value = elm.dataset.value ?? this.main.get_by_path(scope.settings, path, settings_scope);
if (typeof value === "undefined" && typeof elm.dataset.default !== "undefined") {
value = elm.dataset.default;
if (typeof value === "string")
value = value.toLowerCase() === "true" ? true : value === "false" ? false : value;
this.main.set_by_path(scope.settings, path, value, settings_scope);
}
const renderer = this.setting_renderers[elm.dataset.type];
if (!renderer) {
console.warn(`Unsupported setting type: ${elm.dataset.type}`);
return elm;
}
const setting = renderer.call(this, elm, path, value, scope, settings_scope);
if (elm.dataset.name)
setting.setName(elm.dataset.name);
if (elm.dataset.description) {
const frag = this.main.create_doc_fragment(`<span>${elm.dataset.description}</span>`);
setting.setDesc(frag);
}
if (elm.dataset.tooltip)
setting.setTooltip(elm.dataset.tooltip);
this.add_button_if_needed(setting, elm, path, scope);
this.handle_disabled_and_hidden(elm);
return elm;
} catch (e) {
console.error({ path, elm });
console.error(e);
}
}
render_dropdown_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
let options;
if (elm.dataset.optionsCallback) {
console.log(`getting options callback: ${elm.dataset.optionsCallback}`);
const opts_callback = this.main.get_by_path(scope, elm.dataset.optionsCallback);
if (typeof opts_callback === "function")
options = opts_callback();
else
console.warn(`optionsCallback is not a function: ${elm.dataset.optionsCallback}`, scope);
}
if (!options || !options.length) {
options = this.get_dropdown_options(elm);
}
smart_setting.addDropdown((dropdown) => {
if (elm.dataset.required)
dropdown.inputEl.setAttribute("required", true);
options.forEach((option) => {
const opt = dropdown.addOption(option.value, option.name ?? option.value);
opt.selected = option.value === value;
});
dropdown.onChange((value2) => {
this.handle_on_change(path, value2, elm, scope, settings_scope);
});
dropdown.setValue(value);
});
return smart_setting;
}
render_text_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addText((text) => {
text.setPlaceholder(elm.dataset.placeholder || "");
if (value)
text.setValue(value);
let debounceTimer;
if (elm.dataset.button) {
smart_setting.addButton((button) => {
button.setButtonText(elm.dataset.button);
button.onClick(async () => this.handle_on_change(path, text.getValue(), elm, scope));
});
} else {
text.onChange(async (value2) => {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => this.handle_on_change(path, value2.trim(), elm, scope, settings_scope), 2e3);
});
}
});
return smart_setting;
}
render_password_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addText((text) => {
text.inputEl.type = "password";
text.setPlaceholder(elm.dataset.placeholder || "");
if (value)
text.setValue(value);
let debounceTimer;
text.onChange(async (value2) => {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => this.handle_on_change(path, value2, elm, scope, settings_scope), 2e3);
});
});
return smart_setting;
}
render_number_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addText((number) => {
number.inputEl.type = "number";
number.setPlaceholder(elm.dataset.placeholder || "");
if (typeof value !== "undefined")
number.inputEl.value = parseInt(value);
number.inputEl.min = elm.dataset.min || 0;
if (elm.dataset.max)
number.inputEl.max = elm.dataset.max;
let debounceTimer;
number.onChange(async (value2) => {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => this.handle_on_change(path, parseInt(value2), elm, scope, settings_scope), 2e3);
});
});
return smart_setting;
}
render_toggle_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addToggle((toggle) => {
let checkbox_val = value ?? false;
if (typeof checkbox_val === "string") {
checkbox_val = checkbox_val.toLowerCase() === "true";
}
toggle.setValue(checkbox_val);
toggle.onChange(async (value2) => this.handle_on_change(path, value2, elm, scope, settings_scope));
});
return smart_setting;
}
render_textarea_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addTextArea((textarea) => {
textarea.setPlaceholder(elm.dataset.placeholder || "");
textarea.setValue(value || "");
let debounceTimer;
textarea.onChange(async (value2) => {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => this.handle_on_change(path, value2, elm, scope, settings_scope), 2e3);
});
});
return smart_setting;
}
render_textarea_array_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addTextArea((textarea) => {
textarea.setPlaceholder(elm.dataset.placeholder || "");
textarea.setValue(Array.isArray(value) ? value.join("\n") : value || "");
let debounceTimer;
textarea.onChange(async (value2) => {
value2 = value2.split("\n").map((v) => v.trim()).filter((v) => v);
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => this.handle_on_change(path, value2, elm, scope, settings_scope), 2e3);
});
});
return smart_setting;
}
render_button_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addButton((button) => {
button.setButtonText(elm.dataset.btnText || elm.dataset.name);
button.onClick(async () => {
if (elm.dataset.confirm && !confirm(elm.dataset.confirm))
return;
if (elm.dataset.href)
this.open_url(elm.dataset.href);
if (elm.dataset.callback) {
const callback = this.main.get_by_path(scope, elm.dataset.callback);
if (callback)
callback(path, value, elm, scope, settings_scope);
}
});
});
return smart_setting;
}
render_remove_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addButton((button) => {
button.setButtonText(elm.dataset.btnText || elm.dataset.name || "Remove");
button.onClick(async () => {
this.main.delete_by_path(scope.settings, path, settings_scope);
if (elm.dataset.callback) {
const callback = this.main.get_by_path(scope, elm.dataset.callback);
if (callback)
callback(path, value, elm, scope, settings_scope);
}
});
});
return smart_setting;
}
render_folder_select_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addFolderSelect((folder_select) => {
folder_select.setPlaceholder(elm.dataset.placeholder || "");
if (value)
folder_select.setValue(value);
folder_select.inputEl.closest("div").addEventListener("click", () => {
this.handle_folder_select(path, value, elm, scope);
});
folder_select.inputEl.querySelector("input").addEventListener("change", (e) => {
const folder = e.target.value;
this.handle_on_change(path, folder, elm, scope, settings_scope);
console.log("folder changed", folder);
});
});
return smart_setting;
}
render_file_select_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addFileSelect((file_select) => {
file_select.setPlaceholder(elm.dataset.placeholder || "");
if (value)
file_select.setValue(value);
file_select.inputEl.closest("div").addEventListener("click", () => {
this.handle_file_select(path, value, elm, scope, settings_scope);
});
});
return smart_setting;
}
render_slider_component(elm, path, value, scope, settings_scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addSlider((slider) => {
const min = parseFloat(elm.dataset.min) || 0;
const max = parseFloat(elm.dataset.max) || 100;
const step = parseFloat(elm.dataset.step) || 1;
const currentValue = typeof value !== "undefined" ? parseFloat(value) : min;
slider.setLimits(min, max, step);
slider.setValue(currentValue);
slider.onChange((newVal) => {
const numericVal = parseFloat(newVal);
this.handle_on_change(path, numericVal, elm, scope, settings_scope);
});
});
return smart_setting;
}
render_html_component(elm, path, value, scope) {
elm.innerHTML = value;
return elm;
}
add_button_if_needed(smart_setting, elm, path, scope) {
if (elm.dataset.btn) {
smart_setting.addButton((button) => {
button.setButtonText(elm.dataset.btn);
button.inputEl.addEventListener("click", (e) => {
if (elm.dataset.btnCallback && typeof scope[elm.dataset.btnCallback] === "function") {
if (elm.dataset.btnCallbackArg)
scope[elm.dataset.btnCallback](elm.dataset.btnCallbackArg);
else
scope[elm.dataset.btnCallback](path, null, smart_setting, scope);
} else if (elm.dataset.btnHref) {
this.open_url(elm.dataset.btnHref);
} else if (elm.dataset.callback && typeof this.main.get_by_path(scope, elm.dataset.callback) === "function") {
this.main.get_by_path(scope, elm.dataset.callback)(path, null, smart_setting, scope);
} else if (elm.dataset.href) {
this.open_url(elm.dataset.href);
} else {
console.error("No callback or href found for button.");
}
});
if (elm.dataset.btnDisabled || elm.dataset.disabled && elm.dataset.btnDisabled !== "false") {
button.inputEl.disabled = true;
}
});
}
}
handle_disabled_and_hidden(elm) {
if (elm.dataset.disabled && elm.dataset.disabled !== "false") {
elm.classList.add("disabled");
elm.querySelector("input, select, textarea, button").disabled = true;
}
if (elm.dataset.hidden && elm.dataset.hidden !== "false") {
elm.style.display = "none";
}
}
get_dropdown_options(elm) {
return Object.entries(elm.dataset).reduce((acc, [k, v]) => {
if (!k.startsWith("option"))
return acc;
const [value, name] = v.split("|");
acc.push({ value, name: name || value });
return acc;
}, []);
}
handle_on_change(path, value, elm, scope, settings_scope) {
this.pre_change(path, value, elm, scope);
if (elm.dataset.validate) {
const valid = this[elm.dataset.validate](path, value, elm, scope);
if (!valid) {
elm.querySelector(".setting-item").style.border = "2px solid red";
this.revert_setting(path, elm, scope);
return;
}
}
this.main.set_by_path(scope.settings, path, value, settings_scope);
if (elm.dataset.callback) {
const callback = this.main.get_by_path(scope, elm.dataset.callback);
if (callback)
callback(path, value, elm, scope);
}
this.post_change(path, value, elm, scope);
}
render_button_with_confirm_component(elm, path, value, scope) {
const smart_setting = new this.setting_class(elm);
smart_setting.addButton((button) => {
button.setButtonText(elm.dataset.btnText || elm.dataset.name);
elm.appendChild(this.main.create_doc_fragment(`
<div class="sc-inline-confirm-row" style="
display: none;
">
<span style="margin-right: 10px;">
${elm.dataset.confirm || "Are you sure?"}
</span>
<span class="sc-inline-confirm-row-buttons">
<button class="sc-inline-confirm-yes">Yes</button>
<button class="sc-inline-confirm-cancel">Cancel</button>
</span>
</div>
`));
const confirm_row = elm.querySelector(".sc-inline-confirm-row");
const confirm_yes = confirm_row.querySelector(".sc-inline-confirm-yes");
const confirm_cancel = confirm_row.querySelector(".sc-inline-confirm-cancel");
button.onClick(async () => {
confirm_row.style.display = "block";
elm.querySelector(".setting-item").style.display = "none";
});
confirm_yes.addEventListener("click", async () => {
if (elm.dataset.href)
this.open_url(elm.dataset.href);
if (elm.dataset.callback) {
const callback = this.main.get_by_path(scope, elm.dataset.callback);
if (callback)
callback(path, value, elm, scope);
}
elm.querySelector(".setting-item").style.display = "block";
confirm_row.style.display = "none";
});
confirm_cancel.addEventListener("click", () => {
confirm_row.style.display = "none";
elm.querySelector(".setting-item").style.display = "block";
});
});
return smart_setting;
}
};

var import_obsidian = require("obsidian");
var SmartViewObsidianAdapter = class extends SmartViewAdapter {
get setting_class() {
return import_obsidian.Setting;
}
open_url(url) {
window.open(url);
}
async render_file_select_component(elm, path, value) {
return super.render_text_component(elm, path, value);
}
async render_folder_select_component(elm, path, value) {
return super.render_text_component(elm, path, value);
}
async render_markdown(markdown, scope) {
const component = scope.env.smart_connections_plugin?.connections_view || new import_obsidian.Component();
if (!scope)
return console.warn("Scope required for rendering markdown in Obsidian adapter");
const frag = this.main.create_doc_fragment("<div><div class='inner'></div></div>");
const container = frag.querySelector(".inner");
try {
await import_obsidian.MarkdownRenderer.render(
scope.env.plugin.app,
markdown,
container,
scope?.file_path || "",
component
);
} catch (e) {
console.warn("Error rendering markdown in Obsidian adapter", e);
}
return frag;
}
get_icon_html(name) {
return (0, import_obsidian.getIcon)(name).outerHTML;
}
is_mod_event(event) {
return import_obsidian.Keymap.isModEvent(event);
}
};

function collection_instance_name_from(class_name) {
if (class_name.endsWith("Item")) {
return class_name.replace(/Item$/, "").toLowerCase();
}
return class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/y$/, "ie") + "s";
}

function create_uid(data) {
const str = JSON.stringify(data);
let hash = 0;
if (str.length === 0)
return hash;
for (let i = 0; i < str.length; i++) {
const char = str.charCodeAt(i);
hash = (hash << 5) - hash + char;
hash = hash & hash;
if (hash < 0)
hash = hash * -1;
}
return hash.toString() + str.length;
}
function deep_merge2(target, source) {
for (const key in source) {
if (source.hasOwnProperty(key)) {
if (is_obj(source[key]) && is_obj(target[key]))
deep_merge2(target[key], source[key]);
else
target[key] = source[key];
}
}
return target;
function is_obj(item) {
return item && typeof item === "object" && !Array.isArray(item);
}
}

function deep_equal(obj1, obj2, visited = /* @__PURE__ */ new WeakMap()) {
if (obj1 === obj2)
return true;
if (obj1 === null || obj2 === null || obj1 === void 0 || obj2 === void 0)
return false;
if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2))
return false;
if (Array.isArray(obj1)) {
if (obj1.length !== obj2.length)
return false;
return obj1.every((item, index) => deep_equal(item, obj2[index], visited));
}
if (typeof obj1 === "object") {
if (visited.has(obj1))
return visited.get(obj1) === obj2;
visited.set(obj1, obj2);
const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);
if (keys1.length !== keys2.length)
return false;
return keys1.every((key) => deep_equal(obj1[key], obj2[key], visited));
}
return obj1 === obj2;
}

var CollectionItem = class _CollectionItem {
/**
* Default properties for an instance of CollectionItem.
* Override in subclasses to define different defaults.
* @returns {Object}
*/
static get defaults() {
return {
data: {}
};
}
/**
* @param {Object} env - The environment/context.
* @param {Object|null} [data=null] - Initial data for the item.
*/
constructor(env, data = null) {
env.create_env_getter(this);
this.config = this.env?.config;
this.merge_defaults();
if (data)
deep_merge2(this.data, data);
if (!this.data.class_name)
this.data.class_name = this.constructor.name;
}
/**
* Loads an item from data and initializes it.
* @param {Object} env
* @param {Object} data
* @returns {CollectionItem}
*/
static load(env, data) {
const item = new this(env, data);
item.init();
return item;
}
/**
* Merge default properties from the entire inheritance chain.
* @private
*/
merge_defaults() {
let current_class = this.constructor;
while (current_class) {
for (let key in current_class.defaults) {
const default_val = current_class.defaults[key];
if (typeof default_val === "object") {
this[key] = { ...default_val, ...this[key] };
} else {
this[key] = this[key] === void 0 ? default_val : this[key];
}
}
current_class = Object.getPrototypeOf(current_class);
}
}
/**
* Generates or retrieves a unique key for the item.
* Key syntax supports:
* - `[i]` for sequences
* - `/` for super-sources (groups, directories, clusters)
* - `#` for sub-sources (blocks)
* @returns {string} The unique key
*/
get_key() {
return create_uid(this.data);
}
/**
* Updates the item data and returns true if changed.
* @param {Object} data
* @returns {boolean} True if data changed.
*/
update_data(data) {
const sanitized_data = this.sanitize_data(data);
const current_data = { ...this.data };
deep_merge2(current_data, sanitized_data);
const changed = !deep_equal(this.data, current_data);
if (!changed)
return false;
this.data = current_data;
return true;
}
/**
* Sanitizes data for saving. Ensures no circular references.
* @param {*} data
* @returns {*} Sanitized data.
*/
sanitize_data(data) {
if (data instanceof _CollectionItem)
return data.ref;
if (Array.isArray(data))
return data.map((val) => this.sanitize_data(val));
if (typeof data === "object" && data !== null) {
return Object.keys(data).reduce((acc, key) => {
acc[key] = this.sanitize_data(data[key]);
return acc;
}, {});
}
return data;
}
/**
* Initializes the item. Override as needed.
* @param {Object} [input_data] - Additional data that might be provided on creation.
*/
init(input_data) {
}
/**
* Queues this item for saving.
*/
queue_save() {
this._queue_save = true;
}
/**
* Saves this item using its data adapter.
* @returns {Promise<void>}
*/
async save() {
try {
await this.data_adapter.save_item(this);
this.init();
} catch (err) {
this._queue_save = true;
console.error(err, err.stack);
}
}
/**
* Queues this item for loading.
*/
queue_load() {
this._queue_load = true;
}
/**
* Loads this item using its data adapter.
* @returns {Promise<void>}
*/
async load() {
try {
await this.data_adapter.load_item(this);
this.init();
} catch (err) {
this._load_error = err;
this.on_load_error(err);
}
}
/**
* Handles load errors by re-queuing for load.
* Override if needed.
* @param {Error} err
*/
on_load_error(err) {
this.queue_load();
}
/**
* Validates the item before saving. Checks for presence and validity of key.
* @returns {boolean}
*/
validate_save() {
if (!this.key)
return false;
if (this.key.trim() === "")
return false;
if (this.key === "undefined")
return false;
return true;
}
/**
* Marks this item as deleted. This does not immediately remove it from memory,
* but queues a save that will result in the item being removed from persistent storage.
*/
delete() {
this.deleted = true;
this.queue_save();
}
/**
* Filters items in the collection based on provided options.
* functional filter (returns true or false) for filtering items in collection; called by collection class
* @param {Object} filter_opts - Filtering options.
* @param {string} [filter_opts.exclude_key] - A single key to exclude.
* @param {string[]} [filter_opts.exclude_keys] - An array of keys to exclude. If exclude_key is provided, it's added to this array.
* @param {string} [filter_opts.exclude_key_starts_with] - Exclude keys starting with this string.
* @param {string[]} [filter_opts.exclude_key_starts_with_any] - Exclude keys starting with any of these strings.
* @param {string} [filter_opts.exclude_key_includes] - Exclude keys that include this string.
* @param {string} [filter_opts.key_ends_with] - Include only keys ending with this string.
* @param {string} [filter_opts.key_starts_with] - Include only keys starting with this string.
* @param {string[]} [filter_opts.key_starts_with_any] - Include only keys starting with any of these strings.
* @param {string} [filter_opts.key_includes] - Include only keys that include this string.
* @returns {boolean} True if the item passes the filter, false otherwise.
*/
filter(filter_opts = {}) {
const {
exclude_key,
exclude_keys = exclude_key ? [exclude_key] : [],
exclude_key_starts_with,
exclude_key_starts_with_any,
exclude_key_includes,
exclude_key_includes_any,
key_ends_with,
key_starts_with,
key_starts_with_any,
key_includes,
key_includes_any
} = filter_opts;
if (exclude_keys?.includes(this.key))
return false;
if (exclude_key_starts_with && this.key.startsWith(exclude_key_starts_with))
return false;
if (exclude_key_starts_with_any && exclude_key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (exclude_key_includes && this.key.includes(exclude_key_includes))
return false;
if (exclude_key_includes_any && exclude_key_includes_any.some((include) => this.key.includes(include)))
return false;
if (key_ends_with && !this.key.endsWith(key_ends_with))
return false;
if (key_starts_with && !this.key.startsWith(key_starts_with))
return false;
if (key_starts_with_any && !key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (key_includes && !this.key.includes(key_includes))
return false;
if (key_includes_any && !key_includes_any.some((include) => this.key.includes(include)))
return false;
return true;
}
/**
* Parses item data for additional processing. Override as needed.
*/
parse() {
}
/**
* Helper function to render a component in the item scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
get actions() {
if (!this._actions) {
this._actions = Object.entries(this.env.opts.items[this.item_type_key].actions || {}).reduce((acc, [k, v]) => {
acc[k] = v.bind(this);
return acc;
}, {});
}
return this._actions;
}
/**
* Derives the collection key from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from(name);
}
/**
* @returns {string} The collection key for this item.
*/
get collection_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from(name);
}
/**
* Retrieves the parent collection from the environment.
* @returns {Collection}
*/
get collection() {
return this.env[this.collection_key];
}
/**
* @returns {string} The item's key.
*/
get key() {
return this.data?.key || this.get_key();
}
get item_type_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return camel_case_to_snake_case2(name);
}
/**
* A simple reference object for this item.
* @returns {{collection_key: string, key: string}}
*/
get ref() {
return { collection_key: this.collection_key, key: this.key };
}
/**
* @returns {Object} The data adapter for this item's collection.
*/
get data_adapter() {
return this.collection.data_adapter;
}
/**
* @returns {Object} The filesystem adapter.
*/
get data_fs() {
return this.collection.data_fs;
}
/**
* Access to collection-level settings.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key])
this.env.settings[this.collection_key] = {};
return this.env.settings[this.collection_key];
}
set settings(settings) {
this.env.settings[this.collection_key] = settings;
this.env.smart_settings.save();
}
/**
* Render this item into a container using the item's component.
* @deprecated 2024-12-02 Use explicit component pattern from environment
* @param {HTMLElement} container
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_item(container, opts = {}) {
const frag = await this.component.call(this.smart_view, this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* @deprecated use env.smart_view
* @returns {Object}
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Override in child classes to set the component for this item
* @deprecated 2024-12-02
* @returns {Function} The render function for this component
*/
get component() {
return item_component;
}
};
function camel_case_to_snake_case2(str) {
const result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, "").replace(/2$/, "");
return result;
}

var AsyncFunction = Object.getPrototypeOf(async function() {
}).constructor;
var Collection = class {
/**
* Constructs a new Collection instance.
*
* @param {Object} env - The environment context containing configurations and adapters.
* @param {Object} [opts={}] - Optional configuration.
* @param {string} [opts.collection_key] - Custom key to override default collection name.
* @param {string} [opts.data_dir] - Custom data directory path.
* @param {boolean} [opts.prevent_load_on_init] - Whether to prevent loading items on initialization.
*/
constructor(env, opts = {}) {
env.create_env_getter(this);
this.opts = opts;
if (opts.collection_key)
this.collection_key = opts.collection_key;
this.env[this.collection_key] = this;
this.config = this.env.config;
this.items = {};
this.loaded = null;
this._loading = false;
this.load_time_ms = null;
this.settings_container = null;
}
/**
* Initializes a new collection in the environment. Override in subclass if needed.
*
* @param {Object} env
* @param {Object} [opts={}]
* @returns {Promise<void>}
*/
static async init(env, opts = {}) {
env[this.collection_key] = new this(env, opts);
await env[this.collection_key].init();
env.collections[this.collection_key] = "init";
}
/**
* The unique collection key derived from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Instance-level init. Override in subclasses if necessary.
* @returns {Promise<void>}
*/
async init() {
}
/**
* Creates or updates an item in the collection.
* - If `data` includes a key that matches an existing item, that item is updated.
* - Otherwise, a new item is created.
* After updating or creating, the item is validated. If validation fails, the item is logged and returned without being saved.
* If validation succeeds for a new item, it is added to the collection and marked for saving.
*
* If the item’s `init()` method is async, a promise is returned that resolves once init completes.
*
* @param {Object} [data={}] - Data for creating/updating an item.
* @returns {Promise<Item>|Item} The created or updated item. May return a promise if `init()` is async.
*/
create_or_update(data = {}) {
const existing_item = this.find_by(data);
const item = existing_item ? existing_item : new this.item_type(this.env);
item._queue_save = !existing_item;
const data_changed = item.update_data(data);
if (!existing_item && !item.validate_save()) {
return item;
}
if (!existing_item) {
this.set(item);
}
if (existing_item && !data_changed)
return existing_item;
if (item.init instanceof AsyncFunction) {
return new Promise((resolve) => {
item.init(data).then(() => resolve(item));
});
}
item.init(data);
return item;
}
/**
* Finds an item by partial data match (first checks key). If `data.key` provided,
* returns the item with that key; otherwise attempts a match by merging data.
*
* @param {Object} data - Data to match against.
* @returns {Item|null}
*/
find_by(data) {
if (data.key)
return this.get(data.key);
const temp = new this.item_type(this.env);
const temp_data = JSON.parse(JSON.stringify(data, temp.sanitize_data(data)));
deep_merge2(temp.data, temp_data);
return temp.key ? this.get(temp.key) : null;
}
/**
* Filters items based on provided filter options or a custom function.
*
* @param {Object|Function} [filter_opts={}] - Filter options or a predicate function.
* @returns {Item[]} Array of filtered items.
*/
filter(filter_opts = {}) {
if (typeof filter_opts === "function") {
return Object.values(this.items).filter(filter_opts);
}
filter_opts = this.prepare_filter(filter_opts);
const results = [];
const { first_n } = filter_opts;
for (const item of Object.values(this.items)) {
if (first_n && results.length >= first_n)
break;
if (item.filter(filter_opts))
results.push(item);
}
return results;
}
/**
* Alias for `filter()`
* @param {Object|Function} filter_opts
* @returns {Item[]}
*/
list(filter_opts) {
return this.filter(filter_opts);
}
/**
* Prepares filter options. Can be overridden by subclasses to normalize filter options.
*
* @param {Object} filter_opts
* @returns {Object} Prepared filter options.
*/
prepare_filter(filter_opts) {
return filter_opts;
}
/**
* Retrieves an item by key.
* @param {string} key
* @returns {Item|undefined}
*/
get(key) {
return this.items[key];
}
/**
* Retrieves multiple items by an array of keys.
* @param {string[]} keys
* @returns {Item[]}
*/
get_many(keys = []) {
if (!Array.isArray(keys)) {
console.error("get_many called with non-array keys:", keys);
return [];
}
return keys.map((key) => this.get(key)).filter(Boolean);
}
/**
* Retrieves a random item from the collection, optionally filtered by options.
* @param {Object} [opts]
* @returns {Item|undefined}
*/
get_rand(opts = null) {
if (opts) {
const filtered = this.filter(opts);
return filtered[Math.floor(Math.random() * filtered.length)];
}
const keys = this.keys;
return this.items[keys[Math.floor(Math.random() * keys.length)]];
}
/**
* Adds or updates an item in the collection.
* @param {Item} item
*/
set(item) {
if (!item.key)
throw new Error("Item must have a key property");
this.items[item.key] = item;
}
/**
* Updates multiple items by their keys.
* @param {string[]} keys
* @param {Object} data
*/
update_many(keys = [], data = {}) {
this.get_many(keys).forEach((item) => item.update_data(data));
}
/**
* Clears all items from the collection.
*/
clear() {
this.items = {};
}
/**
* @returns {string} The collection key, can be overridden by opts.collection_key
*/
get collection_key() {
return this._collection_key ? this._collection_key : this.constructor.collection_key;
}
set collection_key(key) {
this._collection_key = key;
}
/**
* Lazily initializes and returns the data adapter instance for this collection.
* @returns {Object} The data adapter instance.
*/
get data_adapter() {
if (!this._data_adapter) {
const AdapterClass = this.get_adapter_class("data");
this._data_adapter = new AdapterClass(this);
}
return this._data_adapter;
}
get_adapter_class(type) {
const config = this.env.opts.collections?.[this.collection_key];
const adapter_key = type + "_adapter";
const adapter_module = config?.[adapter_key] ?? this.env.opts.collections?.smart_collections?.[adapter_key];
if (typeof adapter_module === "function")
return adapter_module;
if (typeof adapter_module?.collection === "function")
return adapter_module.collection;
throw new Error(`No '${type}' adapter class found for ${this.collection_key} or smart_collections`);
}
/**
* Data directory strategy for this collection. Defaults to 'multi'.
* @returns {string}
*/
get data_dir() {
return this.collection_key;
}
/**
* File system adapter from the environment.
* @returns {Object}
*/
get data_fs() {
return this.env.data_fs;
}
/**
* Derives the corresponding item class name based on this collection's class name.
* @returns {string}
*/
get item_class_name() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
if (name.endsWith("ies"))
return name.slice(0, -3) + "y";
else if (name.endsWith("s"))
return name.slice(0, -1);
return name + "Item";
}
/**
* Derives a readable item name from the item class name.
* @returns {string}
*/
get item_name() {
return this.item_class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Retrieves the item type (constructor) from the environment.
* @returns {Function} Item constructor.
*/
get item_type() {
if (this.opts.item_type)
return this.opts.item_type;
return this.env.item_types[this.item_class_name];
}
/**
* Returns an array of all keys in the collection.
* @returns {string[]}
*/
get keys() {
return Object.keys(this.items);
}
/**
* @deprecated use data_adapter instead (2024-09-14)
*/
get adapter() {
return this.data_adapter;
}
/**
* @method process_save_queue
* @description
* Saves items flagged for saving (_queue_save) back to AJSON or SQLite. This ensures persistent storage
* of any updates made since last load/import. This method also writes changes to disk (AJSON files or DB).
*/
async process_save_queue(opts = {}) {
if (opts.force) {
Object.values(this.items).forEach((item) => item._queue_save = true);
}
await this.data_adapter.process_save_queue(opts);
}
/**
* @alias process_save_queue
* @returns {Promise<void>}
*/
async save(opts = {}) {
await this.process_save_queue(opts);
}
/**
* @method process_load_queue
* @description
* Loads items that have been flagged for loading (_queue_load). This may involve
* reading from AJSON/SQLite or re-importing from markdown if needed.
* Called once initial environment is ready and collections are known.
*/
async process_load_queue() {
await this.data_adapter.process_load_queue();
}
/**
* Retrieves processed settings configuration.
* @returns {Object}
*/
get settings_config() {
return this.process_settings_config({});
}
/**
* Processes given settings config, adding prefixes and handling conditionals.
*
* @private
* @param {Object} _settings_config
* @param {string} [prefix='']
* @returns {Object}
*/
process_settings_config(_settings_config, prefix = "") {
const add_prefix = (key) => prefix && !key.includes(`${prefix}.`) ? `${prefix}.${key}` : key;
return Object.entries(_settings_config).reduce((acc, [key, val]) => {
let new_val = { ...val };
if (new_val.conditional) {
if (!new_val.conditional(this))
return acc;
delete new_val.conditional;
}
if (new_val.callback)
new_val.callback = add_prefix(new_val.callback);
if (new_val.btn_callback)
new_val.btn_callback = add_prefix(new_val.btn_callback);
if (new_val.options_callback)
new_val.options_callback = add_prefix(new_val.options_callback);
const new_key = add_prefix(this.process_setting_key(key));
acc[new_key] = new_val;
return acc;
}, {});
}
/**
* Processes an individual setting key. Override if needed.
* @param {string} key
* @returns {string}
*/
process_setting_key(key) {
return key;
}
/**
* Default settings for this collection. Override in subclasses as needed.
* @returns {Object}
*/
get default_settings() {
return {};
}
/**
* Current settings for the collection.
* Initializes with default settings if none exist.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key]) {
this.env.settings[this.collection_key] = this.default_settings;
}
return this.env.settings[this.collection_key];
}
/**
* @deprecated use env.smart_view instead
* @returns {Object} smart_view instance
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Renders the settings for the collection into a given container.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_settings(container = this.settings_container, opts = {}) {
return await this.render_collection_settings(container, opts);
}
/**
* Helper function to render collection settings.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_collection_settings(container = this.settings_container, opts = {}) {
if (container && (!this.settings_container || this.settings_container !== container)) {
this.settings_container = container;
} else if (!container) {
container = this.env.smart_view.create_doc_fragment("<div></div>");
}
container.innerHTML = `<div class="sc-loading">Loading ${this.collection_key} settings...</div>`;
const frag = await this.env.render_component("settings", this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* Unloads collection data from memory.
*/
unload() {
this.clear();
this.unloaded = true;
this.env.collections[this.collection_key] = null;
}
/**
* Runs load process for all items in the collection, triggering queue loads and rendering settings after done.
* @returns {Promise<void>}
*/
async run_data_load() {
this.loaded = null;
this.load_time_ms = null;
Object.values(this.items).forEach((item) => item.queue_load());
this.notices?.show("loading_collection", { collection_key: this.collection_key });
await this.process_load_queue();
this.notices?.remove("loading_collection");
this.notices?.show("done_loading_collection", { collection_key: this.collection_key });
this.render_settings();
}
/**
* Helper function to render a component in the collection scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
show_process_notice(process2, opts = {}) {
if (!this.debounce_process_notice)
this.debounce_process_notice = {};
this.debounce_process_notice[process2] = setTimeout(() => {
this.debounce_process_notice[process2] = null;
this.env.notices?.show(process2, { collection_key: this.collection_key, ...opts });
}, 1e3);
}
clear_process_notice(process2) {
if (this.debounce_process_notice?.[process2]) {
clearTimeout(this.debounce_process_notice[process2]);
this.debounce_process_notice[process2] = null;
} else {
this.env.notices?.remove(process2);
}
}
};

var EntitiesVectorAdapter = class {
/**
* @constructor
* @param {Object} collection - The collection (SmartEntities or derived class) instance.
*/
constructor(collection) {
this.collection = collection;
}
/**
* Find the nearest entities to the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score descending.
* @throws {Error} Not implemented by default.
*/
async nearest(vec, filter = {}) {
throw new Error("EntitiesVectorAdapter.nearest() not implemented");
}
/**
* Find the furthest entities from the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score ascending (furthest).
* @throws {Error} Not implemented by default.
*/
async furthest(vec, filter = {}) {
throw new Error("EntitiesVectorAdapter.furthest() not implemented");
}
/**
* Embed a batch of entities.
* @async
* @param {Object[]} entities - Array of entity instances to embed.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async embed_batch(entities) {
throw new Error("EntitiesVectorAdapter.embed_batch() not implemented");
}
/**
* Process a queue of entities waiting to be embedded.
* Typically, this will call embed_batch in batches and update entities.
* @async
* @param {Object[]} embed_queue - Array of entities to embed.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async process_embed_queue(embed_queue) {
throw new Error("EntitiesVectorAdapter.process_embed_queue() not implemented");
}
};
var EntityVectorAdapter = class {
/**
* @constructor
* @param {Object} item - The SmartEntity instance that this adapter is associated with.
*/
constructor(item) {
this.item = item;
}
/**
* Retrieve the current vector embedding for this entity.
* @async
* @returns {Promise<number[]|undefined>} The entity's vector or undefined if not set.
* @throws {Error} Not implemented by default.
*/
async get_vec() {
throw new Error("EntityVectorAdapter.get_vec() not implemented");
}
/**
* Store/update the vector embedding for this entity.
* @async
* @param {number[]} vec - The vector to set.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async set_vec(vec) {
throw new Error("EntityVectorAdapter.set_vec() not implemented");
}
/**
* Delete/remove the vector embedding for this entity.
* @async
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async delete_vec() {
throw new Error("EntityVectorAdapter.delete_vec() not implemented");
}
};

function cos_sim(vector1, vector2) {
if (vector1.length !== vector2.length) {
throw new Error("Vectors must have the same length");
}
let dot_product = 0;
let magnitude1 = 0;
let magnitude2 = 0;
const epsilon = 1e-8;
for (let i = 0; i < vector1.length; i++) {
dot_product += vector1[i] * vector2[i];
magnitude1 += vector1[i] * vector1[i];
magnitude2 += vector2[i] * vector2[i];
}
magnitude1 = Math.sqrt(magnitude1);
magnitude2 = Math.sqrt(magnitude2);
if (magnitude1 < epsilon || magnitude2 < epsilon) {
return 0;
}
return dot_product / (magnitude1 * magnitude2);
}

function results_acc(_acc, result, ct = 10) {
if (_acc.results.size < ct) {
_acc.results.add(result);
if (_acc.results.size === ct && _acc.min === Number.POSITIVE_INFINITY) {
let { minScore, minObj } = find_min(_acc.results);
_acc.min = minScore;
_acc.minResult = minObj;
}
} else if (result.score > _acc.min) {
_acc.results.add(result);
_acc.results.delete(_acc.minResult);
let { minScore, minObj } = find_min(_acc.results);
_acc.min = minScore;
_acc.minResult = minObj;
}
}
function furthest_acc(_acc, result, ct = 10) {
if (_acc.results.size < ct) {
_acc.results.add(result);
if (_acc.results.size === ct && _acc.max === Number.NEGATIVE_INFINITY) {
let { maxScore, maxObj } = find_max(_acc.results);
_acc.max = maxScore;
_acc.maxResult = maxObj;
}
} else if (result.score < _acc.max) {
_acc.results.add(result);
_acc.results.delete(_acc.maxResult);
let { maxScore, maxObj } = find_max(_acc.results);
_acc.max = maxScore;
_acc.maxResult = maxObj;
}
}
function find_min(results) {
let minScore = Number.POSITIVE_INFINITY;
let minObj = null;
for (const obj of results) {
if (obj.score < minScore) {
minScore = obj.score;
minObj = obj;
}
}
return { minScore, minObj };
}
function find_max(results) {
let maxScore = Number.NEGATIVE_INFINITY;
let maxObj = null;
for (const obj of results) {
if (obj.score > maxScore) {
maxScore = obj.score;
maxObj = obj;
}
}
return { maxScore, maxObj };
}

function sort_by_score(a, b) {
const epsilon = 1e-9;
const score_diff = a.score - b.score;
if (Math.abs(score_diff) < epsilon)
return 0;
return score_diff > 0 ? -1 : 1;
}
function sort_by_score_descending(a, b) {
return sort_by_score(a, b);
}
function sort_by_score_ascending(a, b) {
return sort_by_score(a, b) * -1;
}

var DefaultEntitiesVectorAdapter = class extends EntitiesVectorAdapter {
constructor(collection) {
super(collection);
this._is_processing_embed_queue = false;
this._reset_embed_queue_stats();
}
/**
* Find the nearest entities to the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score descending.
*/
async nearest(vec, filter = {}) {
if (!vec || !Array.isArray(vec)) {
throw new Error("Invalid vector input to nearest()");
}
const {
limit = 50
} = filter;
const nearest = this.collection.filter(filter).reduce((acc, item) => {
if (!item.vec)
return acc;
const result = { item, score: cos_sim(vec, item.vec) };
results_acc(acc, result, limit);
return acc;
}, { min: 0, results: /* @__PURE__ */ new Set() });
return Array.from(nearest.results).sort(sort_by_score_descending);
}
/**
* Find the furthest entities from the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score ascending (furthest).
*/
async furthest(vec, filter = {}) {
if (!vec || !Array.isArray(vec)) {
throw new Error("Invalid vector input to furthest()");
}
const {
limit = 50
} = filter;
const furthest = this.collection.filter(filter).reduce((acc, item) => {
if (!item.vec)
return acc;
const result = { item, score: cos_sim(vec, item.vec) };
furthest_acc(acc, result, limit);
return acc;
}, { max: 0, results: /* @__PURE__ */ new Set() });
return Array.from(furthest.results).sort(sort_by_score_ascending);
}
/**
* Embed a batch of entities.
* @async
* @param {Object[]} entities - Array of entity instances to embed.
* @returns {Promise<void>}
*/
async embed_batch(entities) {
if (!this.collection.embed_model) {
throw new Error("No embed_model found in collection for embedding");
}
await Promise.all(entities.map((e) => e.get_embed_input()));
const embeddings = await this.collection.embed_model.embed_batch(entities);
embeddings.forEach((emb, i) => {
const entity = entities[i];
entity.vec = emb.vec;
if (emb.tokens !== void 0)
entity.tokens = emb.tokens;
});
}
/**
* Process a queue of entities waiting to be embedded.
* Prevents multiple concurrent runs by using `_is_processing_embed_queue`.
* @async
* @returns {Promise<void>}
*/
async process_embed_queue() {
if (this._is_processing_embed_queue) {
console.log("process_embed_queue is already running, skipping concurrent call.");
return;
}
this._is_processing_embed_queue = true;
try {
const embed_queue = this.collection.embed_queue;
this._reset_embed_queue_stats();
if (this.collection.embed_model_key === "None") {
console.log(`Smart Connections: No active embedding model for ${this.collection.collection_key}, skipping embedding`);
return;
}
if (!this.collection.embed_model) {
console.log(`Smart Connections: No active embedding model for ${this.collection.collection_key}, skipping embedding`);
return;
}
const datetime_start = /* @__PURE__ */ new Date();
if (!embed_queue.length) {
console.log(`Smart Connections: No items in ${this.collection.collection_key} embed queue`);
return;
}
console.log(`Time spent getting embed queue: ${(/* @__PURE__ */ new Date()).getTime() - datetime_start.getTime()}ms`);
console.log(`Processing ${this.collection.collection_key} embed queue: ${embed_queue.length} items`);
for (let i = 0; i < embed_queue.length; i += this.collection.embed_model.batch_size) {
if (this.is_queue_halted) {
this.is_queue_halted = false;
break;
}
const batch = embed_queue.slice(i, i + this.collection.embed_model.batch_size);
await Promise.all(batch.map((item) => item.get_embed_input()));
try {
const start_time = Date.now();
await this.embed_batch(batch);
this.total_time += Date.now() - start_time;
} catch (e) {
if (e && e.message && e.message.includes("API key not set")) {
this.halt_embed_queue_processing(`API key not set for ${this.collection.embed_model_key}
Please set the API key in the settings.`);
}
console.error(e);
console.error(`Error processing ${this.collection.collection_key} embed queue: ` + JSON.stringify(e || {}, null, 2));
}
batch.forEach((item) => {
item.embed_hash = item.read_hash;
item._queue_save = true;
});
this.embedded_total += batch.length;
this.total_tokens += batch.reduce((acc, item) => acc + (item.tokens || 0), 0);
this._show_embed_progress_notice(embed_queue.length);
if (this.embedded_total - this.last_save_total > 1e3) {
this.last_save_total = this.embedded_total;
await this.collection.process_save_queue();
if (this.collection.block_collection) {
console.log(`Saving ${this.collection.block_collection.collection_key} block collection`);
await this.collection.block_collection.process_save_queue();
}
}
}
this._show_embed_completion_notice(embed_queue.length);
await this.collection.process_save_queue();
if (this.collection.block_collection) {
await this.collection.block_collection.process_save_queue();
}
} finally {
this._is_processing_embed_queue = false;
}
}
/**
* Displays the embedding progress notice.
* @private
* @returns {void}
*/
_show_embed_progress_notice(embed_queue_length) {
if (this.embedded_total - this.last_notice_embedded_total < 100)
return;
this.last_notice_embedded_total = this.embedded_total;
this.notices?.show("embedding_progress", {
progress: this.embedded_total,
total: embed_queue_length,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Displays the embedding completion notice.
* @private
* @returns {void}
*/
_show_embed_completion_notice() {
this.notices?.remove("embedding_progress");
this.notices?.show("embedding_complete", {
total_embeddings: this.embedded_total,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Halts the embed queue processing.
* @param {string|null} msg - Optional message.
*/
halt_embed_queue_processing(msg = null) {
this.is_queue_halted = true;
console.log("Embed queue processing halted");
this.notices?.remove("embedding_progress");
this.notices?.show("embedding_paused", {
progress: this.embedded_total,
total: this.collection._embed_queue.length,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Resumes the embed queue processing after a delay.
* @param {number} [delay=0] - The delay in milliseconds before resuming.
* @returns {void}
*/
resume_embed_queue_processing(delay = 0) {
console.log("resume_embed_queue_processing");
this.notices?.remove("embedding_paused");
setTimeout(() => {
this.embedded_total = 0;
this.process_embed_queue();
}, delay);
}
/**
* Calculates the number of tokens processed per second.
* @private
* @returns {number} Tokens per second.
*/
_calculate_embed_tokens_per_second() {
const elapsed_time = this.total_time / 1e3;
return Math.round(this.total_tokens / (elapsed_time || 1));
}
/**
* Resets the statistics related to embed queue processing.
* @private
* @returns {void}
*/
_reset_embed_queue_stats() {
this.collection._embed_queue = [];
this.embedded_total = 0;
this.is_queue_halted = false;
this.last_save_total = 0;
this.last_notice_embedded_total = 0;
this.total_tokens = 0;
this.total_time = 0;
}
get notices() {
return this.collection.notices;
}
};
var DefaultEntityVectorAdapter = class extends EntityVectorAdapter {
get data() {
return this.item.data;
}
/**
* Retrieve the current vector embedding for this entity.
* @async
* @returns {Promise<number[]|undefined>} The entity's vector or undefined if not set.
*/
async get_vec() {
return this.vec;
}
/**
* Store/update the vector embedding for this entity.
* @async
* @param {number[]} vec - The vector to set.
* @returns {Promise<void>}
*/
async set_vec(vec) {
this.vec = vec;
}
/**
* Delete/remove the vector embedding for this entity.
* @async
* @returns {Promise<void>}
*/
async delete_vec() {
if (this.item.data?.embeddings?.[this.item.embed_model_key]) {
delete this.item.data.embeddings[this.item.embed_model_key].vec;
}
}
get vec() {
return this.item.data?.embeddings?.[this.item.embed_model_key]?.vec;
}
set vec(vec) {
if (!this.item.data.embeddings) {
this.item.data.embeddings = {};
}
if (!this.item.data.embeddings[this.item.embed_model_key]) {
this.item.data.embeddings[this.item.embed_model_key] = {};
}
this.item.data.embeddings[this.item.embed_model_key].vec = vec;
}
};

async function render2(entity, opts = {}) {
let markdown;
if (should_render_embed(entity))
markdown = entity.embed_link;
else
markdown = process_for_rendering(await entity.read());
let frag;
if (entity.env.settings.smart_view_filter.render_markdown)
frag = await this.render_markdown(markdown, entity);
else
frag = this.create_doc_fragment(markdown);
return await post_process2.call(this, entity, frag, opts);
}
function process_for_rendering(content) {
if (content.includes("```dataview"))
content = content.replace(/```dataview/g, "```\\dataview");
if (content.includes("![["))
content = content.replace(/\!\[\[/g, "! [[");
return content;
}
async function post_process2(scope, frag, opts = {}) {
return frag;
}
function should_render_embed(entity) {
if (!entity)
return false;
if (entity.is_canvas || entity.is_excalidraw)
return true;
return false;
}

async function find_connections(params = {}) {
const filter_opts = this.prepare_find_connections_filter_opts(params);
const limit = params.filter?.limit || params.limit || this.env.settings.smart_view_filter?.results_limit || 10;
const cache_key = this.key + JSON.stringify(params);
if (!this.env.connections_cache)
this.env.connections_cache = {};
if (!this.env.connections_cache[cache_key]) {
const connections = (await this.nearest(filter_opts)).sort(sort_by_score).slice(0, limit);
this.connections_to_cache(cache_key, connections);
}
return this.connections_from_cache(cache_key);
}

var SmartEntity = class extends CollectionItem {
/**
* Creates an instance of SmartEntity.
* @constructor
* @param {Object} env - The environment instance.
* @param {Object} [opts={}] - Configuration options.
*/
constructor(env, opts = {}) {
super(env, opts);
this.entity_adapter = new DefaultEntityVectorAdapter(this);
}
/**
* Provides default values for a SmartEntity instance.
* @static
* @readonly
* @returns {Object} The default values.
*/
static get defaults() {
return {
data: {
path: null,
last_embed: {
hash: null
},
embeddings: {}
}
};
}
get vector_adapter() {
if (!this._vector_adapter) {
this._vector_adapter = new this.collection.opts.vector_adapter.item(this);
}
return this._vector_adapter;
}
/**
* Initializes the SmartEntity instance.
* Checks if the entity has a vector and if it matches the model dimensions.
* If not, it queues an embed.
* Removes embeddings for inactive models.
* @returns {void}
*/
init() {
super.init();
if (!this.vec) {
this.queue_embed();
} else if (this.vec.length !== this.embed_model.model_config.dims) {
this.vec = null;
this.queue_embed();
}
Object.entries(this.data.embeddings || {}).forEach(([model, embedding]) => {
if (model !== this.embed_model_key) {
this.data.embeddings[model] = null;
delete this.data.embeddings[model];
}
});
}
/**
* Queues the entity for embedding.
* @returns {void}
*/
queue_embed() {
this._queue_embed = true;
}
/**
* Finds the nearest entities to this entity.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Array<{item:Object, score:number}>} An array of result objects with score and item.
*/
async nearest(filter = {}) {
return await this.collection.nearest_to(this, filter);
}
/**
* Prepares the input for embedding.
* @async
* @param {string} [content=null] - Optional content to use instead of calling subsequent read()
* @returns {Promise<void>} Should be overridden in child classes.
*/
async get_embed_input(content = null) {
}
/**
* Retrieves the embed input, either from cache or by generating it.
* @readonly
* @returns {string|Promise<string>} The embed input string or a promise resolving to it.
*/
get embed_input() {
return this._embed_input ? this._embed_input : this.get_embed_input();
}
/**
* Prepares filter options for finding connections based on parameters.
* @param {Object} [params={}] - Parameters for finding connections.
* @returns {Object} The prepared filter options.
*/
prepare_find_connections_filter_opts(params = {}) {
const opts = {
...this.env.settings.smart_view_filter || {},
...params,
entity: this
};
if (opts.filter?.limit)
delete opts.filter.limit;
if (opts.limit)
delete opts.limit;
return opts;
}
/**
* Finds connections relevant to this entity based on provided parameters.
* @async
* @param {Object} [params={}] - Parameters for finding connections.
* @returns {Array<{item:Object, score:number}>} An array of result objects with score and item.
*/
async find_connections(params = {}) {
return await this.actions.find_connections(params);
}
/**
* Retrieves connections from the cache based on the cache key.
* @param {string} cache_key - The cache key.
* @returns {Array<{item:Object, score:number}>} The cached connections.
*/
connections_from_cache(cache_key) {
return this.env.connections_cache[cache_key];
}
/**
* Stores connections in the cache with the provided cache key.
* @param {string} cache_key - The cache key.
* @param {Array<{item:Object, score:number}>} connections - The connections to cache.
* @returns {void}
*/
connections_to_cache(cache_key, connections) {
this.env.connections_cache[cache_key] = connections;
}
get read_hash() {
return this.data.last_read?.hash;
}
set read_hash(hash) {
if (!this.data.last_read)
this.data.last_read = {};
this.data.last_read.hash = hash;
}
get embedding_data() {
if (!this.data.embeddings[this.embed_model_key]) {
this.data.embeddings[this.embed_model_key] = {};
}
return this.data.embeddings[this.embed_model_key];
}
get last_embed() {
if (!this.embedding_data.last_embed) {
this.embedding_data.last_embed = {};
if (this.data.last_embed) {
this.embedding_data.last_embed = this.data.last_embed;
delete this.data.last_embed;
this.queue_save();
}
}
return this.embedding_data.last_embed;
}
get embed_hash() {
return this.last_embed?.hash;
}
set embed_hash(hash) {
if (!this.embedding_data.last_embed)
this.embedding_data.last_embed = {};
this.embedding_data.last_embed.hash = hash;
}
/**
* Gets the embed link for the entity.
* @readonly
* @returns {string} The embed link.
*/
get embed_link() {
return `![[${this.path}]]`;
}
/**
* Gets the key of the embedding model.
* @readonly
* @returns {string} The embedding model key.
*/
get embed_model_key() {
return this.collection.embed_model_key;
}
/**
* Gets the name of the entity, formatted based on settings.
* @readonly
* @returns {string} The entity name.
*/
get name() {
return (!this.should_show_full_path ? this.path.split("/").pop() : this.path.split("/").join(" > ")).split("#").join(" > ").replace(".md", "");
}
/**
* Determines whether to show the full path of the entity.
* @readonly
* @returns {boolean} True if the full path should be shown, false otherwise.
*/
get should_show_full_path() {
return this.env.settings.smart_view_filter?.show_full_path;
}
/**
* @deprecated Use embed_model instead.
* @readonly
* @returns {Object} The smart embedding model.
*/
get smart_embed() {
return this.embed_model;
}
/**
* Gets the embedding model instance from the collection.
* @readonly
* @returns {Object} The embedding model instance.
*/
get embed_model() {
return this.collection.embed_model;
}
/**
* Determines if the entity should be embedded.
* @readonly
* @returns {boolean} True if no vector is set, false otherwise.
*/
get should_embed() {
return !this.vec && this.size > (this.settings?.min_chars || 300);
}
/**
* Sets the error for the embedding model.
* @param {string} error - The error message.
*/
set error(error) {
this.data.embeddings[this.embed_model_key].error = error;
}
/**
* Gets the number of tokens associated with the entity's embedding.
* @readonly
* @returns {number|undefined} The number of tokens, or undefined if not set.
*/
get tokens() {
return this.last_embed?.tokens;
}
/**
* Sets the number of tokens for the embedding.
* @param {number} tokens - The number of tokens.
*/
set tokens(tokens) {
this.last_embed.tokens = tokens;
}
/**
* Gets the vector representation from the entity adapter.
* @readonly
* @returns {Array<number>|undefined} The vector or undefined if not set.
*/
get vec() {
return this.entity_adapter.vec;
}
/**
* Sets the vector representation in the entity adapter.
* @param {Array<number>} vec - The vector to set.
*/
set vec(vec) {
this.entity_adapter.vec = vec;
this._queue_embed = false;
this._embed_input = null;
this.queue_save();
}
/**
* Removes all embeddings from the entity.
* @returns {void}
*/
remove_embeddings() {
this.data.embeddings = null;
this.queue_save();
}
/**
* Retrieves the key of the entity.
* @returns {string} The entity key.
*/
get_key() {
return this.data.key || this.data.path;
}
/**
* Retrieves the path of the entity.
* @readonly
* @returns {string|null} The entity path.
*/
get path() {
return this.data.path;
}
/**
* Gets the component responsible for rendering the entity.
* @readonly
* @returns {Function} The render function for the entity component.
*/
get component() {
return render2;
}
get is_unembedded() {
if (!this.vec)
return true;
if (!this.embed_hash || this.embed_hash !== this.read_hash)
return true;
return false;
}
get connections_component() {
if (!this._connections_component)
this._connections_component = this.components?.connections?.bind(this.smart_view);
return this._connections_component;
}
async render_connections(container, opts = {}) {
if (container)
container.innerHTML = "Loading connections...";
const frag = await this.env.render_component("connections", this, opts);
if (container) {
container.innerHTML = "";
container.appendChild(frag);
}
return frag;
}
};

var SmartEntities = class extends Collection {
/**
* Creates an instance of SmartEntities.
* @constructor
* @param {Object} env - The environment instance.
* @param {Object} opts - Configuration options.
*/
constructor(env, opts) {
super(env, opts);
this.entities_vector_adapter = new DefaultEntitiesVectorAdapter(this);
this.model_instance_id = null;
this._embed_queue = [];
}
/**
* Initializes the SmartEntities instance by loading embeddings.
* @async
* @returns {Promise<void>}
*/
async init() {
await super.init();
await this.load_smart_embed();
if (!this.embed_model) {
console.log(`SmartEmbed not loaded for **${this.collection_key}**. Continuing without embedding capabilities.`);
}
}
/**
* Loads the smart embedding model.
* @async
* @returns {Promise<void>}
*/
async load_smart_embed() {
if (this.embed_model_key === "None")
return;
if (!this.embed_model)
return;
if (this.embed_model.is_loading)
return console.log(`SmartEmbedModel already loading for ${this.embed_model_key}`);
if (this.embed_model.is_loaded)
return console.log(`SmartEmbedModel already loaded for ${this.embed_model_key}`);
try {
console.log(`Loading SmartEmbedModel in ${this.collection_key}, current state: ${this.embed_model.state}`);
await this.embed_model.load();
} catch (e) {
console.error(`Error loading SmartEmbedModel for ${this.embed_model.model_key}`);
console.error(e);
}
}
/**
* Unloads the smart embedding model.
* @async
* @returns {Promise<void>}
*/
async unload() {
if (typeof this.embed_model?.unload === "function") {
this.embed_model.unload();
}
super.unload();
}
/**
* Gets the key of the embedding model.
* @readonly
* @returns {string} The embedding model key.
*/
get embed_model_key() {
return this.embed_model?.model_key;
}
/**
* Gets or creates the container for smart embeddings in the DOM.
* @readonly
* @returns {HTMLElement|undefined} The container element or undefined if not available.
*/
get smart_embed_container() {
if (!this.model_instance_id)
return console.log("model_key not set");
const id = this.model_instance_id.replace(/[^a-zA-Z0-9]/g, "_");
if (!window.document)
return console.log("window.document not available");
if (window.document.querySelector(`#${id}`))
return window.document.querySelector(`#${id}`);
const container = window.document.createElement("div");
container.id = id;
window.document.body.appendChild(container);
return container;
}
/**
* @deprecated Use embed_model instead.
* @readonly
* @returns {Object} The smart embedding model.
*/
get smart_embed() {
return this.embed_model;
}
/**
* Gets the embedding model instance.
* @readonly
* @returns {Object|null} The embedding model instance or null if none.
*/
get embed_model() {
if (!this.env._embed_model && this.env.opts.modules.smart_embed_model?.class)
this.env._embed_model = new this.env.opts.modules.smart_embed_model.class({
settings: this.settings.embed_model,
adapters: this.env.opts.modules.smart_embed_model?.adapters,
re_render_settings: this.re_render_settings.bind(this),
reload_model: this.reload_embed_model.bind(this)
});
return this.env._embed_model;
}
set embed_model(embed_model) {
this.env._embed_model = embed_model;
}
reload_embed_model() {
console.log("reload_embed_model");
this.embed_model.unload();
this.env._embed_model = null;
}
re_render_settings() {
this.settings_container.innerHTML = "";
this.render_settings();
}
/**
* Finds the nearest entities to a given entity.
* @async
* @param {Object} entity - The reference entity.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async nearest_to(entity, filter = {}) {
return await this.nearest(entity.vec, filter);
}
/**
* Finds the nearest entities to a vector using the default adapter.
* @async
* @param {Array<number>} vec - The vector to compare against.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async nearest(vec, filter = {}) {
if (!vec) {
console.warn("nearest: no vec");
return [];
}
return await this.entities_vector_adapter.nearest(vec, filter);
}
/**
* Finds the furthest entities from a vector using the default adapter.
* @async
* @param {Array<number>} vec - The vector to compare against.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async furthest(vec, filter = {}) {
if (!vec)
return console.warn("furthest: no vec");
return await this.entities_vector_adapter.furthest(vec, filter);
}
/**
* Gets the file name based on collection key and embedding model key.
* @readonly
* @returns {string} The constructed file name.
*/
get file_name() {
return this.collection_key + "-" + this.embed_model_key.split("/").pop();
}
/**
* Calculates the relevance of an item based on the search filter.
* @param {Object} item - The item to calculate relevance for.
* @param {Object} search_filter - The search filter containing keywords.
* @returns {number} The relevance score:
*                   1 if any keyword is found in the item's path,
*                   0 otherwise (default relevance for keyword in content).
*/
calculate_relevance(item, search_filter) {
if (search_filter.keywords.some((keyword) => item.path?.includes(keyword)))
return 1;
return 0;
}
/**
* Prepares the filter options by incorporating entity-based filters.
* @param {Object} [opts={}] - The filter options.
* @param {Object} [opts.entity] - The entity to base the filters on.
* @param {string|string[]} [opts.exclude_filter] - Keys or prefixes to exclude.
* @param {string|string[]} [opts.include_filter] - Keys or prefixes to include.
* @param {boolean} [opts.exclude_inlinks] - Whether to exclude inlinks of the entity.
* @param {boolean} [opts.exclude_outlinks] - Whether to exclude outlinks of the entity.
* @returns {Object} The modified filter options.
*/
prepare_filter(opts = {}) {
const {
entity,
exclude_filter,
include_filter,
exclude_inlinks,
exclude_outlinks
} = opts;
if (entity) {
if (typeof opts.exclude_key_starts_with_any === "undefined")
opts.exclude_key_starts_with_any = [];
if (opts.exclude_key_starts_with) {
opts.exclude_key_starts_with_any = [
opts.exclude_key_starts_with
];
delete opts.exclude_key_starts_with;
}
opts.exclude_key_starts_with_any.push(entity.source_key || entity.key);
if (exclude_filter) {
if (!Array.isArray(opts.exclude_key_includes_any))
opts.exclude_key_includes_any = [];
if (typeof exclude_filter === "string")
opts.exclude_key_includes_any.push(exclude_filter);
else if (exclude_filter.includes(","))
opts.exclude_key_includes_any.push(...exclude_filter.split(","));
}
if (include_filter) {
if (!Array.isArray(opts.key_includes_any))
opts.key_includes_any = [];
if (typeof include_filter === "string")
opts.key_includes_any.push(include_filter);
else if (include_filter.includes(","))
opts.key_includes_any.push(...include_filter.split(","));
}
if (exclude_inlinks && entity?.inlinks?.length) {
if (!Array.isArray(opts.exclude_key_starts_with_any))
opts.exclude_key_starts_with_any = [];
opts.exclude_key_starts_with_any.push(...entity.inlinks);
}
if (exclude_outlinks && entity?.outlinks?.length) {
if (!Array.isArray(opts.exclude_key_starts_with_any))
opts.exclude_key_starts_with_any = [];
opts.exclude_key_starts_with_any.push(...entity.outlinks);
}
}
return opts;
}
/**
* Looks up entities based on hypothetical content.
* @async
* @param {Object} [params={}] - The parameters for the lookup.
* @param {Array<string>} [params.hypotheticals=[]] - The hypothetical content to lookup.
* @param {Object} [params.filter] - The filter to use for the lookup.
* @param {number} [params.k] - Deprecated: Use `filter.limit` instead.
* @returns {Promise<Array<Result>|Object>} The lookup results or an error object.
*/
async lookup(params = {}) {
const { hypotheticals = [] } = params;
if (!hypotheticals?.length)
return { error: "hypotheticals is required" };
if (!this.embed_model)
return { error: "Embedding search is not enabled." };
const hyp_vecs = await this.embed_model.embed_batch(hypotheticals.map((h) => ({ embed_input: h })));
const limit = params.filter?.limit || params.k || this.env.settings.lookup_k || 10;
if (params.filter?.limit)
delete params.filter.limit;
const filter = {
...this.env.chats?.current?.scope || {},
...params.filter || {}
};
const results = await hyp_vecs.reduce(async (acc_promise, embedding, i) => {
const acc = await acc_promise;
const results2 = await this.nearest(embedding.vec, filter);
results2.forEach((result) => {
if (!acc[result.item.path] || result.score > acc[result.item.path].score) {
acc[result.item.path] = {
key: result.item.key,
score: result.score,
item: result.item,
hypothetical_i: i
};
} else {
result.score = acc[result.item.path].score;
}
});
return acc;
}, Promise.resolve({}));
console.log(results);
const top_k = Object.values(results).sort(sort_by_score).slice(0, limit);
console.log(`Found and returned ${top_k.length} ${this.collection_key}.`);
return top_k;
}
/**
* Gets the configuration for settings.
* @readonly
* @returns {Object} The settings configuration.
*/
get settings_config() {
return settings_config;
}
async render_settings(container = this.settings_container, opts = {}) {
container = await this.render_collection_settings(container, opts);
const embed_model_settings_frag = await this.env.render_component("settings", this.embed_model, opts);
container.appendChild(embed_model_settings_frag);
return container;
}
/**
* Gets the notices from the environment.
* @readonly
* @returns {Object} The notices object.
*/
get notices() {
return this.env.smart_connections_plugin?.notices || this.env.main?.notices;
}
/**
* Gets the embed queue containing items to be embedded.
* @readonly
* @returns {Array<Object>} The embed queue.
*/
get embed_queue() {
if (!this._embed_queue?.length)
this._embed_queue = Object.values(this.items).filter((item) => item._queue_embed && item.should_embed);
return this._embed_queue;
}
/**
* Processes the embed queue by delegating to the default vector adapter.
* @async
* @returns {Promise<void>}
*/
async process_embed_queue() {
await this.entities_vector_adapter.process_embed_queue();
}
/**
* Handles changes to the embedding model by reinitializing and processing the load queue.
* @async
* @returns {Promise<void>}
*/
async embed_model_changed() {
await this.unload();
await this.init();
this.render_settings();
await this.process_load_queue();
}
get connections_filter_config() {
return connections_filter_config;
}
};
var settings_config = {
"min_chars": {
name: "Minimum length",
type: "number",
description: "Minimum length of entity to embed (in characters).",
placeholder: "Enter number ex. 300",
default: 300
}
};
var connections_filter_config = {
"smart_view_filter.show_full_path": {
"name": "Show full path",
"type": "toggle",
"description": "Show full path in view."
},
"smart_view_filter.render_markdown": {
"name": "Render markdown",
"type": "toggle",
"description": "Render markdown in results."
},
"smart_view_filter.results_limit": {
"name": "Results limit",
"type": "number",
"description": "Limit the number of results.",
"default": 20
},
"smart_view_filter.exclude_inlinks": {
"name": "Exclude inlinks (backlinks)",
"type": "toggle",
"description": "Exclude notes that link to the current note."
},
"smart_view_filter.exclude_outlinks": {
"name": "Exclude outlinks",
"type": "toggle",
"description": "Exclude links already in the current document."
},
"smart_view_filter.include_filter": {
"name": "Include filter",
"type": "text",
"description": "Require that result file path matches this value."
},
"smart_view_filter.exclude_filter": {
"name": "Exclude filter",
"type": "text",
"description": "Exclude results with file path that matches this value."
}
};

async function render3(source, opts = {}) {
let markdown;
if (should_render_embed(source))
markdown = source.embed_link;
else
markdown = process_for_rendering(await source.read());
let frag;
if (source.env.settings.smart_view_filter.render_markdown)
frag = await this.render_markdown(markdown, source);
else
frag = this.create_doc_fragment(`<span>${markdown}</span>`);
return await post_process2.call(this, source, frag, opts);
}

async function create_hash(text) {
if (text.length > 1e5)
text = text.substring(0, 1e5);
const msgUint8 = new TextEncoder().encode(text.trim());
const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
return hashHex;
}

async function find_connections2(params = {}) {
let connections;
if (this.block_collection.settings.embed_blocks && params.exclude_source_connections)
connections = [];
else
connections = await find_connections.call(this, params);
const filter_opts = this.prepare_find_connections_filter_opts(params);
const limit = params.filter?.limit || params.limit || this.env.settings.smart_view_filter?.results_limit || 20;
if (params.filter?.limit)
delete params.filter.limit;
if (params.limit)
delete params.limit;
if (!params.exclude_blocks_from_source_connections) {
const cache_key = this.key + JSON.stringify(params) + "_blocks";
if (!this.env.connections_cache)
this.env.connections_cache = {};
if (!this.env.connections_cache[cache_key]) {
const nearest = (await this.env.smart_blocks.nearest(this.vec, filter_opts)).sort(sort_by_score).slice(0, limit);
this.connections_to_cache(cache_key, nearest);
}
connections = [
...connections,
...this.connections_from_cache(cache_key)
].sort(sort_by_score).slice(0, limit);
}
return connections;
}

var SmartSource = class extends SmartEntity {
/**
* Provides default values for a SmartSource instance.
* @static
* @readonly
* @returns {Object} The default values.
*/
static get defaults() {
return {
data: {
last_read: {
hash: null,
mtime: 0
},
embeddings: {}
},
_embed_input: null,
_queue_load: true
};
}
/**
* Initializes the SmartSource instance by queuing an import if blocks are missing.
* @returns {void}
*/
init() {
super.init();
if (!this.data.blocks)
this.queue_import();
}
/**
* Queues the SmartSource for import.
* @returns {void}
*/
queue_import() {
this._queue_import = true;
}
/**
* Imports the SmartSource by checking for updates and parsing content.
* @async
* @returns {Promise<void>}
*/
async import() {
this._queue_import = false;
try {
await this.source_adapter.import();
} catch (err) {
if (err.code === "ENOENT") {
console.log(`Smart Connections: Deleting ${this.path} data because it no longer exists on disk`);
this.delete();
} else {
console.warn("Smart Connections: Error during import: re-queueing import", err);
this.queue_import();
}
}
}
async parse_content(content = null) {
if (this.block_collection && typeof this.block_collection.import_source === "function") {
await this.block_collection.import_source(this, content);
}
const parse_fns = this.env?.opts?.collections?.smart_sources?.content_parsers || [];
for (const fn of parse_fns) {
await fn(this, content);
}
if (this.data.last_import?.hash === this.data.last_read?.hash) {
if (this.data.blocks)
return;
}
}
/**
* Finds connections relevant to this SmartSource based on provided parameters.
* @async
* @param {Object} [params={}] - Parameters for finding connections.
* @param {boolean} [params.exclude_source_connections=false] - Whether to exclude source connections.
* @param {boolean} [params.exclude_blocks_from_source_connections=false] - Whether to exclude block connections from source connections.
* @returns {Array<SmartSource>} An array of relevant SmartSource entities.
*/
async find_connections(params = {}) {
return await this.actions.find_connections(params);
}
/**
* Prepares the embed input for the SmartSource by reading content and applying exclusions.
* @async
* @returns {Promise<string|false>} The embed input string or `false` if already embedded.
*/
async get_embed_input(content = null) {
if (typeof this._embed_input === "string" && this._embed_input.length)
return this._embed_input;
if (!content)
content = await this.read();
if (this.excluded_lines.length) {
const content_lines = content.split("\n");
this.excluded_lines.forEach((lines) => {
const { start, end } = lines;
for (let i = start; i <= end; i++) {
content_lines[i] = "";
}
});
content = content_lines.filter((line) => line.length).join("\n");
}
const breadcrumbs = this.path.split("/").join(" > ").replace(".md", "");
const max_tokens = this.collection.embed_model.model_config.max_tokens || 500;
this._embed_input = `${breadcrumbs}:
${content}`.substring(0, max_tokens * 4);
return this._embed_input;
}
/**
* Opens the SmartSource note in the SmartConnections plugin.
* @returns {void}
*/
open() {
this.env.smart_connections_plugin.open_note(this.path);
}
/**
* Retrieves the block associated with a specific line number.
* @param {number} line - The line number to search for.
* @returns {SmartBlock|null} The corresponding SmartBlock or `null` if not found.
*/
get_block_by_line(line) {
return Object.entries(this.data.blocks || {}).reduce((acc, [sub_key, range]) => {
if (acc)
return acc;
if (range[0] <= line && range[1] >= line) {
const block = this.block_collection.get(this.key + sub_key);
if (block?.vec)
return block;
}
return acc;
}, null);
}
/**
* Checks if the source file exists in the file system.
* @async
* @returns {Promise<boolean>} A promise that resolves to `true` if the file exists, `false` otherwise.
*/
async has_source_file() {
return await this.fs.exists(this.path);
}
/**
* FILTER/SEARCH METHODS
*/
/**
* Searches for keywords within the entity's data and content.
* @async
* @param {Object} search_filter - The search filter object.
* @param {string[]} search_filter.keywords - An array of keywords to search for.
* @param {string} [search_filter.type='any'] - The type of search to perform. 'any' counts all matching keywords, 'all' counts only if all keywords match.
* @returns {Promise<number>} A promise that resolves to the number of matching keywords.
*/
async search(search_filter = {}) {
const { keywords, type = "any", limit } = search_filter;
if (!keywords || !Array.isArray(keywords)) {
console.warn("Entity.search: keywords not set or is not an array");
return 0;
}
if (limit && this.collection.search_results_ct >= limit)
return 0;
const lowercased_keywords = keywords.map((keyword) => keyword.toLowerCase());
const content = await this.read();
const lowercased_content = content.toLowerCase();
const lowercased_path = this.path.toLowerCase();
const matching_keywords = lowercased_keywords.filter(
(keyword) => lowercased_path.includes(keyword) || lowercased_content.includes(keyword)
);
if (type === "all") {
return matching_keywords.length === lowercased_keywords.length ? matching_keywords.length : 0;
} else {
return matching_keywords.length;
}
}
/**
* ADAPTER METHODS
*/
/**
* Appends content to the end of the source file.
* @async
* @param {string} content - The content to append to the file.
* @returns {Promise<void>} A promise that resolves when the operation is complete.
*/
async append(content) {
await this.source_adapter.append(content);
await this.import();
}
/**
* Updates the entire content of the source file.
* @async
* @param {string} full_content - The new content to write to the file.
* @param {Object} [opts={}] - Additional options for the update.
* @returns {Promise<void>} A promise that resolves when the operation is complete.
*/
async update(full_content, opts = {}) {
try {
await this.source_adapter.update(full_content, opts);
await this.import();
} catch (error) {
console.error("Error during update:", error);
throw error;
}
}
/**
* Reads the entire content of the source file.
* @async
* @param {Object} [opts={}] - Additional options for reading.
* @returns {Promise<string>} A promise that resolves with the content of the file.
*/
async read(opts = {}) {
try {
const content = await this.source_adapter.read(opts);
return content;
} catch (error) {
console.error("Error during read:", error);
throw error;
}
}
/**
* Removes the source file from the file system and deletes the entity.
* This is different from `delete()` because it also removes the source file.
* @async
* @returns {Promise<void>} A promise that resolves when the operation is complete.
*/
async remove() {
try {
await this.source_adapter.remove();
} catch (error) {
console.error("Error during remove:", error);
throw error;
}
}
/**
* Moves the current source to a new location.
* Handles the destination as a string (new path) or entity (block or source).
*
* @async
* @param {string|Object|SmartEntity} entity_ref - The destination path or entity to move to.
* @throws {Error} If the entity reference is invalid.
* @returns {Promise<void>} A promise that resolves when the move operation is complete.
*/
async move_to(entity_ref) {
try {
await this.source_adapter.move_to(entity_ref);
} catch (error) {
console.error("error_during_move:", error);
throw error;
}
}
/**
* Merges the given content into the current source.
* Parses the content into blocks and either appends to existing blocks, replaces blocks, or replaces all content.
*
* @async
* @param {string} content - The content to merge into the current source.
* @param {Object} [opts={}] - Options object.
* @param {string} [opts.mode='append'] - The merge mode: 'append', 'replace_blocks', or 'replace_all'.
* @returns {Promise<void>}
*/
async merge(content, opts = {}) {
try {
await this.source_adapter.merge(content, opts);
await this.import();
} catch (error) {
console.error("Error during merge:", error);
throw error;
}
}
/**
* Handles errors during the load process.
* @param {Error} err - The error encountered during load.
* @returns {void}
*/
on_load_error(err) {
super.on_load_error(err);
if (err.code === "ENOENT") {
this._queue_load = false;
this.queue_import();
}
}
/**
* Retrieves the block collection associated with SmartSources.
* @readonly
* @returns {SmartBlocks} The block collection instance.
*/
get block_collection() {
return this.env.smart_blocks;
}
/**
* Retrieves the vector representations of all blocks within the SmartSource.
* @readonly
* @returns {Array<Array<number>>} An array of vectors.
*/
get block_vecs() {
return this.blocks.map((block) => block.vec).filter((vec) => vec);
}
/**
* Retrieves all blocks associated with the SmartSource.
* @readonly
* @returns {Array<SmartBlock>} An array of SmartBlock instances.
* @description
* Uses block refs (Fastest) to get blocks without iterating over all blocks
*/
get blocks() {
if (this.data.blocks)
return this.block_collection.get_many(Object.keys(this.data.blocks).map((key) => this.key + key));
return [];
}
/**
* Determines if the SmartSource is excluded from processing.
* @readonly
* @returns {boolean} `true` if excluded, `false` otherwise.
*/
get excluded() {
return this.fs.is_excluded(this.path);
}
/**
* Retrieves the lines excluded from embedding.
* @readonly
* @returns {Array<Object>} An array of objects with `start` and `end` line numbers.
*/
get excluded_lines() {
return this.blocks.filter((block) => block.excluded).map((block) => block.lines);
}
/**
* Retrieves the file system instance from the SmartSource's collection.
* @readonly
* @returns {SmartFS} The file system instance.
*/
get fs() {
return this.collection.fs;
}
/**
* Retrieves the file object associated with the SmartSource.
* @readonly
* @returns {Object} The file object.
*/
get file() {
return this.fs.files[this.path];
}
/**
* Retrieves the file name of the SmartSource.
* @readonly
* @returns {string} The file name.
*/
get file_name() {
return this.path.split("/").pop();
}
/**
* Retrieves the file path of the SmartSource.
* @readonly
* @returns {string} The file path.
*/
get file_path() {
return this.path;
}
/**
* Retrieves the file type based on the file extension.
* @readonly
* @returns {string} The file type in lowercase.
*/
get file_type() {
if (!this._ext) {
this._ext = this.collection.get_extension_for_path(this.path) || "md";
}
return this._ext;
}
/**
* Retrieves the modification time of the SmartSource.
* @readonly
* @returns {number} The modification time.
*/
get mtime() {
return this.file?.stat?.mtime || 0;
}
/**
* Retrieves the size of the SmartSource.
* @readonly
* @returns {number} The size.
*/
get size() {
return this.file?.stat?.size || 0;
}
/**
* Retrieves the last import stat of the SmartSource.
* @readonly
* @returns {Object} The last import stat.
*/
get last_import() {
return this.data?.last_import;
}
/**
* Retrieves the last import modification time of the SmartSource.
* @readonly
* @returns {number} The last import modification time.
*/
get last_import_mtime() {
return this.last_import?.mtime || 0;
}
/**
* Retrieves the last import size of the SmartSource.
* @readonly
* @returns {number} The last import size.
*/
get last_import_size() {
return this.last_import?.size || 0;
}
/**
* Retrieves the paths of inlinks to this SmartSource.
* @readonly
* @returns {Array<string>} An array of inlink paths.
*/
get inlinks() {
return Object.keys(this.collection.links?.[this.path] || {});
}
/**
* Determines if the SmartSource is a canvas file.
* @readonly
* @returns {boolean} `true` if the file is a canvas, `false` otherwise.
*/
get is_canvas() {
return this.path.endsWith("canvas");
}
/**
* Determines if the SmartSource is an Excalidraw file.
* @readonly
* @returns {boolean} `true` if the file is Excalidraw, `false` otherwise.
*/
get is_excalidraw() {
return this.path.endsWith("excalidraw.md");
}
/**
* Determines if the SmartSource is gone (i.e., the file no longer exists).
* @readonly
* @returns {boolean} `true` if gone, `false` otherwise.
*/
get is_gone() {
return !this.file;
}
/**
* Retrieves the last read hash of the SmartSource.
* @readonly
* @returns {string|undefined} The last read hash or `undefined` if not set.
*/
get last_read() {
return this.data.last_read;
}
get metadata() {
return this.data.metadata;
}
/**
* Retrieves the display name of the SmartSource.
* @readonly
* @returns {string} The display name.
*/
get name() {
if (this.should_show_full_path)
return this.path.split("/").join(" > ").replace(".md", "");
return this.path.split("/").pop().replace(".md", "");
}
get outdated() {
return this.source_adapter.outdated;
}
/**
* Retrieves the outlink paths from the SmartSource.
* @readonly
* @returns {Array<string>} An array of outlink paths.
*/
get outlinks() {
return (this.data.outlinks || []).map((link) => {
const link_ref = link?.target || link;
if (link_ref.startsWith("http"))
return null;
const link_path = this.fs.get_link_target_path(link_ref, this.file_path);
return link_path;
}).filter((link_path) => link_path);
}
get path() {
return this.data.path || this.data.key;
}
get should_embed() {
return !this.vec || !this.embed_hash || this.embed_hash !== this.read_hash;
}
get source_adapters() {
return this.collection.source_adapters;
}
get source_adapter() {
if (this._source_adapter)
return this._source_adapter;
if (this.source_adapters[this.file_type])
this._source_adapter = new this.source_adapters[this.file_type](this);
else {
console.log("No source adapter found for", this.file_type, this);
}
return this._source_adapter;
}
/**
* Retrieves the component responsible for rendering the SmartSource.
* @readonly
* @returns {Function} The render function for the source component.
*/
get component() {
return render3;
}
/**
* Calculates the mean vector of all blocks within the SmartSource.
* @readonly
* @returns {Array<number>|null} The mean vector or `null` if no vectors are present.
*/
get mean_block_vec() {
return this._mean_block_vec ? this._mean_block_vec : this._mean_block_vec = this.block_vecs.reduce((acc, vec) => acc.map((val, i) => val + vec[i]), Array(384).fill(0)).map((val) => val / this.block_vecs.length);
}
/**
* Calculates the median vector of all blocks within the SmartSource.
* @readonly
* @returns {Array<number>|null} The median vector or `null` if no vectors are present.
*/
get median_block_vec() {
if (this._median_block_vec)
return this._median_block_vec;
if (!this.block_vecs.length)
return null;
const vec_length = this.block_vecs[0].length;
this._median_block_vec = new Array(vec_length);
const mid = Math.floor(this.block_vecs.length / 2);
for (let i = 0; i < vec_length; i++) {
const values = this.block_vecs.map((vec) => vec[i]).sort((a, b) => a - b);
this._median_block_vec[i] = this.block_vecs.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}
return this._median_block_vec;
}
/**
* @async
* @deprecated Use `read` instead.
* @returns {Promise<string>} A promise that resolves with the content of the file.
*/
async _read() {
return await this.source_adapter._read();
}
/**
* @async
* @deprecated Use `remove` instead.
* @returns {Promise<void>} A promise that resolves when the entity is destroyed.
*/
async destroy() {
await this.remove();
}
/**
* @async
* @deprecated Use `update` instead.
* @param {string} content - The content to update.
* @returns {Promise<void>}
*/
async _update(content) {
await this.source_adapter.update(content);
}
/**
* @deprecated Use `source` instead.
* @readonly
* @returns {SmartSource} The associated SmartSource instance.
*/
get t_file() {
return this.fs.files[this.path];
}
};
var smart_source_default = {
class: SmartSource,
actions: {
find_connections: find_connections2
}
};

var SmartSources = class extends SmartEntities {
/**
* Creates an instance of SmartSources.
* @constructor
* @param {Object} env - The environment instance.
* @param {Object} [opts={}] - Configuration options.
*/
constructor(env, opts = {}) {
super(env, opts);
this.search_results_ct = 0;
this._excluded_headings = null;
}
/**
* Initializes the SmartSources instance by performing an initial scan of sources.
* @async
* @returns {Promise<void>}
*/
async init() {
await super.init();
await this.init_items();
}
/**
* Initializes items by letting each adapter do any necessary file-based scanning.
* Adapters that do not rely on file scanning can skip or do nothing.
* @async
* @returns {Promise<void>}
*/
async init_items() {
this.show_process_notice("initial_scan");
for (const AdapterClass of Object.values(this.source_adapters)) {
if (typeof AdapterClass.init_items === "function") {
await AdapterClass.init_items(this);
}
}
this.clear_process_notice("initial_scan");
this.notices?.show("done_initial_scan", { collection_key: this.collection_key });
}
/**
* Creates (or returns existing) a SmartSource for a given file path, if the extension is recognized.
* @param {string} file_path - The path to the file or pseudo-file
* @returns {SmartSource|undefined} The newly created or existing SmartSource, or undefined if no recognized extension
*/
init_file_path(file_path) {
const ext = this.get_extension_for_path(file_path);
if (!ext) {
return;
}
if (this.items[file_path])
return this.items[file_path];
const item = new this.item_type(this.env, { path: file_path });
this.items[file_path] = item;
item.queue_import();
item.queue_load();
return item;
}
/**
* Looks for an extension in descending order:
* e.g. split "my.file.name.github" -> ["my","file","name","github"]
* Try 'file.name.github', 'name.github', 'github'
* Return the first that is in 'source_adapters'
* @param {string} file_path
* @returns {string|undefined} recognized extension, or undefined if none
*/
get_extension_for_path(file_path) {
if (!file_path)
return void 0;
const pcs = file_path.split(".");
if (pcs.length < 2)
return void 0;
pcs.shift();
while (pcs.length) {
const test_ext = pcs.join(".").toLowerCase();
if (this.source_adapters[test_ext]) {
return test_ext;
}
pcs.shift();
}
return void 0;
}
/**
* Removes old data files by pruning sources and blocks.
* @async
* @returns {Promise<void>}
*/
async prune() {
await this.fs.refresh();
this.notices?.show("pruning_collection", { collection_key: this.collection_key });
const remove_sources = Object.values(this.items).filter((item) => {
if (item.is_gone) {
item.reason = "is_gone";
return true;
}
if (item.excluded) {
item.reason = "excluded";
return true;
}
if (!item.data.blocks) {
item.reason = "!data.blocks";
return true;
}
return false;
});
for (let i = 0; i < remove_sources.length; i++) {
const source = remove_sources[i];
console.log(source.reason);
}
this.notices?.remove("pruning sources");
this.notices?.show("done_pruning_collection", { collection_key: this.collection_key, count: remove_sources.length });
this.notices?.show("pruning_collection", { collection_key: this.block_collection.collection_key });
const remove_smart_blocks = Object.values(this.block_collection.items).filter((item) => {
if (!item.vec)
return false;
if (item.is_gone) {
item.reason = "is_gone";
return true;
}
if (!item.should_embed) {
item.reason = "!should_embed";
return true;
}
return false;
});
for (let i = 0; i < remove_smart_blocks.length; i++) {
const item = remove_smart_blocks[i];
if (item.is_gone)
item.delete();
else
item.remove_embeddings();
}
this.notices?.remove("pruning_collection");
this.notices?.show("done_pruning_collection", { collection_key: this.block_collection.collection_key, count: remove_smart_blocks.length });
console.log(`Pruned ${remove_smart_blocks.length} blocks:
${remove_smart_blocks.map((item) => `${item.reason} - ${item.key}`).join("\n")}`);
await this.process_save_queue(true);
Object.values(this.items).forEach((i) => i.queue_embed());
Object.values(this.block_collection.items).forEach((i) => i.queue_embed());
await this.process_embed_queue();
}
/**
* Builds a map of links between sources.
* @returns {Object} An object mapping link paths to source keys.
*/
build_links_map() {
const start_time = Date.now();
this.links = {};
for (const source of Object.values(this.items)) {
for (const link of source.outlinks) {
if (!this.links[link])
this.links[link] = {};
this.links[link][source.key] = true;
}
}
const end_time = Date.now();
console.log(`Time spent building links: ${end_time - start_time}ms`);
return this.links;
}
/**
* Creates a new source with the given key and content.
* @async
* @param {string} key - The key (path) of the new source.
* @param {string} content - The content to write to the new source.
* @returns {Promise<SmartSource>} The created SmartSource instance.
*/
async create(key, content) {
await this.fs.write(key, content);
await this.fs.refresh();
const source = await this.create_or_update({ path: key });
await source.import();
return source;
}
/**
* Performs a lexical search for matching SmartSource content.
* @async
* @param {Object} search_filter - The filter criteria for the search.
* @param {string[]} search_filter.keywords - An array of keywords to search for.
* @param {number} [search_filter.limit] - The maximum number of results to return.
* @returns {Promise<Array<SmartSource>>} A promise that resolves to an array of matching SmartSource entities.
*/
async search(search_filter = {}) {
const {
keywords,
limit,
...filter_opts
} = search_filter;
if (!keywords) {
console.warn("search_filter.keywords not set");
return [];
}
this.search_results_ct = 0;
const initial_results = this.filter(filter_opts);
const search_results = [];
for (let i = 0; i < initial_results.length; i += 10) {
const batch = initial_results.slice(i, i + 10);
const batch_results = await Promise.all(
batch.map(async (item) => {
try {
const matches = await item.search(search_filter);
if (matches) {
this.search_results_ct++;
return { item, score: matches };
} else
return null;
} catch (error) {
console.error(`Error searching item ${item.id || "unknown"}:`, error);
return null;
}
})
);
search_results.push(...batch_results.filter(Boolean));
}
return search_results.sort((a, b) => b.score - a.score).map((result) => result.item);
}
/**
* Looks up entities based on the provided parameters.
* @async
* @param {Object} [params={}] - Parameters for the lookup.
* @param {Object} [params.filter] - Filter options.
* @param {number} [params.k] - Deprecated. Use `params.filter.limit` instead.
* @returns {Promise<Array<SmartSource>>} A promise that resolves to an array of matching SmartSource entities.
*/
async lookup(params = {}) {
const limit = params.filter?.limit || params.k || this.env.settings.lookup_k || 10;
if (params.filter?.limit)
delete params.filter.limit;
let results = await super.lookup(params);
if (results.error) {
console.warn(results.error);
return [];
}
if (this.block_collection?.settings?.embed_blocks) {
results = [
...results,
...await this.block_collection.lookup(params)
].sort(sort_by_score);
}
console.log(results);
return results.slice(0, limit);
}
/**
* Processes the load queue by loading items and optionally importing them.
* Called after a "re-load" from settings, or after environment init.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
await super.process_load_queue();
if (this.collection_key === "smart_sources" && this.env.smart_blocks) {
Object.values(this.env.smart_blocks.items).forEach((item) => item.init());
}
if (this.block_collection) {
this.block_collection.loaded = Object.keys(this.block_collection.items).length;
}
if (!this.opts.prevent_import_on_load) {
await this.process_source_import_queue(this.opts);
}
this.build_links_map();
}
/**
* @method process_source_import_queue
* @description
* Imports items (SmartSources or SmartBlocks) that have been flagged for import.
*/
async process_source_import_queue(opts = {}) {
const { process_embed_queue = true } = opts;
const import_queue = Object.values(this.items).filter((item) => item._queue_import);
console.log("import_queue " + import_queue.length);
if (import_queue.length) {
const time_start = Date.now();
for (let i = 0; i < import_queue.length; i += 100) {
this.notices?.show("import_progress", {
progress: i,
total: import_queue.length
});
await Promise.all(import_queue.slice(i, i + 100).map((item) => item.import()));
}
setTimeout(() => {
this.notices?.remove("import_progress");
}, 1e3);
this.notices?.show("done_import", {
count: import_queue.length,
time_in_seconds: (Date.now() - time_start) / 1e3
});
} else {
this.notices?.show("no_import_queue");
}
this.build_links_map();
if (process_embed_queue)
await this.process_embed_queue();
else
console.log("skipping process_embed_queue");
await this.process_save_queue();
await this.block_collection?.process_save_queue();
}
/**
* Retrieves the source adapters based on the collection configuration.
* @readonly
* @returns {Object} An object mapping file extensions to adapter constructors.
*/
get source_adapters() {
if (!this._source_adapters) {
const source_adapters = Object.values(this.env.opts.collections?.[this.collection_key]?.source_adapters || {});
const _source_adapters = source_adapters.reduce((acc, adapter) => {
adapter.extensions?.forEach((ext) => acc[ext] = adapter);
return acc;
}, {});
if (Object.keys(_source_adapters).length) {
this._source_adapters = _source_adapters;
}
}
return this._source_adapters;
}
reset_source_adapters() {
this._source_adapters = null;
this.render_settings();
}
/**
* Retrieves the notices system from the environment.
* @readonly
* @returns {Object} The notices object.
*/
get notices() {
return this.env.smart_connections_plugin?.notices || this.env.main?.notices;
}
/**
* Retrieves the currently active note.
* @readonly
* @returns {SmartSource|null} The current SmartSource instance or null if none.
*/
get current_note() {
return this.get(this.env.smart_connections_plugin.app.workspace.getActiveFile().path);
}
/**
* Retrieves the file system instance, initializing it if necessary.
* @readonly
* @returns {SmartFS} The file system instance.
*/
get fs() {
if (!this._fs) {
this._fs = new this.env.opts.modules.smart_fs.class(this.env, {
adapter: this.env.opts.modules.smart_fs.adapter,
fs_path: this.env.opts.env_path || "",
exclude_patterns: this.excluded_patterns || []
});
}
return this._fs;
}
/**
* Retrieves the settings configuration by combining superclass settings and adapter-specific settings.
* @readonly
* @returns {Object} The settings configuration object.
*/
get settings_config() {
const _settings_config = {
"refresh_embeddings": {
"name": "Refresh embeddings",
"description": "Remove sources and blocks that are no longer needed. Attempt to embed all active items.",
"type": "button",
"callback": "run_prune",
"conditional": () => this.loaded && this.collection_key === "smart_sources"
},
"clear_all": {
"name": "Clear all",
"description": "Clear all data and reimport sources.",
"type": "button_with_confirm",
"callback": "run_clear_all",
"confirm": "Are you sure you want to clear all data and re-import?",
"conditional": () => this.loaded && this.collection_key === "smart_sources"
},
...super.settings_config,
"enable_image_adapter": {
"name": "Image Adapter",
"description": "Enable image processing.",
"type": "toggle",
"default": false,
"callback": "reset_source_adapters"
},
"enable_pdf_adapter": {
"name": "PDF Adapter",
"description": "Enable PDF processing.",
"type": "toggle",
"default": false,
"callback": "reset_source_adapters"
},
...this.process_settings_config(settings_config2),
...Object.entries(this.source_adapters).reduce((acc, [file_extension, adapter_constructor]) => {
if (acc[adapter_constructor])
return acc;
const item = this.items[Object.keys(this.items).find((i) => i.endsWith(file_extension))];
const adapter_instance = new adapter_constructor(item || new this.item_type(this.env, {}));
if (adapter_instance.settings_config) {
acc[adapter_constructor.name] = {
type: "html",
value: `<h4>${adapter_constructor.name} adapter</h4>`
};
acc = { ...acc, ...adapter_instance.settings_config };
}
return acc;
}, {})
};
if (!["png", "jpg", "jpeg"].some((ext) => this.env.opts.collections?.[this.collection_key]?.source_adapters?.[ext]))
delete _settings_config.enable_image_adapter;
if (!this.env.opts.collections?.[this.collection_key]?.source_adapters?.["pdf"])
delete _settings_config.enable_pdf_adapter;
return _settings_config;
}
/**
* Retrieves the block collection associated with SmartSources.
* @readonly
* @returns {SmartBlocks} The block collection instance.
*/
get block_collection() {
return this.env.smart_blocks;
}
/**
* Retrieves the embed queue containing items and their blocks to be embedded.
* @readonly
* @returns {Array<Object>} The embed queue.
*/
get embed_queue() {
if (!this._embed_queue.length) {
try {
const embed_blocks = this.block_collection.settings.embed_blocks;
this._embed_queue = Object.values(this.items).reduce((acc, item) => {
if (item._queue_embed && item.should_embed && item.is_unembedded)
acc.push(item);
if (embed_blocks)
item.blocks.forEach((block) => {
if (block._queue_embed && block.should_embed && block.is_unembedded)
acc.push(block);
});
return acc;
}, []);
} catch (e) {
console.error(`Error getting embed queue:`, e);
}
}
return this._embed_queue;
}
/**
* Runs the load process by invoking superclass methods and rendering settings.
* @async
* @returns {Promise<void>}
*/
async run_data_load() {
await super.run_data_load();
this.block_collection.render_settings();
this.render_settings();
}
/**
* Runs the import process by queuing imports for changed items and processing the import queue.
* @async
* @returns {Promise<void>}
*/
async run_re_import() {
const start_time = Date.now();
Object.values(this.items).forEach((item) => {
if (item.data.last_import?.at)
item.data.last_import.at = 0;
item.queue_import();
item.queue_embed();
item.blocks.forEach((block) => block.queue_embed());
});
await this.process_source_import_queue();
const end_time = Date.now();
console.log(`Time spent importing: ${end_time - start_time}ms`);
this.render_settings();
this.block_collection.render_settings();
}
/**
* Runs the prune process to clean up sources and blocks.
* @async
* @returns {Promise<void>}
*/
async run_prune() {
await this.prune();
await this.process_save_queue();
this.render_settings();
this.block_collection.render_settings();
}
/**
* Clears all data by removing sources and blocks, reinitializing the file system, and reimporting items.
* @async
* @returns {Promise<void>}
*/
async run_clear_all() {
this.notices?.show("clearing_all");
await this.data_fs.remove_dir(this.data_dir, true);
this.clear();
this.block_collection.clear();
this._fs = null;
await this.fs.init();
await this.init_items();
this._excluded_headings = null;
Object.values(this.items).forEach((item) => {
item.queue_import();
item.queue_embed();
item.loaded_at = Date.now() + 9999999999;
});
this.notices?.remove("clearing_all");
this.notices?.show("done_clearing_all");
await this.process_source_import_queue();
}
/**
* Retrieves patterns for excluding files/folders from processing.
* @readonly
* @returns {Array<string>}
*/
get excluded_patterns() {
return [
...this.file_exclusions?.map((file) => `${file}**`) || [],
...(this.folder_exclusions || []).map((folder) => `${folder}**`),
this.env.env_data_dir + "/**"
];
}
/**
* Retrieves the file exclusion patterns from settings.
* @readonly
* @returns {Array<string>} An array of file exclusion patterns.
*/
get file_exclusions() {
return this.env.settings?.file_exclusions?.length ? this.env.settings.file_exclusions.split(",").map((file) => file.trim()) : [];
}
/**
* Retrieves the folder exclusion patterns from settings.
* @readonly
* @returns {Array<string>} An array of folder exclusion patterns.
*/
get folder_exclusions() {
return this.env.settings?.folder_exclusions?.length ? this.env.settings.folder_exclusions.split(",").map((folder) => {
folder = folder.trim();
if (folder === "")
return false;
if (folder === "/")
return false;
if (!folder.endsWith("/"))
return folder + "/";
return folder;
}).filter(Boolean) : [];
}
/**
* Retrieves the excluded headings from settings.
* @readonly
* @returns {Array<string>} An array of excluded headings.
*/
get excluded_headings() {
if (!this._excluded_headings) {
this._excluded_headings = this.env.settings?.excluded_headings?.length ? this.env.settings.excluded_headings.split(",").map((heading) => heading.trim()) : [];
}
return this._excluded_headings;
}
/**
* Retrieves the count of included files that are not excluded.
* @readonly
* @returns {number} The number of included files.
*/
get included_files() {
const extensions = Object.keys(this.source_adapters);
return this.fs.file_paths.filter((file_path) => extensions.some((ext) => file_path.endsWith(ext)) && !this.fs.is_excluded(file_path)).length;
}
get excluded_file_paths() {
return this.env.fs.file_paths.filter((file_path) => this.fs.is_excluded(file_path));
}
/**
* Retrieves the total number of files, regardless of exclusion.
* @readonly
* @returns {number} The total number of files.
*/
get total_files() {
return this.fs.file_paths.filter((file) => file.endsWith(".md") || file.endsWith(".canvas")).length;
}
get data_dir() {
return "multi";
}
};
var settings_config2 = {
};

var CollectionDataAdapter = class {
/**
* @constructor
* @param {Object} collection - The collection instance that this adapter manages.
*/
constructor(collection) {
this.collection = collection;
this.env = collection.env;
}
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = ItemDataAdapter;
/**
* Optional factory method to create item adapters.
* If `this.item_adapter_class` is not null, it uses that; otherwise can be overridden by subclasses.
* @param {Object} item - The item to create an adapter for.
* @returns {ItemDataAdapter}
*/
create_item_adapter(item) {
if (!this.ItemDataAdapter) {
throw new Error("No item_adapter_class specified and create_item_adapter not overridden.");
}
return new this.ItemDataAdapter(item);
}
/**
* Load a single item by its key using an `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item(key) {
throw new Error("Not implemented");
}
/**
* Save a single item by its key using its associated `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to save.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save_item(key) {
throw new Error("Not implemented");
}
/**
* Delete a single item by its key. This may involve updating or removing its file,
* as handled by the `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to delete.
* @returns {Promise<void>} Resolves when the item is deleted.
*/
async delete_item(key) {
throw new Error("Not implemented");
}
/**
* Process any queued load operations. Typically orchestrates calling `load_item()`
* on items that have been flagged for loading.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
throw new Error("Not implemented");
}
/**
* Process any queued save operations. Typically orchestrates calling `save_item()`
* on items that have been flagged for saving.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
throw new Error("Not implemented");
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item_if_updated(item) {
const adapter = this.create_item_adapter(item);
await adapter.load_if_updated();
}
};
var ItemDataAdapter = class {
/**
* @constructor
* @param {Object} item - The collection item instance that this adapter manages.
*/
constructor(item) {
this.item = item;
}
/**
* Load the item's data from storage. May involve reading a file and parsing
* its contents, then updating `item.data`.
* @async
* @returns {Promise<void>} Resolves when the item is fully loaded.
*/
async load() {
throw new Error("Not implemented");
}
/**
* Save the item's data to storage. May involve writing to a file or appending
* lines in an append-only format.
* @async
* @param {string|null} [ajson=null] - An optional serialized representation of the item’s data.
*                                     If not provided, the adapter should derive it from the item.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save(ajson = null) {
throw new Error("Not implemented");
}
/**
* Delete the item's data from storage. May involve removing a file or writing
* a `null` entry in an append-only file to signify deletion.
* @async
* @returns {Promise<void>} Resolves when the item’s data is deleted.
*/
async delete() {
throw new Error("Not implemented");
}
/**
* Returns the file path or unique identifier used by this adapter to locate and store
* the item's data. This may be a file name derived from the item's key.
* @returns {string} The path or identifier for the item's data.
*/
get data_path() {
throw new Error("Not implemented");
}
/**
* @returns {CollectionDataAdapter} The collection data adapter that this item data adapter belongs to.
*/
get collection_adapter() {
return this.item.collection.data_adapter;
}
get env() {
return this.item.env;
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_if_updated() {
throw new Error("Not implemented");
}
};

var FileCollectionDataAdapter = class extends CollectionDataAdapter {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = FileItemDataAdapter;
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.collection.data_fs || this.collection.env.data_fs;
}
};
var FileItemDataAdapter = class extends ItemDataAdapter {
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.item.collection.data_fs || this.item.collection.env.data_fs;
}
get data_path() {
throw new Error("Not implemented");
}
async load_if_updated() {
const data_path = this.data_path;
if (await this.fs.exists(data_path)) {
const loaded_at = this.item.loaded_at || 0;
const data_file_stat = await this.fs.stat(data_path);
if (data_file_stat.mtime > loaded_at + 1 * 60 * 1e3) {
console.log(`Smart Collections: Re-loading item ${this.item.key} because it has been updated on disk`);
await this.load();
}
}
}
};

var class_to_collection_key = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
var AjsonMultiFileCollectionDataAdapter = class extends FileCollectionDataAdapter {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = AjsonMultiFileItemDataAdapter;
/**
* Load a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async load_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.load();
}
/**
* Save a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async save_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.save();
}
/**
* Process any queued load operations.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const load_queue = Object.values(this.collection.items).filter((item) => item._queue_load);
if (!load_queue.length) {
this.collection.clear_process_notice("loading_collection");
return;
}
console.log(`Loading ${this.collection.collection_key}: ${load_queue.length} items`);
const batch_size = 100;
for (let i = 0; i < load_queue.length; i += batch_size) {
const batch = load_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.load().catch((err) => {
console.warn(`Error loading item ${item.key}`, err);
item.queue_load();
});
}));
}
console.log(`Loaded ${this.collection.collection_key} in ${this.collection.load_time_ms}ms`);
this.collection.loaded = load_queue.length;
this.collection.clear_process_notice("loading_collection");
}
/**
* Process any queued save operations.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
console.log(`Saving ${this.collection.collection_key}: ${save_queue.length} items`);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
get_item_data_path(key) {
return [
this.collection.data_dir || "multi",
this.fs?.sep || "/",
this.get_data_file_name(key) + ".ajson"
].join("");
}
/**
* Transforms the item key into a safe filename.
* Replaces spaces, slashes, and dots with underscores.
* @returns {string} safe file name
*/
get_data_file_name(key) {
return key.split("#")[0].replace(/[\s\/\.]/g, "_").replace(".md", "");
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson(item) {
const collection_key = item.collection_key;
const key = item.key;
const data_value = item.deleted ? "null" : JSON.stringify(item.data);
return `${JSON.stringify(`${collection_key}:${key}`)}: ${data_value},`;
}
};
var AjsonMultiFileItemDataAdapter = class extends FileItemDataAdapter {
/**
* Derives the `.ajson` file path from the collection's data_dir and item key.
* @returns {string}
*/
get data_path() {
return this.collection_adapter.get_item_data_path(this.item.key);
}
/**
* Load the item from its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async load() {
try {
const raw_data = await this.fs.adapter.read(this.data_path, "utf-8", { no_cache: true });
if (!raw_data) {
this.item.queue_import();
return;
}
const { rewrite, file_data } = this._parse(raw_data);
if (rewrite) {
if (file_data.length)
await this.fs.write(this.data_path, file_data);
else
await this.fs.remove(this.data_path);
}
const last_import_mtime = this.item.data.last_import?.at || 0;
if (last_import_mtime && this.item.init_file_mtime > last_import_mtime) {
this.item.queue_import();
}
} catch (e) {
this.item.queue_import();
}
}
/**
* Parse the entire AJSON content as a JSON object, handle legacy keys, and extract final state.
* @private
* @param {string} ajson
* @returns {boolean}
*/
_parse(ajson) {
try {
let rewrite = false;
if (!ajson.length)
return false;
ajson = ajson.trim();
const original_line_count = ajson.split("\n").length;
const json_str = "{" + ajson.slice(0, -1) + "}";
const data = JSON.parse(json_str);
const entries = Object.entries(data);
for (let i = 0; i < entries.length; i++) {
const [ajson_key, value] = entries[i];
if (!value) {
delete data[ajson_key];
rewrite = true;
continue;
}
const { collection_key, item_key, changed } = this._parse_ajson_key(ajson_key);
if (changed) {
rewrite = true;
data[collection_key + ":" + item_key] = value;
delete data[ajson_key];
}
const collection = this.env[collection_key];
if (!collection)
continue;
const existing_item = collection.get(item_key);
if (!value.key)
value.key = item_key;
if (existing_item) {
existing_item.data = value;
existing_item._queue_load = false;
existing_item.loaded_at = Date.now();
} else {
const ItemClass = collection.item_type;
const new_item = new ItemClass(this.env, value);
new_item._queue_load = false;
new_item.loaded_at = Date.now();
collection.set(new_item);
}
}
if (rewrite || original_line_count > entries.length) {
rewrite = true;
}
return {
rewrite,
file_data: rewrite ? Object.entries(data).map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)},`).join("\n") : null
};
} catch (e) {
if (ajson.split("\n").some((line) => !line.endsWith(","))) {
console.warn("fixing trailing comma error");
ajson = ajson.split("\n").map((line) => line.endsWith(",") ? line : line + ",").join("\n");
return this._parse(ajson);
}
console.warn("Error parsing JSON:", e);
return { rewrite: true, file_data: null };
}
}
_parse_ajson_key(ajson_key) {
let changed;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key[collection_key]) {
collection_key = class_to_collection_key[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
/**
* Save the current state of the item by appending a new line to its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async save(retries = 0) {
try {
const ajson_line = this.get_item_ajson();
await this.fs.append(this.data_path, "\n" + ajson_line);
this.item._queue_save = false;
} catch (e) {
if (e.code === "ENOENT" && retries < 1) {
console.warn("ENOENT, creating directory", this.data_path);
const dir = this.collection_adapter.collection.data_dir;
if (!await this.fs.exists(dir)) {
await this.fs.mkdir(dir);
}
return await this.save(retries + 1);
}
console.warn("Error saving item", this.data_path, e);
}
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson() {
return this.collection_adapter.get_item_ajson(this.item);
}
};

var AjsonMultiFileSourcesDataAdapter = class extends AjsonMultiFileCollectionDataAdapter {
ItemDataAdapter = AjsonMultiFileSourceDataAdapter;
};
var AjsonMultiFileSourceDataAdapter = class extends AjsonMultiFileItemDataAdapter {
};

var SourceContentAdapter = class {
constructor(item) {
this.item = item;
}
async import() {
this.throw_not_implemented("import");
}
async create() {
this.throw_not_implemented("create");
}
async update() {
this.throw_not_implemented("update");
}
async read() {
this.throw_not_implemented("read");
}
async remove() {
this.throw_not_implemented("remove");
}
get data() {
return this.item.data;
}
async create_hash(content) {
return await create_hash(content);
}
get settings() {
return this.item.env.settings.smart_sources[this.adapter_key];
}
get adapter_key() {
return to_snake(this.constructor.name);
}
static get adapter_key() {
return to_snake(this.name);
}
get fs() {
return this.item.collection.fs;
}
};
function to_snake(str) {
return str[0].toLowerCase() + str.slice(1).replace(/([A-Z])/g, "_$1").toLowerCase();
}

function parse_markdown_blocks(markdown, opts = {}) {
const { start_index = 1, line_keys = false } = opts;
const lines = markdown.split("\n");
const result = {};
const heading_stack = [];
const heading_lines = {};
const heading_counts = {};
const sub_block_counts = {};
const subheading_counts = {};
let current_list_item = null;
let current_content_block = null;
let in_frontmatter = false;
let frontmatter_started = false;
const root_heading_key = "#";
let in_code_block = false;
sub_block_counts[root_heading_key] = 0;
for (let i = 0; i < lines.length; i++) {
const line_number = i + start_index;
const line = lines[i];
const trimmed_line = line.trim();
if (trimmed_line === "---") {
if (!frontmatter_started) {
frontmatter_started = true;
in_frontmatter = true;
heading_lines["#---frontmatter---"] = [line_number, null];
continue;
} else if (in_frontmatter) {
in_frontmatter = false;
heading_lines["#---frontmatter---"][1] = line_number;
continue;
}
}
if (in_frontmatter) {
continue;
}
if (trimmed_line.startsWith("```")) {
in_code_block = !in_code_block;
if (!current_content_block) {
const parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (parent_key === root_heading_key) {
current_content_block = { key: root_heading_key, start_line: line_number };
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
continue;
}
const heading_match = trimmed_line.match(/^(#{1,6})\s*(.+)$/);
if (heading_match && !in_code_block) {
const level = heading_match[1].length;
let title = heading_match[2].trim();
while (heading_stack.length > 0 && heading_stack[heading_stack.length - 1].level >= level) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = line_number - 1;
}
}
if (heading_stack.length === 0 && heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = line_number - 1;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = "";
let parent_level = 0;
if (heading_stack.length > 0) {
parent_key = heading_stack[heading_stack.length - 1].key;
parent_level = heading_stack[heading_stack.length - 1].level;
} else {
parent_key = "";
parent_level = 0;
}
if (heading_stack.length === 0) {
heading_counts[title] = (heading_counts[title] || 0) + 1;
if (heading_counts[title] > 1) {
title += `[${heading_counts[title]}]`;
}
} else {
if (!subheading_counts[parent_key]) {
subheading_counts[parent_key] = {};
}
subheading_counts[parent_key][title] = (subheading_counts[parent_key][title] || 0) + 1;
const count = subheading_counts[parent_key][title];
if (count > 1) {
title += `#{${count}}`;
}
}
const level_diff = level - parent_level;
const hashes = "#".repeat(level_diff);
const key = parent_key + hashes + title;
heading_lines[key] = [line_number, null];
sub_block_counts[key] = 0;
heading_stack.push({ level, title, key });
continue;
}
const list_match = line.match(/^(\s*)([-*]|\d+\.) (.+)$/);
if (list_match && !in_code_block) {
const indentation = list_match[1].length;
if (indentation === 0) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
if (current_content_block && current_content_block.key !== root_heading_key) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
let key;
if (line_keys) {
const words = get_longest_words_in_order(list_match[3], 10);
key = `${parent_key}#${words}`;
} else {
key = `${parent_key}#{${n}}`;
}
heading_lines[key] = [line_number, null];
current_list_item = { key, start_line: line_number };
continue;
}
if (current_list_item) {
continue;
}
}
if (trimmed_line === "") {
continue;
}
if (!current_content_block) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key) {
if (!heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
current_content_block = { key: root_heading_key, start_line: line_number };
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
}
const total_lines = lines.length;
while (heading_stack.length > 0) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = total_lines + start_index - 1;
}
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = total_lines + start_index - 1;
}
current_list_item = null;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = total_lines + start_index - 1;
}
current_content_block = null;
}
if (heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = total_lines + start_index - 1;
}
for (const key in heading_lines) {
result[key] = heading_lines[key];
}
return result;
}
function get_longest_words_in_order(line, n = 3) {
const words = line.split(/\s+/).sort((a, b) => b.length - a.length).slice(0, n);
return words.sort((a, b) => line.indexOf(a) - line.indexOf(b)).join(" ");
}

var FileSourceContentAdapter = class extends SourceContentAdapter {
static async init_items(collection) {
if (collection.fs_items_initialized)
return;
collection._fs = null;
await collection.fs.init();
for (const file of Object.values(collection.fs.files)) {
const item = collection.init_file_path(file.path);
if (item)
item.init_file_mtime = file.stat.mtime;
}
collection.fs_items_initialized = Date.now();
}
/**
* @name fs
* @type {Object}
* @readonly
* @description
* Access the file system interface used by this adapter. Typically derived
* from `this.item.collection.fs`.
*/
get fs() {
return this.item.collection.fs;
}
/**
* @name file_path
* @type {string}
* @readonly
* @description
* The file path on disk corresponding to the source. Used for read/write operations.
*/
get file_path() {
return this.item.file_path;
}
/**
* @async
* @method create
* @param {string|null} [content=null] Initial content for the new file.
* @description
* Create a new file on disk. If content is not provided, attempts to use
* `this.item.data.content` as fallback.
*/
async create(content = null) {
if (!content)
content = this.item.data.content || "";
await this.fs.write(this.file_path, content);
}
/**
* @async
* @method update
* @param {string} content The full new content to write to the file.
* @description
* Overwrite the entire file content on disk.
*/
async update(content) {
await this.fs.write(this.file_path, content);
}
/**
* @async
* @method read
* @returns {Promise<string>} The content of the file.
* @description
* Read the file content from disk. Updates `last_read` hash and timestamp on the entity’s data.
* If file is large or special handling is needed, override this method.
*/
async read() {
const content = await this.fs.read(this.file_path);
this.data.last_read = {
hash: await this.create_hash(content || ""),
at: Date.now()
};
return content;
}
/**
* @async
* @method remove
* @returns {Promise<void>}
* @description
* Delete the file from disk. After removal, the source item should also be deleted or updated accordingly.
*/
async remove() {
await this.fs.remove(this.file_path);
}
/**
* TRANSFERRED FROM markdown.js (2024-12-13)
* TODO NEEDS REVIEW/REFACTOR
*/
async move_to(entity_ref) {
const new_path = typeof entity_ref === "string" ? entity_ref : entity_ref.key;
if (!new_path) {
throw new Error("Invalid entity reference for move_to operation");
}
const current_content = await this.read();
const [target_source_key, ...headings] = new_path.split("#");
const target_source = this.item.collection.get(target_source_key);
if (headings.length > 0) {
const new_headings_content = this.construct_headings(headings);
const new_content = `${new_headings_content}
${current_content}`;
await this._update(new_content);
}
if (target_source) {
await this.merge(current_content, { mode: "append_blocks" });
} else {
await this.rename_and_import(target_source_key, current_content);
}
if (this.item.key !== target_source_key)
await this.remove();
}
construct_headings(headings) {
return headings.map((heading, i) => `${"#".repeat(i + 1)} ${heading}`).join("\n");
}
async rename_and_import(target_source_key, content) {
await this.fs.rename(this.file_path, target_source_key);
const new_source = await this.item.collection.create_or_update({ path: target_source_key, content });
await new_source.import();
}
/**
* Merge content into the source
* @param {string} content - The content to merge into the source
* @param {Object} opts - Options for the merge operation
* @param {string} opts.mode - The mode to use for the merge operation. Defaults to 'append_blocks' (may also be 'replace_blocks')
*/
async merge(content, opts = {}) {
const { mode = "append_blocks" } = opts;
const blocks_obj = parse_markdown_blocks(content);
if (typeof blocks_obj !== "object" || Array.isArray(blocks_obj)) {
console.warn("merge error: Expected an object from parse_markdown_blocks, but received:", blocks_obj);
throw new Error("merge error: parse_markdown_blocks did not return an object as expected.");
}
const { new_blocks, new_with_parent_blocks, changed_blocks, same_blocks } = await this.get_changes(blocks_obj, content);
for (const block of new_blocks) {
await this.append(block.content);
}
for (const block of new_with_parent_blocks) {
const parent_block = this.item.block_collection.get(block.parent_key);
await parent_block.append(block.content);
}
for (const block of changed_blocks) {
const changed_block = this.item.block_collection.get(block.key);
if (mode === "replace_blocks") {
await changed_block.update(block.content);
} else {
await changed_block.append(block.content);
}
}
}
async get_changes(blocks_obj, content) {
const new_blocks = [];
const new_with_parent_blocks = [];
const changed_blocks = [];
const same_blocks = [];
const existing_blocks = this.source.data.blocks || {};
for (const [sub_key, line_range] of Object.entries(blocks_obj)) {
const has_existing = !!existing_blocks[sub_key];
const block_key = `${this.source.key}${sub_key}`;
const block_content = get_line_range(content, line_range[0], line_range[1]);
if (!has_existing) {
new_blocks.push({
key: block_key,
state: "new",
content: block_content
});
continue;
}
let has_parent;
let headings = sub_key.split("#");
let parent_key;
while (!has_parent && headings.length > 0) {
headings.pop();
parent_key = headings.join("#");
has_parent = !!existing_blocks[parent_key];
}
if (has_parent) {
new_with_parent_blocks.push({
key: block_key,
parent_key: `${this.source.key}${parent_key}`,
state: "new",
content: block_content
});
continue;
}
const block = this.item.block_collection.get(block_key);
const content_hash = await this.create_hash(block_content);
if (content_hash !== block.last_read?.hash) {
changed_blocks.push({
key: block_key,
state: "changed",
content: block_content
});
continue;
}
same_blocks.push({
key: block_key,
state: "same",
content: block_content
});
}
return {
new_blocks,
new_with_parent_blocks,
changed_blocks,
same_blocks
};
}
/**
* Append new content to the source file, placing it at the end of the file.
* @async
* @param {string} content - The content to append.
* @returns {Promise<void>}
*/
async append(content) {
const current_content = await this.read();
const new_content = [
current_content,
"",
content
].join("\n").trim();
await this.update(new_content);
}
};

function get_markdown_links(content) {
const markdown_link_pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
const wikilink_pattern = /\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]/g;
const result = [];
const extract_links_from_pattern = (pattern, type) => {
let match;
while ((match = pattern.exec(content)) !== null) {
const title = type === "markdown" ? match[1] : match[2] || match[1];
const target = type === "markdown" ? match[2] : match[1];
const line = content.substring(0, match.index).split("\n").length;
result.push({ title, target, line });
}
};
extract_links_from_pattern(markdown_link_pattern, "markdown");
extract_links_from_pattern(wikilink_pattern, "wikilink");
result.sort((a, b) => a.line - b.line || a.target.localeCompare(b.target));
return result;
}

async function parse_links(source, content) {
if (!source.source_adapter?.get_links)
return;
const outlinks = await source.source_adapter.get_links(content);
source.data.outlinks = outlinks;
}

async function parse_metadata(source, content) {
if (!source.source_adapter?.get_metadata)
return;
const metadata = await source.source_adapter?.get_metadata?.(content);
source.data.metadata = metadata;
}

function parse_value(raw_value) {
const trimmed = raw_value.trim();
if (trimmed.startsWith('"') && trimmed.endsWith('"') || trimmed.startsWith("'") && trimmed.endsWith("'")) {
return trimmed.slice(1, -1);
}
const lower = trimmed.toLowerCase();
if (lower === "true")
return true;
if (lower === "false")
return false;
if (!isNaN(trimmed) && trimmed !== "") {
return Number(trimmed);
}
return trimmed;
}
function parse_yaml_block(yaml_block) {
const lines = yaml_block.split(/\r?\n/);
const data = {};
let i = 0;
while (i < lines.length) {
const line = lines[i];
i++;
if (!line.trim() || line.trim().startsWith("#")) {
continue;
}
const match = line.match(/^([^:]+)\s*:\s*(.*)$/);
if (!match) {
continue;
}
const key = match[1].trim();
let value = match[2].trim();
if (value === ">" || value === "|") {
const multiline_lines = [];
while (i < lines.length) {
const next_line = lines[i];
if (!/^\s+/.test(next_line) || next_line.trim().startsWith("#")) {
break;
}
multiline_lines.push(next_line.replace(/^\s+/, ""));
i++;
}
const joined = multiline_lines.join("\n");
data[key] = parse_value(joined);
} else if (value === "") {
const arr = [];
let array_consumed = false;
while (i < lines.length) {
const next_line = lines[i];
if (!next_line.trim().startsWith("- ")) {
break;
}
const item_value = next_line.trim().slice(2);
arr.push(parse_value(item_value));
i++;
array_consumed = true;
}
if (array_consumed) {
data[key] = arr;
} else {
data[key] = "";
}
} else {
data[key] = parse_value(value);
}
}
return data;
}
function parse_frontmatter(content) {
if (!content.startsWith("---")) {
return { frontmatter: {}, body: content };
}
const lines = content.split(/\r?\n/);
let end_index = -1;
for (let i = 1; i < lines.length; i++) {
if (lines[i].trim() === "---") {
end_index = i;
break;
}
}
if (end_index === -1) {
return { frontmatter: {}, body: content };
}
const frontmatter_lines = lines.slice(1, end_index);
const frontmatter_block = frontmatter_lines.join("\n");
const frontmatter = parse_yaml_block(frontmatter_block);
const body_lines = lines.slice(end_index + 1);
const body = body_lines.join("\n");
return { frontmatter, body };
}

var MarkdownSourceContentAdapter = class extends FileSourceContentAdapter {
static extensions = ["md", "txt"];
/**
* Import the source file content, parse blocks and links, and update `item.data`.
* @async
* @returns {Promise<void>}
*/
async import() {
if (!this.can_import)
return;
if (!this.should_import)
return;
const content = await this.read();
if (!content) {
return;
}
if (this.data.last_import?.hash === this.data.last_read?.hash) {
if (this.data.blocks)
return;
}
await this.parse_content(content);
await this.item.parse_content(content);
const { mtime, size } = this.item.file.stat;
this.data.last_import = {
mtime,
size,
at: Date.now(),
hash: this.data.last_read.hash
};
this.item.loaded_at = Date.now();
this.item.queue_save();
this.item.queue_embed();
}
async parse_content(content) {
await parse_links(this.item, content);
await parse_metadata(this.item, content);
}
async get_links(content = null) {
if (!content)
content = await this.read();
if (!content)
return;
return get_markdown_links(content);
}
async get_metadata(content = null) {
if (!content)
content = await this.read();
if (!content)
return;
const { frontmatter } = parse_frontmatter(content);
return frontmatter;
}
get can_import() {
if (!this.item.file) {
console.warn(`MarkdownSourceContentAdapter: Skipping missing-file: ${this.file_path}`);
return false;
}
if (this.item.file_type !== "md") {
return false;
}
if (this.item.size > 1e6) {
return false;
}
return true;
}
/**
* @deprecated use outdated instead
*/
get should_import() {
return this.outdated;
}
get outdated() {
try {
if (!this.data.last_import) {
if (this.data.mtime && this.data.size && this.data.hash) {
this.data.last_import = {
mtime: this.data.mtime,
size: this.data.size,
at: Date.now(),
hash: this.data.hash
};
delete this.data.mtime;
delete this.data.size;
delete this.data.hash;
} else {
return true;
}
}
if (this.data.last_read.at > this.data.last_import.at) {
if (this.data.last_import?.hash !== this.data.last_read?.hash)
return true;
}
if (this.data.last_import.mtime < this.item.mtime) {
if (!this.data.last_import.size)
return true;
const size_diff = Math.abs(this.data.last_import.size - this.item.size);
const size_diff_ratio = size_diff / (this.data.last_import.size || 1);
if (size_diff_ratio > 0.01)
return true;
}
return false;
} catch (e) {
console.warn(`MarkdownSourceContentAdapter: error getting should_import for ${this.file_path}: ${e}`);
return true;
}
}
};

var import_obsidian2 = require("obsidian");
var ObsidianMarkdownSourceContentAdapter = class extends MarkdownSourceContentAdapter {
/**
* Returns the frontmatter metadata from Obsidian's metadataCache.
* @async
* @returns {Promise<Object>} Frontmatter data if available, otherwise undefined.
*/
async get_metadata() {
const app = this.item.env.main.app;
const { frontmatter } = app.metadataCache.getFileCache(this.item.file) || {};
return frontmatter;
}
/**
* Reads the file content. If opts.render_output is true, attempts to use
* Obsidian's MarkdownRenderer to render the file to HTML, then convert it
* back to markdown via htmlToMarkdown.
* @async
* @param {Object} [opts={}] - Options for reading.
* @param {boolean} [opts.render_output=false] - If true, render MD -> HTML -> MD.
* @returns {Promise<string>} The file content (possibly rendered).
*/
async read(opts = {}) {
const content = await super.read(opts);
if (!opts.render_output) {
return content;
}
const app = this.item.env.main.app;
if (!app || !import_obsidian2.MarkdownRenderer || !import_obsidian2.htmlToMarkdown) {
console.warn("Obsidian environment not found; cannot render markdown.");
return content;
}
const container = document.createElement("div");
await import_obsidian2.MarkdownRenderer.render(app, content, container, this.item.path, new import_obsidian2.Component());
let last_html = container.innerHTML;
const max_wait = 1e4;
let wait_time = 0;
let conseq_same = 0;
let changed = true;
while (conseq_same < 7) {
await new Promise((resolve) => setTimeout(resolve, 100));
changed = last_html !== container.innerHTML;
last_html = container.innerHTML;
if (!changed)
conseq_same++;
else
conseq_same = 0;
wait_time += 100;
if (wait_time > max_wait) {
console.warn("ObsidianMarkdownSourceContentAdapter: Timeout waiting for markdown to render.");
break;
}
}
const newMd = (0, import_obsidian2.htmlToMarkdown)(container);
return newMd;
}
};

function collection_instance_name_from2(class_name) {
if (class_name.endsWith("Item")) {
return class_name.replace(/Item$/, "").toLowerCase();
}
return class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/y$/, "ie") + "s";
}

function create_uid2(data) {
const str = JSON.stringify(data);
let hash = 0;
if (str.length === 0)
return hash;
for (let i = 0; i < str.length; i++) {
const char = str.charCodeAt(i);
hash = (hash << 5) - hash + char;
hash = hash & hash;
if (hash < 0)
hash = hash * -1;
}
return hash.toString() + str.length;
}
function deep_merge3(target, source) {
for (const key in source) {
if (source.hasOwnProperty(key)) {
if (is_obj(source[key]) && is_obj(target[key]))
deep_merge3(target[key], source[key]);
else
target[key] = source[key];
}
}
return target;
function is_obj(item) {
return item && typeof item === "object" && !Array.isArray(item);
}
}

function deep_equal2(obj1, obj2, visited = /* @__PURE__ */ new WeakMap()) {
if (obj1 === obj2)
return true;
if (obj1 === null || obj2 === null || obj1 === void 0 || obj2 === void 0)
return false;
if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2))
return false;
if (Array.isArray(obj1)) {
if (obj1.length !== obj2.length)
return false;
return obj1.every((item, index) => deep_equal2(item, obj2[index], visited));
}
if (typeof obj1 === "object") {
if (visited.has(obj1))
return visited.get(obj1) === obj2;
visited.set(obj1, obj2);
const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);
if (keys1.length !== keys2.length)
return false;
return keys1.every((key) => deep_equal2(obj1[key], obj2[key], visited));
}
return obj1 === obj2;
}

var CollectionItem2 = class _CollectionItem {
/**
* Default properties for an instance of CollectionItem.
* Override in subclasses to define different defaults.
* @returns {Object}
*/
static get defaults() {
return {
data: {}
};
}
/**
* @param {Object} env - The environment/context.
* @param {Object|null} [data=null] - Initial data for the item.
*/
constructor(env, data = null) {
env.create_env_getter(this);
this.config = this.env?.config;
this.merge_defaults();
if (data)
deep_merge3(this.data, data);
if (!this.data.class_name)
this.data.class_name = this.constructor.name;
}
/**
* Loads an item from data and initializes it.
* @param {Object} env
* @param {Object} data
* @returns {CollectionItem}
*/
static load(env, data) {
const item = new this(env, data);
item.init();
return item;
}
/**
* Merge default properties from the entire inheritance chain.
* @private
*/
merge_defaults() {
let current_class = this.constructor;
while (current_class) {
for (let key in current_class.defaults) {
const default_val = current_class.defaults[key];
if (typeof default_val === "object") {
this[key] = { ...default_val, ...this[key] };
} else {
this[key] = this[key] === void 0 ? default_val : this[key];
}
}
current_class = Object.getPrototypeOf(current_class);
}
}
/**
* Generates or retrieves a unique key for the item.
* Key syntax supports:
* - `[i]` for sequences
* - `/` for super-sources (groups, directories, clusters)
* - `#` for sub-sources (blocks)
* @returns {string} The unique key
*/
get_key() {
return create_uid2(this.data);
}
/**
* Updates the item data and returns true if changed.
* @param {Object} data
* @returns {boolean} True if data changed.
*/
update_data(data) {
const sanitized_data = this.sanitize_data(data);
const current_data = { ...this.data };
deep_merge3(current_data, sanitized_data);
const changed = !deep_equal2(this.data, current_data);
if (!changed)
return false;
this.data = current_data;
return true;
}
/**
* Sanitizes data for saving. Ensures no circular references.
* @param {*} data
* @returns {*} Sanitized data.
*/
sanitize_data(data) {
if (data instanceof _CollectionItem)
return data.ref;
if (Array.isArray(data))
return data.map((val) => this.sanitize_data(val));
if (typeof data === "object" && data !== null) {
return Object.keys(data).reduce((acc, key) => {
acc[key] = this.sanitize_data(data[key]);
return acc;
}, {});
}
return data;
}
/**
* Initializes the item. Override as needed.
* @param {Object} [input_data] - Additional data that might be provided on creation.
*/
init(input_data) {
}
/**
* Queues this item for saving.
*/
queue_save() {
this._queue_save = true;
}
/**
* Saves this item using its data adapter.
* @returns {Promise<void>}
*/
async save() {
try {
await this.data_adapter.save_item(this);
this.init();
} catch (err) {
this._queue_save = true;
console.error(err, err.stack);
}
}
/**
* Queues this item for loading.
*/
queue_load() {
this._queue_load = true;
}
/**
* Loads this item using its data adapter.
* @returns {Promise<void>}
*/
async load() {
try {
await this.data_adapter.load_item(this);
this.init();
} catch (err) {
this._load_error = err;
this.on_load_error(err);
}
}
/**
* Handles load errors by re-queuing for load.
* Override if needed.
* @param {Error} err
*/
on_load_error(err) {
this.queue_load();
}
/**
* Validates the item before saving. Checks for presence and validity of key.
* @returns {boolean}
*/
validate_save() {
if (!this.key)
return false;
if (this.key.trim() === "")
return false;
if (this.key === "undefined")
return false;
return true;
}
/**
* Marks this item as deleted. This does not immediately remove it from memory,
* but queues a save that will result in the item being removed from persistent storage.
*/
delete() {
this.deleted = true;
this.queue_save();
}
/**
* Filters items in the collection based on provided options.
* functional filter (returns true or false) for filtering items in collection; called by collection class
* @param {Object} filter_opts - Filtering options.
* @param {string} [filter_opts.exclude_key] - A single key to exclude.
* @param {string[]} [filter_opts.exclude_keys] - An array of keys to exclude. If exclude_key is provided, it's added to this array.
* @param {string} [filter_opts.exclude_key_starts_with] - Exclude keys starting with this string.
* @param {string[]} [filter_opts.exclude_key_starts_with_any] - Exclude keys starting with any of these strings.
* @param {string} [filter_opts.exclude_key_includes] - Exclude keys that include this string.
* @param {string} [filter_opts.key_ends_with] - Include only keys ending with this string.
* @param {string} [filter_opts.key_starts_with] - Include only keys starting with this string.
* @param {string[]} [filter_opts.key_starts_with_any] - Include only keys starting with any of these strings.
* @param {string} [filter_opts.key_includes] - Include only keys that include this string.
* @returns {boolean} True if the item passes the filter, false otherwise.
*/
filter(filter_opts = {}) {
const {
exclude_key,
exclude_keys = exclude_key ? [exclude_key] : [],
exclude_key_starts_with,
exclude_key_starts_with_any,
exclude_key_includes,
exclude_key_includes_any,
key_ends_with,
key_starts_with,
key_starts_with_any,
key_includes,
key_includes_any
} = filter_opts;
if (exclude_keys?.includes(this.key))
return false;
if (exclude_key_starts_with && this.key.startsWith(exclude_key_starts_with))
return false;
if (exclude_key_starts_with_any && exclude_key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (exclude_key_includes && this.key.includes(exclude_key_includes))
return false;
if (exclude_key_includes_any && exclude_key_includes_any.some((include) => this.key.includes(include)))
return false;
if (key_ends_with && !this.key.endsWith(key_ends_with))
return false;
if (key_starts_with && !this.key.startsWith(key_starts_with))
return false;
if (key_starts_with_any && !key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (key_includes && !this.key.includes(key_includes))
return false;
if (key_includes_any && !key_includes_any.some((include) => this.key.includes(include)))
return false;
return true;
}
/**
* Parses item data for additional processing. Override as needed.
*/
parse() {
}
/**
* Helper function to render a component in the item scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
get actions() {
if (!this._actions) {
this._actions = Object.entries(this.env.opts.items[this.item_type_key].actions || {}).reduce((acc, [k, v]) => {
acc[k] = v.bind(this);
return acc;
}, {});
}
return this._actions;
}
/**
* Derives the collection key from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from2(name);
}
/**
* @returns {string} The collection key for this item.
*/
get collection_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from2(name);
}
/**
* Retrieves the parent collection from the environment.
* @returns {Collection}
*/
get collection() {
return this.env[this.collection_key];
}
/**
* @returns {string} The item's key.
*/
get key() {
return this.data?.key || this.get_key();
}
get item_type_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return camel_case_to_snake_case3(name);
}
/**
* A simple reference object for this item.
* @returns {{collection_key: string, key: string}}
*/
get ref() {
return { collection_key: this.collection_key, key: this.key };
}
/**
* @returns {Object} The data adapter for this item's collection.
*/
get data_adapter() {
return this.collection.data_adapter;
}
/**
* @returns {Object} The filesystem adapter.
*/
get data_fs() {
return this.collection.data_fs;
}
/**
* Access to collection-level settings.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key])
this.env.settings[this.collection_key] = {};
return this.env.settings[this.collection_key];
}
set settings(settings) {
this.env.settings[this.collection_key] = settings;
this.env.smart_settings.save();
}
/**
* Render this item into a container using the item's component.
* @deprecated 2024-12-02 Use explicit component pattern from environment
* @param {HTMLElement} container
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_item(container, opts = {}) {
const frag = await this.component.call(this.smart_view, this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* @deprecated use env.smart_view
* @returns {Object}
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Override in child classes to set the component for this item
* @deprecated 2024-12-02
* @returns {Function} The render function for this component
*/
get component() {
return item_component;
}
};
function camel_case_to_snake_case3(str) {
const result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, "").replace(/2$/, "");
return result;
}

var AsyncFunction2 = Object.getPrototypeOf(async function() {
}).constructor;
var Collection2 = class {
/**
* Constructs a new Collection instance.
*
* @param {Object} env - The environment context containing configurations and adapters.
* @param {Object} [opts={}] - Optional configuration.
* @param {string} [opts.collection_key] - Custom key to override default collection name.
* @param {string} [opts.data_dir] - Custom data directory path.
* @param {boolean} [opts.prevent_load_on_init] - Whether to prevent loading items on initialization.
*/
constructor(env, opts = {}) {
env.create_env_getter(this);
this.opts = opts;
if (opts.collection_key)
this.collection_key = opts.collection_key;
this.env[this.collection_key] = this;
this.config = this.env.config;
this.items = {};
this.loaded = null;
this._loading = false;
this.load_time_ms = null;
this.settings_container = null;
}
/**
* Initializes a new collection in the environment. Override in subclass if needed.
*
* @param {Object} env
* @param {Object} [opts={}]
* @returns {Promise<void>}
*/
static async init(env, opts = {}) {
env[this.collection_key] = new this(env, opts);
await env[this.collection_key].init();
env.collections[this.collection_key] = "init";
}
/**
* The unique collection key derived from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Instance-level init. Override in subclasses if necessary.
* @returns {Promise<void>}
*/
async init() {
}
/**
* Creates or updates an item in the collection.
* - If `data` includes a key that matches an existing item, that item is updated.
* - Otherwise, a new item is created.
* After updating or creating, the item is validated. If validation fails, the item is logged and returned without being saved.
* If validation succeeds for a new item, it is added to the collection and marked for saving.
*
* If the item’s `init()` method is async, a promise is returned that resolves once init completes.
*
* @param {Object} [data={}] - Data for creating/updating an item.
* @returns {Promise<Item>|Item} The created or updated item. May return a promise if `init()` is async.
*/
create_or_update(data = {}) {
const existing_item = this.find_by(data);
const item = existing_item ? existing_item : new this.item_type(this.env);
item._queue_save = !existing_item;
const data_changed = item.update_data(data);
if (!existing_item && !item.validate_save()) {
return item;
}
if (!existing_item) {
this.set(item);
}
if (existing_item && !data_changed)
return existing_item;
if (item.init instanceof AsyncFunction2) {
return new Promise((resolve) => {
item.init(data).then(() => resolve(item));
});
}
item.init(data);
return item;
}
/**
* Finds an item by partial data match (first checks key). If `data.key` provided,
* returns the item with that key; otherwise attempts a match by merging data.
*
* @param {Object} data - Data to match against.
* @returns {Item|null}
*/
find_by(data) {
if (data.key)
return this.get(data.key);
const temp = new this.item_type(this.env);
const temp_data = JSON.parse(JSON.stringify(data, temp.sanitize_data(data)));
deep_merge3(temp.data, temp_data);
return temp.key ? this.get(temp.key) : null;
}
/**
* Filters items based on provided filter options or a custom function.
*
* @param {Object|Function} [filter_opts={}] - Filter options or a predicate function.
* @returns {Item[]} Array of filtered items.
*/
filter(filter_opts = {}) {
if (typeof filter_opts === "function") {
return Object.values(this.items).filter(filter_opts);
}
filter_opts = this.prepare_filter(filter_opts);
const results = [];
const { first_n } = filter_opts;
for (const item of Object.values(this.items)) {
if (first_n && results.length >= first_n)
break;
if (item.filter(filter_opts))
results.push(item);
}
return results;
}
/**
* Alias for `filter()`
* @param {Object|Function} filter_opts
* @returns {Item[]}
*/
list(filter_opts) {
return this.filter(filter_opts);
}
/**
* Prepares filter options. Can be overridden by subclasses to normalize filter options.
*
* @param {Object} filter_opts
* @returns {Object} Prepared filter options.
*/
prepare_filter(filter_opts) {
return filter_opts;
}
/**
* Retrieves an item by key.
* @param {string} key
* @returns {Item|undefined}
*/
get(key) {
return this.items[key];
}
/**
* Retrieves multiple items by an array of keys.
* @param {string[]} keys
* @returns {Item[]}
*/
get_many(keys = []) {
if (!Array.isArray(keys)) {
console.error("get_many called with non-array keys:", keys);
return [];
}
return keys.map((key) => this.get(key)).filter(Boolean);
}
/**
* Retrieves a random item from the collection, optionally filtered by options.
* @param {Object} [opts]
* @returns {Item|undefined}
*/
get_rand(opts = null) {
if (opts) {
const filtered = this.filter(opts);
return filtered[Math.floor(Math.random() * filtered.length)];
}
const keys = this.keys;
return this.items[keys[Math.floor(Math.random() * keys.length)]];
}
/**
* Adds or updates an item in the collection.
* @param {Item} item
*/
set(item) {
if (!item.key)
throw new Error("Item must have a key property");
this.items[item.key] = item;
}
/**
* Updates multiple items by their keys.
* @param {string[]} keys
* @param {Object} data
*/
update_many(keys = [], data = {}) {
this.get_many(keys).forEach((item) => item.update_data(data));
}
/**
* Clears all items from the collection.
*/
clear() {
this.items = {};
}
/**
* @returns {string} The collection key, can be overridden by opts.collection_key
*/
get collection_key() {
return this._collection_key ? this._collection_key : this.constructor.collection_key;
}
set collection_key(key) {
this._collection_key = key;
}
/**
* Lazily initializes and returns the data adapter instance for this collection.
* @returns {Object} The data adapter instance.
*/
get data_adapter() {
if (!this._data_adapter) {
const AdapterClass = this.get_adapter_class("data");
this._data_adapter = new AdapterClass(this);
}
return this._data_adapter;
}
get_adapter_class(type) {
const config = this.env.opts.collections?.[this.collection_key];
const adapter_key = type + "_adapter";
const adapter_module = config?.[adapter_key] ?? this.env.opts.collections?.smart_collections?.[adapter_key];
if (typeof adapter_module === "function")
return adapter_module;
if (typeof adapter_module?.collection === "function")
return adapter_module.collection;
throw new Error(`No '${type}' adapter class found for ${this.collection_key} or smart_collections`);
}
/**
* Data directory strategy for this collection. Defaults to 'multi'.
* @returns {string}
*/
get data_dir() {
return this.collection_key;
}
/**
* File system adapter from the environment.
* @returns {Object}
*/
get data_fs() {
return this.env.data_fs;
}
/**
* Derives the corresponding item class name based on this collection's class name.
* @returns {string}
*/
get item_class_name() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
if (name.endsWith("ies"))
return name.slice(0, -3) + "y";
else if (name.endsWith("s"))
return name.slice(0, -1);
return name + "Item";
}
/**
* Derives a readable item name from the item class name.
* @returns {string}
*/
get item_name() {
return this.item_class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Retrieves the item type (constructor) from the environment.
* @returns {Function} Item constructor.
*/
get item_type() {
if (this.opts.item_type)
return this.opts.item_type;
return this.env.item_types[this.item_class_name];
}
/**
* Returns an array of all keys in the collection.
* @returns {string[]}
*/
get keys() {
return Object.keys(this.items);
}
/**
* @deprecated use data_adapter instead (2024-09-14)
*/
get adapter() {
return this.data_adapter;
}
/**
* @method process_save_queue
* @description
* Saves items flagged for saving (_queue_save) back to AJSON or SQLite. This ensures persistent storage
* of any updates made since last load/import. This method also writes changes to disk (AJSON files or DB).
*/
async process_save_queue(opts = {}) {
if (opts.force) {
Object.values(this.items).forEach((item) => item._queue_save = true);
}
await this.data_adapter.process_save_queue(opts);
}
/**
* @alias process_save_queue
* @returns {Promise<void>}
*/
async save(opts = {}) {
await this.process_save_queue(opts);
}
/**
* @method process_load_queue
* @description
* Loads items that have been flagged for loading (_queue_load). This may involve
* reading from AJSON/SQLite or re-importing from markdown if needed.
* Called once initial environment is ready and collections are known.
*/
async process_load_queue() {
await this.data_adapter.process_load_queue();
}
/**
* Retrieves processed settings configuration.
* @returns {Object}
*/
get settings_config() {
return this.process_settings_config({});
}
/**
* Processes given settings config, adding prefixes and handling conditionals.
*
* @private
* @param {Object} _settings_config
* @param {string} [prefix='']
* @returns {Object}
*/
process_settings_config(_settings_config, prefix = "") {
const add_prefix = (key) => prefix && !key.includes(`${prefix}.`) ? `${prefix}.${key}` : key;
return Object.entries(_settings_config).reduce((acc, [key, val]) => {
let new_val = { ...val };
if (new_val.conditional) {
if (!new_val.conditional(this))
return acc;
delete new_val.conditional;
}
if (new_val.callback)
new_val.callback = add_prefix(new_val.callback);
if (new_val.btn_callback)
new_val.btn_callback = add_prefix(new_val.btn_callback);
if (new_val.options_callback)
new_val.options_callback = add_prefix(new_val.options_callback);
const new_key = add_prefix(this.process_setting_key(key));
acc[new_key] = new_val;
return acc;
}, {});
}
/**
* Processes an individual setting key. Override if needed.
* @param {string} key
* @returns {string}
*/
process_setting_key(key) {
return key;
}
/**
* Default settings for this collection. Override in subclasses as needed.
* @returns {Object}
*/
get default_settings() {
return {};
}
/**
* Current settings for the collection.
* Initializes with default settings if none exist.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key]) {
this.env.settings[this.collection_key] = this.default_settings;
}
return this.env.settings[this.collection_key];
}
/**
* @deprecated use env.smart_view instead
* @returns {Object} smart_view instance
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Renders the settings for the collection into a given container.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_settings(container = this.settings_container, opts = {}) {
return await this.render_collection_settings(container, opts);
}
/**
* Helper function to render collection settings.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_collection_settings(container = this.settings_container, opts = {}) {
if (container && (!this.settings_container || this.settings_container !== container)) {
this.settings_container = container;
} else if (!container) {
container = this.env.smart_view.create_doc_fragment("<div></div>");
}
container.innerHTML = `<div class="sc-loading">Loading ${this.collection_key} settings...</div>`;
const frag = await this.env.render_component("settings", this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* Unloads collection data from memory.
*/
unload() {
this.clear();
this.unloaded = true;
this.env.collections[this.collection_key] = null;
}
/**
* Runs load process for all items in the collection, triggering queue loads and rendering settings after done.
* @returns {Promise<void>}
*/
async run_data_load() {
this.loaded = null;
this.load_time_ms = null;
Object.values(this.items).forEach((item) => item.queue_load());
this.notices?.show("loading_collection", { collection_key: this.collection_key });
await this.process_load_queue();
this.notices?.remove("loading_collection");
this.notices?.show("done_loading_collection", { collection_key: this.collection_key });
this.render_settings();
}
/**
* Helper function to render a component in the collection scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
show_process_notice(process2, opts = {}) {
if (!this.debounce_process_notice)
this.debounce_process_notice = {};
this.debounce_process_notice[process2] = setTimeout(() => {
this.debounce_process_notice[process2] = null;
this.env.notices?.show(process2, { collection_key: this.collection_key, ...opts });
}, 1e3);
}
clear_process_notice(process2) {
if (this.debounce_process_notice?.[process2]) {
clearTimeout(this.debounce_process_notice[process2]);
this.debounce_process_notice[process2] = null;
} else {
this.env.notices?.remove(process2);
}
}
};

var EntitiesVectorAdapter2 = class {
/**
* @constructor
* @param {Object} collection - The collection (SmartEntities or derived class) instance.
*/
constructor(collection) {
this.collection = collection;
}
/**
* Find the nearest entities to the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score descending.
* @throws {Error} Not implemented by default.
*/
async nearest(vec, filter = {}) {
throw new Error("EntitiesVectorAdapter.nearest() not implemented");
}
/**
* Find the furthest entities from the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score ascending (furthest).
* @throws {Error} Not implemented by default.
*/
async furthest(vec, filter = {}) {
throw new Error("EntitiesVectorAdapter.furthest() not implemented");
}
/**
* Embed a batch of entities.
* @async
* @param {Object[]} entities - Array of entity instances to embed.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async embed_batch(entities) {
throw new Error("EntitiesVectorAdapter.embed_batch() not implemented");
}
/**
* Process a queue of entities waiting to be embedded.
* Typically, this will call embed_batch in batches and update entities.
* @async
* @param {Object[]} embed_queue - Array of entities to embed.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async process_embed_queue(embed_queue) {
throw new Error("EntitiesVectorAdapter.process_embed_queue() not implemented");
}
};
var EntityVectorAdapter2 = class {
/**
* @constructor
* @param {Object} item - The SmartEntity instance that this adapter is associated with.
*/
constructor(item) {
this.item = item;
}
/**
* Retrieve the current vector embedding for this entity.
* @async
* @returns {Promise<number[]|undefined>} The entity's vector or undefined if not set.
* @throws {Error} Not implemented by default.
*/
async get_vec() {
throw new Error("EntityVectorAdapter.get_vec() not implemented");
}
/**
* Store/update the vector embedding for this entity.
* @async
* @param {number[]} vec - The vector to set.
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async set_vec(vec) {
throw new Error("EntityVectorAdapter.set_vec() not implemented");
}
/**
* Delete/remove the vector embedding for this entity.
* @async
* @returns {Promise<void>}
* @throws {Error} Not implemented by default.
*/
async delete_vec() {
throw new Error("EntityVectorAdapter.delete_vec() not implemented");
}
};

function cos_sim2(vector1, vector2) {
if (vector1.length !== vector2.length) {
throw new Error("Vectors must have the same length");
}
let dot_product = 0;
let magnitude1 = 0;
let magnitude2 = 0;
const epsilon = 1e-8;
for (let i = 0; i < vector1.length; i++) {
dot_product += vector1[i] * vector2[i];
magnitude1 += vector1[i] * vector1[i];
magnitude2 += vector2[i] * vector2[i];
}
magnitude1 = Math.sqrt(magnitude1);
magnitude2 = Math.sqrt(magnitude2);
if (magnitude1 < epsilon || magnitude2 < epsilon) {
return 0;
}
return dot_product / (magnitude1 * magnitude2);
}

function results_acc2(_acc, result, ct = 10) {
if (_acc.results.size < ct) {
_acc.results.add(result);
if (_acc.results.size === ct && _acc.min === Number.POSITIVE_INFINITY) {
let { minScore, minObj } = find_min2(_acc.results);
_acc.min = minScore;
_acc.minResult = minObj;
}
} else if (result.score > _acc.min) {
_acc.results.add(result);
_acc.results.delete(_acc.minResult);
let { minScore, minObj } = find_min2(_acc.results);
_acc.min = minScore;
_acc.minResult = minObj;
}
}
function furthest_acc2(_acc, result, ct = 10) {
if (_acc.results.size < ct) {
_acc.results.add(result);
if (_acc.results.size === ct && _acc.max === Number.NEGATIVE_INFINITY) {
let { maxScore, maxObj } = find_max2(_acc.results);
_acc.max = maxScore;
_acc.maxResult = maxObj;
}
} else if (result.score < _acc.max) {
_acc.results.add(result);
_acc.results.delete(_acc.maxResult);
let { maxScore, maxObj } = find_max2(_acc.results);
_acc.max = maxScore;
_acc.maxResult = maxObj;
}
}
function find_min2(results) {
let minScore = Number.POSITIVE_INFINITY;
let minObj = null;
for (const obj of results) {
if (obj.score < minScore) {
minScore = obj.score;
minObj = obj;
}
}
return { minScore, minObj };
}
function find_max2(results) {
let maxScore = Number.NEGATIVE_INFINITY;
let maxObj = null;
for (const obj of results) {
if (obj.score > maxScore) {
maxScore = obj.score;
maxObj = obj;
}
}
return { maxScore, maxObj };
}

function sort_by_score2(a, b) {
const epsilon = 1e-9;
const score_diff = a.score - b.score;
if (Math.abs(score_diff) < epsilon)
return 0;
return score_diff > 0 ? -1 : 1;
}
function sort_by_score_descending2(a, b) {
return sort_by_score2(a, b);
}
function sort_by_score_ascending2(a, b) {
return sort_by_score2(a, b) * -1;
}

var DefaultEntitiesVectorAdapter2 = class extends EntitiesVectorAdapter2 {
constructor(collection) {
super(collection);
this._is_processing_embed_queue = false;
this._reset_embed_queue_stats();
}
/**
* Find the nearest entities to the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score descending.
*/
async nearest(vec, filter = {}) {
if (!vec || !Array.isArray(vec)) {
throw new Error("Invalid vector input to nearest()");
}
const {
limit = 50
} = filter;
const nearest = this.collection.filter(filter).reduce((acc, item) => {
if (!item.vec)
return acc;
const result = { item, score: cos_sim2(vec, item.vec) };
results_acc2(acc, result, limit);
return acc;
}, { min: 0, results: /* @__PURE__ */ new Set() });
return Array.from(nearest.results).sort(sort_by_score_descending2);
}
/**
* Find the furthest entities from the given vector.
* @async
* @param {number[]} vec - The reference vector.
* @param {Object} [filter={}] - Optional filters (limit, exclude, etc.)
* @returns {Promise<Array<{item:Object, score:number}>>} Array of results sorted by score ascending (furthest).
*/
async furthest(vec, filter = {}) {
if (!vec || !Array.isArray(vec)) {
throw new Error("Invalid vector input to furthest()");
}
const {
limit = 50
} = filter;
const furthest = this.collection.filter(filter).reduce((acc, item) => {
if (!item.vec)
return acc;
const result = { item, score: cos_sim2(vec, item.vec) };
furthest_acc2(acc, result, limit);
return acc;
}, { max: 0, results: /* @__PURE__ */ new Set() });
return Array.from(furthest.results).sort(sort_by_score_ascending2);
}
/**
* Embed a batch of entities.
* @async
* @param {Object[]} entities - Array of entity instances to embed.
* @returns {Promise<void>}
*/
async embed_batch(entities) {
if (!this.collection.embed_model) {
throw new Error("No embed_model found in collection for embedding");
}
await Promise.all(entities.map((e) => e.get_embed_input()));
const embeddings = await this.collection.embed_model.embed_batch(entities);
embeddings.forEach((emb, i) => {
const entity = entities[i];
entity.vec = emb.vec;
if (emb.tokens !== void 0)
entity.tokens = emb.tokens;
});
}
/**
* Process a queue of entities waiting to be embedded.
* Prevents multiple concurrent runs by using `_is_processing_embed_queue`.
* @async
* @returns {Promise<void>}
*/
async process_embed_queue() {
if (this._is_processing_embed_queue) {
console.log("process_embed_queue is already running, skipping concurrent call.");
return;
}
this._is_processing_embed_queue = true;
try {
const embed_queue = this.collection.embed_queue;
this._reset_embed_queue_stats();
if (this.collection.embed_model_key === "None") {
console.log(`Smart Connections: No active embedding model for ${this.collection.collection_key}, skipping embedding`);
return;
}
if (!this.collection.embed_model) {
console.log(`Smart Connections: No active embedding model for ${this.collection.collection_key}, skipping embedding`);
return;
}
const datetime_start = /* @__PURE__ */ new Date();
if (!embed_queue.length) {
console.log(`Smart Connections: No items in ${this.collection.collection_key} embed queue`);
return;
}
console.log(`Time spent getting embed queue: ${(/* @__PURE__ */ new Date()).getTime() - datetime_start.getTime()}ms`);
console.log(`Processing ${this.collection.collection_key} embed queue: ${embed_queue.length} items`);
for (let i = 0; i < embed_queue.length; i += this.collection.embed_model.batch_size) {
if (this.is_queue_halted) {
this.is_queue_halted = false;
break;
}
const batch = embed_queue.slice(i, i + this.collection.embed_model.batch_size);
await Promise.all(batch.map((item) => item.get_embed_input()));
try {
const start_time = Date.now();
await this.embed_batch(batch);
this.total_time += Date.now() - start_time;
} catch (e) {
if (e && e.message && e.message.includes("API key not set")) {
this.halt_embed_queue_processing(`API key not set for ${this.collection.embed_model_key}
Please set the API key in the settings.`);
}
console.error(e);
console.error(`Error processing ${this.collection.collection_key} embed queue: ` + JSON.stringify(e || {}, null, 2));
}
batch.forEach((item) => {
item.embed_hash = item.read_hash;
item._queue_save = true;
});
this.embedded_total += batch.length;
this.total_tokens += batch.reduce((acc, item) => acc + (item.tokens || 0), 0);
this._show_embed_progress_notice(embed_queue.length);
if (this.embedded_total - this.last_save_total > 1e3) {
this.last_save_total = this.embedded_total;
await this.collection.process_save_queue();
if (this.collection.block_collection) {
console.log(`Saving ${this.collection.block_collection.collection_key} block collection`);
await this.collection.block_collection.process_save_queue();
}
}
}
this._show_embed_completion_notice(embed_queue.length);
await this.collection.process_save_queue();
if (this.collection.block_collection) {
await this.collection.block_collection.process_save_queue();
}
} finally {
this._is_processing_embed_queue = false;
}
}
/**
* Displays the embedding progress notice.
* @private
* @returns {void}
*/
_show_embed_progress_notice(embed_queue_length) {
if (this.embedded_total - this.last_notice_embedded_total < 100)
return;
this.last_notice_embedded_total = this.embedded_total;
this.notices?.show("embedding_progress", {
progress: this.embedded_total,
total: embed_queue_length,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Displays the embedding completion notice.
* @private
* @returns {void}
*/
_show_embed_completion_notice() {
this.notices?.remove("embedding_progress");
this.notices?.show("embedding_complete", {
total_embeddings: this.embedded_total,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Halts the embed queue processing.
* @param {string|null} msg - Optional message.
*/
halt_embed_queue_processing(msg = null) {
this.is_queue_halted = true;
console.log("Embed queue processing halted");
this.notices?.remove("embedding_progress");
this.notices?.show("embedding_paused", {
progress: this.embedded_total,
total: this.collection._embed_queue.length,
tokens_per_second: this._calculate_embed_tokens_per_second(),
model_name: this.collection.embed_model_key
});
}
/**
* Resumes the embed queue processing after a delay.
* @param {number} [delay=0] - The delay in milliseconds before resuming.
* @returns {void}
*/
resume_embed_queue_processing(delay = 0) {
console.log("resume_embed_queue_processing");
this.notices?.remove("embedding_paused");
setTimeout(() => {
this.embedded_total = 0;
this.process_embed_queue();
}, delay);
}
/**
* Calculates the number of tokens processed per second.
* @private
* @returns {number} Tokens per second.
*/
_calculate_embed_tokens_per_second() {
const elapsed_time = this.total_time / 1e3;
return Math.round(this.total_tokens / (elapsed_time || 1));
}
/**
* Resets the statistics related to embed queue processing.
* @private
* @returns {void}
*/
_reset_embed_queue_stats() {
this.collection._embed_queue = [];
this.embedded_total = 0;
this.is_queue_halted = false;
this.last_save_total = 0;
this.last_notice_embedded_total = 0;
this.total_tokens = 0;
this.total_time = 0;
}
get notices() {
return this.collection.notices;
}
};
var DefaultEntityVectorAdapter2 = class extends EntityVectorAdapter2 {
get data() {
return this.item.data;
}
/**
* Retrieve the current vector embedding for this entity.
* @async
* @returns {Promise<number[]|undefined>} The entity's vector or undefined if not set.
*/
async get_vec() {
return this.vec;
}
/**
* Store/update the vector embedding for this entity.
* @async
* @param {number[]} vec - The vector to set.
* @returns {Promise<void>}
*/
async set_vec(vec) {
this.vec = vec;
}
/**
* Delete/remove the vector embedding for this entity.
* @async
* @returns {Promise<void>}
*/
async delete_vec() {
if (this.item.data?.embeddings?.[this.item.embed_model_key]) {
delete this.item.data.embeddings[this.item.embed_model_key].vec;
}
}
get vec() {
return this.item.data?.embeddings?.[this.item.embed_model_key]?.vec;
}
set vec(vec) {
if (!this.item.data.embeddings) {
this.item.data.embeddings = {};
}
if (!this.item.data.embeddings[this.item.embed_model_key]) {
this.item.data.embeddings[this.item.embed_model_key] = {};
}
this.item.data.embeddings[this.item.embed_model_key].vec = vec;
}
};

async function render4(entity, opts = {}) {
let markdown;
if (should_render_embed2(entity))
markdown = entity.embed_link;
else
markdown = process_for_rendering2(await entity.read());
let frag;
if (entity.env.settings.smart_view_filter.render_markdown)
frag = await this.render_markdown(markdown, entity);
else
frag = this.create_doc_fragment(markdown);
return await post_process3.call(this, entity, frag, opts);
}
function process_for_rendering2(content) {
if (content.includes("```dataview"))
content = content.replace(/```dataview/g, "```\\dataview");
if (content.includes("![["))
content = content.replace(/\!\[\[/g, "! [[");
return content;
}
async function post_process3(scope, frag, opts = {}) {
return frag;
}
function should_render_embed2(entity) {
if (!entity)
return false;
if (entity.is_canvas || entity.is_excalidraw)
return true;
return false;
}

async function find_connections3(params = {}) {
const filter_opts = this.prepare_find_connections_filter_opts(params);
const limit = params.filter?.limit || params.limit || this.env.settings.smart_view_filter?.results_limit || 10;
const cache_key = this.key + JSON.stringify(params);
if (!this.env.connections_cache)
this.env.connections_cache = {};
if (!this.env.connections_cache[cache_key]) {
const connections = (await this.nearest(filter_opts)).sort(sort_by_score2).slice(0, limit);
this.connections_to_cache(cache_key, connections);
}
return this.connections_from_cache(cache_key);
}

var SmartEntity2 = class extends CollectionItem2 {
/**
* Creates an instance of SmartEntity.
* @constructor
* @param {Object} env - The environment instance.
* @param {Object} [opts={}] - Configuration options.
*/
constructor(env, opts = {}) {
super(env, opts);
this.entity_adapter = new DefaultEntityVectorAdapter2(this);
}
/**
* Provides default values for a SmartEntity instance.
* @static
* @readonly
* @returns {Object} The default values.
*/
static get defaults() {
return {
data: {
path: null,
last_embed: {
hash: null
},
embeddings: {}
}
};
}
get vector_adapter() {
if (!this._vector_adapter) {
this._vector_adapter = new this.collection.opts.vector_adapter.item(this);
}
return this._vector_adapter;
}
/**
* Initializes the SmartEntity instance.
* Checks if the entity has a vector and if it matches the model dimensions.
* If not, it queues an embed.
* Removes embeddings for inactive models.
* @returns {void}
*/
init() {
super.init();
if (!this.vec) {
this.queue_embed();
} else if (this.vec.length !== this.embed_model.model_config.dims) {
this.vec = null;
this.queue_embed();
}
Object.entries(this.data.embeddings || {}).forEach(([model, embedding]) => {
if (model !== this.embed_model_key) {
this.data.embeddings[model] = null;
delete this.data.embeddings[model];
}
});
}
/**
* Queues the entity for embedding.
* @returns {void}
*/
queue_embed() {
this._queue_embed = true;
}
/**
* Finds the nearest entities to this entity.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Array<{item:Object, score:number}>} An array of result objects with score and item.
*/
async nearest(filter = {}) {
return await this.collection.nearest_to(this, filter);
}
/**
* Prepares the input for embedding.
* @async
* @param {string} [content=null] - Optional content to use instead of calling subsequent read()
* @returns {Promise<void>} Should be overridden in child classes.
*/
async get_embed_input(content = null) {
}
/**
* Retrieves the embed input, either from cache or by generating it.
* @readonly
* @returns {string|Promise<string>} The embed input string or a promise resolving to it.
*/
get embed_input() {
return this._embed_input ? this._embed_input : this.get_embed_input();
}
/**
* Prepares filter options for finding connections based on parameters.
* @param {Object} [params={}] - Parameters for finding connections.
* @returns {Object} The prepared filter options.
*/
prepare_find_connections_filter_opts(params = {}) {
const opts = {
...this.env.settings.smart_view_filter || {},
...params,
entity: this
};
if (opts.filter?.limit)
delete opts.filter.limit;
if (opts.limit)
delete opts.limit;
return opts;
}
/**
* Finds connections relevant to this entity based on provided parameters.
* @async
* @param {Object} [params={}] - Parameters for finding connections.
* @returns {Array<{item:Object, score:number}>} An array of result objects with score and item.
*/
async find_connections(params = {}) {
return await this.actions.find_connections(params);
}
/**
* Retrieves connections from the cache based on the cache key.
* @param {string} cache_key - The cache key.
* @returns {Array<{item:Object, score:number}>} The cached connections.
*/
connections_from_cache(cache_key) {
return this.env.connections_cache[cache_key];
}
/**
* Stores connections in the cache with the provided cache key.
* @param {string} cache_key - The cache key.
* @param {Array<{item:Object, score:number}>} connections - The connections to cache.
* @returns {void}
*/
connections_to_cache(cache_key, connections) {
this.env.connections_cache[cache_key] = connections;
}
get read_hash() {
return this.data.last_read?.hash;
}
set read_hash(hash) {
if (!this.data.last_read)
this.data.last_read = {};
this.data.last_read.hash = hash;
}
get embedding_data() {
if (!this.data.embeddings[this.embed_model_key]) {
this.data.embeddings[this.embed_model_key] = {};
}
return this.data.embeddings[this.embed_model_key];
}
get last_embed() {
if (!this.embedding_data.last_embed) {
this.embedding_data.last_embed = {};
if (this.data.last_embed) {
this.embedding_data.last_embed = this.data.last_embed;
delete this.data.last_embed;
this.queue_save();
}
}
return this.embedding_data.last_embed;
}
get embed_hash() {
return this.last_embed?.hash;
}
set embed_hash(hash) {
if (!this.embedding_data.last_embed)
this.embedding_data.last_embed = {};
this.embedding_data.last_embed.hash = hash;
}
/**
* Gets the embed link for the entity.
* @readonly
* @returns {string} The embed link.
*/
get embed_link() {
return `![[${this.path}]]`;
}
/**
* Gets the key of the embedding model.
* @readonly
* @returns {string} The embedding model key.
*/
get embed_model_key() {
return this.collection.embed_model_key;
}
/**
* Gets the name of the entity, formatted based on settings.
* @readonly
* @returns {string} The entity name.
*/
get name() {
return (!this.should_show_full_path ? this.path.split("/").pop() : this.path.split("/").join(" > ")).split("#").join(" > ").replace(".md", "");
}
/**
* Determines whether to show the full path of the entity.
* @readonly
* @returns {boolean} True if the full path should be shown, false otherwise.
*/
get should_show_full_path() {
return this.env.settings.smart_view_filter?.show_full_path;
}
/**
* @deprecated Use embed_model instead.
* @readonly
* @returns {Object} The smart embedding model.
*/
get smart_embed() {
return this.embed_model;
}
/**
* Gets the embedding model instance from the collection.
* @readonly
* @returns {Object} The embedding model instance.
*/
get embed_model() {
return this.collection.embed_model;
}
/**
* Determines if the entity should be embedded.
* @readonly
* @returns {boolean} True if no vector is set, false otherwise.
*/
get should_embed() {
return !this.vec && this.size > (this.settings?.min_chars || 300);
}
/**
* Sets the error for the embedding model.
* @param {string} error - The error message.
*/
set error(error) {
this.data.embeddings[this.embed_model_key].error = error;
}
/**
* Gets the number of tokens associated with the entity's embedding.
* @readonly
* @returns {number|undefined} The number of tokens, or undefined if not set.
*/
get tokens() {
return this.last_embed?.tokens;
}
/**
* Sets the number of tokens for the embedding.
* @param {number} tokens - The number of tokens.
*/
set tokens(tokens) {
this.last_embed.tokens = tokens;
}
/**
* Gets the vector representation from the entity adapter.
* @readonly
* @returns {Array<number>|undefined} The vector or undefined if not set.
*/
get vec() {
return this.entity_adapter.vec;
}
/**
* Sets the vector representation in the entity adapter.
* @param {Array<number>} vec - The vector to set.
*/
set vec(vec) {
this.entity_adapter.vec = vec;
this._queue_embed = false;
this._embed_input = null;
this.queue_save();
}
/**
* Removes all embeddings from the entity.
* @returns {void}
*/
remove_embeddings() {
this.data.embeddings = null;
this.queue_save();
}
/**
* Retrieves the key of the entity.
* @returns {string} The entity key.
*/
get_key() {
return this.data.key || this.data.path;
}
/**
* Retrieves the path of the entity.
* @readonly
* @returns {string|null} The entity path.
*/
get path() {
return this.data.path;
}
/**
* Gets the component responsible for rendering the entity.
* @readonly
* @returns {Function} The render function for the entity component.
*/
get component() {
return render4;
}
get is_unembedded() {
if (!this.vec)
return true;
if (!this.embed_hash || this.embed_hash !== this.read_hash)
return true;
return false;
}
get connections_component() {
if (!this._connections_component)
this._connections_component = this.components?.connections?.bind(this.smart_view);
return this._connections_component;
}
async render_connections(container, opts = {}) {
if (container)
container.innerHTML = "Loading connections...";
const frag = await this.env.render_component("connections", this, opts);
if (container) {
container.innerHTML = "";
container.appendChild(frag);
}
return frag;
}
};

var SmartEntities2 = class extends Collection2 {
/**
* Creates an instance of SmartEntities.
* @constructor
* @param {Object} env - The environment instance.
* @param {Object} opts - Configuration options.
*/
constructor(env, opts) {
super(env, opts);
this.entities_vector_adapter = new DefaultEntitiesVectorAdapter2(this);
this.model_instance_id = null;
this._embed_queue = [];
}
/**
* Initializes the SmartEntities instance by loading embeddings.
* @async
* @returns {Promise<void>}
*/
async init() {
await super.init();
await this.load_smart_embed();
if (!this.embed_model) {
console.log(`SmartEmbed not loaded for **${this.collection_key}**. Continuing without embedding capabilities.`);
}
}
/**
* Loads the smart embedding model.
* @async
* @returns {Promise<void>}
*/
async load_smart_embed() {
if (this.embed_model_key === "None")
return;
if (!this.embed_model)
return;
if (this.embed_model.is_loading)
return console.log(`SmartEmbedModel already loading for ${this.embed_model_key}`);
if (this.embed_model.is_loaded)
return console.log(`SmartEmbedModel already loaded for ${this.embed_model_key}`);
try {
console.log(`Loading SmartEmbedModel in ${this.collection_key}, current state: ${this.embed_model.state}`);
await this.embed_model.load();
} catch (e) {
console.error(`Error loading SmartEmbedModel for ${this.embed_model.model_key}`);
console.error(e);
}
}
/**
* Unloads the smart embedding model.
* @async
* @returns {Promise<void>}
*/
async unload() {
if (typeof this.embed_model?.unload === "function") {
this.embed_model.unload();
}
super.unload();
}
/**
* Gets the key of the embedding model.
* @readonly
* @returns {string} The embedding model key.
*/
get embed_model_key() {
return this.embed_model?.model_key;
}
/**
* Gets or creates the container for smart embeddings in the DOM.
* @readonly
* @returns {HTMLElement|undefined} The container element or undefined if not available.
*/
get smart_embed_container() {
if (!this.model_instance_id)
return console.log("model_key not set");
const id = this.model_instance_id.replace(/[^a-zA-Z0-9]/g, "_");
if (!window.document)
return console.log("window.document not available");
if (window.document.querySelector(`#${id}`))
return window.document.querySelector(`#${id}`);
const container = window.document.createElement("div");
container.id = id;
window.document.body.appendChild(container);
return container;
}
/**
* @deprecated Use embed_model instead.
* @readonly
* @returns {Object} The smart embedding model.
*/
get smart_embed() {
return this.embed_model;
}
/**
* Gets the embedding model instance.
* @readonly
* @returns {Object|null} The embedding model instance or null if none.
*/
get embed_model() {
if (!this.env._embed_model && this.env.opts.modules.smart_embed_model?.class)
this.env._embed_model = new this.env.opts.modules.smart_embed_model.class({
settings: this.settings.embed_model,
adapters: this.env.opts.modules.smart_embed_model?.adapters,
re_render_settings: this.re_render_settings.bind(this),
reload_model: this.reload_embed_model.bind(this)
});
return this.env._embed_model;
}
set embed_model(embed_model) {
this.env._embed_model = embed_model;
}
reload_embed_model() {
console.log("reload_embed_model");
this.embed_model.unload();
this.env._embed_model = null;
}
re_render_settings() {
this.settings_container.innerHTML = "";
this.render_settings();
}
/**
* Finds the nearest entities to a given entity.
* @async
* @param {Object} entity - The reference entity.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async nearest_to(entity, filter = {}) {
return await this.nearest(entity.vec, filter);
}
/**
* Finds the nearest entities to a vector using the default adapter.
* @async
* @param {Array<number>} vec - The vector to compare against.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async nearest(vec, filter = {}) {
if (!vec) {
console.warn("nearest: no vec");
return [];
}
return await this.entities_vector_adapter.nearest(vec, filter);
}
/**
* Finds the furthest entities from a vector using the default adapter.
* @async
* @param {Array<number>} vec - The vector to compare against.
* @param {Object} [filter={}] - Optional filters to apply.
* @returns {Promise<Array<{item:Object, score:number}>>} An array of result objects with score and item.
*/
async furthest(vec, filter = {}) {
if (!vec)
return console.warn("furthest: no vec");
return await this.entities_vector_adapter.furthest(vec, filter);
}
/**
* Gets the file name based on collection key and embedding model key.
* @readonly
* @returns {string} The constructed file name.
*/
get file_name() {
return this.collection_key + "-" + this.embed_model_key.split("/").pop();
}
/**
* Calculates the relevance of an item based on the search filter.
* @param {Object} item - The item to calculate relevance for.
* @param {Object} search_filter - The search filter containing keywords.
* @returns {number} The relevance score:
*                   1 if any keyword is found in the item's path,
*                   0 otherwise (default relevance for keyword in content).
*/
calculate_relevance(item, search_filter) {
if (search_filter.keywords.some((keyword) => item.path?.includes(keyword)))
return 1;
return 0;
}
/**
* Prepares the filter options by incorporating entity-based filters.
* @param {Object} [opts={}] - The filter options.
* @param {Object} [opts.entity] - The entity to base the filters on.
* @param {string|string[]} [opts.exclude_filter] - Keys or prefixes to exclude.
* @param {string|string[]} [opts.include_filter] - Keys or prefixes to include.
* @param {boolean} [opts.exclude_inlinks] - Whether to exclude inlinks of the entity.
* @param {boolean} [opts.exclude_outlinks] - Whether to exclude outlinks of the entity.
* @returns {Object} The modified filter options.
*/
prepare_filter(opts = {}) {
const {
entity,
exclude_filter,
include_filter,
exclude_inlinks,
exclude_outlinks
} = opts;
if (entity) {
if (typeof opts.exclude_key_starts_with_any === "undefined")
opts.exclude_key_starts_with_any = [];
if (opts.exclude_key_starts_with) {
opts.exclude_key_starts_with_any = [
opts.exclude_key_starts_with
];
delete opts.exclude_key_starts_with;
}
opts.exclude_key_starts_with_any.push(entity.source_key || entity.key);
if (exclude_filter) {
if (!Array.isArray(opts.exclude_key_includes_any))
opts.exclude_key_includes_any = [];
if (typeof exclude_filter === "string")
opts.exclude_key_includes_any.push(exclude_filter);
else if (exclude_filter.includes(","))
opts.exclude_key_includes_any.push(...exclude_filter.split(","));
}
if (include_filter) {
if (!Array.isArray(opts.key_includes_any))
opts.key_includes_any = [];
if (typeof include_filter === "string")
opts.key_includes_any.push(include_filter);
else if (include_filter.includes(","))
opts.key_includes_any.push(...include_filter.split(","));
}
if (exclude_inlinks && entity?.inlinks?.length) {
if (!Array.isArray(opts.exclude_key_starts_with_any))
opts.exclude_key_starts_with_any = [];
opts.exclude_key_starts_with_any.push(...entity.inlinks);
}
if (exclude_outlinks && entity?.outlinks?.length) {
if (!Array.isArray(opts.exclude_key_starts_with_any))
opts.exclude_key_starts_with_any = [];
opts.exclude_key_starts_with_any.push(...entity.outlinks);
}
}
return opts;
}
/**
* Looks up entities based on hypothetical content.
* @async
* @param {Object} [params={}] - The parameters for the lookup.
* @param {Array<string>} [params.hypotheticals=[]] - The hypothetical content to lookup.
* @param {Object} [params.filter] - The filter to use for the lookup.
* @param {number} [params.k] - Deprecated: Use `filter.limit` instead.
* @returns {Promise<Array<Result>|Object>} The lookup results or an error object.
*/
async lookup(params = {}) {
const { hypotheticals = [] } = params;
if (!hypotheticals?.length)
return { error: "hypotheticals is required" };
if (!this.embed_model)
return { error: "Embedding search is not enabled." };
const hyp_vecs = await this.embed_model.embed_batch(hypotheticals.map((h) => ({ embed_input: h })));
const limit = params.filter?.limit || params.k || this.env.settings.lookup_k || 10;
if (params.filter?.limit)
delete params.filter.limit;
const filter = {
...this.env.chats?.current?.scope || {},
...params.filter || {}
};
const results = await hyp_vecs.reduce(async (acc_promise, embedding, i) => {
const acc = await acc_promise;
const results2 = await this.nearest(embedding.vec, filter);
results2.forEach((result) => {
if (!acc[result.item.path] || result.score > acc[result.item.path].score) {
acc[result.item.path] = {
key: result.item.key,
score: result.score,
item: result.item,
hypothetical_i: i
};
} else {
result.score = acc[result.item.path].score;
}
});
return acc;
}, Promise.resolve({}));
console.log(results);
const top_k = Object.values(results).sort(sort_by_score2).slice(0, limit);
console.log(`Found and returned ${top_k.length} ${this.collection_key}.`);
return top_k;
}
/**
* Gets the configuration for settings.
* @readonly
* @returns {Object} The settings configuration.
*/
get settings_config() {
return settings_config3;
}
async render_settings(container = this.settings_container, opts = {}) {
container = await this.render_collection_settings(container, opts);
const embed_model_settings_frag = await this.env.render_component("settings", this.embed_model, opts);
container.appendChild(embed_model_settings_frag);
return container;
}
/**
* Gets the notices from the environment.
* @readonly
* @returns {Object} The notices object.
*/
get notices() {
return this.env.smart_connections_plugin?.notices || this.env.main?.notices;
}
/**
* Gets the embed queue containing items to be embedded.
* @readonly
* @returns {Array<Object>} The embed queue.
*/
get embed_queue() {
if (!this._embed_queue?.length)
this._embed_queue = Object.values(this.items).filter((item) => item._queue_embed && item.should_embed);
return this._embed_queue;
}
/**
* Processes the embed queue by delegating to the default vector adapter.
* @async
* @returns {Promise<void>}
*/
async process_embed_queue() {
await this.entities_vector_adapter.process_embed_queue();
}
/**
* Handles changes to the embedding model by reinitializing and processing the load queue.
* @async
* @returns {Promise<void>}
*/
async embed_model_changed() {
await this.unload();
await this.init();
this.render_settings();
await this.process_load_queue();
}
get connections_filter_config() {
return connections_filter_config2;
}
};
var settings_config3 = {
"min_chars": {
name: "Minimum length",
type: "number",
description: "Minimum length of entity to embed (in characters).",
placeholder: "Enter number ex. 300",
default: 300
}
};
var connections_filter_config2 = {
"smart_view_filter.show_full_path": {
"name": "Show full path",
"type": "toggle",
"description": "Show full path in view."
},
"smart_view_filter.render_markdown": {
"name": "Render markdown",
"type": "toggle",
"description": "Render markdown in results."
},
"smart_view_filter.results_limit": {
"name": "Results limit",
"type": "number",
"description": "Limit the number of results.",
"default": 20
},
"smart_view_filter.exclude_inlinks": {
"name": "Exclude inlinks (backlinks)",
"type": "toggle",
"description": "Exclude notes that link to the current note."
},
"smart_view_filter.exclude_outlinks": {
"name": "Exclude outlinks",
"type": "toggle",
"description": "Exclude links already in the current document."
},
"smart_view_filter.include_filter": {
"name": "Include filter",
"type": "text",
"description": "Require that result file path matches this value."
},
"smart_view_filter.exclude_filter": {
"name": "Exclude filter",
"type": "text",
"description": "Exclude results with file path that matches this value."
}
};

async function create_hash2(text) {
if (text.length > 1e5)
text = text.substring(0, 1e5);
const msgUint8 = new TextEncoder().encode(text.trim());
const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
return hashHex;
}

var SmartBlock = class extends SmartEntity2 {
/**
* Provides default values for a SmartBlock instance.
* @static
* @readonly
* @returns {Object} The default values.
*/
static get defaults() {
return {
data: {
text: null,
length: 0,
last_read: {
hash: null,
at: 0
}
},
_embed_input: ""
};
}
get block_adapter() {
if (!this._block_adapter) {
this._block_adapter = new this.collection.opts.block_adapters[this.file_type](this);
}
return this._block_adapter;
}
/**
* Initializes the SmartBlock instance by queuing an embed if embedding is enabled.
* @returns {void}
*/
init() {
if (this.settings.embed_blocks)
super.init();
}
/**
* Queues the entity for embedding.
* @returns {void}
*/
queue_embed() {
this._queue_embed = true;
this.source?.queue_embed();
}
/**
* Queues the block for import via the source.
* @returns {void}
*/
queue_import() {
this.source?.queue_import();
}
/**
* Updates the block's data, clearing embeddings if necessary and preparing embed input.
* @param {Object} data - The new data to merge into the block.
* @returns {boolean} `true` if data was updated successfully.
*/
update_data(data) {
if (this.should_clear_embeddings(data)) {
this.data.embeddings = {};
}
super.update_data(data);
return true;
}
/**
* Determines whether to clear embeddings based on the new data.
* @param {Object} data - The new data to evaluate.
* @returns {boolean} `true` if embeddings should be cleared, `false` otherwise.
*/
should_clear_embeddings(data) {
if (this.is_new)
return true;
if (this.embed_model && this.vec?.length !== this.embed_model.model_config.dims)
return true;
return false;
}
/**
* Prepares the embed input for the SmartBlock by reading content and generating a hash.
* @async
* @returns {Promise<string|false>} The embed input string or `false` if already embedded.
*/
async get_embed_input(content = null) {
if (typeof this._embed_input !== "string" || !this._embed_input.length) {
if (!content)
content = await this.read();
this._embed_input = this.breadcrumbs + "\n" + content;
}
return this._embed_input;
}
/**
* @method read
* @description Reads the block content by delegating to the block adapter.
* @async
* @returns {Promise<string>} The block content.
*/
async read() {
try {
return await this.block_adapter.read();
} catch (e) {
if (e.message.includes("BLOCK NOT FOUND")) {
return 'BLOCK NOT FOUND (run "Prune" to remove)';
} else {
throw e;
}
}
}
/**
* @method append
* @description Appends content to this block by delegating to the block adapter.
* @async
* @param {string} content
* @returns {Promise<void>}
*/
async append(content) {
await this.block_adapter.append(content);
this.queue_save();
}
/**
* @method update
* @description Updates the block content by delegating to the block adapter.
* @async
* @param {string} new_block_content
* @param {Object} [opts={}]
* @returns {Promise<void>}
*/
async update(new_block_content, opts = {}) {
await this.block_adapter.update(new_block_content, opts);
this.queue_save();
}
/**
* @method remove
* @description Removes the block by delegating to the block adapter.
* @async
* @returns {Promise<void>}
*/
async remove() {
await this.block_adapter.remove();
this.queue_save();
}
/**
* @method move_to
* @description Moves the block to another location by delegating to the block adapter.
* @async
* @param {string} to_key
* @returns {Promise<void>}
*/
async move_to(to_key) {
await this.block_adapter.move_to(to_key);
this.queue_save();
}
/**
* Retrieves the breadcrumbs representing the block's path within the source.
* @readonly
* @returns {string} The breadcrumbs string.
*/
get breadcrumbs() {
return this.key.split("/").join(" > ").split("#").slice(0, -1).join(" > ").replace(".md", "");
}
/**
* Determines if the block is excluded from embedding based on headings.
* @readonly
* @returns {boolean} `true` if excluded, `false` otherwise.
*/
get excluded() {
const block_headings = this.path.split("#").slice(1);
if (this.source_collection.excluded_headings.some((heading) => block_headings.includes(heading)))
return true;
return this.source.excluded;
}
/**
* Retrieves the file path of the SmartSource associated with the block.
* @readonly
* @returns {string} The file path.
*/
get file_path() {
return this.source?.file_path;
}
/**
* Retrieves the file type of the SmartSource associated with the block.
* @readonly
* @returns {string} The file type.
*/
get file_type() {
return this.source.file_type;
}
/**
* Retrieves the folder path of the block.
* @readonly
* @returns {string} The folder path.
*/
get folder() {
return this.path.split("/").slice(0, -1).join("/");
}
/**
* Retrieves the embed link for the block.
* @readonly
* @returns {string} The embed link.
*/
get embed_link() {
return `![[${this.link}]]`;
}
/**
* Determines if the block has valid line range information.
* @readonly
* @returns {boolean} `true` if the block has both start and end lines, `false` otherwise.
*/
get has_lines() {
return this.lines && this.lines.length === 2;
}
/**
* Determines if the entity is a block based on its key.
* @readonly
* @returns {boolean} `true` if it's a block, `false` otherwise.
*/
get is_block() {
return this.key.includes("#");
}
/**
* Determines if the block is gone (i.e., the source file or block data no longer exists).
* @readonly
* @returns {boolean} `true` if gone, `false` otherwise.
*/
get is_gone() {
if (!this.source?.file)
return true;
if (!this.source?.data?.blocks?.[this.sub_key])
return true;
return false;
}
get last_read() {
return this.data.last_read;
}
/**
* Retrieves the sub-key of the block.
* @readonly
* @returns {string} The sub-key.
*/
get sub_key() {
return "#" + this.key.split("#").slice(1).join("#");
}
/**
* Retrieves the lines range of the block.
* @readonly
* @returns {Array<number>|undefined} An array containing the start and end lines or `undefined` if not set.
*/
get lines() {
return this.data.lines;
}
/**
* Retrieves the starting line number of the block.
* @readonly
* @returns {number|undefined} The starting line number or `undefined` if not set.
*/
get line_start() {
return this.lines?.[0];
}
/**
* Retrieves the ending line number of the block.
* @readonly
* @returns {number|undefined} The ending line number or `undefined` if not set.
*/
get line_end() {
return this.lines?.[1];
}
/**
* Retrieves the link associated with the block, handling page numbers if present.
* @readonly
* @returns {string} The block link.
*/
get link() {
if (/^.*page\s*(\d+).*$/i.test(this.sub_key)) {
const number = this.sub_key.match(/^.*page\s*(\d+).*$/i)[1];
return `${this.source.path}#page=${number}`;
} else {
return this.source?.path || "MISSING SOURCE";
}
}
/**
* Retrieves the display name of the block.
* @readonly
* @returns {string} The display name.
*/
get name() {
const source_name = this.source?.name;
if (!source_name)
return "MISSING SOURCE";
const block_path_parts = this.key.split("#").slice(1);
if (this.should_show_full_path)
return [source_name, ...block_path_parts].join(" > ");
if (block_path_parts[block_path_parts.length - 1][0] === "{")
block_path_parts.pop();
return [source_name, block_path_parts.pop()].join(" > ");
}
get next_block() {
if (!this.data.lines)
return null;
const next_line = this.data.lines[1] + 1;
return this.source.blocks?.find((block) => next_line === block.data?.lines?.[0]);
}
/**
* Retrieves the paths of outlinks from the block.
* @readonly
* @returns {Array<string>} An array of outlink paths.
*/
get outlinks() {
return this.source.outlinks;
}
/**
* Retrieves the path of the SmartBlock.
* @readonly
* @returns {string} The path of the SmartBlock.
*/
get path() {
return this.key;
}
/**
* Determines if the block should be embedded based on its coverage and size.
* @readonly
* @returns {boolean} `true` if it should be embedded, `false` otherwise.
*/
get should_embed() {
try {
if (this.settings?.min_chars && this.size < this.settings.min_chars)
return false;
const match_line_start = this.line_start + 1;
const match_line_end = this.line_end;
const { has_line_start, has_line_end } = Object.entries(this.source?.data?.blocks || {}).reduce((acc, [key, range]) => {
if (!key.startsWith(this.sub_key + "#"))
return acc;
if (range[0] === match_line_start)
acc.has_line_start = key;
if (range[1] === match_line_end)
acc.has_line_end = key;
return acc;
}, { has_line_start: null, has_line_end: null });
if (has_line_start && has_line_end) {
const start_block = this.collection.get(this.source_key + has_line_start);
if (start_block?.should_embed) {
const end_block = this.collection.get(this.source_key + has_line_end);
if (end_block?.should_embed)
return false;
}
}
return true;
} catch (e) {
console.error(e, e.stack);
console.error(`Error getting should_embed for ${this.key}: ` + JSON.stringify(e || {}, null, 2));
}
}
/**
* Retrieves the size of the SmartBlock.
* @readonly
* @returns {number} The size of the SmartBlock.
*/
get size() {
return this.data.size;
}
/**
* Retrieves the SmartSource associated with the block.
* @readonly
* @returns {SmartSource} The associated SmartSource instance.
*/
get source() {
return this.source_collection.get(this.source_key);
}
/**
* Retrieves the SmartSources collection instance.
* @readonly
* @returns {SmartSources} The SmartSources collection.
*/
get source_collection() {
return this.env.smart_sources;
}
get source_key() {
return this.key.split("#")[0];
}
get sub_blocks() {
return this.source?.blocks?.filter((block) => block.key.startsWith(this.key + "#") && block.line_start > this.line_start && block.line_end <= this.line_end) || [];
}
get excluded_lines() {
return this.source.excluded_lines;
}
get file() {
return this.source.file;
}
get is_canvas() {
return this.source.is_canvas;
}
get is_excalidraw() {
return this.source.is_excalidraw;
}
get mtime() {
return this.source.mtime;
}
/**
* @deprecated Use `source` instead.
* @readonly
* @returns {SmartSource} The associated SmartSource instance.
*/
get note() {
return this.source;
}
/**
* @deprecated Use `source.key` instead.
* @readonly
* @returns {string} The source key.
*/
get note_key() {
return this.key.split("#")[0];
}
};
var smart_block_default = {
class: SmartBlock,
actions: {
find_connections: find_connections3
}
};

var SmartBlocks = class extends SmartEntities2 {
/**
* Initializes the SmartBlocks instance. Currently muted as processing is handled by SmartSources.
* @returns {void}
*/
init() {
}
get fs() {
return this.env.smart_sources.fs;
}
/**
* Retrieves the embedding model associated with the SmartSources collection.
* @readonly
* @returns {Object|undefined} The embedding model instance or `undefined` if not set.
*/
get embed_model() {
return this.source_collection?.embed_model;
}
/**
* Retrieves the embedding model key from the SmartSources collection.
* @readonly
* @returns {string|undefined} The embedding model key or `undefined` if not set.
*/
get embed_model_key() {
return this.source_collection?.embed_model_key;
}
/**
* Calculates the expected number of blocks based on the SmartSources collection.
* @readonly
* @returns {number} The expected count of blocks.
*/
get expected_blocks_ct() {
return Object.values(this.source_collection.items).reduce((acc, item) => acc += Object.keys(item.data.blocks || {}).length, 0);
}
/**
* Retrieves the notices system from the environment.
* @readonly
* @returns {Object} The notices object.
*/
get notices() {
return this.env.smart_connections_plugin?.notices || this.env.main?.notices;
}
/**
* Retrieves the settings configuration for SmartBlocks.
* @readonly
* @returns {Object} The settings configuration object.
*/
get settings_config() {
return this.process_settings_config({
"embed_blocks": {
name: "Utilize Smart Blocks",
type: "toggle",
description: "Creates more granular embeddings by splitting sources into smaller chunks. This may improve search results especially for large documents that have well-defined sections.",
default: true
},
...super.settings_config
});
}
render_settings(container, opts = {}) {
return this.render_collection_settings(container, opts);
}
get data_dir() {
return "multi";
}
/**
* Retrieves the SmartSources collection instance.
* @readonly
* @returns {SmartSources} The SmartSources collection.
*/
get source_collection() {
return this.env.smart_sources;
}
/**
* Processes the embed queue. Currently handled by SmartSources, so this method is muted.
* @async
* @returns {Promise<void>}
*/
async process_embed_queue() {
}
/**
* Processes the load queue. Currently muted as processing is handled by SmartSources.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async prune() {
throw "Not implemented: prune";
}
/**
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {void}
*/
build_links_map() {
throw "Not implemented: build_links_map";
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async refresh() {
throw "Not implemented: refresh";
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async search() {
throw "Not implemented: search";
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async run_data_load() {
throw "Not implemented: run_data_load";
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async run_re_import() {
throw "Not implemented: run_re_import";
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async run_refresh() {
throw "Not implemented: run_refresh";
}
/**
* @async
* @throws {Error} Throws an error indicating the method is not implemented.
* @returns {Promise<void>}
*/
async run_force_refresh() {
throw "Not implemented: run_force_refresh";
}
};

var CollectionDataAdapter2 = class {
/**
* @constructor
* @param {Object} collection - The collection instance that this adapter manages.
*/
constructor(collection) {
this.collection = collection;
this.env = collection.env;
}
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = ItemDataAdapter2;
/**
* Optional factory method to create item adapters.
* If `this.item_adapter_class` is not null, it uses that; otherwise can be overridden by subclasses.
* @param {Object} item - The item to create an adapter for.
* @returns {ItemDataAdapter}
*/
create_item_adapter(item) {
if (!this.ItemDataAdapter) {
throw new Error("No item_adapter_class specified and create_item_adapter not overridden.");
}
return new this.ItemDataAdapter(item);
}
/**
* Load a single item by its key using an `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item(key) {
throw new Error("Not implemented");
}
/**
* Save a single item by its key using its associated `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to save.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save_item(key) {
throw new Error("Not implemented");
}
/**
* Delete a single item by its key. This may involve updating or removing its file,
* as handled by the `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to delete.
* @returns {Promise<void>} Resolves when the item is deleted.
*/
async delete_item(key) {
throw new Error("Not implemented");
}
/**
* Process any queued load operations. Typically orchestrates calling `load_item()`
* on items that have been flagged for loading.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
throw new Error("Not implemented");
}
/**
* Process any queued save operations. Typically orchestrates calling `save_item()`
* on items that have been flagged for saving.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
throw new Error("Not implemented");
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item_if_updated(item) {
const adapter = this.create_item_adapter(item);
await adapter.load_if_updated();
}
};
var ItemDataAdapter2 = class {
/**
* @constructor
* @param {Object} item - The collection item instance that this adapter manages.
*/
constructor(item) {
this.item = item;
}
/**
* Load the item's data from storage. May involve reading a file and parsing
* its contents, then updating `item.data`.
* @async
* @returns {Promise<void>} Resolves when the item is fully loaded.
*/
async load() {
throw new Error("Not implemented");
}
/**
* Save the item's data to storage. May involve writing to a file or appending
* lines in an append-only format.
* @async
* @param {string|null} [ajson=null] - An optional serialized representation of the item’s data.
*                                     If not provided, the adapter should derive it from the item.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save(ajson = null) {
throw new Error("Not implemented");
}
/**
* Delete the item's data from storage. May involve removing a file or writing
* a `null` entry in an append-only file to signify deletion.
* @async
* @returns {Promise<void>} Resolves when the item’s data is deleted.
*/
async delete() {
throw new Error("Not implemented");
}
/**
* Returns the file path or unique identifier used by this adapter to locate and store
* the item's data. This may be a file name derived from the item's key.
* @returns {string} The path or identifier for the item's data.
*/
get data_path() {
throw new Error("Not implemented");
}
/**
* @returns {CollectionDataAdapter} The collection data adapter that this item data adapter belongs to.
*/
get collection_adapter() {
return this.item.collection.data_adapter;
}
get env() {
return this.item.env;
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_if_updated() {
throw new Error("Not implemented");
}
};

var FileCollectionDataAdapter2 = class extends CollectionDataAdapter2 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = FileItemDataAdapter2;
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.collection.data_fs || this.collection.env.data_fs;
}
};
var FileItemDataAdapter2 = class extends ItemDataAdapter2 {
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.item.collection.data_fs || this.item.collection.env.data_fs;
}
get data_path() {
throw new Error("Not implemented");
}
async load_if_updated() {
const data_path = this.data_path;
if (await this.fs.exists(data_path)) {
const loaded_at = this.item.loaded_at || 0;
const data_file_stat = await this.fs.stat(data_path);
if (data_file_stat.mtime > loaded_at + 1 * 60 * 1e3) {
console.log(`Smart Collections: Re-loading item ${this.item.key} because it has been updated on disk`);
await this.load();
}
}
}
};

var class_to_collection_key2 = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
var AjsonMultiFileCollectionDataAdapter2 = class extends FileCollectionDataAdapter2 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = AjsonMultiFileItemDataAdapter2;
/**
* Load a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async load_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.load();
}
/**
* Save a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async save_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.save();
}
/**
* Process any queued load operations.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const load_queue = Object.values(this.collection.items).filter((item) => item._queue_load);
if (!load_queue.length) {
this.collection.clear_process_notice("loading_collection");
return;
}
console.log(`Loading ${this.collection.collection_key}: ${load_queue.length} items`);
const batch_size = 100;
for (let i = 0; i < load_queue.length; i += batch_size) {
const batch = load_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.load().catch((err) => {
console.warn(`Error loading item ${item.key}`, err);
item.queue_load();
});
}));
}
console.log(`Loaded ${this.collection.collection_key} in ${this.collection.load_time_ms}ms`);
this.collection.loaded = load_queue.length;
this.collection.clear_process_notice("loading_collection");
}
/**
* Process any queued save operations.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
console.log(`Saving ${this.collection.collection_key}: ${save_queue.length} items`);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
get_item_data_path(key) {
return [
this.collection.data_dir || "multi",
this.fs?.sep || "/",
this.get_data_file_name(key) + ".ajson"
].join("");
}
/**
* Transforms the item key into a safe filename.
* Replaces spaces, slashes, and dots with underscores.
* @returns {string} safe file name
*/
get_data_file_name(key) {
return key.split("#")[0].replace(/[\s\/\.]/g, "_").replace(".md", "");
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson(item) {
const collection_key = item.collection_key;
const key = item.key;
const data_value = item.deleted ? "null" : JSON.stringify(item.data);
return `${JSON.stringify(`${collection_key}:${key}`)}: ${data_value},`;
}
};
var AjsonMultiFileItemDataAdapter2 = class extends FileItemDataAdapter2 {
/**
* Derives the `.ajson` file path from the collection's data_dir and item key.
* @returns {string}
*/
get data_path() {
return this.collection_adapter.get_item_data_path(this.item.key);
}
/**
* Load the item from its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async load() {
try {
const raw_data = await this.fs.adapter.read(this.data_path, "utf-8", { no_cache: true });
if (!raw_data) {
this.item.queue_import();
return;
}
const { rewrite, file_data } = this._parse(raw_data);
if (rewrite) {
if (file_data.length)
await this.fs.write(this.data_path, file_data);
else
await this.fs.remove(this.data_path);
}
const last_import_mtime = this.item.data.last_import?.at || 0;
if (last_import_mtime && this.item.init_file_mtime > last_import_mtime) {
this.item.queue_import();
}
} catch (e) {
this.item.queue_import();
}
}
/**
* Parse the entire AJSON content as a JSON object, handle legacy keys, and extract final state.
* @private
* @param {string} ajson
* @returns {boolean}
*/
_parse(ajson) {
try {
let rewrite = false;
if (!ajson.length)
return false;
ajson = ajson.trim();
const original_line_count = ajson.split("\n").length;
const json_str = "{" + ajson.slice(0, -1) + "}";
const data = JSON.parse(json_str);
const entries = Object.entries(data);
for (let i = 0; i < entries.length; i++) {
const [ajson_key, value] = entries[i];
if (!value) {
delete data[ajson_key];
rewrite = true;
continue;
}
const { collection_key, item_key, changed } = this._parse_ajson_key(ajson_key);
if (changed) {
rewrite = true;
data[collection_key + ":" + item_key] = value;
delete data[ajson_key];
}
const collection = this.env[collection_key];
if (!collection)
continue;
const existing_item = collection.get(item_key);
if (!value.key)
value.key = item_key;
if (existing_item) {
existing_item.data = value;
existing_item._queue_load = false;
existing_item.loaded_at = Date.now();
} else {
const ItemClass = collection.item_type;
const new_item = new ItemClass(this.env, value);
new_item._queue_load = false;
new_item.loaded_at = Date.now();
collection.set(new_item);
}
}
if (rewrite || original_line_count > entries.length) {
rewrite = true;
}
return {
rewrite,
file_data: rewrite ? Object.entries(data).map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)},`).join("\n") : null
};
} catch (e) {
if (ajson.split("\n").some((line) => !line.endsWith(","))) {
console.warn("fixing trailing comma error");
ajson = ajson.split("\n").map((line) => line.endsWith(",") ? line : line + ",").join("\n");
return this._parse(ajson);
}
console.warn("Error parsing JSON:", e);
return { rewrite: true, file_data: null };
}
}
_parse_ajson_key(ajson_key) {
let changed;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key2[collection_key]) {
collection_key = class_to_collection_key2[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
/**
* Save the current state of the item by appending a new line to its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async save(retries = 0) {
try {
const ajson_line = this.get_item_ajson();
await this.fs.append(this.data_path, "\n" + ajson_line);
this.item._queue_save = false;
} catch (e) {
if (e.code === "ENOENT" && retries < 1) {
console.warn("ENOENT, creating directory", this.data_path);
const dir = this.collection_adapter.collection.data_dir;
if (!await this.fs.exists(dir)) {
await this.fs.mkdir(dir);
}
return await this.save(retries + 1);
}
console.warn("Error saving item", this.data_path, e);
}
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson() {
return this.collection_adapter.get_item_ajson(this.item);
}
};

var AjsonMultiFileBlocksDataAdapter = class extends AjsonMultiFileCollectionDataAdapter2 {
ItemDataAdapter = AjsonMultiFileBlockDataAdapter;
/**
* Transforms the item key into a safe filename.
* Replaces spaces, slashes, and dots with underscores.
* @returns {string} safe file name
*/
get_data_file_name(key) {
return key.split("#")[0].replace(/[\s\/\.]/g, "_").replace(".md", "");
}
/**
* Process any queued save operations.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
console.log(`Saving ${this.collection.collection_key}: ${save_queue.length} items`);
const time_start = Date.now();
const save_files = Object.entries(save_queue.reduce((acc, item) => {
const file_name = this.get_item_data_path(item.key);
acc[file_name] = acc[file_name] || [];
acc[file_name].push(item);
return acc;
}, {}));
for (let i = 0; i < save_files.length; i++) {
const [file_name, items] = save_files[i];
await this.fs.append(
file_name,
items.map((item) => this.get_item_ajson(item)).join("\n") + "\n"
);
items.forEach((item) => item._queue_save = false);
}
console.log(`Saved ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
process_load_queue() {
console.log(`Skipping loading ${this.collection.collection_key}...`);
}
};
var AjsonMultiFileBlockDataAdapter = class extends AjsonMultiFileItemDataAdapter2 {
};

var BlockContentAdapter = class {
/**
* @constructor
* @param {Object} item - The SmartBlock instance this adapter operates on.
* The `item` should at least provide `data` and references to its parent source.
*/
constructor(item) {
this.item = item;
}
/**
* @async
* @method read
* @abstract
* @returns {Promise<string>} The content of the block.
* @throws {Error} If not implemented by subclass.
*/
async read() {
throw new Error("Not implemented");
}
/**
* @async
* @method append
* @abstract
* @param {string} content Content to append to the block.
* @returns {Promise<void>}
* @throws {Error} If not implemented by subclass.
*/
async append(content) {
throw new Error("Not implemented");
}
/**
* @async
* @method update
* @abstract
* @param {string} new_content The new content for the block.
* @param {Object} [opts={}] Additional update options.
* @returns {Promise<void>}
* @throws {Error} If not implemented by subclass.
*/
async update(new_content, opts = {}) {
throw new Error("Not implemented");
}
/**
* @async
* @method remove
* @abstract
* @returns {Promise<void>}
* @throws {Error} If not implemented by subclass.
*/
async remove() {
throw new Error("Not implemented");
}
/**
* @async
* @method move_to
* @abstract
* @param {string} to_key The destination key (source or block reference).
* @returns {Promise<void>}
* @throws {Error} If not implemented by subclass.
*/
async move_to(to_key) {
throw new Error("Not implemented");
}
/**
* @name data
* @type {Object}
* @readonly
* @description Access the block’s data object. Useful for updating metadata like line references or hashes.
*/
get data() {
return this.item.data;
}
/**
* @async
* @method update_last_read
* @param {string} content The current content of the block.
* @returns {Promise<void>}
* @description Update the block’s `last_read` hash and timestamp based on the given content.
*/
async update_last_read(content) {
this.data.last_read = {
hash: await this.create_hash(content),
at: Date.now()
};
}
/**
* @async
* @method create_hash
* @param {string} content The content to hash.
* @returns {Promise<string>} The computed hash of the content.
* @description Hash the block content to detect changes and prevent unnecessary re-embeddings.
*/
async create_hash(content) {
return await create_hash2(content);
}
};

var MarkdownBlockContentAdapter = class extends BlockContentAdapter {
/**
* Read the content of the block.
* @async
* @returns {Promise<string>} The block content as a string.
* @throws {Error} If the block cannot be found.
*/
async read() {
const source_content = await this.item.source.read();
const content = this._extract_block(source_content);
this.update_last_read(content);
return content;
}
/**
* Append content to the existing block.
* This method inserts additional lines after the block's end, then re-parses the file to update line references.
* @async
* @param {string} content Content to append to the block.
* @returns {Promise<void>}
* @throws {Error} If the block cannot be found.
*/
async append(content) {
let full_content = await this.item.source.read();
const { line_start, line_end } = this.item;
if (!line_start || !line_end) {
throw new Error(`Cannot append to block ${this.item.key}: invalid line references.`);
}
const lines = full_content.split("\n");
lines.splice(line_end, 0, "", content);
const updated_content = lines.join("\n");
await this.item.source._update(updated_content);
await this._reparse_source();
}
/**
* Update the block with new content, replacing its current lines.
* @async
* @param {string} new_content New content for the block.
* @param {Object} [opts={}] Additional options.
* @returns {Promise<void>}
* @throws {Error} If the block cannot be found.
*/
async update(new_content, opts = {}) {
let full_content = await this.item.source.read();
const { line_start, line_end } = this.item;
if (!line_start || !line_end) {
throw new Error(`Cannot update block ${this.item.key}: invalid line references.`);
}
const lines = full_content.split("\n");
const updated_lines = [
...lines.slice(0, line_start - 1),
...new_content.split("\n"),
...lines.slice(line_end)
];
const updated_content = updated_lines.join("\n");
await this.item.source._update(updated_content);
await this._reparse_source();
}
/**
* Remove the block entirely from the source.
* @async
* @returns {Promise<void>}
* @throws {Error} If the block cannot be found.
*/
async remove() {
let full_content = await this.item.source.read();
const { line_start, line_end } = this.item;
if (!line_start || !line_end) {
throw new Error(`Cannot remove block ${this.item.key}: invalid line references.`);
}
const lines = full_content.split("\n");
const updated_lines = [
...lines.slice(0, line_start - 1),
...lines.slice(line_end)
];
const updated_content = updated_lines.join("\n");
await this.item.source._update(updated_content);
await this._reparse_source();
}
/**
* Move the block to a new location (another source or heading).
* This involves reading the block content, removing it from the current source, and appending it to the target.
* @async
* @param {string} to_key The destination path or entity reference.
* @returns {Promise<void>}
* @throws {Error} If the block or target is invalid.
*/
async move_to(to_key) {
const content = await this.read();
await this.remove();
const is_block_ref = to_key.includes("#");
let target_source_key = is_block_ref ? to_key.split("#")[0] : to_key;
const target_source = this.item.env.smart_sources.get(target_source_key);
if (!target_source) {
await this.item.env.smart_sources.create(target_source_key, content);
return;
}
if (is_block_ref) {
const target_block = this.item.env.smart_blocks.get(to_key);
if (target_block) {
await target_block.append(content);
} else {
await target_source.append(content);
}
} else {
await target_source.append(content);
}
}
/**
* Extract the block content using current line references from a full source content.
* @private
* @param {string} source_content Full source file content.
* @returns {string} Extracted block content.
* @throws {Error} If the block cannot be found.
*/
_extract_block(source_content) {
if (!source_content) {
console.warn(`BLOCK NOT FOUND: ${this.item.key} has no source content.`);
return "";
}
const { line_start, line_end } = this.item;
if (!line_start || !line_end) {
throw new Error(`BLOCK NOT FOUND: ${this.item.key} has invalid line references.`);
}
const lines = source_content.split("\n");
const selected = lines.slice(line_start - 1, line_end);
return selected.join("\n");
}
/**
* Re-parse the source file after a CRUD operation to update line references for all blocks.
* @private
* @async
* @returns {Promise<void>}
*/
async _reparse_source() {
await this.item.source.import();
}
};

var import_obsidian10 = require("obsidian");

var import_obsidian3 = require("obsidian");

var NOTICES = {
item_excluded: {
en: "Cannot show Smart Connections for excluded entity: {{entity_key}}"
},
load_env: {
en: "Mobile detected: to prevent performance issues, click to load Smart Environment when ready.",
button: {
en: `Load Smart Env`,
callback: (env) => {
env.manual_load();
}
},
timeout: 0
},
missing_entity: {
en: "No entity found for key: {{key}}"
},
notice_muted: {
en: "Notice muted"
},
new_version_available: {
en: "A new version is available! (v{{version}})",
timeout: 15e3,
button: {
en: "Release notes",
callback: (scope) => {
window.open("https://github.com/brianpetro/obsidian-smart-connections/releases", "_blank");
}
}
},
new_early_access_version_available: {
en: "A new early access version is available! (v{{version}})"
},
supporter_key_required: {
en: "Supporter license key required for early access update"
},
revert_to_stable_release: {
en: 'Click "Check for Updates" in the community plugins tab and complete the update for Smart Connections to finish reverting to the stable release.',
timeout: 0
},
action_installed: {
en: 'Installed action "{{name}}"'
},
action_install_error: {
en: 'Error installing action "{{name}}": {{error}}',
timeout: 0
},
embed_model_not_loaded: {
en: "Embed model not loaded. Please wait for the model to load and try again."
},
embed_search_text_failed: {
en: "Failed to embed search text."
},
error_in_embedding_search: {
en: "Error in embedding search. See console for details."
},
copied_to_clipboard: {
en: "Message: {{content}} copied successfully."
},
copy_failed: {
en: "Unable to copy message to clipboard."
},
copied_chatgpt_url_to_clipboard: {
en: "ChatGPT URL copied to clipboard."
},
loading_collection: {
en: "Loading {{collection_key}}..."
},
done_loading_collection: {
en: "{{collection_key}} loaded."
},
saving_collection: {
en: "Saving {{collection_key}}..."
},
initial_scan: {
en: "[{{collection_key}}] Starting initial scan...",
timeout: 0
},
done_initial_scan: {
en: "[{{collection_key}}] Initial scan complete.",
timeout: 3e3
},
pruning_collection: {
en: "Pruning {{collection_key}}..."
},
done_pruning_collection: {
en: "Pruned {{count}} items from {{collection_key}}."
},
embedding_progress: {
en: "Embedding progress: {{progress}} / {{total}}\n{{tokens_per_second}} tokens/sec using {{model_name}}",
button: {
en: "Pause",
callback: (env) => {
console.log("pausing");
env.smart_sources.entities_vector_adapter.halt_embed_queue_processing();
}
},
timeout: 0
},
embedding_complete: {
en: "Embedding complete. {{total_embeddings}} embeddings created. {{tokens_per_second}} tokens/sec using {{model_name}}",
timeout: 0
},
embedding_paused: {
en: "Embedding paused. Progress: {{progress}} / {{total}}\n{{tokens_per_second}} tokens/sec using {{model_name}}",
button: {
en: "Resume",
callback: (env) => {
env.smart_sources.entities_vector_adapter.resume_embed_queue_processing(100);
}
},
timeout: 0
},
import_progress: {
en: "Importing... {{progress}} / {{total}} sources",
timeout: 0
},
done_import: {
en: "Import complete. {{count}} sources imported in {{time_in_seconds}}s",
timeout: 0
},
no_import_queue: {
en: "No items in import queue"
},
clearing_all: {
en: "Clearing all data...",
timeout: 0
},
done_clearing_all: {
en: "All data cleared and reimported",
timeout: 3e3
},
image_extracting: {
en: "Extracting text from Image(s)",
timeout: 0
},
pdf_extracting: {
en: "Extracting text from PDF(s)",
timeout: 0
},
insufficient_settings: {
en: "Insufficient settings for {{key}}, missing: {{missing}}",
timeout: 0
},
unable_to_init_source: {
en: "Unable to initialize source: {{key}}",
timeout: 0
},
reload_sources: {
en: "Reloaded sources in {{time_ms}}ms"
}
};

function define_default_create_methods(notices) {
for (const key of Object.keys(notices)) {
const notice_obj = notices[key];
if (typeof notice_obj.create !== "function") {
notice_obj.create = function(opts = {}) {
let text = this.en ?? key;
for (const [k, v] of Object.entries(opts)) {
text = text.replace(new RegExp(`{{${k}}}`, "g"), String(v));
}
let button;
if (!opts.button && this.button) {
const btn_label = typeof this.button.en === "string" ? this.button.en : "OK";
button = {
text: btn_label,
callback: typeof this.button.callback === "function" ? this.button.callback : () => {
}
};
} else {
button = opts.button;
}
let final_timeout = opts.timeout ?? this.timeout ?? 5e3;
return {
text,
button,
timeout: final_timeout,
confirm: opts.confirm,
immutable: opts.immutable
};
};
}
}
return notices;
}
var SmartNotices = class {
/**
* @param {Object} scope - The main plugin instance
*/
constructor(env, opts = {}) {
env?.create_env_getter(this);
this.active = {};
this.adapter = opts.adapter || this.env.config.modules.smart_notices.adapter;
define_default_create_methods(NOTICES);
}
/** plugin settings for notices (muted, etc.) */
get settings() {
if (!this.env?.settings?.smart_notices) {
this.env.settings.smart_notices = {};
}
if (!this.env?.settings?.smart_notices?.muted) {
this.env.settings.smart_notices.muted = {};
}
return this.env?.settings?.smart_notices;
}
/**
* Displays a notice by key or custom message.
* Usage:
*   notices.show('load_env', { scope: this });
*
* @param {string} id - The notice key or custom ID
* @param {object} opts - Additional user opts
*/
show(id, opts = {}) {
let message = null;
if (typeof opts === "string") {
message = opts;
} else {
opts = opts || {};
}
const normalized_id = this._normalize_notice_key(id);
if (this.settings?.muted?.[normalized_id]) {
if (opts.confirm?.callback) {
opts.confirm.callback();
}
return;
}
const notice_entry = NOTICES[id];
let derived = {
text: message || id,
timeout: opts.timeout ?? 5e3,
button: opts.button,
immutable: opts.immutable,
confirm: opts.confirm
};
if (notice_entry?.create) {
const result = notice_entry.create({ ...opts });
derived.text = message || result.text;
derived.timeout = result.timeout;
derived.button = result.button;
derived.immutable = result.immutable;
derived.confirm = result.confirm;
}
const content_fragment = this._build_fragment(normalized_id, derived.text, derived);
if (this.active[normalized_id]?.noticeEl?.isConnected) {
return this.active[normalized_id].setMessage(content_fragment, derived.timeout);
}
return this._render_notice(normalized_id, content_fragment, derived);
}
/**
* Normalizes the notice key to a safe string.
*/
_normalize_notice_key(key) {
return key.replace(/[^a-zA-Z0-9_-]/g, "_");
}
/**
* Creates and tracks the notice instance
*/
_render_notice(normalized_id, content_fragment, { timeout }) {
this.active[normalized_id] = new this.adapter(content_fragment, timeout);
return this.active[normalized_id];
}
/**
* Builds a DocumentFragment with notice text & possible buttons
*/
_build_fragment(id, text, { button, confirm: confirm2, immutable }) {
const frag = document.createDocumentFragment();
frag.createEl("p", {
cls: "sc-notice-head",
text: `[Smart Env v${this.env.constructor.version}]`
});
const content = frag.createEl("p", { cls: "sc-notice-content", text });
const actions = frag.createEl("div", { cls: "sc-notice-actions" });
if (confirm2?.text && typeof confirm2.callback === "function") {
this._add_button(confirm2, actions);
}
if (button?.text && typeof button.callback === "function") {
this._add_button(button, actions);
}
if (!immutable) {
this._add_mute_button(id, actions);
}
return frag;
}
/**
* Creates a <button> appended to the container
*/
_add_button(btnConfig, container) {
const btn = document.createElement("button");
btn.innerHTML = btnConfig.text;
btn.addEventListener("click", (e) => {
if (btnConfig.stay_open) {
e.preventDefault();
e.stopPropagation();
}
btnConfig.callback?.(this.env);
});
container.appendChild(btn);
}
/**
* Mute button
*/
_add_mute_button(id, container) {
const btn = document.createElement("button");
(0, import_obsidian3.setIcon)(btn, "bell-off");
btn.addEventListener("click", () => {
if (!this.settings.muted)
this.settings.muted = {};
this.settings.muted[id] = true;
if (NOTICES["notice muted"]) {
this.show("notice muted", null, { timeout: 2e3 });
}
});
container.appendChild(btn);
}
/**
* Hides & clears all active notices
*/
unload() {
for (const id in this.active) {
this.remove(id);
}
}
/**
* Removes an active notice by key
*/
remove(id) {
const normalized_id = this._normalize_notice_key(id);
this.active[normalized_id]?.hide();
delete this.active[normalized_id];
}
};

function get_markdown_links2(content) {
const markdown_link_pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
const wikilink_pattern = /\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]/g;
const result = [];
const extract_links_from_pattern = (pattern, type) => {
let match;
while ((match = pattern.exec(content)) !== null) {
const title = type === "markdown" ? match[1] : match[2] || match[1];
const target = type === "markdown" ? match[2] : match[1];
const line = content.substring(0, match.index).split("\n").length;
result.push({ title, target, line });
}
};
extract_links_from_pattern(markdown_link_pattern, "markdown");
extract_links_from_pattern(wikilink_pattern, "wikilink");
result.sort((a, b) => a.line - b.line || a.target.localeCompare(b.target));
return result;
}

function get_line_range2(content, start_line, end_line) {
const lines = content.split("\n");
return lines.slice(start_line - 1, end_line).join("\n");
}

function parse_markdown_blocks2(markdown, opts = {}) {
const { start_index = 1, line_keys = false } = opts;
const lines = markdown.split("\n");
const result = {};
const heading_stack = [];
const heading_lines = {};
const heading_counts = {};
const sub_block_counts = {};
const subheading_counts = {};
let current_list_item = null;
let current_content_block = null;
let in_frontmatter = false;
let frontmatter_started = false;
const root_heading_key = "#";
let in_code_block = false;
sub_block_counts[root_heading_key] = 0;
for (let i = 0; i < lines.length; i++) {
const line_number = i + start_index;
const line = lines[i];
const trimmed_line = line.trim();
if (trimmed_line === "---") {
if (!frontmatter_started) {
frontmatter_started = true;
in_frontmatter = true;
heading_lines["#---frontmatter---"] = [line_number, null];
continue;
} else if (in_frontmatter) {
in_frontmatter = false;
heading_lines["#---frontmatter---"][1] = line_number;
continue;
}
}
if (in_frontmatter) {
continue;
}
if (trimmed_line.startsWith("```")) {
in_code_block = !in_code_block;
if (!current_content_block) {
const parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (parent_key === root_heading_key) {
current_content_block = { key: root_heading_key, start_line: line_number };
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
continue;
}
const heading_match = trimmed_line.match(/^(#{1,6})\s*(.+)$/);
if (heading_match && !in_code_block) {
const level = heading_match[1].length;
let title = heading_match[2].trim();
while (heading_stack.length > 0 && heading_stack[heading_stack.length - 1].level >= level) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = line_number - 1;
}
}
if (heading_stack.length === 0 && heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = line_number - 1;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = "";
let parent_level = 0;
if (heading_stack.length > 0) {
parent_key = heading_stack[heading_stack.length - 1].key;
parent_level = heading_stack[heading_stack.length - 1].level;
} else {
parent_key = "";
parent_level = 0;
}
if (heading_stack.length === 0) {
heading_counts[title] = (heading_counts[title] || 0) + 1;
if (heading_counts[title] > 1) {
title += `[${heading_counts[title]}]`;
}
} else {
if (!subheading_counts[parent_key]) {
subheading_counts[parent_key] = {};
}
subheading_counts[parent_key][title] = (subheading_counts[parent_key][title] || 0) + 1;
const count = subheading_counts[parent_key][title];
if (count > 1) {
title += `#{${count}}`;
}
}
const level_diff = level - parent_level;
const hashes = "#".repeat(level_diff);
const key = parent_key + hashes + title;
heading_lines[key] = [line_number, null];
sub_block_counts[key] = 0;
heading_stack.push({ level, title, key });
continue;
}
const list_match = line.match(/^(\s*)([-*]|\d+\.) (.+)$/);
if (list_match && !in_code_block) {
const indentation = list_match[1].length;
if (indentation === 0) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
if (current_content_block && current_content_block.key !== root_heading_key) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
let key;
if (line_keys) {
const words = get_longest_words_in_order2(list_match[3], 10);
key = `${parent_key}#${words}`;
} else {
key = `${parent_key}#{${n}}`;
}
heading_lines[key] = [line_number, null];
current_list_item = { key, start_line: line_number };
continue;
}
if (current_list_item) {
continue;
}
}
if (trimmed_line === "") {
continue;
}
if (!current_content_block) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key) {
if (!heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
current_content_block = { key: root_heading_key, start_line: line_number };
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
}
const total_lines = lines.length;
while (heading_stack.length > 0) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = total_lines + start_index - 1;
}
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = total_lines + start_index - 1;
}
current_list_item = null;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = total_lines + start_index - 1;
}
current_content_block = null;
}
if (heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = total_lines + start_index - 1;
}
for (const key in heading_lines) {
result[key] = heading_lines[key];
}
return result;
}
function get_longest_words_in_order2(line, n = 3) {
const words = line.split(/\s+/).sort((a, b) => b.length - a.length).slice(0, n);
return words.sort((a, b) => line.indexOf(a) - line.indexOf(b)).join(" ");
}

async function parse_blocks(source, content) {
if (source.file_type === "md") {
let blocks_obj = parse_markdown_blocks2(content);
for (const [sub_key, line_range] of Object.entries(blocks_obj)) {
const block_key = source.key + sub_key;
const block_content = get_line_range2(content, line_range[0], line_range[1]);
const block_outlinks = get_markdown_links2(block_content);
const block_data = {
key: block_key,
lines: line_range,
size: block_content.length,
outlinks: block_outlinks
};
const new_item = new source.block_collection.item_type(source.env, block_data);
new_item.queue_embed();
source.block_collection.set(new_item);
}
clean_and_update_source_blocks(source, blocks_obj);
}
}
function clean_and_update_source_blocks(source, blocks_obj) {
const current_block_keys = new Set(Object.keys(blocks_obj).map((sk) => source.key + sk));
const blocks = source.blocks;
for (let i = 0; i < blocks.length; i++) {
if (!current_block_keys.has(blocks[i].key)) {
blocks[i].deleted = true;
blocks[i].queue_save();
}
}
source.data.blocks = blocks_obj;
source.queue_save();
}

var import_obsidian4 = require("obsidian");
var ExcludedFoldersFuzzy = class extends import_obsidian4.FuzzySuggestModal {
/**
* @param {App} app - The Obsidian app
* @param {Object} env - An environment-like object, must have .settings and .fs.folder_paths
*/
constructor(app, env) {
super(app);
this.env = env;
this.setPlaceholder("Select a folder to exclude...");
}
open(callback) {
this.callback = callback;
super.open();
}
getItems() {
return this.env.smart_sources?.fs?.folder_paths || [];
}
getItemText(item) {
return item;
}
onChooseItem(item) {
if (!item)
return;
const oldVal = this.env.settings.folder_exclusions || "";
const splitted = oldVal.split(",").map((s) => s.trim()).filter(Boolean);
if (!splitted.includes(item))
splitted.push(item);
this.env.settings.folder_exclusions = splitted.join(",");
this.callback?.();
}
};

var import_obsidian5 = require("obsidian");
var ExcludedSourcesModal = class extends import_obsidian5.Modal {
/**
* @param {Object} app - Obsidian app
* @param {Object} env - The environment instance
*/
constructor(app, env) {
super(app);
this.env = env;
}
async onOpen() {
this.titleEl.setText("Excluded Sources");
this.contentEl.addClass("excluded-sources-modal");
this.render_excluded_list();
}
async render_excluded_list() {
this.contentEl.empty();
const list_el = this.contentEl.createEl("ul");
const excluded_file_paths = this.env.smart_sources.excluded_file_paths;
console.log(excluded_file_paths);
for (const file_path of excluded_file_paths) {
const li = list_el.createEl("li");
li.setText(file_path);
}
}
};

var import_obsidian6 = require("obsidian");
var EnvStatsModal = class extends import_obsidian6.Modal {
constructor(app, env) {
super(app);
this.env = env;
}
async onOpen() {
this.titleEl.setText("Smart Environment");
const frag = await this.env.render_component("env_stats", this.env);
this.contentEl.appendChild(frag);
}
};

var import_obsidian7 = require("obsidian");
var ExcludedFilesFuzzy = class extends import_obsidian7.FuzzySuggestModal {
/**
* @param {App} app - The Obsidian app
* @param {Object} env - An environment-like object, must have .settings and .fs.file_paths
*/
constructor(app, env) {
super(app);
this.env = env;
this.setPlaceholder("Select a file to exclude...");
}
open(callback) {
this.callback = callback;
super.open();
}
getItems() {
const fileExclusions = (this.env.settings.file_exclusions || "").split(",").map((s) => s.trim()).filter(Boolean);
const candidates = (this.env.smart_sources?.fs?.file_paths || []).filter((path) => !fileExclusions.includes(path));
return candidates;
}
getItemText(item) {
return item;
}
onChooseItem(item) {
if (!item)
return;
const oldVal = this.env.settings.file_exclusions || "";
const splitted = oldVal.split(",").map((s) => s.trim()).filter(Boolean);
if (!splitted.includes(item))
splitted.push(item);
this.env.settings.file_exclusions = splitted.join(",");
this.callback?.();
}
};

var css_sheet = new CSSStyleSheet();
css_sheet.replaceSync(`.sc-env-settings-container {
margin: 1rem 0;
}

.sc-env-settings-header {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 0.5rem;
}

.toggle-env-settings-btn {
cursor: pointer;
}

.smart-env-settings-header {
margin-bottom: 1rem;
}

.excluded-folder-item,
.excluded-file-item {
margin: 0.3rem 0;
}
`);
var env_settings_default = css_sheet;

async function build_html2(env, opts = {}) {
const env_settings_html = Object.entries(env.settings_config).map(([setting_key, setting_config]) => {
if (setting_key === "file_exclusions" || setting_key === "folder_exclusions")
return false;
if (!setting_config.setting)
setting_config.setting = setting_key;
return this.render_setting_html(setting_config);
}).filter(Boolean).join("\n");
const add_excluded_folders_btn = `
<button class="sc-add-excluded-folder-btn" type="button">Add excluded folder</button>
`;
const add_excluded_files_btn = `
<button class="sc-add-excluded-file-btn" type="button">Add excluded file</button>
`;
const excluded_folders_list = `<div class="sc-excluded-folders-list"></div>`;
const excluded_files_list = `<div class="sc-excluded-files-list"></div>`;
return `
<div class="sc-env-settings-container">
<div class="sc-env-settings-header">
<h2>Smart Environment</h2>
<button type="button" class="toggle-env-settings-btn">Show environment settings</button>
</div>
<div class="sc-env-settings-body" style="display: none;">
<div class="smart-env-settings-header">
<button class="sc-collection-stats-btn" type="button">Show stats</button>
<button class="smart-env_reload-sources-btn" type="button">Reload sources</button>
</div>

${env_settings_html}

<div class="smart-env-settings-header">
<h2>Excluded folders</h2>
${add_excluded_folders_btn}
</div>
${excluded_folders_list}

<div class="smart-env-settings-header">
<h2>Excluded files</h2>
${add_excluded_files_btn}
</div>
${excluded_files_list}

<button class="sc-excluded-sources-btn" type="button">Show excluded</button>

<div data-smart-settings="smart_sources"></div>
<div data-smart-settings="smart_blocks"></div>
<p>Notes about embedding models:</p>
<ul>
<li>IMPORTANT: make sure local <code>BGE-micro-v2</code> embedding model works before trying other local models.</li>
<li>API models require an API key and send your notes to third-party servers for processing.</li>
</ul>
</div>
</div>
`;
}
async function render5(env, opts = {}) {
const html = await build_html2.call(this, env, opts);
const frag = this.create_doc_fragment(html);
this.apply_style_sheet(env_settings_default);
await this.render_setting_components(frag, { scope: env });
env.settings_container = frag.querySelector(".sc-env-settings-container");
post_process4.call(this, env, env.settings_container, opts);
return frag;
}
async function post_process4(env, container, opts = {}) {
const heading_btn = container.querySelector(".toggle-env-settings-btn");
const body_el = container.querySelector(".sc-env-settings-body");
if (heading_btn && body_el) {
heading_btn.addEventListener("click", () => {
const is_hidden = body_el.style.display === "none";
body_el.style.display = is_hidden ? "block" : "none";
heading_btn.textContent = is_hidden ? "Hide environment settings" : "Show environment settings";
});
}
const add_folder_btn = container.querySelector(".sc-add-excluded-folder-btn");
if (add_folder_btn) {
add_folder_btn.addEventListener("click", () => {
const fuzzy = new ExcludedFoldersFuzzy(env.main.app, env);
fuzzy.open(() => {
render_excluded_dir_list(env, container);
env.update_exclusions();
});
});
}
const add_file_btn = container.querySelector(".sc-add-excluded-file-btn");
if (add_file_btn) {
add_file_btn.addEventListener("click", () => {
const fuzzy = new ExcludedFilesFuzzy(env.main.app, env);
fuzzy.open(() => {
render_excluded_file_list(env, container);
env.update_exclusions();
});
});
}
const show_excluded_btn = container.querySelector(".sc-excluded-sources-btn");
if (show_excluded_btn) {
show_excluded_btn.addEventListener("click", () => {
const modal = new ExcludedSourcesModal(env.main.app, env);
modal.open();
});
}
const show_stats_btn = container.querySelector(".sc-collection-stats-btn");
if (show_stats_btn) {
show_stats_btn.addEventListener("click", () => {
const modal = new EnvStatsModal(env.main.app, env);
modal.open();
});
}
const reload_sources_btn = container.querySelector(".smart-env_reload-sources-btn");
if (reload_sources_btn) {
reload_sources_btn.addEventListener("click", async () => {
const start = Date.now();
env.smart_sources.unload();
env.smart_blocks.unload();
await env.init_collections();
await env.load_collections();
const end = Date.now();
env.main.notices?.show("reload_sources", { time_ms: end - start });
});
}
const env_collections_containers = container.querySelectorAll("[data-smart-settings]");
for (const el of env_collections_containers) {
const collection_key = el.dataset.smartSettings;
const collection = env[collection_key];
if (!collection)
continue;
await collection.render_settings(el);
}
render_excluded_dir_list(env, container);
render_excluded_file_list(env, container);
}
function render_excluded_dir_list(env, container) {
const list_container = container.querySelector(".sc-excluded-folders-list");
if (!list_container)
return;
list_container.empty();
const ul = list_container.createEl("ul");
const excluded_csv = env.settings.folder_exclusions || "";
const arr = excluded_csv.split(",").map((s) => s.trim()).filter(Boolean);
arr.forEach((folder) => {
const li = ul.createEl("li", { cls: "excluded-folder-item" });
li.setText(folder + "  ");
const remove_btn = li.createEl("button", { text: "(x)", cls: "remove-folder-btn" });
remove_btn.addEventListener("click", () => {
const splitted = excluded_csv.split(",").map((x) => x.trim()).filter(Boolean);
const new_arr = splitted.filter((f) => f !== folder);
env.settings.folder_exclusions = new_arr.join(",");
render_excluded_dir_list(env, container);
});
});
if (!arr.length) {
ul.createEl("li", { text: "No folders excluded yet." });
}
}
function render_excluded_file_list(env, container) {
const list_container = container.querySelector(".sc-excluded-files-list");
if (!list_container)
return;
list_container.empty();
const ul = list_container.createEl("ul");
const excluded_csv = env.settings.file_exclusions || "";
const arr = excluded_csv.split(",").map((s) => s.trim()).filter(Boolean);
arr.forEach((file_path) => {
const li = ul.createEl("li", { cls: "excluded-file-item" });
li.setText(file_path + "  ");
const remove_btn = li.createEl("button", { text: "(x)", cls: "remove-file-btn" });
remove_btn.addEventListener("click", () => {
const splitted = excluded_csv.split(",").map((x) => x.trim()).filter(Boolean);
const new_arr = splitted.filter((f) => f !== file_path);
env.settings.file_exclusions = new_arr.join(",");
render_excluded_file_list(env, container);
});
});
if (!arr.length) {
ul.createEl("li", { text: "No files excluded yet." });
}
}

function format_collection_name(key) {
return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function build_html3(env, opts = {}) {
const lines = [];
lines.push(`<h2>Collections</h2>`);
const collection_keys = Object.keys(env.collections).sort((a, b) => {
if (a === "smart_sources" || a === "smart_blocks")
return -1;
if (b === "smart_sources" || b === "smart_blocks")
return 1;
return a.localeCompare(b);
});
console.log("collection_keys", collection_keys);
for (const collection_key of collection_keys) {
const collection = env[collection_key];
if (!collection || !collection.items) {
lines.push(`
<div class="sc-collection-stats">
<h3>${format_collection_name(collection_key)}</h3>
<p>No valid items.</p>
</div>
`);
continue;
}
const snippet = generate_collection_stats(collection, collection_key);
lines.push(snippet);
}
return `
<div class="sc-env-stats-container">
${lines.join("\n")}
</div>
`;
}
async function render6(env, opts = {}) {
const html = await build_html3.call(this, env, opts);
const frag = this.create_doc_fragment(html);
return await post_process5.call(this, env, frag, opts);
}
async function post_process5(env, frag, opts = {}) {
return frag;
}
function generate_collection_stats(collection, collectionKey) {
const total_items = Object.values(collection.items).length;
const niceName = format_collection_name(collectionKey);
const state = collection.env.collections[collectionKey];
console.log("state", collectionKey, state);
if (state !== "loaded") {
return `
<div class="sc-collection-stats">
<h3>${niceName}</h3>
<p>Not loaded yet (${total_items} items known).</p>
</div>
`;
}
const load_time_html = collection.load_time_ms ? `<span>Load time: ${collection.load_time_ms}ms</span>` : "";
const state_html = `<span>State: ${state}</span>`;
let html = "";
if (collectionKey === "smart_sources") {
html = get_smart_sources_stats(collection, niceName, total_items);
} else {
html = get_generic_collection_stats(collection, niceName, total_items);
}
let embed_stats = "";
if (typeof collection.process_embed_queue === "function") {
embed_stats = calculate_embed_coverage(collection, total_items);
}
return `
<div class="sc-collection-stats">
<h3>${niceName}</h3>
${embed_stats}
${html}
${load_time_html}
${state_html}
</div>
`;
}
function get_smart_sources_stats(collection, niceName, total_items, load_time_html) {
const totalFiles = collection.total_files ?? total_items;
const included = collection.included_files ?? "Error calculating included files";
const excluded = totalFiles - included;
return `
<p><strong>Total Files:</strong> ${totalFiles}</p>
<p><strong>Excluded:</strong> ${excluded}</p>
<p><strong>Included:</strong> ${included}</p>
`;
}
function get_generic_collection_stats(collection, niceName, total_items, load_time_html) {
return `
<p><strong>Total:</strong> ${total_items}</p>
`;
}
function calculate_embed_coverage(collection, total_items) {
const embedded_items = Object.values(collection.items).filter((item) => item.vec);
if (!embedded_items.length)
return "<p>No items embedded</p>";
const is_unembedded = Object.values(collection.items).filter((i) => i.should_embed && i.is_unembedded);
const pct = embedded_items.length / total_items * 100;
const percent = Math.round(pct);
const display = `${percent}% (${embedded_items.length} / ${total_items})`;
return `<p><strong>Embedding coverage:</strong> ${display}</p>` + (is_unembedded.length ? `<p><strong>Unembedded:</strong> ${is_unembedded.length}</p>` : "");
}

async function build_html4(collection, opts = {}) {
const settings_html = Object.entries(collection.settings_config).map(([setting_key, setting_config]) => {
if (!setting_config.setting)
setting_config.setting = setting_key;
return this.render_setting_html(setting_config);
}).join("\n");
const html = `<div class="source-settings">
<h2>${format_collection_name(collection.collection_key)}</h2>
${settings_html}
</div>`;
return html;
}
async function render7(collection, opts = {}) {
const html = await build_html4.call(this, collection, opts);
const frag = this.create_doc_fragment(html);
return await post_process6.call(this, collection, frag, opts);
}
async function post_process6(collection, frag, opts = {}) {
await this.render_setting_components(frag, { scope: collection });
return frag;
}

var smart_env_config = {
collections: {},
item_types: {},
components: {
env_settings: render5,
env_stats: render6,
smart_sources: {
settings: render7
}
}
};

var smart_env_config2 = {
env_path: "",
modules: {
smart_fs: {
class: SmartFs,
adapter: SmartFsObsidianAdapter
},
smart_view: {
class: SmartView,
adapter: SmartViewObsidianAdapter
},
smart_notices: {
class: SmartNotices,
adapter: import_obsidian10.Notice
}
},
collections: {
smart_sources: {
collection_key: "smart_sources",
class: SmartSources,
data_adapter: AjsonMultiFileSourcesDataAdapter,
source_adapters: {
"md": ObsidianMarkdownSourceContentAdapter,
"txt": ObsidianMarkdownSourceContentAdapter
},
content_parsers: [
parse_blocks
],
process_embed_queue: false
},
smart_blocks: {
collection_key: "smart_blocks",
class: SmartBlocks,
data_adapter: AjsonMultiFileBlocksDataAdapter,
block_adapters: {
"md": MarkdownBlockContentAdapter,
"txt": MarkdownBlockContentAdapter
}
}
},
item_types: {
SmartSource,
SmartBlock
},
items: {
smart_source: smart_source_default,
smart_block: smart_block_default
},
default_settings: {
is_obsidian_vault: true,
smart_blocks: {
embed_blocks: true,
min_chars: 200
},
smart_sources: {
min_chars: 200,
embed_model: {
adapter: "transformers",
transformers: {
legacy_transformers: false,
model_key: "TaylorAI/bge-micro-v2"
}
}
},
file_exclusions: "Untitled",
folder_exclusions: "smart-chats",
smart_view_filter: {
render_markdown: true,
show_full_path: false
}
}
};
merge_env_config(smart_env_config2, smart_env_config);
var default_config_default = smart_env_config2;

var SmartEnv2 = class extends SmartEnv {
static async create(plugin, main_env_opts = null) {
if (!main_env_opts)
main_env_opts = plugin.smart_env_config;
if (plugin.app.plugins.plugins["smart-connections"] && plugin.app.plugins.plugins["smart-connections"].env && !plugin.app.plugins.plugins["smart-connections"].env.constructor.version) {
const update_notice = "Detected older SmartEnv with 'init_main'. Reloading without the outdated plugin. Please update Smart Connections.";
console.warn(update_notice);
new import_obsidian11.Notice(update_notice, 0);
disable_plugin(plugin.app, "smart-connections");
}
const opts = merge_env_config(main_env_opts, default_config_default);
return await super.create(plugin, opts);
}
manual_load() {
this.manual_load = true;
}
async load() {
if (import_obsidian11.Platform.isMobile && !this.manual_load) {
this.notices.show("load_env");
return;
}
await super.load();
const plugin = this.main;
plugin.registerEvent(
plugin.app.vault.on("create", (file) => {
if (file instanceof import_obsidian11.TFile && this.smart_sources?.source_adapters?.[file.extension]) {
const source = this.smart_sources?.init_file_path(file.path);
if (source)
this.smart_sources?.fs.include_file(file.path);
}
})
);
plugin.registerEvent(
plugin.app.vault.on("rename", (file, old_path) => {
if (file instanceof import_obsidian11.TFile && this.smart_sources?.source_adapters?.[file.extension]) {
const source = this.smart_sources?.init_file_path(file.path);
if (source)
this.smart_sources?.fs.include_file(file.path);
}
if (old_path) {
const source = this.smart_sources?.get(old_path);
if (source) {
source.delete();
if (this.rename_debounce_timeout)
clearTimeout(this.rename_debounce_timeout);
this.rename_debounce_timeout = setTimeout(() => {
this.smart_sources?.process_save_queue();
this.rename_debounce_timeout = null;
}, 1e3);
}
}
})
);
plugin.registerEvent(
plugin.app.vault.on("modify", (file) => {
if (file instanceof import_obsidian11.TFile && this.smart_sources?.source_adapters?.[file.extension]) {
const source = this.smart_sources?.get(file.path);
if (source) {
if (!this.sources_import_timeouts)
this.sources_import_timeouts = {};
if (this.sources_import_timeouts[file.path])
clearTimeout(this.sources_import_timeouts[file.path]);
this.sources_import_timeouts[file.path] = setTimeout(() => {
source.import();
}, 23e3);
}
}
})
);
plugin.registerEvent(
plugin.app.vault.on("delete", (file) => {
if (file instanceof import_obsidian11.TFile && this.smart_sources?.source_adapters?.[file.extension]) {
delete this.smart_sources?.items[file.path];
}
})
);
}
};
async function disable_plugin(app, plugin_id) {
console.log("disabling plugin", plugin_id);
await app.plugins.unloadPlugin(plugin_id);
await app.plugins.disablePluginAndSave(plugin_id);
await app.plugins.loadManifests();
}

function collection_instance_name_from3(class_name) {
if (class_name.endsWith("Item")) {
return class_name.replace(/Item$/, "").toLowerCase();
}
return class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/y$/, "ie") + "s";
}

function create_uid3(data) {
const str = JSON.stringify(data);
let hash = 0;
if (str.length === 0)
return hash;
for (let i = 0; i < str.length; i++) {
const char = str.charCodeAt(i);
hash = (hash << 5) - hash + char;
hash = hash & hash;
if (hash < 0)
hash = hash * -1;
}
return hash.toString() + str.length;
}
function deep_merge4(target, source) {
for (const key in source) {
if (source.hasOwnProperty(key)) {
if (is_obj(source[key]) && is_obj(target[key]))
deep_merge4(target[key], source[key]);
else
target[key] = source[key];
}
}
return target;
function is_obj(item) {
return item && typeof item === "object" && !Array.isArray(item);
}
}

function deep_equal3(obj1, obj2, visited = /* @__PURE__ */ new WeakMap()) {
if (obj1 === obj2)
return true;
if (obj1 === null || obj2 === null || obj1 === void 0 || obj2 === void 0)
return false;
if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2))
return false;
if (Array.isArray(obj1)) {
if (obj1.length !== obj2.length)
return false;
return obj1.every((item, index) => deep_equal3(item, obj2[index], visited));
}
if (typeof obj1 === "object") {
if (visited.has(obj1))
return visited.get(obj1) === obj2;
visited.set(obj1, obj2);
const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);
if (keys1.length !== keys2.length)
return false;
return keys1.every((key) => deep_equal3(obj1[key], obj2[key], visited));
}
return obj1 === obj2;
}

var CollectionItem3 = class _CollectionItem {
/**
* Default properties for an instance of CollectionItem.
* Override in subclasses to define different defaults.
* @returns {Object}
*/
static get defaults() {
return {
data: {}
};
}
/**
* @param {Object} env - The environment/context.
* @param {Object|null} [data=null] - Initial data for the item.
*/
constructor(env, data = null) {
env.create_env_getter(this);
this.config = this.env?.config;
this.merge_defaults();
if (data)
deep_merge4(this.data, data);
if (!this.data.class_name)
this.data.class_name = this.constructor.name;
}
/**
* Loads an item from data and initializes it.
* @param {Object} env
* @param {Object} data
* @returns {CollectionItem}
*/
static load(env, data) {
const item = new this(env, data);
item.init();
return item;
}
/**
* Merge default properties from the entire inheritance chain.
* @private
*/
merge_defaults() {
let current_class = this.constructor;
while (current_class) {
for (let key in current_class.defaults) {
const default_val = current_class.defaults[key];
if (typeof default_val === "object") {
this[key] = { ...default_val, ...this[key] };
} else {
this[key] = this[key] === void 0 ? default_val : this[key];
}
}
current_class = Object.getPrototypeOf(current_class);
}
}
/**
* Generates or retrieves a unique key for the item.
* Key syntax supports:
* - `[i]` for sequences
* - `/` for super-sources (groups, directories, clusters)
* - `#` for sub-sources (blocks)
* @returns {string} The unique key
*/
get_key() {
return create_uid3(this.data);
}
/**
* Updates the item data and returns true if changed.
* @param {Object} data
* @returns {boolean} True if data changed.
*/
update_data(data) {
const sanitized_data = this.sanitize_data(data);
const current_data = { ...this.data };
deep_merge4(current_data, sanitized_data);
const changed = !deep_equal3(this.data, current_data);
if (!changed)
return false;
this.data = current_data;
return true;
}
/**
* Sanitizes data for saving. Ensures no circular references.
* @param {*} data
* @returns {*} Sanitized data.
*/
sanitize_data(data) {
if (data instanceof _CollectionItem)
return data.ref;
if (Array.isArray(data))
return data.map((val) => this.sanitize_data(val));
if (typeof data === "object" && data !== null) {
return Object.keys(data).reduce((acc, key) => {
acc[key] = this.sanitize_data(data[key]);
return acc;
}, {});
}
return data;
}
/**
* Initializes the item. Override as needed.
* @param {Object} [input_data] - Additional data that might be provided on creation.
*/
init(input_data) {
}
/**
* Queues this item for saving.
*/
queue_save() {
this._queue_save = true;
}
/**
* Saves this item using its data adapter.
* @returns {Promise<void>}
*/
async save() {
try {
await this.data_adapter.save_item(this);
this.init();
} catch (err) {
this._queue_save = true;
console.error(err, err.stack);
}
}
/**
* Queues this item for loading.
*/
queue_load() {
this._queue_load = true;
}
/**
* Loads this item using its data adapter.
* @returns {Promise<void>}
*/
async load() {
try {
await this.data_adapter.load_item(this);
this.init();
} catch (err) {
this._load_error = err;
this.on_load_error(err);
}
}
/**
* Handles load errors by re-queuing for load.
* Override if needed.
* @param {Error} err
*/
on_load_error(err) {
this.queue_load();
}
/**
* Validates the item before saving. Checks for presence and validity of key.
* @returns {boolean}
*/
validate_save() {
if (!this.key)
return false;
if (this.key.trim() === "")
return false;
if (this.key === "undefined")
return false;
return true;
}
/**
* Marks this item as deleted. This does not immediately remove it from memory,
* but queues a save that will result in the item being removed from persistent storage.
*/
delete() {
this.deleted = true;
this.queue_save();
}
/**
* Filters items in the collection based on provided options.
* functional filter (returns true or false) for filtering items in collection; called by collection class
* @param {Object} filter_opts - Filtering options.
* @param {string} [filter_opts.exclude_key] - A single key to exclude.
* @param {string[]} [filter_opts.exclude_keys] - An array of keys to exclude. If exclude_key is provided, it's added to this array.
* @param {string} [filter_opts.exclude_key_starts_with] - Exclude keys starting with this string.
* @param {string[]} [filter_opts.exclude_key_starts_with_any] - Exclude keys starting with any of these strings.
* @param {string} [filter_opts.exclude_key_includes] - Exclude keys that include this string.
* @param {string} [filter_opts.key_ends_with] - Include only keys ending with this string.
* @param {string} [filter_opts.key_starts_with] - Include only keys starting with this string.
* @param {string[]} [filter_opts.key_starts_with_any] - Include only keys starting with any of these strings.
* @param {string} [filter_opts.key_includes] - Include only keys that include this string.
* @returns {boolean} True if the item passes the filter, false otherwise.
*/
filter(filter_opts = {}) {
const {
exclude_key,
exclude_keys = exclude_key ? [exclude_key] : [],
exclude_key_starts_with,
exclude_key_starts_with_any,
exclude_key_includes,
exclude_key_includes_any,
key_ends_with,
key_starts_with,
key_starts_with_any,
key_includes,
key_includes_any
} = filter_opts;
if (exclude_keys?.includes(this.key))
return false;
if (exclude_key_starts_with && this.key.startsWith(exclude_key_starts_with))
return false;
if (exclude_key_starts_with_any && exclude_key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (exclude_key_includes && this.key.includes(exclude_key_includes))
return false;
if (exclude_key_includes_any && exclude_key_includes_any.some((include) => this.key.includes(include)))
return false;
if (key_ends_with && !this.key.endsWith(key_ends_with))
return false;
if (key_starts_with && !this.key.startsWith(key_starts_with))
return false;
if (key_starts_with_any && !key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (key_includes && !this.key.includes(key_includes))
return false;
if (key_includes_any && !key_includes_any.some((include) => this.key.includes(include)))
return false;
return true;
}
/**
* Parses item data for additional processing. Override as needed.
*/
parse() {
}
/**
* Helper function to render a component in the item scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
get actions() {
if (!this._actions) {
this._actions = Object.entries(this.env.opts.items[this.item_type_key].actions || {}).reduce((acc, [k, v]) => {
acc[k] = v.bind(this);
return acc;
}, {});
}
return this._actions;
}
/**
* Derives the collection key from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from3(name);
}
/**
* @returns {string} The collection key for this item.
*/
get collection_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from3(name);
}
/**
* Retrieves the parent collection from the environment.
* @returns {Collection}
*/
get collection() {
return this.env[this.collection_key];
}
/**
* @returns {string} The item's key.
*/
get key() {
return this.data?.key || this.get_key();
}
get item_type_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return camel_case_to_snake_case4(name);
}
/**
* A simple reference object for this item.
* @returns {{collection_key: string, key: string}}
*/
get ref() {
return { collection_key: this.collection_key, key: this.key };
}
/**
* @returns {Object} The data adapter for this item's collection.
*/
get data_adapter() {
return this.collection.data_adapter;
}
/**
* @returns {Object} The filesystem adapter.
*/
get data_fs() {
return this.collection.data_fs;
}
/**
* Access to collection-level settings.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key])
this.env.settings[this.collection_key] = {};
return this.env.settings[this.collection_key];
}
set settings(settings) {
this.env.settings[this.collection_key] = settings;
this.env.smart_settings.save();
}
/**
* Render this item into a container using the item's component.
* @deprecated 2024-12-02 Use explicit component pattern from environment
* @param {HTMLElement} container
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_item(container, opts = {}) {
const frag = await this.component.call(this.smart_view, this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* @deprecated use env.smart_view
* @returns {Object}
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Override in child classes to set the component for this item
* @deprecated 2024-12-02
* @returns {Function} The render function for this component
*/
get component() {
return item_component;
}
};
function camel_case_to_snake_case4(str) {
const result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, "").replace(/2$/, "");
return result;
}

var AsyncFunction3 = Object.getPrototypeOf(async function() {
}).constructor;
var Collection3 = class {
/**
* Constructs a new Collection instance.
*
* @param {Object} env - The environment context containing configurations and adapters.
* @param {Object} [opts={}] - Optional configuration.
* @param {string} [opts.collection_key] - Custom key to override default collection name.
* @param {string} [opts.data_dir] - Custom data directory path.
* @param {boolean} [opts.prevent_load_on_init] - Whether to prevent loading items on initialization.
*/
constructor(env, opts = {}) {
env.create_env_getter(this);
this.opts = opts;
if (opts.collection_key)
this.collection_key = opts.collection_key;
this.env[this.collection_key] = this;
this.config = this.env.config;
this.items = {};
this.loaded = null;
this._loading = false;
this.load_time_ms = null;
this.settings_container = null;
}
/**
* Initializes a new collection in the environment. Override in subclass if needed.
*
* @param {Object} env
* @param {Object} [opts={}]
* @returns {Promise<void>}
*/
static async init(env, opts = {}) {
env[this.collection_key] = new this(env, opts);
await env[this.collection_key].init();
env.collections[this.collection_key] = "init";
}
/**
* The unique collection key derived from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Instance-level init. Override in subclasses if necessary.
* @returns {Promise<void>}
*/
async init() {
}
/**
* Creates or updates an item in the collection.
* - If `data` includes a key that matches an existing item, that item is updated.
* - Otherwise, a new item is created.
* After updating or creating, the item is validated. If validation fails, the item is logged and returned without being saved.
* If validation succeeds for a new item, it is added to the collection and marked for saving.
*
* If the item’s `init()` method is async, a promise is returned that resolves once init completes.
*
* @param {Object} [data={}] - Data for creating/updating an item.
* @returns {Promise<Item>|Item} The created or updated item. May return a promise if `init()` is async.
*/
create_or_update(data = {}) {
const existing_item = this.find_by(data);
const item = existing_item ? existing_item : new this.item_type(this.env);
item._queue_save = !existing_item;
const data_changed = item.update_data(data);
if (!existing_item && !item.validate_save()) {
return item;
}
if (!existing_item) {
this.set(item);
}
if (existing_item && !data_changed)
return existing_item;
if (item.init instanceof AsyncFunction3) {
return new Promise((resolve) => {
item.init(data).then(() => resolve(item));
});
}
item.init(data);
return item;
}
/**
* Finds an item by partial data match (first checks key). If `data.key` provided,
* returns the item with that key; otherwise attempts a match by merging data.
*
* @param {Object} data - Data to match against.
* @returns {Item|null}
*/
find_by(data) {
if (data.key)
return this.get(data.key);
const temp = new this.item_type(this.env);
const temp_data = JSON.parse(JSON.stringify(data, temp.sanitize_data(data)));
deep_merge4(temp.data, temp_data);
return temp.key ? this.get(temp.key) : null;
}
/**
* Filters items based on provided filter options or a custom function.
*
* @param {Object|Function} [filter_opts={}] - Filter options or a predicate function.
* @returns {Item[]} Array of filtered items.
*/
filter(filter_opts = {}) {
if (typeof filter_opts === "function") {
return Object.values(this.items).filter(filter_opts);
}
filter_opts = this.prepare_filter(filter_opts);
const results = [];
const { first_n } = filter_opts;
for (const item of Object.values(this.items)) {
if (first_n && results.length >= first_n)
break;
if (item.filter(filter_opts))
results.push(item);
}
return results;
}
/**
* Alias for `filter()`
* @param {Object|Function} filter_opts
* @returns {Item[]}
*/
list(filter_opts) {
return this.filter(filter_opts);
}
/**
* Prepares filter options. Can be overridden by subclasses to normalize filter options.
*
* @param {Object} filter_opts
* @returns {Object} Prepared filter options.
*/
prepare_filter(filter_opts) {
return filter_opts;
}
/**
* Retrieves an item by key.
* @param {string} key
* @returns {Item|undefined}
*/
get(key) {
return this.items[key];
}
/**
* Retrieves multiple items by an array of keys.
* @param {string[]} keys
* @returns {Item[]}
*/
get_many(keys = []) {
if (!Array.isArray(keys)) {
console.error("get_many called with non-array keys:", keys);
return [];
}
return keys.map((key) => this.get(key)).filter(Boolean);
}
/**
* Retrieves a random item from the collection, optionally filtered by options.
* @param {Object} [opts]
* @returns {Item|undefined}
*/
get_rand(opts = null) {
if (opts) {
const filtered = this.filter(opts);
return filtered[Math.floor(Math.random() * filtered.length)];
}
const keys = this.keys;
return this.items[keys[Math.floor(Math.random() * keys.length)]];
}
/**
* Adds or updates an item in the collection.
* @param {Item} item
*/
set(item) {
if (!item.key)
throw new Error("Item must have a key property");
this.items[item.key] = item;
}
/**
* Updates multiple items by their keys.
* @param {string[]} keys
* @param {Object} data
*/
update_many(keys = [], data = {}) {
this.get_many(keys).forEach((item) => item.update_data(data));
}
/**
* Clears all items from the collection.
*/
clear() {
this.items = {};
}
/**
* @returns {string} The collection key, can be overridden by opts.collection_key
*/
get collection_key() {
return this._collection_key ? this._collection_key : this.constructor.collection_key;
}
set collection_key(key) {
this._collection_key = key;
}
/**
* Lazily initializes and returns the data adapter instance for this collection.
* @returns {Object} The data adapter instance.
*/
get data_adapter() {
if (!this._data_adapter) {
const AdapterClass = this.get_adapter_class("data");
this._data_adapter = new AdapterClass(this);
}
return this._data_adapter;
}
get_adapter_class(type) {
const config = this.env.opts.collections?.[this.collection_key];
const adapter_key = type + "_adapter";
const adapter_module = config?.[adapter_key] ?? this.env.opts.collections?.smart_collections?.[adapter_key];
if (typeof adapter_module === "function")
return adapter_module;
if (typeof adapter_module?.collection === "function")
return adapter_module.collection;
throw new Error(`No '${type}' adapter class found for ${this.collection_key} or smart_collections`);
}
/**
* Data directory strategy for this collection. Defaults to 'multi'.
* @returns {string}
*/
get data_dir() {
return this.collection_key;
}
/**
* File system adapter from the environment.
* @returns {Object}
*/
get data_fs() {
return this.env.data_fs;
}
/**
* Derives the corresponding item class name based on this collection's class name.
* @returns {string}
*/
get item_class_name() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
if (name.endsWith("ies"))
return name.slice(0, -3) + "y";
else if (name.endsWith("s"))
return name.slice(0, -1);
return name + "Item";
}
/**
* Derives a readable item name from the item class name.
* @returns {string}
*/
get item_name() {
return this.item_class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Retrieves the item type (constructor) from the environment.
* @returns {Function} Item constructor.
*/
get item_type() {
if (this.opts.item_type)
return this.opts.item_type;
return this.env.item_types[this.item_class_name];
}
/**
* Returns an array of all keys in the collection.
* @returns {string[]}
*/
get keys() {
return Object.keys(this.items);
}
/**
* @deprecated use data_adapter instead (2024-09-14)
*/
get adapter() {
return this.data_adapter;
}
/**
* @method process_save_queue
* @description
* Saves items flagged for saving (_queue_save) back to AJSON or SQLite. This ensures persistent storage
* of any updates made since last load/import. This method also writes changes to disk (AJSON files or DB).
*/
async process_save_queue(opts = {}) {
if (opts.force) {
Object.values(this.items).forEach((item) => item._queue_save = true);
}
await this.data_adapter.process_save_queue(opts);
}
/**
* @alias process_save_queue
* @returns {Promise<void>}
*/
async save(opts = {}) {
await this.process_save_queue(opts);
}
/**
* @method process_load_queue
* @description
* Loads items that have been flagged for loading (_queue_load). This may involve
* reading from AJSON/SQLite or re-importing from markdown if needed.
* Called once initial environment is ready and collections are known.
*/
async process_load_queue() {
await this.data_adapter.process_load_queue();
}
/**
* Retrieves processed settings configuration.
* @returns {Object}
*/
get settings_config() {
return this.process_settings_config({});
}
/**
* Processes given settings config, adding prefixes and handling conditionals.
*
* @private
* @param {Object} _settings_config
* @param {string} [prefix='']
* @returns {Object}
*/
process_settings_config(_settings_config, prefix = "") {
const add_prefix = (key) => prefix && !key.includes(`${prefix}.`) ? `${prefix}.${key}` : key;
return Object.entries(_settings_config).reduce((acc, [key, val]) => {
let new_val = { ...val };
if (new_val.conditional) {
if (!new_val.conditional(this))
return acc;
delete new_val.conditional;
}
if (new_val.callback)
new_val.callback = add_prefix(new_val.callback);
if (new_val.btn_callback)
new_val.btn_callback = add_prefix(new_val.btn_callback);
if (new_val.options_callback)
new_val.options_callback = add_prefix(new_val.options_callback);
const new_key = add_prefix(this.process_setting_key(key));
acc[new_key] = new_val;
return acc;
}, {});
}
/**
* Processes an individual setting key. Override if needed.
* @param {string} key
* @returns {string}
*/
process_setting_key(key) {
return key;
}
/**
* Default settings for this collection. Override in subclasses as needed.
* @returns {Object}
*/
get default_settings() {
return {};
}
/**
* Current settings for the collection.
* Initializes with default settings if none exist.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key]) {
this.env.settings[this.collection_key] = this.default_settings;
}
return this.env.settings[this.collection_key];
}
/**
* @deprecated use env.smart_view instead
* @returns {Object} smart_view instance
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Renders the settings for the collection into a given container.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_settings(container = this.settings_container, opts = {}) {
return await this.render_collection_settings(container, opts);
}
/**
* Helper function to render collection settings.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_collection_settings(container = this.settings_container, opts = {}) {
if (container && (!this.settings_container || this.settings_container !== container)) {
this.settings_container = container;
} else if (!container) {
container = this.env.smart_view.create_doc_fragment("<div></div>");
}
container.innerHTML = `<div class="sc-loading">Loading ${this.collection_key} settings...</div>`;
const frag = await this.env.render_component("settings", this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* Unloads collection data from memory.
*/
unload() {
this.clear();
this.unloaded = true;
this.env.collections[this.collection_key] = null;
}
/**
* Runs load process for all items in the collection, triggering queue loads and rendering settings after done.
* @returns {Promise<void>}
*/
async run_data_load() {
this.loaded = null;
this.load_time_ms = null;
Object.values(this.items).forEach((item) => item.queue_load());
this.notices?.show("loading_collection", { collection_key: this.collection_key });
await this.process_load_queue();
this.notices?.remove("loading_collection");
this.notices?.show("done_loading_collection", { collection_key: this.collection_key });
this.render_settings();
}
/**
* Helper function to render a component in the collection scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
show_process_notice(process2, opts = {}) {
if (!this.debounce_process_notice)
this.debounce_process_notice = {};
this.debounce_process_notice[process2] = setTimeout(() => {
this.debounce_process_notice[process2] = null;
this.env.notices?.show(process2, { collection_key: this.collection_key, ...opts });
}, 1e3);
}
clear_process_notice(process2) {
if (this.debounce_process_notice?.[process2]) {
clearTimeout(this.debounce_process_notice[process2]);
this.debounce_process_notice[process2] = null;
} else {
this.env.notices?.remove(process2);
}
}
};

function map_indices(current, draft) {
const currentIndexMap = /* @__PURE__ */ new Map();
current.forEach((line, idx) => {
currentIndexMap.set(line, idx);
});
return draft.map((line) => {
return currentIndexMap.has(line) ? currentIndexMap.get(line) : -1;
});
}
function compute_lis_indices(arr) {
const n = arr.length;
const parent = new Array(n).fill(-1);
const pileTops = [];
const pileIndices = [];
for (let i = 0; i < n; i++) {
const val = arr[i];
if (val < 0) {
continue;
}
let left = 0;
let right = pileTops.length;
while (left < right) {
const mid = left + right >> 1;
if (pileTops[mid] >= val) {
right = mid;
} else {
left = mid + 1;
}
}
if (left > 0) {
parent[i] = pileIndices[left - 1];
}
if (left === pileTops.length) {
pileTops.push(val);
pileIndices.push(i);
} else {
pileTops[left] = val;
pileIndices[left] = i;
}
}
const lisIndices = [];
let curr = pileIndices[pileIndices.length - 1] || -1;
while (curr !== -1) {
lisIndices.push(curr);
curr = parent[curr];
}
lisIndices.reverse();
return lisIndices;
}
function detect_moves(current_line_hashes, draft_line_hashes) {
const current_unique = current_line_hashes.filter((line, index, self) => self.lastIndexOf(line) === index && self.indexOf(line) === index);
const draft_unique = draft_line_hashes.filter((line, index, self) => self.lastIndexOf(line) === index && self.indexOf(line) === index);
const positions = map_indices(current_unique, draft_unique);
const lisDraftIndices = new Set(compute_lis_indices(positions));
const moved_lines = [];
for (let i = 0; i < draft_unique.length; i++) {
if (!lisDraftIndices.has(i) && positions[i] !== -1) {
const anchor_new = i > 0 ? draft_unique[i - 1] : null;
const newIndex = positions[i];
const anchor_old = newIndex > 0 ? current_unique[newIndex - 1] : null;
moved_lines.push({
line_hashes: [draft_unique[i]],
anchor_old,
anchor_new
});
}
}
return moved_lines;
}

function create_set(iterable) {
return new Set(iterable);
}
function create_last_index_map(arr) {
const map = /* @__PURE__ */ new Map();
arr.forEach((line, idx) => {
map.set(line, idx);
});
return map;
}
function set_intersection(set_a, set_b) {
const [smaller_set, larger_set] = set_a.size <= set_b.size ? [set_a, set_b] : [set_b, set_a];
return [...smaller_set].reduce((acc, elem) => {
if (elem.trim() && larger_set.has(elem)) {
acc.add(elem);
}
return acc;
}, /* @__PURE__ */ new Set());
}
function are_slices_equal(slice_1, slice_2) {
return slice_1.length === slice_2.length && slice_1.every((line, i) => line === slice_2[i]);
}
function slice_contains_new_hash(slice_data, reference_set) {
return slice_data.some((line) => {
return line.trim() && !reference_set.has(line);
});
}
function process_segment_change(anchor_begin, anchor_end, current_hashes, draft_hashes, anchor_begin_idx, anchor_end_idx, draft_last_index_map, current_set, draft_set) {
const current_slice_start = anchor_begin_idx + 1;
const current_slice_end = anchor_end_idx >= 0 ? anchor_end_idx : current_hashes.length;
const current_slice = current_hashes.slice(
current_slice_start,
Math.max(current_slice_start, current_slice_end)
);
const draft_slice_start = anchor_begin !== null && draft_last_index_map.has(anchor_begin) ? draft_last_index_map.get(anchor_begin) + 1 : 0;
const draft_slice_end = anchor_end !== null && draft_last_index_map.has(anchor_end) ? draft_last_index_map.get(anchor_end) : draft_hashes.length;
const draft_slice = draft_hashes.slice(
draft_slice_start,
Math.max(draft_slice_start, draft_slice_end)
);
if (are_slices_equal(current_slice, draft_slice)) {
return [];
}
const difference_involves_new = slice_contains_new_hash(current_slice, draft_set) || slice_contains_new_hash(draft_slice, current_set);
if (!difference_involves_new) {
return [];
}
if (anchor_begin && anchor_begin === anchor_end) {
return [];
}
return [{
anchor_begin,
anchor_end
}];
}
function gather_anchors_in_current(current_hashes, common_set) {
const blocks = [];
for (let i = 0; i < current_hashes.length; i++) {
const line = current_hashes[i];
if (!common_set.has(line)) {
continue;
}
if (!blocks.length || blocks[blocks.length - 1].line !== line) {
blocks.push({ line, start: i, end: i });
} else {
blocks[blocks.length - 1].end = i;
}
}
const final_anchors_map = /* @__PURE__ */ new Map();
for (const block of blocks) {
if (!final_anchors_map.has(block.line)) {
final_anchors_map.set(block.line, { anchor: block.line, index: block.start });
}
}
const final_anchors = Array.from(final_anchors_map.values());
final_anchors.sort((a, b) => a.index - b.index);
return final_anchors;
}
function both_have_blank_line(arrA, arrB) {
const has_blank_a = arrA.some((line) => !line.trim());
const has_blank_b = arrB.some((line) => !line.trim());
return has_blank_a && has_blank_b;
}
function transform_segments(segments) {
return segments.map(({ anchor_begin, anchor_end }) => {
if (anchor_begin === null && anchor_end === null) {
return { anchor_begin: -1, anchor_end: 1 };
}
if (anchor_begin === null) {
return { anchor_begin: anchor_end, anchor_end: -1 };
}
if (anchor_end === null) {
return { anchor_begin, anchor_end: 1 };
}
return { anchor_begin, anchor_end };
});
}
function detect_changes(current_hashes_orig, draft_hashes_orig) {
if (!Array.isArray(current_hashes_orig) || !Array.isArray(draft_hashes_orig)) {
throw new TypeError("Inputs must be arrays.");
}
const c_mapped = current_hashes_orig.map((line) => line.trim()).filter((line) => line !== "");
const d_mapped = draft_hashes_orig.map((line) => line.trim()).filter((line) => line !== "");
if (are_slices_equal(c_mapped, d_mapped)) {
return [];
}
const current_set = create_set(c_mapped);
const draft_set = create_set(d_mapped);
const common_set = set_intersection(current_set, draft_set);
const draft_last_index_map = create_last_index_map(d_mapped);
if (common_set.size === 0) {
if (c_mapped.length === 0 && d_mapped.length === 0) {
return [];
}
if (both_have_blank_line(current_hashes_orig, draft_hashes_orig)) {
if (c_mapped.length === 0) {
return [{ anchor_begin: -1, anchor_end: 1 }];
} else {
return [{ anchor_begin: c_mapped[c_mapped.length - 1], anchor_end: 1 }];
}
}
if (c_mapped.length === 0) {
return [{ anchor_begin: -1, anchor_end: 1 }];
} else {
return [{ anchor_begin: c_mapped[c_mapped.length - 1], anchor_end: 1 }];
}
}
const anchors_in_current = gather_anchors_in_current(c_mapped, common_set, draft_last_index_map);
if (anchors_in_current.length === 0) {
if (c_mapped.length === 0) {
return [{ anchor_begin: -1, anchor_end: 1 }];
} else {
const difference_involves_new = slice_contains_new_hash(c_mapped, draft_set) || slice_contains_new_hash(d_mapped, current_set);
if (difference_involves_new) {
return [{ anchor_begin: c_mapped[c_mapped.length - 1], anchor_end: 1 }];
} else {
return [];
}
}
}
const before_segments = handle_before_first_anchor(
anchors_in_current[0],
c_mapped,
d_mapped,
draft_last_index_map,
current_set,
draft_set
);
const between_segments = handle_between_anchors(
anchors_in_current,
c_mapped,
d_mapped,
draft_last_index_map,
current_set,
draft_set
);
const after_segments = handle_after_last_anchor(
anchors_in_current[anchors_in_current.length - 1],
c_mapped,
d_mapped,
draft_last_index_map,
current_set,
draft_set
);
const transformed_segments = transform_segments([
...before_segments,
...between_segments,
...after_segments
]);
const duplicate_anchor_lines = /* @__PURE__ */ new Set();
const seen_lines = /* @__PURE__ */ new Set();
for (const line of c_mapped) {
if (common_set.has(line)) {
if (seen_lines.has(line)) {
duplicate_anchor_lines.add(line);
}
seen_lines.add(line);
}
}
let final_segments = [...transformed_segments];
if (final_segments.length > 1) {
const first_seg = final_segments[0];
const second_seg = final_segments[1];
if (first_seg.anchor_end === -1 && first_seg.anchor_begin === second_seg.anchor_begin && duplicate_anchor_lines.has(first_seg.anchor_begin)) {
final_segments.shift();
}
}
if (final_segments.length > 1) {
const last_seg = final_segments[final_segments.length - 1];
const second_last_seg = final_segments[final_segments.length - 2];
if (last_seg.anchor_end === 1 && last_seg.anchor_begin === second_last_seg.anchor_end && duplicate_anchor_lines.has(last_seg.anchor_begin)) {
final_segments.pop();
}
}
return final_segments;
}
function handle_before_first_anchor(first_anchor_obj, current_hashes, draft_hashes, draft_last_index_map, current_set, draft_set) {
return process_segment_change(
null,
first_anchor_obj.anchor,
current_hashes,
draft_hashes,
-1,
first_anchor_obj.index,
draft_last_index_map,
current_set,
draft_set
);
}
function handle_between_anchors(anchors_in_current, current_hashes, draft_hashes, draft_last_index_map, current_set, draft_set) {
const segments = [];
for (let i = 0; i < anchors_in_current.length - 1; i++) {
const anchor_begin_obj = anchors_in_current[i];
const anchor_end_obj = anchors_in_current[i + 1];
const idx_c_1 = anchor_begin_obj.index;
const idx_c_2 = anchor_end_obj.index;
const idx_d_1 = draft_last_index_map.get(anchor_begin_obj.anchor);
const idx_d_2 = draft_last_index_map.get(anchor_end_obj.anchor);
if (idx_d_1 === void 0 || idx_d_2 === void 0 || idx_d_1 >= idx_d_2) {
continue;
}
const seg = process_segment_change(
anchor_begin_obj.anchor,
anchor_end_obj.anchor,
current_hashes,
draft_hashes,
idx_c_1,
idx_c_2,
draft_last_index_map,
current_set,
draft_set
);
segments.push(...seg);
}
return segments;
}
function handle_after_last_anchor(last_anchor_obj, current_hashes, draft_hashes, draft_last_index_map, current_set, draft_set) {
return process_segment_change(
last_anchor_obj.anchor,
null,
current_hashes,
draft_hashes,
last_anchor_obj.index,
-1,
draft_last_index_map,
current_set,
draft_set
);
}

function recalc_lines(change, lines) {
let start_idx = get_zero_line_idx(lines);
if (typeof change.anchor_begin === "string") {
const match_idx = lines.findIndex((line) => matchLine(line, change.anchor_begin));
if (match_idx !== -1)
start_idx = match_idx;
}
let end_idx = lines.length - 1;
if (change.anchor_end === -1 && typeof change.anchor_begin === "string") {
end_idx = start_idx;
} else if (typeof change.anchor_end === "string") {
const match_idx = lines.findLastIndex((line) => matchLine(line, change.anchor_end));
if (match_idx !== -1)
end_idx = match_idx - 1;
}
while (typeof lines[end_idx] === "string" && ["", "..."].includes(lines[end_idx].trim())) {
end_idx--;
}
return [start_idx, end_idx].sort((a, b) => a - b);
}
function get_new_lines(change, lines) {
let start_idx = 0;
if (typeof change.anchor_begin === "string") {
const match_idx = lines.findIndex((line) => matchLine(line, change.anchor_begin));
if (match_idx !== -1)
start_idx = match_idx;
}
let end_idx = lines.length - 1;
if (typeof change.anchor_end === "string") {
const match_idx = lines.findLastIndex((line) => matchLine(line, change.anchor_end));
if (match_idx !== -1)
end_idx = match_idx - 1;
} else if (typeof change.anchor_end === "number") {
if (change.anchor_end === -1) {
end_idx = start_idx;
start_idx = get_zero_line_idx(lines);
}
}
while (typeof lines[end_idx] === "string" && [""].includes(lines[end_idx].trim())) {
end_idx--;
}
return [start_idx, end_idx].sort((a, b) => a - b);
}
function get_zero_line_idx(lines) {
if (lines[0].trim() === "---") {
return lines.findIndex((line, idx) => idx > 0 && line.trim() === "---") + 1;
}
return 0;
}
function matchLine(lineStr, anchorStr, strict_whitespace = false) {
if (!strict_whitespace) {
return lineStr.trim() === anchorStr.trim();
}
return lineStr === anchorStr;
}

function cleanup_draft(raw_draft_text) {
let lines = raw_draft_text.trim().split("\n");
if (lines[lines.length - 1].endsWith("```"))
lines.pop();
if (lines[0] === "---") {
const frontmatter_end = lines.findIndex((line, idx) => idx > 0 && line === "---");
if (frontmatter_end !== -1)
lines.splice(0, frontmatter_end + 1);
}
return lines.reduce((acc, line, idx) => {
line = line.trim();
if (line.startsWith("---") && line.endsWith("---") && line.length > 3) {
return acc;
}
if (acc.length === 0) {
if (line === "")
return acc;
if (line === "...")
return acc;
if (line === "```md")
return acc;
}
acc.push(line);
return acc;
}, []).join("\n").trim();
;
}

function parse_changes(current, draft) {
draft = cleanup_draft(draft);
const curr_lines = current.split("\n");
const curr_lines_norm = curr_lines.filter((line) => line.trim() !== "").map((line) => line.trim());
const draft_lines = draft.split("\n");
const draft_lines_norm = draft_lines.filter((line) => line.trim() !== "").map((line) => line.trim());
const moves = detect_moves(draft_lines_norm, curr_lines_norm);
const changes = detect_changes(curr_lines_norm, draft_lines_norm);
console.log("changes", changes);
for (const change of changes) {
change.old = recalc_lines(change, curr_lines);
change.new = get_new_lines(change, draft_lines);
parse_old_text(change, curr_lines);
parse_new_text(change, draft_lines);
}
return {
moves,
changes: changes.filter((c) => (c.original.trim() !== "" || c.content.trim() !== "") && c.content.trim() !== "...")
};
}
function parse_old_text(change, curr_lines) {
const begin_old_slice = change.old[0] + (change.anchor_end === -1 ? 0 : 1);
const end_old_slice = change.old[1] + (change.anchor_end === -1 ? 0 : 1);
change.original = curr_lines.slice(begin_old_slice, end_old_slice).join("\n");
}
function parse_new_text(change, draft_lines) {
const begin_new_slice = change.new[0] + (change.anchor_end === -1 ? 0 : 1);
const end_new_slice = change.new[1] + (change.anchor_end === -1 ? 0 : 1);
change.content = draft_lines.slice(begin_new_slice, end_new_slice).join("\n");
}

var SmartChanges = class extends Collection3 {
static collection_key = "smart_changes";
collection_key = "smart_changes";
get change_adapters() {
return this.opts.change_adapters || {};
}
async parse_changes_2(target_key, draft_content) {
const target_item = this.get_ref(target_key);
if (!target_item) {
console.warn(`SmartChanges: no item found for key: ${target_key}`);
return [];
}
const current_content = await target_item.read({ render_output: false }) || "";
const results = [];
const timestamp = Date.now();
const { moves, changes } = parse_changes(current_content, draft_content);
for (const change of changes) {
results.push(this.create_or_update({
target_key,
change_type: "diff",
change,
timestamp,
old_hash: target_item.last_read.hash
}));
}
await Promise.all(results);
return results;
}
get_pending_changes(target_key) {
return this.filter((c) => {
if (c.data.target_key !== target_key)
return false;
return c.is_pending;
});
}
get_ref(key) {
const collection = key.includes("#") ? this.env.smart_blocks : this.env.smart_sources;
const target = collection.get(key);
return target;
}
};

function murmur_hash_32(input_string, seed = 0) {
let remainder = input_string.length & 3;
let bytes = input_string.length - remainder;
let h1 = seed;
let c1 = 3432918353;
let c2 = 461845907;
let i = 0;
let k1 = 0;
let chunk = 0;
while (i < bytes) {
chunk = input_string.charCodeAt(i) & 255 | (input_string.charCodeAt(i + 1) & 255) << 8 | (input_string.charCodeAt(i + 2) & 255) << 16 | (input_string.charCodeAt(i + 3) & 255) << 24;
i += 4;
k1 = chunk;
k1 = multiply_32(k1, c1);
k1 = rotate_left_32(k1, 15);
k1 = multiply_32(k1, c2);
h1 ^= k1;
h1 = rotate_left_32(h1, 13);
h1 = h1 * 5 + 3864292196 | 0;
}
k1 = 0;
switch (remainder) {
case 3:
k1 ^= (input_string.charCodeAt(i + 2) & 255) << 16;
case 2:
k1 ^= (input_string.charCodeAt(i + 1) & 255) << 8;
case 1:
k1 ^= input_string.charCodeAt(i) & 255;
k1 = multiply_32(k1, c1);
k1 = rotate_left_32(k1, 15);
k1 = multiply_32(k1, c2);
h1 ^= k1;
break;
}
h1 ^= input_string.length;
h1 = fmix_32(h1);
return h1 | 0;
}
function murmur_hash_32_alphanumeric(input_string, seed = 0) {
const signed_hash = murmur_hash_32(input_string, seed);
const unsigned_hash = signed_hash >>> 0;
return unsigned_hash.toString(36);
}
function multiply_32(a, b) {
return (a & 65535) * b + ((a >>> 16) * b << 16) | 0;
}
function rotate_left_32(value, shift) {
return value << shift | value >>> 32 - shift;
}
function fmix_32(h) {
h ^= h >>> 16;
h = multiply_32(h, 2246822507);
h ^= h >>> 13;
h = multiply_32(h, 3266489909);
h ^= h >>> 16;
return h | 0;
}

var SmartChange = class extends CollectionItem3 {
static get defaults() {
return {
data: {
target_key: null,
change_type: null,
change: {},
state: null,
timestamp: null,
old_hash: null
}
};
}
init() {
super.init();
this.change_adapter.init();
}
/**
* Provides a unique key for the change item based on timestamp or other logic.
* This is just a naive example using "<source_key>:<timestamp>" plus partial hashing of 'original'/'content'.
* @returns {string}
*/
get_key() {
if (!this.data.key) {
if (!this.data.timestamp) {
this.data.timestamp = Date.now();
}
const data_hash = murmur_hash_32_alphanumeric(JSON.stringify(this.data));
this.data.key = [
this.data.target_key,
this.data.timestamp,
data_hash
].join("#");
}
return this.data.key;
}
get target_collection() {
return this.data.target_key && this.data.target_key.includes("#") ? this.env.smart_blocks : this.env.smart_sources;
}
get target() {
if (!this.data.target_key)
return null;
return this.target_collection.get(this.data.target_key);
}
/**
* Approve the change using the relevant type adapter.
*/
async approve() {
await this.change_adapter.approve();
}
/**
* Discard the change using the relevant type adapter.
*/
async discard() {
await this.change_adapter.discard();
}
/**
* Returns the key in `this.data` that indicates what type of change it is
* (e.g. 'insert', 'delete', 'replace', etc.).
*/
get change_type() {
return this.data.change_type;
}
/**
* Instantiate the correct adapter class for this change type.
*/
get change_adapter() {
if (!this._change_adapter) {
const AdapterClass = this.collection.opts.change_adapters[this.data.change_type];
if (!AdapterClass) {
console.warn(`No adapter found for ${this.change_type}`);
return {};
}
this._change_adapter = new AdapterClass(this);
}
return this._change_adapter;
}
/**
* Whether this change is still pending (state === null).
*/
get is_pending() {
return this.data.state === null;
}
get lines_changed() {
return this.data.old_hash !== this.target.last_read.hash;
}
recalc_old_lines(old_lines) {
console.log("recalc_old_lines before", this.old);
this.change_adapter.recalc_old_lines(old_lines);
console.log("recalc_old_lines after", this.old);
return this.old;
}
get anchor_end() {
return this.data.change.anchor_end;
}
get anchor_begin() {
return this.data.change.anchor_begin;
}
get change() {
return this.data.change;
}
get old() {
return this.change.old;
}
set old(value) {
this.data.change.old = value;
}
get original() {
return this.change.original;
}
get content() {
return this.change.content;
}
get raw() {
return this.data.raw || {};
}
get moved_to() {
return this.raw.moved_to;
}
get moved_from() {
return this.raw.moved_from;
}
};

function collection_instance_name_from4(class_name) {
if (class_name.endsWith("Item")) {
return class_name.replace(/Item$/, "").toLowerCase();
}
return class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/y$/, "ie") + "s";
}

function create_uid4(data) {
const str = JSON.stringify(data);
let hash = 0;
if (str.length === 0)
return hash;
for (let i = 0; i < str.length; i++) {
const char = str.charCodeAt(i);
hash = (hash << 5) - hash + char;
hash = hash & hash;
if (hash < 0)
hash = hash * -1;
}
return hash.toString() + str.length;
}
function deep_merge5(target, source) {
for (const key in source) {
if (source.hasOwnProperty(key)) {
if (is_obj(source[key]) && is_obj(target[key]))
deep_merge5(target[key], source[key]);
else
target[key] = source[key];
}
}
return target;
function is_obj(item) {
return item && typeof item === "object" && !Array.isArray(item);
}
}

function deep_equal4(obj1, obj2, visited = /* @__PURE__ */ new WeakMap()) {
if (obj1 === obj2)
return true;
if (obj1 === null || obj2 === null || obj1 === void 0 || obj2 === void 0)
return false;
if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2))
return false;
if (Array.isArray(obj1)) {
if (obj1.length !== obj2.length)
return false;
return obj1.every((item, index) => deep_equal4(item, obj2[index], visited));
}
if (typeof obj1 === "object") {
if (visited.has(obj1))
return visited.get(obj1) === obj2;
visited.set(obj1, obj2);
const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);
if (keys1.length !== keys2.length)
return false;
return keys1.every((key) => deep_equal4(obj1[key], obj2[key], visited));
}
return obj1 === obj2;
}

var CollectionItem4 = class _CollectionItem {
/**
* Default properties for an instance of CollectionItem.
* Override in subclasses to define different defaults.
* @returns {Object}
*/
static get defaults() {
return {
data: {}
};
}
/**
* @param {Object} env - The environment/context.
* @param {Object|null} [data=null] - Initial data for the item.
*/
constructor(env, data = null) {
env.create_env_getter(this);
this.config = this.env?.config;
this.merge_defaults();
if (data)
deep_merge5(this.data, data);
if (!this.data.class_name)
this.data.class_name = this.constructor.name;
}
/**
* Loads an item from data and initializes it.
* @param {Object} env
* @param {Object} data
* @returns {CollectionItem}
*/
static load(env, data) {
const item = new this(env, data);
item.init();
return item;
}
/**
* Merge default properties from the entire inheritance chain.
* @private
*/
merge_defaults() {
let current_class = this.constructor;
while (current_class) {
for (let key in current_class.defaults) {
const default_val = current_class.defaults[key];
if (typeof default_val === "object") {
this[key] = { ...default_val, ...this[key] };
} else {
this[key] = this[key] === void 0 ? default_val : this[key];
}
}
current_class = Object.getPrototypeOf(current_class);
}
}
/**
* Generates or retrieves a unique key for the item.
* Key syntax supports:
* - `[i]` for sequences
* - `/` for super-sources (groups, directories, clusters)
* - `#` for sub-sources (blocks)
* @returns {string} The unique key
*/
get_key() {
return create_uid4(this.data);
}
/**
* Updates the item data and returns true if changed.
* @param {Object} data
* @returns {boolean} True if data changed.
*/
update_data(data) {
const sanitized_data = this.sanitize_data(data);
const current_data = { ...this.data };
deep_merge5(current_data, sanitized_data);
const changed = !deep_equal4(this.data, current_data);
if (!changed)
return false;
this.data = current_data;
return true;
}
/**
* Sanitizes data for saving. Ensures no circular references.
* @param {*} data
* @returns {*} Sanitized data.
*/
sanitize_data(data) {
if (data instanceof _CollectionItem)
return data.ref;
if (Array.isArray(data))
return data.map((val) => this.sanitize_data(val));
if (typeof data === "object" && data !== null) {
return Object.keys(data).reduce((acc, key) => {
acc[key] = this.sanitize_data(data[key]);
return acc;
}, {});
}
return data;
}
/**
* Initializes the item. Override as needed.
* @param {Object} [input_data] - Additional data that might be provided on creation.
*/
init(input_data) {
}
/**
* Queues this item for saving.
*/
queue_save() {
this._queue_save = true;
}
/**
* Saves this item using its data adapter.
* @returns {Promise<void>}
*/
async save() {
try {
await this.data_adapter.save_item(this);
this.init();
} catch (err) {
this._queue_save = true;
console.error(err, err.stack);
}
}
/**
* Queues this item for loading.
*/
queue_load() {
this._queue_load = true;
}
/**
* Loads this item using its data adapter.
* @returns {Promise<void>}
*/
async load() {
try {
await this.data_adapter.load_item(this);
this.init();
} catch (err) {
this._load_error = err;
this.on_load_error(err);
}
}
/**
* Handles load errors by re-queuing for load.
* Override if needed.
* @param {Error} err
*/
on_load_error(err) {
this.queue_load();
}
/**
* Validates the item before saving. Checks for presence and validity of key.
* @returns {boolean}
*/
validate_save() {
if (!this.key)
return false;
if (this.key.trim() === "")
return false;
if (this.key === "undefined")
return false;
return true;
}
/**
* Marks this item as deleted. This does not immediately remove it from memory,
* but queues a save that will result in the item being removed from persistent storage.
*/
delete() {
this.deleted = true;
this.queue_save();
}
/**
* Filters items in the collection based on provided options.
* functional filter (returns true or false) for filtering items in collection; called by collection class
* @param {Object} filter_opts - Filtering options.
* @param {string} [filter_opts.exclude_key] - A single key to exclude.
* @param {string[]} [filter_opts.exclude_keys] - An array of keys to exclude. If exclude_key is provided, it's added to this array.
* @param {string} [filter_opts.exclude_key_starts_with] - Exclude keys starting with this string.
* @param {string[]} [filter_opts.exclude_key_starts_with_any] - Exclude keys starting with any of these strings.
* @param {string} [filter_opts.exclude_key_includes] - Exclude keys that include this string.
* @param {string} [filter_opts.key_ends_with] - Include only keys ending with this string.
* @param {string} [filter_opts.key_starts_with] - Include only keys starting with this string.
* @param {string[]} [filter_opts.key_starts_with_any] - Include only keys starting with any of these strings.
* @param {string} [filter_opts.key_includes] - Include only keys that include this string.
* @returns {boolean} True if the item passes the filter, false otherwise.
*/
filter(filter_opts = {}) {
const {
exclude_key,
exclude_keys = exclude_key ? [exclude_key] : [],
exclude_key_starts_with,
exclude_key_starts_with_any,
exclude_key_includes,
exclude_key_includes_any,
key_ends_with,
key_starts_with,
key_starts_with_any,
key_includes,
key_includes_any
} = filter_opts;
if (exclude_keys?.includes(this.key))
return false;
if (exclude_key_starts_with && this.key.startsWith(exclude_key_starts_with))
return false;
if (exclude_key_starts_with_any && exclude_key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (exclude_key_includes && this.key.includes(exclude_key_includes))
return false;
if (exclude_key_includes_any && exclude_key_includes_any.some((include) => this.key.includes(include)))
return false;
if (key_ends_with && !this.key.endsWith(key_ends_with))
return false;
if (key_starts_with && !this.key.startsWith(key_starts_with))
return false;
if (key_starts_with_any && !key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (key_includes && !this.key.includes(key_includes))
return false;
if (key_includes_any && !key_includes_any.some((include) => this.key.includes(include)))
return false;
return true;
}
/**
* Parses item data for additional processing. Override as needed.
*/
parse() {
}
/**
* Helper function to render a component in the item scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
get actions() {
if (!this._actions) {
this._actions = Object.entries(this.env.opts.items[this.item_type_key].actions || {}).reduce((acc, [k, v]) => {
acc[k] = v.bind(this);
return acc;
}, {});
}
return this._actions;
}
/**
* Derives the collection key from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from4(name);
}
/**
* @returns {string} The collection key for this item.
*/
get collection_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from4(name);
}
/**
* Retrieves the parent collection from the environment.
* @returns {Collection}
*/
get collection() {
return this.env[this.collection_key];
}
/**
* @returns {string} The item's key.
*/
get key() {
return this.data?.key || this.get_key();
}
get item_type_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return camel_case_to_snake_case5(name);
}
/**
* A simple reference object for this item.
* @returns {{collection_key: string, key: string}}
*/
get ref() {
return { collection_key: this.collection_key, key: this.key };
}
/**
* @returns {Object} The data adapter for this item's collection.
*/
get data_adapter() {
return this.collection.data_adapter;
}
/**
* @returns {Object} The filesystem adapter.
*/
get data_fs() {
return this.collection.data_fs;
}
/**
* Access to collection-level settings.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key])
this.env.settings[this.collection_key] = {};
return this.env.settings[this.collection_key];
}
set settings(settings) {
this.env.settings[this.collection_key] = settings;
this.env.smart_settings.save();
}
/**
* Render this item into a container using the item's component.
* @deprecated 2024-12-02 Use explicit component pattern from environment
* @param {HTMLElement} container
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_item(container, opts = {}) {
const frag = await this.component.call(this.smart_view, this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* @deprecated use env.smart_view
* @returns {Object}
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Override in child classes to set the component for this item
* @deprecated 2024-12-02
* @returns {Function} The render function for this component
*/
get component() {
return item_component;
}
};
function camel_case_to_snake_case5(str) {
const result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, "").replace(/2$/, "");
return result;
}

var AsyncFunction4 = Object.getPrototypeOf(async function() {
}).constructor;
var Collection4 = class {
/**
* Constructs a new Collection instance.
*
* @param {Object} env - The environment context containing configurations and adapters.
* @param {Object} [opts={}] - Optional configuration.
* @param {string} [opts.collection_key] - Custom key to override default collection name.
* @param {string} [opts.data_dir] - Custom data directory path.
* @param {boolean} [opts.prevent_load_on_init] - Whether to prevent loading items on initialization.
*/
constructor(env, opts = {}) {
env.create_env_getter(this);
this.opts = opts;
if (opts.collection_key)
this.collection_key = opts.collection_key;
this.env[this.collection_key] = this;
this.config = this.env.config;
this.items = {};
this.loaded = null;
this._loading = false;
this.load_time_ms = null;
this.settings_container = null;
}
/**
* Initializes a new collection in the environment. Override in subclass if needed.
*
* @param {Object} env
* @param {Object} [opts={}]
* @returns {Promise<void>}
*/
static async init(env, opts = {}) {
env[this.collection_key] = new this(env, opts);
await env[this.collection_key].init();
env.collections[this.collection_key] = "init";
}
/**
* The unique collection key derived from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Instance-level init. Override in subclasses if necessary.
* @returns {Promise<void>}
*/
async init() {
}
/**
* Creates or updates an item in the collection.
* - If `data` includes a key that matches an existing item, that item is updated.
* - Otherwise, a new item is created.
* After updating or creating, the item is validated. If validation fails, the item is logged and returned without being saved.
* If validation succeeds for a new item, it is added to the collection and marked for saving.
*
* If the item’s `init()` method is async, a promise is returned that resolves once init completes.
*
* @param {Object} [data={}] - Data for creating/updating an item.
* @returns {Promise<Item>|Item} The created or updated item. May return a promise if `init()` is async.
*/
create_or_update(data = {}) {
const existing_item = this.find_by(data);
const item = existing_item ? existing_item : new this.item_type(this.env);
item._queue_save = !existing_item;
const data_changed = item.update_data(data);
if (!existing_item && !item.validate_save()) {
return item;
}
if (!existing_item) {
this.set(item);
}
if (existing_item && !data_changed)
return existing_item;
if (item.init instanceof AsyncFunction4) {
return new Promise((resolve) => {
item.init(data).then(() => resolve(item));
});
}
item.init(data);
return item;
}
/**
* Finds an item by partial data match (first checks key). If `data.key` provided,
* returns the item with that key; otherwise attempts a match by merging data.
*
* @param {Object} data - Data to match against.
* @returns {Item|null}
*/
find_by(data) {
if (data.key)
return this.get(data.key);
const temp = new this.item_type(this.env);
const temp_data = JSON.parse(JSON.stringify(data, temp.sanitize_data(data)));
deep_merge5(temp.data, temp_data);
return temp.key ? this.get(temp.key) : null;
}
/**
* Filters items based on provided filter options or a custom function.
*
* @param {Object|Function} [filter_opts={}] - Filter options or a predicate function.
* @returns {Item[]} Array of filtered items.
*/
filter(filter_opts = {}) {
if (typeof filter_opts === "function") {
return Object.values(this.items).filter(filter_opts);
}
filter_opts = this.prepare_filter(filter_opts);
const results = [];
const { first_n } = filter_opts;
for (const item of Object.values(this.items)) {
if (first_n && results.length >= first_n)
break;
if (item.filter(filter_opts))
results.push(item);
}
return results;
}
/**
* Alias for `filter()`
* @param {Object|Function} filter_opts
* @returns {Item[]}
*/
list(filter_opts) {
return this.filter(filter_opts);
}
/**
* Prepares filter options. Can be overridden by subclasses to normalize filter options.
*
* @param {Object} filter_opts
* @returns {Object} Prepared filter options.
*/
prepare_filter(filter_opts) {
return filter_opts;
}
/**
* Retrieves an item by key.
* @param {string} key
* @returns {Item|undefined}
*/
get(key) {
return this.items[key];
}
/**
* Retrieves multiple items by an array of keys.
* @param {string[]} keys
* @returns {Item[]}
*/
get_many(keys = []) {
if (!Array.isArray(keys)) {
console.error("get_many called with non-array keys:", keys);
return [];
}
return keys.map((key) => this.get(key)).filter(Boolean);
}
/**
* Retrieves a random item from the collection, optionally filtered by options.
* @param {Object} [opts]
* @returns {Item|undefined}
*/
get_rand(opts = null) {
if (opts) {
const filtered = this.filter(opts);
return filtered[Math.floor(Math.random() * filtered.length)];
}
const keys = this.keys;
return this.items[keys[Math.floor(Math.random() * keys.length)]];
}
/**
* Adds or updates an item in the collection.
* @param {Item} item
*/
set(item) {
if (!item.key)
throw new Error("Item must have a key property");
this.items[item.key] = item;
}
/**
* Updates multiple items by their keys.
* @param {string[]} keys
* @param {Object} data
*/
update_many(keys = [], data = {}) {
this.get_many(keys).forEach((item) => item.update_data(data));
}
/**
* Clears all items from the collection.
*/
clear() {
this.items = {};
}
/**
* @returns {string} The collection key, can be overridden by opts.collection_key
*/
get collection_key() {
return this._collection_key ? this._collection_key : this.constructor.collection_key;
}
set collection_key(key) {
this._collection_key = key;
}
/**
* Lazily initializes and returns the data adapter instance for this collection.
* @returns {Object} The data adapter instance.
*/
get data_adapter() {
if (!this._data_adapter) {
const AdapterClass = this.get_adapter_class("data");
this._data_adapter = new AdapterClass(this);
}
return this._data_adapter;
}
get_adapter_class(type) {
const config = this.env.opts.collections?.[this.collection_key];
const adapter_key = type + "_adapter";
const adapter_module = config?.[adapter_key] ?? this.env.opts.collections?.smart_collections?.[adapter_key];
if (typeof adapter_module === "function")
return adapter_module;
if (typeof adapter_module?.collection === "function")
return adapter_module.collection;
throw new Error(`No '${type}' adapter class found for ${this.collection_key} or smart_collections`);
}
/**
* Data directory strategy for this collection. Defaults to 'multi'.
* @returns {string}
*/
get data_dir() {
return this.collection_key;
}
/**
* File system adapter from the environment.
* @returns {Object}
*/
get data_fs() {
return this.env.data_fs;
}
/**
* Derives the corresponding item class name based on this collection's class name.
* @returns {string}
*/
get item_class_name() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
if (name.endsWith("ies"))
return name.slice(0, -3) + "y";
else if (name.endsWith("s"))
return name.slice(0, -1);
return name + "Item";
}
/**
* Derives a readable item name from the item class name.
* @returns {string}
*/
get item_name() {
return this.item_class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Retrieves the item type (constructor) from the environment.
* @returns {Function} Item constructor.
*/
get item_type() {
if (this.opts.item_type)
return this.opts.item_type;
return this.env.item_types[this.item_class_name];
}
/**
* Returns an array of all keys in the collection.
* @returns {string[]}
*/
get keys() {
return Object.keys(this.items);
}
/**
* @deprecated use data_adapter instead (2024-09-14)
*/
get adapter() {
return this.data_adapter;
}
/**
* @method process_save_queue
* @description
* Saves items flagged for saving (_queue_save) back to AJSON or SQLite. This ensures persistent storage
* of any updates made since last load/import. This method also writes changes to disk (AJSON files or DB).
*/
async process_save_queue(opts = {}) {
if (opts.force) {
Object.values(this.items).forEach((item) => item._queue_save = true);
}
await this.data_adapter.process_save_queue(opts);
}
/**
* @alias process_save_queue
* @returns {Promise<void>}
*/
async save(opts = {}) {
await this.process_save_queue(opts);
}
/**
* @method process_load_queue
* @description
* Loads items that have been flagged for loading (_queue_load). This may involve
* reading from AJSON/SQLite or re-importing from markdown if needed.
* Called once initial environment is ready and collections are known.
*/
async process_load_queue() {
await this.data_adapter.process_load_queue();
}
/**
* Retrieves processed settings configuration.
* @returns {Object}
*/
get settings_config() {
return this.process_settings_config({});
}
/**
* Processes given settings config, adding prefixes and handling conditionals.
*
* @private
* @param {Object} _settings_config
* @param {string} [prefix='']
* @returns {Object}
*/
process_settings_config(_settings_config, prefix = "") {
const add_prefix = (key) => prefix && !key.includes(`${prefix}.`) ? `${prefix}.${key}` : key;
return Object.entries(_settings_config).reduce((acc, [key, val]) => {
let new_val = { ...val };
if (new_val.conditional) {
if (!new_val.conditional(this))
return acc;
delete new_val.conditional;
}
if (new_val.callback)
new_val.callback = add_prefix(new_val.callback);
if (new_val.btn_callback)
new_val.btn_callback = add_prefix(new_val.btn_callback);
if (new_val.options_callback)
new_val.options_callback = add_prefix(new_val.options_callback);
const new_key = add_prefix(this.process_setting_key(key));
acc[new_key] = new_val;
return acc;
}, {});
}
/**
* Processes an individual setting key. Override if needed.
* @param {string} key
* @returns {string}
*/
process_setting_key(key) {
return key;
}
/**
* Default settings for this collection. Override in subclasses as needed.
* @returns {Object}
*/
get default_settings() {
return {};
}
/**
* Current settings for the collection.
* Initializes with default settings if none exist.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key]) {
this.env.settings[this.collection_key] = this.default_settings;
}
return this.env.settings[this.collection_key];
}
/**
* @deprecated use env.smart_view instead
* @returns {Object} smart_view instance
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Renders the settings for the collection into a given container.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_settings(container = this.settings_container, opts = {}) {
return await this.render_collection_settings(container, opts);
}
/**
* Helper function to render collection settings.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_collection_settings(container = this.settings_container, opts = {}) {
if (container && (!this.settings_container || this.settings_container !== container)) {
this.settings_container = container;
} else if (!container) {
container = this.env.smart_view.create_doc_fragment("<div></div>");
}
container.innerHTML = `<div class="sc-loading">Loading ${this.collection_key} settings...</div>`;
const frag = await this.env.render_component("settings", this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* Unloads collection data from memory.
*/
unload() {
this.clear();
this.unloaded = true;
this.env.collections[this.collection_key] = null;
}
/**
* Runs load process for all items in the collection, triggering queue loads and rendering settings after done.
* @returns {Promise<void>}
*/
async run_data_load() {
this.loaded = null;
this.load_time_ms = null;
Object.values(this.items).forEach((item) => item.queue_load());
this.notices?.show("loading_collection", { collection_key: this.collection_key });
await this.process_load_queue();
this.notices?.remove("loading_collection");
this.notices?.show("done_loading_collection", { collection_key: this.collection_key });
this.render_settings();
}
/**
* Helper function to render a component in the collection scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
show_process_notice(process2, opts = {}) {
if (!this.debounce_process_notice)
this.debounce_process_notice = {};
this.debounce_process_notice[process2] = setTimeout(() => {
this.debounce_process_notice[process2] = null;
this.env.notices?.show(process2, { collection_key: this.collection_key, ...opts });
}, 1e3);
}
clear_process_notice(process2) {
if (this.debounce_process_notice?.[process2]) {
clearTimeout(this.debounce_process_notice[process2]);
this.debounce_process_notice[process2] = null;
} else {
this.env.notices?.remove(process2);
}
}
};

var SmartCompletions = class extends Collection4 {
/**
* Lazily instantiates and returns a chat_model. Similar to how
* SmartEntities implements embed_model. You can adapt this
* depending on how your environment is structured.
*
* @returns {Object|null} The chat model instance or null if not configured
*/
get chat_model() {
if (!this._chat_model) {
this._chat_model = this.env.init_module("smart_chat_model", {
model_config: {},
settings: this.settings.chat_model,
reload_model: this.reload_chat_model.bind(this),
re_render_settings: this.re_render_settings?.bind(this) ?? (() => {
console.log("no re_render_settings");
})
});
}
return this._chat_model;
}
/**
* Force unload & reload of chat model if user changes adapter or settings.
*/
reload_chat_model() {
if (this._chat_model?.unload) {
this._chat_model.unload();
}
this._chat_model = null;
}
/**
* In addition to base collection settings, merges `chat_model.settings_config`.
* Allows the SmartCompletions UI to show chat-model relevant settings.
* @returns {Object} Merged settings config
*/
get settings_config() {
return {};
}
/**
* (Optional) An array of request adapter classes. SmartCompletion items will invoke these
* in `run_completion_adapters()`. For example, we can list the context adapter or other custom ones.
*/
get completion_adapters() {
if (!this._completion_adapters) {
this._completion_adapters = {};
Object.values(this.opts.completion_adapters).forEach((adapter) => {
this._completion_adapters[adapter.property_name] = adapter;
});
}
return this._completion_adapters;
}
};

function murmur_hash_322(input_string, seed = 0) {
let remainder = input_string.length & 3;
let bytes = input_string.length - remainder;
let h1 = seed;
let c1 = 3432918353;
let c2 = 461845907;
let i = 0;
let k1 = 0;
let chunk = 0;
while (i < bytes) {
chunk = input_string.charCodeAt(i) & 255 | (input_string.charCodeAt(i + 1) & 255) << 8 | (input_string.charCodeAt(i + 2) & 255) << 16 | (input_string.charCodeAt(i + 3) & 255) << 24;
i += 4;
k1 = chunk;
k1 = multiply_322(k1, c1);
k1 = rotate_left_322(k1, 15);
k1 = multiply_322(k1, c2);
h1 ^= k1;
h1 = rotate_left_322(h1, 13);
h1 = h1 * 5 + 3864292196 | 0;
}
k1 = 0;
switch (remainder) {
case 3:
k1 ^= (input_string.charCodeAt(i + 2) & 255) << 16;
case 2:
k1 ^= (input_string.charCodeAt(i + 1) & 255) << 8;
case 1:
k1 ^= input_string.charCodeAt(i) & 255;
k1 = multiply_322(k1, c1);
k1 = rotate_left_322(k1, 15);
k1 = multiply_322(k1, c2);
h1 ^= k1;
break;
}
h1 ^= input_string.length;
h1 = fmix_322(h1);
return h1 | 0;
}
function murmur_hash_32_alphanumeric2(input_string, seed = 0) {
const signed_hash = murmur_hash_322(input_string, seed);
const unsigned_hash = signed_hash >>> 0;
return unsigned_hash.toString(36);
}
function multiply_322(a, b) {
return (a & 65535) * b + ((a >>> 16) * b << 16) | 0;
}
function rotate_left_322(value, shift) {
return value << shift | value >>> 32 - shift;
}
function fmix_322(h) {
h ^= h >>> 16;
h = multiply_322(h, 2246822507);
h ^= h >>> 13;
h = multiply_322(h, 3266489909);
h ^= h >>> 16;
return h | 0;
}

var SmartCompletion = class extends CollectionItem4 {
/**
* Default data structure for a new SmartCompletion item.
* @static
* @returns {Object}
*/
static get defaults() {
return {
data: {
completion: {
request: {},
responses: [],
chat_model: null
}
}
};
}
/**
* get_key
* Overridden to produce a unique key based on a hash of this.data plus the current timestamp.
* @returns {string}
*/
get_key() {
const hash = murmur_hash_32_alphanumeric2(JSON.stringify(this.data));
const ts = Date.now();
return `${hash}-${ts}`;
}
/**
* Called automatically in many cases (via create_or_update).
* You can also call it manually if needed.
*/
async init(completion_opts = {}) {
if (this.data.chat_model_config) {
this.chat_model = this.env.init_module("smart_chat_model", {
settings: this.data.chat_model_config
});
}
await this.build_request();
await this.complete(completion_opts);
await this.parse_response();
this.queue_save();
this.collection.process_save_queue();
}
/**
* Collects or transforms data into a final `completion.request` structure
* by running any applicable completion adapters.
* @returns {Promise<void>}
*/
async build_request() {
this.data.completion.request = {};
const data_keys = Object.keys(this.data);
for (const key of data_keys) {
const AdapterClass = this.completion_adapters[key];
if (AdapterClass) {
const adapter = new AdapterClass(this);
await adapter.to_request?.();
}
}
}
async parse_response() {
const data_keys = Object.keys(this.data);
for (const key of data_keys) {
const AdapterClass = this.completion_adapters[key];
if (AdapterClass) {
const adapter = new AdapterClass(this);
await adapter.from_response?.();
}
}
}
/**
* Calls the underlying chat model, stores the response in completion.responses.
* @returns {Promise<void>}
*/
async complete(opts = {}) {
if (!this.data.completion || !this.data.completion.request) {
console.warn("No completion.request found, skipping complete().");
return;
}
const chat_model = this.get_chat_model(opts);
if (!chat_model) {
console.warn("No chat model available for SmartCompletion. Check environment config.");
return;
}
try {
const request_payload = this.data.completion.request;
const stream = opts.stream;
const result = stream ? await chat_model.stream(request_payload, this.stream_handlers(opts.stream_handlers)) : await chat_model.complete(request_payload);
if (!stream) {
this.data.completion.responses.push({
timestamp: Date.now(),
...result
});
}
this.queue_save();
} catch (err) {
console.error("Error in SmartCompletion.complete():", err);
}
}
stream_handlers(stream_handlers = {}) {
return {
chunk: async (resp) => {
this.data.completion.responses[0] = {
timestamp: Date.now(),
...resp
};
await stream_handlers.chunk?.(this);
},
done: async (resp) => {
this.data.completion.responses[0] = {
timestamp: Date.now(),
...resp
};
await stream_handlers.done?.(this);
},
error: async (err) => {
console.error("error", err);
await stream_handlers.error?.(err);
}
};
}
/**
* Access the completion adapters from the parent collection, if any.
*/
get completion_adapters() {
return this.collection?.completion_adapters || {};
}
/**
* If a local chat_model config is present, creates a dedicated instance.
* Otherwise, returns the collection-level chat_model or null.
* @returns {Object|null}
*/
get_chat_model() {
if (this.chat_model) {
return this.chat_model;
} else {
console.log("no chat_model, using collection chat_model");
return this.collection?.chat_model || null;
}
}
get is_last_in_thread() {
if (!this.thread || !this.thread.completion_keys?.length)
return false;
return this.thread.completion_keys[this.thread.completion_keys.length - 1] === this.key;
}
get response() {
return this.data.completion.responses[0];
}
/**
* @method response_text
* @returns {string} The best guess at the main text from the model's first response.
*/
get response_text() {
const resp = this.data?.completion?.responses[0];
if (!resp)
return "";
if (Array.isArray(resp.choices) && resp.choices[0]) {
const choice = resp.choices[0];
if (choice.message && choice.message.content) {
return choice.message.content;
}
if (choice.text)
return choice.text;
}
if (resp.text)
return resp.text;
return "";
}
get action_call() {
const resp = this.response;
if (!resp)
return null;
return resp.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
}
get messages() {
const messages = [];
if (this.data.system_message) {
messages.push({
role: "system",
content: this.data.system_message
});
}
if (this.data.user_message) {
messages.push({
role: "user",
content: this.data.user_message
});
}
if (this.response_text) {
messages.push({
role: "assistant",
content: this.response_text
});
}
return messages;
}
get thread() {
const thread_key = this.data.thread_key;
if (!thread_key)
return null;
return this.env.smart_chat_threads.get(thread_key);
}
};

var CollectionDataAdapter3 = class {
/**
* @constructor
* @param {Object} collection - The collection instance that this adapter manages.
*/
constructor(collection) {
this.collection = collection;
this.env = collection.env;
}
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = ItemDataAdapter3;
/**
* Optional factory method to create item adapters.
* If `this.item_adapter_class` is not null, it uses that; otherwise can be overridden by subclasses.
* @param {Object} item - The item to create an adapter for.
* @returns {ItemDataAdapter}
*/
create_item_adapter(item) {
if (!this.ItemDataAdapter) {
throw new Error("No item_adapter_class specified and create_item_adapter not overridden.");
}
return new this.ItemDataAdapter(item);
}
/**
* Load a single item by its key using an `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item(key) {
throw new Error("Not implemented");
}
/**
* Save a single item by its key using its associated `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to save.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save_item(key) {
throw new Error("Not implemented");
}
/**
* Delete a single item by its key. This may involve updating or removing its file,
* as handled by the `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to delete.
* @returns {Promise<void>} Resolves when the item is deleted.
*/
async delete_item(key) {
throw new Error("Not implemented");
}
/**
* Process any queued load operations. Typically orchestrates calling `load_item()`
* on items that have been flagged for loading.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
throw new Error("Not implemented");
}
/**
* Process any queued save operations. Typically orchestrates calling `save_item()`
* on items that have been flagged for saving.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
throw new Error("Not implemented");
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item_if_updated(item) {
const adapter = this.create_item_adapter(item);
await adapter.load_if_updated();
}
};
var ItemDataAdapter3 = class {
/**
* @constructor
* @param {Object} item - The collection item instance that this adapter manages.
*/
constructor(item) {
this.item = item;
}
/**
* Load the item's data from storage. May involve reading a file and parsing
* its contents, then updating `item.data`.
* @async
* @returns {Promise<void>} Resolves when the item is fully loaded.
*/
async load() {
throw new Error("Not implemented");
}
/**
* Save the item's data to storage. May involve writing to a file or appending
* lines in an append-only format.
* @async
* @param {string|null} [ajson=null] - An optional serialized representation of the item’s data.
*                                     If not provided, the adapter should derive it from the item.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save(ajson = null) {
throw new Error("Not implemented");
}
/**
* Delete the item's data from storage. May involve removing a file or writing
* a `null` entry in an append-only file to signify deletion.
* @async
* @returns {Promise<void>} Resolves when the item’s data is deleted.
*/
async delete() {
throw new Error("Not implemented");
}
/**
* Returns the file path or unique identifier used by this adapter to locate and store
* the item's data. This may be a file name derived from the item's key.
* @returns {string} The path or identifier for the item's data.
*/
get data_path() {
throw new Error("Not implemented");
}
/**
* @returns {CollectionDataAdapter} The collection data adapter that this item data adapter belongs to.
*/
get collection_adapter() {
return this.item.collection.data_adapter;
}
get env() {
return this.item.env;
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_if_updated() {
throw new Error("Not implemented");
}
};

var FileCollectionDataAdapter3 = class extends CollectionDataAdapter3 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = FileItemDataAdapter3;
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.collection.data_fs || this.collection.env.data_fs;
}
};
var FileItemDataAdapter3 = class extends ItemDataAdapter3 {
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.item.collection.data_fs || this.item.collection.env.data_fs;
}
get data_path() {
throw new Error("Not implemented");
}
async load_if_updated() {
const data_path = this.data_path;
if (await this.fs.exists(data_path)) {
const loaded_at = this.item.loaded_at || 0;
const data_file_stat = await this.fs.stat(data_path);
if (data_file_stat.mtime > loaded_at + 1 * 60 * 1e3) {
console.log(`Smart Collections: Re-loading item ${this.item.key} because it has been updated on disk`);
await this.load();
}
}
}
};

var class_to_collection_key3 = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
var AjsonMultiFileCollectionDataAdapter3 = class extends FileCollectionDataAdapter3 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = AjsonMultiFileItemDataAdapter3;
/**
* Load a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async load_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.load();
}
/**
* Save a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async save_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.save();
}
/**
* Process any queued load operations.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const load_queue = Object.values(this.collection.items).filter((item) => item._queue_load);
if (!load_queue.length) {
this.collection.clear_process_notice("loading_collection");
return;
}
console.log(`Loading ${this.collection.collection_key}: ${load_queue.length} items`);
const batch_size = 100;
for (let i = 0; i < load_queue.length; i += batch_size) {
const batch = load_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.load().catch((err) => {
console.warn(`Error loading item ${item.key}`, err);
item.queue_load();
});
}));
}
console.log(`Loaded ${this.collection.collection_key} in ${this.collection.load_time_ms}ms`);
this.collection.loaded = load_queue.length;
this.collection.clear_process_notice("loading_collection");
}
/**
* Process any queued save operations.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
console.log(`Saving ${this.collection.collection_key}: ${save_queue.length} items`);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
get_item_data_path(key) {
return [
this.collection.data_dir || "multi",
this.fs?.sep || "/",
this.get_data_file_name(key) + ".ajson"
].join("");
}
/**
* Transforms the item key into a safe filename.
* Replaces spaces, slashes, and dots with underscores.
* @returns {string} safe file name
*/
get_data_file_name(key) {
return key.split("#")[0].replace(/[\s\/\.]/g, "_").replace(".md", "");
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson(item) {
const collection_key = item.collection_key;
const key = item.key;
const data_value = item.deleted ? "null" : JSON.stringify(item.data);
return `${JSON.stringify(`${collection_key}:${key}`)}: ${data_value},`;
}
};
var AjsonMultiFileItemDataAdapter3 = class extends FileItemDataAdapter3 {
/**
* Derives the `.ajson` file path from the collection's data_dir and item key.
* @returns {string}
*/
get data_path() {
return this.collection_adapter.get_item_data_path(this.item.key);
}
/**
* Load the item from its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async load() {
try {
const raw_data = await this.fs.adapter.read(this.data_path, "utf-8", { no_cache: true });
if (!raw_data) {
this.item.queue_import();
return;
}
const { rewrite, file_data } = this._parse(raw_data);
if (rewrite) {
if (file_data.length)
await this.fs.write(this.data_path, file_data);
else
await this.fs.remove(this.data_path);
}
const last_import_mtime = this.item.data.last_import?.at || 0;
if (last_import_mtime && this.item.init_file_mtime > last_import_mtime) {
this.item.queue_import();
}
} catch (e) {
this.item.queue_import();
}
}
/**
* Parse the entire AJSON content as a JSON object, handle legacy keys, and extract final state.
* @private
* @param {string} ajson
* @returns {boolean}
*/
_parse(ajson) {
try {
let rewrite = false;
if (!ajson.length)
return false;
ajson = ajson.trim();
const original_line_count = ajson.split("\n").length;
const json_str = "{" + ajson.slice(0, -1) + "}";
const data = JSON.parse(json_str);
const entries = Object.entries(data);
for (let i = 0; i < entries.length; i++) {
const [ajson_key, value] = entries[i];
if (!value) {
delete data[ajson_key];
rewrite = true;
continue;
}
const { collection_key, item_key, changed } = this._parse_ajson_key(ajson_key);
if (changed) {
rewrite = true;
data[collection_key + ":" + item_key] = value;
delete data[ajson_key];
}
const collection = this.env[collection_key];
if (!collection)
continue;
const existing_item = collection.get(item_key);
if (!value.key)
value.key = item_key;
if (existing_item) {
existing_item.data = value;
existing_item._queue_load = false;
existing_item.loaded_at = Date.now();
} else {
const ItemClass = collection.item_type;
const new_item = new ItemClass(this.env, value);
new_item._queue_load = false;
new_item.loaded_at = Date.now();
collection.set(new_item);
}
}
if (rewrite || original_line_count > entries.length) {
rewrite = true;
}
return {
rewrite,
file_data: rewrite ? Object.entries(data).map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)},`).join("\n") : null
};
} catch (e) {
if (ajson.split("\n").some((line) => !line.endsWith(","))) {
console.warn("fixing trailing comma error");
ajson = ajson.split("\n").map((line) => line.endsWith(",") ? line : line + ",").join("\n");
return this._parse(ajson);
}
console.warn("Error parsing JSON:", e);
return { rewrite: true, file_data: null };
}
}
_parse_ajson_key(ajson_key) {
let changed;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key3[collection_key]) {
collection_key = class_to_collection_key3[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
/**
* Save the current state of the item by appending a new line to its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async save(retries = 0) {
try {
const ajson_line = this.get_item_ajson();
await this.fs.append(this.data_path, "\n" + ajson_line);
this.item._queue_save = false;
} catch (e) {
if (e.code === "ENOENT" && retries < 1) {
console.warn("ENOENT, creating directory", this.data_path);
const dir = this.collection_adapter.collection.data_dir;
if (!await this.fs.exists(dir)) {
await this.fs.mkdir(dir);
}
return await this.save(retries + 1);
}
console.warn("Error saving item", this.data_path, e);
}
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson() {
return this.collection_adapter.get_item_ajson(this.item);
}
};

function ajson_merge(existing, new_obj) {
if (new_obj === null)
return null;
if (new_obj === void 0)
return existing;
if (typeof new_obj !== "object")
return new_obj;
if (typeof existing !== "object" || existing === null)
existing = {};
const keys = Object.keys(new_obj);
const length = keys.length;
for (let i = 0; i < length; i++) {
const key = keys[i];
const new_val = new_obj[key];
const existing_val = existing[key];
if (Array.isArray(new_val)) {
existing[key] = new_val.slice();
} else if (is_object(new_val)) {
existing[key] = ajson_merge(is_object(existing_val) ? existing_val : {}, new_val);
} else if (new_val !== void 0) {
existing[key] = new_val;
}
}
return existing;
}
function is_object(obj) {
return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

var class_to_collection_key4 = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
function _parse_ajson_key(ajson_key) {
let changed = false;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key4[collection_key]) {
collection_key = class_to_collection_key4[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
var AjsonSingleFileCollectionDataAdapter = class extends AjsonMultiFileCollectionDataAdapter3 {
/**
* Returns the single shared `.ajson` file path for this collection.
* @param {string} [key] - (unused) Item key, ignored in single-file mode.
* @returns {string} The single .ajson file path for the entire collection.
*/
get_item_data_path(key) {
const file_name = (this.collection?.collection_key || "collection") + ".ajson";
const sep = this.fs?.sep || "/";
const dir = this.collection.data_dir || "data";
return [dir, file_name].join(sep);
}
/**
* Override process_load_queue to parse the entire single-file .ajson once,
* distributing final states to items.
*
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const path = this.get_item_data_path();
if (!await this.fs.exists(path)) {
for (const item of Object.values(this.collection.items)) {
if (item._queue_load) {
item.queue_import?.();
}
}
this.collection.clear_process_notice("loading_collection");
return;
}
const raw_data = await this.fs.read(path, "utf-8", { no_cache: true });
if (!raw_data) {
for (const item of Object.values(this.collection.items)) {
if (item._queue_load) {
item.queue_import?.();
}
}
this.collection.clear_process_notice("loading_collection");
return;
}
const { rewrite, file_data } = this.parse_single_file_ajson(raw_data);
if (rewrite) {
if (file_data.length) {
await this.fs.write(path, file_data);
} else {
await this.fs.remove(path);
}
}
for (const item of Object.values(this.collection.items)) {
item._queue_load = false;
item.loaded_at = Date.now();
}
this.collection.clear_process_notice("loading_collection");
}
/**
* Helper to parse single-file .ajson content, distributing states to items.
*
* @param {string} raw
* @returns {{ rewrite: boolean, file_data: string }}
*/
parse_single_file_ajson(raw) {
let rewrite = false;
const lines = raw.trim().split("\n").filter(Boolean);
let data_map = {};
let line_count = 0;
for (let i = 0; i < lines.length; i++) {
const line = lines[i].trim();
if (!line.endsWith(",")) {
rewrite = true;
}
const trimmed = line.replace(/,$/, "");
const combined = "{" + trimmed + "}";
try {
const obj = JSON.parse(combined);
const [fullKey, value] = Object.entries(obj)[0];
let { collection_key, item_key, changed } = _parse_ajson_key(fullKey);
const newKey = `${collection_key}:${item_key}`;
if (!value) {
delete data_map[newKey];
if (changed || newKey !== fullKey) {
delete data_map[fullKey];
}
rewrite = true;
} else {
data_map[newKey] = value;
if (changed || newKey !== fullKey) {
delete data_map[fullKey];
rewrite = true;
}
}
} catch (err) {
console.warn("parse error for line: ", line, err);
rewrite = true;
}
line_count++;
}
for (const [ajson_key, val] of Object.entries(data_map)) {
const [collection_key, ...rest] = ajson_key.split(":");
const item_key = rest.join(":");
const collection = this.collection.env[collection_key];
if (!collection)
continue;
let item = collection.get(item_key);
if (!item) {
const ItemClass = collection.item_type;
item = new ItemClass(this.env, val);
collection.set(item);
} else {
item.data = ajson_merge(item.data, val);
}
item.loaded_at = Date.now();
item._queue_load = false;
if (!val.key)
val.key = item_key;
}
if (line_count > Object.keys(data_map).length) {
rewrite = true;
}
let minimal_lines = [];
for (const [ajson_key, val] of Object.entries(data_map)) {
minimal_lines.push(`${JSON.stringify(ajson_key)}: ${JSON.stringify(val)},`);
}
return {
rewrite,
file_data: minimal_lines.join("\n")
};
}
/**
* Override process_save_queue for single-file approach.
* We'll simply call save_item for each queued item, which appends a line to the same `.ajson`.
*
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved (single-file) ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
};

function insert_user_message(request, user_message, opts = {}) {
if (!user_message)
return;
const { position = "end" } = opts;
if (!request.messages) {
request.messages = [];
}
const last_user_index = request.messages.findLastIndex((x) => x.role === "user");
if (last_user_index === -1) {
const new_user_message = {
role: "user",
content: [{ type: "text", text: user_message }]
};
request.messages.push(new_user_message);
return;
}
const last_user_message = request.messages[last_user_index];
if (!Array.isArray(last_user_message.content)) {
last_user_message.content = [
{
type: "text",
text: last_user_message.content
}
];
}
if (position === "start") {
last_user_message.content.unshift({
type: "text",
text: user_message
});
} else {
last_user_message.content.push({
type: "text",
text: user_message
});
}
}

var SmartCompletionAdapter = class {
constructor(item) {
this.item = item;
}
get data() {
return this.item.data;
}
get completion() {
return this.data.completion;
}
get request() {
return this.item.data.completion.request;
}
get response() {
return this.item.response;
}
insert_user_message(user_message) {
insert_user_message(this.request, user_message);
}
static get property_name() {
return null;
}
/**
* @returns {Promise<void>}
*/
async to_request() {
}
/**
* @returns {Promise<void>}
*/
async from_response() {
}
};

var SmartCompletionTemplateAdapter = class extends SmartCompletionAdapter {
/**
* @returns {string}
*/
static get property_name() {
return "template_key";
}
/**
* to_request: Locates the template item, injects relevant fields into request.
* @returns {Promise<void>}
*/
async to_request() {
const template_key = this.data.template_key;
if (!template_key)
return;
const template_collection = this.item.env.smart_templates;
if (!template_collection) {
console.warn("No 'smart_templates' collection found; skipping template adapter.");
return;
}
const template_item = template_collection.get(template_key);
if (!template_item) {
console.warn(`Template item not found for key '${template_key}'`);
return;
}
const template_content = await template_item.get_template();
const template_templates = this.data.template_templates;
const system_prompt = compile_template_instructions(template_content, template_templates);
this.insert_user_message(system_prompt);
}
/**
* from_response: No post-processing needed for this template usage.
* @returns {Promise<void>}
*/
async from_response() {
}
};
function compile_template_instructions(template_text, template_templates = {}) {
if (!template_templates.before)
template_templates.before = `Important: use the following template to format your response:
- should output exact headings
- should interpret non-heading template text as instructions
- each non-heading template text should be considered specific to the respective heading

---BEGIN TEMPLATE---`;
if (!template_templates.after)
template_templates.after = `---END TEMPLATE---`;
return `${template_templates.before}
${template_text}
${template_templates.after}`;
}

var SmartCompletionThreadAdapter = class extends SmartCompletionAdapter {
/**
* @returns {string}
*/
static get property_name() {
return "thread_key";
}
/**
* to_request: Appends messages from the referenced thread.
* @returns {Promise<void>}
*/
async to_request() {
console.log("thread to_request", this.data);
const thread_key = this.data.thread_key;
if (!thread_key)
return;
const thread_collection = this.item.env.smart_chat_threads;
if (!thread_collection) {
console.warn("No 'smart_chat_threads' collection found in environment; skipping thread adapter.");
return;
}
const thread_item = thread_collection.get(thread_key);
if (!thread_item || !Array.isArray(thread_item.messages)) {
console.warn(`Thread item '${thread_key}' not found or missing .data.messages array`);
return;
}
if (!this.request.messages) {
this.request.messages = [];
}
for (const completion of thread_item.completions) {
if (this.item.key === completion.key)
continue;
this.request.messages.push(...completion.messages);
if (completion.data.context_key) {
const context_key = completion.data.context_key;
const context_item = completion.env.smart_contexts.get(context_key);
if (context_item) {
const { context } = await context_item.compile();
this.insert_user_message(context);
}
}
}
console.log("thread to_request", this.request.messages);
}
/**
* from_response: No post-processing needed for thread.
* @returns {Promise<void>}
*/
async from_response() {
const thread = this.item.thread;
if (!thread)
return console.warn("No thread found");
setTimeout(() => {
thread.queue_save();
thread.collection.process_save_queue();
}, 1e3);
}
};

async function insert_image(request, image_path, fs) {
const base64_image = await convert_image_to_base64(fs, image_path);
console.log("base64_image", base64_image);
if (!base64_image)
return;
const last_user_index = request.messages.findLastIndex((x) => x.role === "user");
const image_content = {
role: "user",
content: [{ type: "image_url", image_url: { url: base64_image } }]
};
if (last_user_index === -1) {
request.messages.unshift(image_content);
}
const last_user_message = request.messages[last_user_index];
if (!last_user_message)
return;
if (!Array.isArray(last_user_message.content)) {
last_user_message.content = [];
}
last_user_message.content.push(image_content);
}
async function convert_image_to_base64(fs, image_path) {
console.log("convert image_path", image_path);
if (!image_path)
return;
const image_exts = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"];
const ext = image_path.split(".").pop().toLowerCase();
if (!image_exts.includes(ext))
return;
try {
const base64_data = await fs.read(image_path, "base64");
const base64_url = `data:image/${ext};base64,${base64_data}`;
return base64_url;
} catch (err) {
console.warn(`Failed to convert image ${image_path} to base64`, err);
}
}

var SmartCompletionContextAdapter = class extends SmartCompletionAdapter {
static get property_name() {
return "context_key";
}
async to_request() {
const context_key = this.data.context_key;
if (!context_key)
return;
const context_opts = this.data.context_opts;
const context_collection = this.item.env.smart_contexts;
if (!context_collection) {
console.warn("No 'smart_contexts' collection found; skipping context adapter.");
return;
}
const ctx_item = context_collection.get(context_key);
if (!ctx_item) {
console.warn(`SmartContext not found for key '${context_key}'`);
return;
}
await ctx_item.save();
let compiled;
try {
compiled = await ctx_item.compile(context_opts);
console.log("compiled", context_key, compiled);
} catch (err) {
console.warn("Error compiling ephemeral context", err);
return;
}
if (compiled.context) {
this.insert_user_message(compiled.context, { position: "start" });
}
if (compiled.images.length > 0) {
await this.insert_images(compiled.images);
}
}
async insert_images(image_paths) {
if (!Array.isArray(image_paths) || !image_paths.length)
return;
for (const img_path of image_paths) {
console.log("img_path", img_path);
await insert_image(this.request, img_path, this.item.env.fs);
}
}
/**
* No special post-processing after we get model response.
*/
async from_response() {
}
};

var SmartCompletionUserAdapter = class extends SmartCompletionAdapter {
/**
* @returns {string}
*/
static get property_name() {
return "user_message";
}
get request() {
return this.item.data.completion.request;
}
/**
* to_request: Checks `data.user`, adds a user message to `request.messages`.
* @returns {Promise<void>}
*/
async to_request() {
const user_message = this.data.user_message;
insert_user_message(this.request, user_message);
}
/**
* from_response: No post-processing needed for default user message.
* @returns {Promise<void>}
*/
async from_response() {
}
};

var SmartCompletionActionAdapter = class extends SmartCompletionAdapter {
static get property_name() {
return "action_key";
}
/**
* @returns {Promise<void>}
*/
async to_request() {
const action_key = this.data.action_key;
if (!action_key)
return;
const action_opts = this.data.action_opts;
const action_collection = this.item.env.smart_actions;
if (!action_collection) {
console.warn("No 'smart_actions' collection found; skipping action adapter.");
return;
}
const action_item = action_collection.get(action_key);
if (!action_item) {
console.warn(`SmartAction not found for key '${action_key}'`);
return;
}
let tools;
try {
const action_module = action_item.module;
tools = action_module.tool ? [action_module.tool] : convert_openapi_to_tools(action_module.openapi);
} catch (err) {
console.warn("Error compiling ephemeral action", err);
return;
}
if (!tools)
return;
if (!this.data.actions)
this.data.actions = {};
this.data.actions[action_key] = true;
this.insert_tools(tools, { force: true });
}
/**
* @returns {Promise<void>}
*/
async from_response() {
console.log("SmartCompletionActionAdapter: from_response");
const tool_call = this.response.choices[0].message?.tool_calls?.[0];
if (!tool_call)
return console.warn("No tool call found in response");
const action_key = tool_call?.function?.name;
const tool_arguments = tool_call?.function?.arguments;
if (!action_key)
return;
const action_collection = this.item.env.smart_actions;
if (!action_collection)
return;
const action_item = action_collection.get(action_key);
if (!action_item)
return;
let parsed_args = tool_arguments;
if (typeof parsed_args === "string") {
try {
parsed_args = JSON.parse(parsed_args);
} catch (err) {
console.warn("Could not parse tool_call arguments", err);
return;
}
}
const result = await action_item.run_action(parsed_args);
console.log("SmartCompletionActionAdapter: result", result);
if (result && typeof result === "object" && result.final) {
if (!this.item.data.completion.responses[0]) {
this.item.data.completion.responses[0] = { choices: [{ message: {} }] };
} else if (!this.item.data.completion.responses[0].choices?.[0]) {
this.item.data.completion.responses[0].choices = [{ message: {} }];
}
this.item.data.completion.responses[0].choices[0].message = {
...this.item.data.completion.responses[0].choices[0].message,
role: "assistant",
content: result.final
};
}
if (!this.data.actions)
this.data.actions = {};
this.data.actions[action_key] = result;
}
/**
* Insert the ephemeral tools into the request
* @param {Array<object>} tools
* @param {object} opts
* @returns {void}
*/
insert_tools(tools, opts = {}) {
this.request.tools = tools;
if (opts.force) {
this.request.tool_choice = {
type: "function",
function: {
name: tools[0].function.name
}
};
}
}
};
function convert_openapi_to_tools(openapi_spec) {
const tools = [];
for (const path in openapi_spec.paths) {
const methods = openapi_spec.paths[path];
for (const method in methods) {
const endpoint = methods[method];
const parameters = endpoint.parameters || [];
const requestBody = endpoint.requestBody;
const properties = {};
const required = [];
parameters.forEach((param) => {
properties[param.name] = {
type: param.schema.type,
description: param.description || ""
};
if (param.required)
required.push(param.name);
});
if (requestBody) {
const schema = requestBody.content["application/json"].schema;
Object.assign(properties, schema.properties);
if (schema.required)
required.push(...schema.required);
}
tools.push({
type: "function",
function: {
name: endpoint.operationId || `${method}_${path.replace(/\//g, "_").replace(/[{}]/g, "")}`,
description: endpoint.summary || endpoint.description || "",
parameters: {
type: "object",
properties,
required
}
}
});
}
}
return tools;
}

var SmartCompletionSystemAdapter = class extends SmartCompletionAdapter {
/**
* Identifies the data property that triggers this adapter.
* @returns {string}
*/
static get property_name() {
return "system_message";
}
/**
* to_request: If `data.system_message` is present, prepends a system message to request.messages.
* @returns {Promise<void>}
*/
async to_request() {
const sys_msg = this.data.system_message;
if (!sys_msg)
return;
if (!this.request.messages) {
this.request.messages = [];
}
this.request.messages.unshift({
role: "system",
content: sys_msg
});
}
/**
* from_response: No post-processing needed here.
* @returns {Promise<void>}
*/
async from_response() {
}
};

var smart_completions_default_config = {
class: SmartCompletions,
data_adapter: AjsonSingleFileCollectionDataAdapter,
completion_adapters: {
SmartCompletionTemplateAdapter,
SmartCompletionThreadAdapter,
SmartCompletionContextAdapter,
SmartCompletionUserAdapter,
SmartCompletionActionAdapter,
SmartCompletionSystemAdapter
}
};

function collection_instance_name_from5(class_name) {
if (class_name.endsWith("Item")) {
return class_name.replace(/Item$/, "").toLowerCase();
}
return class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/y$/, "ie") + "s";
}

function create_uid5(data) {
const str = JSON.stringify(data);
let hash = 0;
if (str.length === 0)
return hash;
for (let i = 0; i < str.length; i++) {
const char = str.charCodeAt(i);
hash = (hash << 5) - hash + char;
hash = hash & hash;
if (hash < 0)
hash = hash * -1;
}
return hash.toString() + str.length;
}
function deep_merge6(target, source) {
for (const key in source) {
if (source.hasOwnProperty(key)) {
if (is_obj(source[key]) && is_obj(target[key]))
deep_merge6(target[key], source[key]);
else
target[key] = source[key];
}
}
return target;
function is_obj(item) {
return item && typeof item === "object" && !Array.isArray(item);
}
}

function deep_equal5(obj1, obj2, visited = /* @__PURE__ */ new WeakMap()) {
if (obj1 === obj2)
return true;
if (obj1 === null || obj2 === null || obj1 === void 0 || obj2 === void 0)
return false;
if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2))
return false;
if (Array.isArray(obj1)) {
if (obj1.length !== obj2.length)
return false;
return obj1.every((item, index) => deep_equal5(item, obj2[index], visited));
}
if (typeof obj1 === "object") {
if (visited.has(obj1))
return visited.get(obj1) === obj2;
visited.set(obj1, obj2);
const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);
if (keys1.length !== keys2.length)
return false;
return keys1.every((key) => deep_equal5(obj1[key], obj2[key], visited));
}
return obj1 === obj2;
}

var CollectionItem5 = class _CollectionItem {
/**
* Default properties for an instance of CollectionItem.
* Override in subclasses to define different defaults.
* @returns {Object}
*/
static get defaults() {
return {
data: {}
};
}
/**
* @param {Object} env - The environment/context.
* @param {Object|null} [data=null] - Initial data for the item.
*/
constructor(env, data = null) {
env.create_env_getter(this);
this.config = this.env?.config;
this.merge_defaults();
if (data)
deep_merge6(this.data, data);
if (!this.data.class_name)
this.data.class_name = this.constructor.name;
}
/**
* Loads an item from data and initializes it.
* @param {Object} env
* @param {Object} data
* @returns {CollectionItem}
*/
static load(env, data) {
const item = new this(env, data);
item.init();
return item;
}
/**
* Merge default properties from the entire inheritance chain.
* @private
*/
merge_defaults() {
let current_class = this.constructor;
while (current_class) {
for (let key in current_class.defaults) {
const default_val = current_class.defaults[key];
if (typeof default_val === "object") {
this[key] = { ...default_val, ...this[key] };
} else {
this[key] = this[key] === void 0 ? default_val : this[key];
}
}
current_class = Object.getPrototypeOf(current_class);
}
}
/**
* Generates or retrieves a unique key for the item.
* Key syntax supports:
* - `[i]` for sequences
* - `/` for super-sources (groups, directories, clusters)
* - `#` for sub-sources (blocks)
* @returns {string} The unique key
*/
get_key() {
return create_uid5(this.data);
}
/**
* Updates the item data and returns true if changed.
* @param {Object} data
* @returns {boolean} True if data changed.
*/
update_data(data) {
const sanitized_data = this.sanitize_data(data);
const current_data = { ...this.data };
deep_merge6(current_data, sanitized_data);
const changed = !deep_equal5(this.data, current_data);
if (!changed)
return false;
this.data = current_data;
return true;
}
/**
* Sanitizes data for saving. Ensures no circular references.
* @param {*} data
* @returns {*} Sanitized data.
*/
sanitize_data(data) {
if (data instanceof _CollectionItem)
return data.ref;
if (Array.isArray(data))
return data.map((val) => this.sanitize_data(val));
if (typeof data === "object" && data !== null) {
return Object.keys(data).reduce((acc, key) => {
acc[key] = this.sanitize_data(data[key]);
return acc;
}, {});
}
return data;
}
/**
* Initializes the item. Override as needed.
* @param {Object} [input_data] - Additional data that might be provided on creation.
*/
init(input_data) {
}
/**
* Queues this item for saving.
*/
queue_save() {
this._queue_save = true;
}
/**
* Saves this item using its data adapter.
* @returns {Promise<void>}
*/
async save() {
try {
await this.data_adapter.save_item(this);
this.init();
} catch (err) {
this._queue_save = true;
console.error(err, err.stack);
}
}
/**
* Queues this item for loading.
*/
queue_load() {
this._queue_load = true;
}
/**
* Loads this item using its data adapter.
* @returns {Promise<void>}
*/
async load() {
try {
await this.data_adapter.load_item(this);
this.init();
} catch (err) {
this._load_error = err;
this.on_load_error(err);
}
}
/**
* Handles load errors by re-queuing for load.
* Override if needed.
* @param {Error} err
*/
on_load_error(err) {
this.queue_load();
}
/**
* Validates the item before saving. Checks for presence and validity of key.
* @returns {boolean}
*/
validate_save() {
if (!this.key)
return false;
if (this.key.trim() === "")
return false;
if (this.key === "undefined")
return false;
return true;
}
/**
* Marks this item as deleted. This does not immediately remove it from memory,
* but queues a save that will result in the item being removed from persistent storage.
*/
delete() {
this.deleted = true;
this.queue_save();
}
/**
* Filters items in the collection based on provided options.
* functional filter (returns true or false) for filtering items in collection; called by collection class
* @param {Object} filter_opts - Filtering options.
* @param {string} [filter_opts.exclude_key] - A single key to exclude.
* @param {string[]} [filter_opts.exclude_keys] - An array of keys to exclude. If exclude_key is provided, it's added to this array.
* @param {string} [filter_opts.exclude_key_starts_with] - Exclude keys starting with this string.
* @param {string[]} [filter_opts.exclude_key_starts_with_any] - Exclude keys starting with any of these strings.
* @param {string} [filter_opts.exclude_key_includes] - Exclude keys that include this string.
* @param {string} [filter_opts.key_ends_with] - Include only keys ending with this string.
* @param {string} [filter_opts.key_starts_with] - Include only keys starting with this string.
* @param {string[]} [filter_opts.key_starts_with_any] - Include only keys starting with any of these strings.
* @param {string} [filter_opts.key_includes] - Include only keys that include this string.
* @returns {boolean} True if the item passes the filter, false otherwise.
*/
filter(filter_opts = {}) {
const {
exclude_key,
exclude_keys = exclude_key ? [exclude_key] : [],
exclude_key_starts_with,
exclude_key_starts_with_any,
exclude_key_includes,
exclude_key_includes_any,
key_ends_with,
key_starts_with,
key_starts_with_any,
key_includes,
key_includes_any
} = filter_opts;
if (exclude_keys?.includes(this.key))
return false;
if (exclude_key_starts_with && this.key.startsWith(exclude_key_starts_with))
return false;
if (exclude_key_starts_with_any && exclude_key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (exclude_key_includes && this.key.includes(exclude_key_includes))
return false;
if (exclude_key_includes_any && exclude_key_includes_any.some((include) => this.key.includes(include)))
return false;
if (key_ends_with && !this.key.endsWith(key_ends_with))
return false;
if (key_starts_with && !this.key.startsWith(key_starts_with))
return false;
if (key_starts_with_any && !key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (key_includes && !this.key.includes(key_includes))
return false;
if (key_includes_any && !key_includes_any.some((include) => this.key.includes(include)))
return false;
return true;
}
/**
* Parses item data for additional processing. Override as needed.
*/
parse() {
}
/**
* Helper function to render a component in the item scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
get actions() {
if (!this._actions) {
this._actions = Object.entries(this.env.opts.items[this.item_type_key].actions || {}).reduce((acc, [k, v]) => {
acc[k] = v.bind(this);
return acc;
}, {});
}
return this._actions;
}
/**
* Derives the collection key from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from5(name);
}
/**
* @returns {string} The collection key for this item.
*/
get collection_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from5(name);
}
/**
* Retrieves the parent collection from the environment.
* @returns {Collection}
*/
get collection() {
return this.env[this.collection_key];
}
/**
* @returns {string} The item's key.
*/
get key() {
return this.data?.key || this.get_key();
}
get item_type_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return camel_case_to_snake_case6(name);
}
/**
* A simple reference object for this item.
* @returns {{collection_key: string, key: string}}
*/
get ref() {
return { collection_key: this.collection_key, key: this.key };
}
/**
* @returns {Object} The data adapter for this item's collection.
*/
get data_adapter() {
return this.collection.data_adapter;
}
/**
* @returns {Object} The filesystem adapter.
*/
get data_fs() {
return this.collection.data_fs;
}
/**
* Access to collection-level settings.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key])
this.env.settings[this.collection_key] = {};
return this.env.settings[this.collection_key];
}
set settings(settings) {
this.env.settings[this.collection_key] = settings;
this.env.smart_settings.save();
}
/**
* Render this item into a container using the item's component.
* @deprecated 2024-12-02 Use explicit component pattern from environment
* @param {HTMLElement} container
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_item(container, opts = {}) {
const frag = await this.component.call(this.smart_view, this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* @deprecated use env.smart_view
* @returns {Object}
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Override in child classes to set the component for this item
* @deprecated 2024-12-02
* @returns {Function} The render function for this component
*/
get component() {
return item_component;
}
};
function camel_case_to_snake_case6(str) {
const result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, "").replace(/2$/, "");
return result;
}

var AsyncFunction5 = Object.getPrototypeOf(async function() {
}).constructor;
var Collection5 = class {
/**
* Constructs a new Collection instance.
*
* @param {Object} env - The environment context containing configurations and adapters.
* @param {Object} [opts={}] - Optional configuration.
* @param {string} [opts.collection_key] - Custom key to override default collection name.
* @param {string} [opts.data_dir] - Custom data directory path.
* @param {boolean} [opts.prevent_load_on_init] - Whether to prevent loading items on initialization.
*/
constructor(env, opts = {}) {
env.create_env_getter(this);
this.opts = opts;
if (opts.collection_key)
this.collection_key = opts.collection_key;
this.env[this.collection_key] = this;
this.config = this.env.config;
this.items = {};
this.loaded = null;
this._loading = false;
this.load_time_ms = null;
this.settings_container = null;
}
/**
* Initializes a new collection in the environment. Override in subclass if needed.
*
* @param {Object} env
* @param {Object} [opts={}]
* @returns {Promise<void>}
*/
static async init(env, opts = {}) {
env[this.collection_key] = new this(env, opts);
await env[this.collection_key].init();
env.collections[this.collection_key] = "init";
}
/**
* The unique collection key derived from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Instance-level init. Override in subclasses if necessary.
* @returns {Promise<void>}
*/
async init() {
}
/**
* Creates or updates an item in the collection.
* - If `data` includes a key that matches an existing item, that item is updated.
* - Otherwise, a new item is created.
* After updating or creating, the item is validated. If validation fails, the item is logged and returned without being saved.
* If validation succeeds for a new item, it is added to the collection and marked for saving.
*
* If the item’s `init()` method is async, a promise is returned that resolves once init completes.
*
* @param {Object} [data={}] - Data for creating/updating an item.
* @returns {Promise<Item>|Item} The created or updated item. May return a promise if `init()` is async.
*/
create_or_update(data = {}) {
const existing_item = this.find_by(data);
const item = existing_item ? existing_item : new this.item_type(this.env);
item._queue_save = !existing_item;
const data_changed = item.update_data(data);
if (!existing_item && !item.validate_save()) {
return item;
}
if (!existing_item) {
this.set(item);
}
if (existing_item && !data_changed)
return existing_item;
if (item.init instanceof AsyncFunction5) {
return new Promise((resolve) => {
item.init(data).then(() => resolve(item));
});
}
item.init(data);
return item;
}
/**
* Finds an item by partial data match (first checks key). If `data.key` provided,
* returns the item with that key; otherwise attempts a match by merging data.
*
* @param {Object} data - Data to match against.
* @returns {Item|null}
*/
find_by(data) {
if (data.key)
return this.get(data.key);
const temp = new this.item_type(this.env);
const temp_data = JSON.parse(JSON.stringify(data, temp.sanitize_data(data)));
deep_merge6(temp.data, temp_data);
return temp.key ? this.get(temp.key) : null;
}
/**
* Filters items based on provided filter options or a custom function.
*
* @param {Object|Function} [filter_opts={}] - Filter options or a predicate function.
* @returns {Item[]} Array of filtered items.
*/
filter(filter_opts = {}) {
if (typeof filter_opts === "function") {
return Object.values(this.items).filter(filter_opts);
}
filter_opts = this.prepare_filter(filter_opts);
const results = [];
const { first_n } = filter_opts;
for (const item of Object.values(this.items)) {
if (first_n && results.length >= first_n)
break;
if (item.filter(filter_opts))
results.push(item);
}
return results;
}
/**
* Alias for `filter()`
* @param {Object|Function} filter_opts
* @returns {Item[]}
*/
list(filter_opts) {
return this.filter(filter_opts);
}
/**
* Prepares filter options. Can be overridden by subclasses to normalize filter options.
*
* @param {Object} filter_opts
* @returns {Object} Prepared filter options.
*/
prepare_filter(filter_opts) {
return filter_opts;
}
/**
* Retrieves an item by key.
* @param {string} key
* @returns {Item|undefined}
*/
get(key) {
return this.items[key];
}
/**
* Retrieves multiple items by an array of keys.
* @param {string[]} keys
* @returns {Item[]}
*/
get_many(keys = []) {
if (!Array.isArray(keys)) {
console.error("get_many called with non-array keys:", keys);
return [];
}
return keys.map((key) => this.get(key)).filter(Boolean);
}
/**
* Retrieves a random item from the collection, optionally filtered by options.
* @param {Object} [opts]
* @returns {Item|undefined}
*/
get_rand(opts = null) {
if (opts) {
const filtered = this.filter(opts);
return filtered[Math.floor(Math.random() * filtered.length)];
}
const keys = this.keys;
return this.items[keys[Math.floor(Math.random() * keys.length)]];
}
/**
* Adds or updates an item in the collection.
* @param {Item} item
*/
set(item) {
if (!item.key)
throw new Error("Item must have a key property");
this.items[item.key] = item;
}
/**
* Updates multiple items by their keys.
* @param {string[]} keys
* @param {Object} data
*/
update_many(keys = [], data = {}) {
this.get_many(keys).forEach((item) => item.update_data(data));
}
/**
* Clears all items from the collection.
*/
clear() {
this.items = {};
}
/**
* @returns {string} The collection key, can be overridden by opts.collection_key
*/
get collection_key() {
return this._collection_key ? this._collection_key : this.constructor.collection_key;
}
set collection_key(key) {
this._collection_key = key;
}
/**
* Lazily initializes and returns the data adapter instance for this collection.
* @returns {Object} The data adapter instance.
*/
get data_adapter() {
if (!this._data_adapter) {
const AdapterClass = this.get_adapter_class("data");
this._data_adapter = new AdapterClass(this);
}
return this._data_adapter;
}
get_adapter_class(type) {
const config = this.env.opts.collections?.[this.collection_key];
const adapter_key = type + "_adapter";
const adapter_module = config?.[adapter_key] ?? this.env.opts.collections?.smart_collections?.[adapter_key];
if (typeof adapter_module === "function")
return adapter_module;
if (typeof adapter_module?.collection === "function")
return adapter_module.collection;
throw new Error(`No '${type}' adapter class found for ${this.collection_key} or smart_collections`);
}
/**
* Data directory strategy for this collection. Defaults to 'multi'.
* @returns {string}
*/
get data_dir() {
return this.collection_key;
}
/**
* File system adapter from the environment.
* @returns {Object}
*/
get data_fs() {
return this.env.data_fs;
}
/**
* Derives the corresponding item class name based on this collection's class name.
* @returns {string}
*/
get item_class_name() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
if (name.endsWith("ies"))
return name.slice(0, -3) + "y";
else if (name.endsWith("s"))
return name.slice(0, -1);
return name + "Item";
}
/**
* Derives a readable item name from the item class name.
* @returns {string}
*/
get item_name() {
return this.item_class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Retrieves the item type (constructor) from the environment.
* @returns {Function} Item constructor.
*/
get item_type() {
if (this.opts.item_type)
return this.opts.item_type;
return this.env.item_types[this.item_class_name];
}
/**
* Returns an array of all keys in the collection.
* @returns {string[]}
*/
get keys() {
return Object.keys(this.items);
}
/**
* @deprecated use data_adapter instead (2024-09-14)
*/
get adapter() {
return this.data_adapter;
}
/**
* @method process_save_queue
* @description
* Saves items flagged for saving (_queue_save) back to AJSON or SQLite. This ensures persistent storage
* of any updates made since last load/import. This method also writes changes to disk (AJSON files or DB).
*/
async process_save_queue(opts = {}) {
if (opts.force) {
Object.values(this.items).forEach((item) => item._queue_save = true);
}
await this.data_adapter.process_save_queue(opts);
}
/**
* @alias process_save_queue
* @returns {Promise<void>}
*/
async save(opts = {}) {
await this.process_save_queue(opts);
}
/**
* @method process_load_queue
* @description
* Loads items that have been flagged for loading (_queue_load). This may involve
* reading from AJSON/SQLite or re-importing from markdown if needed.
* Called once initial environment is ready and collections are known.
*/
async process_load_queue() {
await this.data_adapter.process_load_queue();
}
/**
* Retrieves processed settings configuration.
* @returns {Object}
*/
get settings_config() {
return this.process_settings_config({});
}
/**
* Processes given settings config, adding prefixes and handling conditionals.
*
* @private
* @param {Object} _settings_config
* @param {string} [prefix='']
* @returns {Object}
*/
process_settings_config(_settings_config, prefix = "") {
const add_prefix = (key) => prefix && !key.includes(`${prefix}.`) ? `${prefix}.${key}` : key;
return Object.entries(_settings_config).reduce((acc, [key, val]) => {
let new_val = { ...val };
if (new_val.conditional) {
if (!new_val.conditional(this))
return acc;
delete new_val.conditional;
}
if (new_val.callback)
new_val.callback = add_prefix(new_val.callback);
if (new_val.btn_callback)
new_val.btn_callback = add_prefix(new_val.btn_callback);
if (new_val.options_callback)
new_val.options_callback = add_prefix(new_val.options_callback);
const new_key = add_prefix(this.process_setting_key(key));
acc[new_key] = new_val;
return acc;
}, {});
}
/**
* Processes an individual setting key. Override if needed.
* @param {string} key
* @returns {string}
*/
process_setting_key(key) {
return key;
}
/**
* Default settings for this collection. Override in subclasses as needed.
* @returns {Object}
*/
get default_settings() {
return {};
}
/**
* Current settings for the collection.
* Initializes with default settings if none exist.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key]) {
this.env.settings[this.collection_key] = this.default_settings;
}
return this.env.settings[this.collection_key];
}
/**
* @deprecated use env.smart_view instead
* @returns {Object} smart_view instance
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Renders the settings for the collection into a given container.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_settings(container = this.settings_container, opts = {}) {
return await this.render_collection_settings(container, opts);
}
/**
* Helper function to render collection settings.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_collection_settings(container = this.settings_container, opts = {}) {
if (container && (!this.settings_container || this.settings_container !== container)) {
this.settings_container = container;
} else if (!container) {
container = this.env.smart_view.create_doc_fragment("<div></div>");
}
container.innerHTML = `<div class="sc-loading">Loading ${this.collection_key} settings...</div>`;
const frag = await this.env.render_component("settings", this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* Unloads collection data from memory.
*/
unload() {
this.clear();
this.unloaded = true;
this.env.collections[this.collection_key] = null;
}
/**
* Runs load process for all items in the collection, triggering queue loads and rendering settings after done.
* @returns {Promise<void>}
*/
async run_data_load() {
this.loaded = null;
this.load_time_ms = null;
Object.values(this.items).forEach((item) => item.queue_load());
this.notices?.show("loading_collection", { collection_key: this.collection_key });
await this.process_load_queue();
this.notices?.remove("loading_collection");
this.notices?.show("done_loading_collection", { collection_key: this.collection_key });
this.render_settings();
}
/**
* Helper function to render a component in the collection scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
show_process_notice(process2, opts = {}) {
if (!this.debounce_process_notice)
this.debounce_process_notice = {};
this.debounce_process_notice[process2] = setTimeout(() => {
this.debounce_process_notice[process2] = null;
this.env.notices?.show(process2, { collection_key: this.collection_key, ...opts });
}, 1e3);
}
clear_process_notice(process2) {
if (this.debounce_process_notice?.[process2]) {
clearTimeout(this.debounce_process_notice[process2]);
this.debounce_process_notice[process2] = null;
} else {
this.env.notices?.remove(process2);
}
}
};

var SmartContexts = class extends Collection5 {
/**
* Default settings for all SmartContext items in this collection.
* @readonly
*/
get default_settings() {
return {
link_depth: 0,
inlinks: false,
excluded_headings: [],
max_len: 0,
templates: {
"-1": {
before: "{{FILE_TREE}}"
},
"0": {
before: "{{ITEM_PATH}}\n```{{ITEM_EXT}}",
after: "```"
},
"1": {
before: "LINK: {{ITEM_NAME}}\n```{{ITEM_EXT}}",
after: "```"
},
"1": {
before: "REF: {{ITEM_NAME}}\n```{{ITEM_EXT}}",
after: "```"
}
}
};
}
get compile_adapters() {
if (!this._compile_adapters) {
this._compile_adapters = {};
Object.values(this.opts.compile_adapters || {}).forEach((cls) => {
this._compile_adapters[cls.adapter_key] = cls;
});
}
return this._compile_adapters;
}
get settings_config() {
return {
inlinks: {
name: "In-links",
description: "Include inbound links from other items?",
type: "toggle"
},
excluded_headings: {
name: "Excluded headings",
description: "Headings/patterns to exclude; use newline to separate multiple patterns. Case-sensitive.",
type: "textarea_array"
},
context_explanation: {
type: "html",
value: `
<div class="setting-explanation">
<h5>Context templates</h5>
<span>Included once in the final output at the beginning (before_context) and end (after_context).</span>
<br>
<br>
<span>Available variables:</span>
<ul>
<li><code>{{FILE_TREE}}</code> - Shows hierarchical view of all files</li>
</ul>
</div>
`
},
before_context: {
setting: "templates.-1.before",
name: "Before context",
description: "Text inserted at the top of the final output.",
type: "textarea"
},
after_context: {
setting: "templates.-1.after",
name: "After context",
description: "Text inserted at the bottom of the final output.",
type: "textarea"
},
item_explanation: {
type: "html",
value: `
<div class="setting-explanation">
<h5>Item templates</h5>
<span>Included once for each item (before_item and after_item).</span>
<br>
<br>
<span>Available variables:</span>
<ul>
<li><code>{{ITEM_PATH}}</code> - Full path of the item</li>
<li><code>{{ITEM_NAME}}</code> - Filename of the item</li>
<li><code>{{ITEM_EXT}}</code> - File extension</li>
<li><code>{{ITEM_DEPTH}}</code> - Depth level of the item</li>
<li><code>{{ITEM_TIME_AGO}}</code> - Time since the item was last modified</li>
</ul>
</div>
`
},
before_item: {
setting: "templates.0.before",
name: "Before each primary item",
description: "Text inserted before each depth=0 item.",
type: "textarea"
},
after_item: {
setting: "templates.0.after",
name: "After each primary item",
description: "Text inserted after each depth=0 item.",
type: "textarea"
},
link_explanation: {
type: "html",
value: `
<div class="setting-explanation">
<h5>Link templates</h5>
<span>Inserted before/after each link-based item (depth=1,2,...).
Typically used to separate these items from the primary content.
<i>Note: links are treated similar to items but are aggregated after all items.</i>
</span>
<br>
<br>
<span>Available variables:</span>
<ul>
<li><code>{{ITEM_PATH}}</code> - Full path of the linked file</li>
<li><code>{{ITEM_NAME}}</code> - Filename of the linked file</li>
<li><code>{{ITEM_EXT}}</code> - File extension</li>
<li><code>{{ITEM_DEPTH}}</code> - Depth level of the link</li>
<li><code>{{ITEM_TIME_AGO}}</code> - Time since the linked file was last modified</li>
</ul>
</div>
`
},
before_link: {
setting: "templates.1.before",
name: "Before link item",
description: "Text inserted before each depth=1 link item.",
type: "textarea"
},
after_link: {
setting: "templates.1.after",
name: "After link item",
description: "Text inserted after each depth=1 link item.",
type: "textarea"
}
};
}
};

function parse_markdown_blocks3(markdown, opts = {}) {
const { start_index = 1, line_keys = false } = opts;
const lines = markdown.split("\n");
const result = {};
const heading_stack = [];
const heading_lines = {};
const heading_counts = {};
const sub_block_counts = {};
const subheading_counts = {};
let current_list_item = null;
let current_content_block = null;
let in_frontmatter = false;
let frontmatter_started = false;
const root_heading_key = "#";
let in_code_block = false;
sub_block_counts[root_heading_key] = 0;
for (let i = 0; i < lines.length; i++) {
const line_number = i + start_index;
const line = lines[i];
const trimmed_line = line.trim();
if (trimmed_line === "---") {
if (!frontmatter_started) {
frontmatter_started = true;
in_frontmatter = true;
heading_lines["#---frontmatter---"] = [line_number, null];
continue;
} else if (in_frontmatter) {
in_frontmatter = false;
heading_lines["#---frontmatter---"][1] = line_number;
continue;
}
}
if (in_frontmatter) {
continue;
}
if (trimmed_line.startsWith("```")) {
in_code_block = !in_code_block;
if (!current_content_block) {
const parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (parent_key === root_heading_key) {
current_content_block = { key: root_heading_key, start_line: line_number };
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
continue;
}
const heading_match = trimmed_line.match(/^(#{1,6})\s*(.+)$/);
if (heading_match && !in_code_block) {
const level = heading_match[1].length;
let title = heading_match[2].trim();
while (heading_stack.length > 0 && heading_stack[heading_stack.length - 1].level >= level) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = line_number - 1;
}
}
if (heading_stack.length === 0 && heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = line_number - 1;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = "";
let parent_level = 0;
if (heading_stack.length > 0) {
parent_key = heading_stack[heading_stack.length - 1].key;
parent_level = heading_stack[heading_stack.length - 1].level;
} else {
parent_key = "";
parent_level = 0;
}
if (heading_stack.length === 0) {
heading_counts[title] = (heading_counts[title] || 0) + 1;
if (heading_counts[title] > 1) {
title += `[${heading_counts[title]}]`;
}
} else {
if (!subheading_counts[parent_key]) {
subheading_counts[parent_key] = {};
}
subheading_counts[parent_key][title] = (subheading_counts[parent_key][title] || 0) + 1;
const count = subheading_counts[parent_key][title];
if (count > 1) {
title += `#{${count}}`;
}
}
const level_diff = level - parent_level;
const hashes = "#".repeat(level_diff);
const key = parent_key + hashes + title;
heading_lines[key] = [line_number, null];
sub_block_counts[key] = 0;
heading_stack.push({ level, title, key });
continue;
}
const list_match = line.match(/^(\s*)([-*]|\d+\.) (.+)$/);
if (list_match && !in_code_block) {
const indentation = list_match[1].length;
if (indentation === 0) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
if (current_content_block && current_content_block.key !== root_heading_key) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = line_number - 1;
}
current_content_block = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key && !heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
let key;
if (line_keys) {
const words = get_longest_words_in_order3(list_match[3], 10);
key = `${parent_key}#${words}`;
} else {
key = `${parent_key}#{${n}}`;
}
heading_lines[key] = [line_number, null];
current_list_item = { key, start_line: line_number };
continue;
}
if (current_list_item) {
continue;
}
}
if (trimmed_line === "") {
continue;
}
if (!current_content_block) {
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = line_number - 1;
}
current_list_item = null;
}
let parent_key = heading_stack.length > 0 ? heading_stack[heading_stack.length - 1].key : root_heading_key;
if (parent_key === root_heading_key) {
if (!heading_lines[root_heading_key]) {
heading_lines[root_heading_key] = [line_number, null];
}
if (heading_lines[root_heading_key][1] === null || heading_lines[root_heading_key][1] < line_number) {
heading_lines[root_heading_key][1] = null;
}
current_content_block = { key: root_heading_key, start_line: line_number };
} else {
if (sub_block_counts[parent_key] === void 0) {
sub_block_counts[parent_key] = 0;
}
sub_block_counts[parent_key] += 1;
const n = sub_block_counts[parent_key];
const key = `${parent_key}#{${n}}`;
heading_lines[key] = [line_number, null];
current_content_block = { key, start_line: line_number };
}
}
}
const total_lines = lines.length;
while (heading_stack.length > 0) {
const finished_heading = heading_stack.pop();
if (heading_lines[finished_heading.key][1] === null) {
heading_lines[finished_heading.key][1] = total_lines + start_index - 1;
}
}
if (current_list_item) {
if (heading_lines[current_list_item.key][1] === null) {
heading_lines[current_list_item.key][1] = total_lines + start_index - 1;
}
current_list_item = null;
}
if (current_content_block) {
if (heading_lines[current_content_block.key][1] === null) {
heading_lines[current_content_block.key][1] = total_lines + start_index - 1;
}
current_content_block = null;
}
if (heading_lines[root_heading_key] && heading_lines[root_heading_key][1] === null) {
heading_lines[root_heading_key][1] = total_lines + start_index - 1;
}
for (const key in heading_lines) {
result[key] = heading_lines[key];
}
return result;
}
function get_longest_words_in_order3(line, n = 3) {
const words = line.split(/\s+/).sort((a, b) => b.length - a.length).slice(0, n);
return words.sort((a, b) => line.indexOf(a) - line.indexOf(b)).join(" ");
}

var glob_to_regex_pattern2 = (pattern, extended_glob) => {
let in_class = false;
let in_brace = 0;
let result = "";
for (let i = 0; i < pattern.length; i++) {
const char = pattern[i];
switch (char) {
case "\\":
result += "\\" + (i + 1 < pattern.length ? pattern[++i] : "\\");
break;
case "/":
result += "\\/";
break;
case "[":
if (!in_class) {
in_class = true;
if (pattern[i + 1] === "!") {
result += "[^";
i++;
} else {
result += "[";
}
} else {
result += "\\[";
}
break;
case "]":
if (in_class) {
in_class = false;
result += "]";
} else {
result += "\\]";
}
break;
case "{":
if (!in_class) {
in_brace++;
result += "(";
} else {
result += "{";
}
break;
case "}":
if (!in_class && in_brace > 0) {
in_brace--;
result += ")";
} else {
result += "}";
}
break;
case ",":
if (!in_class && in_brace > 0) {
result += "|";
} else {
result += ",";
}
break;
case "*":
if (!in_class) {
if (pattern[i + 1] === "*") {
result += ".*";
i++;
} else {
result += "[^/]*";
}
} else {
result += "\\*";
}
break;
case "?":
result += in_class ? "\\?" : "[^/]";
break;
case ".":
case "(":
case ")":
case "+":
case "|":
case "^":
case "$":
result += "\\" + char;
break;
default:
result += char;
}
}
if (extended_glob) {
result = result.replace(/\\\+\\\((.*?)\\\)/g, "($1)+").replace(/\\\@\\\((.*?)\\\)/g, "($1)").replace(/\\\!\\\((.*?)\\\)/g, "(?!$1).*").replace(/\\\?\\\((.*?)\\\)/g, "($1)?").replace(/\\\*\\\((.*?)\\\)/g, "($1)*");
}
return result;
};
var adjust_for_windows_paths2 = (pattern, windows_paths) => windows_paths ? pattern.replace(/\\\//g, "[\\\\/]") : pattern;
var create_regex2 = (pattern, { case_sensitive, extended_glob, windows_paths }) => {
const regex_pattern = glob_to_regex_pattern2(pattern, extended_glob);
const adjusted_pattern = adjust_for_windows_paths2(regex_pattern, windows_paths);
const flags = case_sensitive ? "" : "i";
return new RegExp(`^${adjusted_pattern}$`, flags);
};
function glob_to_regex2(pattern, options = {}) {
const default_options = { case_sensitive: true, extended_glob: false, windows_paths: false };
const merged_options = { ...default_options, ...options };
if (pattern === "") {
return /^$/;
}
if (pattern === "*" && !merged_options.windows_paths) {
return /^[^/]+$/;
}
if (pattern === "**" && !merged_options.windows_paths) {
return /^.+$/;
}
return create_regex2(pattern, merged_options);
}
function match_glob(pattern, str, options = {}) {
const regex = glob_to_regex2(pattern, options);
return regex.test(str);
}

function strip_excluded_headings(content, excluded_list) {
const blocks_map = parse_markdown_blocks3(content, { start_index: 0 });
if (!Object.keys(blocks_map).length)
return [content, []];
const exclusions = [];
let lines = content.split("\n");
for (const [block_key, line_range] of Object.entries(blocks_map)) {
const splitted = block_key.split("#").filter(Boolean);
if (!splitted.length)
continue;
const last_heading = splitted[splitted.length - 1].trim();
for (const pattern of excluded_list) {
if (match_glob(pattern, last_heading, { case_sensitive: false })) {
for (let i = line_range[0]; i <= line_range[1]; i++) {
lines[i] = null;
}
exclusions.push(pattern);
break;
}
}
}
lines = lines.filter(Boolean);
const new_content = lines.join("\n");
const removed_char_count = content.length - new_content.length;
return [new_content, exclusions, removed_char_count];
}

function get_markdown_links3(content) {
const markdown_link_pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
const wikilink_pattern = /\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]/g;
const result = [];
const extract_links_from_pattern = (pattern, type) => {
let match;
while ((match = pattern.exec(content)) !== null) {
const title = type === "markdown" ? match[1] : match[2] || match[1];
const target = type === "markdown" ? match[2] : match[1];
const line = content.substring(0, match.index).split("\n").length;
result.push({ title, target, line });
}
};
extract_links_from_pattern(markdown_link_pattern, "markdown");
extract_links_from_pattern(wikilink_pattern, "wikilink");
result.sort((a, b) => a.line - b.line || a.target.localeCompare(b.target));
return result;
}

async function get_snapshot(context_item, opts) {
const snapshot = {
items: {},
truncated_items: [],
skipped_items: [],
missing_items: [],
images: [],
char_count: opts.items ? Object.values(opts.items).reduce((acc, i) => acc + i.char_count, 0) : 0
};
const keys_at_depth = {};
keys_at_depth[0] = Object.keys(context_item.data.context_items);
const max_depth = opts.link_depth ?? 0;
for (let depth = 0; depth <= max_depth; depth++) {
const curr_depth = await process_depth(snapshot, keys_at_depth[depth], context_item, opts);
snapshot.items[depth] = curr_depth;
if (depth !== max_depth) {
keys_at_depth[depth + 1] = Object.keys(Object.values(curr_depth).reduce((acc, i) => {
if (opts.inlinks) {
i.ref.inlinks.forEach((inlink) => {
if (!is_already_in_snapshot(inlink.path, snapshot)) {
acc[inlink] = true;
}
});
}
i.ref.outlinks.forEach((outlink) => {
if (!is_already_in_snapshot(outlink.path, snapshot)) {
acc[outlink] = true;
}
});
return acc;
}, {}));
}
}
if (opts.items) {
snapshot.items[0] = {
...snapshot.items[0],
...opts.items
};
}
return snapshot;
}
async function process_depth(snapshot, curr_depth_keys, context_item, opts) {
const source_items = (curr_depth_keys ?? []).map((key) => context_item.get_ref(key)).filter(Boolean);
const non_source_keys = curr_depth_keys.filter((key) => !context_item.get_ref(key));
for (const key of non_source_keys) {
const smart_fs = context_item.env.smart_sources.fs;
const files = await smart_fs.adapter.list_files_recursive(key);
if (!files.length) {
snapshot.missing_items.push(key);
continue;
}
for (const file of files) {
if (is_already_in_snapshot(file.path, snapshot)) {
continue;
}
const item = context_item.get_ref(file.path);
if (item) {
source_items.push(item);
} else {
const image_exts = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"];
if (image_exts.some((ext) => file.path.endsWith(`.${ext}`))) {
snapshot.images.push(file.path);
} else {
snapshot.missing_items.push(file.path);
}
}
}
}
const curr_depth = {};
for (const item of source_items) {
if (is_already_in_snapshot(item.key, snapshot)) {
continue;
}
let content = await item.read();
console.log("read context");
if (!opts.calculating && content.includes("dataview")) {
content = await item.read({ render_output: true });
item.data.outlinks = get_markdown_links3(content);
}
const excluded_headings = opts.excluded_headings || [];
const [new_content, exclusions, removed_char_count] = strip_excluded_headings(content, excluded_headings);
curr_depth[item.path] = {
ref: item,
path: item.path,
content: new_content,
mtime: item.mtime,
char_count: new_content.length,
exclusions,
excluded_char_count: removed_char_count
};
}
return curr_depth;
}
function is_already_in_snapshot(item_path, snapshot) {
return Object.values(snapshot.items).some((depth) => depth[item_path]);
}

function merge_context_opts(context_item, input_opts = {}) {
const cset = context_item.collection.settings || {};
const local_opts = context_item.data.context_opts || {};
const merged_templates = {
...cset.templates ? JSON.parse(JSON.stringify(cset.templates)) : {},
...local_opts.templates && typeof local_opts.templates === "object" ? local_opts.templates : {},
...input_opts.templates && typeof input_opts.templates === "object" ? input_opts.templates : {}
};
return {
...input_opts,
link_depth: input_opts.link_depth ?? local_opts.link_depth ?? cset.link_depth ?? 0,
inlinks: input_opts.inlinks ?? local_opts.inlinks ?? Boolean(cset.inlinks),
excluded_headings: input_opts.excluded_headings ?? local_opts.excluded_headings ?? (Array.isArray(cset.excluded_headings) ? [...cset.excluded_headings] : []),
max_len: input_opts.max_len ?? local_opts.max_len ?? cset.max_len ?? 0,
templates: merged_templates
};
}

function murmur_hash_323(input_string, seed = 0) {
let remainder = input_string.length & 3;
let bytes = input_string.length - remainder;
let h1 = seed;
let c1 = 3432918353;
let c2 = 461845907;
let i = 0;
let k1 = 0;
let chunk = 0;
while (i < bytes) {
chunk = input_string.charCodeAt(i) & 255 | (input_string.charCodeAt(i + 1) & 255) << 8 | (input_string.charCodeAt(i + 2) & 255) << 16 | (input_string.charCodeAt(i + 3) & 255) << 24;
i += 4;
k1 = chunk;
k1 = multiply_323(k1, c1);
k1 = rotate_left_323(k1, 15);
k1 = multiply_323(k1, c2);
h1 ^= k1;
h1 = rotate_left_323(h1, 13);
h1 = h1 * 5 + 3864292196 | 0;
}
k1 = 0;
switch (remainder) {
case 3:
k1 ^= (input_string.charCodeAt(i + 2) & 255) << 16;
case 2:
k1 ^= (input_string.charCodeAt(i + 1) & 255) << 8;
case 1:
k1 ^= input_string.charCodeAt(i) & 255;
k1 = multiply_323(k1, c1);
k1 = rotate_left_323(k1, 15);
k1 = multiply_323(k1, c2);
h1 ^= k1;
break;
}
h1 ^= input_string.length;
h1 = fmix_323(h1);
return h1 | 0;
}
function murmur_hash_32_alphanumeric3(input_string, seed = 0) {
const signed_hash = murmur_hash_323(input_string, seed);
const unsigned_hash = signed_hash >>> 0;
return unsigned_hash.toString(36);
}
function multiply_323(a, b) {
return (a & 65535) * b + ((a >>> 16) * b << 16) | 0;
}
function rotate_left_323(value, shift) {
return value << shift | value >>> 32 - shift;
}
function fmix_323(h) {
h ^= h >>> 16;
h = multiply_323(h, 2246822507);
h ^= h >>> 13;
h = multiply_323(h, 3266489909);
h ^= h >>> 16;
return h | 0;
}

var SmartContext = class extends CollectionItem5 {
static get defaults() {
return {
data: {
key: "",
context_items: {},
context_opts: {}
}
};
}
/**
* get_snapshot
* Gathers items at depth=0..link_depth, respects exclusions, and tracks truncated/skipped items.
* @async
* @param {object} opts
* @returns {Promise<object>} context_snapshot - an object with .items[0], .items[1], etc.
*/
async get_snapshot(opts = {}) {
const merged_opts = merge_context_opts(this, opts);
return await get_snapshot(this, merged_opts);
}
/**
* compile
* Delegates to a compile adapter from this.collection.compile_adapters.
* By default uses the 'default' adapter unless opts.adapter_key is given.
* @async
* @param {object} [opts={}]
* @returns {Promise<object|string>} Typically {context, stats} from the template adapter
*/
async compile(opts = {}) {
const adapter_key = opts.adapter_key || "default";
const adapter_class = this.collection.compile_adapters[adapter_key];
if (!adapter_class) {
throw new Error(`SmartContext: Compile adapter not found: ${adapter_key}`);
}
const adapter = new adapter_class(this);
return adapter.compile(opts);
}
/**
* @method get_ref
* Looks up a reference in the environment. Distinguishes block vs source by '#' presence.
*/
get_ref(key) {
const collection = key.includes("#") ? this.env.smart_blocks : this.env.smart_sources;
return collection.get(key);
}
/**
* If no user-provided key, fallback to a stable hash of the context_items.
*/
get key() {
if (this.data.key)
return this.data.key;
const str = JSON.stringify(this.data.context_items || {});
return murmur_hash_32_alphanumeric3(str);
}
};

var CollectionDataAdapter4 = class {
/**
* @constructor
* @param {Object} collection - The collection instance that this adapter manages.
*/
constructor(collection) {
this.collection = collection;
this.env = collection.env;
}
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = ItemDataAdapter4;
/**
* Optional factory method to create item adapters.
* If `this.item_adapter_class` is not null, it uses that; otherwise can be overridden by subclasses.
* @param {Object} item - The item to create an adapter for.
* @returns {ItemDataAdapter}
*/
create_item_adapter(item) {
if (!this.ItemDataAdapter) {
throw new Error("No item_adapter_class specified and create_item_adapter not overridden.");
}
return new this.ItemDataAdapter(item);
}
/**
* Load a single item by its key using an `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item(key) {
throw new Error("Not implemented");
}
/**
* Save a single item by its key using its associated `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to save.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save_item(key) {
throw new Error("Not implemented");
}
/**
* Delete a single item by its key. This may involve updating or removing its file,
* as handled by the `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to delete.
* @returns {Promise<void>} Resolves when the item is deleted.
*/
async delete_item(key) {
throw new Error("Not implemented");
}
/**
* Process any queued load operations. Typically orchestrates calling `load_item()`
* on items that have been flagged for loading.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
throw new Error("Not implemented");
}
/**
* Process any queued save operations. Typically orchestrates calling `save_item()`
* on items that have been flagged for saving.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
throw new Error("Not implemented");
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item_if_updated(item) {
const adapter = this.create_item_adapter(item);
await adapter.load_if_updated();
}
};
var ItemDataAdapter4 = class {
/**
* @constructor
* @param {Object} item - The collection item instance that this adapter manages.
*/
constructor(item) {
this.item = item;
}
/**
* Load the item's data from storage. May involve reading a file and parsing
* its contents, then updating `item.data`.
* @async
* @returns {Promise<void>} Resolves when the item is fully loaded.
*/
async load() {
throw new Error("Not implemented");
}
/**
* Save the item's data to storage. May involve writing to a file or appending
* lines in an append-only format.
* @async
* @param {string|null} [ajson=null] - An optional serialized representation of the item’s data.
*                                     If not provided, the adapter should derive it from the item.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save(ajson = null) {
throw new Error("Not implemented");
}
/**
* Delete the item's data from storage. May involve removing a file or writing
* a `null` entry in an append-only file to signify deletion.
* @async
* @returns {Promise<void>} Resolves when the item’s data is deleted.
*/
async delete() {
throw new Error("Not implemented");
}
/**
* Returns the file path or unique identifier used by this adapter to locate and store
* the item's data. This may be a file name derived from the item's key.
* @returns {string} The path or identifier for the item's data.
*/
get data_path() {
throw new Error("Not implemented");
}
/**
* @returns {CollectionDataAdapter} The collection data adapter that this item data adapter belongs to.
*/
get collection_adapter() {
return this.item.collection.data_adapter;
}
get env() {
return this.item.env;
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_if_updated() {
throw new Error("Not implemented");
}
};

var FileCollectionDataAdapter4 = class extends CollectionDataAdapter4 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = FileItemDataAdapter4;
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.collection.data_fs || this.collection.env.data_fs;
}
};
var FileItemDataAdapter4 = class extends ItemDataAdapter4 {
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.item.collection.data_fs || this.item.collection.env.data_fs;
}
get data_path() {
throw new Error("Not implemented");
}
async load_if_updated() {
const data_path = this.data_path;
if (await this.fs.exists(data_path)) {
const loaded_at = this.item.loaded_at || 0;
const data_file_stat = await this.fs.stat(data_path);
if (data_file_stat.mtime > loaded_at + 1 * 60 * 1e3) {
console.log(`Smart Collections: Re-loading item ${this.item.key} because it has been updated on disk`);
await this.load();
}
}
}
};

var class_to_collection_key5 = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
var AjsonMultiFileCollectionDataAdapter4 = class extends FileCollectionDataAdapter4 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = AjsonMultiFileItemDataAdapter4;
/**
* Load a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async load_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.load();
}
/**
* Save a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async save_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.save();
}
/**
* Process any queued load operations.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const load_queue = Object.values(this.collection.items).filter((item) => item._queue_load);
if (!load_queue.length) {
this.collection.clear_process_notice("loading_collection");
return;
}
console.log(`Loading ${this.collection.collection_key}: ${load_queue.length} items`);
const batch_size = 100;
for (let i = 0; i < load_queue.length; i += batch_size) {
const batch = load_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.load().catch((err) => {
console.warn(`Error loading item ${item.key}`, err);
item.queue_load();
});
}));
}
console.log(`Loaded ${this.collection.collection_key} in ${this.collection.load_time_ms}ms`);
this.collection.loaded = load_queue.length;
this.collection.clear_process_notice("loading_collection");
}
/**
* Process any queued save operations.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
console.log(`Saving ${this.collection.collection_key}: ${save_queue.length} items`);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
get_item_data_path(key) {
return [
this.collection.data_dir || "multi",
this.fs?.sep || "/",
this.get_data_file_name(key) + ".ajson"
].join("");
}
/**
* Transforms the item key into a safe filename.
* Replaces spaces, slashes, and dots with underscores.
* @returns {string} safe file name
*/
get_data_file_name(key) {
return key.split("#")[0].replace(/[\s\/\.]/g, "_").replace(".md", "");
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson(item) {
const collection_key = item.collection_key;
const key = item.key;
const data_value = item.deleted ? "null" : JSON.stringify(item.data);
return `${JSON.stringify(`${collection_key}:${key}`)}: ${data_value},`;
}
};
var AjsonMultiFileItemDataAdapter4 = class extends FileItemDataAdapter4 {
/**
* Derives the `.ajson` file path from the collection's data_dir and item key.
* @returns {string}
*/
get data_path() {
return this.collection_adapter.get_item_data_path(this.item.key);
}
/**
* Load the item from its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async load() {
try {
const raw_data = await this.fs.adapter.read(this.data_path, "utf-8", { no_cache: true });
if (!raw_data) {
this.item.queue_import();
return;
}
const { rewrite, file_data } = this._parse(raw_data);
if (rewrite) {
if (file_data.length)
await this.fs.write(this.data_path, file_data);
else
await this.fs.remove(this.data_path);
}
const last_import_mtime = this.item.data.last_import?.at || 0;
if (last_import_mtime && this.item.init_file_mtime > last_import_mtime) {
this.item.queue_import();
}
} catch (e) {
this.item.queue_import();
}
}
/**
* Parse the entire AJSON content as a JSON object, handle legacy keys, and extract final state.
* @private
* @param {string} ajson
* @returns {boolean}
*/
_parse(ajson) {
try {
let rewrite = false;
if (!ajson.length)
return false;
ajson = ajson.trim();
const original_line_count = ajson.split("\n").length;
const json_str = "{" + ajson.slice(0, -1) + "}";
const data = JSON.parse(json_str);
const entries = Object.entries(data);
for (let i = 0; i < entries.length; i++) {
const [ajson_key, value] = entries[i];
if (!value) {
delete data[ajson_key];
rewrite = true;
continue;
}
const { collection_key, item_key, changed } = this._parse_ajson_key(ajson_key);
if (changed) {
rewrite = true;
data[collection_key + ":" + item_key] = value;
delete data[ajson_key];
}
const collection = this.env[collection_key];
if (!collection)
continue;
const existing_item = collection.get(item_key);
if (!value.key)
value.key = item_key;
if (existing_item) {
existing_item.data = value;
existing_item._queue_load = false;
existing_item.loaded_at = Date.now();
} else {
const ItemClass = collection.item_type;
const new_item = new ItemClass(this.env, value);
new_item._queue_load = false;
new_item.loaded_at = Date.now();
collection.set(new_item);
}
}
if (rewrite || original_line_count > entries.length) {
rewrite = true;
}
return {
rewrite,
file_data: rewrite ? Object.entries(data).map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)},`).join("\n") : null
};
} catch (e) {
if (ajson.split("\n").some((line) => !line.endsWith(","))) {
console.warn("fixing trailing comma error");
ajson = ajson.split("\n").map((line) => line.endsWith(",") ? line : line + ",").join("\n");
return this._parse(ajson);
}
console.warn("Error parsing JSON:", e);
return { rewrite: true, file_data: null };
}
}
_parse_ajson_key(ajson_key) {
let changed;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key5[collection_key]) {
collection_key = class_to_collection_key5[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
/**
* Save the current state of the item by appending a new line to its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async save(retries = 0) {
try {
const ajson_line = this.get_item_ajson();
await this.fs.append(this.data_path, "\n" + ajson_line);
this.item._queue_save = false;
} catch (e) {
if (e.code === "ENOENT" && retries < 1) {
console.warn("ENOENT, creating directory", this.data_path);
const dir = this.collection_adapter.collection.data_dir;
if (!await this.fs.exists(dir)) {
await this.fs.mkdir(dir);
}
return await this.save(retries + 1);
}
console.warn("Error saving item", this.data_path, e);
}
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson() {
return this.collection_adapter.get_item_ajson(this.item);
}
};

function ajson_merge2(existing, new_obj) {
if (new_obj === null)
return null;
if (new_obj === void 0)
return existing;
if (typeof new_obj !== "object")
return new_obj;
if (typeof existing !== "object" || existing === null)
existing = {};
const keys = Object.keys(new_obj);
const length = keys.length;
for (let i = 0; i < length; i++) {
const key = keys[i];
const new_val = new_obj[key];
const existing_val = existing[key];
if (Array.isArray(new_val)) {
existing[key] = new_val.slice();
} else if (is_object2(new_val)) {
existing[key] = ajson_merge2(is_object2(existing_val) ? existing_val : {}, new_val);
} else if (new_val !== void 0) {
existing[key] = new_val;
}
}
return existing;
}
function is_object2(obj) {
return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

var class_to_collection_key6 = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
function _parse_ajson_key2(ajson_key) {
let changed = false;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key6[collection_key]) {
collection_key = class_to_collection_key6[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
var AjsonSingleFileCollectionDataAdapter2 = class extends AjsonMultiFileCollectionDataAdapter4 {
/**
* Returns the single shared `.ajson` file path for this collection.
* @param {string} [key] - (unused) Item key, ignored in single-file mode.
* @returns {string} The single .ajson file path for the entire collection.
*/
get_item_data_path(key) {
const file_name = (this.collection?.collection_key || "collection") + ".ajson";
const sep = this.fs?.sep || "/";
const dir = this.collection.data_dir || "data";
return [dir, file_name].join(sep);
}
/**
* Override process_load_queue to parse the entire single-file .ajson once,
* distributing final states to items.
*
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const path = this.get_item_data_path();
if (!await this.fs.exists(path)) {
for (const item of Object.values(this.collection.items)) {
if (item._queue_load) {
item.queue_import?.();
}
}
this.collection.clear_process_notice("loading_collection");
return;
}
const raw_data = await this.fs.read(path, "utf-8", { no_cache: true });
if (!raw_data) {
for (const item of Object.values(this.collection.items)) {
if (item._queue_load) {
item.queue_import?.();
}
}
this.collection.clear_process_notice("loading_collection");
return;
}
const { rewrite, file_data } = this.parse_single_file_ajson(raw_data);
if (rewrite) {
if (file_data.length) {
await this.fs.write(path, file_data);
} else {
await this.fs.remove(path);
}
}
for (const item of Object.values(this.collection.items)) {
item._queue_load = false;
item.loaded_at = Date.now();
}
this.collection.clear_process_notice("loading_collection");
}
/**
* Helper to parse single-file .ajson content, distributing states to items.
*
* @param {string} raw
* @returns {{ rewrite: boolean, file_data: string }}
*/
parse_single_file_ajson(raw) {
let rewrite = false;
const lines = raw.trim().split("\n").filter(Boolean);
let data_map = {};
let line_count = 0;
for (let i = 0; i < lines.length; i++) {
const line = lines[i].trim();
if (!line.endsWith(",")) {
rewrite = true;
}
const trimmed = line.replace(/,$/, "");
const combined = "{" + trimmed + "}";
try {
const obj = JSON.parse(combined);
const [fullKey, value] = Object.entries(obj)[0];
let { collection_key, item_key, changed } = _parse_ajson_key2(fullKey);
const newKey = `${collection_key}:${item_key}`;
if (!value) {
delete data_map[newKey];
if (changed || newKey !== fullKey) {
delete data_map[fullKey];
}
rewrite = true;
} else {
data_map[newKey] = value;
if (changed || newKey !== fullKey) {
delete data_map[fullKey];
rewrite = true;
}
}
} catch (err) {
console.warn("parse error for line: ", line, err);
rewrite = true;
}
line_count++;
}
for (const [ajson_key, val] of Object.entries(data_map)) {
const [collection_key, ...rest] = ajson_key.split(":");
const item_key = rest.join(":");
const collection = this.collection.env[collection_key];
if (!collection)
continue;
let item = collection.get(item_key);
if (!item) {
const ItemClass = collection.item_type;
item = new ItemClass(this.env, val);
collection.set(item);
} else {
item.data = ajson_merge2(item.data, val);
}
item.loaded_at = Date.now();
item._queue_load = false;
if (!val.key)
val.key = item_key;
}
if (line_count > Object.keys(data_map).length) {
rewrite = true;
}
let minimal_lines = [];
for (const [ajson_key, val] of Object.entries(data_map)) {
minimal_lines.push(`${JSON.stringify(ajson_key)}: ${JSON.stringify(val)},`);
}
return {
rewrite,
file_data: minimal_lines.join("\n")
};
}
/**
* Override process_save_queue for single-file approach.
* We'll simply call save_item for each queued item, which appends a line to the same `.ajson`.
*
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved (single-file) ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
};

var ContextCompileAdapter = class {
/**
* @static
* @type {string}
* Identifies this adapter by a short, unique key. The collection
* will store it in a map at `collection.compile_adapters[adapter_key]`.
*/
static adapter_key = "raw";
/**
* @constructor
* @param {SmartContext} context_item
*/
constructor(context_item) {
this.context_item = context_item;
}
/**
* @method compile
* Returns the snapshot as-is (no further transformations).
* @param {object} [opts={}]
* @returns {Promise<object>} The snapshot from get_snapshot().
*/
async compile(opts = {}) {
const snapshot = await this.context_item.get_snapshot(opts);
return snapshot;
}
};

async function compile_snapshot(context_snapshot, merged_opts) {
const depths = Object.keys(context_snapshot.items).map((d) => parseInt(d, 10)).sort((a, b) => a - b);
const chunks = [];
for (const depth of depths) {
const items = context_snapshot.items[depth] || {};
const { before_raw, after_raw } = get_templates_for_depth(depth, merged_opts);
for (const [path, item] of Object.entries(items)) {
const placeholders = build_item_placeholders(path, depth);
chunks.push({
path,
mtime: item.mtime,
before_tpl: replace_vars(before_raw, placeholders),
item_text: item.content,
after_tpl: replace_vars(after_raw, placeholders)
});
}
}
const skipped_items = new Set(context_snapshot.skipped_items || []);
const truncated_items = new Set(context_snapshot.truncated_items || []);
const max_len = merged_opts.max_len || 0;
const result_pieces = [];
for (const chunk of chunks) {
if (!max_len) {
const joined = [chunk.before_tpl, chunk.item_text, chunk.after_tpl].join("\n");
result_pieces.push(joined);
continue;
}
const template_len = chunk.before_tpl.length + chunk.after_tpl.length;
const leftover_for_text = max_len - template_len;
const text_len = chunk.item_text.length;
if (text_len <= leftover_for_text) {
const joined = [chunk.before_tpl, chunk.item_text, chunk.after_tpl].join("\n");
result_pieces.push(joined);
} else {
truncated_items.add(chunk.path);
const partial = chunk.item_text.slice(0, leftover_for_text);
const joined = [chunk.before_tpl, partial, chunk.after_tpl].join("\n");
result_pieces.push(joined);
}
}
let raw_output = result_pieces.join("\n");
const top_before_raw = merged_opts.templates?.["-1"]?.before || "";
const top_after_raw = merged_opts.templates?.["-1"]?.after || "";
const want_tree = top_before_raw.includes("{{FILE_TREE}}") || top_after_raw.includes("{{FILE_TREE}}");
let file_tree_str = "";
if (want_tree) {
const all_paths = chunks.map((c) => c.path);
file_tree_str = create_file_tree_string(all_paths);
}
const wrap_before = replace_vars(top_before_raw, { FILE_TREE: file_tree_str });
const wrap_after = replace_vars(top_after_raw, { FILE_TREE: file_tree_str });
let final_context = "";
const wrap_has_content = wrap_before.length > 0 || wrap_after.length > 0;
if (!wrap_has_content) {
final_context = raw_output + "\n";
} else {
final_context = wrap_before + "\n" + raw_output + "\n" + wrap_after + "\n";
}
const final_len = final_context.length;
const stats = {
char_count: final_len,
depth_count: depths.length,
truncated_items: Array.from(truncated_items),
skipped_items: Array.from(skipped_items)
};
return {
context: final_context.trim(),
stats,
images: context_snapshot.images
};
}
function get_templates_for_depth(depth, merged_opts) {
let before_template_depth = depth;
let before_raw = merged_opts.templates?.[before_template_depth]?.before;
while (typeof before_raw !== "string" && before_template_depth > -1) {
before_template_depth--;
before_raw = merged_opts.templates?.[before_template_depth]?.before;
}
let after_template_depth = depth;
let after_raw = merged_opts.templates?.[after_template_depth]?.after;
while (typeof after_raw !== "string" && after_template_depth > -1) {
after_template_depth--;
after_raw = merged_opts.templates?.[after_template_depth]?.after;
}
return { before_raw, after_raw };
}
function build_item_placeholders(path, depth, mtime) {
const name = path.substring(path.lastIndexOf("/") + 1);
const dot_pos = name.lastIndexOf(".");
const ext = dot_pos > 0 ? name.slice(dot_pos + 1) : "";
return {
ITEM_PATH: path,
ITEM_NAME: name,
ITEM_EXT: ext,
ITEM_DEPTH: depth,
ITEM_TIME_AGO: convert_to_time_ago(mtime)
};
}
function convert_to_time_ago(timestamp) {
const seconds = Math.floor(Date.now() - timestamp);
const intervals = [
{ label: "year", seconds: 31536e3 },
{ label: "month", seconds: 2592e3 },
{ label: "day", seconds: 86400 },
{ label: "hour", seconds: 3600 },
{ label: "minute", seconds: 60 },
{ label: "second", seconds: 1 }
];
for (const interval of intervals) {
const count = Math.floor(seconds / interval.seconds);
if (count >= 1) {
return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
}
}
return "just now";
}
function replace_vars(template, replacements) {
if (!template)
return "";
let out = template;
for (const [k, v] of Object.entries(replacements)) {
const safe_v = v !== void 0 && v !== null ? String(v) : "";
out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), safe_v);
}
return out;
}
function create_file_tree_string(all_paths) {
const root = {};
for (const p of all_paths) {
let cursor = root;
const parts = p.split("/");
for (let i = 0; i < parts.length; i++) {
const part = parts[i];
if (i === parts.length - 1) {
cursor[part] = null;
} else {
if (!cursor[part])
cursor[part] = {};
cursor = cursor[part];
}
}
}
compress_single_child_dirs(root);
return build_tree_string(root);
}
function compress_single_child_dirs(node) {
if (!node || typeof node !== "object")
return;
const keys = Object.keys(node);
for (const k of keys) {
const child = node[k];
if (child && typeof child === "object") {
const childKeys = Object.keys(child);
if (childKeys.length === 1) {
const subKey = childKeys[0];
const subChild = child[subKey];
if (subChild !== null) {
const combined = k + "/" + subKey;
node[combined] = subChild;
delete node[k];
compress_single_child_dirs(node[combined]);
} else {
}
} else {
compress_single_child_dirs(child);
}
}
}
}
function build_tree_string(node, prefix = "") {
let res = "";
const entries = Object.entries(node).sort((a, b) => {
const a_is_dir = a[1] !== null;
const b_is_dir = b[1] !== null;
if (a_is_dir && !b_is_dir)
return -1;
if (!a_is_dir && b_is_dir)
return 1;
return a[0].localeCompare(b[0]);
});
entries.forEach(([name, subnode], idx) => {
const is_last = idx === entries.length - 1;
const connector = is_last ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ";
if (subnode === null) {
res += prefix + connector + name + "\n";
} else {
res += prefix + connector + name + "/\n";
const next_prefix = prefix + (is_last ? "    " : "\u2502   ");
res += build_tree_string(subnode, next_prefix);
}
});
return res;
}

var DefaultContextCompileAdapter = class extends ContextCompileAdapter {
static adapter_key = "default";
/**
* @method compile
* Builds a snapshot via get_snapshot, then calls compile_snapshot.
* @param {object} [opts={}]
* @returns {Promise<{context: string, stats: object}>}
*/
async compile(opts = {}) {
const snapshot = await this.context_item.get_snapshot(opts);
const merged_opts = merge_context_opts(this.context_item, opts);
return compile_snapshot(snapshot, merged_opts);
}
};

var smart_contexts_default_config = {
class: SmartContexts,
data_adapter: AjsonSingleFileCollectionDataAdapter2,
compile_adapters: {
DefaultContextCompileAdapter
},
item_type: SmartContext
};

var CollectionDataAdapter5 = class {
/**
* @constructor
* @param {Object} collection - The collection instance that this adapter manages.
*/
constructor(collection) {
this.collection = collection;
this.env = collection.env;
}
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = ItemDataAdapter5;
/**
* Optional factory method to create item adapters.
* If `this.item_adapter_class` is not null, it uses that; otherwise can be overridden by subclasses.
* @param {Object} item - The item to create an adapter for.
* @returns {ItemDataAdapter}
*/
create_item_adapter(item) {
if (!this.ItemDataAdapter) {
throw new Error("No item_adapter_class specified and create_item_adapter not overridden.");
}
return new this.ItemDataAdapter(item);
}
/**
* Load a single item by its key using an `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item(key) {
throw new Error("Not implemented");
}
/**
* Save a single item by its key using its associated `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to save.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save_item(key) {
throw new Error("Not implemented");
}
/**
* Delete a single item by its key. This may involve updating or removing its file,
* as handled by the `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to delete.
* @returns {Promise<void>} Resolves when the item is deleted.
*/
async delete_item(key) {
throw new Error("Not implemented");
}
/**
* Process any queued load operations. Typically orchestrates calling `load_item()`
* on items that have been flagged for loading.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
throw new Error("Not implemented");
}
/**
* Process any queued save operations. Typically orchestrates calling `save_item()`
* on items that have been flagged for saving.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
throw new Error("Not implemented");
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item_if_updated(item) {
const adapter = this.create_item_adapter(item);
await adapter.load_if_updated();
}
};
var ItemDataAdapter5 = class {
/**
* @constructor
* @param {Object} item - The collection item instance that this adapter manages.
*/
constructor(item) {
this.item = item;
}
/**
* Load the item's data from storage. May involve reading a file and parsing
* its contents, then updating `item.data`.
* @async
* @returns {Promise<void>} Resolves when the item is fully loaded.
*/
async load() {
throw new Error("Not implemented");
}
/**
* Save the item's data to storage. May involve writing to a file or appending
* lines in an append-only format.
* @async
* @param {string|null} [ajson=null] - An optional serialized representation of the item’s data.
*                                     If not provided, the adapter should derive it from the item.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save(ajson = null) {
throw new Error("Not implemented");
}
/**
* Delete the item's data from storage. May involve removing a file or writing
* a `null` entry in an append-only file to signify deletion.
* @async
* @returns {Promise<void>} Resolves when the item’s data is deleted.
*/
async delete() {
throw new Error("Not implemented");
}
/**
* Returns the file path or unique identifier used by this adapter to locate and store
* the item's data. This may be a file name derived from the item's key.
* @returns {string} The path or identifier for the item's data.
*/
get data_path() {
throw new Error("Not implemented");
}
/**
* @returns {CollectionDataAdapter} The collection data adapter that this item data adapter belongs to.
*/
get collection_adapter() {
return this.item.collection.data_adapter;
}
get env() {
return this.item.env;
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_if_updated() {
throw new Error("Not implemented");
}
};

var FileCollectionDataAdapter5 = class extends CollectionDataAdapter5 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = FileItemDataAdapter5;
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.collection.data_fs || this.collection.env.data_fs;
}
};
var FileItemDataAdapter5 = class extends ItemDataAdapter5 {
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.item.collection.data_fs || this.item.collection.env.data_fs;
}
get data_path() {
throw new Error("Not implemented");
}
async load_if_updated() {
const data_path = this.data_path;
if (await this.fs.exists(data_path)) {
const loaded_at = this.item.loaded_at || 0;
const data_file_stat = await this.fs.stat(data_path);
if (data_file_stat.mtime > loaded_at + 1 * 60 * 1e3) {
console.log(`Smart Collections: Re-loading item ${this.item.key} because it has been updated on disk`);
await this.load();
}
}
}
};

var class_to_collection_key7 = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
var AjsonMultiFileCollectionDataAdapter5 = class extends FileCollectionDataAdapter5 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = AjsonMultiFileItemDataAdapter5;
/**
* Load a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async load_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.load();
}
/**
* Save a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async save_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.save();
}
/**
* Process any queued load operations.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const load_queue = Object.values(this.collection.items).filter((item) => item._queue_load);
if (!load_queue.length) {
this.collection.clear_process_notice("loading_collection");
return;
}
console.log(`Loading ${this.collection.collection_key}: ${load_queue.length} items`);
const batch_size = 100;
for (let i = 0; i < load_queue.length; i += batch_size) {
const batch = load_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.load().catch((err) => {
console.warn(`Error loading item ${item.key}`, err);
item.queue_load();
});
}));
}
console.log(`Loaded ${this.collection.collection_key} in ${this.collection.load_time_ms}ms`);
this.collection.loaded = load_queue.length;
this.collection.clear_process_notice("loading_collection");
}
/**
* Process any queued save operations.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
console.log(`Saving ${this.collection.collection_key}: ${save_queue.length} items`);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
get_item_data_path(key) {
return [
this.collection.data_dir || "multi",
this.fs?.sep || "/",
this.get_data_file_name(key) + ".ajson"
].join("");
}
/**
* Transforms the item key into a safe filename.
* Replaces spaces, slashes, and dots with underscores.
* @returns {string} safe file name
*/
get_data_file_name(key) {
return key.split("#")[0].replace(/[\s\/\.]/g, "_").replace(".md", "");
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson(item) {
const collection_key = item.collection_key;
const key = item.key;
const data_value = item.deleted ? "null" : JSON.stringify(item.data);
return `${JSON.stringify(`${collection_key}:${key}`)}: ${data_value},`;
}
};
var AjsonMultiFileItemDataAdapter5 = class extends FileItemDataAdapter5 {
/**
* Derives the `.ajson` file path from the collection's data_dir and item key.
* @returns {string}
*/
get data_path() {
return this.collection_adapter.get_item_data_path(this.item.key);
}
/**
* Load the item from its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async load() {
try {
const raw_data = await this.fs.adapter.read(this.data_path, "utf-8", { no_cache: true });
if (!raw_data) {
this.item.queue_import();
return;
}
const { rewrite, file_data } = this._parse(raw_data);
if (rewrite) {
if (file_data.length)
await this.fs.write(this.data_path, file_data);
else
await this.fs.remove(this.data_path);
}
const last_import_mtime = this.item.data.last_import?.at || 0;
if (last_import_mtime && this.item.init_file_mtime > last_import_mtime) {
this.item.queue_import();
}
} catch (e) {
this.item.queue_import();
}
}
/**
* Parse the entire AJSON content as a JSON object, handle legacy keys, and extract final state.
* @private
* @param {string} ajson
* @returns {boolean}
*/
_parse(ajson) {
try {
let rewrite = false;
if (!ajson.length)
return false;
ajson = ajson.trim();
const original_line_count = ajson.split("\n").length;
const json_str = "{" + ajson.slice(0, -1) + "}";
const data = JSON.parse(json_str);
const entries = Object.entries(data);
for (let i = 0; i < entries.length; i++) {
const [ajson_key, value] = entries[i];
if (!value) {
delete data[ajson_key];
rewrite = true;
continue;
}
const { collection_key, item_key, changed } = this._parse_ajson_key(ajson_key);
if (changed) {
rewrite = true;
data[collection_key + ":" + item_key] = value;
delete data[ajson_key];
}
const collection = this.env[collection_key];
if (!collection)
continue;
const existing_item = collection.get(item_key);
if (!value.key)
value.key = item_key;
if (existing_item) {
existing_item.data = value;
existing_item._queue_load = false;
existing_item.loaded_at = Date.now();
} else {
const ItemClass = collection.item_type;
const new_item = new ItemClass(this.env, value);
new_item._queue_load = false;
new_item.loaded_at = Date.now();
collection.set(new_item);
}
}
if (rewrite || original_line_count > entries.length) {
rewrite = true;
}
return {
rewrite,
file_data: rewrite ? Object.entries(data).map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)},`).join("\n") : null
};
} catch (e) {
if (ajson.split("\n").some((line) => !line.endsWith(","))) {
console.warn("fixing trailing comma error");
ajson = ajson.split("\n").map((line) => line.endsWith(",") ? line : line + ",").join("\n");
return this._parse(ajson);
}
console.warn("Error parsing JSON:", e);
return { rewrite: true, file_data: null };
}
}
_parse_ajson_key(ajson_key) {
let changed;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key7[collection_key]) {
collection_key = class_to_collection_key7[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
/**
* Save the current state of the item by appending a new line to its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async save(retries = 0) {
try {
const ajson_line = this.get_item_ajson();
await this.fs.append(this.data_path, "\n" + ajson_line);
this.item._queue_save = false;
} catch (e) {
if (e.code === "ENOENT" && retries < 1) {
console.warn("ENOENT, creating directory", this.data_path);
const dir = this.collection_adapter.collection.data_dir;
if (!await this.fs.exists(dir)) {
await this.fs.mkdir(dir);
}
return await this.save(retries + 1);
}
console.warn("Error saving item", this.data_path, e);
}
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson() {
return this.collection_adapter.get_item_ajson(this.item);
}
};

function ajson_merge3(existing, new_obj) {
if (new_obj === null)
return null;
if (new_obj === void 0)
return existing;
if (typeof new_obj !== "object")
return new_obj;
if (typeof existing !== "object" || existing === null)
existing = {};
const keys = Object.keys(new_obj);
const length = keys.length;
for (let i = 0; i < length; i++) {
const key = keys[i];
const new_val = new_obj[key];
const existing_val = existing[key];
if (Array.isArray(new_val)) {
existing[key] = new_val.slice();
} else if (is_object3(new_val)) {
existing[key] = ajson_merge3(is_object3(existing_val) ? existing_val : {}, new_val);
} else if (new_val !== void 0) {
existing[key] = new_val;
}
}
return existing;
}
function is_object3(obj) {
return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

var class_to_collection_key8 = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
function _parse_ajson_key3(ajson_key) {
let changed = false;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key8[collection_key]) {
collection_key = class_to_collection_key8[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
var AjsonSingleFileCollectionDataAdapter3 = class extends AjsonMultiFileCollectionDataAdapter5 {
/**
* Returns the single shared `.ajson` file path for this collection.
* @param {string} [key] - (unused) Item key, ignored in single-file mode.
* @returns {string} The single .ajson file path for the entire collection.
*/
get_item_data_path(key) {
const file_name = (this.collection?.collection_key || "collection") + ".ajson";
const sep = this.fs?.sep || "/";
const dir = this.collection.data_dir || "data";
return [dir, file_name].join(sep);
}
/**
* Override process_load_queue to parse the entire single-file .ajson once,
* distributing final states to items.
*
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const path = this.get_item_data_path();
if (!await this.fs.exists(path)) {
for (const item of Object.values(this.collection.items)) {
if (item._queue_load) {
item.queue_import?.();
}
}
this.collection.clear_process_notice("loading_collection");
return;
}
const raw_data = await this.fs.read(path, "utf-8", { no_cache: true });
if (!raw_data) {
for (const item of Object.values(this.collection.items)) {
if (item._queue_load) {
item.queue_import?.();
}
}
this.collection.clear_process_notice("loading_collection");
return;
}
const { rewrite, file_data } = this.parse_single_file_ajson(raw_data);
if (rewrite) {
if (file_data.length) {
await this.fs.write(path, file_data);
} else {
await this.fs.remove(path);
}
}
for (const item of Object.values(this.collection.items)) {
item._queue_load = false;
item.loaded_at = Date.now();
}
this.collection.clear_process_notice("loading_collection");
}
/**
* Helper to parse single-file .ajson content, distributing states to items.
*
* @param {string} raw
* @returns {{ rewrite: boolean, file_data: string }}
*/
parse_single_file_ajson(raw) {
let rewrite = false;
const lines = raw.trim().split("\n").filter(Boolean);
let data_map = {};
let line_count = 0;
for (let i = 0; i < lines.length; i++) {
const line = lines[i].trim();
if (!line.endsWith(",")) {
rewrite = true;
}
const trimmed = line.replace(/,$/, "");
const combined = "{" + trimmed + "}";
try {
const obj = JSON.parse(combined);
const [fullKey, value] = Object.entries(obj)[0];
let { collection_key, item_key, changed } = _parse_ajson_key3(fullKey);
const newKey = `${collection_key}:${item_key}`;
if (!value) {
delete data_map[newKey];
if (changed || newKey !== fullKey) {
delete data_map[fullKey];
}
rewrite = true;
} else {
data_map[newKey] = value;
if (changed || newKey !== fullKey) {
delete data_map[fullKey];
rewrite = true;
}
}
} catch (err) {
console.warn("parse error for line: ", line, err);
rewrite = true;
}
line_count++;
}
for (const [ajson_key, val] of Object.entries(data_map)) {
const [collection_key, ...rest] = ajson_key.split(":");
const item_key = rest.join(":");
const collection = this.collection.env[collection_key];
if (!collection)
continue;
let item = collection.get(item_key);
if (!item) {
const ItemClass = collection.item_type;
item = new ItemClass(this.env, val);
collection.set(item);
} else {
item.data = ajson_merge3(item.data, val);
}
item.loaded_at = Date.now();
item._queue_load = false;
if (!val.key)
val.key = item_key;
}
if (line_count > Object.keys(data_map).length) {
rewrite = true;
}
let minimal_lines = [];
for (const [ajson_key, val] of Object.entries(data_map)) {
minimal_lines.push(`${JSON.stringify(ajson_key)}: ${JSON.stringify(val)},`);
}
return {
rewrite,
file_data: minimal_lines.join("\n")
};
}
/**
* Override process_save_queue for single-file approach.
* We'll simply call save_item for each queued item, which appends a line to the same `.ajson`.
*
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved (single-file) ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
};

function collection_instance_name_from6(class_name) {
if (class_name.endsWith("Item")) {
return class_name.replace(/Item$/, "").toLowerCase();
}
return class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/y$/, "ie") + "s";
}

function create_uid6(data) {
const str = JSON.stringify(data);
let hash = 0;
if (str.length === 0)
return hash;
for (let i = 0; i < str.length; i++) {
const char = str.charCodeAt(i);
hash = (hash << 5) - hash + char;
hash = hash & hash;
if (hash < 0)
hash = hash * -1;
}
return hash.toString() + str.length;
}
function deep_merge7(target, source) {
for (const key in source) {
if (source.hasOwnProperty(key)) {
if (is_obj(source[key]) && is_obj(target[key]))
deep_merge7(target[key], source[key]);
else
target[key] = source[key];
}
}
return target;
function is_obj(item) {
return item && typeof item === "object" && !Array.isArray(item);
}
}

function deep_equal6(obj1, obj2, visited = /* @__PURE__ */ new WeakMap()) {
if (obj1 === obj2)
return true;
if (obj1 === null || obj2 === null || obj1 === void 0 || obj2 === void 0)
return false;
if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2))
return false;
if (Array.isArray(obj1)) {
if (obj1.length !== obj2.length)
return false;
return obj1.every((item, index) => deep_equal6(item, obj2[index], visited));
}
if (typeof obj1 === "object") {
if (visited.has(obj1))
return visited.get(obj1) === obj2;
visited.set(obj1, obj2);
const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);
if (keys1.length !== keys2.length)
return false;
return keys1.every((key) => deep_equal6(obj1[key], obj2[key], visited));
}
return obj1 === obj2;
}

var CollectionItem6 = class _CollectionItem {
/**
* Default properties for an instance of CollectionItem.
* Override in subclasses to define different defaults.
* @returns {Object}
*/
static get defaults() {
return {
data: {}
};
}
/**
* @param {Object} env - The environment/context.
* @param {Object|null} [data=null] - Initial data for the item.
*/
constructor(env, data = null) {
env.create_env_getter(this);
this.config = this.env?.config;
this.merge_defaults();
if (data)
deep_merge7(this.data, data);
if (!this.data.class_name)
this.data.class_name = this.constructor.name;
}
/**
* Loads an item from data and initializes it.
* @param {Object} env
* @param {Object} data
* @returns {CollectionItem}
*/
static load(env, data) {
const item = new this(env, data);
item.init();
return item;
}
/**
* Merge default properties from the entire inheritance chain.
* @private
*/
merge_defaults() {
let current_class = this.constructor;
while (current_class) {
for (let key in current_class.defaults) {
const default_val = current_class.defaults[key];
if (typeof default_val === "object") {
this[key] = { ...default_val, ...this[key] };
} else {
this[key] = this[key] === void 0 ? default_val : this[key];
}
}
current_class = Object.getPrototypeOf(current_class);
}
}
/**
* Generates or retrieves a unique key for the item.
* Key syntax supports:
* - `[i]` for sequences
* - `/` for super-sources (groups, directories, clusters)
* - `#` for sub-sources (blocks)
* @returns {string} The unique key
*/
get_key() {
return create_uid6(this.data);
}
/**
* Updates the item data and returns true if changed.
* @param {Object} data
* @returns {boolean} True if data changed.
*/
update_data(data) {
const sanitized_data = this.sanitize_data(data);
const current_data = { ...this.data };
deep_merge7(current_data, sanitized_data);
const changed = !deep_equal6(this.data, current_data);
if (!changed)
return false;
this.data = current_data;
return true;
}
/**
* Sanitizes data for saving. Ensures no circular references.
* @param {*} data
* @returns {*} Sanitized data.
*/
sanitize_data(data) {
if (data instanceof _CollectionItem)
return data.ref;
if (Array.isArray(data))
return data.map((val) => this.sanitize_data(val));
if (typeof data === "object" && data !== null) {
return Object.keys(data).reduce((acc, key) => {
acc[key] = this.sanitize_data(data[key]);
return acc;
}, {});
}
return data;
}
/**
* Initializes the item. Override as needed.
* @param {Object} [input_data] - Additional data that might be provided on creation.
*/
init(input_data) {
}
/**
* Queues this item for saving.
*/
queue_save() {
this._queue_save = true;
}
/**
* Saves this item using its data adapter.
* @returns {Promise<void>}
*/
async save() {
try {
await this.data_adapter.save_item(this);
this.init();
} catch (err) {
this._queue_save = true;
console.error(err, err.stack);
}
}
/**
* Queues this item for loading.
*/
queue_load() {
this._queue_load = true;
}
/**
* Loads this item using its data adapter.
* @returns {Promise<void>}
*/
async load() {
try {
await this.data_adapter.load_item(this);
this.init();
} catch (err) {
this._load_error = err;
this.on_load_error(err);
}
}
/**
* Handles load errors by re-queuing for load.
* Override if needed.
* @param {Error} err
*/
on_load_error(err) {
this.queue_load();
}
/**
* Validates the item before saving. Checks for presence and validity of key.
* @returns {boolean}
*/
validate_save() {
if (!this.key)
return false;
if (this.key.trim() === "")
return false;
if (this.key === "undefined")
return false;
return true;
}
/**
* Marks this item as deleted. This does not immediately remove it from memory,
* but queues a save that will result in the item being removed from persistent storage.
*/
delete() {
this.deleted = true;
this.queue_save();
}
/**
* Filters items in the collection based on provided options.
* functional filter (returns true or false) for filtering items in collection; called by collection class
* @param {Object} filter_opts - Filtering options.
* @param {string} [filter_opts.exclude_key] - A single key to exclude.
* @param {string[]} [filter_opts.exclude_keys] - An array of keys to exclude. If exclude_key is provided, it's added to this array.
* @param {string} [filter_opts.exclude_key_starts_with] - Exclude keys starting with this string.
* @param {string[]} [filter_opts.exclude_key_starts_with_any] - Exclude keys starting with any of these strings.
* @param {string} [filter_opts.exclude_key_includes] - Exclude keys that include this string.
* @param {string} [filter_opts.key_ends_with] - Include only keys ending with this string.
* @param {string} [filter_opts.key_starts_with] - Include only keys starting with this string.
* @param {string[]} [filter_opts.key_starts_with_any] - Include only keys starting with any of these strings.
* @param {string} [filter_opts.key_includes] - Include only keys that include this string.
* @returns {boolean} True if the item passes the filter, false otherwise.
*/
filter(filter_opts = {}) {
const {
exclude_key,
exclude_keys = exclude_key ? [exclude_key] : [],
exclude_key_starts_with,
exclude_key_starts_with_any,
exclude_key_includes,
exclude_key_includes_any,
key_ends_with,
key_starts_with,
key_starts_with_any,
key_includes,
key_includes_any
} = filter_opts;
if (exclude_keys?.includes(this.key))
return false;
if (exclude_key_starts_with && this.key.startsWith(exclude_key_starts_with))
return false;
if (exclude_key_starts_with_any && exclude_key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (exclude_key_includes && this.key.includes(exclude_key_includes))
return false;
if (exclude_key_includes_any && exclude_key_includes_any.some((include) => this.key.includes(include)))
return false;
if (key_ends_with && !this.key.endsWith(key_ends_with))
return false;
if (key_starts_with && !this.key.startsWith(key_starts_with))
return false;
if (key_starts_with_any && !key_starts_with_any.some((prefix) => this.key.startsWith(prefix)))
return false;
if (key_includes && !this.key.includes(key_includes))
return false;
if (key_includes_any && !key_includes_any.some((include) => this.key.includes(include)))
return false;
return true;
}
/**
* Parses item data for additional processing. Override as needed.
*/
parse() {
}
/**
* Helper function to render a component in the item scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
get actions() {
if (!this._actions) {
this._actions = Object.entries(this.env.opts.items[this.item_type_key].actions || {}).reduce((acc, [k, v]) => {
acc[k] = v.bind(this);
return acc;
}, {});
}
return this._actions;
}
/**
* Derives the collection key from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from6(name);
}
/**
* @returns {string} The collection key for this item.
*/
get collection_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return collection_instance_name_from6(name);
}
/**
* Retrieves the parent collection from the environment.
* @returns {Collection}
*/
get collection() {
return this.env[this.collection_key];
}
/**
* @returns {string} The item's key.
*/
get key() {
return this.data?.key || this.get_key();
}
get item_type_key() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return camel_case_to_snake_case7(name);
}
/**
* A simple reference object for this item.
* @returns {{collection_key: string, key: string}}
*/
get ref() {
return { collection_key: this.collection_key, key: this.key };
}
/**
* @returns {Object} The data adapter for this item's collection.
*/
get data_adapter() {
return this.collection.data_adapter;
}
/**
* @returns {Object} The filesystem adapter.
*/
get data_fs() {
return this.collection.data_fs;
}
/**
* Access to collection-level settings.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key])
this.env.settings[this.collection_key] = {};
return this.env.settings[this.collection_key];
}
set settings(settings) {
this.env.settings[this.collection_key] = settings;
this.env.smart_settings.save();
}
/**
* Render this item into a container using the item's component.
* @deprecated 2024-12-02 Use explicit component pattern from environment
* @param {HTMLElement} container
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_item(container, opts = {}) {
const frag = await this.component.call(this.smart_view, this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* @deprecated use env.smart_view
* @returns {Object}
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Override in child classes to set the component for this item
* @deprecated 2024-12-02
* @returns {Function} The render function for this component
*/
get component() {
return item_component;
}
};
function camel_case_to_snake_case7(str) {
const result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, "").replace(/2$/, "");
return result;
}

var AsyncFunction6 = Object.getPrototypeOf(async function() {
}).constructor;
var Collection6 = class {
/**
* Constructs a new Collection instance.
*
* @param {Object} env - The environment context containing configurations and adapters.
* @param {Object} [opts={}] - Optional configuration.
* @param {string} [opts.collection_key] - Custom key to override default collection name.
* @param {string} [opts.data_dir] - Custom data directory path.
* @param {boolean} [opts.prevent_load_on_init] - Whether to prevent loading items on initialization.
*/
constructor(env, opts = {}) {
env.create_env_getter(this);
this.opts = opts;
if (opts.collection_key)
this.collection_key = opts.collection_key;
this.env[this.collection_key] = this;
this.config = this.env.config;
this.items = {};
this.loaded = null;
this._loading = false;
this.load_time_ms = null;
this.settings_container = null;
}
/**
* Initializes a new collection in the environment. Override in subclass if needed.
*
* @param {Object} env
* @param {Object} [opts={}]
* @returns {Promise<void>}
*/
static async init(env, opts = {}) {
env[this.collection_key] = new this(env, opts);
await env[this.collection_key].init();
env.collections[this.collection_key] = "init";
}
/**
* The unique collection key derived from the class name.
* @returns {string}
*/
static get collection_key() {
let name = this.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
return name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Instance-level init. Override in subclasses if necessary.
* @returns {Promise<void>}
*/
async init() {
}
/**
* Creates or updates an item in the collection.
* - If `data` includes a key that matches an existing item, that item is updated.
* - Otherwise, a new item is created.
* After updating or creating, the item is validated. If validation fails, the item is logged and returned without being saved.
* If validation succeeds for a new item, it is added to the collection and marked for saving.
*
* If the item’s `init()` method is async, a promise is returned that resolves once init completes.
*
* @param {Object} [data={}] - Data for creating/updating an item.
* @returns {Promise<Item>|Item} The created or updated item. May return a promise if `init()` is async.
*/
create_or_update(data = {}) {
const existing_item = this.find_by(data);
const item = existing_item ? existing_item : new this.item_type(this.env);
item._queue_save = !existing_item;
const data_changed = item.update_data(data);
if (!existing_item && !item.validate_save()) {
return item;
}
if (!existing_item) {
this.set(item);
}
if (existing_item && !data_changed)
return existing_item;
if (item.init instanceof AsyncFunction6) {
return new Promise((resolve) => {
item.init(data).then(() => resolve(item));
});
}
item.init(data);
return item;
}
/**
* Finds an item by partial data match (first checks key). If `data.key` provided,
* returns the item with that key; otherwise attempts a match by merging data.
*
* @param {Object} data - Data to match against.
* @returns {Item|null}
*/
find_by(data) {
if (data.key)
return this.get(data.key);
const temp = new this.item_type(this.env);
const temp_data = JSON.parse(JSON.stringify(data, temp.sanitize_data(data)));
deep_merge7(temp.data, temp_data);
return temp.key ? this.get(temp.key) : null;
}
/**
* Filters items based on provided filter options or a custom function.
*
* @param {Object|Function} [filter_opts={}] - Filter options or a predicate function.
* @returns {Item[]} Array of filtered items.
*/
filter(filter_opts = {}) {
if (typeof filter_opts === "function") {
return Object.values(this.items).filter(filter_opts);
}
filter_opts = this.prepare_filter(filter_opts);
const results = [];
const { first_n } = filter_opts;
for (const item of Object.values(this.items)) {
if (first_n && results.length >= first_n)
break;
if (item.filter(filter_opts))
results.push(item);
}
return results;
}
/**
* Alias for `filter()`
* @param {Object|Function} filter_opts
* @returns {Item[]}
*/
list(filter_opts) {
return this.filter(filter_opts);
}
/**
* Prepares filter options. Can be overridden by subclasses to normalize filter options.
*
* @param {Object} filter_opts
* @returns {Object} Prepared filter options.
*/
prepare_filter(filter_opts) {
return filter_opts;
}
/**
* Retrieves an item by key.
* @param {string} key
* @returns {Item|undefined}
*/
get(key) {
return this.items[key];
}
/**
* Retrieves multiple items by an array of keys.
* @param {string[]} keys
* @returns {Item[]}
*/
get_many(keys = []) {
if (!Array.isArray(keys)) {
console.error("get_many called with non-array keys:", keys);
return [];
}
return keys.map((key) => this.get(key)).filter(Boolean);
}
/**
* Retrieves a random item from the collection, optionally filtered by options.
* @param {Object} [opts]
* @returns {Item|undefined}
*/
get_rand(opts = null) {
if (opts) {
const filtered = this.filter(opts);
return filtered[Math.floor(Math.random() * filtered.length)];
}
const keys = this.keys;
return this.items[keys[Math.floor(Math.random() * keys.length)]];
}
/**
* Adds or updates an item in the collection.
* @param {Item} item
*/
set(item) {
if (!item.key)
throw new Error("Item must have a key property");
this.items[item.key] = item;
}
/**
* Updates multiple items by their keys.
* @param {string[]} keys
* @param {Object} data
*/
update_many(keys = [], data = {}) {
this.get_many(keys).forEach((item) => item.update_data(data));
}
/**
* Clears all items from the collection.
*/
clear() {
this.items = {};
}
/**
* @returns {string} The collection key, can be overridden by opts.collection_key
*/
get collection_key() {
return this._collection_key ? this._collection_key : this.constructor.collection_key;
}
set collection_key(key) {
this._collection_key = key;
}
/**
* Lazily initializes and returns the data adapter instance for this collection.
* @returns {Object} The data adapter instance.
*/
get data_adapter() {
if (!this._data_adapter) {
const AdapterClass = this.get_adapter_class("data");
this._data_adapter = new AdapterClass(this);
}
return this._data_adapter;
}
get_adapter_class(type) {
const config = this.env.opts.collections?.[this.collection_key];
const adapter_key = type + "_adapter";
const adapter_module = config?.[adapter_key] ?? this.env.opts.collections?.smart_collections?.[adapter_key];
if (typeof adapter_module === "function")
return adapter_module;
if (typeof adapter_module?.collection === "function")
return adapter_module.collection;
throw new Error(`No '${type}' adapter class found for ${this.collection_key} or smart_collections`);
}
/**
* Data directory strategy for this collection. Defaults to 'multi'.
* @returns {string}
*/
get data_dir() {
return this.collection_key;
}
/**
* File system adapter from the environment.
* @returns {Object}
*/
get data_fs() {
return this.env.data_fs;
}
/**
* Derives the corresponding item class name based on this collection's class name.
* @returns {string}
*/
get item_class_name() {
let name = this.constructor.name;
if (name.match(/\d$/))
name = name.slice(0, -1);
if (name.endsWith("ies"))
return name.slice(0, -3) + "y";
else if (name.endsWith("s"))
return name.slice(0, -1);
return name + "Item";
}
/**
* Derives a readable item name from the item class name.
* @returns {string}
*/
get item_name() {
return this.item_class_name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}
/**
* Retrieves the item type (constructor) from the environment.
* @returns {Function} Item constructor.
*/
get item_type() {
if (this.opts.item_type)
return this.opts.item_type;
return this.env.item_types[this.item_class_name];
}
/**
* Returns an array of all keys in the collection.
* @returns {string[]}
*/
get keys() {
return Object.keys(this.items);
}
/**
* @deprecated use data_adapter instead (2024-09-14)
*/
get adapter() {
return this.data_adapter;
}
/**
* @method process_save_queue
* @description
* Saves items flagged for saving (_queue_save) back to AJSON or SQLite. This ensures persistent storage
* of any updates made since last load/import. This method also writes changes to disk (AJSON files or DB).
*/
async process_save_queue(opts = {}) {
if (opts.force) {
Object.values(this.items).forEach((item) => item._queue_save = true);
}
await this.data_adapter.process_save_queue(opts);
}
/**
* @alias process_save_queue
* @returns {Promise<void>}
*/
async save(opts = {}) {
await this.process_save_queue(opts);
}
/**
* @method process_load_queue
* @description
* Loads items that have been flagged for loading (_queue_load). This may involve
* reading from AJSON/SQLite or re-importing from markdown if needed.
* Called once initial environment is ready and collections are known.
*/
async process_load_queue() {
await this.data_adapter.process_load_queue();
}
/**
* Retrieves processed settings configuration.
* @returns {Object}
*/
get settings_config() {
return this.process_settings_config({});
}
/**
* Processes given settings config, adding prefixes and handling conditionals.
*
* @private
* @param {Object} _settings_config
* @param {string} [prefix='']
* @returns {Object}
*/
process_settings_config(_settings_config, prefix = "") {
const add_prefix = (key) => prefix && !key.includes(`${prefix}.`) ? `${prefix}.${key}` : key;
return Object.entries(_settings_config).reduce((acc, [key, val]) => {
let new_val = { ...val };
if (new_val.conditional) {
if (!new_val.conditional(this))
return acc;
delete new_val.conditional;
}
if (new_val.callback)
new_val.callback = add_prefix(new_val.callback);
if (new_val.btn_callback)
new_val.btn_callback = add_prefix(new_val.btn_callback);
if (new_val.options_callback)
new_val.options_callback = add_prefix(new_val.options_callback);
const new_key = add_prefix(this.process_setting_key(key));
acc[new_key] = new_val;
return acc;
}, {});
}
/**
* Processes an individual setting key. Override if needed.
* @param {string} key
* @returns {string}
*/
process_setting_key(key) {
return key;
}
/**
* Default settings for this collection. Override in subclasses as needed.
* @returns {Object}
*/
get default_settings() {
return {};
}
/**
* Current settings for the collection.
* Initializes with default settings if none exist.
* @returns {Object}
*/
get settings() {
if (!this.env.settings[this.collection_key]) {
this.env.settings[this.collection_key] = this.default_settings;
}
return this.env.settings[this.collection_key];
}
/**
* @deprecated use env.smart_view instead
* @returns {Object} smart_view instance
*/
get smart_view() {
if (!this._smart_view)
this._smart_view = this.env.init_module("smart_view");
return this._smart_view;
}
/**
* Renders the settings for the collection into a given container.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_settings(container = this.settings_container, opts = {}) {
return await this.render_collection_settings(container, opts);
}
/**
* Helper function to render collection settings.
* @param {HTMLElement} [container=this.settings_container]
* @param {Object} opts
* @returns {Promise<HTMLElement>}
*/
async render_collection_settings(container = this.settings_container, opts = {}) {
if (container && (!this.settings_container || this.settings_container !== container)) {
this.settings_container = container;
} else if (!container) {
container = this.env.smart_view.create_doc_fragment("<div></div>");
}
container.innerHTML = `<div class="sc-loading">Loading ${this.collection_key} settings...</div>`;
const frag = await this.env.render_component("settings", this, opts);
container.innerHTML = "";
container.appendChild(frag);
return container;
}
/**
* Unloads collection data from memory.
*/
unload() {
this.clear();
this.unloaded = true;
this.env.collections[this.collection_key] = null;
}
/**
* Runs load process for all items in the collection, triggering queue loads and rendering settings after done.
* @returns {Promise<void>}
*/
async run_data_load() {
this.loaded = null;
this.load_time_ms = null;
Object.values(this.items).forEach((item) => item.queue_load());
this.notices?.show("loading_collection", { collection_key: this.collection_key });
await this.process_load_queue();
this.notices?.remove("loading_collection");
this.notices?.show("done_loading_collection", { collection_key: this.collection_key });
this.render_settings();
}
/**
* Helper function to render a component in the collection scope
* @param {*} component_key
* @param {*} opts
* @returns
*/
async render_component(component_key, opts = {}) {
return await this.env.render_component(component_key, this, opts);
}
show_process_notice(process2, opts = {}) {
if (!this.debounce_process_notice)
this.debounce_process_notice = {};
this.debounce_process_notice[process2] = setTimeout(() => {
this.debounce_process_notice[process2] = null;
this.env.notices?.show(process2, { collection_key: this.collection_key, ...opts });
}, 1e3);
}
clear_process_notice(process2) {
if (this.debounce_process_notice?.[process2]) {
clearTimeout(this.debounce_process_notice[process2]);
this.debounce_process_notice[process2] = null;
} else {
this.env.notices?.remove(process2);
}
}
};

var SmartTemplates = class extends Collection6 {
get settings_config() {
return {
template_name: {
name: "Template Name",
description: "Specifies the name of the template. You can use {{folder_name}}.",
type: "text",
default: ""
},
template_heading: {
name: "Template Heading",
description: "If set, searches the current file for a heading with this name.",
type: "text",
default: ""
},
merge_parent_templates: {
name: "Merge Parent Templates",
description: "Whether to include (concatenate) parent-folder templates from each ancestor folder.",
type: "toggle",
default: false
},
system_prompt_heading: {
name: "System Prompt Heading",
description: 'If set, searches the template file for a heading with this name and uses it in "Generate" commands.',
type: "text",
default: ""
}
};
}
};

var SmartTemplate = class extends CollectionItem6 {
/**
* @static
* @returns {Object} Default data structure
*/
static get defaults() {
return {
data: {
source_key: null
}
};
}
/**
* Derives the unique key used by the environment to identify this template.
* By default, it's based on data.source_key or the item key.
* @returns {string}
*/
get_key() {
return this.data.key || this.data.source_key || super.get_key();
}
/**
* Reads the underlying file content from `source_item` in smart_sources,
* then applies extraction logic based on settings:
*  - If `template_heading` is present, extract only that heading.
*  - If `system_prompt_heading` is present, remove it entirely.
* @returns {Promise<string|null>}
*/
async get_template() {
const source_item = this.env.smart_sources.get(this.data.source_key);
if (!source_item) {
console.warn(`SmartTemplate: Source item not found for key: ${this.data.source_key}`);
return null;
}
let content;
try {
content = await source_item.read();
} catch (err) {
console.warn(`SmartTemplate: Error reading source_item: ${this.data.source_key}`, err);
return null;
}
console.log("content", content);
if (!content)
return null;
const settings = this.env.smart_templates?.settings || {};
if (settings.template_heading) {
content = extract_heading_from_string(content, settings.template_heading);
}
if (settings.system_prompt_heading) {
content = remove_heading_block(content, settings.system_prompt_heading);
}
console.log("content after extraction", content);
return content.trim();
}
get name() {
return this.data.name || this.key.replace(".md", "");
}
};
function extract_heading_from_string(fileContent, headingName) {
if (!fileContent)
return null;
if (!fileContent.includes(headingName))
return fileContent;
const lines = fileContent.split("\n");
let headingLineIndex = -1;
const headingPattern = new RegExp(`^#{1,6}\\s+${escapeRegExp(headingName)}\\s*$`);
for (let i = 0; i < lines.length; i++) {
if (headingPattern.test(lines[i])) {
headingLineIndex = i;
break;
}
}
if (headingLineIndex === -1) {
return null;
}
const subsequent = [];
for (let j = headingLineIndex + 1; j < lines.length; j++) {
if (/^#{1,6}\s+/.test(lines[j])) {
break;
}
subsequent.push(lines[j]);
}
while (subsequent.length && !subsequent[subsequent.length - 1].trim()) {
subsequent.pop();
}
const result = subsequent.join("\n").trim();
return result;
}
function remove_heading_block(content, headingName) {
if (!content)
return "";
const lines = content.split("\n");
const headingPattern = new RegExp(`^#{1,6}\\s+${escapeRegExp(headingName)}\\s*$`);
let result = [];
let skipMode = false;
for (let i = 0; i < lines.length; i++) {
const line = lines[i];
if (headingPattern.test(line)) {
skipMode = true;
continue;
}
if (skipMode && /^#{1,6}\s+/.test(line)) {
skipMode = false;
}
if (!skipMode) {
result.push(line);
}
}
return result.join("\n").trim();
}
function escapeRegExp(str) {
return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

var smart_templates_default_config = {
class: SmartTemplates,
data_adapter: AjsonSingleFileCollectionDataAdapter3
};

var CollectionDataAdapter6 = class {
/**
* @constructor
* @param {Object} collection - The collection instance that this adapter manages.
*/
constructor(collection) {
this.collection = collection;
this.env = collection.env;
}
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = ItemDataAdapter6;
/**
* Optional factory method to create item adapters.
* If `this.item_adapter_class` is not null, it uses that; otherwise can be overridden by subclasses.
* @param {Object} item - The item to create an adapter for.
* @returns {ItemDataAdapter}
*/
create_item_adapter(item) {
if (!this.ItemDataAdapter) {
throw new Error("No item_adapter_class specified and create_item_adapter not overridden.");
}
return new this.ItemDataAdapter(item);
}
/**
* Load a single item by its key using an `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item(key) {
throw new Error("Not implemented");
}
/**
* Save a single item by its key using its associated `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to save.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save_item(key) {
throw new Error("Not implemented");
}
/**
* Delete a single item by its key. This may involve updating or removing its file,
* as handled by the `ItemDataAdapter`.
* @async
* @param {string} key - The key of the item to delete.
* @returns {Promise<void>} Resolves when the item is deleted.
*/
async delete_item(key) {
throw new Error("Not implemented");
}
/**
* Process any queued load operations. Typically orchestrates calling `load_item()`
* on items that have been flagged for loading.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
throw new Error("Not implemented");
}
/**
* Process any queued save operations. Typically orchestrates calling `save_item()`
* on items that have been flagged for saving.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
throw new Error("Not implemented");
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @param {string} key - The key of the item to load.
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_item_if_updated(item) {
const adapter = this.create_item_adapter(item);
await adapter.load_if_updated();
}
};
var ItemDataAdapter6 = class {
/**
* @constructor
* @param {Object} item - The collection item instance that this adapter manages.
*/
constructor(item) {
this.item = item;
}
/**
* Load the item's data from storage. May involve reading a file and parsing
* its contents, then updating `item.data`.
* @async
* @returns {Promise<void>} Resolves when the item is fully loaded.
*/
async load() {
throw new Error("Not implemented");
}
/**
* Save the item's data to storage. May involve writing to a file or appending
* lines in an append-only format.
* @async
* @param {string|null} [ajson=null] - An optional serialized representation of the item’s data.
*                                     If not provided, the adapter should derive it from the item.
* @returns {Promise<void>} Resolves when the item is saved.
*/
async save(ajson = null) {
throw new Error("Not implemented");
}
/**
* Delete the item's data from storage. May involve removing a file or writing
* a `null` entry in an append-only file to signify deletion.
* @async
* @returns {Promise<void>} Resolves when the item’s data is deleted.
*/
async delete() {
throw new Error("Not implemented");
}
/**
* Returns the file path or unique identifier used by this adapter to locate and store
* the item's data. This may be a file name derived from the item's key.
* @returns {string} The path or identifier for the item's data.
*/
get data_path() {
throw new Error("Not implemented");
}
/**
* @returns {CollectionDataAdapter} The collection data adapter that this item data adapter belongs to.
*/
get collection_adapter() {
return this.item.collection.data_adapter;
}
get env() {
return this.item.env;
}
/**
* Load the item's data from storage if it has been updated externally.
* @async
* @returns {Promise<void>} Resolves when the item is loaded.
*/
async load_if_updated() {
throw new Error("Not implemented");
}
};

var FileCollectionDataAdapter6 = class extends CollectionDataAdapter6 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = FileItemDataAdapter6;
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.collection.data_fs || this.collection.env.data_fs;
}
};
var FileItemDataAdapter6 = class extends ItemDataAdapter6 {
/**
* @returns {Object} Filesystem interface derived from environment or collection settings.
*/
get fs() {
return this.item.collection.data_fs || this.item.collection.env.data_fs;
}
get data_path() {
throw new Error("Not implemented");
}
async load_if_updated() {
const data_path = this.data_path;
if (await this.fs.exists(data_path)) {
const loaded_at = this.item.loaded_at || 0;
const data_file_stat = await this.fs.stat(data_path);
if (data_file_stat.mtime > loaded_at + 1 * 60 * 1e3) {
console.log(`Smart Collections: Re-loading item ${this.item.key} because it has been updated on disk`);
await this.load();
}
}
}
};

var class_to_collection_key9 = {
"SmartSource": "smart_sources",
"SmartNote": "smart_sources",
"SmartBlock": "smart_blocks",
"SmartDirectory": "smart_directories"
};
var AjsonMultiFileCollectionDataAdapter6 = class extends FileCollectionDataAdapter6 {
/**
* The class to use for item adapters.
* @type {typeof ItemDataAdapter}
*/
ItemDataAdapter = AjsonMultiFileItemDataAdapter6;
/**
* Load a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async load_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.load();
}
/**
* Save a single item by its key.
* @async
* @param {string} key
* @returns {Promise<void>}
*/
async save_item(key) {
const item = this.collection.get(key);
if (!item)
return;
const adapter = this.create_item_adapter(item);
await adapter.save();
}
/**
* Process any queued load operations.
* @async
* @returns {Promise<void>}
*/
async process_load_queue() {
this.collection.show_process_notice("loading_collection");
if (!await this.fs.exists(this.collection.data_dir)) {
await this.fs.mkdir(this.collection.data_dir);
}
const load_queue = Object.values(this.collection.items).filter((item) => item._queue_load);
if (!load_queue.length) {
this.collection.clear_process_notice("loading_collection");
return;
}
console.log(`Loading ${this.collection.collection_key}: ${load_queue.length} items`);
const batch_size = 100;
for (let i = 0; i < load_queue.length; i += batch_size) {
const batch = load_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.load().catch((err) => {
console.warn(`Error loading item ${item.key}`, err);
item.queue_load();
});
}));
}
console.log(`Loaded ${this.collection.collection_key} in ${this.collection.load_time_ms}ms`);
this.collection.loaded = load_queue.length;
this.collection.clear_process_notice("loading_collection");
}
/**
* Process any queued save operations.
* @async
* @returns {Promise<void>}
*/
async process_save_queue() {
this.collection.show_process_notice("saving_collection");
const save_queue = Object.values(this.collection.items).filter((item) => item._queue_save);
console.log(`Saving ${this.collection.collection_key}: ${save_queue.length} items`);
const time_start = Date.now();
const batch_size = 50;
for (let i = 0; i < save_queue.length; i += batch_size) {
const batch = save_queue.slice(i, i + batch_size);
await Promise.all(batch.map((item) => {
const adapter = this.create_item_adapter(item);
return adapter.save().catch((err) => {
console.warn(`Error saving item ${item.key}`, err);
item.queue_save();
});
}));
}
const deleted_items = Object.values(this.collection.items).filter((item) => item.deleted);
if (deleted_items.length) {
deleted_items.forEach((item) => {
delete this.collection.items[item.key];
});
}
console.log(`Saved ${this.collection.collection_key} in ${Date.now() - time_start}ms`);
this.collection.clear_process_notice("saving_collection");
}
get_item_data_path(key) {
return [
this.collection.data_dir || "multi",
this.fs?.sep || "/",
this.get_data_file_name(key) + ".ajson"
].join("");
}
/**
* Transforms the item key into a safe filename.
* Replaces spaces, slashes, and dots with underscores.
* @returns {string} safe file name
*/
get_data_file_name(key) {
return key.split("#")[0].replace(/[\s\/\.]/g, "_").replace(".md", "");
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson(item) {
const collection_key = item.collection_key;
const key = item.key;
const data_value = item.deleted ? "null" : JSON.stringify(item.data);
return `${JSON.stringify(`${collection_key}:${key}`)}: ${data_value},`;
}
};
var AjsonMultiFileItemDataAdapter6 = class extends FileItemDataAdapter6 {
/**
* Derives the `.ajson` file path from the collection's data_dir and item key.
* @returns {string}
*/
get data_path() {
return this.collection_adapter.get_item_data_path(this.item.key);
}
/**
* Load the item from its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async load() {
try {
const raw_data = await this.fs.adapter.read(this.data_path, "utf-8", { no_cache: true });
if (!raw_data) {
this.item.queue_import();
return;
}
const { rewrite, file_data } = this._parse(raw_data);
if (rewrite) {
if (file_data.length)
await this.fs.write(this.data_path, file_data);
else
await this.fs.remove(this.data_path);
}
const last_import_mtime = this.item.data.last_import?.at || 0;
if (last_import_mtime && this.item.init_file_mtime > last_import_mtime) {
this.item.queue_import();
}
} catch (e) {
this.item.queue_import();
}
}
/**
* Parse the entire AJSON content as a JSON object, handle legacy keys, and extract final state.
* @private
* @param {string} ajson
* @returns {boolean}
*/
_parse(ajson) {
try {
let rewrite = false;
if (!ajson.length)
return false;
ajson = ajson.trim();
const original_line_count = ajson.split("\n").length;
const json_str = "{" + ajson.slice(0, -1) + "}";
const data = JSON.parse(json_str);
const entries = Object.entries(data);
for (let i = 0; i < entries.length; i++) {
const [ajson_key, value] = entries[i];
if (!value) {
delete data[ajson_key];
rewrite = true;
continue;
}
const { collection_key, item_key, changed } = this._parse_ajson_key(ajson_key);
if (changed) {
rewrite = true;
data[collection_key + ":" + item_key] = value;
delete data[ajson_key];
}
const collection = this.env[collection_key];
if (!collection)
continue;
const existing_item = collection.get(item_key);
if (!value.key)
value.key = item_key;
if (existing_item) {
existing_item.data = value;
existing_item._queue_load = false;
existing_item.loaded_at = Date.now();
} else {
const ItemClass = collection.item_type;
const new_item = new ItemClass(this.env, value);
new_item._queue_load = false;
new_item.loaded_at = Date.now();
collection.set(new_item);
}
}
if (rewrite || original_line_count > entries.length) {
rewrite = true;
}
return {
rewrite,
file_data: rewrite ? Object.entries(data).map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)},`).join("\n") : null
};
} catch (e) {
if (ajson.split("\n").some((line) => !line.endsWith(","))) {
console.warn("fixing trailing comma error");
ajson = ajson.split("\n").map((line) => line.endsWith(",") ? line : line + ",").join("\n");
return this._parse(ajson);
}
console.warn("Error parsing JSON:", e);
return { rewrite: true, file_data: null };
}
}
_parse_ajson_key(ajson_key) {
let changed;
let [collection_key, ...item_key] = ajson_key.split(":");
if (class_to_collection_key9[collection_key]) {
collection_key = class_to_collection_key9[collection_key];
changed = true;
}
return {
collection_key,
item_key: item_key.join(":"),
changed
};
}
/**
* Save the current state of the item by appending a new line to its `.ajson` file.
* @async
* @returns {Promise<void>}
*/
async save(retries = 0) {
try {
const ajson_line = this.get_item_ajson();
await this.fs.append(this.data_path, "\n" + ajson_line);
this.item._queue_save = false;
} catch (e) {
if (e.code === "ENOENT" && retries < 1) {
console.warn("ENOENT, creating directory", this.data_path);
const dir = this.collection_adapter.collection.data_dir;
if (!await this.fs.exists(dir)) {
await this.fs.mkdir(dir);
}
return await this.save(retries + 1);
}
console.warn("Error saving item", this.data_path, e);
}
}
/**
* Build a single AJSON line for the given item and data.
* @param {Object} item
* @returns {string}
*/
get_item_ajson() {
return this.collection_adapter.get_item_ajson(this.item);
}
};
var ajson_multi_file_default = {
collection: AjsonMultiFileCollectionDataAdapter6,
item: AjsonMultiFileItemDataAdapter6
};

var import_obsidian12 = require("obsidian");
var MergeFileModal = class extends import_obsidian12.FuzzySuggestModal {
/**
* @param {import("obsidian").App} app
* @param {SmartEditorPlugin} plugin
*/
constructor(app, plugin) {
super(app);
this.plugin = plugin;
}
/**
* Provides the list of files from the vault, ensuring that recently-opened
* notes appear first in the suggested items.
* @returns {TFile[]}
*/
getItems() {
const all_files = this.app.vault.getFiles().filter((file) => file.extension === "md");
const recent_file_paths = this.app.workspace.getLastOpenFiles();
const recent_files = [];
for (const path of recent_file_paths) {
const match = all_files.find((f) => f.path === path);
if (match) {
recent_files.push(match);
}
}
const remainder = all_files.filter((f) => !recent_files.includes(f));
return [...recent_files, ...remainder];
}
/**
* Displays each file path in the modal.
* @param {TFile} item
* @returns {string}
*/
getItemText(item) {
return item.path;
}
/**
* Called when the user selects a file from the modal.
* @param {TFile} item
* @param {MouseEvent | KeyboardEvent} evt
*/
async onChooseItem(item, evt) {
const active_file = this.plugin.app.workspace.getActiveFile();
if (!active_file) {
new import_obsidian12.Notice("No active file found to merge from.");
return;
}
const active_file_lines = (await this.plugin.app.vault.read(active_file)).split("\n");
let is_frontmatter = false;
const active_file_content = active_file_lines.map((line, index) => {
if (index === 0 && line.startsWith("---")) {
is_frontmatter = true;
return null;
}
if (is_frontmatter) {
if (line.startsWith("---")) {
is_frontmatter = false;
}
return null;
}
if (line.trim().length === 0) {
return null;
}
return line;
}).filter(Boolean).join("\n");
await this.plugin.app.workspace.openLinkText(item.path, "", true);
new import_obsidian12.Notice(`Draft merged into "${item.path}".`);
}
};

var import_obsidian13 = require("obsidian");
var DraftCreatorModal = class extends import_obsidian13.Modal {
/**
* @param {import('obsidian').App} app
* @param {Object} plugin
*/
constructor(app, plugin) {
super(app);
this.plugin = plugin;
this.is_generating = false;
}
onOpen() {
const { contentEl } = this;
const file_path = this.app.workspace.getActiveFile()?.path;
if (!file_path) {
new import_obsidian13.Notice("No active file found to create a draft for.");
return;
}
const env = this.plugin.env;
const completion_data = {
draft_target_key: file_path,
chat_model_config: env?.settings?.smart_editor_plugin?.smart_completions?.chat_model || {}
};
if (!env?.smart_completions) {
contentEl.createEl("h2", { text: 'Cannot create draft: missing "smart_completions" environment.' });
return;
}
const completion = new env.smart_completions.item_type(env, completion_data);
env.smart_completions.set(completion);
this.plugin.env.render_component("draft_creator", completion, {
completion_callback: () => {
this.close();
this.plugin.render_pending_changes(file_path);
}
}).then((draft_creator_frag) => {
contentEl.appendChild(draft_creator_frag);
const instructions_el = contentEl.querySelector(".sd-dc-instructions-field");
instructions_el?.focus({ focusVisible: true });
});
}
onClose() {
const { contentEl } = this;
contentEl.empty();
}
};

var import_obsidian15 = require("obsidian");

var import_obsidian14 = require("obsidian");
var TargetFileModal = class extends import_obsidian14.FuzzySuggestModal {
/**
* @param {import('obsidian').App} app
* @param {function(string): void} onChoose
*/
constructor(app, onChoose) {
super(app);
this.onChooseCallback = onChoose;
this.setPlaceholder("Choose target note...");
}
getItems() {
const files = this.app.vault.getMarkdownFiles();
return files.map((f) => f.path);
}
getItemText(item) {
return item;
}
onChooseItem(item) {
if (this.onChooseCallback) {
this.onChooseCallback(item);
}
}
};

var CreateDraftManualModal = class extends import_obsidian15.Modal {
/**
* @param {import('obsidian').App} app
* @param {Object} plugin - The main plugin or an object holding references to env, settings, etc.
*/
constructor(app, plugin) {
super(app);
this.plugin = plugin;
this.target_path = this.app.workspace.getActiveFile()?.path || "";
this.draft_text = "";
}
onOpen() {
const { contentEl } = this;
contentEl.empty();
contentEl.createEl("h2", { text: "Create Draft (Manual)" });
const targetDisplay = contentEl.createEl("div", {
text: `Target note: ${this.target_path}`,
cls: "draft-manual-target-display"
});
targetDisplay.setAttr("style", "margin-bottom: 1em; color: var(--text-normal);");
const changeTargetBtn = contentEl.createEl("button", { text: "Change target" });
changeTargetBtn.setAttr("style", "margin-bottom: 1em; margin-right: 1em;");
changeTargetBtn.addEventListener("click", () => {
new TargetFileModal(this.app, (chosenPath) => {
this.target_path = chosenPath;
targetDisplay.textContent = `Target note: ${this.target_path}`;
}).open();
});
contentEl.createEl("label", { text: "Enter the draft content below:", cls: "draft-manual-label" });
const textArea = contentEl.createEl("textarea");
textArea.rows = 12;
textArea.setAttr("style", "width:100%; margin-bottom:1em;");
textArea.addEventListener("input", (evt) => {
this.draft_text = evt.target.value;
});
const reviewBtn = contentEl.createEl("button", { text: "Review changes" });
reviewBtn.setAttr("style", "margin-right: 0.5em;");
reviewBtn.addEventListener("click", async () => {
await this.handle_review();
});
const cancelBtn = contentEl.createEl("button", { text: "Cancel" });
cancelBtn.addEventListener("click", () => {
this.close();
});
}
async handle_review() {
if (!this.target_path) {
new import_obsidian15.Notice("No target note selected.");
return;
}
try {
const sc = this.plugin.env?.smart_changes;
if (!sc) {
new import_obsidian15.Notice("No smart_changes environment found. Cannot parse changes.");
return;
}
if (!this.draft_text.trim()) {
new import_obsidian15.Notice("Draft content is empty. Nothing to parse.");
return;
}
const pendingChanges = await sc.parse_changes_2(this.target_path, this.draft_text);
if (!pendingChanges?.length) {
new import_obsidian15.Notice("No changes detected from the entered draft.");
} else {
new import_obsidian15.Notice(`Parsed ${pendingChanges.length} changes for '${this.target_path}'.`);
}
const file = this.app.vault.getAbstractFileByPath(this.target_path);
if (file instanceof import_obsidian15.TFile) {
const current_active_file = this.app.workspace.getActiveFile();
let leaf;
if (current_active_file?.path === this.target_path) {
leaf = this.app.workspace.getLeaf();
} else {
leaf = this.app.workspace.getLeaf("split", "vertical");
}
await leaf.openFile(file);
this.plugin.render_pending_changes(this.target_path);
}
this.close();
} catch (err) {
console.error("Error parsing manual draft:", err);
new import_obsidian15.Notice(`Error while parsing: ${err.message || err}`);
}
}
onClose() {
const { contentEl } = this;
contentEl.empty();
}
};

var SmartModel = class {
scope_name = "smart_model";
static defaults = {
};
/**
* Create a SmartModel instance.
* @param {Object} opts - Configuration options
* @param {Object} opts.adapters - Map of adapter names to adapter classes
* @param {Object} opts.settings - Model settings configuration
* @param {Object} opts.model_config - Model-specific configuration
* @param {string} opts.model_config.adapter - Name of the adapter to use
* @param {string} [opts.model_key] - Optional model identifier to override settings
* @throws {Error} If required options are missing
*/
constructor(opts = {}) {
this.opts = opts;
this.validate_opts(opts);
this.state = "unloaded";
this._adapter = null;
}
/**
* Initialize the model by loading the configured adapter.
* @async
* @returns {Promise<void>}
*/
async initialize() {
this.load_adapter(this.adapter_name);
await this.load();
}
/**
* Validate required options.
* @param {Object} opts - Configuration options
*/
validate_opts(opts) {
if (!opts.adapters)
throw new Error("opts.adapters is required");
if (!opts.settings)
throw new Error("opts.settings is required");
}
/**
* Get the current settings
* @returns {Object} Current settings
*/
get settings() {
if (!this.opts.settings)
this.opts.settings = {
...this.constructor.defaults
};
return this.opts.settings;
}
/**
* Get the current adapter name
* @returns {string} Current adapter name
*/
get adapter_name() {
let adapter_key = this.opts.model_config?.adapter || this.opts.adapter || this.settings.adapter || Object.keys(this.adapters)[0];
if (!adapter_key || !this.adapters[adapter_key]) {
console.warn(`Platform "${adapter_key}" not supported`);
adapter_key = Object.keys(this.adapters)[0];
}
return adapter_key;
}
/**
* Get adapter-specific settings.
* @returns {Object} Settings for current adapter
*/
get adapter_settings() {
if (!this.settings[this.adapter_name])
this.settings[this.adapter_name] = {};
return this.settings[this.adapter_name];
}
get adapter_config() {
const base_config = this.adapters[this.adapter_name]?.defaults || {};
return {
...base_config,
...this.adapter_settings,
...this.opts.adapter_config
};
}
/**
* Get available models.
* @returns {Object} Map of model objects
*/
get models() {
return this.adapter.models;
}
/**
* Get default model key.
* @returns {string} Default model key
*/
get default_model_key() {
return this.adapter.constructor.defaults.default_model;
}
/**
* Get the current model key
* @returns {string} Current model key
*/
get model_key() {
return this.opts.model_key || this.adapter_config.model_key || this.settings.model_key || this.default_model_key;
}
/**
* Get the current model configuration
* @returns {Object} Combined base and custom model configuration
*/
get model_config() {
const model_key = this.model_key;
const base_model_config = this.models[model_key] || {};
return {
...this.adapter_config,
...base_model_config,
...this.opts.model_config
};
}
get model_settings() {
if (!this.settings[this.model_key])
this.settings[this.model_key] = {};
return this.settings[this.model_key];
}
/**
* Load the current adapter and transition to loaded state.
* @async
* @returns {Promise<void>}
*/
async load() {
this.set_state("loading");
if (!this.adapter?.is_loaded) {
await this.invoke_adapter_method("load");
}
this.set_state("loaded");
}
/**
* Unload the current adapter and transition to unloaded state.
* @async
* @returns {Promise<void>}
*/
async unload() {
if (this.adapter?.is_loaded) {
this.set_state("unloading");
await this.invoke_adapter_method("unload");
this.set_state("unloaded");
}
}
/**
* Set the model's state.
* @param {('unloaded'|'loading'|'loaded'|'unloading')} new_state - The new state
* @throws {Error} If the state is invalid
*/
set_state(new_state) {
const valid_states = ["unloaded", "loading", "loaded", "unloading"];
if (!valid_states.includes(new_state)) {
throw new Error(`Invalid state: ${new_state}`);
}
this.state = new_state;
}
get is_loading() {
return this.state === "loading";
}
get is_loaded() {
return this.state === "loaded";
}
get is_unloading() {
return this.state === "unloading";
}
get is_unloaded() {
return this.state === "unloaded";
}
/**
* Get the map of available adapters
* @returns {Object} Map of adapter names to adapter classes
*/
get adapters() {
return this.opts.adapters || {};
}
/**
* Load a specific adapter by name.
* @async
* @param {string} adapter_name - Name of the adapter to load
* @throws {Error} If adapter not found or loading fails
* @returns {Promise<void>}
*/
async load_adapter(adapter_name) {
this.set_adapter(adapter_name);
if (!this._adapter.loaded) {
this.set_state("loading");
try {
await this.invoke_adapter_method("load");
this.set_state("loaded");
} catch (err) {
this.set_state("unloaded");
throw new Error(`Failed to load adapter: ${err.message}`);
}
}
}
/**
* Set an adapter instance by name without loading it.
* @param {string} adapter_name - Name of the adapter to set
* @throws {Error} If adapter not found
*/
set_adapter(adapter_name) {
const AdapterClass = this.adapters[adapter_name];
if (!AdapterClass) {
throw new Error(`Adapter "${adapter_name}" not found.`);
}
if (this._adapter?.constructor.name.toLowerCase() === adapter_name.toLowerCase()) {
return;
}
this._adapter = new AdapterClass(this);
}
/**
* Get the current active adapter instance
* @returns {Object} The active adapter instance
* @throws {Error} If adapter not found
*/
get adapter() {
const adapter_name = this.adapter_name;
if (!adapter_name) {
throw new Error(`Adapter not set for model.`);
}
if (!this._adapter) {
this.load_adapter(adapter_name);
}
return this._adapter;
}
/**
* Ensure the adapter is ready to execute a method.
* @param {string} method - Name of the method to check
* @throws {Error} If adapter not loaded or method not implemented
*/
ensure_adapter_ready(method) {
if (!this.adapter) {
throw new Error("No adapter loaded.");
}
if (typeof this.adapter[method] !== "function") {
throw new Error(`Adapter does not implement method: ${method}`);
}
}
/**
* Invoke a method on the current adapter.
* @async
* @param {string} method - Name of the method to call
* @param {...any} args - Arguments to pass to the method
* @returns {Promise<any>} Result from the adapter method
* @throws {Error} If adapter not ready or method fails
*/
async invoke_adapter_method(method, ...args) {
this.ensure_adapter_ready(method);
return await this.adapter[method](...args);
}
/**
* Get platforms as dropdown options.
* @returns {Array<Object>} Array of {value, name} option objects
*/
get_platforms_as_options() {
console.log("get_platforms_as_options", this.adapters);
return Object.entries(this.adapters).map(([key, AdapterClass]) => ({ value: key, name: AdapterClass.defaults.description || key }));
}
/**
* Get the settings configuration schema
* @returns {Object} Settings configuration object
*/
get settings_config() {
return this.process_settings_config({
adapter: {
name: "Model Platform",
type: "dropdown",
description: "Select a model platform to use with Smart Model.",
options_callback: "get_platforms_as_options",
is_scope: true,
callback: "adapter_changed",
default: "default"
}
});
}
/**
* Process settings configuration with conditionals and prefixes.
* @param {Object} _settings_config - Raw settings configuration
* @param {string} [prefix] - Optional prefix for setting keys
* @returns {Object} Processed settings configuration
*/
process_settings_config(_settings_config, prefix = null) {
return Object.entries(_settings_config).reduce((acc, [key, val]) => {
const new_key = (prefix ? prefix + "." : "") + this.process_setting_key(key);
acc[new_key] = val;
return acc;
}, {});
}
/**
* Process an individual setting key.
* Example: replace placeholders with actual adapter names.
* @param {string} key - The setting key with placeholders.
* @returns {string} Processed setting key.
*/
process_setting_key(key) {
return key.replace(/\[ADAPTER\]/g, this.adapter_name);
}
re_render_settings() {
console.log("re_render_settings", this.opts);
if (typeof this.opts.re_render_settings === "function")
this.opts.re_render_settings();
else
console.warn("re_render_settings is not a function (must be passed in model opts)");
}
/**
* Reload model.
*/
reload_model() {
console.log("reload_model", this.opts);
if (typeof this.opts.reload_model === "function")
this.opts.reload_model();
else
console.warn("reload_model is not a function (must be passed in model opts)");
}
adapter_changed() {
this.reload_model();
this.re_render_settings();
}
model_changed() {
this.reload_model();
this.re_render_settings();
}
};

var SmartChatModel = class extends SmartModel {
scope_name = "smart_chat_model";
static defaults = {
adapter: "openai"
};
/**
* Create a SmartChatModel instance.
* @param {Object} opts - Configuration options
* @param {string} opts.adapter - Adapter to use
* @param {Object} opts.adapters - Map of adapter names to adapter classes
* @param {Object} opts.settings - Model settings configuration
*/
constructor(opts = {}) {
super(opts);
}
/**
* Get available models.
* @returns {Object} Map of model objects
*/
get models() {
return this.adapter.models;
}
get can_stream() {
return this.adapter.constructor.defaults.streaming;
}
get can_use_tools() {
return this.adapter.constructor.defaults.can_use_tools;
}
/**
* Complete a chat request.
* @param {Object} req - Request parameters
* @returns {Promise<Object>} Completion result
*/
async complete(req) {
return await this.invoke_adapter_method("complete", req);
}
/**
* Stream chat responses.
* @param {Object} req - Request parameters
* @param {Object} handlers - Event handlers for streaming
* @param {Function} handlers.chunk - Handler for chunks: receives response object
* @param {Function} handlers.error - Handler for errors: receives error object
* @param {Function} handlers.done - Handler for completion: receives final response object
* @returns {Promise<string>} Complete response text
*/
async stream(req, handlers = {}) {
return await this.invoke_adapter_method("stream", req, handlers);
}
/**
* Stop active stream.
*/
stop_stream() {
this.invoke_adapter_method("stop_stream");
}
/**
* Count tokens in input text.
* @param {string|Object} input - Text to count tokens for
* @returns {Promise<number>} Token count
*/
async count_tokens(input) {
return await this.invoke_adapter_method("count_tokens", input);
}
/**
* Test if API key is valid.
* @returns {Promise<boolean>} True if API key is valid
*/
async test_api_key() {
await this.invoke_adapter_method("test_api_key");
this.re_render_settings();
}
/**
* Get default model key.
* @returns {string} Default model key
*/
get default_model_key() {
return this.adapter.constructor.defaults.default_model;
}
/**
* Get current settings.
* @returns {Object} Settings object
*/
get settings() {
return this.opts.settings;
}
/**
* Get settings configuration.
* @returns {Object} Settings configuration object
*/
get settings_config() {
const _settings_config = {
adapter: {
name: "Chat Model Platform",
type: "dropdown",
description: "Select a chat model platform to use with Smart Chat.",
options_callback: "get_platforms_as_options",
is_scope: true,
callback: "adapter_changed",
default: "open_router"
},
...this.adapter.settings_config || {}
};
return this.process_settings_config(_settings_config);
}
/**
* Process setting key.
* @param {string} key - Setting key
* @returns {string} Processed key
*/
process_setting_key(key) {
return key.replace(/\[CHAT_ADAPTER\]/g, this.adapter_name);
}
/**
* Validate the adapter configuration.
* @returns {Object} Validation result with 'valid' and 'message'.
*/
validate_config() {
return this.adapter.validate_config();
}
};

var SmartHttpRequest = class {
/**
* @param {object} opts - Options for the SmartHttpRequest class
* @param {SmartHttpRequestAdapter} opts.adapter - The adapter constructor to use for making HTTP requests
* @param {Obsidian.requestUrl} opts.obsidian_request_adapter - For use with Obsidian adapter
*/
constructor(opts = {}) {
this.opts = opts;
if (!opts.adapter)
throw new Error("HttpRequestAdapter is required");
this.adapter = new opts.adapter(this);
}
/**
* Returns a well-formed response object
* @param {object} request_params - Parameters for the HTTP request
* @param {string} request_params.url - The URL to make the request to
* @param {string} [request_params.method='GET'] - The HTTP method to use
* @param {object} [request_params.headers] - Headers to include in the request
* @param {*} [request_params.body] - The body of the request (for POST, PUT, etc.)
* @returns {SmartHttpResponseAdapter} instance of the SmartHttpResponseAdapter class
* @example
* const response = await smart_http_request.request({
*   url: 'https://api.example.com/data',
*   method: 'GET',
*   headers: { 'Content-Type': 'application/json' }
* });
* console.log(await response.json());
*/
async request(request_params) {
return await this.adapter.request(request_params);
}
};

var SmartHttpRequestAdapter = class {
constructor(main) {
this.main = main;
}
async request(request_params) {
throw new Error("request not implemented");
}
};
var SmartHttpResponseAdapter = class {
constructor(response) {
this.response = response;
}
async headers() {
throw new Error("headers not implemented");
}
async json() {
throw new Error("json not implemented");
}
async status() {
throw new Error("status not implemented");
}
async text() {
throw new Error("text not implemented");
}
};

var SmartHttpRequestFetchAdapter = class extends SmartHttpRequestAdapter {
async request(request_params) {
const { url, ...opts } = request_params;
const resp = await fetch(url, opts);
return new SmartHttpResponseFetchAdapter(resp);
}
};
var SmartHttpResponseFetchAdapter = class extends SmartHttpResponseAdapter {
async headers() {
return this.response.headers;
}
async json() {
if (!this._json) {
this._json = await this.response.json();
}
return this._json;
}
async status() {
return this.response.status;
}
async text() {
if (!this._text) {
this._text = await this.response.text();
}
return this._text;
}
};

var SmartStreamer = class {
constructor(url, options = {}) {
const {
method = "GET",
headers = {},
body = null,
withCredentials = false
} = options;
this.url = url;
this.method = method;
this.headers = headers;
this.body = body;
this.withCredentials = withCredentials;
this.listeners = {};
this.readyState = this.CONNECTING;
this.progress = 0;
this.chunk = "";
this.last_event_id = "";
this.xhr = null;
this.FIELD_SEPARATOR = ":";
this.INITIALIZING = -1;
this.CONNECTING = 0;
this.OPEN = 1;
this.CLOSED = 2;
this.chunk_accumulator = "";
this.chunk_splitting_regex = options.chunk_splitting_regex || /(\r\n|\n|\r)/g;
}
/**
* Adds an event listener for the specified event type.
*
* @param {string} type - The type of the event.
* @param {Function} listener - The listener function to be called when the event is triggered.
*/
addEventListener(type, listener) {
if (!this.listeners[type])
this.listeners[type] = [];
if (!this.listeners[type].includes(listener))
this.listeners[type].push(listener);
}
/**
* Removes an event listener from the SmartStreamer instance.
*
* @param {string} type - The type of event to remove the listener from.
* @param {Function} listener - The listener function to remove.
*/
removeEventListener(type, listener) {
if (!this.listeners[type])
return;
this.listeners[type] = this.listeners[type].filter((callback) => callback !== listener);
if (this.listeners[type].length === 0)
delete this.listeners[type];
}
/**
* Dispatches an event to the appropriate event handlers.
*
* @param {Event} event - The event to be dispatched.
* @returns {boolean} - Returns true if the event was successfully dispatched, false otherwise.
*/
dispatchEvent(event) {
if (!event)
return true;
event.source = this;
const onHandler = "on" + event.type;
if (Object.prototype.hasOwnProperty.call(this, onHandler)) {
this[onHandler].call(this, event);
if (event.defaultPrevented)
return false;
}
if (this.listeners[event.type]) {
this.listeners[event.type].forEach((callback) => {
callback(event);
return !event.defaultPrevented;
});
}
return true;
}
/**
* Initiates the streaming process.
*/
stream() {
this.#setReadyState(this.CONNECTING);
this.xhr = new XMLHttpRequest();
this.xhr.addEventListener("progress", this.#onStreamProgress.bind(this));
this.xhr.addEventListener("load", this.#onStreamLoaded.bind(this));
this.xhr.addEventListener("readystatechange", this.#checkStreamClosed.bind(this));
this.xhr.addEventListener("error", this.#onStreamFailure.bind(this));
this.xhr.addEventListener("abort", this.#onStreamAbort.bind(this));
this.xhr.open(this.method, this.url);
for (const header in this.headers) {
this.xhr.setRequestHeader(header, this.headers[header]);
}
if (this.last_event_id)
this.xhr.setRequestHeader("Last-Event-ID", this.last_event_id);
this.xhr.withCredentials = this.withCredentials;
this.xhr.send(this.body);
}
/**
* Ends the streamer connection.
* Aborts the current XHR request and sets the ready state to CLOSED.
*/
end() {
if (this.readyState === this.CLOSED)
return;
this.xhr.abort();
this.xhr = null;
this.#setReadyState(this.CLOSED);
}
#setReadyState(state) {
const event = new CustomEvent("readyStateChange");
event.readyState = state;
this.readyState = state;
this.dispatchEvent(event);
}
#onStreamFailure(e) {
const event = new CustomEvent("error");
event.data = e.currentTarget.response;
this.dispatchEvent(event);
this.end();
}
#onStreamAbort(e) {
const event = new CustomEvent("abort");
this.end();
}
#onStreamProgress(e) {
if (!this.xhr)
return;
if (this.xhr.status !== 200) {
this.#onStreamFailure(e);
return;
}
if (this.readyState === this.CONNECTING) {
this.dispatchEvent(new CustomEvent("open"));
this.#setReadyState(this.OPEN);
}
const data = this.xhr.responseText.substring(this.progress);
this.progress += data.length;
const parts = data.split(this.chunk_splitting_regex);
parts.forEach((part, index) => {
if (part.trim().length === 0) {
if (this.chunk) {
this.dispatchEvent(this.#parseEventChunk(this.chunk.trim()));
this.chunk = "";
}
} else {
this.chunk += part;
if (index === parts.length - 1 && this.xhr.readyState === XMLHttpRequest.DONE) {
this.dispatchEvent(this.#parseEventChunk(this.chunk.trim()));
this.chunk = "";
}
}
});
}
#onStreamLoaded(e) {
this.#onStreamProgress(e);
this.dispatchEvent(this.#parseEventChunk(this.chunk));
this.chunk = "";
}
#parseEventChunk(chunk) {
if (!chunk)
return console.log("no chunk");
const event = new CustomEvent("message");
event.data = chunk;
event.last_event_id = this.last_event_id;
return event;
}
#checkStreamClosed() {
if (!this.xhr)
return;
if (this.xhr.readyState === XMLHttpRequest.DONE)
this.#setReadyState(this.CLOSED);
}
};

var SmartModelAdapter = class {
/**
* Create a SmartModelAdapter instance.
* @param {SmartModel} model - The parent SmartModel instance
*/
constructor(model) {
this.model = model;
this.state = "unloaded";
}
/**
* Load the adapter.
* @async
* @returns {Promise<void>}
*/
async load() {
this.set_state("loaded");
}
/**
* Unload the adapter.
* @returns {void}
*/
unload() {
this.set_state("unloaded");
}
/**
* Get all settings.
* @returns {Object} All settings
*/
get settings() {
return this.model.settings;
}
/**
* Get the current model key.
* @returns {string} Current model identifier
*/
get model_key() {
return this.model.model_key;
}
/**
* Get the current model configuration.
* @returns {Object} Model configuration
*/
get model_config() {
return this.model.model_config;
}
/**
* Get model-specific settings.
* @returns {Object} Settings for current model
*/
get model_settings() {
return this.model.model_settings;
}
/**
* Get adapter-specific configuration.
* @returns {Object} Adapter configuration
*/
get adapter_config() {
return this.model.adapter_config;
}
/**
* Get adapter-specific settings.
* @returns {Object} Adapter settings
*/
get adapter_settings() {
return this.model.adapter_settings;
}
/**
* Get the models.
* @returns {Object} Map of model objects
*/
get models() {
if (typeof this.adapter_config.models === "object" && Object.keys(this.adapter_config.models || {}).length > 0)
return this.adapter_config.models;
else {
return {};
}
}
/**
* Get available models from the API.
* @abstract
* @param {boolean} [refresh=false] - Whether to refresh cached models
* @returns {Promise<Object>} Map of model objects
*/
async get_models(refresh = false) {
throw new Error("get_models not implemented");
}
/**
* Validate the parameters for get_models.
* @returns {boolean|Array<Object>} True if parameters are valid, otherwise an array of error objects
*/
validate_get_models_params() {
return true;
}
/**
* Get available models as dropdown options synchronously.
* @returns {Array<Object>} Array of model options.
*/
get_models_as_options() {
const models = this.models;
const params_valid = this.validate_get_models_params();
if (params_valid !== true)
return params_valid;
if (!Object.keys(models || {}).length) {
this.get_models(true);
return [{ value: "", name: "No models currently available" }];
}
return Object.values(models).map((model) => ({ value: model.id, name: model.name || model.id })).sort((a, b) => a.name.localeCompare(b.name));
}
/**
* Set the adapter's state.
* @param {('unloaded'|'loading'|'loaded'|'unloading')} new_state - The new state
* @throws {Error} If the state is invalid
*/
set_state(new_state) {
const valid_states = ["unloaded", "loading", "loaded", "unloading"];
if (!valid_states.includes(new_state)) {
throw new Error(`Invalid state: ${new_state}`);
}
this.state = new_state;
}
get is_loading() {
return this.state === "loading";
}
get is_loaded() {
return this.state === "loaded";
}
get is_unloading() {
return this.state === "unloading";
}
get is_unloaded() {
return this.state === "unloaded";
}
};

var SmartChatModelAdapter = class extends SmartModelAdapter {
/**
* @override in sub-class with adapter-specific default configurations
* @property {string} id - The adapter identifier
* @property {string} description - Human-readable description
* @property {string} type - Adapter type ("API")
* @property {string} endpoint - API endpoint
* @property {boolean} streaming - Whether streaming is supported
* @property {string} adapter - Adapter identifier
* @property {string} models_endpoint - Endpoint for retrieving models
* @property {string} default_model - Default model to use
* @property {string} signup_url - URL for API key signup
*/
static defaults = {};
/**
* Create a SmartChatModelAdapter instance.
* @param {SmartChatModel} model - The parent SmartChatModel instance
*/
constructor(model) {
super(model);
this.smart_chat = model;
this.main = model;
}
/**
* Complete a chat request.
* @abstract
* @param {Object} req - Request parameters
* @returns {Promise<Object>} Completion result
*/
async complete(req) {
throw new Error("complete not implemented");
}
/**
* Count tokens in input text.
* @abstract
* @param {string|Object} input - Text to count tokens for
* @returns {Promise<number>} Token count
*/
async count_tokens(input) {
throw new Error("count_tokens not implemented");
}
/**
* Stream chat responses.
* @abstract
* @param {Object} req - Request parameters
* @param {Object} handlers - Event handlers for streaming
* @returns {Promise<string>} Complete response text
*/
async stream(req, handlers = {}) {
throw new Error("stream not implemented");
}
/**
* Test if API key is valid.
* @abstract
* @returns {Promise<boolean>} True if API key is valid
*/
async test_api_key() {
throw new Error("test_api_key not implemented");
}
/**
* Refresh available models.
*/
refresh_models() {
console.log("refresh_models");
this.get_models(true);
}
/**
* Get settings configuration.
* @returns {Object} Settings configuration object
*/
get settings_config() {
return {
"[CHAT_ADAPTER].model_key": {
name: "Chat Model",
type: "dropdown",
description: "Select a chat model to use with Smart Chat.",
options_callback: "adapter.get_models_as_options",
callback: "reload_model",
default: this.constructor.defaults.default_model
},
"[CHAT_ADAPTER].refresh_models": {
name: "Refresh Models",
type: "button",
description: "Refresh the list of available models.",
callback: "adapter.refresh_models"
}
};
}
/**
* Validate the adapter configuration.
* @abstract
* @returns {Object} { valid: boolean, message: string }
*/
validate_config() {
throw new Error("validate_config not implemented");
}
get can_use_tools() {
return this.model_config?.can_use_tools || false;
}
};

var SmartChatModelApiAdapter = class extends SmartChatModelAdapter {
/**
* Get the request adapter class.
* @returns {SmartChatModelRequestAdapter} The request adapter class
*/
get req_adapter() {
return SmartChatModelRequestAdapter;
}
/**
* Get the response adapter class.
* @returns {SmartChatModelResponseAdapter} The response adapter class
*/
get res_adapter() {
return SmartChatModelResponseAdapter;
}
/**
* Get or initialize the HTTP adapter.
* @returns {SmartHttpRequest} The HTTP adapter instance
*/
get http_adapter() {
if (!this._http_adapter) {
if (this.model.opts.http_adapter)
this._http_adapter = this.model.opts.http_adapter;
else
this._http_adapter = new SmartHttpRequest({ adapter: SmartHttpRequestFetchAdapter });
}
return this._http_adapter;
}
/**
* Get the settings configuration for the API adapter.
* @returns {Object} Settings configuration object with API key and other settings
*/
get settings_config() {
return {
...super.settings_config,
"[CHAT_ADAPTER].api_key": {
name: "API Key",
type: "password",
description: "Enter your API key for the chat model platform.",
callback: "test_api_key",
is_scope: true
}
};
}
/**
* Count tokens in the input text.
* @abstract
* @param {string|Object} input - Text or message object to count tokens for
* @returns {Promise<number>} Number of tokens in the input
*/
async count_tokens(input) {
throw new Error("count_tokens not implemented");
}
/**
* Get the parameters for requesting available models.
* @returns {Object} Request parameters for models endpoint
*/
get models_request_params() {
return {
url: this.models_endpoint,
method: this.models_endpoint_method,
headers: {
"Authorization": `Bearer ${this.api_key}`
}
};
}
/**
* Validate parameters required for getting models.
* @returns {true|Array<Object>} True if valid, array of error objects if invalid
*/
validate_get_models_params() {
if (!this.adapter_config.models_endpoint) {
const err_msg = `${this.model.adapter_name} models endpoint required to retrieve models`;
console.warn(err_msg);
return [{ value: "", name: err_msg }];
}
if (!this.api_key) {
const err_msg = `${this.model.adapter_name} API key required to retrieve models`;
console.warn(err_msg);
return [{ value: "", name: err_msg }];
}
return true;
}
/**
* Get available models from the API.
* @param {boolean} [refresh=false] - Whether to refresh cached models
* @returns {Promise<Object>} Map of model objects
*/
async get_models(refresh = false) {
if (!refresh && this.adapter_config?.models && typeof this.adapter_config.models === "object" && Object.keys(this.adapter_config.models).length > 0)
return this.adapter_config.models;
try {
console.log("models_request_params", this.models_request_params);
const response = await this.http_adapter.request(this.models_request_params);
console.log("response", response);
const model_data = this.parse_model_data(await response.json());
console.log("model_data", model_data);
this.adapter_settings.models = model_data;
this.model.re_render_settings();
return model_data;
} catch (error) {
console.error("Failed to fetch model data:", error);
return { "_": { id: `Failed to fetch models from ${this.model.adapter_name}` } };
}
}
/**
* Parses the raw model data from OpenAI API and transforms it into a more usable format.
* @param {Object} model_data - The raw model data received from OpenAI API.
* @returns {Array<Object>} An array of parsed model objects with the following properties:
*   @property {string} model_name - The name/ID of the model as returned by the API.
*   @property {string} id - The id used to identify the model (usually same as model_name).
*   @property {boolean} multimodal - Indicates if the model supports multimodal inputs.
*   @property {number} [max_input_tokens] - The maximum number of input tokens the model can process.
*   @property {string} [description] - A description of the model's context and output capabilities.
*/
parse_model_data(model_data) {
throw new Error("parse_model_data not implemented");
}
/**
* Complete a chat request.
* @param {Object} req - Request parameters
* @returns {Promise<Object>} Completion response in OpenAI format
*/
async complete(req) {
const _req = new this.req_adapter(this, {
...req,
stream: false
});
const request_params = _req.to_platform();
console.log("request_params", request_params);
const http_resp = await this.http_adapter.request(request_params);
if (!http_resp)
return null;
console.log("http_resp", http_resp);
const _res = new this.res_adapter(this, await http_resp.json());
try {
return _res.to_openai();
} catch (error) {
console.error("Error in SmartChatModelApiAdapter.complete():", error);
console.error(http_resp);
return null;
}
}
/**
* Stream chat responses.
* @param {Object} req - Request parameters
* @param {Object} handlers - Event handlers for streaming
* @param {Function} handlers.chunk - Handler for response objects
* @param {Function} handlers.error - Handler for errors
* @param {Function} handlers.done - Handler for completion
* @returns {Promise<Object>} Complete response object
*/
async stream(req, handlers = {}) {
const _req = new this.req_adapter(this, req);
const request_params = _req.to_platform(true);
if (this.streaming_chunk_splitting_regex)
request_params.chunk_splitting_regex = this.streaming_chunk_splitting_regex;
console.log("request_params", request_params);
return await new Promise((resolve, reject) => {
try {
this.active_stream = new SmartStreamer(this.endpoint_streaming, request_params);
const resp_adapter = new this.res_adapter(this);
this.active_stream.addEventListener("message", async (e) => {
if (this.is_end_of_stream(e)) {
console.log("end of stream");
await resp_adapter.handle_chunk(e.data);
this.stop_stream();
const final_resp = resp_adapter.to_openai();
handlers.done && await handlers.done(final_resp);
resolve(final_resp);
console.log("final_resp", final_resp);
console.log(resp_adapter);
return;
}
try {
resp_adapter.handle_chunk(e.data);
handlers.chunk && await handlers.chunk(resp_adapter.to_openai());
} catch (error) {
console.error("Error processing stream chunk:", error);
handlers.error && handlers.error(e.data);
this.stop_stream();
reject(error);
}
});
this.active_stream.addEventListener("error", (e) => {
console.error("Stream error:", e);
handlers.error && handlers.error("*API Error. See console logs for details.*");
this.stop_stream();
reject(e);
});
this.active_stream.stream();
} catch (err) {
console.error("Failed to start stream:", err);
handlers.error && handlers.error("*API Error. See console logs for details.*");
this.stop_stream();
reject(err);
}
});
}
/**
* Check if a stream event indicates end of stream.
* @param {Event} event - Stream event
* @returns {boolean} True if end of stream
*/
is_end_of_stream(event) {
return event.data === "data: [DONE]";
}
/**
* Stop active stream.
*/
stop_stream() {
if (this.active_stream) {
this.active_stream.end();
this.active_stream = null;
}
}
/**
* Validate Anthropic adapter configuration.
* @returns {Object} { valid: boolean, message: string }
*/
validate_config() {
if (!this.adapter_config.model_key || this.adapter_config.model_key === "undefined")
return { valid: false, message: "No model selected." };
if (!this.api_key) {
return { valid: false, message: "API key is missing." };
}
if (!this.can_use_tools) {
return { valid: false, message: "Selected model does not support tools." };
}
return { valid: true, message: "Configuration is valid." };
}
/**
* Get the API key.
* @returns {string} The API key.
*/
get api_key() {
return this.main.opts.api_key || this.adapter_config?.api_key;
}
/**

* Get the number of choices.
* @returns {number} The number of choices.
*/
get choices() {
return this.adapter_config.choices;
}
get models_endpoint() {
return this.adapter_config.models_endpoint;
}
get models_endpoint_method() {
return "POST";
}
/**
* Get the endpoint URL.
* @returns {string} The endpoint URL.
*/
get endpoint() {
return this.adapter_config.endpoint;
}
/**
* Get the streaming endpoint URL.
* @returns {string} The streaming endpoint URL.
*/
get endpoint_streaming() {
return this.adapter_config.endpoint_streaming || this.endpoint;
}
/**
* Get the maximum output tokens.
* @returns {number} The maximum output tokens.
*/
get max_output_tokens() {
return this.adapter_config.max_output_tokens || 3e3;
}
/**
* Get the temperature.
* @returns {number} The temperature.
*/
get temperature() {
return this.adapter_config.temperature;
}
};
var SmartChatModelRequestAdapter = class {
/**
* @constructor
* @param {SmartChatModelAdapter} adapter - The SmartChatModelAdapter instance
* @param {Object} req - The incoming request object
*/
constructor(adapter, req = {}) {
this.adapter = adapter;
this._req = req;
}
/**
* Get the messages array from the request
* @returns {Array<Object>} Array of message objects
*/
get messages() {
return this._req.messages || [];
}
/**
* Get the model identifier
* @returns {string} Model ID
*/
get model() {
return this._req.model || this.adapter.model_config.id;
}
/**
* Get the temperature setting
* @returns {number} Temperature value
*/
get temperature() {
return this._req.temperature;
}
/**
* Get the maximum tokens setting
* @returns {number} Max tokens value
*/
get max_tokens() {
return this._req.max_tokens || this.adapter.model_config.max_output_tokens;
}
/**
* Get the streaming flag
* @returns {boolean} Whether to stream responses
*/
get stream() {
return this._req.stream;
}
/**
* Get the tools array
* @returns {Array<Object>|null} Array of tool objects or null
*/
get tools() {
return this._req.tools || null;
}
/**
* Get the tool choice setting
* @returns {string|Object|null} Tool choice configuration
*/
get tool_choice() {
return this._req.tool_choice || null;
}
get frequency_penalty() {
return this._req.frequency_penalty;
}
get presence_penalty() {
return this._req.presence_penalty;
}
get top_p() {
return this._req.top_p;
}
/**
* Get request headers
* @returns {Object} Headers object
*/
get_headers() {
const headers = {
"Content-Type": "application/json",
...this.adapter.adapter_config.headers || {}
};
if (this.adapter.adapter_config.api_key_header !== "none") {
if (this.adapter.adapter_config.api_key_header) {
headers[this.adapter.adapter_config.api_key_header] = this.adapter.api_key;
} else if (this.adapter.api_key) {
headers["Authorization"] = `Bearer ${this.adapter.api_key}`;
}
}
return headers;
}
/**
* Convert request to platform-specific format
* @returns {Object} Platform-specific request parameters
*/
to_platform(streaming = false) {
return this.to_openai(streaming);
}
/**
* Convert request to OpenAI format
* @returns {Object} Request parameters in OpenAI format
*/
to_openai(streaming = false) {
const body = {
messages: this._transform_messages_to_openai(),
model: this.model,
max_tokens: this.max_tokens,
temperature: this.temperature,
stream: streaming,
...this.tools && { tools: this._transform_tools_to_openai() }
};
if (body.tools?.length > 0 && this.tool_choice && this.tool_choice !== "none") {
body.tool_choice = this.tool_choice;
}
if (this.model?.startsWith("o1-")) {
body.messages = body.messages.filter((m) => m.role !== "system");
delete body.temperature;
}
if (typeof this._req.top_p === "number")
body.top_p = this._req.top_p;
if (typeof this._req.presence_penalty === "number")
body.presence_penalty = this._req.presence_penalty;
if (typeof this._req.frequency_penalty === "number")
body.frequency_penalty = this._req.frequency_penalty;
return {
url: this.adapter.endpoint,
method: "POST",
headers: this.get_headers(),
body: JSON.stringify(body)
};
}
/**
* Transform messages to OpenAI format
* @returns {Array<Object>} Transformed messages array
* @private
*/
_transform_messages_to_openai() {
return this.messages.map((message) => this._transform_single_message_to_openai(message));
}
/**
* Transform a single message to OpenAI format
* @param {Object} message - Message object to transform
* @returns {Object} Transformed message object
* @private
*/
_transform_single_message_to_openai(message) {
const transformed = {
role: this._get_openai_role(message.role),
content: this._get_openai_content(message)
};
if (message.name)
transformed.name = message.name;
if (message.tool_calls)
transformed.tool_calls = this._transform_tool_calls_to_openai(message.tool_calls);
if (message.image_url)
transformed.image_url = message.image_url;
if (message.tool_call_id)
transformed.tool_call_id = message.tool_call_id;
return transformed;
}
/**
* Get the OpenAI role for a given role.
* @param {string} role - The role to transform.
* @returns {string} The transformed role.
* @private
*/
_get_openai_role(role) {
return role;
}
/**
* Get the OpenAI content for a given content.
* @param {string} content - The content to transform.
* @returns {string} The transformed content.
* @private
*/
_get_openai_content(message) {
return message.content;
}
/**
* Transform tool calls to OpenAI format.
* @param {Array} tool_calls - Array of tool call objects.
* @returns {Array} Transformed tool calls array.
* @private
*/
_transform_tool_calls_to_openai(tool_calls) {
return tool_calls.map((tool_call) => ({
id: tool_call.id,
type: tool_call.type,
function: {
name: tool_call.function.name,
arguments: tool_call.function.arguments
}
}));
}
/**
* Transform tools to OpenAI format.
* @returns {Array} Transformed tools array.
* @private
*/
_transform_tools_to_openai() {
return this.tools.map((tool) => ({
type: tool.type,
function: {
name: tool.function.name,
description: tool.function.description,
parameters: tool.function.parameters
}
}));
}
};
var SmartChatModelResponseAdapter = class {
static get platform_res() {
return {
id: "",
object: "chat.completion",
created: 0,
model: "",
choices: [],
usage: {}
};
}
/**
* @constructor
* @param {SmartChatModelAdapter} adapter - The SmartChatModelAdapter instance
* @param {Object} res - The response object
*/
constructor(adapter, res) {
this.adapter = adapter;
this._res = res || this.constructor.platform_res;
}
/**
* Get response ID
* @returns {string|null} Response ID
*/
get id() {
return this._res.id || null;
}
/**
* Get response object type
* @returns {string|null} Object type
*/
get object() {
return this._res.object || null;
}
/**
* Get creation timestamp
* @returns {number|null} Creation timestamp
*/
get created() {
return this._res.created || null;
}
/**
* Get response choices
* @returns {Array<Object>} Array of choice objects
*/
get choices() {
return this._res.choices || [];
}
/**
* Get first tool call if present
* @returns {Object|null} Tool call object
*/
get tool_call() {
return this.message.tool_calls?.[0] || null;
}
/**
* Get tool name from first tool call
* @returns {string|null} Tool name
*/
get tool_name() {
return this.tool_call?.tool_name || null;
}
/**
* Get tool call parameters
* @returns {Object|null} Tool parameters
*/
get tool_call_content() {
return this.tool_call?.parameters || null;
}
/**
* Get token usage statistics
* @returns {Object|null} Usage statistics
*/
get usage() {
return this._res.usage || null;
}
get error() {
return this._res.error || null;
}
/**
* Convert response to OpenAI format
* @returns {Object} Response in OpenAI format
*/
to_openai() {
const res = {
id: this.id,
object: this.object,
created: this.created,
choices: this._transform_choices_to_openai(),
usage: this._transform_usage_to_openai(),
raw: this._res
};
if (this.error)
res.error = this.error;
return res;
}
/**
* Parse chunk adds delta to content as expected output format
*/
handle_chunk(chunk) {
if (chunk === "data: [DONE]")
return;
chunk = JSON.parse(chunk.split("data: ")[1] || "{}");
if (Object.keys(chunk).length === 0)
return;
if (!this._res.choices[0]) {
this._res.choices.push({
message: {
index: 0,
role: "assistant",
content: ""
}
});
}
if (!this._res.id) {
this._res.id = chunk.id;
}
if (chunk.choices?.[0]?.delta?.content) {
this._res.choices[0].message.content += chunk.choices[0].delta.content;
}
if (chunk.choices?.[0]?.delta?.tool_calls) {
if (!this._res.choices[0].message.tool_calls) {
this._res.choices[0].message.tool_calls = [{
id: "",
type: "function",
function: {
name: "",
arguments: ""
}
}];
}
if (chunk.choices[0].delta.tool_calls[0].id) {
this._res.choices[0].message.tool_calls[0].id += chunk.choices[0].delta.tool_calls[0].id;
}
if (chunk.choices[0].delta.tool_calls[0].function.name) {
this._res.choices[0].message.tool_calls[0].function.name += chunk.choices[0].delta.tool_calls[0].function.name;
}
if (chunk.choices[0].delta.tool_calls[0].function.arguments) {
this._res.choices[0].message.tool_calls[0].function.arguments += chunk.choices[0].delta.tool_calls[0].function.arguments;
}
}
}
/**
* Transform choices to OpenAI format.
* @returns {Array} Transformed choices array.
* @private
*/
_transform_choices_to_openai() {
return this.choices.map((choice) => ({
index: choice.index,
message: this._transform_message_to_openai(choice.message),
finish_reason: this._get_openai_finish_reason(choice.finish_reason)
}));
}
/**
* Transform a single message to OpenAI format.
* @param {Object} message - The message object to transform.
* @returns {Object} Transformed message object.
* @private
*/
_transform_message_to_openai(message = {}) {
const transformed = {
role: this._get_openai_role(message.role),
content: this._get_openai_content(message)
};
if (message.name)
transformed.name = message.name;
if (message.tool_calls)
transformed.tool_calls = this._transform_tool_calls_to_openai(message.tool_calls);
if (message.image_url)
transformed.image_url = message.image_url;
return transformed;
}
/**
* Get the OpenAI role for a given role.
* @param {string} role - The role to transform.
* @returns {string} The transformed role.
* @private
*/
_get_openai_role(role) {
return role;
}
/**
* Get the OpenAI content for a given content.
* @param {string} content - The content to transform.
* @returns {string} The transformed content.
* @private
*/
_get_openai_content(message) {
return message.content;
}
/**
* Get the OpenAI finish reason for a given finish reason.
* @param {string} finish_reason - The finish reason to transform.
* @returns {string} The transformed finish reason.
* @private
*/
_get_openai_finish_reason(finish_reason) {
return finish_reason;
}
/**
* Transform usage to OpenAI format.
* @returns {Object} Transformed usage object.
* @private
*/
_transform_usage_to_openai() {
return this.usage;
}
/**
* Transform tool calls to OpenAI format.
* @param {Array} tool_calls - Array of tool call objects.
* @returns {Array} Transformed tool calls array.
* @private
*/
_transform_tool_calls_to_openai(tool_calls) {
return tool_calls.map((tool_call) => ({
id: tool_call.id,
type: tool_call.type,
function: {
name: tool_call.function.name,
arguments: tool_call.function.arguments
}
}));
}
};

var SmartChatModelAnthropicAdapter = class extends SmartChatModelApiAdapter {
static key = "anthropic";
static defaults = {
description: "Anthropic Claude",
type: "API",
endpoint: "https://api.anthropic.com/v1/messages",
streaming: true,
api_key_header: "x-api-key",
headers: {
"anthropic-version": "2023-06-01",
"anthropic-beta": "tools-2024-04-04",
"anthropic-dangerous-direct-browser-access": true
},
adapter: "Anthropic",
models_endpoint: false,
default_model: "claude-3-5-sonnet-latest",
signup_url: "https://console.anthropic.com/login?returnTo=%2Fsettings%2Fkeys",
can_use_tools: true
};
/**
* Get request adapter class
* @returns {typeof SmartChatModelAnthropicRequestAdapter} Request adapter class
*/
get req_adapter() {
return SmartChatModelAnthropicRequestAdapter;
}
/**
* Get response adapter class
* @returns {typeof SmartChatModelAnthropicResponseAdapter} Response adapter class
*/
res_adapter = SmartChatModelAnthropicResponseAdapter;
/**
* Validate parameters for getting models
* @returns {boolean} Always true since models are hardcoded
*/
validate_get_models_params() {
return true;
}
/**
* Get available models (hardcoded list)
* @returns {Promise<Object>} Map of model objects
*/
get_models() {
return Promise.resolve(this.models);
}
is_end_of_stream(event) {
return event.data.includes("message_stop");
}
/**
* Get hardcoded list of available models
* @returns {Object} Map of model objects with capabilities and limits
*/
get models() {
return {
"claude-3-7-sonnet-latest": {
name: "Claude 3.7 Sonnet (Latest)",
id: "claude-3-7-sonnet-latest",
model_name: "claude-3-7-sonnet-latest",
description: "Anthropic's Claude Sonnet (Latest)",
max_input_tokens: 2e5,
max_output_tokens: 4e3,
multimodal: true
},
"claude-3-5-sonnet-latest": {
name: "Claude 3.5 Sonnet (Latest)",
id: "claude-3-5-sonnet-latest",
model_name: "claude-3.5-sonnet-latest",
description: "Anthropic's Claude Sonnet (Latest)",
max_input_tokens: 2e5,
max_output_tokens: 4e3,
multimodal: true
},
"claude-3-5-haiku-latest": {
name: "Claude 3.5 Haiku (Latest)",
id: "claude-3-5-haiku-latest",
model_name: "claude-3.5-haiku-latest",
description: "Anthropic's Claude Haiku (Latest)",
max_input_tokens: 2e5,
max_output_tokens: 4e3
},
"claude-3-opus-latest": {
name: "Claude 3 Opus (Latest)",
id: "claude-3-opus-latest",
model_name: "claude-3-opus-latest",
description: "Anthropic's Claude Opus (Latest)",
max_input_tokens: 2e5,
max_output_tokens: 4e3
},
"claude-3-7-sonnet-20250219": {
name: "Claude 3.7 Sonnet (2025-02-19)",
id: "claude-3-7-sonnet-20250219",
model_name: "claude-3-7-sonnet-20250219",
description: "Anthropic's Claude Sonnet (2025-02-19)",
max_input_tokens: 2e5,
max_output_tokens: 4e3
},
"claude-3-5-sonnet-20241022": {
name: "Claude 3.5 Sonnet (2024-10-22)",
id: "claude-3-5-sonnet-20241022",
model_name: "claude-3-5-sonnet-20241022",
description: "Anthropic's Claude Sonnet (2024-10-22)",
max_input_tokens: 2e5,
max_output_tokens: 4e3,
multimodal: true
},
"claude-3-5-sonnet-20240620": {
name: "Claude 3.5 Sonnet (2024-06-20)",
id: "claude-3.5-sonnet-20240620",
model_name: "claude-3.5-sonnet-20240620",
description: "Anthropic's Claude Sonnet (2024-06-20)",
max_input_tokens: 2e5,
max_output_tokens: 4e3,
multimodal: true
},
"claude-3-5-haiku-20241022": {
name: "Claude 3.5 Haiku (2024-10-22)",
id: "claude-3-5-haiku-20241022",
model_name: "claude-3-5-haiku-20241022",
description: "Anthropic's Claude Haiku (2024-10-22)",
max_input_tokens: 2e5,
max_output_tokens: 4e3
},
"claude-3-opus-20240229": {
name: "Claude 3 Opus (2024-02-29)",
id: "claude-3-opus-20240229",
model_name: "claude-3-opus-20240229",
description: "Anthropic's Claude Opus",
max_input_tokens: 2e5,
max_output_tokens: 4e3,
multimodal: true
},
"claude-3-haiku-20240307": {
name: "Claude 3 Haiku (2024-03-07)",
id: "claude-3-haiku-20240307",
model_name: "claude-3-haiku-20240307",
description: "Anthropic's Claude Haiku (2024-03-07)",
max_input_tokens: 2e5,
max_output_tokens: 4e3,
multimodal: true
},
"claude-3-sonnet-20240229": {
name: "Claude 3 Sonnet (2024-02-29)",
id: "claude-3-sonnet-20240229",
model_name: "claude-3-sonnet-20240229",
description: "Anthropic's Claude Sonnet",
max_input_tokens: 2e5,
max_output_tokens: 4e3,
multimodal: true
}
};
}
};
var SmartChatModelAnthropicRequestAdapter = class extends SmartChatModelRequestAdapter {
/**
* Convert request to Anthropic format
* @returns {Object} Request parameters in Anthropic format
*/
to_platform(streaming = false) {
return this.to_anthropic(streaming);
}
/**
* Convert request to Anthropic format
* @returns {Object} Request parameters in Anthropic format
*/
to_anthropic(streaming = false) {
this.anthropic_body = {
model: this.model,
max_tokens: this.max_tokens,
temperature: this.temperature,
stream: streaming
};
this.anthropic_body.messages = this._transform_messages_to_anthropic();
if (this.tools) {
this.anthropic_body.tools = this._transform_tools_to_anthropic();
}
if (this.tool_choice) {
if (this.tool_choice === "auto") {
this.anthropic_body.tool_choice = { type: "auto" };
} else if (typeof this.tool_choice === "object" && this.tool_choice.function) {
this.anthropic_body.tool_choice = { type: "tool", name: this.tool_choice.function.name };
}
}
return {
url: this.adapter.endpoint,
method: "POST",
headers: this.get_headers(),
body: JSON.stringify(this.anthropic_body)
};
}
/**
* Transform messages to Anthropic format
* @returns {Array<Object>} Messages in Anthropic format
* @private
*/
_transform_messages_to_anthropic() {
let anthropic_messages = [];
for (const message of this.messages) {
if (message.role === "system") {
if (!this.anthropic_body.system)
this.anthropic_body.system = "";
else
this.anthropic_body.system += "\n\n";
this.anthropic_body.system += Array.isArray(message.content) ? message.content.map((part) => part.text).join("\n") : message.content;
} else if (message.role === "tool") {
const msg = {
role: "user",
content: [
{
type: "tool_result",
tool_use_id: message.tool_call_id,
content: message.content
}
]
};
anthropic_messages.push(msg);
} else {
const msg = {
role: this._get_anthropic_role(message.role),
content: this._get_anthropic_content(message.content)
};
if (message.tool_calls?.length > 0)
msg.content = this._transform_tool_calls_to_content(message.tool_calls);
anthropic_messages.push(msg);
}
}
return anthropic_messages;
}
/**
* Transform tool calls to Anthropic format
* @param {Array<Object>} tool_calls - Tool calls
* @returns {Array<Object>} Tool calls in Anthropic format
* @private
*/
_transform_tool_calls_to_content(tool_calls) {
return tool_calls.map((tool_call) => ({
type: "tool_use",
id: tool_call.id,
name: tool_call.function.name,
input: JSON.parse(tool_call.function.arguments)
}));
}
/**
* Transform role to Anthropic format
* @param {string} role - Original role
* @returns {string} Role in Anthropic format
* @private
*/
_get_anthropic_role(role) {
const role_map = {
function: "assistant",
tool: "user"
};
return role_map[role] || role;
}
/**
* Transform content to Anthropic format
* @param {string|Array} content - Original content
* @returns {string|Array} Content in Anthropic format
* @private
*/
_get_anthropic_content(content) {
if (Array.isArray(content)) {
return content.map((item) => {
if (item.type === "text")
return { type: "text", text: item.text };
if (item.type === "image_url") {
return {
type: "image",
source: {
type: "base64",
media_type: item.image_url.url.split(";")[0].split(":")[1],
data: item.image_url.url.split(",")[1]
}
};
}
return item;
});
}
return content;
}
/**
* Transform tools to Anthropic format
* @returns {Array<Object>} Tools in Anthropic format
* @private
*/
_transform_tools_to_anthropic() {
if (!this.tools)
return void 0;
return this.tools.map((tool) => ({
name: tool.function.name,
description: tool.function.description,
input_schema: tool.function.parameters
}));
}
};
var SmartChatModelAnthropicResponseAdapter = class extends SmartChatModelResponseAdapter {
static get platform_res() {
return {
content: [],
id: "",
model: "",
role: "assistant",
stop_reason: null,
stop_sequence: null,
type: "message",
usage: {
input_tokens: 0,
output_tokens: 0
}
};
}
/**
* Convert response to OpenAI format
* @returns {Object} Response in OpenAI format
*/
to_openai() {
return {
id: this._res.id,
object: "chat.completion",
created: Date.now(),
choices: [
{
index: 0,
message: this._transform_message_to_openai(),
finish_reason: this._get_openai_finish_reason(this._res.stop_reason)
}
],
usage: this._transform_usage_to_openai()
};
}
/**
* Transform message to OpenAI format
* @returns {Object} Message in OpenAI format
* @private
*/
_transform_message_to_openai() {
const message = {
role: "assistant",
content: "",
tool_calls: []
};
if (Array.isArray(this._res.content)) {
for (const content of this._res.content) {
if (content.type === "text") {
message.content += (message.content ? "\n\n" : "") + content.text;
} else if (content.type === "tool_use") {
message.tool_calls.push({
id: content.id,
type: "function",
function: {
name: content.name,
arguments: JSON.stringify(content.input)
}
});
}
}
} else {
message.content = this._res.content;
}
if (message.tool_calls.length === 0) {
delete message.tool_calls;
}
return message;
}
/**
* Transform finish reason to OpenAI format
* @param {string} stop_reason - Original finish reason
* @returns {string} Finish reason in OpenAI format
* @private
*/
_get_openai_finish_reason(stop_reason) {
const reason_map = {
"end_turn": "stop",
"max_tokens": "length",
"tool_use": "function_call"
};
return reason_map[stop_reason] || stop_reason;
}
/**
* Transform usage statistics to OpenAI format
* @returns {Object} Usage statistics in OpenAI format
* @private
*/
_transform_usage_to_openai() {
if (!this._res.usage) {
return {
prompt_tokens: 0,
completion_tokens: 0,
total_tokens: 0
};
}
return {
prompt_tokens: this._res.usage.input_tokens || 0,
completion_tokens: this._res.usage.output_tokens || 0,
total_tokens: (this._res.usage.input_tokens || 0) + (this._res.usage.output_tokens || 0)
};
}
handle_chunk(chunk) {
if (!chunk.startsWith("data: "))
return;
chunk = JSON.parse(chunk.slice(6));
if (!this._res.content.length) {
this._res.content = [
{
type: "text",
text: ""
}
];
}
if (chunk.message?.id) {
this._res.id = chunk.message.id;
}
if (chunk.message?.model) {
this._res.model = chunk.message.model;
}
if (chunk.message?.role) {
this._res.role = chunk.message.role;
}
if (chunk.delta?.type === "text_delta") {
this._res.content[0].text += chunk.delta.text;
}
if (chunk.delta?.stop_reason) {
this._res.stop_reason = chunk.delta.stop_reason;
}
if (chunk.usage) {
this._res.usage = {
...this._res.usage,
...chunk.usage
};
}
}
};

var SmartChatModelOpenaiAdapter = class extends SmartChatModelApiAdapter {
static key = "openai";
static defaults = {
description: "OpenAI",
type: "API",
endpoint: "https://api.openai.com/v1/chat/completions",
streaming: true,
models_endpoint: "https://api.openai.com/v1/models",
default_model: "gpt-4o-mini",
signup_url: "https://platform.openai.com/api-keys",
can_use_tools: true
};
res_adapter = SmartChatModelOpenaiResponseAdapter;
/**
* Parse model data from OpenAI API response.
* Filters for GPT models and adds context window information.
* @param {Object} model_data - Raw model data from OpenAI
* @returns {Object} Map of model objects with capabilities and limits
*/
parse_model_data(model_data) {
return model_data.data.filter((model) => ["gpt-", "o1-"].some((m) => model.id.startsWith(m)) && !model.id.includes("-instruct")).reduce((acc, model) => {
const out = {
model_name: model.id,
id: model.id,
multimodal: model.id.includes("vision") || model.id.includes("gpt-4-turbo") || model.id.startsWith("gpt-4o"),
can_use_tools: model.id.startsWith("o1-") ? false : true
};
const m = Object.entries(model_context).find((m2) => m2[0] === model.id || model.id.startsWith(m2[0] + "-"));
if (m) {
out.max_input_tokens = m[1].context;
out.description = `context: ${m[1].context}, output: ${m[1].max_out}`;
}
acc[model.id] = out;
return acc;
}, {});
}
/**
* Override the HTTP method for fetching models.
*/
models_endpoint_method = "GET";
/**
* Test the API key by attempting to fetch models.
* @returns {Promise<boolean>} True if API key is valid
*/
async test_api_key() {
const models = await this.get_models();
return models.length > 0;
}
/**
* Get settings configuration for OpenAI adapter.
* Adds image resolution setting for multimodal models.
* @returns {Object} Settings configuration object
*/
get settings_config() {
const config = super.settings_config;
if (this.adapter?.model_config?.multimodal) {
config["[CHAT_ADAPTER].image_resolution"] = {
name: "Image Resolution",
type: "dropdown",
description: "Select the image resolution for the chat model.",
option_1: "low",
option_2: "high",
default: "low"
};
}
return config;
}
};
var SmartChatModelOpenaiResponseAdapter = class extends SmartChatModelResponseAdapter {
};
var model_context = {
"gpt-3.5-turbo-0125": {
"context": 16385,
"max_out": 4096
},
"gpt-3.5-turbo-0301": {
"context": 4097,
"max_out": 4097
},
"gpt-3.5-turbo-0613": {
"context": 4097,
"max_out": 4097
},
"gpt-3.5-turbo-1106": {
"context": 16385,
"max_out": 4096
},
"gpt-3.5-turbo-16k": {
"context": 16385,
"max_out": 16385
},
"gpt-3.5-turbo-16k-0613": {
"context": 16385,
"max_out": 16385
},
"gpt-4-0125-preview": {
"context": 128e3,
"max_out": 4096
},
"gpt-4-0314": {
"context": 8192,
"max_out": 8192
},
"gpt-4-0613": {
"context": 8192,
"max_out": 8192
},
"gpt-4-1106-preview": {
"context": 128e3,
"max_out": 4096
},
"gpt-4-1106-vision-preview": {
"context": 128e3,
"max_out": 4096
},
"gpt-4-32k-0314": {
"context": 32768,
"max_out": 32768
},
"gpt-4-32k-0613": {
"context": 32768,
"max_out": 32768
},
"gpt-4-turbo-2024-04-09": {
"context": 128e3,
"max_out": 4096
},
"gpt-4-turbo-preview": {
"context": 128e3,
"max_out": 4096
},
"gpt-4-vision-preview": {
"context": 128e3,
"max_out": 4096
},
"gpt-3.5-turbo": {
"context": 16385,
"max_out": 4096
},
"gpt-4-turbo": {
"context": 128e3,
"max_out": 4096
},
"gpt-4-32k": {
"context": 32768,
"max_out": 32768
},
"gpt-4o": {
"context": 128e3,
"max_out": 4096
},
"gpt-4": {
"context": 8192,
"max_out": 8192
}
};

var SmartChatModelAzureAdapter = class extends SmartChatModelOpenaiAdapter {
static key = "azure";
static defaults = {
description: "Azure OpenAI",
type: "API",
adapter: "AzureOpenAI",
streaming: true,
api_key_header: "api-key",
azure_resource_name: "",
azure_deployment_name: "",
azure_api_version: "2024-10-01-preview",
default_model: "gpt-35-turbo",
signup_url: "https://learn.microsoft.com/azure/cognitive-services/openai/quickstart?tabs=command-line",
models_endpoint: "https://{azure_resource_name}.openai.azure.com/openai/deployments?api-version={azure_api_version}",
can_use_tools: true
};
/**
* Override the settings configuration to include Azure-specific fields.
*/
get settings_config() {
return {
...super.settings_config,
"[CHAT_ADAPTER].azure_resource_name": {
name: "Azure Resource Name",
type: "text",
description: "The name of your Azure OpenAI resource (e.g. 'my-azure-openai').",
default: ""
},
"[CHAT_ADAPTER].azure_deployment_name": {
name: "Azure Deployment Name",
type: "text",
description: "The name of your specific model deployment (e.g. 'gpt35-deployment').",
default: ""
},
"[CHAT_ADAPTER].azure_api_version": {
name: "Azure API Version",
type: "text",
description: "The API version for Azure OpenAI (e.g. '2024-10-01-preview').",
default: "2024-10-01-preview"
}
};
}
/**
* Build the endpoint dynamically based on Azure settings.
* Example:
*  https://<RESOURCE>.openai.azure.com/openai/deployments/<DEPLOYMENT>/chat/completions?api-version=2023-05-15
*/
get endpoint() {
const { azure_resource_name, azure_deployment_name, azure_api_version } = this.adapter_config;
return `https://${azure_resource_name}.openai.azure.com/openai/deployments/${azure_deployment_name}/chat/completions?api-version=${azure_api_version}`;
}
/**
* For streaming, we can reuse the same endpoint.
* The request body includes `stream: true` which the base class uses.
*/
get endpoint_streaming() {
return this.endpoint;
}
/**
* The models endpoint for retrieving a list of your deployments.
* E.g.:
*   https://<RESOURCE>.openai.azure.com/openai/deployments?api-version=2023-05-15
*/
get models_endpoint() {
const { azure_resource_name, azure_api_version } = this.adapter_config;
return `https://${azure_resource_name}.openai.azure.com/openai/deployments?api-version=${azure_api_version}`;
}
/**
* Azure returns a list of deployments in the shape:
* {
*   "object": "list",
*   "data": [
*     {
*       "id": "mydeployment",
*       "model": "gpt-35-turbo",
*       "status": "succeeded",
*       "createdAt": ...
*       "updatedAt": ...
*       ...
*     },
*     ...
*   ]
* }
* We'll parse them into a dictionary keyed by deployment ID.
*/
parse_model_data(model_data) {
if (model_data.object !== "list" || !Array.isArray(model_data.data)) {
return { "_": { id: "No deployments found." } };
}
const parsed = {};
for (const d of model_data.data) {
parsed[d.id] = {
model_name: d.id,
id: d.id,
raw: d,
description: `Model: ${d.model}, Status: ${d.status}`,
max_input_tokens: 4e3
};
}
return parsed;
}
/**
* Validate the Azure configuration fields.
*/
validate_config() {
const { azure_resource_name, azure_deployment_name, azure_api_version } = this.adapter_config;
if (!azure_resource_name) {
return { valid: false, message: "Azure resource name is missing." };
}
if (!azure_deployment_name) {
return { valid: false, message: "Azure deployment name is missing." };
}
if (!azure_api_version) {
return { valid: false, message: "Azure API version is missing." };
}
if (!this.api_key) {
return { valid: false, message: "Azure OpenAI API key is missing." };
}
return { valid: true, message: "Configuration is valid." };
}
};

var SmartChatModelGeminiAdapter = class extends SmartChatModelApiAdapter {
static key = "gemini";
static defaults = {
description: "Google Gemini",
type: "API",
api_key_header: "none",
endpoint: "https://generativelanguage.googleapis.com/v1beta/models/MODEL_NAME:generateContent",
endpoint_streaming: "https://generativelanguage.googleapis.com/v1beta/models/MODEL_NAME:streamGenerateContent",
streaming: true,
adapter: "Gemini",
models_endpoint: "https://generativelanguage.googleapis.com/v1beta/models",
default_model: "gemini-1.5-pro",
signup_url: "https://ai.google.dev/",
can_use_tools: true
};
streaming_chunk_splitting_regex = /(\r\n|\n|\r){2}/g;
/**
* Get request adapter class
*/
req_adapter = SmartChatModelGeminiRequestAdapter;
/**
* Get response adapter class
*/
res_adapter = SmartChatModelGeminiResponseAdapter;
/**
* Uses Gemini's dedicated token counting endpoint
*/
async count_tokens(input) {
const req = {
url: `https://generativelanguage.googleapis.com/v1beta/models/${this.model_key}:countTokens?key=${this.api_key}`,
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(this.prepare_token_count_body(input))
};
const resp = await this.http_adapter.request(req);
return resp.json.totalTokens;
}
/**
* Formats input for token counting based on type
* @private
*/
prepare_token_count_body(input) {
if (typeof input === "string") {
return { contents: [{ parts: [{ text: input }] }] };
} else if (Array.isArray(input)) {
return { contents: input.map((msg) => this.transform_message_for_token_count(msg)) };
} else if (typeof input === "object") {
return { contents: [this.transform_message_for_token_count(input)] };
}
throw new Error("Invalid input for count_tokens");
}
/**
* Transforms message for token counting, handling text and images
* @private
*/
transform_message_for_token_count(message) {
return {
role: message.role === "assistant" ? "model" : message.role,
parts: Array.isArray(message.content) ? message.content.map((part) => {
if (part.type === "text")
return { text: part.text };
if (part.type === "image_url")
return {
inline_data: {
mime_type: part.image_url.url.split(";")[0].split(":")[1],
data: part.image_url.url.split(",")[1]
}
};
return part;
}) : [{ text: message.content }]
};
}
/**
* Builds endpoint URLs with model and API key
*/
get endpoint() {
return `https://generativelanguage.googleapis.com/v1beta/models/${this.model_key}:generateContent?key=${this.api_key}`;
}
get endpoint_streaming() {
return `https://generativelanguage.googleapis.com/v1beta/models/${this.model_key}:streamGenerateContent?key=${this.api_key}`;
}
/**
* Get models endpoint URL with API key
* @returns {string} Complete models endpoint URL
*/
get models_endpoint() {
return `${this.constructor.defaults.models_endpoint}?key=${this.api_key}`;
}
/**
* Get HTTP method for models endpoint
* @returns {string} HTTP method ("GET")
*/
get models_endpoint_method() {
return "GET";
}
get models_request_params() {
return {
url: this.models_endpoint,
method: this.models_endpoint_method
};
}
/**
* Parse model data from Gemini API response
* @param {Object} model_data - Raw model data from API
* @returns {Object} Map of model objects with capabilities and limits
*/
parse_model_data(model_data) {
return model_data.models.filter((model) => model.name.startsWith("models/gemini")).reduce((acc, model) => {
const out = {
model_name: model.name.split("/").pop(),
id: model.name.split("/").pop(),
max_input_tokens: model.inputTokenLimit,
max_output_tokens: model.maxOutputTokens,
description: model.description,
multimodal: model.name.includes("vision") || model.description.includes("multimodal"),
raw: model
};
acc[model.name.split("/").pop()] = out;
return acc;
}, {});
}
is_end_of_stream(event) {
return event.data.includes('"finishReason"');
return false;
}
};
var SmartChatModelGeminiRequestAdapter = class extends SmartChatModelRequestAdapter {
to_platform(streaming = false) {
return this.to_gemini(streaming);
}
to_gemini(streaming = false) {
const gemini_body = {
contents: this._transform_messages_to_gemini(),
generationConfig: {
temperature: this.temperature,
maxOutputTokens: this.max_tokens,
topK: this._req.topK || 1,
topP: this._req.topP || 1,
stopSequences: this._req.stop || []
},
safetySettings: [
{
category: "HARM_CATEGORY_HARASSMENT",
threshold: "BLOCK_NONE"
},
{
category: "HARM_CATEGORY_HATE_SPEECH",
threshold: "BLOCK_NONE"
},
{
category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
threshold: "BLOCK_NONE"
},
{
category: "HARM_CATEGORY_DANGEROUS_CONTENT",
threshold: "BLOCK_NONE"
}
]
};
if (this.tools)
gemini_body.tools = this._transform_tools_to_gemini();
if (gemini_body.tools && this.tool_choice !== "none")
gemini_body.tool_config = this._transform_tool_choice_to_gemini();
return {
url: streaming ? this.adapter.endpoint_streaming : this.adapter.endpoint,
method: "POST",
headers: this.get_headers(),
body: JSON.stringify(gemini_body)
};
}
_transform_messages_to_gemini() {
let gemini_messages = [];
let system_message = "";
for (const message of this.messages) {
if (message.role === "system") {
system_message += message.content + "\n";
} else {
gemini_messages.push({
role: this._get_gemini_role(message.role),
parts: this._transform_content_to_gemini(message.content)
});
}
}
if (system_message) {
gemini_messages.unshift({
role: "user",
parts: [{ text: system_message.trim() }]
});
}
return gemini_messages;
}
_get_gemini_role(role) {
const role_map = {
user: "user",
assistant: "model",
function: "model"
};
return role_map[role] || role;
}
_transform_content_to_gemini(content) {
if (Array.isArray(content)) {
return content.map((part) => {
if (part.type === "text")
return { text: part.text };
if (part.type === "image_url") {
return {
inline_data: {
mime_type: part.image_url.url.split(";")[0].split(":")[1],
data: part.image_url.url.split(",")[1]
}
};
}
return part;
});
}
return [{ text: content }];
}
_transform_tools_to_gemini() {
return [{
function_declarations: this.tools.map((tool) => ({
name: tool.function.name,
description: tool.function.description,
parameters: tool.function.parameters
}))
}];
}
_transform_tool_choice_to_gemini() {
return {
function_calling_config: {
mode: "ANY",
allowed_function_names: this.tools.map((tool) => tool.function.name)
}
};
}
};
var SmartChatModelGeminiResponseAdapter = class extends SmartChatModelResponseAdapter {
static get platform_res() {
return {
candidates: [{
content: {
parts: [
{
text: ""
}
],
role: ""
},
finishReason: ""
}],
promptFeedback: {},
usageMetadata: {}
};
}
to_openai() {
const first_candidate = this._res.candidates[0];
if (!this._res.id)
this._res.id = "gemini-" + Date.now().toString();
return {
id: this._res.id,
object: "chat.completion",
created: Date.now(),
model: this.adapter.model_key,
choices: [{
index: 0,
message: first_candidate?.content ? this._transform_message_to_openai(first_candidate.content) : "",
finish_reason: this._get_openai_finish_reason(first_candidate.finishReason)
}],
usage: this._transform_usage_to_openai()
};
}
_transform_message_to_openai(content) {
const message = {
role: "assistant",
content: content.parts.filter((part) => part.text).map((part) => part.text).join("")
};
const function_call = content.parts.find((part) => part.functionCall);
if (function_call) {
message.tool_calls = [{
type: "function",
function: {
name: function_call.functionCall.name,
arguments: JSON.stringify(function_call.functionCall.args)
}
}];
}
return message;
}
_get_openai_finish_reason(finish_reason) {
const reason_map = {
"STOP": "stop",
"MAX_TOKENS": "length",
"SAFETY": "content_filter",
"RECITATION": "content_filter",
"OTHER": "null"
};
return reason_map[finish_reason] || finish_reason.toLowerCase();
}
_transform_usage_to_openai() {
if (!this._res.usageMetadata) {
return {
prompt_tokens: null,
completion_tokens: null,
total_tokens: null
};
}
return {
prompt_tokens: this._res.usageMetadata.promptTokenCount || null,
completion_tokens: this._res.usageMetadata.candidatesTokenCount || null,
total_tokens: this._res.usageMetadata.totalTokenCount || null
};
}
handle_chunk(chunk) {
console.log("handle_chunk", chunk);
let chunk_trimmed = chunk.trim();
if (["[", ","].includes(chunk_trimmed[0]))
chunk_trimmed = chunk_trimmed.slice(1);
if (["]", ","].includes(chunk_trimmed[chunk_trimmed.length - 1]))
chunk_trimmed = chunk_trimmed.slice(0, -1);
const data = JSON.parse(chunk_trimmed);
if (data.candidates?.[0]?.content?.parts?.[0]?.text?.length) {
this._res.candidates[0].content.parts[0].text += data.candidates[0].content.parts[0].text;
}
if (data.candidates?.[0]?.content?.role?.length) {
this._res.candidates[0].content.role = data.candidates[0].content.role;
}
if (data.candidates?.[0]?.finishReason?.length) {
this._res.candidates[0].finishReason += data.candidates[0].finishReason;
}
if (data.promptFeedback) {
this._res.promptFeedback = {
...this._res.promptFeedback || {},
...data.promptFeedback
};
}
if (data.usageMetadata) {
this._res.usageMetadata = {
...this._res.usageMetadata || {},
...data.usageMetadata
};
}
}
};

var SmartChatModelOpenRouterAdapter = class extends SmartChatModelApiAdapter {
static key = "open_router";
static defaults = {
description: "Open Router",
type: "API",
endpoint: "https://openrouter.ai/api/v1/chat/completions",
streaming: true,
adapter: "OpenRouter",
models_endpoint: "https://openrouter.ai/api/v1/models",
default_model: "mistralai/mistral-7b-instruct:free",
signup_url: "https://accounts.openrouter.ai/sign-up?redirect_url=https%3A%2F%2Fopenrouter.ai%2Fkeys",
can_use_tools: true
};
/**
* Get request adapter class
* @returns {typeof SmartChatModelOpenRouterRequestAdapter} Request adapter class
*/
get req_adapter() {
return SmartChatModelOpenRouterRequestAdapter;
}
/**
* Get response adapter class
* @returns {typeof SmartChatModelOpenRouterResponseAdapter} Response adapter class
*/
get res_adapter() {
return SmartChatModelOpenRouterResponseAdapter;
}
/**
* Get API key from various sources
* @returns {string|undefined} API key if available
*/
get api_key() {
return this.main.opts.api_key || this.adapter_settings?.api_key || process.env.DEFAULT_OPEN_ROUTER_API_KEY;
}
/**
* Count tokens in input text (rough estimate)
* @param {string|Object} input - Text to count tokens for
* @returns {Promise<number>} Estimated token count
*/
async count_tokens(input) {
const text = typeof input === "string" ? input : JSON.stringify(input);
return Math.ceil(text.length / 4);
}
get models_request_params() {
return {
url: this.models_endpoint,
method: "GET"
};
}
/**
* Parse model data from OpenRouter API response
* @param {Object} model_data - Raw model data
* @returns {Object} Map of model objects with capabilities and limits
*/
parse_model_data(model_data) {
if (model_data.data) {
model_data = model_data.data;
}
if (model_data.error)
throw new Error(model_data.error);
console.log("model_data", model_data);
return model_data.reduce((acc, model) => {
acc[model.id] = {
model_name: model.id,
id: model.id,
max_input_tokens: model.context_length,
description: model.name,
can_use_tools: model.description.includes("tool use") || model.description.includes("function call"),
multimodal: model.architecture.modality === "multimodal",
raw: model
};
return acc;
}, {});
}
};
var SmartChatModelOpenRouterRequestAdapter = class extends SmartChatModelRequestAdapter {
to_platform(stream = false) {
const req = this.to_openai(stream);
return req;
}
_get_openai_content(message) {
if (message.role === "user") {
if (Array.isArray(message.content) && message.content.every((part) => part.type === "text")) {
return message.content.map((part) => part.text).join("\n");
}
}
return message.content;
}
};
var SmartChatModelOpenRouterResponseAdapter = class extends SmartChatModelResponseAdapter {
static get platform_res() {
return {
id: "",
object: "chat.completion",
created: 0,
model: "",
choices: [],
usage: {}
};
}
to_platform() {
return this.to_openai();
}
get object() {
return "chat.completion";
}
get error() {
if (!this._res.error)
return null;
const error = this._res.error;
if (!error.message)
error.message = "";
if (this._res.error.metadata?.raw) {
if (typeof this._res.error.metadata.raw === "string") {
error.message += `

${this._res.error.metadata.raw}`;
} else {
error.message += `

${JSON.stringify(this._res.error.metadata.raw, null, 2)}`;
}
}
return error;
}
};

var SmartChatModelLmStudioAdapter = class extends SmartChatModelApiAdapter {
static key = "lm_studio";
static defaults = {
description: "LM Studio (OpenAI-compatible)",
type: "API",
endpoint: "http://localhost:1234/v1/chat/completions",
streaming: true,
adapter: "LM_Studio_OpenAI_Compat",
models_endpoint: "http://localhost:1234/v1/models",
default_model: "gpt-4o-mini",
signup_url: "https://lmstudio.ai/docs/api/openai-api",
can_use_tools: true
};
/**
* Request adapter class
*/
get req_adapter() {
return SmartChatModelLmStudioRequestAdapter;
}
/**
* Response adapter class
*/
get res_adapter() {
return SmartChatModelLmStudioResponseAdapter;
}
/**
* Validate parameters for getting models
* @returns {boolean} True
*/
validate_get_models_params() {
return true;
}
/**
* LM Studio's /v1/models returns OpenAI-like response format:
* {
*   "object": "list",
*   "data": [
*     { "id": "model-name", "object": "model", ... },
*     ...
*   ]
* }
* Parse this like the OpenAI format.
* @param {Object} model_data - Raw model data from LM Studio
* @returns {Object} Map of model objects
*/
parse_model_data(model_data) {
if (model_data.object !== "list" || !Array.isArray(model_data.data)) {
return { "_": { id: "No models found." } };
}
const parsed = {};
for (const m of model_data.data) {
parsed[m.id] = {
id: m.id,
model_name: m.id,
description: `LM Studio model: ${m.id}`,
multimodal: false
};
}
return parsed;
}
get models_endpoint_method() {
return "get";
}
/**
* Count tokens in input text (no dedicated endpoint)
* Rough estimate: 1 token ~ 4 chars
* @param {string|Object} input
* @returns {Promise<number>}
*/
async count_tokens(input) {
const text = typeof input === "string" ? input : JSON.stringify(input);
return Math.ceil(text.length / 4);
}
/**
* Test API key - LM Studio doesn't require API key. Always true.
* @returns {Promise<boolean>}
*/
async test_api_key() {
return true;
}
/**
* Validate configuration
*/
validate_config() {
if (!this.adapter_config.model_key) {
return { valid: false, message: "No model selected." };
}
return { valid: true, message: "Configuration is valid." };
}
};
var SmartChatModelLmStudioRequestAdapter = class extends SmartChatModelRequestAdapter {
to_platform(streaming = false) {
const req = this.to_openai(streaming);
const body = JSON.parse(req.body);
if (this.tool_choice?.function?.name) {
if (typeof body.messages[body.messages.length - 1].content === "string") {
body.messages[body.messages.length - 1].content = [
{
type: "text",
text: body.messages[body.messages.length - 1].content
}
];
}
body.messages[body.messages.length - 1].content.push({
type: "text",
text: `Use the "${this.tool_choice.function.name}" tool.`
});
}
req.body = JSON.stringify(body);
return req;
}
};
var SmartChatModelLmStudioResponseAdapter = class extends SmartChatModelResponseAdapter {
};

var SmartChatModelOllamaAdapter = class extends SmartChatModelApiAdapter {
static key = "ollama";
static defaults = {
description: "Ollama (Local)",
type: "API",
models_endpoint: "http://localhost:11434/api/tags",
endpoint: "http://localhost:11434/api/chat",
api_key: "na",
streaming: true
};
req_adapter = SmartChatModelOllamaRequestAdapter;
res_adapter = SmartChatModelOllamaResponseAdapter;
/**
* Get parameters for models request - no auth needed for local instance
* @returns {Object} Request parameters
*/
get models_request_params() {
return {
url: this.adapter_config.models_endpoint
};
}
/**
* Get available models from local Ollama instance
* @param {boolean} [refresh=false] - Whether to refresh cached models
* @returns {Promise<Object>} Map of model objects
*/
async get_models(refresh = false) {
console.log("get_models", refresh);
if (!refresh && this.adapter_config?.models && typeof this.adapter_config.models === "object" && Object.keys(this.adapter_config.models).length > 0)
return this.adapter_config.models;
try {
console.log("models_request_params", this.models_request_params);
const list_resp = await this.http_adapter.request(this.models_request_params);
console.log("list_response", list_resp);
const list_data = await list_resp.json();
const models_raw_data = [];
for (const model of list_data.models) {
const model_details_resp = await this.http_adapter.request({
url: `http://localhost:11434/api/show`,
method: "POST",
body: JSON.stringify({ model: model.name })
});
console.log("model_details_response", model_details_resp);
const model_details_data = await model_details_resp.json();
console.log("model_details_data", model_details_data);
models_raw_data.push({ ...model_details_data, name: model.name });
}
const model_data = this.parse_model_data(models_raw_data);
console.log("model_data", model_data);
this.adapter_settings.models = model_data;
this.model.re_render_settings();
return model_data;
} catch (error) {
console.error("Failed to fetch model data:", error);
return { "_": { id: `Failed to fetch models from ${this.model.adapter_name}` } };
}
}
/**
* Parse model data from Ollama API response
* @param {Object[]} model_data - Raw model data from Ollama
* @returns {Object} Map of model objects with capabilities and limits
*/
parse_model_data(model_data) {
return model_data.reduce((acc, model) => {
const out = {
model_name: model.name,
id: model.name,
multimodal: false,
max_input_tokens: Object.entries(model.model_info).find((m) => m[0].includes(".context_length"))[1],
can_use_tools: true
};
acc[model.name] = out;
return acc;
}, {});
}
/**
* Override settings config to remove API key setting since not needed for local instance
* @returns {Object} Settings configuration object
*/
get settings_config() {
const config = super.settings_config;
delete config["[CHAT_ADAPTER].api_key"];
return config;
}
is_end_of_stream(event) {
return event.data.includes('"done_reason"');
}
};
var SmartChatModelOllamaRequestAdapter = class extends SmartChatModelRequestAdapter {
/**
* Convert request to Ollama format
* @returns {Object} Request parameters in Ollama format
*/
to_platform(streaming = false) {
const ollama_body = {
model: this.model,
messages: this._transform_messages_to_ollama(),
options: this._transform_parameters_to_ollama(),
stream: streaming || this.stream
};
if (this.tools) {
ollama_body.tools = this._transform_functions_to_tools();
if (this.tool_choice?.function?.name) {
ollama_body.messages[ollama_body.messages.length - 1].content += `

Use the "${this.tool_choice.function.name}" tool.`;
ollama_body.format = "json";
}
}
return {
url: this.adapter.endpoint,
method: "POST",
body: JSON.stringify(ollama_body)
};
}
/**
* Transform messages to Ollama format
* @returns {Array} Messages in Ollama format
* @private
*/
_transform_messages_to_ollama() {
return this.messages.map((message) => {
const ollama_message = {
role: message.role,
content: this._transform_content_to_ollama(message.content)
};
const images = this._extract_images_from_content(message.content);
if (images.length > 0) {
ollama_message.images = images;
}
return ollama_message;
});
}
/**
* Transform content to Ollama format
* @param {string|Array} content - Message content
* @returns {string} Content in Ollama format
* @private
*/
_transform_content_to_ollama(content) {
if (Array.isArray(content)) {
return content.filter((item) => item.type === "text").map((item) => item.text).join("\n");
}
return content;
}
/**
* Extract images from content
* @param {string|Array} content - Message content
* @returns {Array} Array of image URLs
* @private
*/
_extract_images_from_content(content) {
if (!Array.isArray(content))
return [];
return content.filter((item) => item.type === "image_url").map((item) => item.image_url.url);
}
/**
* Transform functions to tools format
* @returns {Array} Tools array in Ollama format
* @private
*/
_transform_functions_to_tools() {
return this.tools;
}
/**
* Transform parameters to Ollama options format
* @returns {Object} Options in Ollama format
* @private
*/
_transform_parameters_to_ollama() {
const options = {};
if (this.max_tokens)
options.num_predict = this.max_tokens;
if (this.temperature)
options.temperature = this.temperature;
if (this.top_p)
options.top_p = this.top_p;
if (this.frequency_penalty)
options.frequency_penalty = this.frequency_penalty;
if (this.presence_penalty)
options.presence_penalty = this.presence_penalty;
return options;
}
};
var SmartChatModelOllamaResponseAdapter = class extends SmartChatModelResponseAdapter {
static get platform_res() {
return {
model: "",
created_at: null,
message: {
role: "",
content: ""
},
total_duration: 0,
load_duration: 0,
prompt_eval_count: 0,
prompt_eval_duration: 0,
eval_count: 0,
eval_duration: 0
};
}
/**
* Convert response to OpenAI format
* @returns {Object} Response in OpenAI format
*/
to_openai() {
return {
id: this._res.created_at,
object: "chat.completion",
created: Date.now(),
model: this._res.model,
choices: [
{
index: 0,
message: this._transform_message_to_openai(),
finish_reason: this._res.done_reason
}
],
usage: this._transform_usage_to_openai()
};
}
/**
* Transform message to OpenAI format
* @returns {Object} Message in OpenAI format
* @private
*/
_transform_message_to_openai() {
return {
role: this._res.message.role,
content: this._res.message.content,
tool_calls: this._res.message.tool_calls
};
}
/**
* Transform usage statistics to OpenAI format
* @returns {Object} Usage statistics in OpenAI format
* @private
*/
_transform_usage_to_openai() {
return {
prompt_tokens: this._res.prompt_eval_count || 0,
completion_tokens: this._res.eval_count || 0,
total_tokens: (this._res.prompt_eval_count || 0) + (this._res.eval_count || 0)
};
}
/**
* Parse chunk adds delta to content as expected output format
*/
handle_chunk(chunk) {
chunk = JSON.parse(chunk || "{}");
if (chunk.created_at && !this._res.created_at) {
this._res.created_at = chunk.created_at;
}
if (chunk.message?.content) {
this._res.message.content += chunk.message.content;
}
if (chunk.message?.role) {
this._res.message.role = chunk.message.role;
}
if (chunk.model) {
this._res.model = chunk.model;
}
if (chunk.message?.tool_calls) {
if (!this._res.message.tool_calls) {
this._res.message.tool_calls = [{
id: "",
type: "function",
function: {
name: "",
arguments: ""
}
}];
}
if (chunk.message.tool_calls[0].id) {
this._res.message.tool_calls[0].id += chunk.message.tool_calls[0].id;
}
if (chunk.message.tool_calls[0].function.name) {
this._res.message.tool_calls[0].function.name += chunk.message.tool_calls[0].function.name;
}
if (chunk.message.tool_calls[0].function.arguments) {
this._res.message.tool_calls[0].function.arguments += chunk.message.tool_calls[0].function.arguments;
}
}
}
};

var adapters_map = {
"openai": {
req: SmartChatModelRequestAdapter,
res: SmartChatModelResponseAdapter
},
"anthropic": {
req: SmartChatModelAnthropicRequestAdapter,
res: SmartChatModelAnthropicResponseAdapter
},
"gemini": {
req: SmartChatModelGeminiRequestAdapter,
res: SmartChatModelGeminiResponseAdapter
},
"lm_studio": {
req: SmartChatModelLmStudioRequestAdapter,
res: SmartChatModelLmStudioResponseAdapter
},
"ollama": {
req: SmartChatModelOllamaRequestAdapter,
res: SmartChatModelOllamaResponseAdapter
}
};
var SmartChatModelCustomAdapter = class extends SmartChatModelApiAdapter {
static key = "custom";
static defaults = {
description: "Custom API (Local or Remote, OpenAI format)",
type: "API",
/**
* new default property: 'api_adapter' indicates which
* request/response adapter set to use internally
*/
api_adapter: "openai"
};
/**
* Provide dynamic request/response classes
* based on current adapter_config.api_adapter setting
* ----------------------------------------------------
*/
/**
* @override
* @returns {typeof SmartChatModelRequestAdapter}
*/
get req_adapter() {
const adapter_name = this.adapter_config.api_adapter || "openai";
const map_entry = adapters_map[adapter_name];
return map_entry && map_entry.req ? map_entry.req : SmartChatModelRequestAdapter;
}
/**
* @override
* @returns {typeof SmartChatModelResponseAdapter}
*/
get res_adapter() {
const adapter_name = this.adapter_config.api_adapter || "openai";
const map_entry = adapters_map[adapter_name];
return map_entry && map_entry.res ? map_entry.res : SmartChatModelResponseAdapter;
}
/**
* Synthesize a custom endpoint from the config fields.
* All fields are optional; fallback to a minimal default.
* @returns {string}
*/
get endpoint() {
const protocol = this.adapter_config.protocol || "http";
const hostname = this.adapter_config.hostname || "localhost";
const port = this.adapter_config.port ? `:${this.adapter_config.port}` : "";
let path = this.adapter_config.path || "";
if (path && !path.startsWith("/"))
path = `/${path}`;
return `${protocol}://${hostname}${port}${path}`;
}
get_adapters_as_options() {
return Object.keys(adapters_map).map((adapter_name) => ({ value: adapter_name, name: adapter_name }));
}
/**
* Provide custom settings for configuring
* the user-defined fields plus the new 'api_adapter'.
* @override
* @returns {Object} settings configuration
*/
get settings_config() {
return {
/**
* Select which specialized request/response adapter
* you'd like to use for your custom endpoint.
*/
"[CHAT_ADAPTER].api_adapter": {
name: "API Adapter",
type: "dropdown",
description: "Pick a built-in or external adapter to parse request/response data.",
options_callback: "adapter.get_adapters_as_options",
default: "openai"
},
"[CHAT_ADAPTER].id": {
name: "Model Name",
type: "text",
description: "Enter the model name for your endpoint if needed."
},
"[CHAT_ADAPTER].protocol": {
name: "Protocol",
type: "text",
description: "e.g. http or https"
},
"[CHAT_ADAPTER].hostname": {
name: "Hostname",
type: "text",
description: "e.g. localhost or some.remote.host"
},
"[CHAT_ADAPTER].port": {
name: "Port",
type: "number",
description: "Port number or leave blank"
},
"[CHAT_ADAPTER].path": {
name: "Path",
type: "text",
description: "Path portion of the URL (leading slash optional)"
},
"[CHAT_ADAPTER].streaming": {
name: "Streaming",
type: "toggle",
description: "Enable streaming if your API supports it."
},
"[CHAT_ADAPTER].max_input_tokens": {
name: "Max Input Tokens",
type: "number",
description: "Max number of tokens your model can handle in the prompt."
},
"[CHAT_ADAPTER].api_key": {
name: "API Key",
type: "password",
description: "If your service requires an API key, add it here."
}
};
}
/**
* Return 'true' for get_models params since user might
* not rely on auto-populating.
* @override
* @returns {true}
*/
validate_get_models_params() {
return true;
}
/**
* Unlike most API-based adapters, we do NOT force the user to have model_key set.
* So we override validate_config() to skip the "No model selected" error.
* Since this is a custom adapter, the onus is on the user to configure it correctly.
* @override
* @returns {Object} { valid: boolean, message: string }
*/
validate_config() {
return { valid: true, message: "Configuration is valid." };
}
};

var SmartChatModelGroqAdapter = class extends SmartChatModelApiAdapter {
static key = "groq";
static defaults = {
description: "Groq",
type: "API",
endpoint: "https://api.groq.com/openai/v1/chat/completions",
streaming: true,
adapter: "Groq",
models_endpoint: "https://api.groq.com/openai/v1/models",
default_model: "llama3-8b-8192",
signup_url: "https://groq.com",
can_use_tools: true
};
/**
* Request adapter class
* @returns {typeof SmartChatModelGroqRequestAdapter}
*/
get req_adapter() {
return SmartChatModelGroqRequestAdapter;
}
/**
* Response adapter class
* @returns {typeof SmartChatModelGroqResponseAdapter}
*/
get res_adapter() {
return SmartChatModelGroqResponseAdapter;
}
/**
* Retrieve the list of models from Groq's API.
* @returns {Promise<Object>} A dictionary of models keyed by their id
*/
async get_models(refresh = false) {
if (!refresh && this.adapter_config?.models && Object.keys(this.adapter_config.models).length > 0) {
return this.adapter_config.models;
}
const request_params = {
url: this.models_endpoint,
method: "GET",
headers: {
"Authorization": `Bearer ${this.api_key}`
}
};
try {
const resp = await this.http_adapter.request(request_params);
const data = await resp.json();
const model_data = this.parse_model_data(data);
this.adapter_settings.models = model_data;
this.model.re_render_settings();
return model_data;
} catch (error) {
console.error("Failed to fetch Groq model data:", error);
return { "_": { id: "Failed to fetch models from Groq" } };
}
}
/**
* Parse model data from Groq API format to a dictionary keyed by model ID.
* The API returns a list of model objects like:
* {
*   "object": "list",
*   "data": [ { "id": "...", "object": "model", ... }, ... ]
* }
*
* We'll convert each model to:
* {
*   model_name: model.id,
*   id: model.id,
*   max_input_tokens: model.context_window,
*   description: `Owned by: ${model.owned_by}, context: ${model.context_window}`,
*   multimodal: Check if model name or description suggests multimodality
* }
*/
parse_model_data(model_data) {
if (model_data.object !== "list" || !Array.isArray(model_data.data)) {
return { "_": { id: "No models found." } };
}
const parsed = {};
for (const m of model_data.data) {
parsed[m.id] = {
model_name: m.id,
id: m.id,
max_input_tokens: m.context_window || 8192,
description: `Owned by: ${m.owned_by}, context: ${m.context_window}`,
multimodal: m.id.includes("vision")
};
}
return parsed;
}
/**
* Validate configuration for Groq
* @returns {Object} { valid: boolean, message: string }
*/
validate_config() {
if (!this.adapter_config.model_key)
return { valid: false, message: "No model selected." };
if (!this.api_key) {
return { valid: false, message: "API key is missing." };
}
return { valid: true, message: "Configuration is valid." };
}
};
var SmartChatModelGroqRequestAdapter = class extends SmartChatModelRequestAdapter {
_get_openai_content(message) {
if (["assistant", "tool"].includes(message.role)) {
if (Array.isArray(message.content)) {
return message.content.map((part) => {
if (typeof part === "string")
return part;
if (part?.text)
return part.text;
return "";
}).join("\n");
}
}
return message.content;
}
};
var SmartChatModelGroqResponseAdapter = class extends SmartChatModelResponseAdapter {
};

var SmartHttpRequest2 = class {
/**
* @param {object} opts - Options for the SmartHttpRequest class
* @param {SmartHttpRequestAdapter} opts.adapter - The adapter constructor to use for making HTTP requests
* @param {Obsidian.requestUrl} opts.obsidian_request_adapter - For use with Obsidian adapter
*/
constructor(opts = {}) {
this.opts = opts;
if (!opts.adapter)
throw new Error("HttpRequestAdapter is required");
this.adapter = new opts.adapter(this);
}
/**
* Returns a well-formed response object
* @param {object} request_params - Parameters for the HTTP request
* @param {string} request_params.url - The URL to make the request to
* @param {string} [request_params.method='GET'] - The HTTP method to use
* @param {object} [request_params.headers] - Headers to include in the request
* @param {*} [request_params.body] - The body of the request (for POST, PUT, etc.)
* @returns {SmartHttpResponseAdapter} instance of the SmartHttpResponseAdapter class
* @example
* const response = await smart_http_request.request({
*   url: 'https://api.example.com/data',
*   method: 'GET',
*   headers: { 'Content-Type': 'application/json' }
* });
* console.log(await response.json());
*/
async request(request_params) {
return await this.adapter.request(request_params);
}
};

var SmartHttpRequestAdapter2 = class {
constructor(main) {
this.main = main;
}
async request(request_params) {
throw new Error("request not implemented");
}
};
var SmartHttpResponseAdapter2 = class {
constructor(response) {
this.response = response;
}
async headers() {
throw new Error("headers not implemented");
}
async json() {
throw new Error("json not implemented");
}
async status() {
throw new Error("status not implemented");
}
async text() {
throw new Error("text not implemented");
}
};

var SmartHttpObsidianRequestAdapter2 = class extends SmartHttpRequestAdapter2 {
async request(request_params) {
let response;
try {
if (!this.main.opts.obsidian_request_url) {
throw new Error("obsidian_request_url is required in SmartHttp constructor opts");
}
response = await this.main.opts.obsidian_request_url({ ...request_params, throw: false });
if (response.status === 400)
throw new Error("Obsidian request failed");
return new SmartHttpObsidianResponseAdapter(response);
} catch (error) {
console.error("Error in SmartHttpObsidianRequestAdapter.request():");
console.error(JSON.stringify(request_params, null, 2));
console.error(response);
console.error(error);
return null;
}
}
};
var SmartHttpObsidianResponseAdapter = class extends SmartHttpResponseAdapter2 {
async status() {
return this.response.status;
}
async json() {
return await this.response.json;
}
async text() {
return await this.response.text;
}
async headers() {
return this.response.headers;
}
};

var import_obsidian23 = require("obsidian");

var import_obsidian18 = require("obsidian");
var SmartCompletionDraftAdapter = class extends SmartCompletionAdapter {
/**
* @returns {string}
*/
static get property_name() {
return "draft_instructions";
}
get draft_instructions() {
return this.data.draft_instructions;
}
/**
* This is our updated block key or file path.
* If user selected a block from the new command, that block name is placed here.
*/
get draft_target_key() {
return this.data.draft_target_key;
}
get template_collection() {
return this.item.env.smart_templates;
}
get template_before() {
if (this.data.template_before)
return this.data.template_before;
return `Update the following text to match the change instructions:
---BEGIN ORIGINAL TEXT---`;
}
get template_after() {
if (this.data.template_after)
return this.data.template_after;
return `---END ORIGINAL TEXT---`;
}
validate_completion() {
if (!this.draft_instructions)
return new import_obsidian18.Notice("No draft instructions found");
if (!this.draft_target_key)
return new import_obsidian18.Notice("No draft target path or block found");
if (!this.template_collection)
return new import_obsidian18.Notice("No smart_templates collection found");
return true;
}
compile_template_instructions(template_text) {
return [this.template_before, template_text, this.template_after].join("\n");
}
/**
* Inject user messages using the standard approach.
* We also include the `draft_instructions`.
*/
async to_request() {
if (this.validate_completion() !== true)
return;
let template_item = this.template_collection.get(this.draft_target_key);
if (!template_item) {
template_item = this.template_collection.create_or_update({
key: this.draft_target_key,
source_key: this.draft_target_key
});
}
const template_content = await template_item.get_template();
const draft_prompt = this.compile_template_instructions(template_content);
this.insert_user_message(draft_prompt);
let system_instructions = `Important:
- Follow the change instructions carefully.
- Include at least one line before and after the changed content that remains unchanged.
- Wrap partial drafts with lines that only include ellipsis (e.g. "...").
- DO NOT repeat the full original text verbatim in your response.
- DO NOT change headings unless specifically instructed to do so.`;
if (this.data.context_key) {
system_instructions += `
- Since context is referenced, please include relevant Obsidian-style wiki-link references if citing external material.
- For example, a reference to some/path/name.md should be linked like this: [[name]]`;
}
this.insert_user_message(system_instructions + `

Change instructions: ${this.data.draft_instructions}`);
}
/**
* from_response: parse the text, add to a SmartDraft item for 'draft_target_key'.
*/
async from_response() {
const pending_changes = await this.item.env.smart_changes.parse_changes_2(this.draft_target_key, this.item.response_text);
if (!pending_changes) {
new import_obsidian18.Notice(`No pending changes found for '${this.draft_target_key}'.`);
return;
}
this.item.env.smart_editor_plugin.render_pending_changes(this.draft_target_key);
new import_obsidian18.Notice(`Draft created for '${this.draft_target_key}'.`);
}
};

var css_sheet2 = new CSSStyleSheet();
css_sheet2.replaceSync(`.sd-draft-creator {
display: flex;
flex-direction: column;
gap: 1rem;
background-color: var(--background-primary);
color: var(--text-normal);
border: 1px solid var(--background-modifier-border);
border-radius: 6px;
padding: 1rem;
position: relative; /* needed for the overlay to position absolutely */
}

.sd-dc-header {
display: flex;
align-items: center;
justify-content: space-between;
}

.sd-dc-title {
margin: 0;
font-size: var(--font-ui-medium);
font-weight: 600;
color: var(--text-accent);
}

.sd-dc-body {
display: flex;
flex-direction: column;
gap: 1rem;
}

.sd-dc-instructions-container {
display: flex;
flex-direction: column;
gap: 0.35rem;
}

.sd-dc-instructions-label {
color: var(--text-faint);
font-size: var(--font-ui-smaller);
cursor: pointer;
user-select: none;
}

.sd-dc-instructions-field {
min-height: 2.5em;
background: var(--background-modifier-form-field);
border: 1px solid var(--background-modifier-border);
padding: 6px 8px;
border-radius: 4px;
overflow-y: auto;
outline: none;
color: var(--text-normal);
}

.sd-dc-instructions-field:empty::before {
content: attr(placeholder);
color: var(--text-muted);
pointer-events: none;
}

.sd-dc-textarea-container {
display: flex;
flex-direction: column;
}

.sd-dc-textarea {
width: 100%;
min-height: 100px;
background: var(--background-modifier-form-field);
color: var(--text-normal);
border: 1px solid var(--background-modifier-border);
border-radius: 4px;
padding: 8px;
font-family: var(--font-text);
resize: vertical;
transition: border-color 0.15s ease;
}

.sd-dc-textarea:focus {
outline: none;
border-color: var(--interactive-accent);
}

.sd-dc-footer {
display: flex;
align-items: center;
justify-content: flex-end;
gap: 0.5rem;
}

.sd-dc-generate-button,
.sd-dc-build-context-button {
background-color: var(--interactive-accent);
color: var(--text-on-accent);
border: none;
border-radius: 4px;
padding: 6px 12px;
cursor: pointer;
box-shadow: var(--shadow-s);
font-size: var(--font-ui-smaller);
}

.sd-dc-generate-button:hover,
.sd-dc-build-context-button:hover {
background-color: var(--interactive-accent-hover);
}

.sd-dc-generate-button:active,
.sd-dc-build-context-button:active {
transform: scale(0.98);
box-shadow: var(--shadow-xs);
}

/* The area for the context reviewer component. */
.sd-dc-context-reviewer {
margin-top: 1rem;
background: var(--background-secondary);
padding: 0.5rem;
border-radius: 4px;
border: 1px solid var(--background-modifier-border);
}

/* Overlay for "Creating draft..." */
.sd-dc-overlay {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
display: none; /* shown dynamically */
align-items: center;
justify-content: center;
backdrop-filter: blur(4px);
background-color: rgba(0, 0, 0, 0.3);
z-index: 9999;
color: #fff;
font-size: 1.2em;
font-weight: bold;
}
`);
var draft_creator_default = css_sheet2;

var import_obsidian19 = require("obsidian");
var DraftContextModal = class extends import_obsidian19.FuzzySuggestModal {
/**
* @param {Object} plugin
* @param {Object} opts
* @param {Object} [opts.context_item]
* @param {Function} [opts.on_done]
*/
constructor(plugin, opts = {}) {
super(plugin.app);
this.plugin = plugin;
this.opts = opts;
plugin.env.create_env_getter(this);
this.context_item = opts.context_item || new this.env.smart_contexts.item_type(this.env, {});
this.setPlaceholder("Search vault items to add as draft context...");
}
getItems() {
const src = this.env?.smart_sources;
if (!src?.items) {
return [];
}
const used_keys = Object.keys(this.context_item?.data?.context_items || {});
const all_keys = Object.keys(src.items);
const filtered = all_keys.filter((k) => !used_keys.includes(k));
return filtered;
}
getItemText(itemKey) {
return itemKey;
}
onChooseItem(itemKey) {
if (!this.context_item.data.context_items) {
this.context_item.data.context_items = {};
}
if (this.context_item.data.context_items[itemKey]) {
new import_obsidian19.Notice(`'${itemKey}' is already in the context. Skipping duplicate.`);
this.open();
return;
}
this.context_item.data.context_items[itemKey] = true;
this.open();
}
onOpen() {
super.onOpen();
if (!this.env?.smart_sources) {
const promptEl2 = this.modalEl;
if (promptEl2) {
promptEl2.createEl("div", {
text: 'Error: No "smart_sources" found in environment. Cannot pick items.'
});
}
return;
}
const promptEl = this.modalEl;
if (promptEl) {
promptEl.style.display = "flex";
promptEl.style.flexDirection = "column";
promptEl.style.height = "100%";
}
const promptResults = this.modalEl.querySelector(".prompt-results");
if (promptResults) {
promptResults.style.flex = "1 1 auto";
promptResults.style.minHeight = "0";
promptResults.style.overflowY = "auto";
}
if (!this.context_review_el) {
this.context_review_el = document.createElement("div");
this.context_review_el.classList.add("draft-context-reviewer-panel");
this.context_review_el.setAttribute(
"style",
`
flex: 0 1 auto;
max-height: 50%;
overflow-y: auto;
margin-top: 12px;
border-top: 1px solid var(--background-modifier-border);
padding-top: 10px;
`
);
this.modalEl.appendChild(this.context_review_el);
}
this.renderContextReviewer();
this.renderFooterButtons();
}
onClose() {
super.onClose();
}
async renderContextReviewer() {
if (!this.context_review_el)
return;
this.context_review_el.empty();
const frag = await this.env.render_component("context_reviewer", this.context_item, {
hideSubmit: true
});
this.context_review_el.appendChild(frag);
}
renderFooterButtons() {
if (this.footer_el)
return;
this.footer_el = this.modalEl.createDiv("draft-context-modal-footer");
this.footer_el.style.marginTop = "10px";
const done_btn = this.footer_el.createEl("button", { text: "Done" });
done_btn.addEventListener("click", async () => {
this.env.smart_contexts.set(this.context_item);
this.env.smart_contexts.process_save_queue();
if (this.opts.on_done) {
this.opts.on_done(this.context_item);
}
this.close();
});
const cancel_btn = this.footer_el.createEl("button", { text: "Cancel" });
cancel_btn.addEventListener("click", () => {
this.close();
});
}
};

function build_html5(completion, opts = {}) {
const source = completion.env.smart_sources.get(completion.data.draft_target_key);
const creator_title = "Draft Creator for " + (source?.name || source?.key || completion.data.draft_target_key || completion.key);
return `
<div class="sd-draft-creator" data-draft-creator-key="${completion.key}">
<div class="sd-dc-header">
<h2 class="sd-dc-title">${creator_title}</h2>
</div>

<div class="sd-dc-body">
<div class="sd-dc-instructions-container">
<small class="sd-dc-instructions-label">Change instructions</small>
<div
tabindex="0"
class="sd-dc-instructions-field"
contenteditable="true"
placeholder="Enter how you'd like to change the file..."
></div>
</div>

<!-- Context Reviewer container (optional) -->
<div class="sd-dc-context-reviewer"></div>
<div class="sd-dc-feedback-message" style="display: none; color: var(--text-error); font-size: var(--font-ui-small);"></div>
</div>

<div class="sd-dc-footer">
<button class="sd-dc-build-context-button" tabindex="2">Build Context (0)</button>
<button class="sd-dc-generate-button" tabindex="1">Create Draft</button>
</div>

<!-- Overlay element -->
<div class="sd-dc-overlay" style="display: none;">Creating draft...</div>
</div>
`;
}
async function render8(completion, opts = {}) {
const html = build_html5.call(this, completion, opts);
const frag = this.create_doc_fragment(html);
this.apply_style_sheet(draft_creator_default);
post_process7.call(this, completion, frag, opts);
return frag;
}
function post_process7(completion, frag, opts = {}) {
const env = completion?.env;
const container_el = frag.querySelector(".sd-draft-creator");
const instructions_el = container_el?.querySelector(".sd-dc-instructions-field");
const generate_btn = container_el?.querySelector(".sd-dc-generate-button");
const build_context_btn = container_el?.querySelector(".sd-dc-build-context-button");
const reviewer_el = container_el?.querySelector(".sd-dc-context-reviewer");
const feedback_el = container_el?.querySelector(".sd-dc-feedback-message");
const overlayEl = container_el?.querySelector(".sd-dc-overlay");
let is_generating = false;
if (!env?.smart_completions) {
if (generate_btn)
generate_btn.disabled = true;
if (feedback_el) {
feedback_el.style.display = "block";
feedback_el.textContent = 'Error: No "smart_completions" environment found.';
}
}
if (build_context_btn) {
let context_count = 0;
const render_context_reviewer = (context_item) => {
const item_keys = Object.keys(context_item?.data?.context_items || {});
context_count = item_keys.length;
build_context_btn.textContent = `Build Context (${context_count})`;
if (reviewer_el && context_item) {
reviewer_el.innerHTML = "";
env.render_component("context_reviewer", context_item, {}).then((rfrag) => {
reviewer_el.appendChild(rfrag);
});
}
};
render_context_reviewer();
build_context_btn.addEventListener("click", async () => {
if (!env?.smart_editor_plugin) {
feedback_el.style.display = "block";
feedback_el.textContent = "Error: no plugin reference found to open the context modal.";
return;
}
const modal = new DraftContextModal(env.smart_editor_plugin, {
context_item: completion.data.context_key,
on_done: (updated_context_item) => {
if (updated_context_item) {
completion.data.context_key = updated_context_item.key;
}
render_context_reviewer(updated_context_item);
}
});
modal.open();
});
}
generate_btn?.addEventListener("click", async () => {
if (is_generating) {
return;
}
is_generating = true;
generate_btn.disabled = true;
generate_btn.textContent = "Generating...";
if (overlayEl) {
overlayEl.style.display = "flex";
}
if (feedback_el) {
feedback_el.style.display = "none";
feedback_el.textContent = "";
}
const change_instructions = instructions_el?.textContent.trim() || "";
if (!change_instructions) {
generate_btn.disabled = false;
generate_btn.textContent = "Create Draft";
if (overlayEl) {
overlayEl.style.display = "none";
}
is_generating = false;
return;
}
if (!env?.smart_completions) {
if (feedback_el) {
feedback_el.style.display = "block";
feedback_el.textContent = 'Environment "smart_completions" is missing. Cannot proceed.';
}
generate_btn.textContent = "Error";
if (overlayEl) {
overlayEl.style.display = "none";
}
is_generating = false;
return;
}
completion.data.draft_instructions = change_instructions;
try {
await completion.init({ stream: false });
generate_btn.textContent = "Done";
if (overlayEl) {
overlayEl.style.display = "none";
}
opts?.completion_callback?.(completion);
} catch (err) {
console.error("Error while running completion:", err);
if (feedback_el) {
feedback_el.style.display = "block";
feedback_el.textContent = "An error occurred. Check console logs or try again.";
}
generate_btn.textContent = "Error";
if (overlayEl) {
overlayEl.style.display = "none";
}
}
generate_btn.disabled = false;
is_generating = false;
});
return frag;
}

var import_obsidian20 = require("obsidian");
var SmartEditorSettingTab = class extends import_obsidian20.PluginSettingTab {
/**
* @param {import('obsidian').App} app - The current Obsidian app instance
* @param {import('./main.js').default} plugin - The main plugin object
*/
constructor(app, plugin) {
super(app, plugin);
this.plugin = plugin;
this.plugin.env.create_env_getter(this);
}
/**
* Called by Obsidian to render the settings page.
*/
display() {
this.containerEl.empty();
if (!this.env) {
this.containerEl.createEl("p", {
text: "Smart Editor environment not yet initialized."
});
return;
}
this.containerEl.createEl("div", {
cls: "smart-editor-settings-container"
});
this.containerEl.createEl("div", {
cls: "smart-editor-chat-model-settings-container"
});
const smart_chat_model_settings_config = this.plugin.chat_model?.settings_config;
this.env.smart_view.render_settings(smart_chat_model_settings_config, {
scope: this.plugin.chat_model
}).then((frag) => {
const chat_model_settings_container = this.containerEl.querySelector(".smart-editor-chat-model-settings-container");
chat_model_settings_container.empty();
chat_model_settings_container.appendChild(frag);
});
}
};

var import_state = require("@codemirror/state");
var import_view2 = require("@codemirror/view");

var import_view = require("@codemirror/view");
var SmartChangeWidget = class extends import_view.WidgetType {
constructor({ change }) {
super();
this.change = change;
}
eq(other) {
return other.change.key === this.change.key;
}
get env() {
return this.change.env;
}
toDOM() {
const container = document.createElement("div");
container.style.width = "100%";
container.style.whiteSpace = "normal";
container.textContent = "Loading...";
this.env.render_component("change", this.change).then((frag) => {
container.innerHTML = "";
container.appendChild(frag);
});
return container;
}
ignoreEvent() {
return false;
}
};

var remove_diff_deco_range_effect = import_state.StateEffect.define();
var set_diff_deco_effect = import_state.StateEffect.define();
var remove_diff_deco_effect = import_state.StateEffect.define();
var changes_cm_state_field = import_state.StateField.define({
create() {
return import_view2.Decoration.none;
},
update(decorations, tr) {
for (let e of tr.effects) {
if (e.is(set_diff_deco_effect)) {
decorations = e.value;
} else if (e.is(remove_diff_deco_effect)) {
const deco_id = e.value;
decorations = decorations.update({
filter: (range_from, range_to, value) => {
return value.spec.deco_id !== deco_id;
}
});
} else if (e.is(remove_diff_deco_range_effect)) {
const { from, to } = e.value;
decorations = decorations.update({
filter: (range_from, range_to) => {
const intersects = range_to >= from && range_from <= to;
return !intersects;
}
});
}
}
return decorations;
},
provide: (f) => import_view2.EditorView.decorations.from(f)
});
function create_diff_decorations(pending_changes, main_editor_view) {
if (!main_editor_view) {
console.warn("No main editor view found");
return import_view2.Decoration.none;
}
const main_doc = main_editor_view.state.doc;
const doc_line_count = main_doc.lineCount;
const doc_len = main_doc.length;
const builder = new import_state.RangeSetBuilder();
const ranges = [];
function clamp_pos(pos) {
return Math.max(0, Math.min(pos, doc_len));
}
function safe_line_handle(line_index) {
if (doc_line_count === 0)
return 1;
if (line_index < 1)
return 1;
if (line_index > doc_line_count)
return doc_line_count;
return line_index;
}
pending_changes.forEach((change) => {
const old_line_class = change.moved_from ? "sc-moved-from" : change.moved_to ? "sc-moved-to" : "sc-removed";
const [startLine, endLine] = change.old;
let start_line_handle = safe_line_handle(startLine + 2);
let end_line_handle = safe_line_handle(endLine + 1);
const diffs = change.change?.diffs || [];
let diff_i = 0;
for (let line_index = start_line_handle; line_index <= end_line_handle; line_index++) {
const line2 = main_doc.line(line_index);
ranges.push([
clamp_pos(line2.from),
clamp_pos(line2.from),
import_view2.Decoration.line({ class: old_line_class, deco_id: change.key })
]);
for (let i = 0; i < diffs.length; i++) {
const removal = diffs[diff_i];
if (removal) {
const diff_start_char = removal.start + line2.from;
if (diff_start_char > line2.to)
break;
ranges.push([
diff_start_char,
removal.end + line2.from,
import_view2.Decoration.mark({ class: old_line_class, deco_id: change.key })
]);
}
diff_i++;
}
}
const line = main_doc.line(end_line_handle);
let side;
let pos;
if (typeof change.anchor_end === "number" && change.anchor_end === -1) {
side = -1;
pos = line.from;
} else {
side = 1;
pos = line.to;
}
console.log("side", side, pos, change.anchor_end);
ranges.push([
pos,
pos,
import_view2.Decoration.widget({
deco_id: change.key,
widget: new SmartChangeWidget({ change }),
block: true,
side
})
]);
});
ranges.sort((a, b) => {
if (a[0] !== b[0])
return a[0] - b[0];
const a_side = a[2].startSide !== void 0 ? a[2].startSide : 0;
const b_side = b[2].startSide !== void 0 ? b[2].startSide : 0;
return a_side - b_side;
});
ranges.forEach(([from, to, deco]) => {
builder.add(from, to, deco);
});
return builder.finish();
}

var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;
function Diff(op, text) {
return [op, text];
}
Diff.prototype.length = 2;
var diff_match_patch = class _diff_match_patch {
constructor() {
this.Diff_Timeout = 1;
this.Diff_EditCost = 4;
this.Match_Threshold = 0.5;
this.Match_Distance = 1e3;
this.Patch_DeleteThreshold = 0.5;
this.Patch_Margin = 4;
this.Match_MaxBits = 32;
}
/**
* Find the differences between two texts. Simplifies the problem by stripping
* any common prefix or suffix, then calls diff_compute_.
* @param {string} text1 Old string to be diffed.
* @param {string} text2 New string to be diffed.
* @param {boolean=} opt_checklines Optional speedup flag. Defaults to true.
* @param {number=} opt_deadline Optional time limit in ms.
* @return {!Array.<!Diff>} Array of diff tuples.
*/
diff_main(text1, text2, opt_checklines, opt_deadline) {
if (typeof opt_deadline === "undefined") {
if (this.Diff_Timeout <= 0) {
opt_deadline = Number.MAX_VALUE;
} else {
opt_deadline = (/* @__PURE__ */ new Date()).getTime() + this.Diff_Timeout * 1e3;
}
}
const deadline = opt_deadline;
if (text1 == null || text2 == null) {
throw new Error("Null input. (diff_main)");
}
if (text1 === text2) {
if (text1) {
return [new Diff(DIFF_EQUAL, text1)];
}
return [];
}
if (typeof opt_checklines === "undefined") {
opt_checklines = true;
}
const checklines = opt_checklines;
let commonlength = this.diff_commonPrefix(text1, text2);
const commonprefix = text1.substring(0, commonlength);
text1 = text1.substring(commonlength);
text2 = text2.substring(commonlength);
commonlength = this.diff_commonSuffix(text1, text2);
const commonsuffix = text1.substring(text1.length - commonlength);
text1 = text1.substring(0, text1.length - commonlength);
text2 = text2.substring(0, text2.length - commonlength);
const diffs = this.diff_compute_(text1, text2, checklines, deadline);
if (commonprefix) {
diffs.unshift(new Diff(DIFF_EQUAL, commonprefix));
}
if (commonsuffix) {
diffs.push(new Diff(DIFF_EQUAL, commonsuffix));
}
this.diff_cleanupMerge(diffs);
return diffs;
}
/**
* Find the differences between two texts. Assumes that the texts do not
* have any common prefix or suffix. Calls diff_lineMode_ or diff_bisect_
* as needed.
* @param {string} text1 Old string to be diffed.
* @param {string} text2 New string to be diffed.
* @param {boolean} checklines Speedup flag: if true, do a line-level diff first.
* @param {number} deadline Time when the diff should be complete by.
* @return {!Array.<!Diff>} Array of diff tuples.
* @private
*/
diff_compute_(text1, text2, checklines, deadline) {
if (!text1) {
return [new Diff(DIFF_INSERT, text2)];
}
if (!text2) {
return [new Diff(DIFF_DELETE, text1)];
}
const longtext = text1.length > text2.length ? text1 : text2;
const shorttext = text1.length > text2.length ? text2 : text1;
const i = longtext.indexOf(shorttext);
if (i !== -1) {
const diffs = [
new Diff(DIFF_INSERT, longtext.substring(0, i)),
new Diff(DIFF_EQUAL, shorttext),
new Diff(DIFF_INSERT, longtext.substring(i + shorttext.length))
];
if (text1.length > text2.length) {
diffs[0][0] = diffs[2][0] = DIFF_DELETE;
}
return diffs;
}
if (shorttext.length === 1) {
return [
new Diff(DIFF_DELETE, text1),
new Diff(DIFF_INSERT, text2)
];
}
const hm = this.diff_halfMatch_(text1, text2);
if (hm) {
const text1_a = hm[0];
const text1_b = hm[1];
const text2_a = hm[2];
const text2_b = hm[3];
const mid_common = hm[4];
const diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
const diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
return diffs_a.concat([new Diff(DIFF_EQUAL, mid_common)], diffs_b);
}
if (checklines && text1.length > 100 && text2.length > 100) {
return this.diff_lineMode_(text1, text2, deadline);
}
return this.diff_bisect_(text1, text2, deadline);
}
/**
* Do a quick line-level diff on both strings, then rediff the parts for
* greater accuracy.
* @param {string} text1 Old string to be diffed.
* @param {string} text2 New string to be diffed.
* @param {number} deadline Time when the diff should be complete by.
* @return {!Array.<!Diff>} Array of diff tuples.
* @private
*/
diff_lineMode_(text1, text2, deadline) {
const a = this.diff_linesToChars_(text1, text2);
text1 = a.chars1;
text2 = a.chars2;
const lineArray = a.lineArray;
let diffs = this.diff_main(text1, text2, false, deadline);
this.diff_charsToLines_(diffs, lineArray);
this.diff_cleanupSemantic(diffs);
diffs.push(new Diff(DIFF_EQUAL, ""));
let pointer = 0;
let count_delete = 0;
let count_insert = 0;
let text_delete = "";
let text_insert = "";
while (pointer < diffs.length) {
switch (diffs[pointer][0]) {
case DIFF_INSERT:
count_insert++;
text_insert += diffs[pointer][1];
break;
case DIFF_DELETE:
count_delete++;
text_delete += diffs[pointer][1];
break;
case DIFF_EQUAL:
if (count_delete >= 1 && count_insert >= 1) {
diffs.splice(
pointer - count_delete - count_insert,
count_delete + count_insert
);
pointer = pointer - count_delete - count_insert;
const subDiff = this.diff_main(text_delete, text_insert, false, deadline);
for (let j = subDiff.length - 1; j >= 0; j--) {
diffs.splice(pointer, 0, subDiff[j]);
}
pointer = pointer + subDiff.length;
}
count_insert = 0;
count_delete = 0;
text_delete = "";
text_insert = "";
break;
}
pointer++;
}
diffs.pop();
return diffs;
}
/**
* Find the 'middle snake' of a diff, split the problem in two, and return
* the recursively constructed diff. See Myers 1986 paper for details.
* @param {string} text1 Old string to be diffed.
* @param {string} text2 New string to be diffed.
* @param {number} deadline Time at which to bail if not yet complete.
* @return {!Array.<!Diff>} Array of diff tuples.
* @private
*/
diff_bisect_(text1, text2, deadline) {
const text1_length = text1.length;
const text2_length = text2.length;
const max_d = Math.ceil((text1_length + text2_length) / 2);
const v_offset = max_d;
const v_length = 2 * max_d;
const v1 = new Array(v_length).fill(-1);
const v2 = new Array(v_length).fill(-1);
v1[v_offset + 1] = 0;
v2[v_offset + 1] = 0;
const delta = text1_length - text2_length;
const front = delta % 2 !== 0;
let k1start = 0;
let k1end = 0;
let k2start = 0;
let k2end = 0;
for (let d = 0; d < max_d; d++) {
if ((/* @__PURE__ */ new Date()).getTime() > deadline) {
break;
}
for (let k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
const k1_offset = v_offset + k1;
let x1;
if (k1 === -d || k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
x1 = v1[k1_offset + 1];
} else {
x1 = v1[k1_offset - 1] + 1;
}
let y1 = x1 - k1;
while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) === text2.charAt(y1)) {
x1++;
y1++;
}
v1[k1_offset] = x1;
if (x1 > text1_length) {
k1end += 2;
} else if (y1 > text2_length) {
k1start += 2;
} else if (front) {
const k2_offset = v_offset + delta - k1;
if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
const x2 = text1_length - v2[k2_offset];
if (x1 >= x2) {
return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
}
}
}
}
for (let k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
const k2_offset = v_offset + k2;
let x2;
if (k2 === -d || k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
x2 = v2[k2_offset + 1];
} else {
x2 = v2[k2_offset - 1] + 1;
}
let y2 = x2 - k2;
while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) === text2.charAt(text2_length - y2 - 1)) {
x2++;
y2++;
}
v2[k2_offset] = x2;
if (x2 > text1_length) {
k2end += 2;
} else if (y2 > text2_length) {
k2start += 2;
} else if (!front) {
const k1_offset = v_offset + delta - k2;
if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
const x1 = v1[k1_offset];
const y1 = v_offset + x1 - k1_offset;
const x2_left = text1_length - x2;
if (x1 >= x2_left) {
return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
}
}
}
}
}
return [
new Diff(DIFF_DELETE, text1),
new Diff(DIFF_INSERT, text2)
];
}
/**
* Given the location of the 'middle snake', split the diff in two parts
* and recurse.
* @param {string} text1 Old string to be diffed.
* @param {string} text2 New string to be diffed.
* @param {number} x Index of split point in text1.
* @param {number} y Index of split point in text2.
* @param {number} deadline Time at which to bail if not yet complete.
* @return {!Array.<!Diff>} Array of diff tuples.
* @private
*/
diff_bisectSplit_(text1, text2, x, y, deadline) {
const text1a = text1.substring(0, x);
const text2a = text2.substring(0, y);
const text1b = text1.substring(x);
const text2b = text2.substring(y);
const diffs = this.diff_main(text1a, text2a, false, deadline);
const diffsb = this.diff_main(text1b, text2b, false, deadline);
return diffs.concat(diffsb);
}
/**
* Split two texts into an array of strings. Reduce them to a string of hashes
* where each Unicode character represents one line.
* @param {string} text1 First string.
* @param {string} text2 Second string.
* @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
* @private
*/
diff_linesToChars_(text1, text2) {
const lineArray = [];
const lineHash = {};
lineArray[0] = "";
const diff_linesToCharsMunge_ = (txt) => {
let chars = "";
let lineStart = 0;
let lineEnd = -1;
let lineArrayLength = lineArray.length;
const maxLines = 4e4;
while (lineEnd < txt.length - 1) {
lineEnd = txt.indexOf("\n", lineStart);
if (lineEnd === -1) {
lineEnd = txt.length - 1;
}
const line = txt.substring(lineStart, lineEnd + 1);
if (lineHash.hasOwnProperty(line)) {
chars += String.fromCharCode(lineHash[line]);
} else {
if (lineArrayLength === maxLines) {
const leftover = txt.substring(lineStart);
chars += String.fromCharCode(lineArrayLength);
lineHash[leftover] = lineArrayLength;
lineArray[lineArrayLength++] = leftover;
break;
}
lineHash[line] = lineArrayLength;
lineArray[lineArrayLength++] = line;
chars += String.fromCharCode(lineHash[line]);
}
lineStart = lineEnd + 1;
}
return chars;
};
const chars1 = diff_linesToCharsMunge_(text1);
const chars2 = diff_linesToCharsMunge_(text2);
return {
chars1,
chars2,
lineArray
};
}
/**
* Rehydrate the text in a diff from a string of line hashes to real lines.
* @param {!Array.<!Diff>} diffs Array of diff tuples.
* @param {!Array.<string>} lineArray Array of unique strings.
* @private
*/
diff_charsToLines_(diffs, lineArray) {
for (let i = 0; i < diffs.length; i++) {
const chars = diffs[i][1];
const text = [];
for (let j = 0; j < chars.length; j++) {
text[j] = lineArray[chars.charCodeAt(j)];
}
diffs[i][1] = text.join("");
}
}
/**
* Determine the common prefix of two strings.
* @param {string} text1 First string.
* @param {string} text2 Second string.
* @return {number} The number of characters common to the start of each string.
*/
diff_commonPrefix(text1, text2) {
if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
return 0;
}
let pointermin = 0;
let pointermax = Math.min(text1.length, text2.length);
let pointermid = pointermax;
let pointerstart = 0;
while (pointermin < pointermid) {
if (text1.substring(pointerstart, pointermid) === text2.substring(pointerstart, pointermid)) {
pointermin = pointermid;
pointerstart = pointermin;
} else {
pointermax = pointermid;
}
pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
}
return pointermid;
}
/**
* Determine the common suffix of two strings.
* @param {string} text1 First string.
* @param {string} text2 Second string.
* @return {number} The number of characters common to the end of each string.
*/
diff_commonSuffix(text1, text2) {
if (!text1 || !text2 || text1.charAt(text1.length - 1) !== text2.charAt(text2.length - 1)) {
return 0;
}
let pointermin = 0;
let pointermax = Math.min(text1.length, text2.length);
let pointermid = pointermax;
let pointerend = 0;
while (pointermin < pointermid) {
if (text1.substring(text1.length - pointermid, text1.length - pointerend) === text2.substring(text2.length - pointermid, text2.length - pointerend)) {
pointermin = pointermid;
pointerend = pointermin;
} else {
pointermax = pointermid;
}
pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
}
return pointermid;
}
/**
* Determine if the suffix of one string is the prefix of another.
* @param {string} text1 First string.
* @param {string} text2 Second string.
* @return {number} The number of characters common to the end of text1
*     and the start of text2.
* @private
*/
diff_commonOverlap_(text1, text2) {
const text1_length = text1.length;
const text2_length = text2.length;
if (text1_length === 0 || text2_length === 0) {
return 0;
}
if (text1_length > text2_length) {
text1 = text1.substring(text1_length - text2_length);
} else if (text1_length < text2_length) {
text2 = text2.substring(0, text1_length);
}
const min_length = Math.min(text1_length, text2_length);
if (text1 === text2) {
return min_length;
}
let best = 0;
let length = 1;
while (true) {
const pattern = text1.substring(min_length - length);
const found = text2.indexOf(pattern);
if (found === -1) {
return best;
}
length += found;
if (found === 0 || text1.substring(min_length - length) === text2.substring(0, length)) {
best = length;
length++;
}
}
}
/**
* Do the two texts share a substring which is at least half the length of
* the longer text? This speedup can produce non-minimal diffs.
* @param {string} text1 First string.
* @param {string} text2 Second string.
* @return {Array.<string>} 5 element Array, or null if no match:
*   [text1_a, text1_b, text2_a, text2_b, mid_common]
* @private
*/
diff_halfMatch_(text1, text2) {
if (this.Diff_Timeout <= 0) {
return null;
}
const longtext = text1.length > text2.length ? text1 : text2;
const shorttext = text1.length > text2.length ? text2 : text1;
if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
return null;
}
const diff_halfMatchI_ = (_longtext, _shorttext, i) => {
const seed = _longtext.substring(i, i + Math.floor(_longtext.length / 4));
let j = -1;
let best_common = "";
let best_longtext_a = "", best_longtext_b = "";
let best_shorttext_a = "", best_shorttext_b = "";
while ((j = _shorttext.indexOf(seed, j + 1)) !== -1) {
const prefixLength = this.diff_commonPrefix(
_longtext.substring(i),
_shorttext.substring(j)
);
const suffixLength = this.diff_commonSuffix(
_longtext.substring(0, i),
_shorttext.substring(0, j)
);
if (best_common.length < suffixLength + prefixLength) {
best_common = _shorttext.substring(j - suffixLength, j) + _shorttext.substring(j, j + prefixLength);
best_longtext_a = _longtext.substring(0, i - suffixLength);
best_longtext_b = _longtext.substring(i + prefixLength);
best_shorttext_a = _shorttext.substring(0, j - suffixLength);
best_shorttext_b = _shorttext.substring(j + prefixLength);
}
}
if (best_common.length * 2 >= _longtext.length) {
return [
best_longtext_a,
best_longtext_b,
best_shorttext_a,
best_shorttext_b,
best_common
];
}
return null;
};
const hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
const hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
let hm;
if (!hm1 && !hm2) {
return null;
} else if (!hm2) {
hm = hm1;
} else if (!hm1) {
hm = hm2;
} else {
hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
}
let text1_a, text1_b, text2_a, text2_b;
if (text1.length > text2.length) {
text1_a = hm[0];
text1_b = hm[1];
text2_a = hm[2];
text2_b = hm[3];
} else {
text2_a = hm[0];
text2_b = hm[1];
text1_a = hm[2];
text1_b = hm[3];
}
const mid_common = hm[4];
return [text1_a, text1_b, text2_a, text2_b, mid_common];
}
static nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
static whitespaceRegex_ = /\s/;
static linebreakRegex_ = /[\r\n]/;
static blanklineEndRegex_ = /\n\r?\n$/;
static blanklineStartRegex_ = /^\r?\n\r?\n/;
/**
* Reduce the number of edits by eliminating semantically trivial equalities.
* @param {!Array.<!Diff>} diffs Array of diff tuples.
*/
diff_cleanupSemantic(diffs) {
let changes = false;
const equalities = [];
let equalitiesLength = 0;
let lastEquality = null;
let pointer = 0;
let length_insertions1 = 0;
let length_deletions1 = 0;
let length_insertions2 = 0;
let length_deletions2 = 0;
while (pointer < diffs.length) {
if (diffs[pointer][0] === DIFF_EQUAL) {
equalities[equalitiesLength++] = pointer;
length_insertions1 = length_insertions2;
length_deletions1 = length_deletions2;
length_insertions2 = 0;
length_deletions2 = 0;
lastEquality = diffs[pointer][1];
} else {
if (diffs[pointer][0] === DIFF_INSERT) {
length_insertions2 += diffs[pointer][1].length;
} else {
length_deletions2 += diffs[pointer][1].length;
}
if (lastEquality && lastEquality.length <= Math.max(length_insertions1, length_deletions1) && lastEquality.length <= Math.max(length_insertions2, length_deletions2)) {
diffs.splice(
equalities[equalitiesLength - 1],
0,
new Diff(DIFF_DELETE, lastEquality)
);
diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
equalitiesLength--;
equalitiesLength--;
pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
length_insertions1 = 0;
length_deletions1 = 0;
length_insertions2 = 0;
length_deletions2 = 0;
lastEquality = null;
changes = true;
}
}
pointer++;
}
if (changes) {
this.diff_cleanupMerge(diffs);
}
this.diff_cleanupSemanticLossless(diffs);
pointer = 1;
while (pointer < diffs.length) {
if (diffs[pointer - 1][0] === DIFF_DELETE && diffs[pointer][0] === DIFF_INSERT) {
const deletion = diffs[pointer - 1][1];
const insertion = diffs[pointer][1];
const overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
const overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
if (overlap_length1 >= overlap_length2) {
if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
diffs.splice(
pointer,
0,
new Diff(DIFF_EQUAL, insertion.substring(0, overlap_length1))
);
diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
diffs[pointer + 1][1] = insertion.substring(overlap_length1);
pointer++;
}
} else {
if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
diffs.splice(
pointer,
0,
new Diff(DIFF_EQUAL, deletion.substring(0, overlap_length2))
);
diffs[pointer - 1][0] = DIFF_INSERT;
diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
diffs[pointer + 1][0] = DIFF_DELETE;
diffs[pointer + 1][1] = deletion.substring(overlap_length2);
pointer++;
}
}
pointer++;
}
pointer++;
}
}
/**
* Look for single edits surrounded on both sides by equalities which can be
* shifted sideways to align the edit to a word boundary (e.g. "The c<ins>at c</ins>ame.").
* @param {!Array.<!Diff>} diffs Array of diff tuples.
*/
diff_cleanupSemanticLossless(diffs) {
const diff_cleanupSemanticScore_ = (one, two) => {
if (!one || !two) {
return 6;
}
const char1 = one.charAt(one.length - 1);
const char2 = two.charAt(0);
const nonAlphaNumeric1 = char1.match(_diff_match_patch.nonAlphaNumericRegex_);
const nonAlphaNumeric2 = char2.match(_diff_match_patch.nonAlphaNumericRegex_);
const whitespace1 = nonAlphaNumeric1 && char1.match(_diff_match_patch.whitespaceRegex_);
const whitespace2 = nonAlphaNumeric2 && char2.match(_diff_match_patch.whitespaceRegex_);
const lineBreak1 = whitespace1 && char1.match(_diff_match_patch.linebreakRegex_);
const lineBreak2 = whitespace2 && char2.match(_diff_match_patch.linebreakRegex_);
const blankLine1 = lineBreak1 && one.match(_diff_match_patch.blanklineEndRegex_);
const blankLine2 = lineBreak2 && two.match(_diff_match_patch.blanklineStartRegex_);
if (blankLine1 || blankLine2) {
return 5;
} else if (lineBreak1 || lineBreak2) {
return 4;
} else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
return 3;
} else if (whitespace1 || whitespace2) {
return 2;
} else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
return 1;
}
return 0;
};
let pointer = 1;
while (pointer < diffs.length - 1) {
if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
let equality1 = diffs[pointer - 1][1];
let edit = diffs[pointer][1];
let equality2 = diffs[pointer + 1][1];
const commonOffset = this.diff_commonSuffix(equality1, edit);
if (commonOffset) {
const commonString = edit.substring(edit.length - commonOffset);
equality1 = equality1.substring(0, equality1.length - commonOffset);
edit = commonString + edit.substring(0, edit.length - commonOffset);
equality2 = commonString + equality2;
}
let bestEquality1 = equality1;
let bestEdit = edit;
let bestEquality2 = equality2;
let bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
while (edit.charAt(0) && edit.charAt(0) === equality2.charAt(0)) {
equality1 += edit.charAt(0);
edit = edit.substring(1) + equality2.charAt(0);
equality2 = equality2.substring(1);
const score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
if (score >= bestScore) {
bestScore = score;
bestEquality1 = equality1;
bestEdit = edit;
bestEquality2 = equality2;
}
}
if (diffs[pointer - 1][1] !== bestEquality1) {
if (bestEquality1) {
diffs[pointer - 1][1] = bestEquality1;
} else {
diffs.splice(pointer - 1, 1);
pointer--;
}
diffs[pointer][1] = bestEdit;
if (bestEquality2) {
diffs[pointer + 1][1] = bestEquality2;
} else {
diffs.splice(pointer + 1, 1);
pointer--;
}
}
}
pointer++;
}
}
/**
* Reduce the number of edits by eliminating operationally trivial equalities.
* @param {!Array.<!Diff>} diffs Array of diff tuples.
*/
diff_cleanupEfficiency(diffs) {
let changes = false;
const equalities = [];
let equalitiesLength = 0;
let lastEquality = null;
let pointer = 0;
let pre_ins = false;
let pre_del = false;
let post_ins = false;
let post_del = false;
while (pointer < diffs.length) {
if (diffs[pointer][0] === DIFF_EQUAL) {
if (diffs[pointer][1].length < this.Diff_EditCost && (post_ins || post_del)) {
equalities[equalitiesLength++] = pointer;
pre_ins = post_ins;
pre_del = post_del;
lastEquality = diffs[pointer][1];
} else {
equalitiesLength = 0;
lastEquality = null;
}
post_ins = false;
post_del = false;
} else {
if (diffs[pointer][0] === DIFF_DELETE) {
post_del = true;
} else {
post_ins = true;
}
if (lastEquality && (pre_ins && pre_del && post_ins && post_del || lastEquality.length < this.Diff_EditCost / 2 && pre_ins + pre_del + post_ins + post_del === 3)) {
diffs.splice(
equalities[equalitiesLength - 1],
0,
new Diff(DIFF_DELETE, lastEquality)
);
diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
equalitiesLength--;
lastEquality = null;
if (pre_ins && pre_del) {
post_ins = true;
post_del = true;
equalitiesLength = 0;
} else {
equalitiesLength--;
pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
post_ins = false;
post_del = false;
}
changes = true;
}
}
pointer++;
}
if (changes) {
this.diff_cleanupMerge(diffs);
}
}
/**
* Reorder and merge like edit sections. Merge equalities.
* @param {!Array.<!Diff>} diffs Array of diff tuples.
*/
diff_cleanupMerge(diffs) {
diffs.push(new Diff(DIFF_EQUAL, ""));
let pointer = 0;
let count_delete = 0;
let count_insert = 0;
let text_delete = "";
let text_insert = "";
let commonlength;
while (pointer < diffs.length) {
switch (diffs[pointer][0]) {
case DIFF_INSERT:
count_insert++;
text_insert += diffs[pointer][1];
pointer++;
break;
case DIFF_DELETE:
count_delete++;
text_delete += diffs[pointer][1];
pointer++;
break;
case DIFF_EQUAL:
if (count_delete + count_insert > 1) {
if (count_delete !== 0 && count_insert !== 0) {
commonlength = this.diff_commonPrefix(text_insert, text_delete);
if (commonlength !== 0) {
if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] === DIFF_EQUAL) {
diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
} else {
diffs.splice(0, 0, new Diff(
DIFF_EQUAL,
text_insert.substring(0, commonlength)
));
pointer++;
}
text_insert = text_insert.substring(commonlength);
text_delete = text_delete.substring(commonlength);
}
commonlength = this.diff_commonSuffix(text_insert, text_delete);
if (commonlength !== 0) {
diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
text_insert = text_insert.substring(0, text_insert.length - commonlength);
text_delete = text_delete.substring(0, text_delete.length - commonlength);
}
}
pointer -= count_delete + count_insert;
diffs.splice(pointer, count_delete + count_insert);
if (text_delete.length) {
diffs.splice(pointer, 0, new Diff(DIFF_DELETE, text_delete));
pointer++;
}
if (text_insert.length) {
diffs.splice(pointer, 0, new Diff(DIFF_INSERT, text_insert));
pointer++;
}
pointer++;
} else if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
diffs[pointer - 1][1] += diffs[pointer][1];
diffs.splice(pointer, 1);
} else {
pointer++;
}
count_insert = 0;
count_delete = 0;
text_delete = "";
text_insert = "";
break;
}
}
if (diffs[diffs.length - 1][1] === "") {
diffs.pop();
}
let changes = false;
pointer = 1;
while (pointer < diffs.length - 1) {
if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
if (diffs[pointer][1].substring(
diffs[pointer][1].length - diffs[pointer - 1][1].length
) === diffs[pointer - 1][1]) {
diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(
0,
diffs[pointer][1].length - diffs[pointer - 1][1].length
);
diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
diffs.splice(pointer - 1, 1);
changes = true;
} else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) === diffs[pointer + 1][1]) {
diffs[pointer - 1][1] += diffs[pointer + 1][1];
diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
diffs.splice(pointer + 1, 1);
changes = true;
}
}
pointer++;
}
if (changes) {
this.diff_cleanupMerge(diffs);
}
}
};

async function build_html6(change, opts = {}) {
let html = `
<div class="smart-changes diff-widget-line">
<span class="diff-line-buttons">
${change.moved_to ? `<i class="sc-moved-to">Moved to ${change.moved_to.join(":")}</i>` : ""}
${change.moved_from ? `<i class="sc-moved-from">Moved from ${change.moved_from.join(":")}</i>` : ""}

${change.moved_to ? "" : `
<button class="diff-button approve-button">Approve</button>
<button class="diff-button discard-button">Discard</button>
`}
</span>
`;
if (change.content) {
html += `<div class="sc-suggested"></div>`;
}
html += `</div>`;
return html;
}
async function render9(change, opts = {}) {
const html = await build_html6.call(this, change, opts);
const frag = this.create_doc_fragment(html);
post_process8.call(this, change, frag, opts);
return frag;
}
async function post_process8(change, frag, opts = {}) {
const better_render_markdown = async (text, change2) => {
if (text.match(/^[ \t]+-/)) {
text = "- remove\n" + text;
const rendered = await this.render_markdown(text, change2);
const first_li = rendered.querySelector("ul > li");
if (first_li && first_li.childNodes[0]) {
first_li.childNodes[0].remove();
}
if (first_li) {
first_li.style.listStyle = "none";
}
return rendered;
}
return await this.render_markdown(text, change2);
};
const btn_container = frag.querySelector(".diff-line-buttons");
if (btn_container) {
btn_container.addEventListener("mousedown", (e) => {
e.preventDefault();
e.stopPropagation();
});
}
const approveBtn = frag.querySelector(".approve-button");
if (approveBtn) {
approveBtn.addEventListener("click", async (e) => {
e.preventDefault();
e.stopPropagation();
await change.approve();
change.env.smart_editor_plugin.remove_change_decoration(change.key);
});
}
const discardBtn = frag.querySelector(".discard-button");
if (discardBtn) {
discardBtn.addEventListener("click", async (e) => {
e.preventDefault();
e.stopPropagation();
await change.discard();
change.env.smart_editor_plugin.remove_change_decoration(change.key);
});
}
const suggestedEl = frag.querySelector(".sc-suggested");
let finalSuggestedHTML = "";
let ogContent = change.original.trim() === "" ? change.original.replace(/([ ]{4})/gm, "	").replace(/\n/g, "<br>") : change.original.replace(/([ ]{4})/gm, "	");
const mdOriginal = await better_render_markdown(ogContent, change);
const finalOriginalHTML = html_from_fragment(mdOriginal);
if (change.content && change.content.length > 0 && suggestedEl) {
const mdSuggested = await better_render_markdown(change.content, change);
finalSuggestedHTML = html_from_fragment(mdSuggested);
}
if (suggestedEl) {
if (change.moved_from) {
suggestedEl.classList.add("sc-moved-from");
} else if (change.moved_to) {
suggestedEl.classList.add("sc-moved-to");
}
const suggested_result_innerHTML = highlight_after_markdown_render(
finalOriginalHTML,
finalSuggestedHTML,
1
);
suggestedEl.innerHTML = suggested_result_innerHTML;
}
return frag;
}
function html_from_fragment(fragment) {
return Array.from(fragment.childNodes).map((node) => node.innerHTML.trim()).join("\n");
}
function diff_text_nodes(oldText, newText, direction, doc) {
const fragment = doc.createDocumentFragment();
if (oldText === newText) {
fragment.appendChild(doc.createTextNode(newText));
return fragment;
}
const dmp = new diff_match_patch();
const diffs = dmp.diff_main(oldText, newText);
dmp.diff_cleanupSemantic(diffs);
for (const diff of diffs) {
const op = diff[0];
const textSegment = diff[1];
if (op === 0) {
fragment.appendChild(doc.createTextNode(textSegment));
} else if (op === direction) {
const span = doc.createElement("span");
span.className = "sc-sub-line-change";
span.appendChild(doc.createTextNode(textSegment));
fragment.appendChild(span);
}
}
return fragment;
}
function wrap_entire_node_as_change(node, direction, doc) {
const container = doc.createDocumentFragment();
const clone = node.cloneNode(true);
const span = doc.createElement("span");
span.className = "sc-sub-line-change";
span.appendChild(clone);
if (direction === 1 || direction === -1) {
container.appendChild(span);
} else {
container.appendChild(clone);
}
return container;
}
function merge_node_tree(oldNode, newNode, direction) {
const doc = oldNode?.ownerDocument || newNode?.ownerDocument;
if (!oldNode || !newNode || oldNode.nodeName !== newNode.nodeName) {
const nodeToWrap = direction === 1 ? newNode : oldNode;
const wrappedFrag = wrap_entire_node_as_change(nodeToWrap, direction, doc);
const container = doc.createElement("div");
while (wrappedFrag.firstChild) {
container.appendChild(wrappedFrag.firstChild);
}
return container;
}
if (oldNode.nodeType === 3 && newNode.nodeType === 3) {
return diff_text_nodes(oldNode.data, newNode.data, direction, doc);
}
const mergedEl = doc.createElement(newNode.nodeName);
if (newNode.attributes) {
for (let i = 0; i < newNode.attributes.length; i++) {
const attr = newNode.attributes[i];
mergedEl.setAttribute(attr.name, attr.value);
}
}
const oldChildren = oldNode.childNodes;
const newChildren = newNode.childNodes;
let idx = 0;
const len = Math.min(oldChildren.length, newChildren.length);
for (; idx < len; idx++) {
const oChild = oldChildren[idx];
const nChild = newChildren[idx];
if (oChild.nodeName === nChild.nodeName) {
const mergedChild = merge_node_tree(oChild, nChild, direction);
mergedEl.appendChild(mergedChild);
} else {
const docFrag = doc.createDocumentFragment();
const remainder = direction === 1 ? newChildren : oldChildren;
for (let j = idx; j < remainder.length; j++) {
const nodeToWrap = remainder[j];
const wrapped = wrap_entire_node_as_change(nodeToWrap, direction, doc);
while (wrapped.firstChild) {
docFrag.appendChild(wrapped.firstChild);
}
}
mergedEl.appendChild(docFrag);
return mergedEl;
}
}
if (direction === 1 && idx < newChildren.length) {
const docFrag = doc.createDocumentFragment();
for (let j = idx; j < newChildren.length; j++) {
const wrapped = wrap_entire_node_as_change(newChildren[j], 1, doc);
while (wrapped.firstChild) {
docFrag.appendChild(wrapped.firstChild);
}
}
mergedEl.appendChild(docFrag);
}
if (direction === -1 && idx < oldChildren.length) {
const docFrag = doc.createDocumentFragment();
for (let j = idx; j < oldChildren.length; j++) {
const wrapped = wrap_entire_node_as_change(oldChildren[j], -1, doc);
while (wrapped.firstChild) {
docFrag.appendChild(wrapped.firstChild);
}
}
mergedEl.appendChild(docFrag);
}
return mergedEl;
}
function highlight_after_markdown_render(old_innerHTML, new_innerHTML, direction = 1) {
if (old_innerHTML === new_innerHTML) {
return old_innerHTML;
}
const parser = new DOMParser();
const oldDoc = parser.parseFromString(old_innerHTML, "text/html");
const newDoc = parser.parseFromString(new_innerHTML, "text/html");
const merged = merge_node_tree(oldDoc.body, newDoc.body, direction);
return merged.innerHTML;
}

var smart_env_config3 = {
collections: {},
item_types: {},
components: {
change: render9,
draft_creator: render8
}
};

var SmartChangeTypeAdapter = class {
constructor(item) {
this.item = item;
}
init() {
}
get data() {
return this.item.data;
}
get change() {
return this.item.data.change;
}
/**
* Used by the change inbox or UI to select the correct rendering or logic for this type.
*/
static get component_key() {
return "change";
}
/**
* Called when the user (or system) approves this change.
* Typically updates the target file or item data.
* This should also update `this.item.data.state = 1` (approved).
*/
approve() {
}
/**
* Called when the user (or system) discards this change.
* Typically does nothing to the target content but sets item as discarded.
* This might mark `this.item.data.state = -1`.
*/
discard() {
}
};

var MoveContentChangeAdapter = class extends SmartChangeTypeAdapter {
static get component_key() {
return "move_content";
}
};

function get_changes_per_line(old_text, new_text, start_index = 0) {
if (!old_text || !new_text) {
return [];
}
const dmp = new diff_match_patch();
const diffs = dmp.diff_main(old_text, new_text);
dmp.diff_cleanupSemantic(diffs);
let old_pos = 0;
const changes = [];
for (const [op, text] of diffs) {
if (op === DIFF_EQUAL) {
old_pos += text.length;
} else if (op === DIFF_DELETE) {
const lines = text.split("\n");
for (let i = 0; i < lines.length; i++) {
const line = lines[i];
if (line === "") {
old_pos += 1;
continue;
}
const start = old_pos + start_index + 1;
const end = start + line.length;
changes.push({
start,
end,
text: line
});
old_pos += line.length;
if (i < lines.length - 1) {
old_pos += 1;
}
}
}
}
const merged = [];
for (const c of changes) {
const prev = merged[merged.length - 1];
if (prev && prev.end === c.start) {
prev.end = c.end;
prev.text += c.text;
} else {
merged.push(c);
}
}
return merged;
}

var DiffChangeAdapter = class extends SmartChangeTypeAdapter {
static get component_key() {
return "diff";
}
init() {
this.recalc_diffs();
}
recalc_old_lines(old_lines) {
this.change.old = recalc_lines(this.change, old_lines);
parse_old_text(this.change, old_lines);
this.data.old_hash = this.item.target.last_read.hash;
this.recalc_diffs();
}
recalc_diffs() {
const og_hash = murmur_hash_32_alphanumeric(this.change.original);
const new_hash = murmur_hash_32_alphanumeric(this.change.content);
if (og_hash !== this.change.og_hash || new_hash !== this.change.new_hash) {
this.change.diffs = get_changes_per_line(this.change.original, this.change.content);
this.change.og_hash = og_hash;
this.change.new_hash = new_hash;
}
return this.change.diffs;
}
async approve() {
const before = this.item.data.change.original;
const after = this.item.data.change.content;
const target = this.item.target;
if (!target)
return console.warn(`DiffChangeAdapter: no target found for item: ${this.item.key}`);
if (before.length && after.length) {
const content = await target.read({ render_output: false }) || "";
const updated_content = content.replace(before, after);
if (updated_content === content)
return console.warn(`DiffChangeAdapter: no changes made to target: ${target.key}`);
await target.update(updated_content);
} else if (after.length && this.item.change.anchor_end === 1) {
await target.append(after);
} else {
const content = await target.read({ render_output: false }) || "";
await target.update(after + "\n\n" + content);
}
this.item.data.state = 1;
this.item.queue_save();
}
async discard() {
this.item.data.state = -1;
this.item.queue_save();
}
};

var import_obsidian21 = require("obsidian");
var DraftNoteReviewModal = class extends import_obsidian21.Modal {
/**
* @param {Object} plugin - Your main plugin (or pass the environment as needed)
* @param {import('obsidian').TFile} tfile - The file recognized as a Draft Note
*/
constructor(plugin, tfile, change_target) {
super(plugin.app);
this.tfile = tfile;
this.plugin = plugin;
this.change_target = change_target;
this.fileContent = "";
}
open(tfile, change_target) {
this.tfile = tfile;
this.change_target = change_target;
super.open();
}
async onOpen() {
const { contentEl } = this;
contentEl.empty();
this.fileContent = await this.app.vault.read(this.tfile);
contentEl.createEl("h2", { text: `Draft Note Review: ${this.tfile.name}` });
contentEl.createEl("p", {
text: "This file is recognized as a Draft Note. You can review changes or skip for now."
});
const reviewBtn = contentEl.createEl("button", { text: "Review Changes" });
reviewBtn.addEventListener("click", async () => {
await this.handleReview();
this.close();
});
const skipBtn = contentEl.createEl("button", { text: "Skip" });
skipBtn.addEventListener("click", () => {
new import_obsidian21.Notice("Skipped draft review for now.");
this.close();
});
}
/**
* handleReview
* @description Reads the file content, parses changes into `smart_changes`, and optionally removes the 'draftNote' frontmatter.
*/
async handleReview() {
try {
const sc = this.plugin.env?.smart_changes;
if (!sc) {
new import_obsidian21.Notice("No smart_changes environment found. Cannot parse changes.");
return;
}
const targetKey = this.tfile.path;
const draft_content = await this.app.vault.read(this.tfile);
const pendingChanges = await sc.parse_changes_2(this.change_target, draft_content);
if (!pendingChanges?.length) {
new import_obsidian21.Notice("No changes found to parse from this Draft Note.");
} else {
new import_obsidian21.Notice(`Parsed ${pendingChanges.length} changes for '${targetKey}'.`);
}
const leaf = this.app.workspace.getLeaf();
const target_tfile = await this.app.vault.getFileByPath(this.change_target);
await leaf.openFile(target_tfile);
this.close();
} catch (err) {
console.error("Error parsing or reviewing draft note:", err);
new import_obsidian21.Notice(`Error reviewing draft note: ${err}`);
}
}
onClose() {
const { contentEl } = this;
contentEl.empty();
}
};

var import_view3 = require("@codemirror/view");
var import_state2 = require("@codemirror/state");

var css_sheet3 = new CSSStyleSheet();
css_sheet3.replaceSync(`.smart-context-review-file-list {
display: flex;
flex-direction: column;
gap: var(--size-4-2);
margin-bottom: var(--size-4-3);
}

.smart-context-item {
display: flex;
align-items: center;
gap: var(--size-2-2);
}
.smart-context-remove-btn {
background-color: var(--interactive-accent);
color: var(--text-on-accent);
border: none;
border-radius: var(--radius-s);
padding: var(--size-4-2) var(--size-4-3);
font-size: var(--font-text-size);
cursor: pointer;
box-shadow: var(--shadow-s);
transition: transform var(--anim-duration-fast) var(--anim-motion-smooth);
&:hover {
transform: scale(1.03);
}
}`);
var context_reviewer_default = css_sheet3;

function build_html7(context, opts = {}) {
if (!context || !context.data) {
return '<div class="context-review"><p>(No context)</p></div>';
}
const context_items = Object.entries(context.data.context_items || {});
if (!context_items.length) {
return '<div class="context-review"><p>(No context items)</p></div>';
}
const review_html = context_items.map(([item_key, item_score]) => {
const pct = typeof item_score === "number" && item_score < 1 ? `(${Math.round(item_score * 100)}%) ` : "";
return `
<div class="smart-context-item" data-item-key="${escape_html(item_key)}">
<button
type="button"
class="smart-context-remove-btn"
aria-label="Remove context item"
>\xD7</button>
<span class="smart-context-item-content">
${pct}
<a class="internal-link"
data-href="${escape_html(item_key)}"
data-path="${escape_html(item_key)}"
href="#"
>${item_key}</a>
</span>
</div>
`;
}).join("");
return `
<div class="context-review">
<div class="smart-context-review-file-list">
${review_html}
</div>
</div>
`;
}
async function render10(context, opts = {}) {
const html = build_html7(context, opts);
const frag = this.create_doc_fragment(html);
this.apply_style_sheet(context_reviewer_default);
post_process9.call(this, context, frag, opts);
return frag;
}
function post_process9(context, frag, opts = {}) {
const env = context?.env;
const plugin = env?.smart_chat_plugin;
const container = frag.querySelector(".context-review");
if (!container)
return frag;
const linkEls = container.querySelectorAll(".internal-link");
linkEls.forEach((linkEl) => {
linkEl.addEventListener("mouseover", (ev) => {
plugin?.app?.workspace.trigger("hover-link", {
event: ev,
source: "smart-chat",
hoverParent: linkEl,
targetEl: linkEl,
linktext: linkEl.dataset.href
});
});
linkEl.addEventListener("dragstart", (ev) => {
const file_path = linkEl.dataset.href.split("#")[0];
const file = plugin?.app?.metadataCache?.getFirstLinkpathDest(file_path, "");
const drag_data = plugin?.app?.dragManager?.dragFile(ev, file);
plugin?.app?.dragManager?.onDragStart(ev, drag_data);
});
linkEl.addEventListener("click", (ev) => {
ev.preventDefault();
plugin?.app?.workspace.openLinkText(linkEl.dataset.href, "/", false);
});
});
const removeButtons = container.querySelectorAll(".smart-context-remove-btn");
removeButtons.forEach((btn) => {
btn.addEventListener("click", () => {
const parentItem = btn.closest(".smart-context-item");
if (!parentItem)
return;
const key = parentItem.dataset.itemKey;
if (key && context.data.context_items[key]) {
delete context.data.context_items[key];
}
parentItem.remove();
});
});
return frag;
}
function escape_html(str) {
return str.replace(/[&<>"']/g, (m) => {
switch (m) {
case "&":
return "&amp;";
case "<":
return "&lt;";
case ">":
return "&gt;";
case '"':
return "&quot;";
case "'":
return "&#39;";
}
return m;
});
}

smart_completions_default_config.completion_adapters["SmartCompletionDraftAdapter"] = SmartCompletionDraftAdapter;
var SmartEditorPlugin = class extends import_obsidian22.Plugin {
smart_env_config = {
collections: {
smart_changes: {
collection_key: "smart_changes",
class: SmartChanges,
data_adapter: ajson_multi_file_default,
change_adapters: {
move_content: MoveContentChangeAdapter,
diff: DiffChangeAdapter
}
},
smart_completions: smart_completions_default_config,
smart_contexts: smart_contexts_default_config,
smart_templates: smart_templates_default_config
},
item_types: {
SmartChange,
SmartTemplate,
SmartCompletion
},
modules: {
smart_chat_model: {
class: SmartChatModel,
adapters: {
anthropic: SmartChatModelAnthropicAdapter,
azure: SmartChatModelAzureAdapter,
custom: SmartChatModelCustomAdapter,
gemini: SmartChatModelGeminiAdapter,
groq: SmartChatModelGroqAdapter,
lm_studio: SmartChatModelLmStudioAdapter,
ollama: SmartChatModelOllamaAdapter,
open_router: SmartChatModelOpenRouterAdapter,
openai: SmartChatModelOpenaiAdapter
},
http_adapter: new SmartHttpRequest2({
adapter: SmartHttpObsidianRequestAdapter2,
obsidian_request_url: import_obsidian23.requestUrl
})
}
},
components: {
draft_creator: render8,
context_reviewer: render10
},
default_settings: {
smart_editor_plugin: {
smart_completions: {
chat_model: {
adapter: "openai"
}
}
}
}
};
onload() {
SmartEnv2.create(this, merge_env_config(smart_env_config3, this.smart_env_config));
this.app.workspace.onLayoutReady(this.initialize.bind(this));
}
async initialize() {
await SmartEnv2.wait_for({ loaded: true });
this.addCommand({
id: "merge-active-file-into-target",
name: "Merge active file into target",
callback: () => {
new MergeFileModal(this.app, this).open();
}
});
this.addCommand({
id: "create-draft-and-review",
name: "Create draft (Generate with AI)",
checkCallback: (checking) => {
if (checking && this.app.workspace.getActiveFile()?.path)
return true;
new DraftCreatorModal(this.app, this).open();
}
});
this.addCommand({
id: "create-manual-draft",
name: "Create draft (Manual input)",
callback: () => {
new CreateDraftManualModal(this.app, this).open();
}
});
this.addSettingTab(new SmartEditorSettingTab(this.app, this));
this.registerEditorExtension(changes_cm_state_field);
this.registerEvent(
this.app.workspace.on("active-leaf-change", (leaf) => {
if (this.debounce_leaf_change) {
clearTimeout(this.debounce_leaf_change);
}
this.debounce_leaf_change = setTimeout(() => {
this.debounce_leaf_change = null;
const current_tfile = leaf.view.file;
if (!current_tfile) {
return;
}
const frontmatter = this.get_frontmatter(current_tfile);
const change_target = frontmatter?.["change target"];
if (change_target) {
console.log("Smart Editor: DraftNote detected (has change_target)");
return this.open_draft_confirmation(current_tfile, change_target);
}
if (this.env.smart_changes.get_pending_changes(current_tfile.path).length) {
console.log("Smart Editor: Pending changes found");
this.render_pending_changes(current_tfile.path);
} else {
}
}, 100);
})
);
this.registerEvent(
this.app.vault.on("modify", (file) => {
if (this.debounce_vault_modify) {
clearTimeout(this.debounce_vault_modify);
}
this.debounce_vault_modify = setTimeout(() => {
this.debounce_vault_modify = null;
const current_tfile = this.app.workspace.getActiveFile();
if (current_tfile?.path === file.path) {
this.render_pending_changes(file.path);
}
}, 100);
})
);
this.registerEvent(
this.app.vault.on("create", async (new_file) => {
const frontmatter = this.get_frontmatter(new_file);
const change_target = frontmatter?.change_target || frontmatter?.draftTarget;
if (change_target) {
const leaf = this.app.workspace.getLeaf("split", "vertical");
await leaf.openFile(new_file);
}
})
);
this.registerEditorExtension(import_state2.EditorState.transactionFilter.of((tr) => this.transaction_filter(tr, this)));
}
transaction_filter(tr, plugin) {
if (!tr.docChanged)
return tr;
if (this.debounce_remove_decorations) {
clearTimeout(this.debounce_remove_decorations);
}
this.debounce_remove_decorations = setTimeout(() => {
this.debounce_remove_decorations = null;
plugin.remove_all_decorations();
plugin.render_pending_changes(plugin.app.workspace.getActiveFile().path);
}, 100);
return tr;
}
open_draft_confirmation(current_tfile, change_target) {
if (!this._draft_confirmation_modal) {
this._draft_confirmation_modal = new DraftNoteReviewModal(this, current_tfile, change_target);
}
this._draft_confirmation_modal.open(current_tfile, change_target);
}
/**
* Retrieves frontmatter from Obsidian's metadata cache, falling back to empty object if none.
* @param {TFile} tfile - The file whose frontmatter should be returned
* @returns {Object} The frontmatter object (or empty object if not found)
*/
get_frontmatter(tfile) {
const cache = this.app.metadataCache.getFileCache(tfile);
return cache?.frontmatter || {};
}
onunload() {
this.env?.unload_main(this);
console.log("unloaded smart_editor_plugin");
}
async render_pending_changes(file_path) {
const pending_changes = this.env.smart_changes.get_pending_changes(file_path);
if (!pending_changes?.length) {
return;
}
const editor_view = this.get_editor_view();
if (!editor_view) {
console.log("Smart Editor: No editor view found");
return;
}
const content = await pending_changes[0].target.read({ render_output: false });
const old_content_lines = content.split("\n");
for (const change of pending_changes) {
if (change.lines_changed) {
change.recalc_old_lines(old_content_lines);
}
}
const diff_deco = create_diff_decorations(pending_changes, editor_view);
editor_view.dispatch({
effects: set_diff_deco_effect.of(diff_deco)
});
this.decorations = diff_deco;
}
remove_all_decorations() {
const editor_view = this.get_editor_view();
if (!editor_view) {
console.log("Smart Editor: No editor view found to remove all decorations");
return;
}
editor_view.dispatch({
effects: set_diff_deco_effect.of(import_view3.Decoration.none),
changes: { from: 0, to: 0, insert: "" }
});
this.decorations = null;
}
/**
* Removes decorations for a single change from the editor.
* @param {string} changeKey
*/
remove_change_decoration(changeKey) {
const editor_view = this.get_editor_view();
if (!editor_view) {
console.log("Smart Editor: No editor view found to remove change decoration");
return;
}
editor_view.dispatch({
effects: remove_diff_deco_effect.of(changeKey)
});
}
get chat_model() {
return this.env.init_module("smart_chat_model", {
model_config: {},
settings: this.settings.smart_completions.chat_model,
reload_model: this.open_settings?.bind(this),
re_render_settings: this.open_settings?.bind(this)
});
}
async open_settings() {
console.log("Smart Editor: Opening settings");
await this.app.setting.open();
await this.app.setting.openTabById("smart-editor");
}
get settings() {
return this.env.settings.smart_editor_plugin;
}
get_editor_view() {
const file = this.app.workspace.getActiveFile();
if (!file) {
console.log("Smart Editor: No active file found");
return null;
}
const markdown_view = this.app.workspace.getActiveFileView();
if (!markdown_view) {
console.log("Smart Editor: No active file view found");
return null;
}
return markdown_view.editor?.cm || null;
}
};
var main_default = SmartEditorPlugin;
