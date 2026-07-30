const HomeworkModule = {
  list:[],
  getHtml(){
    return `
    <div class="card">
      <h2>📝作业管理</h2>
      <input id="hwCourse" placeholder="课程名称">
      <textarea id="hwContent" placeholder="作业内容"></textarea>
      <input type="date" id="hwDeadline">
      <button id="addHwBtn">新增作业</button>
      <div id="hwListBox"></div>
    </div>
  },
  async init(){
    this.list = await DB.getAll('homework');
    this.render();
    document.getElementById('addHwBtn').onclick = async ()=>{
      const course = document.getElementById('hwCourse').value.trim();
      const content = document.getElementById('hwContent').value.trim();
      const deadline = document.getElementById('hwDeadline').value;
      if(!course||!deadline) return alert("完善课程与截止时间");
      await DB.add('homework',{course,content,deadline,finish:false,submit:false});
      document.getElementById('hwCourse').value="";
      document.getElementById('hwContent').value="";
      document.getElementById('hwDeadline').value="";
      this.list = await DB.getAll('homework');
      this.render();
    }
  },
  render(){
    // 按截止日期排序
    this.list.sort((a,b)=>new Date(a.deadline)-new Date(b.deadline));
    const box = document.getElementById('hwListBox');
    box.innerHTML="";
    this.list.forEach(item=>{
      const div = document.createElement('div');
      div.className="card";
      div.innerHTML=`
        <h4>${item.course}</h4>
        <p>${item.content}</p>
        <p>截止：${item.deadline}</p>
        <label><input type="checkbox" ${item.finish?"checked":""} data-fin="${item.id}">完成</label>
        <label><input type="checkbox" ${item.submit?"checked":""} data-sub="${item.id}">提交</label>
        <button data-del="${item.id}">删除</button>
      `
      box.appendChild(div);
    })
    box.querySelectorAll('[data-fin]').forEach(ck=>{
      ck.onchange = async (e)=>{
        const target = this.list.find(i=>i.id===e.target.dataset.fin);
        target.finish = e.target.checked;
        await DB.update('homework',target);
      }
    })
    box.querySelectorAll('[data-sub]').forEach(ck=>{
      ck.onchange = async (e)=>{
        const target = this.list.find(i=>i.id===e.target.dataset.sub);
        target.submit = e.target.checked;
        await DB.update('homework',target);
      }
    })
    box.querySelectorAll('[data-del]').forEach(btn=>{
      btn.onclick = async ()=>{
        await DB.delete('homework',btn.dataset.del);
        this.list = await DB.getAll('homework');
        this.render();
      }
    })
  }
}