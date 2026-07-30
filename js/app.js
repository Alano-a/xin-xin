// 全局应用控制器
const App = {
  currentModule: 'plan',
  theme: {
    bgColor: '#FFF8F0',
    sidebarColor: '#F4E8DD'
  },

  init() {
    this.loadTheme();
    this.bindNav();
    this.bindMobileSidebar();
    this.switchModule(this.currentModule);
  },

  // 加载本地存储主题配置
  loadTheme() {
    const saveTheme = localStorage.getItem('xinxin_theme');
    if (saveTheme) {
      this.theme = JSON.parse(saveTheme);
    }
    document.body.style.backgroundColor = this.theme.bgColor;
    document.querySelector('.sidebar').style.background = this.theme.sidebarColor;
  },

  // 保存主题
  saveTheme() {
    localStorage.setItem('xinxin_theme', JSON.stringify(this.theme));
  },

  // 导航绑定
  bindNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const moduleName = item.dataset.module;
        this.switchModule(moduleName);
        // 移动端关闭侧边栏
        document.querySelector('.sidebar').classList.remove('open');
      })
    })
  },

  // 移动端侧边栏开关
  bindMobileSidebar() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    toggleBtn.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('open');
    })
  },

  // 切换功能模块
  switchModule(moduleName) {
    this.currentModule = moduleName;
    // 导航激活样式
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.remove('active');
    })
    document.querySelector(`.nav-item[data-module="${moduleName}"]`).classList.add('active');
    // 渲染对应模块页面
    ViewContainer.render(moduleName);
  }
}

// 页面渲染容器
const ViewContainer = {
  render(module) {
    const container = document.getElementById('view-container');
    switch (module) {
      case 'plan':
        container.innerHTML = PlanModule.getHtml();
        PlanModule.init();
        break;
      case 'account':
        container.innerHTML = AccountModule.getHtml();
        AccountModule.init();
        break;
      case 'literature':
        container.innerHTML = LiteratureModule.getHtml();
        LiteratureModule.init();
        break;
      case 'sport':
        container.innerHTML = SportModule.getHtml();
        SportModule.init();
        break;
      case 'booknote':
        container.innerHTML = BookNoteModule.getHtml();
        BookNoteModule.init();
        break;
      case 'mood':
        container.innerHTML = MoodModule.getHtml();
        MoodModule.init();
        break;
      case 'countdown':
        container.innerHTML = CountdownModule.getHtml();
        CountdownModule.init();
        break;
      case 'pet':
        container.innerHTML = PetModule.getHtml();
        PetModule.init();
        break;
      case 'wardrobe':
        container.innerHTML = WardrobeModule.getHtml();
        WardrobeModule.init();
        break;
      case 'storage':
        container.innerHTML = StorageModule.getHtml();
        StorageModule.init();
        break;
      case 'homework':
        container.innerHTML = HomeworkModule.getHtml();
        HomeworkModule.init();
        break;
      case 'setting':
        container.innerHTML = SettingModule.getHtml();
        SettingModule.init();
        break;
    }
  }
}

// 设置模块
const SettingModule = {
  getHtml() {
    return `
    <div class="card">
      <h2>⚙️个性化设置</h2>
      <div class="color-input-wrap">
        <label>页面背景色（输入色号）</label>
        <input id="bgColorInput" type="text" value="${App.theme.bgColor}" placeholder="#FFF8F0">
        <input type="color" id="bgColorPicker" value="${App.theme.bgColor}">
      </div>
      <div class="color-input-wrap">
        <label>侧边岛台颜色（输入色号）</label>
        <input id="sidebarColorInput" type="text" value="${App.theme.sidebarColor}" placeholder="#F4E8DD">
        <input type="color" id="sidebarColorPicker" value="${App.theme.sidebarColor}">
      </div>
      <button id="saveThemeBtn">保存配色方案</button>
      <p style="margin-top:12px;font-size:13px;color:#666">提示：左侧岛台顺序固定，无法调整；头像不显示</p>
    </div>
    `
  },
  init() {
    const bgInput = document.getElementById('bgColorInput');
    const bgPicker = document.getElementById('bgColorPicker');
    const sideInput = document.getElementById('sidebarColorInput');
    const sidePicker = document.getElementById('sidebarColorPicker');
    const saveBtn = document.getElementById('saveThemeBtn');

    bgPicker.addEventListener('input', () => bgInput.value = bgPicker.value);
    bgInput.addEventListener('input', () => bgPicker.value = bgInput.value);
    sidePicker.addEventListener('input', () => sideInput.value = sidePicker.value);
    sideInput.addEventListener('input', () => sidePicker.value = sideInput.value);

    saveBtn.addEventListener('click', () => {
      App.theme.bgColor = bgInput.value.trim();
      App.theme.sidebarColor = sideInput.value.trim();
      document.body.style.backgroundColor = App.theme.bgColor;
      document.querySelector('.sidebar').style.background = App.theme.sidebarColor;
      App.saveTheme();
      alert('配色保存成功！');
    })
  }
}

// 启动应用
window.addEventListener('DOMContentLoaded', () => App.init());