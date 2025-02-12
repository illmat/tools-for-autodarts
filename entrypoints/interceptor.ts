interface XMLHttpRequestWithIntercept extends XMLHttpRequest {
  interceptedUrl?: string | URL;
}

export default defineUnlistedScript(() => {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequestWithIntercept,
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null,
  ): void {
    this.interceptedUrl = url;

    return originalOpen.call(this, method, url, async, username, password);
  };

  XMLHttpRequest.prototype.send = function (
    this: XMLHttpRequestWithIntercept,
    body?: Document | XMLHttpRequestBodyInit | null,
  ): void {
    this.addEventListener("readystatechange", () => {
      if (this.readyState === 4 && this.status === 200) {
        try {
          const parsedResponse = JSON.parse(this.responseText);
          console.log(`Response: ${this.interceptedUrl}`, parsedResponse);
        } catch (e) {
          console.error("Error intercepting response:", e);
        }
      }
    });

    return originalSend.call(this, body);
  };
});
