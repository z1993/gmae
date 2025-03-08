try {
    console.log('%cdata.js 开始执行', 'color: blue; font-weight: bold;');

    // 数据管理类
    class DataManager {
        constructor() {
            console.log('DataManager 初始化');
            this.initializeStorage();
        }

        // 初始化存储
        initializeStorage() {
            console.log('初始化存储');
            try {
                if (!localStorage.getItem('games')) {
                    localStorage.setItem('games', '[]');
                }
                if (!localStorage.getItem('bets')) {
                    localStorage.setItem('bets', '[]');
                }
                if (!localStorage.getItem('boardgame-tracker-settings')) {
                    localStorage.setItem('boardgame-tracker-settings', JSON.stringify({
                        games: [],
                        player1Name: '我',
                        player2Name: '她'
                    }));
                }
                console.log('存储初始化完成');
            } catch (error) {
                console.error('存储初始化失败:', error);
            }
        }

        // 获取所有游戏
        getGames() {
            return JSON.parse(localStorage.getItem('games') || '[]');
        }

        // 添加游戏
        addGame(game) {
            const games = this.getGames();
            games.push(game);
            localStorage.setItem('games', JSON.stringify(games));
        }

        // 删除游戏
        deleteGame(gameId) {
            const games = this.getGames();
            const updatedGames = games.filter(game => game.id !== gameId);
            localStorage.setItem('games', JSON.stringify(updatedGames));
        }

        // 获取所有赌注
        getBets() {
            return JSON.parse(localStorage.getItem('bets') || '[]');
        }

        // 添加赌注
        addBet(bet) {
            const bets = this.getBets();
            bets.push(bet);
            localStorage.setItem('bets', JSON.stringify(bets));
        }

        // 删除赌注
        deleteBet(betId) {
            const bets = this.getBets();
            const updatedBets = bets.filter(bet => bet.id !== betId);
            localStorage.setItem('bets', JSON.stringify(updatedBets));
        }

        // 完成赌注
        completeBet(betId) {
            const bets = this.getBets();
            const bet = bets.find(b => b.id === betId);
            if (bet) {
                bet.status = 'completed';
                localStorage.setItem('bets', JSON.stringify(bets));
            }
        }

        // 获取设置
        getSettings() {
            return JSON.parse(localStorage.getItem('boardgame-tracker-settings') || '{"games":[],"player1Name":"我","player2Name":"她"}');
        }

        // 保存设置
        saveSettings(settings) {
            localStorage.setItem('boardgame-tracker-settings', JSON.stringify(settings));
        }

        // 导出数据
        exportData() {
            const data = {
                games: this.getGames(),
                bets: this.getBets(),
                settings: this.getSettings()
            };
            return JSON.stringify(data, null, 2);
        }

        // 导入数据
        importData(jsonData) {
            try {
                const data = JSON.parse(jsonData);
                if (data.games) localStorage.setItem('games', JSON.stringify(data.games));
                if (data.bets) localStorage.setItem('bets', JSON.stringify(data.bets));
                if (data.settings) localStorage.setItem('boardgame-tracker-settings', JSON.stringify(data.settings));
                return true;
            } catch (error) {
                console.error('导入数据失败:', error);
                return false;
            }
        }

        // 清除所有数据
        clearData() {
            localStorage.removeItem('games');
            localStorage.removeItem('bets');
            localStorage.removeItem('boardgame-tracker-settings');
            this.initializeStorage();
        }
    }

    // 创建全局数据管理实例
    console.log('创建 DataManager 实例');
    window.dataManager = new DataManager();
    console.log('DataManager 实例创建完成，实例:', window.dataManager);
} catch (error) {
    console.error('%cdata.js 执行出错:', 'color: red; font-weight: bold;', error);
}