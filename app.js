document.addEventListener('DOMContentLoaded', () => {
    // 페이지 로드 시 순위표와 개인 기록을 바로 표시
    if (document.getElementById('standingsContainer')) {
        initializeStandings(); // 순위 섹션 초기화 함수 호출로 변경
        initializePlayerRecords();
    }

    // 용어 사전 페이지 기능 초기화
    if (document.querySelector('.dictionary-content')) {
        initializeDictionaryNav();
        initializeSearch();
    }
});

// --- 순위 섹션 로직 ---

// 정규 시즌 순위 데이터
const regularSeasonData = [
    { rank: 1, team: 'LG', games: 110, win: 66, loss: 42, draw: 2, pct: 0.611, gamesBehind: 0, lastTen: '8승0무2패', streak: '1승' },
    { rank: 2, team: '한화', games: 107, win: 62, loss: 42, draw: 3, pct: 0.596, gamesBehind: 2, lastTen: '5승0무5패', streak: '2승' },
    { rank: 3, team: '롯데', games: 110, win: 58, loss: 49, draw: 3, pct: 0.542, gamesBehind: 7.5, lastTen: '4승0무6패', streak: '4패' },
    { rank: 4, team: 'SSG', games: 107, win: 54, loss: 49, draw: 4, pct: 0.524, gamesBehind: 9.5, lastTen: '7승0무3패', streak: '3승' },
    { rank: 5, team: 'KIA', games: 105, win: 51, loss: 50, draw: 4, pct: 0.505, gamesBehind: 11.5, lastTen: '5승1무4패', streak: '1승' },
    { rank: 6, team: 'KT', games: 111, win: 54, loss: 53, draw: 4, pct: 0.505, gamesBehind: 11.5, lastTen: '4승1무5패', streak: '1패' },
    { rank: 7, team: 'NC', games: 104, win: 49, loss: 49, draw: 6, pct: 0.500, gamesBehind: 12, lastTen: '5승1무4패', streak: '3승' },
    { rank: 8, team: '삼성', games: 108, win: 51, loss: 56, draw: 1, pct: 0.477, gamesBehind: 14.5, lastTen: '3승0무7패', streak: '3패' },
    { rank: 9, team: '두산', games: 109, win: 45, loss: 59, draw: 5, pct: 0.433, gamesBehind: 19, lastTen: '4승0무6패', streak: '2패' },
    { rank: 10, team: '키움', games: 111, win: 33, loss: 74, draw: 4, pct: 0.308, gamesBehind: 32.5, lastTen: '5승0무5패', streak: '1패' }
];

// 시범 경기 순위 (임시 목업 데이터)
const exhibitionData = [
    { rank: 1, team: '두산', games: 10, win: 8, loss: 2, draw: 0, pct: 0.800, gamesBehind: 0, lastTen: '8-2-0', streak: '5승' },
    { rank: 2, team: 'LG', games: 10, win: 7, loss: 3, draw: 0, pct: 0.700, gamesBehind: 1.0, lastTen: '7-3-0', streak: '3승' },
    { rank: 3, team: 'KIA', games: 10, win: 6, loss: 3, draw: 1, pct: 0.667, gamesBehind: 1.5, lastTen: '6-3-1', streak: '1승' },
    { rank: 4, team: '삼성', games: 10, win: 6, loss: 4, draw: 0, pct: 0.600, gamesBehind: 2.0, lastTen: '6-4-0', streak: '2패' },
    { rank: 5, team: 'SSG', games: 10, win: 5, loss: 4, draw: 1, pct: 0.556, gamesBehind: 2.5, lastTen: '5-4-1', streak: '1패' },
    { rank: 6, team: 'NC', games: 10, win: 5, loss: 5, draw: 0, pct: 0.500, gamesBehind: 3.0, lastTen: '5-5-0', streak: '1승' },
    { rank: 7, team: '한화', games: 10, win: 4, loss: 5, draw: 1, pct: 0.444, gamesBehind: 3.5, lastTen: '4-5-1', streak: '2패' },
    { rank: 8, team: 'KT', games: 10, win: 4, loss: 6, draw: 0, pct: 0.400, gamesBehind: 4.0, lastTen: '4-6-0', streak: '1패' },
    { rank: 9, team: '롯데', games: 10, win: 2, loss: 7, draw: 1, pct: 0.222, gamesBehind: 5.5, lastTen: '2-7-1', streak: '4패' },
    { rank: 10, team: '키움', games: 10, win: 1, loss: 8, draw: 1, pct: 0.111, gamesBehind: 6.5, lastTen: '1-8-1', streak: '6패' }
];

