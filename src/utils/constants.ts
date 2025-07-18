import { HeaderButton, MapInfo, CircleTextItemData, StatisticItemData, AboutItemProps, CustomerVoiceItemData, PricePlanData, RecruiterFlowStep, SikakuItemProps, SikakuOrderItemProps } from "./types";

export const HeaderButtonList: HeaderButton[] = [
    {
        title: 'リユース転職とは',
        type: 'link',
        to: '/about'
    },
    {
        title: '求人情報',
        type: 'link',
        to: '/jobs'
    },
    {
        title: '業界について',
        type: 'menu',
        items: [
            {
                title: 'リユース業界について知る',
                to: '/business'
            },
            {
                title: '最新動向、採用状況',
                to: '/business/business-new'
            },
            {
                title: 'リユース業界ニュース',
                to: '/news'
            },
            {
                title: '用語集',
                to: '/business/glossary'
            },
            {
                title: 'リユース関連の本',
                to: '/business/book'
            },
        ]
    },
    {
        title: '仕事・スキル',
        type: 'menu',
        items: [
            {
                title: '仕事・スキルについて知る',
                to: '/works'
            },
            {
                title: '資格一覧',
                to: '/qualifications'
            },
            {
                title: '真贋スキル簡易テスト',
                to: '/simplified-test'
            },
        ]
    },
    {
        title: 'インタビュー',
        type: 'menu',
        items: [
            {
                title: '企業インタビュー',
                to: '/interview/business'
            },
            {
                title: '転職者インタビュー',
                to: '/interview/career-changer'
            },
        ]
    },
    {
        title: 'まずはご相談',
        type: 'menu',
        items: [
            {
                title: '転職支援サービス',
                to: '/career-counseling'
            },
            {
                title: '未経験者サポート',
                to: '/inexperience'
            },
            {
                title: '経験者サポート',
                to: '/experience'
            },
            {
                title: 'ミドル・ハイクラス',
                to: '/mid-high'
            },
        ]
    },
    {
        title: 'コラム一覧',
        type: 'link',
        to: '/columns'
    },
    {
        title: '採用担当者の方へ',
        type: 'link',
        to: '/recruiter'
    }
]

export const FooterButtonList = [
    {
        title: 'リユース転職とは',
        to: '/about'
    },
    {
        title: '求人情報',
        to: '/jobs'
    },
    {
        title: '業界について',
        to: 'business',
        items: [
            {
                title: 'リユース業界に ついて知る',
                to: '/business'
            },
            {
                title: '最新動向、採用状況',
                to: '/business/business-new'
            },
            {
                title: 'リユース関連の本',
                to: '/business/book'
            },
            {
                title: '用語集',
                to: '/business/glossary'
            },
            {
                title: 'リユース業界ニュース',
                to: '/news'
            }
        ]
    },
    {
        title: '仕事・スキル',
        to: '/works',
        items: [
            {
                title: '仕事・スキルに ついて知る',
                to: '/works'
            },
            {
                title: '資格一覧',
                to: '/qualifications'
            },
            {
                title: '真贋スキル簡易テスト',
                to: '/simplified-test'
            }
        ]
    },
    {
        title: 'インタビュー',
        to: '/interviews',
        items: [
            {
                title: '転職者インタビュー',
                to: '/interview/career-changer'
            },
            {
                title: '企業インタビュー',
                to: '/interview/business'
            },
        ]
    },
    {
        title: 'まずはご相談',
        to: '/career-counseling',
        items: [
            {
                title: '転職支援サービス',
                to: '/career-counseling'
            },
            {
                title: '未経験者サポート',
                to: '/inexperience'
            },
            {
                title: '経験者サポート',
                to: '/experience'
            },
            {
                title: 'ミドル・ハイクラス',
                to: '/mid-high'
            },
        ]
    },
    {
        title: 'コラム一覧',
        to: '/columns'
    },
    {
        title: 'セミナー情報',
        to: '/seminar'
    },
    {
        title: '会社概要',
        to: '/company'
    },
    {
        title: '採用担当者の方へ',
        to: '/recruiter'
    },
    {
        title: 'お問い合わせ',
        to: '/contact'
    },
]

export const SocialButtonList = [
    {
        id: 'facebook',
        icon: `/images/facebook.png`,
        to: 'https://www.facebook.com/retenshoku/',
    },
    {
        id: 'instagram',
        icon: '/images/instagram.png',
        to: 'https://www.instagram.com/reuse_tenshoku/',
    },
    {
        id: 'twitter',
        icon: '/images/x.png',
        to: 'https://x.com/Reusetenshoku',
    },
]

export const HomeSliderData = [
    {
        id: 1,
        image: '/images/home/slider-1.webp',
    },
    {
        id: 2,
        image: '/images/home/slider-2.webp',
    },
    {
        id: 3,
        image: '/images/home/slider-3.webp',
    },
    {
        id: 4,
        image: '/images/home/slider-4.webp',
    },
]

