const CountdownModule = {
  list:[],
  getHtml(){
    return `
    <div class="card">
      <h2>⏳倒计时</h2>
      <input id="countTitle" placeholder="事件名称">
      <input id="countDate" type="date">
      <button id="addCountBtn">新建倒计时</button>
      <div id="countListBox"></div>
    </div>
  },
  async init(){
    this.list = await DB.getAll('countdown');
    this.render();
    document.getElementById('addCountBtn').onclick = async ()=>{
      const title = document.getElementById('countTitle').value.trim();
      const date = document.getElementById('countDate').value;
      if(!title||!date) return alert("完善信息");
      await DB.add('countdown',{title,targetDate:date});
      document.getElementById('countTitle').value="";
      document.getElementById('countDate').value="";
      this.list = await DB.getAll('countdown');
      this.render();
    }
  },
  render(){
    const box = document.getElementById('countListBox');
    box.innerHTML="";
    this.list.forEach(item=>{
      const target = new Date(item.targetDate);
      const now = new Date();
      const diff = Math.ceil((target - now)/(1000*60*60*24));
      const div = document.createElement('div');
      div.className="card";
      div.innerHTML=`
        <h4>${item.title}</h4>
        <p>目标日期：${item.targetDate}｜剩余${diff}天</p>
        <button data-id="${item.id}">删除</button>
      `
      box.appendChild(div);
    })
    box.querySelectorAll('[data-id]').forEach(btn=>{
      btn.onclick = async ()=>{
        await DB.delete('countdown',btn.dataset.id);
        this.list = await DB.getAll('countdown');
        this.render();
      }
    })
  }
}