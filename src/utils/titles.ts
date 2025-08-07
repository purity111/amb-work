export const PAGE_TITLES = {
  // Main pages
  home: {
    title: 'AMB - 転職支援サービス | あなたの次のキャリアチャンスを見つけましょう',
    description: 'AMB転職支援サービス - あなたの次のキャリアチャンスを見つけましょう。豊富な求人情報とキャリアコンサルティングで、理想の転職をサポートします。',
    keywords: '転職, 求人, キャリア, 就職, 仕事, 転職支援, キャリアコンサルティング, 求人情報'
  },
  
  // About pages
  about: {
    title: '会社概要 | AMB - 転職支援サービス',
    description: 'AMBの会社概要をご紹介します。転職支援サービスの理念、実績、そして私たちが提供する価値について詳しく説明します。',
    keywords: '会社概要, AMB, 転職支援, 企業情報, 理念'
  },
  
  // Job related pages
  jobs: {
    title: '求人情報 | AMB - 転職支援サービス',
    description: '豊富な求人情報をお探しください。業界、職種、地域別に検索できる求人情報で、理想の転職先を見つけましょう。',
    keywords: '求人情報, 転職, 求人検索, 職種, 業界'
  },
  jobOpenings: {
    title: '求人一覧 | AMB - 転職支援サービス',
    description: '最新の求人情報一覧です。条件に合わせて求人を検索し、理想の転職先を見つけましょう。',
    keywords: '求人一覧, 求人検索, 転職, 職種別求人'
  },
  
  // MyPage sections
  mypage: {
    title: 'マイページ | AMB - 転職支援サービス',
    description: 'AMBのマイページです。応募履歴、お気に入り求人、プロフィール管理など、転職活動を効率的に進められます。',
    keywords: 'マイページ, 応募履歴, お気に入り, プロフィール'
  },
  mypageProfile: {
    title: 'プロフィール編集 | AMB - 転職支援サービス',
    description: 'プロフィール情報を編集できます。詳細な職歴やスキルを登録して、より良い求人とのマッチングを実現しましょう。',
    keywords: 'プロフィール編集, 職歴, スキル, 自己PR'
  },
  mypageApplications: {
    title: '応募管理 | AMB - 転職支援サービス',
    description: '応募履歴を管理できます。応募状況の確認や進捗管理で、転職活動を効率的に進めましょう。',
    keywords: '応募管理, 応募履歴, 進捗管理, 転職活動'
  },
  mypageFavorites: {
    title: 'お気に入り求人 | AMB - 転職支援サービス',
    description: 'お気に入りに登録した求人情報を確認できます。気になる求人を保存して、じっくり検討しましょう。',
    keywords: 'お気に入り求人, 保存求人, 気になる求人'
  },
  
  // Business pages
  business: {
    title: 'ビジネスサービス | AMB - 転職支援サービス',
    description: '企業向けの転職支援サービスをご紹介します。採用支援、人材紹介、キャリアコンサルティングなど、企業の成長をサポートします。',
    keywords: '企業向け, 採用支援, 人材紹介, キャリアコンサルティング'
  },
  
  // Career counseling
  careerCounseling: {
    title: 'キャリアコンサルティング | AMB - 転職支援サービス',
    description: '専門のキャリアコンサルタントがあなたの転職をサポートします。個別相談で理想のキャリアプランを一緒に考えましょう。',
    keywords: 'キャリアコンサルティング, 転職相談, キャリアプラン, 個別相談'
  },
  
  // Contact pages
  contact: {
    title: 'お問い合わせ | AMB - 転職支援サービス',
    description: 'AMBへのお問い合わせはこちらから。転職に関するご相談やサービスについてのご質問を承ります。',
    keywords: 'お問い合わせ, 転職相談, サービス問い合わせ'
  },
  
  // Legal pages
  privacy: {
    title: 'プライバシーポリシー | AMB - 転職支援サービス',
    description: 'AMBのプライバシーポリシーです。個人情報の取り扱いについて詳しく説明しています。',
    keywords: 'プライバシーポリシー, 個人情報, データ保護'
  },
  terms: {
    title: '利用規約 | AMB - 転職支援サービス',
    description: 'AMBの利用規約です。サービスの利用条件について詳しく説明しています。',
    keywords: '利用規約, 利用条件, サービス規約'
  }
};

export const getPageTitle = (page: keyof typeof PAGE_TITLES) => {
  return PAGE_TITLES[page] || PAGE_TITLES.home;
};
