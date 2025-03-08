console.log('App 模块加载');

try {
    console.log('%capp.js 开始执行', 'color: blue; font-weight: bold;');

    // 确保在 DOM 加载完成后执行
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM 加载完成');
        
        try {
            // 检查依赖
            if (!window.dataManager) {
                throw new Error('数据管理器未初始化！');
            }
            
            // 初始化应用
            console.log('开始初始化应用');
            initializeApp();
            console.log('应用初始化完成');
            
            // 设置事件监听
            console.log('开始设置事件监听');
            setupEventListeners();
            console.log('事件监听设置完成');
            
            // 加载初始数据
            console.log('开始加载初始数据');
            loadInitialData();
            console.log('初始数据加载完成');
            
            console.log('%c应用启动成功！', 'color: green; font-size: 16px; font-weight: bold;');
        } catch (error) {
            console.error('%c应用初始化失败:', 'color: red; font-weight: bold;', error);
        }
    });

    // 初始化应用
    function initializeApp() {
        // 确保数据管理器已初始化
        if (!window.dataManager) {
            console.error('DataManager not initialized!');
            return;
        }

        // 加载设置
        const settings = dataManager.getSettings();
        updatePlayerNames(settings.player1Name, settings.player2Name);
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 导航事件
        setupNavigation();
        
        // 游戏相关事件
        setupGameEvents();
        
        // 设置相关事件
        setupSettingsEvents();
        
        // 模态框事件
        setupModalEvents();
    }

    // 设置导航事件
    function setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetPage = btn.dataset.page;
                switchPage(targetPage);
            });
        });
    }

    // 切换页面
    function switchPage(pageId) {
        // 更新导航按钮状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === pageId);
        });

        // 更新页面显示
        document.querySelectorAll('.page').forEach(page => {
            page.classList.toggle('active', page.id === `${pageId}-page`);
        });

        // 如果切换到统计页面，更新统计数据
        if (pageId === 'stats') {
            updateStatistics();
        }
    }

    // 设置游戏相关事件
    function setupGameEvents() {
        // 添加新对局按钮
        const addGameBtn = document.getElementById('add-game-btn');
        const firstGameBtn = document.getElementById('first-game-btn');
        
        [addGameBtn, firstGameBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => showAddGameModal());
            }
        });

        // 游戏表单提交
        const addGameForm = document.getElementById('add-game-form');
        if (addGameForm) {
            addGameForm.addEventListener('submit', handleGameFormSubmit);
        }

        // 胜者选择按钮
        const winnerButtons = document.querySelectorAll('.player-btn');
        winnerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                winnerButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('winner-input').value = btn.dataset.winner;
            });
        });
    }

    // 设置设置页面事件
    function setupSettingsEvents() {
        // 玩家名称输入
        const player1Input = document.getElementById('player1-name');
        const player2Input = document.getElementById('player2-name');
        
        [player1Input, player2Input].forEach(input => {
            if (input) {
                input.addEventListener('change', handlePlayerNameChange);
            }
        });

        // 游戏管理
        setupGameManagement();

        // 数据管理按钮
        setupDataManagementEvents();
    }

    // 设置数据管理事件
    function setupDataManagementEvents() {
        const exportBtn = document.getElementById('export-data');
        const importBtn = document.getElementById('import-data');
        const clearBtn = document.getElementById('clear-data');

        if (exportBtn) {
            exportBtn.addEventListener('click', handleDataExport);
        }

        if (importBtn) {
            importBtn.addEventListener('click', handleDataImport);
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', handleDataClear);
        }
    }

    // 设置模态框事件
    function setupModalEvents() {
        // 关闭按钮
        document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    // 加载初始数据
    function loadInitialData() {
        updateGamesList();
        updateGameSelect();
        updateSettingsGamesList();
        loadPlayerNames();
        updateStatistics();
    }

    // 更新游戏列表
    function updateGamesList() {
        const gamesList = document.getElementById('games-list');
        const games = dataManager.getGames();
        
        if (gamesList) {
            if (games.length === 0) {
                gamesList.innerHTML = `
                    <div class="empty-state">
                        <i class="bi bi-controller"></i>
                        <p>还没有对局记录</p>
                        <button class="primary-btn" id="first-game-btn">记录第一局</button>
                    </div>
                `;
                const firstGameBtn = document.getElementById('first-game-btn');
                if (firstGameBtn) {
                    firstGameBtn.addEventListener('click', () => showAddGameModal());
                }
            } else {
                gamesList.innerHTML = games.map(game => createGameElement(game)).join('');
            }
        }
    }

    // 创建游戏元素
    function createGameElement(game) {
        const settings = dataManager.getSettings();
        const winnerName = game.winner === '玩家' ? settings.player1Name : settings.player2Name;
        
        return `
            <div class="game-item" data-id="${game.id}">
                <div class="game-header">
                    <h3>${game.gameName}</h3>
                    <span class="game-date">${new Date(game.date).toLocaleString()}</span>
                </div>
                <div class="game-result">
                    <span class="winner ${game.winner === '玩家' ? 'winner-player1' : 'winner-player2'}">
                        ${winnerName} 获胜
                    </span>
                </div>
                ${game.bet ? `
                <div class="game-bet">
                    <i class="bi bi-coin"></i> 赌注: ${game.bet}
                </div>` : ''}
                ${game.notes ? `<div class="game-notes">${game.notes}</div>` : ''}
            </div>
        `;
    }

    // 更新游戏选择下拉框
    function updateGameSelect() {
        const gameSelect = document.getElementById('game-select');
        const settings = dataManager.getSettings();
        
        if (gameSelect && settings.games) {
            gameSelect.innerHTML = `
                <option value="">请选择游戏</option>
                ${settings.games.map(game => `<option value="${game}">${game}</option>`).join('')}
            `;
        }
    }

    // 加载玩家名称
    function loadPlayerNames() {
        const settings = dataManager.getSettings();
        const player1Input = document.getElementById('player1-name');
        const player2Input = document.getElementById('player2-name');
        
        if (player1Input) player1Input.value = settings.player1Name || '我';
        if (player2Input) player2Input.value = settings.player2Name || '她';
        
        updatePlayerNames(settings.player1Name, settings.player2Name);
    }

    // 更新玩家名称显示
    function updatePlayerNames(player1, player2) {
        const playerNamesSpan = document.getElementById('player-names');
        if (playerNamesSpan) {
            playerNamesSpan.textContent = `玩家: ${player1} & ${player2}`;
        }

        // 更新胜者选择按钮的玩家名称
        const player1Btn = document.querySelector('.player-btn[data-winner="玩家"] .player-name');
        const player2Btn = document.querySelector('.player-btn[data-winner="对手"] .player-name');
        
        if (player1Btn) player1Btn.textContent = player1;
        if (player2Btn) player2Btn.textContent = player2;
    }

    // 显示添加对局模态框
    function showAddGameModal() {
        const modal = document.getElementById('add-game-modal');
        if (modal) {
            modal.classList.add('active');
            // 设置默认日期时间
            const dateInput = document.getElementById('game-date');
            if (dateInput) {
                const now = new Date();
                dateInput.value = now.toISOString().slice(0, 16);
            }
        }
    }

    // 处理游戏表单提交
    function handleGameFormSubmit(e) {
        e.preventDefault();
        
        const gameSelect = document.getElementById('game-select');
        const winnerInput = document.getElementById('winner-input');
        const dateInput = document.getElementById('game-date');
        const notesInput = document.getElementById('game-notes');
        const betInput = document.getElementById('game-bet');
        
        if (!gameSelect.value || !winnerInput.value || !dateInput.value) {
            alert('请填写必要信息！');
            return;
        }

        const newGame = {
            id: Date.now().toString(),
            gameName: gameSelect.value,
            winner: winnerInput.value,
            date: new Date(dateInput.value).toISOString(),
            notes: notesInput.value,
            bet: betInput.value.trim()
        };

        dataManager.addGame(newGame);
        updateGamesList();
        updateStatistics();
        
        // 关闭模态框
        const modal = document.getElementById('add-game-modal');
        if (modal) {
            modal.classList.remove('active');
        }

        // 重置表单
        e.target.reset();
    }

    // 处理玩家名称变更
    function handlePlayerNameChange() {
        const player1Input = document.getElementById('player1-name');
        const player2Input = document.getElementById('player2-name');
        
        const settings = dataManager.getSettings();
        settings.player1Name = player1Input.value || '我';
        settings.player2Name = player2Input.value || '她';
        
        dataManager.saveSettings(settings);
        updatePlayerNames(settings.player1Name, settings.player2Name);
        updateGamesList();
        updateStatistics();
    }

    // 更新统计数据
    function updateStatistics() {
        const games = dataManager.getGames();
        const settings = dataManager.getSettings();
        
        // 计算胜率
        const totalGames = games.length;
        const player1Wins = games.filter(game => game.winner === '玩家').length;
        const player2Wins = games.filter(game => game.winner === '对手').length;
        
        const winRateStats = document.getElementById('win-rate-stats');
        if (winRateStats) {
            winRateStats.innerHTML = `
                <div class="player-stat">
                    <span class="player-name">${settings.player1Name}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${totalGames ? (player1Wins / totalGames * 100) : 0}%"></div>
                    </div>
                    <span class="stat-value">${totalGames ? Math.round(player1Wins / totalGames * 100) : 0}%</span>
                </div>
                <div class="player-stat">
                    <span class="player-name">${settings.player2Name}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${totalGames ? (player2Wins / totalGames * 100) : 0}%"></div>
                    </div>
                    <span class="stat-value">${totalGames ? Math.round(player2Wins / totalGames * 100) : 0}%</span>
                </div>
            `;
        }

        // 更新游戏分布统计
        const gamesDistribution = document.getElementById('games-distribution');
        if (gamesDistribution) {
            const gameStats = {};
            games.forEach(game => {
                gameStats[game.gameName] = (gameStats[game.gameName] || 0) + 1;
            });

            const gameStatsHtml = Object.entries(gameStats)
                .sort(([,a], [,b]) => b - a)
                .map(([game, count]) => `
                    <div class="game-stat">
                        <span class="game-name">${game}</span>
                        <span class="game-count">${count} 局</span>
                    </div>
                `).join('');

            gamesDistribution.innerHTML = gameStatsHtml || '<div class="empty-state">暂无数据</div>';
        }
    }

    // 处理数据导出
    function handleDataExport() {
        const data = dataManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boardgame-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 处理数据导入
    function handleDataImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                try {
                    if (dataManager.importData(event.target.result)) {
                        alert('数据导入成功！');
                        loadInitialData();
                    } else {
                        alert('数据导入失败，请检查文件格式！');
                    }
                } catch (error) {
                    alert('数据导入失败：' + error.message);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    // 处理数据清除
    function handleDataClear() {
        if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
            dataManager.clearData();
            loadInitialData();
            alert('数据已清除！');
        }
    }

    // 更新游戏列表显示（设置页面）
    function updateSettingsGamesList() {
        const gamesList = document.getElementById('settings-games-list');
        const settings = dataManager.getSettings();
        
        if (gamesList && settings.games) {
            if (settings.games.length === 0) {
                gamesList.innerHTML = '<div class="empty-state">还没有添加任何游戏</div>';
            } else {
                gamesList.innerHTML = settings.games.map(game => `
                    <div class="game-tag">
                        <span class="game-name">${game}</span>
                        <button class="delete-btn" data-game="${game}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `).join('');

                // 添加删除事件监听
                gamesList.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const gameName = btn.dataset.game;
                        if (confirm(`确定要删除游戏"${gameName}"吗？`)) {
                            const settings = dataManager.getSettings();
                            settings.games = settings.games.filter(g => g !== gameName);
                            dataManager.saveSettings(settings);
                            updateSettingsGamesList();
                            updateGameSelect();
                        }
                    });
                });
            }
        }
    }

    // 设置游戏管理事件
    function setupGameManagement() {
        const addNewGameBtn = document.getElementById('add-new-game-btn');
        const newGameInput = document.getElementById('new-game-name');

        if (addNewGameBtn && newGameInput) {
            addNewGameBtn.addEventListener('click', () => {
                const gameName = newGameInput.value.trim();
                if (!gameName) {
                    alert('请输入游戏名称！');
                    return;
                }

                const settings = dataManager.getSettings();
                if (settings.games.includes(gameName)) {
                    alert('该游戏已存在！');
                    return;
                }

                settings.games.push(gameName);
                dataManager.saveSettings(settings);
                newGameInput.value = '';
                updateSettingsGamesList();
                updateGameSelect();
                alert('游戏添加成功！');
            });
        }
    }
} catch (error) {
    console.error('%capp.js 执行出错:', 'color: red; font-weight: bold;', error);
} 