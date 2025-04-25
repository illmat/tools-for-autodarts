import type { IConfig } from "@/utils/storage";
import {
  AutodartsToolsConfig,
  AutodartsToolsUrlStatus,
} from "@/utils/storage";
import type { GameMode, IGameData } from "@/utils/game-data-storage";
import { AutodartsToolsGameData } from "@/utils/game-data-storage";
import { waitForElement, waitForElementWithTextContent } from "@/utils";
import { isSafari, isiOS } from "@/utils/helpers";

export default defineContentScript({
  matches: [ "*://play.autodarts.io/*" ],
  cssInjectionMode: "ui",
  async main() {
    AutodartsToolsUrlStatus.watch(async (url: string) => {
      if (!url && (isiOS() || isSafari())) url = window.location.href;

      const config: IConfig = await AutodartsToolsConfig.getValue();
      if (/\/lobbies\/*new\//.test(url)) {
        console.log("Autodarts Tools: Lobby New Ready");

        const gameData: IGameData = await AutodartsToolsGameData.getValue();
        const gameModeTitle = await waitForElement("h2");
        const buttonPublic = await waitForElementWithTextContent("button", "Public");
        const buttonPrivate = await waitForElementWithTextContent("button", "Private");

        await AutodartsToolsGameData.setValue({
          ...gameData,
          gameMode: gameModeTitle.textContent as GameMode,
        });

        console.log("Autodarts Tools: Game Mode", gameModeTitle.textContent);

        buttonPublic?.addEventListener("click", async () => {
          await AutodartsToolsGameData.setValue({
            ...gameData,
            private: false,
          });
          console.log("Autodarts Tools: Lobby is Public");
        });

        buttonPrivate?.addEventListener("click", async () => {
          await AutodartsToolsGameData.setValue({
            ...gameData,
            private: true,
          });
          console.log("Autodarts Tools: Lobby is Private");
        });

        // check if buttonPublic or buttonPrivate has data-active attribute and set the private state accordingly
        if (buttonPublic?.hasAttribute("data-active")) {
          await AutodartsToolsGameData.setValue({
            ...gameData,
            private: false,
          });
          console.log("Autodarts Tools: Lobby is Public");
        } else if (buttonPrivate?.hasAttribute("data-active")) {
          await AutodartsToolsGameData.setValue({
            ...gameData,
            private: true,
          });
          console.log("Autodarts Tools: Lobby is Private");
        }
      }
    });
  },
});
