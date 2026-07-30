const DB = {
  dbName: 'XinxinWorkBenchDB',
  version: 1,
  db: null,

  // 数据表定义
  stores: {
    plan: {keyPath: "id"},
    account: {keyPath: "id"},
    literature: {keyPath: "id"},
    sport: {keyPath: "id"},
    booknote: {keyPath: "id"},
    mood: {keyPath: "id"},
    countdown: {keyPath: "id"},
    pet: {keyPath: "id"},
    wardrobe: {keyPath: "id"},
    storage: {keyPath: "id"},
    homework: {keyPath: "id"},
    points: {keyPath: "id"}
  },

  async open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        for (const name in this.stores) {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, this.stores[name]);
          }
        }
      }
      req.onsuccess = e => {
        this.db = e.target.result;
        resolve(this.db);
      }
      req.onerror = e => reject(e.target.error);
    })
  },

  async getAll(storeName) {
    await this.open();
    return new Promise(resolve => {
      const st = this.db.transaction(storeName, 'readonly').objectStore(storeName);
      const data = [];
      st.openCursor().onsuccess = e => {
        const cur = e.target.result;
        if(cur){data.push(cur.value);cur.continue();}else resolve(data);
      }
    })
  },

  async add(storeName, item) {
    await this.open();
    item.id = Date.now() + Math.random().toString(36).slice(2);
    return new Promise(resolve => {
      const st = this.db.transaction(storeName, 'readwrite').objectStore(storeName);
      st.add(item).onsuccess = () => resolve(item);
    })
  },

  async update(storeName, item) {
    await this.open();
    return new Promise(resolve => {
      const st = this.db.transaction(storeName, 'readwrite').objectStore(storeName);
      st.put(item).onsuccess = () => resolve(item);
    })
  },

  async delete(storeName, id) {
    await this.open();
    return new Promise(resolve => {
      const st = this.db.transaction(storeName, 'readwrite').objectStore(storeName);
      st.delete(id).onsuccess = () => resolve();
    })
  }
}

// 积分通用工具：完成任务 +10积分
const PointUtil = {
  async getPoints() {
    const list = await DB.getAll('points');
    let total = 0;
    list.forEach(p=>total += p.num);
    return total;
  },
  async addPoint() {
    await DB.add('points', {num:10, time:new Date().toLocaleString(), source:"任务完成"});
  }
}