export const MapData: MapInfo[] = [
    {
        id: 'chubu',
        map: '/images/home/map-chubu.webp',
        text: '中部',
        class: 'top-[50%] left-[45%] bg-[#43a556]',
        city: [
            {
                id: 57,
                text: '新潟'
            },
            {
                id: 58,
                text: '富山'
            },
            {
                id: 59,
                text: '石川'
            },
            {
                id: 60,
                text: '福井'
            },
            {
                id: 61,
                text: '山梨'
            },
            {
                id: 62,
                text: '長野'
            },
            {
                id: 63,
                text: '岐阜'
            },
            {
                id: 64,
                text: '静岡'
            },
            {
                id: 65,
                text: '愛知'
            },
            {
                id: 66,
                text: '三重'
            },
        ]
    },
    {
        id: 'chugoku',
        map: '/images/home/map-chugoku.webp',
        text: '中国',
        class: 'top-[63%] left-[10%] bg-[#d82e16]',
        city: [
            {
                id: 73,
                text: '鳥取'
            },
            {
                id: 74,
                text: '島根'
            },
            {
                id: 75,
                text: '岡山'
            },
            {
                id: 76,
                text: '広島'
            },
            {
                id: 77,
                text: '山口'
            },
        ]
    },
    {
        id: 'hokkaidou',
        map: '/images/home/map-hokkaidou.webp',
        text: '北海道',
        class: 'top-[10%] left-[60%] bg-[#4489ff]',
        city: [
            {
                id: 43,
                text: '北海道'
            },
        ]
    },
    {
        id: 'kantou',
        map: '/images/home/map-kantou.webp',
        text: '関東',
        class: 'top-[74%] right-[25%] bg-[#fccb00]',
        textColor: 'text-gray-500',
        city: [
            {
                id: 50,
                text: '茨城'
            },
            {
                id: 51,
                text: '栃木'
            },
            {
                id: 52,
                text: '群馬'
            },
            {
                id: 53,
                text: '埼玉'
            },
            {
                id: 54,
                text: '千葉'
            },
            {
                id: 55,
                text: '東京'
            },
            {
                id: 56,
                text: '神奈川'
            },
        ]
    },
    {
        id: 'kinki',
        map: '/images/home/map-kinki.webp',
        text: '近畿',
        class: 'top-[60%] left-[28%] bg-[#f29f19]',
        city: [
            {
                id: 67,
                text: '滋賀'
            },
            {
                id: 68,
                text: '京都'
            },
            {
                id: 69,
                text: '大阪'
            },
            {
                id: 70,
                text: '兵庫'
            },
            {
                id: 71,
                text: '奈良'
            },
            {
                id: 72,
                text: '和歌山'
            },
        ]
    },
    {
        id: 'kyushu',
        map: '/images/home/map-kyushu.webp',
        text: '九州・沖縄',
        class: 'bottom-0 left-[10%] bg-[#ab549c]',
        city: [
            {
                id: 82,
                text: '福岡'
            },
            {
                id: 83,
                text: '佐賀'
            },
            {
                id: 84,
                text: '長崎'
            },
            {
                id: 85,
                text: '熊本'
            },
            {
                id: 86,
                text: '大分'
            },
            {
                id: 87,
                text: '宮崎'
            },
            {
                id: 88,
                text: '鹿児島'
            },
            {
                id: 89,
                text: '沖縄'
            },
        ]
    },
    {
        id: 'shikoku',
        map: '/images/home/map-shikoku.webp',
        text: '四国',
        class: 'top-[77%] left-[25%] bg-[#e62080]',
        city: [
            {
                id: 78,
                text: '徳島'
            },
            {
                id: 79,
                text: '香川'
            },
            {
                id: 80,
                text: '愛媛'
            },
            {
                id: 81,
                text: '高知'
            },
        ]
    },
    {
        id: 'touhoku',
        map: '/images/home/map-touhoku.webp',
        text: '東北',
        class: 'top-[44%] right-[15%] bg-[#55c2e1]',
        city: [
            {
                id: 44,
                text: '青森'
            },
            {
                id: 45,
                text: '岩手'
            },
            {
                id: 46,
                text: '宮城'
            },
            {
                id: 47,
                text: '秋田'
            },
            {
                id: 48,
                text: '山形'
            },
            {
                id: 49,
                text: '福島'
            },
        ]
    },
]

export const JobTypes = [
    {
        id: 7,
        text: '店舗スタッフ・店長'
    },
    {
        id: 6,
        text: '鑑定士・査定士'
    },
    {
        id: 93,
        text: 'バイヤー'
    },
    {
        id: 105,
        text: '販売'
    },
    {
        id: 92,
        text: '出張買取、訪問買取'
    },
    {
        id: 94,
        text: 'EC運営・通販'
    },
    {
        id: 91,
        text: '買取・査定'
    },
    {
        id: 8,
        text: '法人営業'
    },
    {
        id: 9,
        text: '個人営業'
    },
    {
        id: 10,
        text: '物流・倉庫'
    },
    {
        id: 11,
        text: '管理・事務'
    },
    {
        id: 12,
        text: 'WEB・IT'
    },
    {
        id: 103,
        text: '本社部門'
    },
    {
        id: 13,
        text: 'その他'
    },
]

export const ItemTypes = [
    {
        id: 14,
        text: 'ブランド品'
    },
    {
        id: 15,
        text: 'アパレル'
    },
    {
        id: 16,
        text: 'バック・小物'
    },
    {
        id: 17,
        text: 'ジュエリー'
    },
    {
        id: 18,
        text: '時計'
    },
    {
        id: 19,
        text: 'ゲーム・ホビー'
    },
    {
        id: 20,
        text: '家具・家電'
    },
    {
        id: 21,
        text: 'PC・スマホ'
    },
    {
        id: 101,
        text: '工具'
    },
    {
        id: 102,
        text: 'ファッション'
    },
    {
        id: 22,
        text: 'その他'
    },
]

export const WorkConditions = [
    {
        id: 23,
        text: '私服OK'
    },
    {
        id: 24,
        text: '週休２日制'
    },
    {
        id: 25,
        text: 'リモートOK'
    },
    {
        id: 26,
        text: '土日休み'
    },
    {
        id: 27,
        text: '年末年始休暇あり'
    },
    {
        id: 104,
        text: '年間休日120日以上'
    },
    {
        id: 28,
        text: '福利厚生充実'
    },
    {
        id: 29,
        text: 'インセンティブ制度あり'
    },
    {
        id: 30,
        text: '年収400万円以上'
    },
    {
        id: 95,
        text: 'ミドル・ハイクラス'
    },
    {
        id: 96,
        text: '新卒・第２新卒'
    },
    {
        id: 98,
        text: '直接応募できる求人'
    },
]

