export const APP_DATA = {
  xp: 0,
  overallProgress: 0,
};

export const themes = [
  { id: 'theme_0', title: 'Aktivitas Sehari-hari', subtitle: 'Rutinitas & Kebutuhan', icon: 'Home', progress: 0, isLocked: false, color: 'text-[#7B8E61]', bgColor: 'bg-[#FBF9F6]' },
  { id: 'theme_1', title: 'Pergerakan & Arah', subtitle: 'Transportasi', icon: 'Plane', progress: 0, isLocked: false, color: 'text-[#D4A373]', bgColor: 'bg-[#FBF9F6]' },
  { id: 'theme_2', title: 'Komunikasi', subtitle: 'Interaksi Sosial', icon: 'Users', progress: 0, isLocked: false, color: 'text-[#8B8B7A]', bgColor: 'bg-[#FBF9F6]' },
  { id: 'theme_3', title: 'Pekerjaan & Belajar', subtitle: 'Aktivitas Kognitif', icon: 'Briefcase', progress: 0, isLocked: false, color: 'text-slate-400', bgColor: 'bg-[#F5F2ED]' },
  { id: 'theme_4', title: 'Transaksi', subtitle: 'Kepemilikan Barang', icon: 'ShoppingBag', progress: 0, isLocked: false, color: 'text-slate-400', bgColor: 'bg-[#F5F2ED]' },
  { id: 'theme_5', title: 'Tindakan Fisik', subtitle: 'Manipulasi Objek', icon: 'Hand', progress: 0, isLocked: false, color: 'text-slate-400', bgColor: 'bg-[#F5F2ED]' },
  { id: 'theme_6', title: 'Kondisi & Keadaan', subtitle: 'Perubahan Alam', icon: 'CloudRain', progress: 0, isLocked: false, color: 'text-slate-400', bgColor: 'bg-[#F5F2ED]' },
  { id: 'theme_7', title: 'Bahasa Hormat', subtitle: 'Keigo', icon: 'Heart', progress: 0, isLocked: false, color: 'text-slate-400', bgColor: 'bg-[#F5F2ED]' }
    ];

