const StorageModule = {
  goods:[],
  getHtml(){
    return `
    <div class="card">
      <h2>🧴储物间库存管理</h2>
      <input id="goodsName" placeholder="物品名称">
      <input id="goodsNum" placeholder="剩余数量" type="number">
      <input id="goodsType" placeholder="分类（化妆品/清洁剂）">
      <button id="addGoodsBtn">新增物品</button>
      <div id="goodsListBox"></div>
    </div>
  },
  async init(){
    this.goods = await DB.getAll('storage');
    this.render();
    document.getElementById('addGoodsBtn').onclick = async ()=>{
      const name = document.getElementById('goodsName').value.trim();
      const num = document.getElementById('goodsNum').value;
      const type = document.getElementById('goodsType').value.trim();
      if(!name) return alert("填写物品名称");
      await DB.add('storage',{name,num,type});
      document.getElementById('goodsName').value="";
      document.getElementById('goodsNum').value="";
      document.getElementById('goodsType').value="";
      this.goods = await DB.getAll('storage');
      this.render();
    }
  },
  render(){
    const box = document.getElementById('goodsListBox');
    box.innerHTML="";
    this.goods.forEach(item=>{
      const div = document.createElement('div');
      div.className="card";
      div.innerHTML=`
        <p>${item.type}｜${item.name}｜剩余：${item.num}</p>
        <button data-id="${item.id}">删除</button>
      `
      box.appendChild(div);
    })
    box.querySelectorAll('[data-id]').forEach(btn=>{
      btn.onclick = async ()=>{
        await DB.delete('storage',btn.dataset.id);
        this.goods = await DB.getAll('storage');
        this.render();
      }
    })
  }
}