export const EmploymentTypes = [
    {
        id: 31,
        text: '正社員'
    },
    {
        id: 32,
        text: '契約社員'
    },
    {
        id: 33,
        text: '業務委託'
    },
    {
        id: 34,
        text: 'パート・アルバイト'
    },
    {
        id: 90,
        text: '新卒'
    },
]

export const JobFilterOptions = [
    {
        key: 'jobTypes',
        icon: '/svgs/person.svg',
        title: '職種から探す',
        data: JobTypes
    },
    {
        key: 'items',
        icon: '/svgs/shopping.svg',
        title: 'アイテム',
        data: ItemTypes
    },
    {
        key: 'conditions',
        icon: '/svgs/bag.svg',
        title: '勤務条件',
        data: WorkConditions
    },
    {
        key: 'employmentTypes',
        icon: '/svgs/user-pin.svg',
        title: '雇用形態',
        data: EmploymentTypes
    },
]

export const QuickJobs = [
    {
        image: '/images/home/ads-1.webp',
        to: 'feature_id_1=98'
    },
    {
        image: '/images/home/ads-2.webp',
        to: 'feature_id_2=15'
    },
    {
        image: '/images/home/ads-3.webp',
        to: 'feature_id_2=17'
    },
    {
        image: '/images/home/ads-4.webp',
        to: 'feature_id_1=8'
    },
]

export const Posts = [
    {
        image: '/images/home/job-1.png',
        to: 'experience'
    },
    {
        image: '/images/home/job-2.png',
        to: 'inexperience=15'
    },
    {
        image: '/images/home/job-3.png',
        to: 'mid-high'
    },
    {
        image: '/images/home/job-4.png',
        to: '841dsceu?openQrModal=true'
    },
]

export const AboutPosts = [
    {
        id: 1,
        to: 'business',
        title: 'リユース業界について知る',
        subTitle: 'REUSE INDUSTRY',
        image: '/images/home/link-1.webp'
    },
    {
        id: 2,
        to: 'works',
        title: '仕事・スキルについて知る',
        subTitle: 'JOBS & SKILLS',
        image: '/images/home/link-2.webp'
    },
]

export const PrefectureOptions = [
    { value: '', option: '選択してください' },
    { value: '1', option: '北海道' },
    { value: '2', option: '青森県' },
    { value: '3', option: '岩手県' },
    { value: '4', option: '宮城県' },
    { value: '5', option: '秋田県' },
    { value: '6', option: '山形県' },
    { value: '7', option: '福島県' },
    { value: '8', option: '茨城県' },
    { value: '9', option: '栃木県' },
    { value: '10', option: '群馬県' },
    { value: '11', option: '埼玉県' },
    { value: '12', option: '千葉県' },
    { value: '13', option: '東京都' },
    { value: '14', option: '神奈川県' },
    { value: '15', option: '新潟県' },
    { value: '16', option: '富山県' },
    { value: '17', option: '石川県' },
    { value: '18', option: '福井県' },
    { value: '19', option: '山梨県' },
    { value: '20', option: '長野県' },
    { value: '21', option: '岐阜県' },
    { value: '22', option: '静岡県' },
    { value: '23', option: '愛知県' },
    { value: '24', option: '三重県' },
    { value: '25', option: '滋賀県' },
    { value: '26', option: '京都府' },
    { value: '27', option: '大阪府' },
    { value: '28', option: '兵庫県' },
    { value: '29', option: '奈良県' },
    { value: '30', option: '和歌山県' },
    { value: '31', option: '鳥取県' },
    { value: '32', option: '島根県' },
    { value: '33', option: '岡山県' },
    { value: '34', option: '広島県' },
    { value: '35', option: '山口県' },
    { value: '36', option: '徳島県' },
    { value: '37', option: '香川県' },
    { value: '38', option: '愛媛県' },
    { value: '39', option: '高知県' },
    { value: '40', option: '福岡県' },
    { value: '41', option: '佐賀県' },
    { value: '42', option: '長崎県' },
    { value: '43', option: '熊本県' },
    { value: '44', option: '大分県' },
    { value: '45', option: '宮崎県' },
    { value: '46', option: '鹿児島県' },
    { value: '47', option: '沖縄県' },
]

export const MonthOptions = Array.from({ length: 13 }, (_, i) => {
    if (i) {
        return {
            value: String(i),
            option: String(i)
        }
    } else {
        return {
            value: '0',
            option: '月'
        }
    }
})

export const GenderOptions = [
    {
        value: '1',
        option: '男'
    },
    {
        value: '2',
        option: '女'
    }
]

export const UserRoleOptions = [
    {
        value: 'admin',
        option: '管理者'
    },
    {
        value: 'employer',
        option: '企業'
    },
    {
        value: 'jobseeker',
        option: '求職者'
    },
]

export const RecruiterPainPoints: CircleTextItemData[] = [
    {
        imageUrl: "/images/recruiter/worry-1.png",
        text: "やる気のある\n未経験者がほしい",
        altText: "Pain point 1"
    },
    {
        imageUrl: "/images/recruiter/worry-2.png",
        text: "スキルを持った即戦力\n人材がほしい",
        altText: "Pain point 2"
    },
    {
        imageUrl: "/images/recruiter/worry-3.png",
        text: "定着・長期に活躍\nできる人材がほしい",
        altText: "Pain point 3"
    },
    {
        imageUrl: "/images/recruiter/worry-4.png",
        text: "人事の人員がタイト、\n業務負担が大きい",
        altText: "Pain point 4"
    }
];

