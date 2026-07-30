const BookNoteModule = {
  list:[],
  getHtml(){
    return `
    <div class="card">
      <h2>📚读书笔记</h2>
      <input id="bookName" placeholder="书名">
      <textarea id="bookContent" placeholder="心得笔记"></textarea>
      <button id="saveBookBtn">保存笔记</button>
      <div id="bookListBox"></div>
    </div>
  },
  async init(){
    this.list = await DB.getAll('booknote');
    this.render();
    document.getElementById('saveBookBtn').onclick = async ()=>{
      const book = document.getElementById('bookName').value.trim();
      const content = document.getElementById('bookContent').value.trim();
      if(!book) return alert("填写书名");
      await DB.add('booknote',{book,content,create:new Date().toLocaleString(),update:new Date().toLocaleString()});
      document.getElementById('bookName').value="";
      document.getElementById('bookContent').value="";
      this.list = await DB.getAll('booknote');
      this.render();
    }
  },
  render(){
    const box = document.getElementById('bookListBox');
    box.innerHTML="";
    this.list.forEach(item=>{
      const div = document.createElement('div');
      div.className="card";
      div.innerHTML=`
        <h4>${item.book}</h4>
        <p>${item.content}</p>
        <p style="font-size:12px;color:#777">创建：${item.create}｜最后修改：${item.update}</p>
        <button data-edit="${item.id}">编辑</button>
        <button data-del="${item.id}">删除</button>
      `
      box.appendChild(div);
    })
    box.querySelectorAll('[data-edit]').forEach(btn=>{
      btn.onclick = async ()=>{
        const id = btn.dataset.edit;
        const target = this.list.find(i=>i.id===id);
        const newText = prompt("修改笔记内容",target.content);
        if(newText !== null){
          target.content = newText;
          target.update = new Date().toLocaleString();
          await DB.update('booknote',target);
          this.list = await DB.getAll('booknote');
          this.render();
        }
      }
    })
    box.querySelectorAll('[data-del]').forEach(btn=>{
      btn.onclick = async ()=>{
        await DB.delete('booknote',btn.dataset.del);
        this.list = await DB.getAll('booknote');
        this.render();
      }
    })
  }
}