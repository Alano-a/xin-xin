const AccountModule = {
  data:[],chart:null,
  getHtml(){
    return `
    <div class="card">
      <h2>💰记账本</h2>
      <div style="display:flex;gap:6px;margin:10px 0">
        <select id="accType">
          <option value="收入">收入</option>
          <option value="支出">支出</option>
        </select>
        <input id="accMoney" placeholder="金额" type="number">
        <input id="accClass" placeholder="分类（餐饮/交通等）">
        <button id="addAccBtn">记录</button>
      </div>
      <div style="margin:10px 0">
        <button data-graph="pie">饼图</button>
        <button data-graph="bar">条形图</button>
        <button data-graph="line">折线图</button>
      </div>
      <canvas id="accChart" height="250"></canvas>
      <div id="accListBox" style="margin-top:16px"></div>
    </div>
    `
  },
  async init(){
    this.data = await DB.getAll('account');
    this.bindButtons();
    this.drawChart('pie');
    this.renderList();
  },
  bindButtons(){
    document.getElementById('addAccBtn').onclick = async ()=>{
      const type = document.getElementById('accType').value;
      const money = parseFloat(document.getElementById('accMoney').value);
      const cls = document.getElementById('accClass').value.trim();
      if(!money||!cls) return alert('填写完整');
      await DB.add('account',{type,money,class:cls,time:new Date().toLocaleString()});
      this.data = await DB.getAll('account');
      this.drawChart('pie');
      this.renderList();
    }
    document.querySelectorAll('[data-graph]').forEach(btn=>{
      btn.onclick = ()=>this.drawChart(btn.dataset.graph);
    })
  },
  drawChart(type){
    const canvas = document.getElementById('accChart');
    const ctx = canvas.getContext('2d');
    if(this.chart) this.chart.destroy();
    const group = {};
    this.data.filter(d=>d.type==="支出").forEach(item=>{
      if(!group[item.class]) group[item.class]=0;
      group[item.class] += item.money;
    })
    const labels = Object.keys(group);
    const values = labels.map(k=>group[k]);
    let chartType;
    if(type==="pie") chartType="pie";
    else if(type==="bar") chartType="bar";
    else chartType="line";

    this.chart = new Chart(ctx,{
      type:chartType,
      data:{labels,datasets:[{data:values,backgroundColor:["#ffd6cc","#ffe8cc","#fff6cc","#e7ffcc","#ccffeb"]}]}
    })
  },
  renderList(){
    const box = document.getElementById('accListBox');
    box.innerHTML = "";
    this.data.slice().reverse().forEach(item=>{
      const div = document.createElement('div');
      div.style.display="flex";
      div.style.justifyContent="space-between";
      div.innerHTML = `<span>${item.time} ${item.class} ${item.type}：${item.money}</span><button data-id="${item.id}">删除</button>`;
      box.appendChild(div);
    })
    box.querySelectorAll('[data-id]').forEach(btn=>{
      btn.onclick = async ()=>{
        await DB.delete('account',btn.dataset.id);
        this.data = await DB.getAll('account');
        this.drawChart('pie');
        this.renderList();
      }
    })
  }
}