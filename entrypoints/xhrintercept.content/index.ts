import { injectScript } from "@/utils/inject";

export default defineContentScript({
  matches: [ "*://play.autodarts.io/*" ],
  // runAt: "document_start",
  // world: "MAIN",
  allFrames: true,
  async main() {
    console.log("inject interceptor");

    await injectScript("/interceptor.js", {
      keepInDom: true,
    });
  },
});
