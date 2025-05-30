<template>
  <div v-if="configVisible" id="autodarts-tools-config" class="mx-auto w-full p-4 pr-8 lg:pr-4">
    <PageConfig />
  </div>
  <template v-if="trainingVisible">
    <TrainingsInfo />
  </template>
</template>

<script setup lang="ts">
import PageConfig from "@/components/PageConfig.vue";
import TrainingsInfo from "@/components/TrainingsInfo.vue";
import { waitForElement } from "@/utils";
import { AutodartsToolsConfig, AutodartsToolsUrlStatus, defaultConfig } from "@/utils/storage";

const menuIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M8.8 21H5q-.825 0-1.412-.587T3 19v-3.8q1.2 0 2.1-.762T6 12.5q0-1.175-.9-1.937T3 9.8V6q0-.825.588-1.412T5 4h4q0-1.05.725-1.775T11.5 1.5q1.05 0 1.775.725T14 4h4q.825 0 1.413.588T20 6v4q1.05 0 1.775.725T22.5 12.5q0 1.05-.725 1.775T20 15v4q0 .825-.587 1.413T18 21h-3.8q0-1.25-.787-2.125T11.5 18q-1.125 0-1.912.875T8.8 21\"/></svg>";

let observer = new MutationObserver(() => {});
const currentUrl = ref();
const configVisible = ref(false);
const trainingVisible = ref(true);
const isConfigPage = ref(true);
const navigationCheckInterval = ref();
const isMobileNav = ref();
const lastVisitedUrl = useStorage("adt:last-visited-url", "");

watch(currentUrl, async (newURL, oldURL) => {
  lastVisitedUrl.value = newURL;

  // Only update AutodartsToolsUrlStatus if URL starts with https
  if (newURL && newURL.startsWith("https")) {
    await AutodartsToolsUrlStatus.setValue(newURL.split("#")[0] || "undefined");
  }

  if (newURL !== oldURL && oldURL) {
    useGlobalEvent("url:changed", newURL);

    if (newURL.includes("/tools") && !configVisible.value) {
      configVisible.value = true;
    } else if (!newURL.includes("/tools") && configVisible.value) {
      configVisible.value = false;
    }
  }
});

watch(configVisible, async () => {
  const pageContentElement = await waitForElement("#root > div > div:nth-of-type(2)", 15000);
  const contentElements = Array.from(pageContentElement.children).filter(el => el.tagName !== "AUTODARTS-TOOLS-WXT") as HTMLElement[];

  if (configVisible.value) {
    contentElements.forEach((el) => {
      el.style.display = "none";
    });
  } else {
    contentElements.forEach((el) => {
      el.style.display = "flex";
    });
  }
});

watch(isMobileNav, (value, oldValue) => {
  if (oldValue === null || oldValue === undefined) return;
  console.log("Mobile Nav changed", value, oldValue);
  initMenu();
});

onMounted(async () => {
  const url = await AutodartsToolsUrlStatus.getValue();
  const wasLastInTools = lastVisitedUrl.value.includes("/tools");

  /**
   * This is a workaround to fix the url not being set correctly
   * when the page is loaded.
   */
  AutodartsToolsUrlStatus.setValue("");
  await nextTick();
  AutodartsToolsUrlStatus.setValue(url);

  currentUrl.value = "";
  await nextTick();
  currentUrl.value = window.location.href;
  isConfigPage.value = url.includes("/tools") || wasLastInTools;

  if (isConfigPage.value) {
    window.history.pushState(null, "", "/tools");

    await nextTick();

    isConfigPage.value = false;
  }

  startObserver();

  initMenu().catch(console.error);

  await waitForElement("#root > div > div > .chakra-stack", 15000);

  const collapseButton = document.querySelector("button[aria-label='Collapse side bar']") as HTMLButtonElement | null;
  if (collapseButton) collapseButton.addEventListener("click", initMenu);

  const config = await AutodartsToolsConfig.getValue();
  await AutodartsToolsConfig.setValue({
    ...JSON.parse(JSON.stringify(defaultConfig)),
    ...JSON.parse(JSON.stringify(config)),
  });
});

onBeforeUnmount(() => {
  observer.disconnect();
  clearInterval(navigationCheckInterval.value);
  const collapseButton = document.querySelector("button[aria-label='Collapse side bar']") as HTMLButtonElement | null;
  if (collapseButton) collapseButton.removeEventListener("click", initMenu);
});

async function initMenu() {
  if (navigationCheckInterval.value) clearInterval(navigationCheckInterval.value);

  // check if element with id "autodarts-tools-menu-item" is already present. if yes, delete it
  const existingMenuItem = document.getElementById("autodarts-tools-menu-item");
  if (existingMenuItem) existingMenuItem.remove();

  const menu = await waitForElement("#root > div > div > .chakra-stack", 15000);
  // get last element of the menu
  const menuItemTemplate = menu.lastElementChild;
  if (!menuItemTemplate) return;

  const menuItem = menuItemTemplate.cloneNode(true) as HTMLElement;
  menuItem.removeAttribute("href");
  const withText = menuItem.innerText.length > 0;
  menuItem.id = "autodarts-tools-menu-item";
  menuItem.innerHTML = "";
  menuItem.style.cursor = "pointer";

  menuItem.innerHTML += menuIcon;

  if (withText) {
    menuItem.innerHTML += "Tools";
    menuItem.querySelector("svg")!.style.marginRight = "0.5rem";
  }

  menuItem.addEventListener("click", () => {
    configVisible.value = true;

    const settingsButton = document.querySelector("a[href='/settings']") as HTMLAnchorElement | null;
    settingsButton?.click();

    window.history.pushState(null, "", "/tools");
  });

  menu.appendChild(menuItem);

  navigationCheckInterval.value = setInterval(checkNavigation, 1000);
}

function startObserver() {
  const targetNode = document.getElementById("root");
  if (!targetNode) {
    console.error("Target node not found");
    return;
  }
  observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (window.location.href !== currentUrl.value) {
          currentUrl.value = window.location.href;
        }
      }
    }
  });
  observer.observe(targetNode, { childList: true, subtree: true });
}

function checkNavigation() {
  const navigationElement = document.querySelector("#root > div > div");

  // get width of navigationElement
  const width = navigationElement?.getBoundingClientRect().width;

  // if width < 170, find element with id "autodarts-tools-menu-item" and remove it's text but not the svg in it
  if (width && width < 170) {
    const menuItem = document.getElementById("autodarts-tools-menu-item");
    if (menuItem) {
      menuItem.innerHTML = menuIcon;
    }
    isMobileNav.value = false;
  } else if (width && width > 200) {
    const menuItem = document.getElementById("autodarts-tools-menu-item");
    if (menuItem) {
      menuItem.innerHTML = menuIcon;
    }
    isMobileNav.value = true;
  } else {
    const menuItem = document.getElementById("autodarts-tools-menu-item");
    if (menuItem) {
      menuItem.innerHTML = `${menuIcon} Tools`;
      menuItem.querySelector("svg")!.style.marginRight = "0.5rem";
    }
    isMobileNav.value = false;
  }
}
</script>
