import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Car, 
  Utensils, 
  CloudSun, 
  Camera, 
  Wallet, 
  Info, 
  Calendar, 
  X, 
  Plus, 
  Trash2, 
  Navigation, 
  Wind, 
  Droplets, 
  ChevronRight, 
  Sun, 
  Feather, 
  Edit2, 
  Save, 
  RotateCcw, 
  Ticket, 
  Plane, 
  Building2, 
  QrCode, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  ExternalLink, 
  Map, 
  Mail, 
  AlertTriangle, 
  Briefcase, 
  Loader2,
  Type // Added for font size toggle
} from 'lucide-react';

// --- Firebase Imports ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query,
  serverTimestamp
} from 'firebase/firestore';

// --- Firebase Initialization ---
const firebaseConfig = {
  apiKey: "AIzaSyDeCcSu8OCIVEbbI9xaoHuXRawTBmoMZFg",
  authDomain: "beijing-trip.firebaseapp.com",
  projectId: "beijing-trip",
  storageBucket: "beijing-trip.firebasestorage.app",
  messagingSenderId: "606210039654",
  appId: "1:606210039654:web:82cd3e0091e3218a7f32a7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'beijing-travel-app';

// --- Helper Functions ---

const getBaiduMapLink = (query) => {
  return `https://api.map.baidu.com/place/search?query=${encodeURIComponent(query)}&region=北京&output=html&src=webapp.beijing_travel`;
};

// --- Data & Content ---

const itineraryData = [
  {
    day: 1,
    date: "2026/04/02 (四)",
    title: "抵達與初見",
    weather: { temp: "12° - 20°", condition: "多雲", icon: "cloudy", wind: "微風" },
    items: [
      { type: 'transport', time: '12:35', title: '抵達北京首都機場 (PEK)', detail: '航班 BR716', duration: '入境約 1hr' },
      { type: 'transport', time: '13:30', title: '專車接機 → 飯店', detail: '世家精品酒店(團結湖店)', duration: '車程約 30-40 分' },
      { type: 'hotel', time: '15:00', title: '飯店入住 & 休息', detail: '世家精品酒店', duration: '' },
      { type: 'transport', time: '17:00', title: '前往晚餐', detail: '打車/網約車至工體店', duration: '起步價即達' },
      { type: 'food', time: '17:30', title: '四季民福烤鴨 (工體店)', detail: '建議提早去排隊', duration: '預計 1.5hr', mapQuery: "四季民福烤鴨(工體店)" },
      { type: 'attraction', time: '19:30', title: '三里屯太古里', detail: '時尚潮流中心，適合散步消食', 
        mapQuery: "三里屯太古里",
        description: `【三里屯故事】\n三里屯原為距北京城牆三里地的農舍，現已搖身一變成為北京最時尚的潮流地標。這裡融合了傳統與現代，太古里的開放式街區設計靈感來自傳統的四合院與胡同，卻運用了極具現代感的線條與玻璃帷幕。\n\n【遊玩攻略】\n晚上的三里屯燈火通明，<span class="highlight">南區主打年輕時尚，北區則更顯奢華低調</span>。除了購物，這裡也是北京「夜經濟」的代表，酒吧街的熱鬧與書店的靜謐形成強烈對比。`,
        photoSpots: ["太古里彩色玻璃牆", "北區幾何建築線條", "街拍時尚路人"]
      },
    ]
  },
  {
    day: 2,
    date: "2026/04/03 (五)",
    title: "皇城腳下",
    weather: { temp: "10° - 18°", condition: "晴朗", icon: "sunny", wind: "北風 3級" },
    items: [
      { type: 'transport', time: '09:00', title: '前往天安門', detail: '網約車至長安街', duration: '請司機開車經過', mapQuery: "長安街" },
      { type: 'attraction', time: '09:30', title: '天安門廣場 (車遊)', detail: '世界上最大的城市廣場', 
        mapQuery: "天安門廣場",
        ticketUrl: "https://www.google.com/search?q=天安門廣場預約",
        description: `【天安門故事】\n天安門始建於明永樂十五年，原名「承天門」，取「承天啟運，受命于天」之意。它是明清兩代皇城的正門，也是現代中國的象徵。城樓上黃瓦紅牆，金碧輝煌。\n\n【遊玩攻略】\n由於行程安排為車遊，<span class="highlight">請務必坐在車輛右側</span>（視行進方向而定），以便在車輛駛過長安街時，能夠清楚看到天安門城樓與毛主席紀念堂的宏偉外觀。`,
        photoSpots: ["車窗視角天安門", "長安街寬闊街景"]
      },
      { type: 'attraction', time: '10:30', title: '故宮博物院 (紫禁城)', detail: '需提前預約，東華門下車', 
        mapQuery: "故宮博物院",
        ticketUrl: "https://www.google.com/search?q=故宮博物院門票預約",
        description: `【紫禁城深度解析】\n紫禁城是世界上現存規模最大、保存最完整的木質結構古建築群。自明成祖永樂十八年（1420年）建成以來，共有24位皇帝在此居住。\n\n【遊玩攻略】\n路線建議：<span class="highlight">午門（入口）→ 太和門 → 三大殿（太和、中和、保和）→ 乾清宮 → 御花園 → 神武門（出口）</span>。\n特別注意觀察屋頂脊獸的數量，<span class="highlight">太和殿擁有唯一的十隻脊獸</span>，象徵至高無上的皇權。`,
        photoSpots: ["紅牆夾道", "太和殿廣場", "御花園堆秀山"]
      },
      { type: 'food', time: '13:30', title: '故宮周邊京菜', detail: '神武門附近餐廳', duration: '' },
      { type: 'transport', time: '15:30', title: '回飯店午休', detail: '養精蓄銳', duration: '' },
      { type: 'food', time: '18:00', title: '東來順涮羊肉', detail: '百年老字號', duration: '', mapQuery: "東來順涮羊肉" },
    ]
  },
  {
    day: 3,
    date: "2026/04/04 (六)",
    title: "長城好漢",
    weather: { temp: "8° - 16°", condition: "晴轉多雲", icon: "partly-cloudy", wind: "西北風 4級" },
    items: [
      { type: 'transport', time: '08:00', title: '包車前往慕田峪', detail: '清明連假首日，提早出發', duration: '1.5-2 小時' },
      { type: 'attraction', time: '10:00', title: '慕田峪長城', detail: '秀美長城，人少景美', 
        mapQuery: "慕田峪長城",
        ticketUrl: "https://www.google.com/search?q=慕田峪長城門票",
        description: `【慕田峪故事】\n相較於八達嶺的人山人海，慕田峪長城以「秀美」著稱，植被覆蓋率高達90%以上。這裡曾是明朝守衛京師的重要關隘，由名將徐達在北齊長城遺址上督建而成。\n\n【遊玩攻略】\n推薦玩法：<span class="highlight">搭乘纜車上至14號敵樓，然後步行至20號敵樓（好漢坡）</span>，這段路風景最美。下山時強烈建議<span class="highlight">體驗「滑道」（旱地雪橇）</span>，從山頂一路滑下，驚險刺激又省力。`,
        photoSpots: ["20號敵樓俯瞰", "滑道體驗視角", "敵樓拱門剪影"]
      },
      { type: 'food', time: '13:00', title: '長城腳下農家菜', detail: '品嚐虹鱒魚', duration: '' },
      { type: 'attraction', time: '15:30', title: '奧林匹克公園 (外觀)', detail: '鳥巢、水立方', 
        mapQuery: "奧林匹克公園",
        description: `【奧運遺產】\n2008年北京奧運會留下的建築奇蹟。鳥巢（國家體育場）由鋼鐵編織而成，寓意孕育生命；水立方（國家游泳中心）則由藍色ETFE膜構成，如夢似幻。\n\n【遊玩攻略】\n本次行程為外觀，建議在<span class="highlight">景觀大道</span>上漫步。傍晚時分是最佳觀賞期，可以看到建築燈光亮起。`,
        photoSpots: ["鳥巢鋼結構特寫", "水立方藍色外牆", "景觀大道全景"]
      },
      { type: 'food', time: '18:00', title: '精緻宮廷菜', detail: '體驗皇室風味', duration: '' },
    ]
  },
  {
    day: 4,
    date: "2026/04/05 (日)",
    title: "皇家園林",
    weather: { temp: "11° - 19°", condition: "微雨", icon: "rainy", wind: "東風 2級" },
    items: [
      { type: 'transport', time: '09:30', title: '前往頤和園', detail: '新建宮門入園', duration: '40-50 分', mapQuery: "頤和園新建宮門" },
      { type: 'attraction', time: '10:00', title: '頤和園', detail: '中國最完整的皇家園林', 
        mapQuery: "頤和園",
        ticketUrl: "https://www.google.com/search?q=頤和園門票",
        description: `【頤和園故事】\n前身為清漪園，是乾隆皇帝為孝敬其母崇慶皇太后而建，後由慈禧太后挪用海軍經費重建。以昆明湖、萬壽山為基址，按照杭州西湖為藍本，汲取江南園林的設計手法。\n\n【遊玩攻略】\n精華路線：<span class="highlight">新建宮門 → 十七孔橋 → 銅牛 → 乘船遊昆明湖 → 石舫 → 長廊 → 排雲殿 → 佛香閣 → 北宮門出</span>。這條路線可以不走回頭路，且包含了水路體驗。`,
        photoSpots: ["十七孔橋", "佛香閣遠景", "長廊透視"]
      },
      { type: 'transport', time: '15:00', title: '前往什剎海', detail: '體驗老北京胡同文化', duration: '' },
      { type: 'attraction', time: '15:30', title: '什剎海 (胡同遊)', detail: '前海、後海、西海', 
        mapQuery: "什剎海",
        description: `【老北京風情】\n「先有什剎海，後有北京城」。這裡是北京保存最完整的歷史街區之一，保留了大量王府與故居。湖岸邊垂柳依依，胡同裡京味十足。\n\n【遊玩攻略】\n推薦<span class="highlight">乘坐人力黃包車</span>遊覽胡同，聽車夫講述老北京的故事。之後可以步行至<span class="highlight">銀錠橋</span>，這裡是「燕京小八景」之一的「銀錠觀山」處。`,
        photoSpots: ["銀錠橋", "胡同灰牆", "後海酒吧街燈火"]
      },
    ]
  },
  {
    day: 5,
    date: "2026/04/06 (一)",
    title: "老街與告別",
    weather: { temp: "13° - 21°", condition: "晴朗", icon: "sunny", wind: "南風" },
    items: [
      { type: 'transport', time: '09:30', title: '退房 & 行李寄存', detail: '前往天壇東門', duration: '', mapQuery: "天壇東門" },
      { type: 'attraction', time: '10:00', title: '天壇公園', detail: '明清皇帝祭天之所', 
        mapQuery: "天壇公園",
        ticketUrl: "https://www.google.com/search?q=天壇公園門票",
        description: `【天壇故事】\n天壇是明清兩代皇帝「祭天」、「祈穀」的場所。其建築佈局呈現「天圓地方」的宇宙觀，北牆呈圓形，南牆呈方形。\n\n【遊玩攻略】\n必看三大建築：<span class="highlight">祈年殿、皇穹宇（回音壁）、圓丘壇</span>。在回音壁如果遊客較少，可以嘗試兩人分站東西牆對話，體驗聲學奇蹟。`,
        photoSpots: ["祈年殿標準照", "皇穹宇回音壁", "古樹群"]
      },
      { type: 'food', time: '12:30', title: '都一處燒麥', detail: '前門大街老字號', duration: '', mapQuery: "都一處燒麥(前門店)" },
      { type: 'attraction', time: '14:30', title: '前門大街 & 大柵欄', detail: '逛老字號，買伴手禮', 
        mapQuery: "前門大街",
        description: `【京城商業發源】\n前門大街是北京中軸線的一部分，大柵欄則匯集了瑞蚨祥、同仁堂、內聯陞等眾多百年老字號。\n\n【遊玩攻略】\n這裡是購買伴手禮的最佳地點。可以體驗<span class="highlight">噹噹車（有軌電車）</span>，感受民國風情。`,
        photoSpots: ["正陽門箭樓", "噹噹車", "大柵欄牌坊"]
      },
      { type: 'transport', time: '16:00', title: '回飯店取行李', detail: '務必提前出發', duration: '' },
      { type: 'transport', time: '17:00', title: '前往機場 (PEK)', detail: '專車送機', duration: '' },
      { type: 'transport', time: '20:45', title: '搭機返台', detail: '航班 BR715', duration: '平安回家' },
    ]
  },
];

const diningData = [
  { id: 1, name: "四季民福烤鴨 (工體店)", type: "烤鴨", rating: 4.9, hours: "10:30-22:30", note: "北京烤鴨天花板，建議提前2小時取號。" },
  { id: 2, name: "聚寶源 (牛街總店)", type: "火鍋", rating: 4.8, hours: "11:00-22:00", note: "老北京銅鍋涮肉首選，手切鮮羊肉必點。" },
  { id: 3, name: "東來順 (王府井總店)", type: "火鍋", rating: 4.5, hours: "11:00-21:30", note: "百年老字號，景泰藍銅鍋是特色。" },
  { id: 4, name: "那家小館 (永安里店)", type: "宮廷菜", rating: 4.7, hours: "11:00-21:30", note: "皇太極後裔開的館子，酥皮蝦是招牌。" },
  { id: 5, name: "全聚德 (前門店)", type: "烤鴨", rating: 4.4, hours: "11:00-20:00", note: "掛爐烤鴨鼻祖，前門店裝修古色古香。" },
  { id: 6, name: "大董 (工體店)", type: "創意菜", rating: 4.8, hours: "11:00-22:00", note: "酥不膩烤鴨，意境菜的代表，價格稍高。" },
  { id: 7, name: "小吊梨湯 (團結湖店)", type: "私房菜", rating: 4.6, hours: "11:00-21:30", note: "必點梨湯和乾酪魚，環境復古。" },
  { id: 8, name: "都一處燒麥 (前門店)", type: "小吃", rating: 4.2, hours: "09:00-21:00", note: "乾隆皇帝賜名，燒麥皮薄餡大。" },
  { id: 9, name: "姚記炒肝 (鼓樓店)", type: "小吃", rating: 4.1, hours: "06:00-22:30", note: "拜登去過的店，體驗道地老北京早餐。" },
  { id: 10, name: "南門涮肉 (天壇店)", type: "火鍋", rating: 4.7, hours: "11:00-22:00", note: "清真火鍋，醬料獨特，肉質鮮嫩。" },
  { id: 11, name: "局氣 (西單店)", type: "京菜", rating: 4.5, hours: "11:00-21:30", note: "蜂窩煤炒飯很有特色，適合年輕人。" },
  { id: 12, name: "護國寺小吃 (總店)", type: "小吃", rating: 4.3, hours: "05:30-21:00", note: "豆汁、焦圈、驢打滾，這裡最齊全。" },
  { id: 13, name: "花家怡園 (簋街店)", type: "京菜", rating: 4.6, hours: "10:30-04:00", note: "四合院裡吃飯，晚上有表演。" },
  { id: 14, name: "白家大院", type: "宮廷菜", rating: 4.7, hours: "11:00-22:00", note: "親王府邸改建，服務員穿宮廷裝，環境一流。" },
  { id: 15, name: "大碗居 (東四店)", type: "家常菜", rating: 4.4, hours: "11:00-22:00", note: "性價比高，烤鴨和宮保雞丁不錯。" },
  { id: 16, name: "餡老滿 (安定門店)", type: "餃子", rating: 4.5, hours: "10:30-22:00", note: "餃子種類多，餡料飽滿，還有老滿鍋貼。" },
  { id: 17, name: "京兆尹", type: "素食", rating: 4.9, hours: "11:30-22:00", note: "米其林三星素食，環境極其優雅，需預約。" },
  { id: 18, name: "TRB Hutong", type: "西餐", rating: 4.8, hours: "11:30-22:00", note: "古寺廟裡的法餐，景觀無敵。" },
  { id: 19, name: "慶豐包子舖", type: "小吃", rating: 3.8, hours: "06:00-21:00", note: "主席套餐（包子、炒肝、芥菜），方便快捷。" },
  { id: 20, name: "海碗居 (增光路店)", type: "麵食", rating: 4.4, hours: "11:00-22:00", note: "炸醬麵最正宗，店小二吆喝很有氣氛。" },
  { id: 21, name: "張媽媽特色川味館", type: "川菜", rating: 4.6, hours: "11:00-22:30", note: "在北京很火的川菜，缽缽雞必點。" },
  { id: 22, name: "便宜坊烤鴨 (鮮魚口店)", type: "烤鴨", rating: 4.3, hours: "11:00-21:00", note: "悶爐烤鴨代表，肉質更嫩。" },
  { id: 23, name: "滿恆記", type: "火鍋", rating: 4.8, hours: "11:00-22:00", note: "清真火鍋排隊王，金獎糖餅一絕。" },
  { id: 24, name: "烤肉季 (什剎海店)", type: "燒烤", rating: 4.4, hours: "11:00-23:00", note: "南宛北季，在後海邊吃烤肉賞景。" },
  { id: 25, name: "厲家菜", type: "宮廷菜", rating: 4.5, hours: "11:30-21:00", note: "預約制，傳承自清宮御膳房。" },
  { id: 26, name: "門框胡同百年鹵煮", type: "小吃", rating: 4.3, hours: "10:00-24:00", note: "重口味愛好者必試，老北京地道風味。" },
  { id: 27, name: "日昌餐館", type: "粵菜", rating: 4.4, hours: "10:00-22:00", note: "紙包雞翅很有名，學生時代的回憶。" },
  { id: 28, name: "大槐樹烤肉館", type: "燒烤", rating: 4.2, hours: "11:00-23:00", note: "老北京炙子烤肉，煙火氣十足。" },
  { id: 29, name: "北平樓 (牡丹園店)", type: "京菜", rating: 4.3, hours: "11:00-21:30", note: "菜量大，價格實惠，適合家庭聚餐。" },
  { id: 30, name: "老磁器口豆汁店", type: "小吃", rating: 4.0, hours: "06:00-20:00", note: "挑戰豆汁焦圈的最佳地點。" }
];

const infoData = {
  souvenirs: [
    { name: "稻香村糕點", note: "建議買「京八件」禮盒，牛舌餅、棗花酥最經典。", tag: "美食" },
    { name: "吳裕泰花茶", note: "茉莉花茶是北京人的最愛，老字號品質有保證。", tag: "飲品" },
    { name: "同仁堂養生品", note: "適合送長輩，如阿膠糕或養生茶包。", tag: "健康" },
    { name: "故宮文創", note: "故宮內或淘寶旗艦店可買，設計感強，適合年輕人。", tag: "文創" },
    { name: "六必居醬菜", note: "明朝老店，甜麵醬與醬八寶是家常送禮首選。", tag: "美食" },
    { name: "瑞蚨祥絲綢", note: "百年老字號，絲綢品質極佳，適合定製旗袍或買圍巾。", tag: "服飾" },
    { name: "內聯陞布鞋", note: "手工製作千層底布鞋，舒適透氣，長輩最愛。", tag: "鞋履" },
    { name: "御食園果脯", note: "北京特產茯苓餅、北京烤鴨零食版，適合分發同事。", tag: "零食" }
  ],
  tips: [
    { 
      title: "入境攜帶物品需知", 
      text: "禁止攜帶生鮮蔬果、肉類製品（含肉乾）、蛋奶製品。現金限制：人民幣2萬元或外幣等值5000美元。菸酒限制：香菸400支、酒類1500毫升（12度以上）。嚴禁攜帶違禁書刊及政治敏感資料。" 
    },
    { title: "證件與支付", text: "台胞證務必隨身攜帶。支付寶/微信支付需提前綁定台灣信用卡或儲值。" },
    { title: "網路與地圖", text: "建議開通漫遊或購買中港卡（免翻牆）。地圖請用「高德地圖」或「百度地圖」，Google Maps 不準。" },
    { title: "預約制", text: "故宮、國家博物館、天安門廣場進入都需要提前7天在微信小程序預約，非常搶手！" },
    { 
      title: "郵務資訊", 
      content: (
        <span>
          寄回台灣明信片資費約 3.5 RMB (航空) 或 1.5 RMB (水陸)。主要郵局：
          <a href={getBaiduMapLink("建國門內大街郵局")} target="_blank" rel="noreferrer" className="text-red-800 underline mx-1 font-bold inline-flex items-center gap-0.5"><Map size={14}/>建國門內大街郵局</a>
          （有紀念戳）、
          <a href={getBaiduMapLink("大柵欄郵局")} target="_blank" rel="noreferrer" className="text-red-800 underline mx-1 font-bold inline-flex items-center gap-0.5"><Map size={14}/>大柵欄郵局</a>。
        </span>
      )
    },
    { title: "安全與防騙", text: "注意「黑車」，堅持打表或用網約車。景區周邊「喝茶」邀約多為騙局。地鐵安檢嚴格，請勿攜帶違禁品。" },
    { title: "氣候與保養", text: "北京氣候極度乾燥，南方人易流鼻血。務必攜帶高保濕乳液、護唇膏，多喝水。" },
  ],
  visa: "持有效期限內之「台灣居民來往大陸通行證」（台胞證）即可入境，無需額外簽證。若落地簽需備好身分證、護照、照片及人民幣。",
  clothing: "4月初北京氣溫約 8-20°C，日夜溫差大。建議「洋蔥式穿法」：長袖T恤 + 薄毛衣/衛衣 + 防風外套。長城風大，建議帶帽子。鞋子務必穿好走的運動鞋。"
};

const bookingData = {
  flights: [
    { 
      type: "outbound", 
      airline: "EVA Air 長榮航空", 
      code: "BR716", 
      date: "2026/04/02", 
      from: "TPE", 
      to: "PEK", 
      fromCity: "Taipei",
      toCity: "Beijing",
      dep: "09:15", 
      arr: "12:35", 
      class: "Economy" 
    },
    { 
      type: "inbound", 
      airline: "EVA Air 長榮航空", 
      code: "BR715", 
      date: "2026/04/06", 
      from: "PEK", 
      to: "TPE", 
      fromCity: "Beijing", 
      toCity: "Taipei",
      dep: "20:45", 
      arr: "23:55", 
      class: "Economy" 
    }
  ],
  hotel: {
    name: "世家精品酒店 (團結湖店)",
    address: "北京市朝陽區團結湖路",
    checkIn: "2026/04/02",
    checkOut: "2026/04/06",
    nights: 4,
    room: "精品雙床房" 
  }
};

// --- Components ---

const WeatherWidget = ({ weather, font }) => (
  <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm p-5 rounded-3xl shadow-lg shadow-gray-200/50 border border-white mb-8 animate-in slide-in-from-top-4 duration-700">
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-600 shadow-inner">
        {weather.icon === 'sunny' && <Sun size={32} className="text-amber-500" />}
        {weather.icon === 'cloudy' && <CloudSun size={32} className="text-gray-500" />}
        {weather.icon === 'rainy' && <Droplets size={32} className="text-blue-500" />}
        {weather.icon === 'partly-cloudy' && <Wind size={32} className="text-gray-400" />}
      </div>
      <div>
        <div className={`${font['3xl']} font-serif font-bold text-gray-800 tracking-tight`}>{weather.temp}</div>
        <div className={`${font.base} text-gray-500 font-medium font-sans`}>{weather.condition} • {weather.wind}</div>
      </div>
    </div>
    <div className="text-right">
       {/* 模擬印章風格 */}
      <div className={`px-4 py-1.5 border border-red-800/20 text-red-900 ${font.sm} font-serif rounded-sm bg-red-50/50`}>
        北京
      </div>
    </div>
  </div>
);

const DetailModal = ({ item, onClose, font }) => {
  if (!item) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/20 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#fcfcfc] w-full sm:w-[90%] sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2.5rem] sm:rounded-[2rem] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header - Minimalist with Flow */}
        <div className="pt-14 px-8 pb-6 relative shrink-0">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-3 bg-gray-100/50 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={28} strokeWidth={1.5} />
          </button>
          
          <div className="animate-in slide-in-from-bottom-2 duration-500 delay-100">
             <h2 className={`${font['4xl']} font-serif font-bold text-gray-900 tracking-wide mb-4 leading-tight`}>
               {item.title}
             </h2>
             {/* Ink Stroke Divider */}
             <div className="w-20 h-2 bg-gray-900 rounded-full opacity-90"></div>
          </div>
          
          {/* Subtle background decoration */}
          <div className="absolute top-[-50px] right-[-50px] opacity-[0.03] pointer-events-none">
             <Camera size={240} />
          </div>
        </div>

        <div className="px-8 pb-10 overflow-y-auto no-scrollbar">
          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
             {item.mapQuery && (
               <a 
                 href={getBaiduMapLink(item.mapQuery)} 
                 target="_blank" 
                 rel="noreferrer"
                 className={`flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold ${font.base} hover:bg-gray-200 transition-colors`}
               >
                 <MapPin size={20} /> 查看地圖
               </a>
             )}
             {item.ticketUrl && (
               <a 
                 href={item.ticketUrl}
                 target="_blank" 
                 rel="noreferrer"
                 className={`flex-1 bg-red-800 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold ${font.base} hover:bg-red-900 transition-colors`}
               >
                 <Ticket size={20} /> 購票/預約
               </a>
             )}
          </div>

          {/* Guide Content */}
          <div className="space-y-10">
             <div 
               className={`${font.xl} text-gray-700 leading-9 guide-content text-justify font-light`} 
               dangerouslySetInnerHTML={{ __html: item.description }} 
             />

             {/* Photo Spots - Card Style */}
             {item.photoSpots && (
               <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100/80 border border-gray-50">
                 <h3 className={`font-serif font-bold ${font['2xl']} text-gray-900 mb-6 flex items-center gap-3`}>
                   <span className="w-10 h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center border border-red-100">
                      <Camera size={20} /> 
                   </span>
                   攝影機位
                 </h3>
                 <div className="grid gap-4">
                   {item.photoSpots.map((spot, idx) => (
                     <div key={idx} className="flex items-start gap-4 p-2">
                       <span className={`font-serif ${font['3xl']} font-bold text-gray-200 -mt-2`}>
                         0{idx + 1}
                       </span>
                       <span className={`${font.lg} text-gray-800 font-medium pt-1`}>{spot}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
          <div className="h-24"></div> {/* Spacer */}
        </div>
      </div>
    </div>
  );
};

const BoardingPass = ({ flight, font }) => (
  <div className="bg-white rounded-[1.5rem] shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mb-8 relative group hover:shadow-xl transition-shadow duration-300">
    {/* Ink Splatter Decoration */}
    <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] pointer-events-none">
       <Plane size={150} />
    </div>

    {/* Top Section - Route & Flight */}
    <div className="p-8 pb-4 relative z-10">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
           <div className="bg-red-50 p-2 rounded-full text-red-800">
              <Plane size={20} />
           </div>
           <span className={`font-bold tracking-wide text-gray-600 ${font.base}`}>{flight.airline}</span>
        </div>
        <div className="flex flex-col items-end">
           <span className={`font-serif font-bold text-red-900 ${font['2xl']}`}>{flight.code}</span>
           <span className={`${font.xs} text-gray-400 uppercase tracking-widest mt-1`}>{flight.type === 'outbound' ? 'Outbound' : 'Inbound'}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
           <div className={`${font['5xl']} font-serif font-bold text-gray-900`}>{flight.from}</div>
           <div className={`${font.sm} text-gray-400 mt-2 tracking-widest uppercase`}>{flight.fromCity}</div>
        </div>
        <div className="flex flex-col items-center flex-1 px-8">
           {/* Flight Path Line */}
           <div className="w-full h-0.5 bg-gray-200 relative flex items-center justify-center">
             <div className="bg-white px-3">
                {/* Plane icon pointing right */}
                <Plane size={20} className="rotate-45 text-gray-300" />
             </div>
           </div>
           <div className={`${font.xs} text-gray-400 mt-2 font-serif italic`}>{flight.duration || 'Direct'}</div>
        </div>
        <div className="text-right">
           <div className={`${font['5xl']} font-serif font-bold text-gray-900`}>{flight.to}</div>
           <div className={`${font.sm} text-gray-400 mt-2 tracking-widest uppercase`}>{flight.toCity}</div>
        </div>
      </div>
    </div>

    {/* Dashed Divider with Circles */}
    <div className="relative h-6 flex items-center my-2">
       <div className="absolute left-[-12px] w-6 h-6 bg-[#fcfcfc] rounded-full border-r border-gray-100 shadow-inner"></div>
       <div className="w-full border-b-2 border-dashed border-gray-300 mx-6"></div>
       <div className="absolute right-[-12px] w-6 h-6 bg-[#fcfcfc] rounded-full border-l border-gray-100 shadow-inner"></div>
    </div>

    {/* Info Section */}
    <div className="p-8 pt-4 bg-gray-50/50">
       <div className="grid grid-cols-3 gap-6 mb-2">
         <div>
            <div className={`${font.xs} text-gray-400 mb-2 uppercase tracking-widest font-bold`}>Date</div>
            <div className={`font-bold text-gray-800 ${font.xl} font-serif`}>{flight.date}</div>
         </div>
         <div className="text-center"> 
            <div className={`${font.xs} text-gray-400 mb-2 uppercase tracking-widest font-bold`}>Departs</div>
            <div className={`font-bold text-gray-800 ${font.xl} font-serif`}>{flight.dep}</div>
         </div>
         <div className="text-right">
            <div className={`${font.xs} text-gray-400 mb-2 uppercase tracking-widest font-bold`}>Arrives</div>
            <div className={`font-bold text-gray-800 ${font.xl} font-serif`}>{flight.arr}</div>
         </div>
       </div>
    </div>
  </div>
);

const HotelCard = ({ hotel, font }) => (
  <div className="bg-white rounded-[1.5rem] shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden relative p-8 mb-8 group hover:shadow-xl transition-all duration-300">
     
     {/* Decorative Icon Background */}
     <div className="absolute top-[-10px] right-[-10px] text-gray-50 opacity-50">
        <Building2 size={140} strokeWidth={1} />
     </div>

     <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
           <div className="flex-1 pr-4">
             <span className={`inline-block px-3 py-1.5 bg-gray-100 text-gray-600 ${font.xs} font-bold rounded mb-3 tracking-wide uppercase`}>Hotel Voucher</span>
             <h3 className={`${font['3xl']} font-serif font-bold text-gray-900 leading-tight mb-3`}>{hotel.name}</h3>
             <a 
               href={getBaiduMapLink(hotel.name + " " + hotel.address)}
               target="_blank"
               rel="noreferrer"
               className="flex items-start gap-2 text-gray-500 hover:text-red-800 transition-colors group/link"
             >
                <MapPin size={20} className="mt-0.5 shrink-0 text-red-800" />
                <span className={`${font.base} font-light border-b border-dashed border-gray-300 pb-0.5 group-hover/link:border-red-800`}>{hotel.address}</span>
             </a>
           </div>
           {/* Explicit Map Button */}
           <a 
             href={getBaiduMapLink(hotel.name + " " + hotel.address)}
             target="_blank"
             rel="noreferrer"
             className="p-4 bg-red-50 text-red-800 rounded-full hover:bg-red-100 transition-colors shadow-sm shrink-0"
           >
              <Map size={24} />
           </a>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-8">
           <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className={`${font.xs} text-gray-400 uppercase tracking-widest font-bold mb-2`}>Check-In</div>
              <div className={`font-serif font-bold text-gray-900 ${font['2xl']}`}>{hotel.checkIn.slice(5)}</div>
              <div className={`${font.sm} text-gray-500 mt-1`}>15:00 後</div>
           </div>
           
           <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className={`${font.xs} text-gray-400 uppercase tracking-widest font-bold mb-2`}>Check-Out</div>
              <div className={`font-serif font-bold text-gray-900 ${font['2xl']}`}>{hotel.checkOut.slice(5)}</div>
              <div className={`${font.sm} text-gray-500 mt-1`}>12:00 前</div>
           </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
           <div className={`flex items-center gap-3 ${font.base} text-gray-700 font-medium`}>
              <div className="bg-red-50 p-2 rounded-full text-red-800">
                 <Building2 size={18} />
              </div>
              {hotel.room}
           </div>
           <div className={`${font.base} text-gray-400 font-serif italic`}>
              {hotel.nights} Nights Stay
           </div>
        </div>
     </div>
  </div>
);

const BookingTab = ({ font }) => (
  <div className="p-6 space-y-4 pb-32 animate-in fade-in duration-500">
     {/* Section Title */}
     <div className="mb-8 flex items-baseline gap-3">
        <h2 className={`${font['4xl']} font-serif font-bold text-gray-900`}>行程預訂</h2>
        <span className={`${font.sm} text-gray-400 tracking-widest uppercase`}>Bookings</span>
     </div>

     {bookingData.flights.map((flight, idx) => (
       <BoardingPass key={idx} flight={flight} font={font} />
     ))}

     <div className="h-6"></div> {/* Spacer */}

     <HotelCard hotel={bookingData.hotel} font={font} />
  </div>
);

const DiningTab = ({ font }) => (
  <div className="p-6 pb-32 animate-in fade-in duration-500">
    <div className="mb-8 flex items-baseline gap-3">
        <h2 className={`${font['4xl']} font-serif font-bold text-gray-900`}>尋味北京</h2>
        <span className={`${font.sm} text-gray-400 tracking-widest uppercase`}>Gastronomy</span>
     </div>

     <div className="space-y-5">
       {diningData.map(item => (
         <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
               <div>
                 <div className="flex items-center gap-3 mb-2">
                   <span className={`px-3 py-1 bg-red-50 text-red-800 ${font.xs} font-bold rounded-full`}>{item.type}</span>
                   <div className="flex items-center gap-1.5 text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className={`${font.sm} font-bold text-gray-700`}>{item.rating}</span>
                   </div>
                 </div>
                 <h3 className={`font-bold text-gray-900 ${font.xl}`}>{item.name}</h3>
               </div>
               <a 
                 href={getBaiduMapLink(item.name + " 北京")}
                 target="_blank"
                 rel="noreferrer"
                 className="p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 hover:text-red-800 transition-colors"
               >
                 <Map size={22} />
               </a>
            </div>
            
            <div className={`${font.sm} text-gray-500 flex items-center gap-2`}>
               <Clock size={16} /> {item.hours}
            </div>
            
            <p className={`${font.base} text-gray-600 leading-relaxed pt-3 border-t border-dashed border-gray-100`}>
               {item.note}
            </p>
         </div>
       ))}
     </div>
  </div>
);

const ExpenseTracker = ({ font }) => {
  const [expenses, setExpenses] = useState([]); // Default empty
  const [user, setUser] = useState(null); // Auth user state
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [currency, setCurrency] = useState("CNY");
  const [selectedDay, setSelectedDay] = useState("Day 1");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false); // Stop loading if no user
    });
    return () => unsubscribe();
  }, []);

  // 2. Sync Data with Firestore
  useEffect(() => {
    if (!user) return;

    const expensesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'expenses');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(expensesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Memory sort by timestamp desc (newest first)
      data.sort((a, b) => {
        const tA = a.timestamp?.toMillis() || 0;
        const tB = b.timestamp?.toMillis() || 0;
        return tB - tA;
      });

      setExpenses(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const resetForm = () => {
    setNewTitle("");
    setNewAmount("");
    setCurrency("CNY");
    setSelectedDay("Day 1");
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!newTitle || !newAmount || !user) return;

    try {
      const expenseData = {
        title: newTitle,
        amount: parseFloat(newAmount),
        currency,
        day: selectedDay,
        timestamp: serverTimestamp() // Use server timestamp
      };

      if (editingId) {
        // Update
        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'expenses', editingId);
        await updateDoc(docRef, expenseData);
      } else {
        // Add
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'expenses'), expenseData);
      }
      resetForm();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleEdit = (item) => {
    setNewTitle(item.title);
    setNewAmount(item.amount);
    setCurrency(item.currency);
    setSelectedDay(item.day);
    setEditingId(item.id);
  };

  const removeExpense = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'expenses', id));
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const totalCNY = expenses.filter(e => e.currency === 'CNY').reduce((sum, item) => sum + item.amount, 0);
  const totalTWD = expenses.filter(e => e.currency === 'TWD').reduce((sum, item) => sum + item.amount, 0);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
        <Loader2 className="animate-spin" size={32} />
        <span className={`${font.sm} font-serif`}>雲端資料同步中...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-32 animate-in fade-in duration-500">
      {/* Total Card - Ink Style */}
      <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl shadow-gray-300 relative overflow-hidden">
        <div className="relative z-10">
          <div className={`text-gray-400 ${font.base} font-medium mb-3 tracking-widest uppercase`}>Total Expenses</div>
          <div className={`${font['6xl']} font-serif font-bold flex items-baseline gap-4 mb-3`}>
             <span className={`${font['3xl']} font-sans text-gray-400`}>¥</span> {totalCNY.toLocaleString()} 
          </div>
          {totalTWD > 0 && (
            <div className={`${font.xl} font-medium text-gray-400 flex items-baseline gap-2`}>
               ≈ TWD {totalTWD.toLocaleString()} 
            </div>
          )}
        </div>
        {/* Abstract Ink Blur */}
        <div className="absolute right-[-20%] bottom-[-40%] w-64 h-64 bg-gray-800 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Input Area */}
      <div className="space-y-6">
        <h3 className={`font-serif ${font.xl} font-bold text-gray-900 ml-2 flex items-center gap-2`}>
          {editingId ? <><Edit2 size={20} /> 編輯消費</> : "新增消費"}
        </h3>
        <div className={`bg-white p-6 rounded-3xl shadow-lg shadow-gray-100 border transition-colors flex flex-col gap-4 ${editingId ? 'border-red-100 bg-red-50/20' : 'border-white'}`}>
           
           {/* Row 1: Date & Currency */}
           <div className="flex gap-4">
             <div className="flex-1 relative">
                <select 
                  className={`w-full bg-gray-50 border-0 rounded-xl px-5 py-4 text-gray-800 ${font.base} focus:bg-white transition-all outline-none appearance-none font-medium`}
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {itineraryData.map(d => (
                    <option key={d.day} value={`Day ${d.day}`}>Day {d.day} ({d.date.slice(5)})</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <ChevronRight size={18} className="rotate-90" />
                </div>
             </div>
             <div className="w-28 relative">
                <select 
                  className={`w-full bg-gray-50 border-0 rounded-xl px-4 py-4 ${font.base} font-bold text-gray-600 outline-none appearance-none text-center`}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="CNY">CNY</option>
                  <option value="TWD">TWD</option>
                </select>
             </div>
           </div>

           {/* Row 2: Title */}
           <input 
              type="text" 
              placeholder="消費項目 (如: 打車)" 
              className={`w-full bg-gray-50 border-0 rounded-xl px-5 py-4 text-gray-800 ${font.base} focus:bg-white transition-all outline-none`}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

           {/* Row 3: Amount & Buttons */}
           <div className="flex gap-4">
             <input 
              type="number" 
              placeholder="金額" 
              className={`flex-1 bg-gray-50 border-0 rounded-xl px-5 py-4 text-gray-800 ${font.base} focus:bg-white transition-all outline-none font-medium`}
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
            {editingId && (
              <button 
                onClick={resetForm}
                className={`bg-gray-200 text-gray-600 px-5 rounded-xl font-bold ${font.base} hover:bg-gray-300 transition-colors flex items-center justify-center`}
              >
                <RotateCcw size={22} />
              </button>
            )}
            <button 
              onClick={handleSave}
              className={`${editingId ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-900 hover:bg-black'} text-white px-8 rounded-xl font-bold ${font.base} transition-colors flex items-center justify-center min-w-[3.5rem] shadow-md`}
            >
              {editingId ? <Save size={22} /> : <Plus size={24} />}
            </button>
           </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-5">
        {expenses.map(item => (
          <div 
            key={item.id} 
            className={`flex justify-between items-center bg-white/60 p-6 rounded-2xl border transition-all ${editingId === item.id ? 'border-red-200 shadow-md ring-1 ring-red-100' : 'border-gray-100 hover:bg-white hover:shadow-sm'}`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-3 h-3 rounded-full ${editingId === item.id ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <div>
                <div className={`font-bold text-gray-800 ${font.lg}`}>{item.title}</div>
                <div className={`${font.sm} text-gray-400 mt-1 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full inline-block`}>
                  {item.day}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`font-serif font-bold text-gray-900 ${font['2xl']} mr-2`}>
                {item.currency === 'CNY' ? '¥' : '$'} {item.amount}
              </div>
              <button 
                onClick={() => handleEdit(item)} 
                className={`p-2.5 rounded-full transition-colors ${editingId === item.id ? 'text-red-600 bg-red-50' : 'text-gray-300 hover:text-gray-600 hover:bg-gray-50'}`}
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={() => removeExpense(item.id)} 
                className="p-2.5 rounded-full text-gray-300 hover:text-red-800 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        {expenses.length === 0 && (
          <div className={`text-center py-10 text-gray-400 ${font.base}`}>
             暫無消費記錄
          </div>
        )}
      </div>
    </div>
  );
};

const InfoTab = ({ font }) => (
  <div className="p-6 space-y-10 pb-36 animate-in fade-in duration-500">
    {/* Clothing Card */}
    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-white relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-5">
           <span className="p-3 bg-gray-100 rounded-full text-gray-600"><Wind size={24}/></span>
           <h3 className={`font-serif ${font['2xl']} font-bold text-gray-900`}>衣著指南</h3>
        </div>
        <p className={`${font.lg} text-gray-600 leading-relaxed font-light`}>
          {infoData.clothing}
        </p>
      </div>
      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out"></div>
    </div>

    {/* Tips */}
    <div className="space-y-5">
      <h3 className={`font-serif font-bold ${font['2xl']} text-gray-900 ml-2`}>旅遊須知</h3>
      {infoData.tips.map((tip, idx) => (
        <div key={idx} className="bg-white/80 backdrop-blur-sm p-7 rounded-3xl border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-2 h-2 rounded-full ${tip.title.includes("安全") || tip.title.includes("入境") ? "bg-orange-500" : "bg-red-800"}`}></div>
            <div className={`font-bold text-gray-800 ${font.lg} flex items-center gap-2`}>
              {tip.title}
              {tip.title.includes("郵務") && <Mail size={18} className="text-gray-400"/>}
              {(tip.title.includes("安全") || tip.title.includes("入境")) && <AlertTriangle size={18} className="text-orange-500"/>}
              {tip.title.includes("入境") && <Briefcase size={18} className="text-gray-400"/>}
            </div>
          </div>
          <div className={`${font.base} text-gray-600 leading-loose pl-5`}>
            {tip.text || tip.content}
          </div>
        </div>
      ))}
    </div>

    {/* Souvenirs */}
    <div>
      <h3 className={`font-serif font-bold ${font['2xl']} text-gray-900 mb-6 ml-2`}>必買伴手禮</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {infoData.souvenirs.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
            <span className={`${font.xs} font-bold text-gray-400 tracking-wider mb-3 uppercase`}>{item.tag}</span>
            <div className={`font-serif font-bold text-gray-900 mb-2 ${font.xl}`}>{item.name}</div>
            <div className={`${font.base} text-gray-500 leading-relaxed mt-auto`}>{item.note}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Main App Component ---

export default function BeijingTravelApp() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLargeFont, setIsLargeFont] = useState(true); // Default to Large (Senior Friendly)

  // Define dynamic font classes based on state
  const font = useMemo(() => isLargeFont ? {
    xs: 'text-sm',
    sm: 'text-base',
    base: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
    '3xl': 'text-4xl',
    '4xl': 'text-5xl',
    '5xl': 'text-6xl',
    '6xl': 'text-7xl',
  } : {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  }, [isLargeFont]);

  const currentDayData = useMemo(() => 
    itineraryData.find(d => d.day === selectedDay), 
  [selectedDay]);

  return (
    <div className="h-screen flex flex-col bg-[#fcfcfc] font-sans text-gray-900 max-w-md mx-auto shadow-2xl relative selection:bg-red-100 selection:text-red-900 overflow-hidden">
      
      {/* Subtle Ink Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply" 
           style={{
             backgroundImage: 'radial-gradient(circle at 10% 20%, #f3f4f6 0%, transparent 40%), radial-gradient(circle at 90% 80%, #f3f4f6 0%, transparent 40%)'
           }}>
      </div>

      {/* Header - Clean Ink Style */}
      <header className="pt-16 pb-4 px-8 bg-transparent relative z-20 flex-shrink-0">
        <div className="flex justify-between items-end">
          <div>
            <h1 className={`${font['4xl']} font-serif font-bold text-gray-900 tracking-wide leading-none`}>
              北京<span className={`text-red-800 ${font['2xl']} align-top ml-1`}>●</span>
            </h1>
            <p className={`${font.sm} text-gray-400 font-medium tracking-[0.2em] mt-3 uppercase`}>Travel Guide</p>
          </div>
          {/* Controls Container */}
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsLargeFont(!isLargeFont)}
               className="w-10 h-10 rounded-full bg-white/80 border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
               aria-label="Toggle Font Size"
             >
                <Type size={20} />
             </button>
             {/* Logo Mark */}
             <div className="w-14 h-14 border-2 border-gray-900 rounded-xl flex items-center justify-center rotate-3 bg-white/50 backdrop-blur-sm">
                <span className={`font-serif font-bold text-gray-900 ${font['3xl']}`}>京</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10 pb-32">
        
        {/* Render Tabs */}
        {activeTab === 'itinerary' && (
          <div className="animate-in fade-in duration-500">
            {/* Day Selector - Floating Pills */}
            <div className="flex overflow-x-auto gap-4 px-8 py-6 no-scrollbar snap-x sticky top-0 z-30 bg-gradient-to-b from-[#fcfcfc] via-[#fcfcfc] to-transparent">
              {itineraryData.map(d => (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(d.day)}
                  className={`flex-shrink-0 snap-center px-7 py-3.5 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                    selectedDay === d.day 
                      ? 'bg-gray-900 text-white scale-105 shadow-xl shadow-gray-400/30' 
                      : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100'
                  }`}
                >
                  <span className={`${font.base} font-bold whitespace-nowrap font-serif`}>Day {d.day}</span>
                </button>
              ))}
            </div>

            <div className="px-8 pb-32">
              <div className="mb-8">
                 <h2 className={`${font['3xl']} font-serif font-bold text-gray-900 mb-2`}>
                    {currentDayData.title}
                 </h2>
                 <div className="w-10 h-1.5 bg-red-800/80 rounded-full mb-3"></div>
                 <div className={`${font.base} text-gray-400 font-medium tracking-wide`}>{currentDayData.date}</div>
              </div>
              
              <WeatherWidget weather={currentDayData.weather} font={font} />

              {/* Timeline - Flowing */}
              <div className="relative space-y-12 mt-10">
                {/* Subtle Guide Line */}
                <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

                {currentDayData.items.map((item, index) => {
                  const isAttraction = item.type === 'attraction';
                  return (
                    <div key={index} className="relative pl-14 group">
                      {/* Timeline Node */}
                      <div className={`absolute left-0 top-1.5 w-12 h-12 rounded-full z-10 flex items-center justify-center transition-all duration-300 border-4 border-[#fcfcfc] ${
                         isAttraction 
                           ? 'bg-red-800 text-white shadow-lg shadow-red-900/20 scale-110' 
                           : 'bg-white text-gray-300 border-gray-100'
                      }`}>
                         {item.type === 'transport' && <Car size={18} />}
                         {item.type === 'food' && <Utensils size={18} />}
                         {item.type === 'hotel' && <MapPin size={18} />}
                         {isAttraction && <Feather size={18} />}
                      </div>

                      {/* Card - Floating Effect */}
                      <div 
                        onClick={() => isAttraction && setSelectedItem(item)}
                        className={`
                          relative rounded-[2rem] transition-all duration-300
                          ${isAttraction 
                            ? 'bg-white shadow-xl shadow-gray-200/60 p-7 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/80' 
                            : 'bg-transparent py-3 pl-2'}
                        `}
                      >
                         <div className="flex justify-between items-start mb-3">
                            <span className={`${font.xs} font-bold tracking-widest font-mono uppercase ${isAttraction ? 'text-gray-400' : 'text-gray-300'}`}>
                              {item.time}
                            </span>
                            {isAttraction && <div className="w-2 h-2 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                         </div>
                         
                         <h3 className={`font-bold mb-3 ${isAttraction ? `${font['2xl']} font-serif text-gray-900` : `${font.lg} text-gray-500`}`}>
                           {item.title}
                         </h3>
                         
                         <p className={`${font.base} leading-relaxed ${isAttraction ? 'text-gray-600 line-clamp-2' : 'text-gray-400'}`}>
                           {item.detail}
                         </p>

                         {/* Quick Map Link for Timeline Items */}
                         {item.mapQuery && !isAttraction && (
                            <a 
                              href={getBaiduMapLink(item.mapQuery)}
                              target="_blank" 
                              rel="noreferrer"
                              className={`mt-3 ${font.sm} text-red-800 flex items-center gap-1.5 font-bold`}
                            >
                              <MapPin size={14} /> 導航
                            </a>
                         )}

                         {isAttraction && item.photoSpots && (
                            <div className="mt-5 pt-5 border-t border-gray-50 flex gap-3 overflow-hidden">
                              {item.photoSpots.slice(0, 2).map((spot, i) => (
                                <span key={i} className={`${font.xs} bg-gray-50 text-gray-600 px-4 py-2 rounded-full font-medium`}>
                                  {spot}
                                </span>
                              ))}
                            </div>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'dining' && <DiningTab font={font} />}
        {activeTab === 'bookings' && <BookingTab font={font} />}
        {activeTab === 'expenses' && <ExpenseTracker font={font} />}
        {activeTab === 'info' && <InfoTab font={font} />}
      </main>

      {/* Tab Bar - Floating Pill */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-full shadow-2xl shadow-gray-200/50 border border-white/50 flex items-center z-40 px-8 py-5 gap-8">
         <button 
           onClick={() => setActiveTab('itinerary')}
           className={`relative transition-all duration-300 ${activeTab === 'itinerary' ? 'text-red-800 scale-110' : 'text-gray-300 hover:text-gray-500'}`}
         >
            <Calendar size={28} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} />
            {activeTab === 'itinerary' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-800 rounded-full"></div>}
         </button>
         <button 
           onClick={() => setActiveTab('dining')}
           className={`relative transition-all duration-300 ${activeTab === 'dining' ? 'text-red-800 scale-110' : 'text-gray-300 hover:text-gray-500'}`}
         >
            <Utensils size={28} strokeWidth={activeTab === 'dining' ? 2.5 : 2} />
            {activeTab === 'dining' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-800 rounded-full"></div>}
         </button>
         <button 
           onClick={() => setActiveTab('bookings')}
           className={`relative transition-all duration-300 ${activeTab === 'bookings' ? 'text-red-800 scale-110' : 'text-gray-300 hover:text-gray-500'}`}
         >
            <Ticket size={28} strokeWidth={activeTab === 'bookings' ? 2.5 : 2} />
            {activeTab === 'bookings' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-800 rounded-full"></div>}
         </button>
         <button 
           onClick={() => setActiveTab('expenses')}
           className={`relative transition-all duration-300 ${activeTab === 'expenses' ? 'text-red-800 scale-110' : 'text-gray-300 hover:text-gray-500'}`}
         >
            <Wallet size={28} strokeWidth={activeTab === 'expenses' ? 2.5 : 2} />
            {activeTab === 'expenses' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-800 rounded-full"></div>}
         </button>
         <button 
           onClick={() => setActiveTab('info')}
           className={`relative transition-all duration-300 ${activeTab === 'info' ? 'text-red-800 scale-110' : 'text-gray-300 hover:text-gray-500'}`}
         >
            <Info size={28} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
            {activeTab === 'info' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-800 rounded-full"></div>}
         </button>
      </nav>

      {/* Detail Modal */}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} font={font} />
      
      {/* Global Styles */}
      <style>{`
        .guide-content span.highlight {
          background-image: linear-gradient(120deg, #fef3c7 0%, #fef3c7 100%);
          background-repeat: no-repeat;
          background-size: 100% 40%;
          background-position: 0 88%;
          color: #1f2937;
          font-weight: 500;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
