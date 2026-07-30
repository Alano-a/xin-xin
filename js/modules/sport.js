const SportModule = {
  records:[],
  getHtml(){
    return `
    <div class="card">
      <h2>🏃运动打卡</h2>
      <input id="sportName" placeholder="运动内容（跑步/力量训练）">
      <input id="sportTime" placeholder="时长">
      <button id="addSportBtn">打卡（完成+10积分）</button>
      <div id="sportListBox"></div>
    </div>
  },
  async init(){
    this.records = await DB.getAll('sport');
    this.render();
    document.getElementById('addSportBtn').onclick = async ()=>{
      const name = document.getElementById('sportName').value.trim();
      const time = document.getElementById('sportTime').value.trim();
      if(!name) return alert("填写运动项目");
      await DB.add('sport',{name,time,date:new Date().toLocaleString()});
      await PointUtil.addPoint();
      document.getElementById('sportName').value="";
      document.getElementById('sportTime').value="";
      this.records = await DB.getAll('sport');
      this.render();
    }
  },
  render(){
    const box = document.getElementById('sportListBox');
    box.innerHTML="";
    this.records.slice().reverse().forEach(item=>{
      const div = document.createElement('div');
      div.style.display="flex";
      div.style.justifyContent="space-between";
      div.innerHTML = `<span>${item.date} ${item.name} ${item.time}</span><button data-id="${item.id}">删除</button>`;
      box.appendChild(div);
    })
    box.querySelectorAll('[data-id]').forEach(btn=>{
      btn.onclick = async ()=>{
        await DB.delete('sport',btn.dataset.id);
        this.records = await DB.getAll('sport');
        this.render();
      }
    })
  }
}