export const RecruiterStatistics: StatisticItemData[] = [
    {
        image: "/images/recruiter/stats-1.png",
        altText: "stat1",
        text: "登録層は20～30代が8割"
    },
    {
        image: "/images/recruiter/stats-2.png",
        altText: "stat2",
        text: "男性・女性の比率 6:4"
    },
    {
        image: "/images/recruiter/stats-3.png",
        altText: "stat3",
        text: "経験者：未経験 5:5"
    },
    {
        image: "/images/recruiter/stats-4.png",
        altText: "stat4",
        text: "2019年のサービス開始後、\nアクセス数、登録者数\n4年連続で右肩上がり"
    }
];

export const aboutItems: AboutItemProps[] = [
    {
        image: "/images/recruiter/about-1.png",
        title: "採用ブランディング",
        text: "本格的な採用が初めての企業様も安心。動画コンテンツも交えて、求人の魅力を最大限引き出します。",
        altText: "採用ブランディング"
    },
    {
        image: "/images/recruiter/about-2.png",
        title: "継続しやすい料金設定と\n選べるプラン",
        text: "求人広告サービスと人材紹介サービスの併用可。採用コストと工数の削減をサポートします。",
        altText: "継続しやすい料金設定と選べるプラン"
    },
    {
        image: "/images/recruiter/about-3.png",
        title: "柔軟、迅速に対応",
        text: "登録までの手間が少なく、最短で即日掲載可能。求人票の作成は全て弊社で行います。",
        altText: "柔軟、迅速に対応"
    }
];

export const customerVoices: CustomerVoiceItemData[] = [
    { image: "/images/recruiter/voice-1.jpg", title: "総合リサイクルショップ", position: "人事責任者様", text: "リユース経験者は即戦力と考えています。リユース転職経由の中途採用で事業成長をはかることができています。", altText: "総合リサイクルショップ 人事責任者様" },
    { image: "/images/recruiter/voice-2.jpg", title: "買取専門店", position: "採用ご担当者様", text: "未経験者であっても、「これからリユース業界で活躍してみたい！」という熱意のある人材を紹介してくださるので積極的に利用しています。", altText: "買取専門店 採用ご担当者様" },
    { image: "/images/recruiter/voice-3.jpg", title: "出張買取サービス", position: "代表者様", text: "幹部候補となる人材を採用することができました。次は若手人材の採用をサポートしてもらっています。", altText: "出張買取サービス 代表者様" }
];

export const pricePlans: PricePlanData[] = [
    {
        title: "求人広告",
        subtitle: "※春の企業応援キャンペーン実施中",
        image: "",
        planTitle: "PLAN 01",
        details: [
            { label: "掲載期間", value: "６か月間" },
            {
                label: "求人掲載数",
                value: "案件数の上限なし",
                description: "（職種・勤務地・雇用形態問わず）"
            },
            {
                label: "料金",
                value: "40万円→0円（税別）",
                description: "※求人原稿の作成・入稿は企業様にご対応いただきます。\n作成、入稿代行を希望される場合は別途費用がかかります。",
                link: { text: "詳細はこちらから", href: "https://reuse-tenshoku.com/recycle-tsushin-25spring%5Fcampaign/" }
            }
        ],
        altText: "求人広告"
    },
    {
        title: "人材紹介",
        subtitle: "（エージェントサービス）",
        image: "",
        planTitle: "PLAN 02",
        details: [
            { label: "掲載期間", value: "無制限" },
            { label: "求人掲載数", value: "案件数の上限なし" },
            {
                label: "料金",
                value: "成果報酬型で初期費用０円",
                description: "紹介手数料率は想定年収の25～30%（職種により応相談）"
            }
        ],
        altText: "人材紹介"
    }
];

export const RecruiterFlowSteps: RecruiterFlowStep[] = [
    {
        image: "/images/recruiter/flow-1.jpg",
        step: "01",
        title: "企業のご登録",
        text: "お申込みフォームよりご登録ください。"
    },
    {
        image: "/images/recruiter/flow-2.jpg",
        step: "02",
        title: "オンライン・\n対面にてお打合せ",
        text: ""
    },
    {
        image: "/images/recruiter/flow-3.jpg",
        step: "03",
        title: "求人内容の作成",
        text: "求人作成は全て弊社にて行います。"
    },
    {
        image: "/images/recruiter/flow-4.jpg",
        step: "04",
        title: "求人公開・募集スタート",
        text: ""
    }
];

export const JobTypeOptions = [
    {
        value: '1',
        option: '直接応募のみ'
    },
    {
        value: '2',
        option: '転職⽀援サービス'
    },
    {
        value: '0',
        option: 'すべて'
    }
]

export const JobPageLimitOptions = [
    {
        value: '10',
        option: '10'
    },
    {
        value: '20',
        option: '20'
    },
    {
        value: '30',
        option: '30'
    },
    {
        value: '50',
        option: '50'
    },
    {
        value: '100',
        option: '100'
    }
]

export const OccupationOptions = [
    {
        value: '7',
        option: '店舗スタッフ・店長',
    },
    {
        value: '8',
        option: '法人営業',
    },
    {
        value: '10',
        option: '物流・倉庫',
    },
    {
        value: '11',
        option: '管理・事務',
    },
    {
        value: '12',
        option: 'WEB・IT',
    },
    {
        value: '91',
        option: '買取・査定',
    },
    {
        value: '92',
        option: '出張買取、訪問買取',
    },
    {
        value: '6',
        option: '鑑定士・査定士',
    },
    {
        value: '9',
        option: '個人営業',
    },
    {
        value: '93',
        option: 'バイヤー',
    },
    {
        value: '94',
        option: 'EC運営・通販',
    },
    {
        value: '103',
        option: '本社部門',
    },
    {
        value: '105',
        option: '販売',
    },
    {
        value: '13',
        option: 'その他',
    },
]

