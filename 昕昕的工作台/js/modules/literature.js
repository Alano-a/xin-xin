const LiteratureModule = {
  list:[],
  getHtml(){
    return `
    <div class="card">
      <h2>📖选题灵感｜应激/饮食/自然接触文献</h2>
      <div style="margin:10px 0">
        <input id="litTitle" placeholder="文献标题">
        <input id="litDOI" placeholder="DOI编号">
        <textarea id="litContent" placeholder="摘要、可引用/改编要点"></textarea>
        <button id="saveLitBtn">收藏文献</button>
      </div>
      <div id="litListBox"></div>
    </div>
    `
  },
  async init(){
    this.list = await DB.getAll('literature');
    this.render();
    document.getElementById('saveLitBtn').onclick = async ()=>{
      const title = document.getElementById('litTitle').value.trim();
      const doi = document.getElementById('litDOI').value.trim();
      const content = document.getElementById('litContent').value.trim();
      if(!title) return alert('填写标题');
      await DB.add('literature',{title,doi,content,create:new Date().toLocaleString()});
      document.getElementById('litTitle').value="";
      document.getElementById('litDOI').value="";
      document.getElementById('litContent').value="";
      this.list = await DB.getAll('literature');
      this.render();
    }
  },
  render(){
    const box = document.getElementById('litListBox');
    box.innerHTML="";
    this.list.forEach(item=>{
      const div = document.createElement('div');
      div.className="card";
      div.innerHTML=`
        <h4>${item.title}</h4>
        <p>DOI：${item.doi||"无"}</p>
        <p>${item.content}</p>
        <button data-del="${item.id}">删除收藏</button>
      `
      box.appendChild(div);
    })
    box.querySelectorAll('[data-del]').forEach(btn=>{
      btn.onclick = async ()=>{
        await DB.delete('literature',btn.dataset.del);
        this.list = await DB.getAll('literature');
        this.render();
      }
    })
  }
}