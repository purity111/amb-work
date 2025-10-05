import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import LinkButton from "@/components/LinkButton";
import CategoryItem from "@/components/pages/business-new/BusinessNewCategoryItem";
import GlobalizationSection from "@/components/pages/business-new/GlobalizationSection";
import { GLOBALIZATION_SECTION_DATA } from '@/utils/constants';
import Image from "next/image";
import Link from "next/link";
import PageTitle from '@/components/PageTitle';
import { getPageTitle } from '@/utils/titles';

export default function BusinessNewPage() {
    const pageInfo = getPageTitle('businessNew');

    return (
        <>
            <PageTitle
                title={pageInfo.title}
                description={pageInfo.description}
                keywords={pageInfo.keywords}
            />
            <main>
                <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
                {/* Text Content (Left Side - Dark Grey Background) */}
                <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
                    <div className="md:text-left md:mr-8 xl:mr-20">
                        <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                        <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-semibold text-black mb-2">最新動向、採用状況</h1>
                        <p className="text-[14px] md:text-[18px] text-gray-300 font-semibold">LATEST TRENDS, EMPLOYMENT STATUS</p>
                    </div>
                </div>
                <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
                    <Image
                        src="/images/business-new/top.jpg"
                        alt="資格バナー"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>

                <Breadcrumb />

                <section className="max-w-[960px] mx-auto px-4 lg:px-0 py-12">
                    <div className="pb-[30px] md:pb-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            2024年最新のリユース・リサイクル・買取業界の<br />動向と採用状況について
                        </h2>
                        <p className='text-center text-[14px] text-gray-600 font-sans'>AREAS OF EXPERTISE</p>
                    </div>
                    <div className="w-full">
                        <Image
                            src="/images/business-new/about.jpg"
                            alt="About Business"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full h-auto"
                            priority
                        />
                    </div>
                    <p className="text-sm md:text-base my-10 leading-[1.8] font-medium">
                        コロナ禍からの回復、円安、物価上昇など様々な出来事が市場や相場に影響を与えています。そのような中で、2024年のリユース・リサイクル・買取業界の市場はどうなっているのでしょうか。また採用状況はどうなっているのでしょうか。最新の情報をお伝えします。
                    </p>
                </section>

                <section className="bg-[#f3f3f3] rounded-tr-[100px] md:rounded-tr-[200px]">
                    <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-[50px] md:py-[100px]">
                        <div className="pb-[30px] md:pb-[60px] text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                                リユース業界の最新動向について
                            </h2>
                            <p className='text-center text-[14px] text-gray-600 font-sans'>LATEST TRENDS</p>
                        </div>
                        <p className="text-sm md:text-base mt-10 md:my-10 leading-[1.8] font-medium">
                            最新のリユース市場規模は、前年比7.4%増の2.9兆円です（リサイクル通信の統計による）。2009年以降、13年連続で拡大しており、日本でも有数の成長マーケットといえるでしょう。そのため各社、企業業績が好調で、採用も積極的です。2023年には3兆2500億円、2030年には4兆円規模に拡大すると予測がされているため、業界で働くにはベストタイミングです。<br /><br />
                            <span className="text-[#ff8a34]">■</span>買取<br />
                            コロナ禍ではリモートワークなど、在宅時間の増加から、家の片付け、物の整理をする人が増加。それに伴ってフリマアプリを中心に買取需要が伸びました。<br /><br />
                            その後、人出が増え、店舗買取が回復。国内のリユースショップ・買取店舗は、ドラッグストアに次ぐ18,000店舗へ増加。広い世代で個人の「物を売る」という行動が定着しつつあります。<br /><br />
                            買取経路として店舗はもちろん、催事買取、訪問買取、宅配買取などのチャネルが多様化していることも買取が増加している要因になっています。<br /><br />
                            <span className="text-[#ff8a34]">■</span>販売<br />
                            物価高の影響からお得感のある中古品の購入が注目されています。<br /><br />
                            コロナ禍は、リモートワークに伴って仕事環境を整えるためのPCや家具、家族で楽しめるゲームやアウトドア、スポーツ・レジャー用品など、特定の分野で需要が増えました。これらの動きをチャンスと捉えてこれらの商材のリユース専門店を出店する企業もありました。<br /><br />
                            その後は、外出機会が増え、衣服・アパレル商材の需要が高まりました。古着ブームなども追い風となり、リユースマーケットの中で一番大きな市場規模となっています。<br /><br />
                            販売経路としては、EC販売を強化する流れが強まっています。その結果、ネット販売のBtoCは8.5％増と前年を上回りました（リサイクル通信の統計による）。<br /><br />
                        </p>
                        <div className="flex flex-col md:flex-row justify-between gap-[4%] items-start">
                            <p className="text-sm md:text-base leading-[1.8] font-medium w-full md:w-[55%] pb-10 md:pb-0">
                                2022年からの円安傾向はリユースマーケットに追い風となり、越境EC中心に日本のリユース品の海外需要が伸びています。<br />
                                リアルでも外国人観光客の受け入れが始まったことでインバウンド消費が回復しています。
                            </p>
                            <div className="w-full md:w-[41%]">
                                <Image
                                    src="/images/business-new/trend.png"
                                    alt="Trends"
                                    width={420}
                                    height={260}
                                    className="rounded-tl-[50px] object-cover w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-[50px] md:py-[100px] max-w-[1200px] mx-auto px-4 lg:px-0">
                    <div className="pb-[30px] md:pb-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            リユース転職的、注目業態
                        </h2>
                        <p className='text-center text-[14px] text-gray-600 font-sans'>FEATURED BUSINESS CATEGORY</p>
                    </div>
                    <p className="text-sm md:text-base leading-[1.8] font-medium">
                        リユース・リサイクル・買取業界の中でも様々な業態が存在します。2024年の注目業態を紹介します。
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-[2%]">
                        <CategoryItem order='01' title="総合リサイクルショップ" text='取り扱い商材の幅が広いこと、商品数が多いことから集客力がある。買取からリユース品（中古品）の販売まで店舗内で行う。地域特性を活かした店づくりをし、固定客が多い。' />
                        <CategoryItem order='02' title="買取専門店" text='出店ハードルが比較的低いため全国に店舗数を広げることが可能。中・小規模で路面店やショッピングセンター内に存在。直営店だけでなく、FC（フランチャイズ）展開も多い。' />
                        <CategoryItem order='03' title="EC、ネット型ショップ" text='国ヤフオク、楽天、メルカリ等のマーケットプレイスだけでなく、自社ECでのネット販売で顧客を持っている企業は今後競争が激化する中で優位となる。買取でネット集客が強い企業も◎。' />
                    </div>
                    <div className="text-center">
                        <h5 className="text-[20px] md:text-[28px] font-semibold my-10 hyphen"><span className="text-[#65b729]">プ</span>ラスαの付加価値提供</h5>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-[2%]">
                        <CategoryItem order='01' title="オークション運営" text='市場の拡大と並行して取扱量が増加。コロナ禍以降、ネットオークションが台頭している。販路の多様化、在庫の回転数などで強みがある。' />
                        <CategoryItem order='02' title="異業界との提携" text='潜在需要の大きいマーケットの中で、葬儀業者、金融機関、引っ越し業者、遺品整理業者など、他業界と提携している企業は、新しい顧客層を広げているという点で強みがある。' />
                    </div>
                </section>
                <section className="max-w-[960px] mx-auto px-4 lg:px-0 py-12">
                    <div className="pb-[30px] md:pb-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            今後の成長のポイント
                        </h2>
                        <p className='text-center text-[14px] text-gray-600 font-sans'>KEY POINTS FOR FUTURE GROWTH</p>
                    </div>
                    <div className="w-full">
                        <Image
                            src="/images/business-new/point1.jpg"
                            alt="About Business"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full h-auto"
                            priority
                        />
                    </div>
                    <p className="text-sm md:text-base my-10 leading-[1.8] font-medium">
                        リユース転職では、リユース・リサイクル・買取業界の今後のさらなる成長のポイントとしてグローバル化とテクノロジー化の２つがあると考えています。
                    </p>

                    <div className="flex flex-col md:flex-row gap-[3%] max-w-[960px] mx-auto">
                        {GLOBALIZATION_SECTION_DATA.map((sectionData, index) => (
                            <GlobalizationSection key={index} {...sectionData} />
                        ))}
                    </div>
                </section>
                <section className="bg-[#f3f3f3] rounded-tl-[100px] md:rounded-tl-[200px]">
                    <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-[50px] md:py-[100px]">
                        <div className="pb-[30px] md:pb-[60px] text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                                新しい商材需要、一次流通企業の参入
                            </h2>
                            <p className='text-center text-[14px] text-gray-600 font-sans'>AFTER CORONA, NEW DEMAND TOO.</p>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start gap-[4%]">
                            <div className="w-full md:w-[46%] mb-5 md:mb-0">
                                <Image
                                    src="/images/business-new/corona.jpg"
                                    alt="About Business"
                                    width={420}
                                    height={630}
                                    className="rounded-lg object-cover w-full h-auto"
                                    priority
                                />
                            </div>
                            <p className="text-sm md:text-base leading-[1.8] font-medium w-full md:w-[55%]">
                                リユース・リサイクル・買取業界は、コロナ禍は巣籠り需要の恩恵を受けて、中古品のゲームや家具・家電の販売を伸ばしました。また、トレカやキャンプグッズなどは新しいリユースアイテムとして専門店もできるなど人気となりました。都心部では移転等の影響でオフィス家具や飲食店の厨房機器といった法人の買取・販売ニーズが高まりました。<br /><br /><br />
                                その後、引き続き熱気を見せているのがトレカ（トレーディングカード）です。ポケモンカード中心に海外からも人気で、市場規模は2000億円を超えています。<br /><br /><br />
                                新しい注目商材はスマホ（スマートフォン）です。前年比17%増に拡大しています。<br /><br /><br />
                                レトロブームによって古着のほか、レコード、カメラ、楽器といった商材がリユース品としても注目されています。<br /><br />
                                こうした動きの中で、ユニクロや無印良品、カメラのキタムラなど、新品を取り扱う大手企業が、買取やリユース品の販売をはじめています。※新品を扱う企業は「一次流通企業」と呼びます。<br />
                                こうした動きは今後さらに加速するでしょう。<br /><br />
                                もっと詳しく↓<br />
                                <Link
                                    href="/column/column-30/"
                                    className="text-sm text-[#65B729] underline transition-colors"
                                >
                                    リユース業界の成長を引っ張る4つのアイテム！この商品が好きな人は活躍のチャンス！？
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-[960px] mx-auto px-4 lg:px-0 py-[50px] md:py-[100px]">
                    <div className="pb-[30px] md:pb-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            各社、新規の販路開拓に取り組む
                        </h2>
                        <p className='text-center text-[14px] text-gray-600 font-sans'>WORK TO DEVELOP NEW SALES CHANNELS</p>
                    </div>
                    <p className="text-sm md:text-base leading-[1.8] font-medium">
                        コロナの影響を受けて、デジタルシフト、オンライン化が進みました。ECの強化及び、出張買取や宅配買取、LINE査定などに各社力を入れています。今まで店頭での買取をメインとしていた企業にとっては、新規の顧客との接点にもなっています。<br /><br />
                        現在はインバウンド客が増えて需要は回復してきていますが、コロナ禍でインバウンド需要が激減した中、新しい潮流としてスマートフォンの専用アプリで生配信しながら売り買いをする、「ライブコマース」が拡大しています。<br /><br />
                        アジア圏を中心としたマーケットで、中でも利用者4億人近くを数える中国は、市場規模は急拡大。東南アジアは国の成長に伴って消費マインドが旺盛です。リユース品へのニーズも高まる中で、中古のジュエリーやブランド品など取り扱う企業は、新規の販路として、在日外国人人材を活用し、ライブコマースの需要を取り入れています。
                    </p>
                </section>

                <section className="bg-[#f3f3f3] rounded-tr-[100px] md:rounded-tr-[200px]">
                    <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-[50px] md:py-[100px]">
                        <div className="pb-[30px] md:pb-[60px] text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                                個人事業主のバイヤーも増加傾向
                            </h2>
                            <p className='text-center text-[14px] text-gray-600 font-sans'>BUYERS ARE ALSO ON THE RISE.</p>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start gap-[4%]">
                            <p className="text-sm md:text-base leading-[1.8] font-medium w-full md:w-[55%] mb-5 md:mb-0">
                                オークションもオンライン化が進み、さまざまなバイヤーが参加しやすくなりました。その影響で、ネットで仕入れて、ネットで売るような動きも活性化しています。<br /><br />
                                海外バイヤーがネットオークションに参加することも出てきました。また、副業推進の流れもあり、個人事業主の参加者も増えいます。<br /><br />
                                リユース転職では、今後もバイヤーが独立していくキャリアパスが増加していく傾向にあると考えています。企業は、社員一人ひとりの「働きがいのある環境」をつくっていくかがカギになります。<br /><br />
                                一方、個人は社会や会社に変化の多い時代の中で、「自分がどのような軸を持ち、どのような働き方を望むのか」というキャリアプランを考え、そのためにスキルの習得（リスキル）や学び直し（リカレント）をする必要があります。
                            </p>
                            <div className="w-full md:w-[46%]">
                                <Image
                                    src="/images/business-new/rise.jpg"
                                    alt="About Business"
                                    width={420}
                                    height={445}
                                    className="rounded-lg object-cover w-full h-auto"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-[960px] mx-auto px-4 lg:px-0 py-[50px] md:py-[100px]">
                    <div className="pb-[30px] md:pb-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            リユース・買取業界の最新の採用動向は？
                        </h2>
                        <p className='text-center text-[14px] text-gray-600 font-sans'>MARKET CONDITIONS FOR HIRING</p>
                    </div>
                    <p className="text-sm md:text-base mb-10 leading-[1.8] font-medium">
                        日本社会全体の採用動向は、どうなっているのでしょうか。厚生労働省が発表した有効求人倍率は1.28倍です（2023年11月時点）。以下のグラフの通り、コロナ禍前の1.6倍に近づいている状況で、社会全体として求人数が増え、採用状況は改善したといえます。※有効求人倍率とは、求職者1人あたり何件の求人があるかを示すものです。
                    </p>
                    <div className="w-full">
                        <Image
                            src="/images/business-new/graph.jpg"
                            alt="About Business"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full h-auto"
                            priority
                        />
                    </div>
                    <p className="text-[13px] mb-10 text-center leading-[1.8] font-medium">
                        求人、求職及び求人倍率の推移　出典：厚生労働省
                    </p>
                    <p className="text-sm md:text-base mb-10 text-center leading-[1.8] font-medium">
                        2024年上半期も販売・サービス系職種の求人数は高水準で推移。中でも、リユース・EC・葬祭といった業界は遺品整理、SDGsの意識への高まり、リモートワークの定着といった観点から引き続き注目されています。<br /><br />
                        インフレによる物価上昇の波を受けて、リユース業界にも賃上げの動きが見られます。実際に中途採用の<span className="font-bold">初年度想定年収が引き上げ</span>られています。休日日数の増加や、残業が少ないなど、<span className="font-bold">ワーク・ライフ・バランスの充実</span>に取り組む企業の動きも見られます。<br /><br />
                        そのため、異業種からの中途入社は良いタイミングといえるでしょう。リユースショップスタッフや買取店の鑑定士、出張買取営業は、特別な資格などなくてもスタートできる場合が多く、<span className="font-bold">未経験の方でもチャレンジしやすい環境</span>です。コミュニケーション力は必須ですが、業界経験がなくてもポテンシャルや意欲、なぜその仕事をしたいかの志望動機を十分に示すことができれば転職成功の可能性を高められるでしょう。<br /><br />
                        未経験からでも挑戦しやすいように、<span className="font-bold">人材育成の部分も強化</span>しています。AI鑑定や本部での遠隔真贋でサポートの動きがその一つです。目利きスキルを養える鑑定士の職種は、集合研修以外に、現場でのＯＪＴも手厚く行われています。<br /><br />
                        業績好調のため<span className="font-bold">上場（IPO）を目指す企業も</span>。そのため、人事、経理などの管理部門や、営業統括、事業企画といった<span className="font-bold">ミドル・ハイクラス募集</span>も豊富に存在します。また、今後の成長ポイントである海外進出に関しては<span className="font-bold">語学力のある人材</span>が、Tech化に関しては、EC運営人材だけでなく、<span className="font-bold">テクノロジー技術を持つ人材</span>が求められています。<br /><br />
                        <span className="font-bold">真贋・査定スキルを持つリユース・買取業界経験者のニーズは常に高い</span>状況です。経験やスキルを活かしてキャリアアップできる求人が多数あります。リーダー、マネジャー候補となる場合は、接客・提案経験に加え、<span className="font-bold">マネジメントスキルや課題を見つけ主体的に行動しPDCAを回せる能力</span>も求められますので、その点を十分に示すことができれば転職成功の可能性を高められるでしょう。
                    </p>
                </section>

                <section className="mb-[50px] relative md:mb-[100px]">
                    <div className="absolute left-0 bottom-0 w-[60%] md:w-[44%] bg-[#f3f3f3] h-[380px] rounded-tr-[50px] md:rounded-tr-[100px]"></div>
                    <div className="max-w-[1200px] px-4 lg:px-0 relative z-20 flex flex-col md:flex-row justify-between m-auto items-start">
                        <div className="w-full md:w-[47%] mb-5 md:mb-0">
                            <Image
                                src="/images/business-new/dual.png"
                                alt="About Business"
                                width={567}
                                height={410}
                                className="object-cover w-full h-auto"
                                priority
                            />
                        </div>
                        <div className="w-full md:w-[47%]">
                            <h4 className="text-[20px] md:text-[32px] font-semibold">業界出身キャリアコンサルタントによる徹底サポート！</h4>
                            <p className="text-sm md:text-base leading-[1.8] my-10 font-medium">
                                リユース転職では、ご登録者様に業界情報の提供だけでなく、<br />
                                ●履歴書・職務経歴書の添削や面接アドバイス<br />
                                ●どのように働いていきたいのかというキャリアプラン設計<br />
                                ●スキルアップに関するコンテンツ提供<br />
                                といったご支援を最大限させていただいております。<br />
                                無料でのご相談が可能ですのでお気軽にお問合せください。
                            </p>
                            <LinkButton
                                text="転職支援サービス(無料)はこちら"
                                className="mx-auto md:mx-0 !flex w-[80%] md:w-[40%] bg-orange text-white w-max-content sm:w-50 md:w-70 lg:w-90"
                                hasNavIcon
                                to='/career-counseling'
                            />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}