export const JobItemOptions = [
    {
        value: '14',
        option: 'ブランド品',
    },
    {
        value: '15',
        option: 'アパレル',
    },
    {
        value: '16',
        option: 'バック・小物',
    },
    {
        value: '17',
        option: 'ジュエリー',
    },
    {
        value: '18',
        option: '時計',
    },
    {
        value: '19',
        option: 'ゲーム・ホビー',
    },
    {
        value: '20',
        option: '家具・家電',
    },
    {
        value: '21',
        option: 'PC・スマホ',
    },
    {
        value: '101',
        option: '工具',
    },
    {
        value: '102',
        option: 'ファッション',
    },
    {
        value: '22',
        option: 'その他',
    },
]

export const JobConditionOptions = [
    {
        value: '23',
        option: '私服OK',
    },
    {
        value: '24',
        option: '週休2日制',
    },
    {
        value: '25',
        option: 'リモートOK',
    },
    {
        value: '26',
        option: '土日休み',
    },
    {
        value: '27',
        option: '年末年始休暇あり',
    },
    {
        value: '28',
        option: '福利厚生充実',
    },
    {
        value: '29',
        option: 'インセンティブ制度あり',
    },
    {
        value: '30',
        option: '年収400万円以上',
    },
    {
        value: '95',
        option: 'ミドル・ハイクラス',
    },
    {
        value: '96',
        option: '新卒、第2新卒',
    },
    {
        value: '98',
        option: '直接応募できる求人',
    },
    {
        value: '104',
        option: '年間休日120日以上',
    },
]

export const JobEmploymentTypes = [
    {
        value: '31',
        option: '正社員'
    },
    {
        value: '32',
        option: '契約社員'
    },
    {
        value: '33',
        option: '業務委託'
    },
    {
        value: '34',
        option: 'パート・アルバイト'
    },
    {
        value: '90',
        option: '新卒'
    },
]

export const RegionSearchOptions = [
    {
        value: '35',
        option: '北海道'
    },
    {
        value: '36',
        option: '東北'
    },
    {
        value: '37',
        option: '関東'
    },
    {
        value: '38',
        option: '中部'
    },
    {
        value: '39',
        option: '近畿'
    },
    {
        value: '40',
        option: '中国'
    },
    {
        value: '41',
        option: '四国'
    },
    {
        value: '42',
        option: '九州・沖縄'
    },
]

export const PrefectureSearchOptions = [
    {
        value: '43',
        option: '北海道',
        region: '35'
    },
    {
        value: '44',
        option: '青森県',
        region: '36'
    },
    {
        value: '45',
        option: '岩手県',
        region: '36'
    },
    {
        value: '46',
        option: '宮城県',
        region: '36'
    },
    {
        value: '47',
        option: '秋田県',
        region: '36'
    },
    {
        value: '48',
        option: '山形県',
        region: '36'
    },
    {
        value: '49',
        option: '福島県',
        region: '36'
    },
    {
        value: '50',
        option: '茨城県',
        region: '37'
    },
    {
        value: '51',
        option: '栃木県',
        region: '37'
    },
    {
        value: '52',
        option: '群馬県',
        region: '37'
    },
    {
        value: '53',
        option: '埼玉県',
        region: '37'
    },
    {
        value: '54',
        option: '千葉県',
        region: '37'
    },
    {
        value: '55',
        option: '東京都',
        region: '37'
    },
    {
        value: '56',
        option: '神奈川県',
        region: '37'
    },
    {
        value: '57',
        option: '新潟県',
        region: '38'
    },
    {
        value: '58',
        option: '富山県',
        region: '38'
    },
    {
        value: '59',
        option: '石川県',
        region: '38'
    },
    {
        value: '60',
        option: '福井県',
        region: '38'
    },
    {
        value: '61',
        option: '山梨県',
        region: '38'
    },
    {
        value: '62',
        option: '長野県',
        region: '38'
    },
    {
        value: '63',
        option: '岐阜県',
        region: '38'
    },
    {
        value: '64',
        option: '静岡県',
        region: '38'
    },
    {
        value: '65',
        option: '愛知県',
        region: '38'
    },
    {
        value: '66',
        option: '三重県',
        region: '38'
    },
    {
        value: '67',
        option: '滋賀県',
        region: '39'
    },
    {
        value: '68',
        option: '京都府',
        region: '39'
    },
    {
        value: '69',
        option: '大阪府',
        region: '39'
    },
    {
        value: '70',
        option: '兵庫県',
        region: '39'
    },
    {
        value: '71',
        option: '奈良県',
        region: '39'
    },
    {
        value: '72',
        option: '和歌山県',
        region: '39'
    },
    {
        value: '73',
        option: '鳥取県',
        region: '40'
    },
    {
        value: '74',
        option: '島根県',
        region: '40'
    },
    {
        value: '75',
        option: '岡山県',
        region: '40'
    },
    {
        value: '76',
        option: '広島県',
        region: '40'
    },
    {
        value: '77',
        option: '山口県',
        region: '40'
    },
    {
        value: '78',
        option: '徳島県',
        region: '41'
    },
    {
        value: '79',
        option: '香川県',
        region: '41'
    },
    {
        value: '80',
        option: '愛媛県',
        region: '41'
    },
    {
        value: '81',
        option: '高知県',
        region: '41'
    },
    {
        value: '82',
        option: '福岡県',
        region: '42'
    },
    {
        value: '83',
        option: '佐賀県',
        region: '42'
    },
    {
        value: '84',
        option: '長崎県',
        region: '42'
    },
    {
        value: '85',
        option: '熊本県',
        region: '42'
    },
    {
        value: '86',
        option: '大分県',
        region: '42'
    },
    {
        value: '87',
        option: '宮崎県',
        region: '42'
    },
    {
        value: '88',
        option: '鹿児島県',
        region: '42'
    },
    {
        value: '89',
        option: '沖縄県',
        region: '42'
    },
]

