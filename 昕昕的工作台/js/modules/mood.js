const MoodModule = {
  list:[],
  getHtml(){
    return `
    <div class="card">
      <h2>💭心情日记</h2>
      <select id="moodScore">
        <option value="5">😊很好</option>
        <option value="4">🙂不错</option>
        <option value="3">😐一般</option>
        <option value="2">😔低落</option>
        <option value="1">😞糟糕</option>
      </select>
      <textarea id="moodText" placeholder="写下今日感受"></textarea>
      <button id="addMoodBtn">记录心情</button>
      <div id="moodListBox"></div>
    </div>
  },
  async init(){
    this.list = await DB.getAll('mood');
    this.render();
    document.getElementById('addMoodBtn').onclick = async ()=>{
      const score = document.getElementById('moodScore').value;
      const text = document.getElementById('moodText').value.trim();
      await DB.add('mood',{score,text,time:new Date().toLocaleString()});
      document.getElementById('moodText').value="";
      this.list = await DB.getAll('mood');
      this.render();
    }
  },
  render(){
    const box = document.getElementById('moodListBox');
    box.innerHTML="";
    this.list.slice().reverse().forEach(item=>{
      const div = document.createElement('div');
      div.className="card";
      div.innerHTML=`
        <p>${item.time} 心情分值：${item.score}</p>
        <p>${item.text}</p>
        <button data-id="${item.id}">删除</button>
      `
      box.appendChild(div);
    })
    box.querySelectorAll('[data-id]').forEach(btn=>{
      btn.onclick = async ()=>{
        await DB.delete('mood',btn.dataset.id);
        this.list = await DB.getAll('mood');
        this.render();
      }
    })
  }
}