function displayStandings(standingsData) {
    const container = document.getElementById('standingsContainer');
    if (!container) return;

    const table = document.createElement('table');
    table.className = 'standings-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>순위</th><th>팀명</th><th>경기수</th><th>승</th><th>패</th><th>무</th><th>승률</th><th>게임차</th><th>최근10</th><th>연속</th>
            </tr>
        </thead>
    `;
    const tbody = document.createElement('tbody');
    standingsData.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.rank}</td>
            <td class="team-name">${team.team}</td>
            <td>${team.games}</td>
            <td>${team.win}</td>
            <td>${team.loss}</td>
            <td>${team.draw}</td>
            <td>${team.pct.toFixed(3)}</td>
            <td>${team.gamesBehind}</td>
            <td>${team.lastTen}</td>
            <td>${team.streak}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
}

function initializeStandings() {
    const seasonSelector = document.querySelector('.season-selector .form-select');
    if (!seasonSelector) {
        displayStandings(regularSeasonData);
        return;
    }

    displayStandings(regularSeasonData);

    seasonSelector.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        if (selectedValue === '시범경기') {
            // TODO: KBO 사이트에서 실제 시범경기 데이터를 가져오는 로직으로 대체해야 합니다.
            displayStandings(exhibitionData);
        } else {
            displayStandings(regularSeasonData);
        }
    });
}

// --- 개인 기록 섹션 로직 ---
const playerRecords = {
    avg: [
        { rank: 1, name: '안현민', team: 'KT', record: 0.351 },
        { rank: 2, name: '김성윤', team: '삼성', record: 0.333 },
        { rank: 3, name: '레이예스', team: '롯데', record: 0.327 },
        { rank: 4, name: '양의지', team: '두산', record: 0.320 },
        { rank: 5, name: '최형우', team: 'KIA', record: 0.316 },
    ],
    hr: [
        { rank: 1, name: '디아즈', team: '삼성', record: 37 },
        { rank: 2, name: '위즈덤', team: 'KIA', record: 24 },
        { rank: 3, name: '데이비슨', team: 'NC', record: 22 },
        { rank: 4, name: '문보경', team: 'LG', record: 21 },
        { rank: 5, name: '오스틴', team: 'LG', record: 21 },
    ],
    rbi: [
        { rank: 1, name: '디아즈', team: '삼성', record: 109 },
        { rank: 2, name: '문보경', team: 'LG', record: 88 },
        { rank: 3, name: '레이예스', team: '롯데', record: 81 },
        { rank: 4, name: '양의지', team: '두산', record: 77 },
        { rank: 5, name: '김현수', team: 'LG', record: 72 },
    ],
    era: [
        { rank: 1, name: '폰세', team: '한화', record: 1.61 },
        { rank: 2, name: '네일', team: 'KIA', record: 2.26 },
        { rank: 3, name: '앤더슨', team: 'SSG', record: 2.31 },
        { rank: 4, name: '후라도', team: '삼성', record: 2.64 },
        { rank: 5, name: '임찬규', team: 'LG', record: 2.82 },
    ],
    win: [
        { rank: 1, name: '폰세', team: '한화', record: 15 },
        { rank: 2, name: '라일리', team: 'NC', record: 13 },
        { rank: 3, name: '와이스', team: '한화', record: 12 },
        { rank: 4, name: '박세웅', team: '롯데', record: 11 },
        { rank: 5, name: '후라도', team: '삼성', record: 10 },
    ],
    save: [
        { rank: 1, name: '박영현', team: 'KT', record: 30 },
        { rank: 2, name: '김원중', team: '롯데', record: 29 },
        { rank: 3, name: '정해영', team: 'KIA', record: 26 },
        { rank: 4, name: '김서현', team: '한화', record: 26 },
        { rank: 5, name: '류진욱', team: 'NC', record: 24 },
    ]
};

function displayPlayerRecords(category) {
    const container = document.getElementById('playerRecordsContainer');
    const data = playerRecords[category];
    if (!container || !data) return;

    const table = document.createElement('table');
    table.className = 'table table-striped player-records-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>순위</th><th>선수명</th><th>팀</th><th>기록</th>
            </tr>
        </thead>
    `;
    const tbody = document.createElement('tbody');
    data.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.rank}</td>
            <td>${player.name}</td>
            <td>${player.team}</td>
            <td>${player.record}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
}

function initializePlayerRecords() {
    const categorySelector = document.getElementById('recordCategory');
    if (categorySelector) {
        displayPlayerRecords('avg');
        categorySelector.addEventListener('change', (event) => {
            displayPlayerRecords(event.target.value);
        });
    }
}

// --- 용어 사전 GNB 스크롤 스파이 기능 ---
function initializeDictionaryNav() {
    const gnbLinks = document.querySelectorAll('#sidebar .nav-link');
    const sections = document.querySelectorAll('.dictionary-content section');
    const offset = 70; // 상단 네비게이션 바 높이를 고려한 오프셋

    function changeLinkState() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - offset) {
                current = section.getAttribute('id');
            }
        });

        gnbLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    // 페이지 로드 시 및 스크롤 시 함수 실행
    changeLinkState();
    window.addEventListener('scroll', changeLinkState);
}

// --- 용어 사전 검색 기능 ---
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    // ▼▼▼ 실시간 필터링의 핵심 1: 'keyup' 이벤트 ▼▼▼
    // 검색창에 키보드를 입력했다가 뗄 때마다 안의 코드가 실행됩니다.
    searchInput.addEventListener('keyup', () => {
        // 검색어를 대문자로 변환 (대소문자 구분 없이 검색하기 위함)
        const filter = searchInput.value.toUpperCase();
        const sections = document.querySelectorAll('.dictionary-content section'); // querySelectorAll dt 태그 목록 가져옴

        sections.forEach(section => {
            const terms = section.querySelectorAll('dl > dt');
            let sectionHasVisibleTerm = false;

            terms.forEach(term => {
                const termText = term.textContent || term.innerText;
                const definition = term.nextElementSibling;

                // ▼▼▼ 실시간 필터링의 핵심 2: 'indexOf'를 이용한 비교 ▼▼▼
                // 용어(termText) 안에 검색어(filter)가 포함되어 있는지 확인합니다.
                if (termText.toUpperCase().indexOf(filter) > -1) {
                    // 포함되어 있으면 용어와 설명을 화면에 보여줍니다.
                    term.style.display = "";
                    definition.style.display = "";
                    sectionHasVisibleTerm = true;
                     // 포함되어 있지 않으면 숨깁니다.
                } else {
                    term.style.display = "none";
                    definition.style.display = "none";
                }
            });

            // 검색 결과가 있는 섹션만 표시
            if (sectionHasVisibleTerm) {
                section.style.display = "";
            } else {
                section.style.display = "none";
            }
        });
    });
}
