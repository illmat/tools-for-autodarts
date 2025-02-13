export default class XMLHttpRequestInterceptor {
  private static originalOpen = XMLHttpRequest.prototype.open;

  static enable(callback: (url: string, response: any) => void): void {
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string,
      async: boolean = true,
      username?: string | null,
      password?: string | null): void {
      this.addEventListener("load", () => {
        try {
          if (this.responseType !== "blob") {
            const parsed = JSON.parse(this.responseText);
            callback(this.responseURL, parsed);
          }
        } catch (error) {
          console.error("failed to parse response", url, error);
        }
      });
      return XMLHttpRequestInterceptor.originalOpen.call(this, method, url, async, username, password);
    };
  }

  static disable(): void {
    XMLHttpRequest.prototype.open = XMLHttpRequestInterceptor.originalOpen;
  }
}
