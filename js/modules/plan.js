const PlanModule = {
  taskList: [],
  getHtml() {
    return `
    <div class="card">
      <h2>📋每日计划</h2>
      <div style="display:flex;gap:8px;margin:12px 0">
        <input id="taskInput" placeholder="输入新任务" style="flex:1">
        <button id="addTaskBtn">新增</button>
      </div>
      <div id="taskListBox"></div>
    </div>
    `
  },
  async init() {
    this.taskList = await DB.getAll('plan');
    this.renderList();
    document.getElementById('addTaskBtn').onclick = ()=>this.addTask();
  },
  renderList() {
    const box = document.getElementById('taskListBox');
    box.innerHTML = "";
    this.taskList.forEach((task,idx)=>{
      const div = document.createElement('div');
      div.style.display="flex";
      div.style.justifyContent="space-between";
      div.style.padding="8px 0";
      div.innerHTML = `
        <label>
          <input type="checkbox" ${task.finish?"checked":""} data-index="${idx}">
          <span style="${task.finish?'text-decoration:line-through;color:#999':''}">${task.content}</span>
        </label>
        <button data-del="${task.id}">删除</button>
      `
      box.appendChild(div);
    })
    // 勾选事件
    box.querySelectorAll('input[type="checkbox"]').forEach(ck=>{
      ck.onchange = async (e)=>{
        const idx = e.target.dataset.index;
        const item = this.taskList[idx];
        if(!item.finish && e.target.checked){
          await PointUtil.addPoint();
        }
        item.finish = e.target.checked;
        await DB.update('plan',item);
        this.renderList();
      }
    })
    box.querySelectorAll('[data-del]').forEach(btn=>{
      btn.onclick = async ()=>{
        await DB.delete('plan',btn.dataset.del);
        this.taskList = await DB.getAll('plan');
        this.renderList();
      }
    })
  },
  async addTask(){
    const input = document.getElementById('taskInput');
    const content = input.value.trim();
    if(!content) return alert('请输入任务内容');
    await DB.add('plan',{content,finish:false,createTime:new Date().toLocaleString()});
    input.value="";
    this.taskList = await DB.getAll('plan');
    this.renderList();
  }
}