export const WhereToApplyOptions = [
    {
        value: '1',
        option: '当システムを利用する'
    },
    {
        value: '2',
        option: '転職サポートサイトを利用する'
    },
]

export const JobStatusOptions = [
    {
        value: '1',
        option: '公開'
    },
    {
        value: '2',
        option: '非公開（下書き）'
    },
]

export const FGA_QUALIFICATION_DATA: SikakuItemProps[] = [
    {
        number: '01',
        title: 'ユース検定',
        subtitle: 'Reuse Test',
        image: '/images/qualifications/1.jpg',
        description: '学べる内容：リユース品の買取・販売を行う「リユースショップ」を営業していくうえで必要な基礎知識を学びます。「古物営業法」を中心に「個人情報保護法」「製造物責任法」「資源有効利用促進法」などの関連法規の基本知識や留意すべき事項などを実務の流れに沿って学んでいきます。',
        order_title: 'リユースハンドブック（リユース検定公式テキスト）目次より抜粋',
        order_content: '1. リユース業の意義\n2. リユースショップを営むための基本事項\n3. リユースショップ営業の実務\n4. 取引の信頼性を高める営業、コンプライアンス（法令遵守）営業\n5. 特定の商品を取り扱う場合の注意\n6. 資料',
        order_desc: '上記の内容から試験が出題され、試験に合格した方が資格を取得できます。（選択式50問、制限時間は60分。1問2点、100点満点。90点以上をもって合格。2月、5月、8月、11月の各１ヶ月の間の特定日に全国の試験会場で実施しています。）',
        table: [
            { label: '運営', value: '一般社団法人日本リユース業協会' },
            { label: '料金', value: '5,000円＋消費税' },
            { label: '取得までの期間', value: '―' },
            { label: 'URL', value: 'https://www.re-use.jp/' },
        ],
        recommend: [
            'リユースショップで接客・販売のお仕事をされている方',
            'ブランド品等の買取、鑑定に関するお仕事をしている方',
            '出張買取、訪問買取で営業のお仕事をされている方',
            'リユース関連企業で働いている方（管理部門、営業部門など）',
        ],
    },
    {
        number: '02',
        title: 'AACD協会基準判定士',
        subtitle: 'AACD ASSOCIATION STANDARDS JUDGE',
        image: '/images/qualifications/2.jpg',
        description: '学べる内容：一般社団法人日本流通自主管理協会(AACD)の会員企業になるという前提がありますが、AACDの開催する講習で、真贋だけでなく、ブランド品を取り扱う（仕入れ、買取り、販売）際に必要な基本的な知識を総合的に学び、試験でその実力をはかります。そして試験に合格した方が資格を取得できます。',
        order_title: 'AACDのHPより抜粋',
        order_content: '1. ソフト研修では、テキストに沿って並行輸入の基礎知識、関連法令、カスタマー対応などを学びます。\n2. ハード研修では、ルイ・ヴィトン、シャネル、エルメス、グッチ、プラダ、コーチの６ブランドに加え、ジュエリー、時計の２カテゴリーの判別について「判別プロジェクター研修」と「実技研修」に分けて学びます。①判別プロジェクター研修では各ブランド、各カテゴリーの商品をどうやって判別するか講習を受けます。そのあと②実地研修では、実際に現物を手に取り、基準内・外商品を比較し、講習で学んだポイントを実際に確認します。',
        order_desc: '認定試験（選択問題＋レポート）は、毎年1回実施し、合格率は30～40％程度です。「協会基準判定士」は、資格認定された後も定期的に実施されるセミナーや研修に参加して、常に新しい情報を更新することが求められ、５年ごとに更新手続きが必要となります。',
        table: [
            { label: '運営', value: '日本流通自主管理協会(AACD)' },
            { label: '料金', value: '毎年各社1名無料、2人目から1名22,000円（税込み）' },
            { label: '取得までの期間', value: '―' },
            { label: 'URL', value: 'https://www.aacd.gr.jp/' },
        ],
        recommend: [
            '日本流通自主管理協会の会員企業に属している方\n　　（会員企業とは、ブランド品買取店や質屋などの「小売企業」、\n　　ブランド物のバッグやアクセサリーなどの専門知識を持つ「卸売企業」、\n　　同協会の目的や趣に賛同し力添えをする「賛助企業」が挙げられます。）\n',
            'ブランド品の買取、真贋・鑑定に関するお仕事をしている方',
        ],
    },
    {
        number: '03',
        title: '遺品整理士',
        subtitle: 'ESTATE AGENT',
        image: '/images/qualifications/3.jpg',
        description: '学べる内容：養成講座の教本内容から抜粋',
        order_content: '【第１部】遺品整理・遺品整理業とは\n　　第１章　遺品整理とは何か\n　　第２章　専門家が今、必要とされる理由とは\n　　第３章　取り巻いている、様々な社会問題\n【第２部】遺品整理を行うためには\n　　第１章　実務を行っていく上で必要なこととは\n　　第２章　行われている”実際の業務”とは\n　　第３章　作業を行う上での留意点\n　　第４章　法規制との関わりについて\n【第３部】事例研究について\n　　第１章　事例研究について',
        table: [
            { label: '運営', value: '一般社団法人　遺品整理士認定協会' },
            { label: '料金', value: '入会金25,000円、会費(認定手続き含む) 7,000円（2年間有効）' },
            { label: '取得までの期間', value: '約４～５か月' },
            { label: 'URL', value: 'https://www.is-mind.org/about.html' },
        ],
        recommend: [
            'お客様から遺品整理、生前整理のご相談をいただく方',
            'リユースショップや訪問買取で接客・営業のお仕事をされている方',
            'お仕事でシニア層や高齢のお客様とお話をすることが多い方',
            'これからリユース業界を目指されている方',
        ],
        notes: '※英国宝石学協会が認定する宝石学資格が「FGA」について、日本宝飾クラフト学院　宝石学　講師の鈴木敏文さんにご監修いただきました。詳しくはこちらをご覧ください。',
    },
    {
        number: '04',
        title: 'FGA',
        subtitle: 'FELLOW OF THE GEMMOLOGICAL ASSOCIATION OF GREAT BRITAIN',
        image: '/images/qualifications/4.jpg',
        description: '学べる内容：宝石に関するあらゆること（宝石のこと、つくりのこと、デザインのこと、歴史のこと、宝石の鑑別について）を総合的に学びます。GemA宝石学コース（ファンデーションコース（基礎課程）→ディプロマコース（上級課程））を受講し、それぞれの試験に合格した方が資格を取得できます。',
        table: [
            { label: '運営', value: '英国宝石学協会（The Gemmological Association of Great Britain/Gem-A）' },
            { label: '料金', value: '約170万円' },
            { label: '取得までの期間', value: '約年' },
            { label: 'URL', value: 'https://www.jj-craft.com/gem-a/' },
        ],
        recommend: [
            '宝飾・ジュエリー・貴金属関連の分野で仕事をされている方',
            '宝石の鑑定、鑑別、一般知識を求められている方',
            'ジュエリーのバイヤーや鑑定士を目指している方',
        ],
        notes: '※英国宝石学協会が認定する宝石学資格が「FGA」について、日本宝飾クラフト学院　宝石学　講師の鈴木敏文さんにご監修いただきました。詳しくはこちらをご覧ください。',
    },
    
    
];