export const vocabCategories = [
  {
    themeId: "theme_0",
    themeName: "Aktivitas Sehari-hari & Kebutuhan Dasar",
    count: 20,
    icon: "Home",
    words: [
      {
        kanji: "遊ぶ",
        romaji: "asobu",
        indonesian: "bermain"
      },
      {
        kanji: "浴びる",
        romaji: "abiru",
        indonesian: "mandi"
      },
      {
        kanji: "洗う",
        romaji: "arau",
        indonesian: "mencuci"
      },
      {
        kanji: "歌う",
        romaji: "utau",
        indonesian: "bernyanyi"
      },
      {
        kanji: "起きる",
        romaji: "okiru",
        indonesian: "bangun/terjadi"
      },
      {
        kanji: "泳ぐ",
        romaji: "oyogu",
        indonesian: "berenang"
      },
      {
        kanji: "被る",
        romaji: "kaburu",
        indonesian: "memakai (ke kepala)"
      },
      {
        kanji: "着る",
        romaji: "kiru",
        indonesian: "mengenakan"
      },
      {
        kanji: "吸う",
        romaji: "suu",
        indonesian: "mengisap"
      },
      {
        kanji: "住む",
        romaji: "sumu",
        indonesian: "bertempat tinggal"
      },
      {
        kanji: "座る",
        romaji: "suwaru",
        indonesian: "duduk"
      },
      {
        kanji: "楽しむ",
        romaji: "tanoshimu",
        indonesian: "menikmati"
      },
      {
        kanji: "食べる",
        romaji: "taberu",
        indonesian: "makan"
      },
      {
        kanji: "釣る",
        romaji: "tsuru",
        indonesian: "memancing"
      },
      {
        kanji: "脱ぐ",
        romaji: "nugu",
        indonesian: "menanggalkan"
      },
      {
        kanji: "寝る",
        romaji: "neru",
        indonesian: "tidur"
      },
      {
        kanji: "飲む",
        romaji: "nomu",
        indonesian: "minum"
      },
      {
        kanji: "履く",
        romaji: "haku",
        indonesian: "memakai (sepatu)"
      },
      {
        kanji: "磨く",
        romaji: "migaku",
        indonesian: "menggosok"
      },
      {
        kanji: "休む",
        romaji: "yasumu",
        indonesian: "beristirahat"
      }
    ]
  },
  {
    themeId: "theme_1",
    themeName: "Pergerakan, Arah & Transportasi",
    count: 27,
    icon: "Plane",
    words: [
      {
        kanji: "上がる",
        romaji: "agaru",
        indonesian: "naik"
      },
      {
        kanji: "歩く",
        romaji: "aruku",
        indonesian: "berjalan"
      },
      {
        kanji: "行く",
        romaji: "iku",
        indonesian: "pergi"
      },
      {
        kanji: "降りる",
        romaji: "oriru",
        indonesian: "menurunkan"
      },
      {
        kanji: "帰る",
        romaji: "kaeru",
        indonesian: "kembali"
      },
      {
        kanji: "来る",
        romaji: "kuru",
        indonesian: "datang"
      },
      {
        kanji: "下がる",
        romaji: "sagaru",
        indonesian: "turun"
      },
      {
        kanji: "進む",
        romaji: "susumu",
        indonesian: "maju"
      },
      {
        kanji: "立つ",
        romaji: "tatsu",
        indonesian: "berdiri"
      },
      {
        kanji: "着く",
        romaji: "tsuku",
        indonesian: "tiba"
      },
      {
        kanji: "出かける",
        romaji: "dekakeru",
        indonesian: "pergi keluar"
      },
      {
        kanji: "出る",
        romaji: "deru",
        indonesian: "keluar"
      },
      {
        kanji: "飛ぶ",
        romaji: "tobu",
        indonesian: "terbang"
      },
      {
        kanji: "止まる",
        romaji: "tomaru",
        indonesian: "berhenti"
      },
      {
        kanji: "通る",
        romaji: "tooru",
        indonesian: "melalui"
      },
      
      {
        kanji: "逃げる",
        romaji: "nigeru",
        indonesian: "melarikan diri"
      },
      {
        kanji: "登る",
        romaji: "noboru",
        indonesian: "mendaki"
      },
      {
        kanji: "乗る",
        romaji: "noru",
        indonesian: "naik (kendaraan)"
      },
      {
        kanji: "入る",
        romaji: "hairu",
        indonesian: "masuk"
      },
      {
        kanji: "走る",
        romaji: "hashiru",
        indonesian: "berlari"
      },
      {
        kanji: "引っ越す",
        romaji: "hikkosu",
        indonesian: "pindah rumah"
      },
      {
        kanji: "踏む",
        romaji: "fumu",
        indonesian: "melangkah"
      },
      {
        kanji: "曲がる",
        romaji: "magaru",
        indonesian: "berbelok/bengkok"
      },
      {
        kanji: "回る",
        romaji: "mawaru",
        indonesian: "mengelilingi"
      },
      {
        kanji: "向かう",
        romaji: "mukau",
        indonesian: "menghadapi"
      },
      {
        kanji: "戻る",
        romaji: "modoru",
        indonesian: "kembali"
      },
      {
        kanji: "渡る",
        romaji: "wataru",
        indonesian: "menyebrang"
      }
    ]
  },
  {
    themeId: "theme_2",
    themeName: "Komunikasi & Interaksi Sosial",
    count: 23,
    icon: "Users",
    words: [
      {
        kanji: "会う",
        romaji: "au",
        indonesian: "bertemu"
      },
      {
        kanji: "言う",
        romaji: "iu",
        indonesian: "berkata"
      },
      {
        kanji: "電話をかける",
        romaji: "denwa o kakeru",
        indonesian: "menelepon"
      },
      {
        kanji: "聞く",
        romaji: "kiku",
        indonesian: "mendengar/bertanya"
      },
      {
        kanji: "答える",
        romaji: "kotaeru",
        indonesian: "menjawab"
      },
      {
        kanji: "騒ぐ",
        romaji: "sawagu",
        indonesian: "membuat kebisingan"
      },
      {
        kanji: "叱る",
        romaji: "shikaru",
        indonesian: "mengomeli"
      },
      {
        kanji: "知らせる",
        romaji: "shiraseru",
        indonesian: "memberitahu"
      },
      {
        kanji: "頼む",
        romaji: "tanomu",
        indonesian: "memohon"
      },
      {
        kanji: "訪ねる",
        romaji: "tazuneru",
        indonesian: "mengunjungi"
      },
      {
        kanji: "尋ねる",
        romaji: "tazuneru",
        indonesian: "bertanya"
      },
      {
        kanji: "伝える",
        romaji: "tsutaeru",
        indonesian: "menyampaikan"
      },
      {
        kanji: "連れる",
        romaji: "tsureru",
        indonesian: "memimpin"
      },
      {
        kanji: "手伝う",
        romaji: "tetsudau",
        indonesian: "membantu"
      },
      {
        kanji: "泣く",
        romaji: "naku",
        indonesian: "menangis"
      },
      {
        kanji: "話す",
        romaji: "hanasu",
        indonesian: "berbicara"
      },
      {
        kanji: "褒める",
        romaji: "homeru",
        indonesian: "memuji"
      },
      {
        kanji: "待つ",
        romaji: "matsu",
        indonesian: "menunggu"
      },
      {
        kanji: "見せる",
        romaji: "miseru",
        indonesian: "memperlihatkan"
      },
      {
        kanji: "迎える",
        romaji: "mukaeru",
        indonesian: "mendekati"
      },
      {
        kanji: "呼ぶ",
        romaji: "yobu",
        indonesian: "memanggil"
      },
      {
        kanji: "喜ぶ",
        romaji: "yorokobu",
        indonesian: "bersuka cita"
      },
      {
        kanji: "別れる",
        romaji: "wakareru",
        indonesian: "berpisah"
      }
    ]
  },
  {
    themeId: "theme_3",
    themeName: "Pekerjaan, Belajar & Aktivitas Kognitif",
    count: 18,
    icon: "Briefcase",
    words: [
      {
        kanji: "覚える",
        romaji: "oboeru",
        indonesian: "mengingat"
      },
      {
        kanji: "書く",
        romaji: "kaku",
        indonesian: "menulis"
      },
      {
        kanji: "決まる",
        romaji: "kimaru",
        indonesian: "diputuskan"
      },
      {
        kanji: "決める",
        romaji: "kimeru",
        indonesian: "memutuskan"
      },
      {
        kanji: "比べる",
        romaji: "kuraberu",
        indonesian: "membandingkan"
      },
      {
        kanji: "調べる",
        romaji: "shiraberu",
        indonesian: "menginvestigasi"
      },
      {
        kanji: "知る",
        romaji: "shiru",
        indonesian: "tahu"
      },
      {
        kanji: "育てる",
        romaji: "sodateru",
        indonesian: "membesarkan, mendidik"
      },
      {
        kanji: "足す",
        romaji: "tasu",
        indonesian: "menambah, tambah (angka)"
      },
      {
        kanji: "使う",
        romaji: "tsukau",
        indonesian: "menggunakan"
      },
      {
        kanji: "作る",
        romaji: "tsukuru",
        indonesian: "membuat"
      },
      {
        kanji: "勤める",
        romaji: "tsutomeru",
        indonesian: "bekerja untuk seseorang"
      },
      {
        kanji: "働く",
        romaji: "hataraku",
        indonesian: "bekerja"
      },
      {
        kanji: "間違える",
        romaji: "machigaeru",
        indonesian: "melakukan kesalahan"
      },
      {
        kanji: "辞める",
        romaji: "yameru",
        indonesian: "berhenti"
      },
      {
        kanji: "読む",
        romaji: "yomu",
        indonesian: "membaca"
      },
      {
        kanji: "分かる",
        romaji: "wakaru",
        indonesian: "mengerti"
      },
      {
        kanji: "忘れる",
        romaji: "wasureru",
        indonesian: "lupa"
      }
    ]
  },
  {
    themeId: "theme_4",
    themeName: "Transaksi, Kepemilikan & Perpindahan Barang",
    count: 12,
    icon: "ShoppingBag",
    words: [
      {
        kanji: "あげる",
        romaji: "ageru",
        indonesian: "memberi"
      },
      {
        kanji: "売る",
        romaji: "uru",
        indonesian: "menjual"
      },
      {
        kanji: "送る",
        romaji: "okuru",
        indonesian: "mengirim"
      },
      {
        kanji: "買う",
        romaji: "kau",
        indonesian: "membeli"
      },
      {
        kanji: "返す",
        romaji: "kaesu",
        indonesian: "mengembalikan"
      },
      {
        kanji: "貸す",
        romaji: "kasu",
        indonesian: "meminjamkan"
      },
      {
        kanji: "借りる",
        romaji: "kariru",
        indonesian: "meminjam"
      },
      {
        kanji: "くれる",
        romaji: "kureru",
        indonesian: "memberi"
      },
      {
        kanji: "取り替える",
        romaji: "torikaeru",
        indonesian: "menukarkan"
      },
      {
        kanji: "払う",
        romaji: "harau",
        indonesian: "membayar"
      },
      {
        kanji: "貰う",
        romaji: "morau",
        indonesian: "menerima"
      },
      {
        kanji: "渡す",
        romaji: "watasu",
        indonesian: "menyerahkan"
      }
    ]
  },
  {
    themeId: "theme_5",
    themeName: "Tindakan Fisik & Manipulasi Objek",
    count: 39,
    icon: "Hand",
    words: [
      {
        kanji: "開ける",
        romaji: "akeru",
        indonesian: "membuka"
      },
      {
        kanji: "入れる",
        romaji: "ireru",
        indonesian: "memasukan"
      },
      {
        kanji: "置く",
        romaji: "oku",
        indonesian: "meletakan"
      },
      {
        kanji: "押す",
        romaji: "osu",
        indonesian: "menekan"
      },
      {
        kanji: "かける",
        romaji: "kakeru",
        indonesian: "menggantung"
      },
      {
        kanji: "切る",
        romaji: "kiru",
        indonesian: "memotong"
      },
      {
        kanji: "消す",
        romaji: "kesu",
        indonesian: "menghapus"
      },
      {
        kanji: "壊す",
        romaji: "kowasu",
        indonesian: "merusak"
      },
      {
        kanji: "下げる",
        romaji: "sageru",
        indonesian: "menurunkan"
      },
      {
        kanji: "差す",
        romaji: "sasu",
        indonesian: "menunjuk/membuka payung"
      },
      {
        kanji: "触る",
        romaji: "sawaru",
        indonesian: "menyentuh"
      },
      {
        kanji: "閉める",
        romaji: "shimeru",
        indonesian: "menutup"
      },
      
      {
        kanji: "捨てる",
        romaji: "suteru",
        indonesian: "membuang"
      },
      {
        kanji: "する",
        romaji: "suru",
        indonesian: "melakukan"
      },
      {
        kanji: "出す",
        romaji: "dasu",
        indonesian: "mengeluarkan"
      },
      {
        kanji: "建てる",
        romaji: "tateru",
        indonesian: "membangun"
      },
      
      {
        kanji: "捕まえる",
        romaji: "tsukamaeru",
        indonesian: "menangkap"
      },
      {
        kanji: "つける",
        romaji: "tsukeru",
        indonesian: "menyalakan"
      },
      
      {
        kanji: "包む",
        romaji: "tsutsumu",
        indonesian: "membungkus"
      },
      {
        kanji: "止める",
        romaji: "tomeru",
        indonesian: "menghentikan"
      },
      {
        kanji: "取る",
        romaji: "toru",
        indonesian: "mengambil"
      },
      
      {
        kanji: "届ける",
        romaji: "todokeru",
        indonesian: "mencapai"
      },
      {
        kanji: "並べる",
        romaji: "naraberu",
        indonesian: "menyusun"
      },
      {
        kanji: "治す",
        romaji: "naosu",
        indonesian: "menyembuhkan"
      },
      
      {
        kanji: "投げる",
        romaji: "nageru",
        indonesian: "melempar"
      },
      {
        kanji: "盗む",
        romaji: "nusumu",
        indonesian: "mencuri"
      },
      {
        kanji: "塗る",
        romaji: "nuru",
        indonesian: "mencat"
      },
      {
        kanji: "運ぶ",
        romaji: "hakobu",
        indonesian: "mengangkut"
      },
      {
        kanji: "張る",
        romaji: "haru",
        indonesian: "menempelkan"
      },
      {
        kanji: "引く",
        romaji: "hiku",
        indonesian: "menarik"
      },
      
      {
        kanji: "引き出す",
        romaji: "hikidasu",
        indonesian: "menarik keluar"
      },
      
      {
        kanji: "拾う",
        romaji: "hirou",
        indonesian: "memungut"
      },
      {
        kanji: "見つける",
        romaji: "mitsukeru",
        indonesian: "menemukan"
      },
      {
        kanji: "見る",
        romaji: "miru",
        indonesian: "melihat"
      },
      {
        kanji: "持つ",
        romaji: "motsu",
        indonesian: "membawa"
      },
      {
        kanji: "焼く",
        romaji: "yaku",
        indonesian: "memanggang"
      },
      {
        kanji: "やる",
        romaji: "yaru",
        indonesian: "melakukan"
      },
      {
        kanji: "沸かす",
        romaji: "wakasu",
        indonesian: "mendidihkan"
      },
      {
        kanji: "割る",
        romaji: "waru",
        indonesian: "terbagi"
      }
    ]
  },
  {
    themeId: "theme_6",
    themeName: "Kondisi, Keadaan, Perubahan & Alam",
    count: 57,
    icon: "CloudRain",
    words: [
      {
        kanji: "合う",
        romaji: "au",
        indonesian: "cocok, pas"
      },
      {
        kanji: "開く",
        romaji: "aku",
        indonesian: "terbuka"
      },
      {
        kanji: "空く",
        romaji: "aku",
        indonesian: "kosong"
      },
      {
        kanji: "ある",
        romaji: "aru",
        indonesian: "ada, memiliki"
      },
      {
        kanji: "いる",
        romaji: "iru",
        indonesian: "ada"
      },
      {
        kanji: "要る",
        romaji: "iru",
        indonesian: "membutuhkan"
      },
      {
        kanji: "生まれる",
        romaji: "umareru",
        indonesian: "lahir"
      },
      {
        kanji: "終わる",
        romaji: "owaru",
        indonesian: "berakhir"
      },
      {
        kanji: "かかる",
        romaji: "kakaru",
        indonesian: "membutuhkan (waktu/biaya)"
      },
      {
        kanji: "消える",
        romaji: "kieru",
        indonesian: "menghilang"
      },
      {
        kanji: "暮れる",
        romaji: "kureru",
        indonesian: "menjadi gelap"
      },
      {
        kanji: "困る",
        romaji: "komaru",
        indonesian: "bermasalah"
      },
      {
        kanji: "込む",
        romaji: "komu",
        indonesian: "melekuk, menjadi sesak"
      },
      {
        kanji: "壊れる",
        romaji: "kowareru",
        indonesian: "rusak"
      },
      {
        kanji: "咲く",
        romaji: "saku",
        indonesian: "mekar"
      },
      {
        kanji: "死ぬ",
        romaji: "shinu",
        indonesian: "mati"
      },
      {
        kanji: "閉まる",
        romaji: "shimaru",
        indonesian: "tertutup"
      },
      {
        kanji: "育つ",
        romaji: "sodatsu",
        indonesian: "tumbuh besar"
      },
      {
        kanji: "過ぎる",
        romaji: "sugiru",
        indonesian: "melewati"
      },
      {
        kanji: "済む",
        romaji: "sumu",
        indonesian: "reda"
      },
      {
        kanji: "滑る",
        romaji: "suberu",
        indonesian: "terselip, tergelincir"
      },
      {
        kanji: "倒れる",
        romaji: "taoreru",
        indonesian: "runtuh"
      },
      {
        kanji: "足りる",
        romaji: "tariru",
        indonesian: "menjadi cukup"
      },
      {
        kanji: "違う",
        romaji: "chigau",
        indonesian: "berbeda"
      },
      {
        kanji: "疲れる",
        romaji: "tsukareru",
        indonesian: "lelah"
      },
      {
        kanji: "捕まる",
        romaji: "tsukamaru",
        indonesian: "tertangkap"
      },
      {
        kanji: "続く",
        romaji: "tsuzuku",
        indonesian: "berlanjut"
      },
      {
        kanji: "続ける",
        romaji: "tsuzukeru",
        indonesian: "melanjutkan"
      },
      {
        kanji: "出来る",
        romaji: "dekiru",
        indonesian: "bisa"
      },
      {
        kanji: "届く",
        romaji: "todoku",
        indonesian: "tercapai"
      },
      {
        kanji: "鳴く",
        romaji: "naku",
        indonesian: "berbunyi"
      },
      {
        kanji: "亡くなる",
        romaji: "nakunaru",
        indonesian: "meninggal"
      },
      {
        kanji: "無くなる",
        romaji: "nakunaru",
        indonesian: "hilang"
      },
      {
        kanji: "並ぶ",
        romaji: "narabu",
        indonesian: "berbaris"
      },
      {
        kanji: "なる",
        romaji: "naru",
        indonesian: "menjadi"
      },
      {
        kanji: "治る",
        romaji: "naoru",
        indonesian: "sembuh"
      },
      {
        kanji: "直る",
        romaji: "naoru",
        indonesian: "menjadi diperbaiki"
      },
      {
        kanji: "慣れる",
        romaji: "nareru",
        indonesian: "terbiasa"
      },
      {
        kanji: "似る",
        romaji: "niru",
        indonesian: "mirip"
      },
      {
        kanji: "濡れる",
        romaji: "nureru",
        indonesian: "menjadi basah"
      },
      {
        kanji: "残る",
        romaji: "nokoru",
        indonesian: "menyisakan"
      },
      {
        kanji: "始まる",
        romaji: "hajimaru",
        indonesian: "mulai"
      },
      {
        kanji: "晴れる",
        romaji: "hareru",
        indonesian: "menjadi cerah"
      },
      {
        kanji: "冷える",
        romaji: "hieru",
        indonesian: "menjadi dingin"
      },
      {
        kanji: "光る",
        romaji: "hikaru",
        indonesian: "bersinar"
      },
      {
        kanji: "開く",
        romaji: "hiraku",
        indonesian: "membuka (acara, event)"
      },
      {
        kanji: "吹く",
        romaji: "fuku",
        indonesian: "meniup/bertiup"
      },
      {
        kanji: "増える",
        romaji: "fueru",
        indonesian: "bertambah"
      },
      {
        kanji: "太る",
        romaji: "futoru",
        indonesian: "bertambah gemuk"
      },
      {
        kanji: "降る",
        romaji: "furu",
        indonesian: "turun"
      },
      {
        kanji: "負ける",
        romaji: "makeru",
        indonesian: "kalah"
      },
      {
        kanji: "間に合う",
        romaji: "maniau",
        indonesian: "tepat waktu"
      },
      {
        kanji: "見つかる",
        romaji: "mitsukaru",
        indonesian: "ditemukan"
      },
      {
        kanji: "役に立つ",
        romaji: "yakunitatsu",
        indonesian: "berguna"
      },
      {
        kanji: "痩せる",
        romaji: "yaseru",
        indonesian: "menjadi kurus"
      },
      {
        kanji: "沸く",
        romaji: "waku",
        indonesian: "mendidih"
      },
      {
        kanji: "割れる",
        romaji: "wareru",
        indonesian: "membagi"
      }
    ]
  },
  {
    themeId: "theme_7",
    themeName: "Bahasa Hormat (Keigo)",
    count: 4,
    icon: "Heart",
    words: [
      {
        kanji: "差し上げる１",
        romaji: "sashiageru",
        indonesian: "memberi (hormat)"
      },
      {
        kanji: "召し上がる",
        romaji: "meshiagaru",
        indonesian: "makan (hormat)"
      },
      {
        kanji: "申し上げる",
        romaji: "moushiageru",
        indonesian: "mengatakan (hormat)"
      },
      {
        kanji: "申す",
        romaji: "mousu",
        indonesian: "berkata (hormat)"
      }
    ]
  }
];

export const quizData = {
  'theme_0': {
    gridSize: { rows: 6, cols: 5 },
    words: [
      { id: 1, direction: 'down', row: 0, col: 2, answer: 'TABERU', hint: 'Makan' },
      { id: 2, direction: 'across', row: 2, col: 0, answer: 'ASOBU', hint: 'Bermain' }
    ]
  }
};
