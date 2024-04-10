import { AutodartsToolsMatchStatus } from "@/utils/storage";
import type { IMatchStatus, IPlayerInfo } from "@/utils/storage";
import { getDartsThrown } from "@/utils/getElements";

export async function setPlayerInfo() {
  try {
    const editPlayerThrowActive = document.querySelector(".ad-ext-turn-throw.css-6pn4tf");
    const hasWinner = document.querySelector(".ad-ext-player-winner");

    const playerCount = document.getElementById("ad-ext-player-display")?.children.length || 0;

    const turnContainerEl = document.getElementById("ad-ext-turn");
    const throws = [ ...turnContainerEl?.querySelectorAll(".ad-ext-turn-throw") as NodeListOf<HTMLElement> ].map(el => el.innerText);
    const turnPoints = document.querySelector<HTMLElement>(".ad-ext-turn-points")?.innerText.trim();

    const matchStatus: IMatchStatus = await AutodartsToolsMatchStatus.getValue();

    const playerInfo: IPlayerInfo[] = [ ...document.querySelectorAll(".ad-ext-player") ].map((playerCardEl) => {
      const playerStatsEl = playerCardEl.nextElementSibling?.children[0] as HTMLElement;

      const matchhasLegs = playerStatsEl.children[0].children.length > 0;
      const matchhasSets = playerStatsEl.children[0].children.length > 1;

      return {
        name: playerCardEl.querySelector(".ad-ext-player-name")?.textContent || "",
        score: playerCardEl.querySelector(".ad-ext-player-score")?.textContent?.trim() || "",
        isActive: playerCardEl.classList.contains("ad-ext-player-active"),
        ...(matchhasLegs && { legs: playerStatsEl?.children[0]?.children[matchhasSets ? 1 : 0]?.textContent?.trim() }),
        ...(matchhasSets && { sets: playerStatsEl?.children[0]?.children[0]?.textContent?.trim() }),
        darts: getDartsThrown(playerCardEl as HTMLElement),
        stats: playerStatsEl?.querySelector(":scope > div > p")?.textContent?.split("|")[1].trim(),
      };
    });

    await AutodartsToolsMatchStatus.setValue({
      ...matchStatus,
      playerCount,
      throws,
      turnPoints,
      isInEditMode: !!editPlayerThrowActive,
      hasWinner: !!hasWinner,
      playerInfo,
    });
  } catch (e) {
    console.error("Autodarts Tools: Set Player Info - Error: ", e);
  }
}