export const SIKAKU_ORDER_ITEMS: SikakuOrderItemProps[] = [
    {
        number: '01.',
        title: '一般社団法人日本リユース業協会が主催する「リユース検定」',
        link: '/qualifications#test01',
    },
    {
        number: '02.',
        title: '一般社団法人日本流通自主管理協会(AACD)が認定する「協会基準判定士」',
        link: '/qualifications#test02',
    },
    {
        number: '03.',
        title: '般社団法人遺品整理士認定協会が認定する「遺品整理士」',
        link: '/qualifications#test03',
    },
    {
        number: '04.',
        title: '英国宝石学協会が認定する「宝石学資格のFGA」',
        link: '/qualifications#test04',
    },
    // Add more items as needed
];

export const EXPERIENCE_SUPPORT_ITEMS = [
    '無料のキャリア相談で強みや方向性を明確化',
    '業界の最新動向や、求人企業の詳細情報を提供',
    '履歴書・職務経歴書の添削、書き方のアドバイス',
    '面接準備としての事前打合せや、模擬面接の実施',
    '内定時のオファー（労働）条件の確認・交渉',
    '入社後の定着までのフォローアップ',
];

export const EXPERIENCE_NAYAMI_ITEMS = [
    '給与が上がらない',
    '適切な評価がされない',
    'キャリアアップが見込めない',
    'ちゃんとしたスキル（専門性）を身に着けたい',
    'このままここにいてもいいのか、漠然と不安',
    '自分に合う環境で働きたいがどんな会社があるかわからない',
];

export const INEXPERIENCE_NAYAMI_ITEMS = [
    'キャリアアップが見込めない',
    'このままここにいてもいいのか、漠然と不安',
    '好きなことを仕事にしたい',
    '本当に未経験から挑戦できるのか不安',
    'どんな会社や仕事があるのかわからない',
    'すでに応募済だが他にも自分に合う企業があれば知りたい',
];

export const EXPERIENCE_REASON_ITEMS = [
  'リユース業界の経験者（元人事・店長）が親身にサポートしている',
  '経験者を求めている企業情報を持つため、キャリアアップできる案件が豊富',
  '大手（上場）から成長ベンチャー、地元密着企業まで多様な企業と接点あり',
  '他社エージェントにない、独自保有の求人に出会える',
  'ニッチ求人やハイクラス求人など、専門性の高いマッチングが可能',
];

export const EXPERIENCE_SUCCESS_CASES = [
  {
    caseNo: 'CASE 01',
    caseTitle: '専門性を高める',
    caseSubtitle: '総合リユースからブランドリユース企業へ',
    tag: '30代男性',
    image: '/images/experience/man1.png',
    description: '8年間務めてきた中で、時計の専門性を高めたいという気持ちが強くなっていきました。腕時計商材に強みを持つブランド買取ショップに転職。日々時計を見て勉強中です。',
  },
  {
    caseNo: 'CASE 02',
    caseTitle: 'キャリアを上げる',
    caseSubtitle: '地元リサイクルショップから上場総合リユースへ',
    tag: '20代男性',
    image: '/images/experience/man2.png',
    description: '結婚し、ライフステージが変わったことで、もっとキャリアアップができる環境に移りたいと考えるように。男性でも育休が取得できるという環境にも魅力に感じています。',
  },
  {
    caseNo: 'CASE 03',
    caseTitle: 'キャリアチェンジする',
    caseSubtitle: '買取スタッフからリユース業界の法人営業職へ',
    tag: '30代女性',
    image: '/images/experience/man3.png',
    description: 'コミュニケーション力を活かしつつ、もう少し違うキャリアを築きたいと考えていました。シフト制から土日休みが取れ、長期的にも働きやすい環境になりました。',
  },
];

