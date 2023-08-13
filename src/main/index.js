import { injectJsError } from "./lib/jsError";
import { injectXhrError } from "./lib/xhrError";
import { injectFetchError } from "./lib/fetchError";
import { blankScreen } from "./lib/blankScreen";
injectJsError()
injectXhrError()
injectFetchError()
blankScreen()