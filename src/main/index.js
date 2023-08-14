import { injectJsError } from "./lib/jsError";
import { injectXhrError } from "./lib/xhrError";
import { injectFetchError } from "./lib/fetchError";
import { blankScreen } from "./lib/blankScreen";
import { timing } from "./lib/timing";
injectJsError();
injectXhrError();
injectFetchError();
blankScreen();
timing();