import XMLHttpRequestInterceptor from "@/utils/XMLHttpRequestInterceptor";

export default defineUnlistedScript(() => {
  XMLHttpRequestInterceptor.enable((url, response) => {
    console.log(url, response);
  });
});
