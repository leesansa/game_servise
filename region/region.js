/* [추가] 마을 상세 화면과 오른쪽 목록의 스크롤 동기화 */
(() => {
  // ===== 1. 요소 및 상태 =====
  const sections = [
    ...document.querySelectorAll(".region-detail[data-village-index]"),
  ];
  const navigation = document.querySelector(".village-index");
  const items = [...document.querySelectorAll(".village-index li")];
  if (!navigation || sections.length === 0 || sections.length !== items.length)
    return;

  let activeIndex = -1;
  let framePending = false;

  // ===== 2. 선택 표시: 흰색 바 · 글자색 · 마름모 · 접근성 =====
  function selectVillage(index) {
    const item = items[index];
    navigation.style.setProperty("--village-offset", `${item.offsetTop}px`);
    if (index === activeIndex) return;

    activeIndex = index;
    items.forEach((entry, entryIndex) => {
      const selected = entryIndex === index;
      entry.classList.toggle("selected", selected);
      const link = entry.querySelector("a");
      if (selected) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  // ===== 3. 스크롤 위치에 맞는 마을 찾기 =====
  function updateFromScroll() {
    framePending = false;
    const viewportCenter = window.innerHeight / 2;
    let index = 0;
    sections.forEach((section, sectionIndex) => {
      if (section.getBoundingClientRect().top <= viewportCenter)
        index = sectionIndex;
    });
    selectVillage(index);
  }

  // ===== 4. 이벤트: 프레임마다 한 번만 스크롤 상태 계산 =====
  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateFromScroll);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);

  // ===== [추가] 5. 상세 자료: 준비물 / 주변 탐험 / 이동 / 아이템 관리 / 회복 =====
  // 제공된 마을 소개를 바탕으로 작성한 방문 안내입니다.
  const detailTitles = [
    "탐험 준비",
    "주변 탐험",
    "이동 안내",
    "아이템 관리",
    "휴식과 회복",
  ];
  const villageDetails = [
    [
      "튜토리얼을 마쳤다면 장비 착용 상태와 회복 물약을 먼저 확인하세요. 주변 탐험은 짧은 거리부터 시작하고, 소모품이 부족해지면 마을로 돌아와 준비하세요.",
      "말하는 섬 외곽은 낮은 레벨 몬스터를 상대하며 전투를 익히는 구간입니다. 한 번에 여러 적을 상대하기보다 공격 거리와 회복 타이밍을 익혀 보세요.",
      "처음에는 말하는 섬 마을을 귀환 기준점으로 삼으세요. 탐험 전에 현재 위치와 돌아올 경로를 확인하면 낯선 지역에서도 방향을 잡기 쉽습니다.",
      "퀘스트에 필요한 아이템과 사용 중인 장비를 먼저 구분하세요. 주운 아이템을 정리해 다음 탐험에서 사용할 물약과 전리품의 공간을 확보하세요.",
      "전투를 멈춘 뒤 안전한 위치에서 체력과 마나 상태를 확인하세요. 물약을 충분히 준비하고, 다음 퀘스트의 목표와 이동 경로를 점검한 뒤 출발하세요.",
    ],
    [
      "말하는 섬을 떠나 본토를 탐험하기 전에 장비와 소모품을 점검하세요. 역사 깊은 글루딘 마을은 주변 지역으로 이동하기 전 준비를 정리하기 좋은 기준점입니다.",
      "글루딘은 말하는 섬 다음으로 세워진 마을로 다양한 편의 시설을 갖추고 있습니다. 먼저 마을 안을 둘러보며 필요한 시설의 위치와 주변 출구를 확인하세요.",
      "본토의 낯선 길에서는 마을을 기준으로 이동 방향을 기록하세요. 멀리 떠나기 전에 되돌아올 방법을 확인하고, 탐험 구간을 나누어 이동하세요.",
      "시설을 이용하기 전에 구매할 소모품과 정리할 아이템을 따로 확인하세요. 아이템 설명을 읽고 필요한 장비나 퀘스트 아이템을 실수로 처분하지 않도록 주의하세요.",
      "먼 거리를 이동했다면 마을에서 전투 준비를 다시 점검하세요. 체력과 마나, 소모품 잔량을 확인한 뒤 다음 목적지로 출발하세요.",
    ],
    [
      "요정 클래스의 초보자 퀘스트 이후 방문하는 마을입니다. 자신의 무기와 공격 방식에 필요한 소모품을 확인하고, 던전에 들어갈 계획이라면 회복 수단도 준비하세요.",
      "마을 서쪽에는 요정 숲 던전 입구가 있습니다. 입구까지의 길을 익힌 뒤 장비와 전투 숙련도에 맞춰 탐험 범위를 조금씩 넓혀 보세요.",
      "마을에서 서쪽 방향을 확인하고 던전 입구를 목표로 이동하세요. 던전 내부에 진입하기 전에는 마을로 돌아올 경로와 수단을 다시 확인하세요.",
      "필요한 전투 소모품과 퀘스트 아이템을 구분해 챙기세요. 던전에서 얻은 전리품을 정리할 공간을 남기고, 불필요한 아이템으로 짐이 늘지 않게 관리하세요.",
      "숲이나 던전에서 연속 전투를 했다면 안전한 곳에서 상태를 점검하세요. 체력과 마나가 부족하면 탐험을 멈추고 충분히 준비한 뒤 다시 진입하세요.",
    ],
    [
      "기사 클래스가 초보자 퀘스트 이후 도착하는 마을입니다. 근접 전투에 사용하는 장비를 확인하고, 적에게 접근할 때 사용할 회복 물약을 준비하세요.",
      "마을 서쪽 외곽에는 수련 던전 입구가 있습니다. 짧은 전투부터 시작해 적과의 거리, 공격 속도, 물약 사용 타이밍을 익히세요.",
      "은기사 마을을 기준으로 서쪽 외곽으로 이동하면 수련 던전 방향을 확인할 수 있습니다. 진입 전에 돌아올 길을 익히고 무리한 연속 전투는 피하세요.",
      "탐험에서 얻은 장비와 현재 착용한 장비를 비교한 뒤 정리하세요. 전리품이 늘어날 공간을 확보하고 전투 중 필요한 물약을 쉽게 찾을 수 있게 배치하세요.",
      "근접 전투 후에는 남은 체력과 소모품을 먼저 확인하세요. 회복 준비가 부족하다면 마을로 돌아와 다음 전투를 위한 상태를 정비하세요.",
    ],
    [
      "기란은 여러 사냥터와 상인이 모인 큰 마을입니다. 용의 계곡이나 기란 던전을 방문할 계획이라면 목적지에 맞춰 장비와 회복 물약을 충분히 준비하세요.",
      "주변에는 용의 계곡과 기란 던전이 있으며, 마을 가까이에는 혈맹 아지트가 배치되어 있습니다. 개인 탐험과 혈맹 활동의 목적지를 구분해 동선을 계획하세요.",
      "넓은 마을에서는 먼저 목적지와 출구를 확인하세요. 동료와 함께 이동한다면 기란 마을 안에서 만날 위치를 정한 뒤 사냥터로 출발하세요.",
      "다양한 상인을 둘러보며 필요한 물품을 확인하세요. 구매 전 아이템 설명과 비용을 살펴보고, 판매할 전리품과 보관할 장비를 구분하세요.",
      "다음 사냥이나 혈맹 활동 전에는 마을에서 체력과 마나를 점검하세요. 동료의 준비 상태와 회복 물약 잔량도 확인한 뒤 함께 출발하세요.",
    ],
    [
      "켄트에서 윈다우드 필드로 이동할 계획이라면 회복 물약과 돌아올 수단을 먼저 준비하세요. 사막 지역에서 오래 이동할수록 소모품 잔량을 자주 확인하세요.",
      "켄트는 윈다우드 필드와 가까운 마을입니다. 사막의 개미류와 전갈형 몬스터를 목표로 탐험할 때는 이동 중 다른 적이 합류하지 않는지 살피세요.",
      "마을을 기준점으로 삼아 사막 방향과 돌아올 경로를 확인하세요. 탐험 구간을 짧게 나누고, 길을 잃거나 준비가 부족해지면 마을로 돌아오세요.",
      "사막 탐험에 필요한 소모품과 전리품의 공간을 함께 확보하세요. 얻은 아이템을 주기적으로 정리해 다음 전투에 필요한 물약을 찾기 쉽게 유지하세요.",
      "사막에서 전투를 이어가기 전 체력과 물약 잔량을 확인하세요. 여러 몬스터에게 둘러싸였다면 안전한 방향으로 빠져나와 회복 준비를 다시 점검하세요.",
    ],
    [
      "오렌 주변은 강력한 몬스터가 등장하는 탐험 구간입니다. 상아탑, 설벽, 엘모어 지역 중 목적지를 먼저 정하고 장비와 회복 소모품을 점검하세요.",
      "가까운 상아탑과 북쪽 오렌 설벽, 동남쪽 엘모어 지역이 주요 탐험 방향입니다. 설벽의 설원 몬스터와 엘모어의 언데드 몬스터를 구분해 탐험 계획을 세우세요.",
      "설벽을 향할 때는 북쪽, 엘모어 지역을 향할 때는 동남쪽 방향을 기준으로 확인하세요. 새로운 구간에 진입하기 전 오렌 마을로 돌아올 경로를 살펴보세요.",
      "목적지에 필요한 소모품을 우선 배치하고 전리품 공간을 확보하세요. 장비나 퀘스트 아이템을 정리할 때는 설명을 읽고 필요한 물건이 포함되지 않았는지 확인하세요.",
      "강력한 적과의 전투에서는 체력과 마나 변화를 자주 확인하세요. 준비한 회복 수단이 부족해지면 탐험을 중단하고 마을에서 다시 정비하세요.",
    ],
    [
      "아덴은 넓은 마을과 다양한 상인을 갖춘 활동 거점입니다. 방문 목적을 정하고 필요한 장비, 소모품, 다음 탐험의 준비물을 목록으로 정리하세요.",
      "다양한 상인과 많은 플레이어가 모이는 활기찬 마을입니다. 먼저 필요한 시설과 만날 장소를 찾아두면 넓은 마을 안에서 동선을 줄일 수 있습니다.",
      "아덴에서는 목적지와 출발 지점을 확인한 뒤 이동하세요. 동료와 만날 때는 마을 안의 위치를 구체적으로 정하고 다음 이동 계획을 함께 확인하세요.",
      "여러 상인을 이용하기 전에 구매할 물품과 정리할 전리품을 구분하세요. 필요한 장비를 비교하고 다음 탐험에서 사용할 소모품의 공간을 확보하세요.",
      "다음 탐험이나 동료와의 활동을 시작하기 전 체력과 마나를 점검하세요. 부족한 소모품을 준비하고 현재 목표에 맞는 장비를 착용했는지 다시 확인하세요.",
    ],
  ];

  // ===== [추가] 6. 공통 팝업: 내용 교체 / 열기 / 닫기 =====
  const dialog = document.querySelector("#village-dialog");
  let opener;
  document
    .querySelector(".region-villages")
    .addEventListener("click", (event) => {
      const button = event.target.closest(".village-more");
      if (!button) return;
      const section = button.closest(".region-detail");
      const index = Number(section.dataset.villageIndex);
      opener = button;
      dialog.querySelector("h2").textContent =
        `${section.querySelector("h2").textContent} 상세 안내`;
      dialog.querySelector(".dialog-image").src =
        section.querySelector(".map-artwork img").src;
      dialog.querySelector(".dialog-description").innerHTML =
        section.querySelector(".village-description").innerHTML;
      dialog.querySelector(".dialog-details").innerHTML = villageDetails[index]
        .map(
          (text, i) =>
            `<article><img src="../assets/아이콘_리니지${i + 1}.png" alt="" width="60" height="60"><div><h3>${detailTitles[i]}</h3><p>${text}</p></div></article>`,
        )
        .join("");
      dialog.showModal();
      dialog.scrollTop = 0;
      document.documentElement.classList.add("village-dialog-open");
    });
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("village-dialog-open");
    opener?.focus({ preventScroll: true });
  });

  // ===== 7. 초기화: 직접 링크/뒤로 가기로 복원된 위치 반영 =====
  updateFromScroll();
})();
