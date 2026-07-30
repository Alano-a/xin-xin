const PetModule = {
  petData:null,
  getHtml(){
    return `
    <div class="card">
      <h2>🐾宠物乐园</h2>
      <div id="petView" style="text-align:center;padding:20px;font-size:60px">🐱</div>
      <p>饱食度：<span id="petFull">50</span></p>
      <p>宠物粮库存：<span id="foodNum">0</span>包</p>
      <p>当前总积分：<span id="totalPoint">0</span></p>
      <button id="buyFoodBtn">购买粮食（10积分/包）</button>
      <button id="feedBtn">喂食</button>
    </div>
  },
  async init(){
    await this.loadPet();
    await this.refreshUI();
    document.getElementById('buyFoodBtn').onclick = ()=>this.buyFood();
    document.getElementById('feedBtn').onclick = ()=>this.feed();
  },
  async loadPet(){
    let petList = await DB.getAll('pet');
    if(petList.length===0){
      this.petData = {full:50,food:0,type:"cat"};
      await DB.add('pet',this.petData);
    }else{
      this.petData = petList[0];
    }
  },
  async refreshUI(){
    const point = await PointUtil.getPoints();
    document.getElementById('totalPoint').innerText = point;
    document.getElementById('petFull').innerText = this.petData.full;
    document.getElementById('foodNum').innerText = this.petData.food;
  },
  async buyFood(){
    const point = await PointUtil.getPoints();
    if(point<10) return alert("积分不足！完成计划/运动打卡获取积分");
    await DB.add('points',{num:-10,time:new Date().toLocaleString(),source:"购买宠物粮"});
    this.petData.food +=1;
    await DB.update('pet',this.petData);
    await this.refreshUI();
  },
  async feed(){
    if(this.petData.food <=0) return alert("没有粮食，先购买！");
    this.petData.food -=1;
    this.petData.full = Math.min(100,this.petData.full+15);
    await DB.update('pet',this.petData);
    await this.refreshUI();
    alert("喂食成功！宠物饱食度上升");
  }
}