export const INEXPERIENCE_SUCCESS_CASES = [
    {
      caseNo: 'CASE 01',
      caseTitle: '好きを仕事にする',
      caseSubtitle: '美容師からアパレルリユース企業へ',
      tag: '20代女性',
      image: '/images/inexperience/man1.png',
      description: '手荒れが原因で転職し、ずっと好きだった古着を扱える仕事に就きました。日々様々な洋服に触れることができ刺激的です。土日休みで残業もほとんどないので、働きやすい環境です。',
    },
    {
      caseNo: 'CASE 02',
      caseTitle: '成長産業にキャリアチェンジする',
      caseSubtitle: '大手小売業から上場総合リユースへ',
      tag: '30代男性',
      image: '/images/inexperience/man2.png',
      description: '10年間勤めてきた中で、もっとワクワクできる仕事がしたいと考えるように。リユースの可能性はずっと感じていたので、家族からも応援してもらい、思い切って転職しました。',
    },
    {
      caseNo: 'CASE 03',
      caseTitle: '未経験だが強みを生かす',
      caseSubtitle: 'コールセンターSVからバイヤーへ',
      tag: '30代女性',
      image: '/images/inexperience/man3.png',
      description: '同じように数字を追いかける仕事でもあり、これまでの目標達成志向がまさかバイヤーでも活かせるとは驚きました。質の良いブランド品をたくさんのお客様に届けたいです。',
    },
  ];
  
export const MID_HIGH_POINTS = [
  {
    number: 1,
    label: 'POINT',
    imageUrl: '/images/mid-high/point01.png',
    title: '精度高いマッチング',
    description: '業界特化型で企業の内部を良く知る弊社コンサルタントが一人ひとりにきめ細かく、柔軟に対応するので、精度高いマッチングが可能。',
  },
  {
    number: 2,
    label: 'POINT',
    imageUrl: '/images/mid-high/point02.png',
    title: '希少性の高い非公開案件',
    description: 'ミドル・ハイクラスのポジションは、求人媒体等に掲載されてない非公開案件が多く、希少性の高い案件が集まっています。',
  },
  {
    number: 3,
    label: 'POINT',
    imageUrl: '/images/mid-high/point03.png',
    title: '未来の可能性をアドバイス',
    description: '自分ではミドル・ハイクラスはまだ先と思っている方も、キャリアコンサルタントがあなたの歩まれてきたキャリアを分析して、未来の可能性をアドバイス。',
  },
  // Add more points as needed
];

export const MID_HIGH_SWIPER_CARDS = [
  {
    category: '営業',
    title: '店舗統括（部長候補）',
    salaryMin: 800,
    salaryMax: 1100,
    salaryUnit: '万円',
    descriptionTitle: '業務内容',
    description: '店舗（買取・販売）の統括マネジメント\n数値管理、店長陣のマネジメント\n販促施策、KPI推進',
  },
  {
    category: '管理',
    title: 'WEBマーケティングマネージャー',
    salaryMin: 700,
    salaryMax: 900,
    salaryUnit: '万円',
    descriptionTitle: '業務内容',
    description: 'リスティング、動画、\nSNSなどの各種手法の運用\n外部パートナー（広告代理店等）のディレクション',
  },
  {
    category: '専門',
    title: '鑑定士（ブランド品・バッグ／時計）',
    salaryMin: 750,
    salaryMax: 1000,
    salaryUnit: '万円',
    descriptionTitle: '業務内容',
    description: 'ブランド品の真贋、査定\n各販売チャネルへの仕分け\n偽物を報告レポート',
  },
  {
    category: '営業',
    title: '店舗開発責任者',
    salaryMin: 700,
    salaryMax: 850,
    salaryUnit: '万円',
    descriptionTitle: '業務内容',
    description: '全社出店戦略に基づく新規物件開発\n店舗設計管理・内装デザイン／工程管理',
  },
  {
    category: '管理',
    title: '経理財務／部署責任者候補',
    salaryMin: 600,
    salaryMax: 750,
    salaryUnit: '万円',
    descriptionTitle: '業務内容',
    description: '部署の体制強化\n取引形態の変更に伴う会計処理の安定化\n海外事業展開における会計処理のスキーム構築',
  },
  {
    category: '専門',
    title: '訪問買取営業',
    salaryMin: 500,
    salaryMax: 1000,
    salaryUnit: '万円',
    descriptionTitle: '業務内容',
    description: '個人客を訪問し、査定・買取\n取扱アイテムは貴金属、ブランド品が中心',
  },
];

export const MID_HIGH_CASES = [
  {
    id: 1,
    caseNo: 'CASE 01',
    ageGender: '40代男性の場合',
    avatar: '/images/mid-high/case01.png',
    caseImage: '/images/mid-high/case01.png',
    reasonImage: '/images/mid-high/because.png',
    reason: 'キャリアを活かし、新しい挑戦をしたい。\n中長期で取り組めるテーマに従事したい。',
    beforeTitle: '転職前',
    beforeDesc: '海外事業',
    beforeSalary: '900',
    afterTitle: '転職後',
    afterDesc: '新規事業\n責任者候補',
    afterSalary: '1000',
  },
  {
    id: 2,
    caseNo: 'CASE 02',
    ageGender: '30代女性の場合',
    avatar: '/images/mid-high/case02.png',
    caseImage: '/images/mid-high/case02.png',
    reasonImage: '/images/mid-high/because.png',
    reason: '地方へ移住することに。\nスキルを活かせる地方のリユース企業を探したい。',
    beforeTitle: '転職前',  
    beforeDesc: '東京　リユース企業\nWEBマーケ責任者',
    beforeSalary: '650',
    afterTitle: '転職後',
    afterDesc: '地方　リユース企業\nWEBマーケ責任者',
    afterSalary: '650',
  },
  {
    id: 2,
    caseNo: 'CASE 03',
    ageGender: '30代男性の場合',
    avatar: '/images/mid-high/case02.png',
    caseImage: '/images/mid-high/case02.png',
    reasonImage: '/images/mid-high/because.png',
    reason: '子供が生まれ、循環型ビジネスへ関心を持つ。\n今後、キャリアアップが見込める環境で働きたい。',
    beforeTitle: '転職前',
    beforeDesc: '大手小売店長',
    beforeSalary: '600',
    afterTitle: '転職後',
    afterDesc: '大手リユース店長',
    afterSalary: '650',
  },
  // Add more cases as needed
];
  