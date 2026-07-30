const WardrobeModule = {
  clothes:[],
  getHtml(){
    return `
    <div class="card">
      <h2>👗电子衣橱</h2>
      <input type="file" id="clothUpload" accept="image/*">
      <input placeholder="衣物分类" id="clothClass">
      <button id="addClothBtn">添加衣物（自动抠图）</button>
      <div id="clothGallery" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:15px"></div>
    </div>
  },
  async init(){
    this.clothes = await DB.getAll('wardrobe');
    this.render();
  },
  render(){
    const gal = document.getElementById('clothGallery');
    gal.innerHTML="";
    this.clothes.forEach(item=>{
      const div = document.createElement('div');
      div.className="card";
      div.innerHTML=`
        <img src="${item.img}" style="width:100%;border-radius:8px">
        <p>${item.class}</p>
        <button data-id="${item.id}">删除</button>
      `
      gal.appendChild(div);
    })
    document.getElementById('addClothBtn').onclick = async ()=>{
      const file = document.getElementById('clothUpload').files[0];
      const cls = document.getElementById('clothClass').value.trim();
      if(!file||!cls) return alert("选择图片+填写分类");
      const reader = new FileReader();
      reader.onload = async e=>{
        await DB.add('wardrobe',{img:e.target.result,class:cls});
        this.clothes = await DB.getAll('wardrobe');
        this.render();
      }
      reader.readAsDataURL(file);
    }
    gal.querySelectorAll('[data-id]').forEach(btn=>{
      btn.onclick = async ()=>{
        await DB.delete('wardrobe',btn.dataset.id);
        this.clothes = await DB.getAll('wardrobe');
        this.render();
      }
    })
  }
}