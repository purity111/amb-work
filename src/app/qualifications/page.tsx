import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import SikakuItem from "@/components/pages/qualifications/SikakuItem";
import { FGA_QUALIFICATION_DATA } from "@/utils/constants";
import Image from "next/image";
import SikakuOrderItem from "@/components/pages/qualifications/SikakuOrderItem";
import { SIKAKU_ORDER_ITEMS } from "@/utils/constants";
import LinkButton from "@/components/LinkButton";
import { getFullUrl } from "@/utils/config";

export default function QualificationsPage() {
    return (
        <>
            <main>
                <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
                {/* Text Content (Left Side - Dark Grey Background) */}
                <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
                    <div className="md:text-left md:mr-8 xl:mr-20">
                        <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                        <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-medium text-black mb-2">資格一覧</h1>
                        <p className="text-[14px] md:text-[18px] text-gray-300 font-medium">List of Qualifications</p>
                    </div>
                </div>

                <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
                    <Image
                        src="/images/qualifications/banner.jpg"
                        alt="資格バナー"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>

                {/* Breadcrumb */}
                <Breadcrumb />

                <div className="pb-[30px] md:pb-[60px] text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                        スキルアップできる資格一覧
                    </h2>
                    <p className='text-center text-[14px] text-gray-600 font-sans'>LIST OF QUALIFICATIONS TO IMPROVE YOUR SKILLS</p>
                </div>
                <div className="max-w-[960px] w-[92%] sm:w-[85%] md:w-full md:px-[70px] md:px-[90px] m-auto">
                    <div className="my-5 md:my-8 relative aspect-[12/5] m-auto mb-4">
                        <Image
                            src='/images/qualifications/top.jpg'
                            alt="シンプルイラスト"
                            fill
                            className="object-contain rounded-[30px]"
                        />
                    </div>
                    <div className="text-center pt-5">
                        <h3 className="hyphen text-[20px] md:text-[28px] font-medium"><span className="text-[#65B729]">ス</span>キルアップしたいあなたへ！</h3>
                    </div>
                    <p className="text-sm md:text-base my-10 leading-[1.8] font-light">中古業界で開業するには、古物商の資格が必要ですが、ここでは、個人のスキルアップ、キャリアアップを目的として、リユース・リサイクル・ジュエリー業界に関連のある資格をご紹介します。</p>
                    <div className="border border-[#DFDFDF] p-10 pt-0">
                        {SIKAKU_ORDER_ITEMS.map((item) => (
                            <SikakuOrderItem key={item.id} {...item} />
                        ))}
                    </div>
                </div>
                <div className="mt-[60px] md:mt-[100px] bg-[#f3f3f3] rounded rounded-tr-[80px] md:rounded-tr-[120px] lg:rounded-tr-[200px] py-[60px] md:py-[120px]">
                    {FGA_QUALIFICATION_DATA.map((item, idx) => (
                        <SikakuItem key={item.number || idx} {...item} id={`test0${idx + 1}`} />
                    ))}
                    <div className="m-auto flex justify-center">
                        <LinkButton to={getFullUrl('/job-openings')} text="資格やスキルが活かせる求人一覧はこちら" className="bg-[#65B729] flex justify-center hover:opacity-90 inline-block text-white px-8 py-3 rounded-lg font-medium transition-colors" hasNavIcon />
                    </div>
                </div>
                <div className="py-[60px] md:py-[100px]">
                    <div className="pb-[30px] md:pb-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            インタビュー
                        </h2>
                        <p className='text-center text-[14px] text-gray-600 font-sans'>INTERVIEW</p>
                    </div>
                    <div className="max-w-[960px] w-[90%] sm:w-[80%] md:w-full m-auto">
                        <div className="interview1">
                            <div className="flex flex-col-reverse md:flex-row justify-between gap-[5%]">
                                <div className="relative md:w-1/2 aspect-[7/4] mb-4 rounded rounded-[20px]">
                                    <Image
                                        src='/images/qualifications/interview1.jpg'
                                        alt='インタビュー'
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="py-5 w-full md:w-1/2">
                                    <p className="text-[#ff8a34] text-[14px] font-bold">INTERVIEW 01
                                        <span className="text-[#65B729]">　ー</span>
                                    </p>
                                    <h4 className="text-[20px] md:text-[26px] font-semibold">一般社団法人　遺品整理士認定協会　事務局の長谷川様から「遺品整理士」について詳しくお話を伺いました！</h4>
                                </div>
                            </div>
                            <h5 className="text-[#65B729] text-base md:text-[24px] my-6 font-bold">一　協会設立のきっかけを教えてください。</h5>
                            <p className="text-sm md:text-base">
                                遺品整理士認定協会の設立は2011年で、設立の背景には理事長である木村の亡くなった故人の思い出の品をぞんざいに扱われたり、処理の仕方が適切でなかったという実体験にあります。事務局の私（長谷川様）も身近なところで遺品整理を行った際に違和感を覚える出来事があり、運営に参加するきっかけになりました。<br /><br />
                                日本では高齢化社会、核家族化が進み、このような遺品整理に関する問題はより身近な出来事になってきています。以前は、遺品整理は家族や親族、近所の人で行うことが多かったと思いますが、近年は専門の業者に依頼するケースが多くなってきました。しかし、そのプレイヤーは葬儀業者、不動産業者、清掃業者、リサイクル業者、便利屋など様々で、コンプライアンスが徹底されないことが多く、遺族が悲しい思いをしたり、不法投棄・無許可での営業、不正請求などトラブルに巻き込まれたりすることがあるのです。先月も片付け業者が逮捕される事件もありました。<br /><br />
                            </p>
                            <h5 className="text-[#65B729] text-base md:text-[24px] my-6 font-bold">一　遺品整理士とはどのような仕事なのですか。</h5>
                            <p className="text-sm md:text-base">
                                遺品整理士は現在、全国に約38,000人います。遺品整理士は家財を「遺品」としてみて、例え処分するとしても、丁寧に扱いながら作業をして、故人の気持ちはもちろん、残された遺族の気持ちを大切にすることを大前提としております。そして、整理・処分する際の法やコンプライアンスを徹底しています。<br /><br />
                                片付けのスケジュールや手順にコツがありますし、物件ごとに対応方法も異なります。メディアでも話題になったデジタル遺品の処理の仕方や、換金性のある品物の査定、処理しにくい大きな家具などの自治体ごとの廃棄方法など、そのあたりは実務で経験を積みながら知識やスキルを習得していくことになります。<br />
                            </p>
                            <h5 className="text-[#65B729] text-base md:text-[24px] my-6 font-bold">一　リサイクル・リユース業界の企業とも業務提携をされていますが、<br />どのような背景からでしょうか。</h5>
                            <p className="text-sm md:text-base">
                                2点あります。まず1点目は、依頼者からただ処分するのではなく、なるべき価値をつけて、再利用をしてほしいというニーズが高まってきたこと、依頼する業者によって買取に出す品物にばらつきがあることがありました。<br /><br />
                                また2点目は、買取企業がお客様から遺品整理について相談を受けるというケースも増えてきたということです。例えば、リサイクルショップでは、遺品を整理し始めて持ち込めるものは買取依頼しに来れるけれども自分では処理が難しい物をどうすればよいかというお客様からのご相談にお答えしたいということや、訪問買取では、家の中で価値あるものは査定できお客様としてもどういたいか判別できた、しかしその他の物はどうしていけばいいのかとお客様から相談をもらったときにお答えしたいというニーズです。<br /><br />
                                そこで、お互いの専門知識やノウハウを提供し合うことでお客様によりよい遺品整理体験をしていただけるようになりました。<br /><br />
                            </p>
                            <h5 className="text-[#65B729] text-base md:text-[24px] my-6 font-bold">一　遺品整理だけでなく、生前整理もメディアでも注目を浴びていて需要が増している、<br />と感じますがいかがですか。</h5>
                            <p className="text-sm md:text-base">おっしゃる通りで、セミナーや講演など行う場合も以前は、遺品整理8割、生前整理1割、空き家の整理1割という内容での比率でしたが、最近は、遺品整理４割、生前整理４割、空き家の整理２割くらいになってきました。また、依頼主からは、それぞれの内容が複雑に絡んでおり、全ての内容が混ざっているケースもあります。なので、遺品整理士も遺品だけでなく、生前の整理の知識・ノウハウが必要になってきていると感じています。<br /><br /></p>
                            <h5 className="text-[#65B729] text-base md:text-[24px] my-6 font-bold">一　リサイクル・リユース業界に従事する方、業界を目指している方へメッセージをお願いします。</h5>
                            <p className="text-sm md:text-base">
                                大前提はご依頼主に満足していただく対応をぜひお願いしたいです。一軒やの購入は1生に一度なんていうキャッチフレーズもありますが、その故人様の遺品整理こそ一生に一度です。だからこそ、故人とご遺族の気持ちに寄り添い、丁寧な対応をお願いいたします。<br /><br />
                                そして、コンプライアンスをきっちり守っていただきたいと思っております。中古品、リユースのお仕事をするときは、古物商の資格が必要だと思いますが、例えば会社で古物を取得されている社員の方が訪問買取する際は、行商従業者証を携帯し、提示する義務があるのをご存じない方も多いです。それ以外にも遺品整理纏わる資格は多種多様にあるので、そのあたりの知識が必ず持って、徹底することをお願いしたいです。<br /><br />
                            </p>
                        </div>
                        <hr className="border border-t-0 border-[#DFDFDF] my-[60px]"></hr>
                        <div className="interview1">
                            <div className="flex flex-col-reverse md:flex-row justify-between gap-[5%]">
                                <div className="relative md:w-1/2 aspect-[7/4] mb-4 rounded rounded-[20px]">
                                    <Image
                                        src='/images/qualifications/interview2.jpg'
                                        alt='インタビュー'
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="py-5 w-full md:w-1/2">
                                    <p className="text-[#ff8a34] text-[14px] font-bold">INTERVIEW 02
                                        <span className="text-[#65B729]">　ー</span>
                                    </p>
                                    <h4 className="text-[20px] md:text-[26px] font-semibold">英国宝石学協会が認定する宝石学資格の「FGA」について、日本宝飾クラフト学院　宝石学　講師の鈴木博樹様から詳しくお話を伺いました！</h4>
                                </div>
                            </div>
                            <h5 className="text-[#65B729] text-base md:text-[24px] my-6 font-bold">一　FGAとはどういう資格なのですか。</h5>
                            <p className="text-sm md:text-base">
                                英国宝石学協会（The Gemmological Association of Great Britain /Gem-A=英国宝石学協会）とは、1908年に英国ゴールド・スミス協会の教育委員会としてロンドンに設立された、世界で最も歴史ある宝石学・教育機関です。2012年から日本宝飾クラフト学院　東京本校でFGA取得のための講座が開設されました。それが、GemA宝石学コースです。当コースでは、ファンデーションコースとディプロマコースがあり、ファンデーションコース（基礎課程）に入学してファンデーション試験に合格した方は、ディプロマコース（上級課程）へ進学できます。ディプロマ試験に合格すると、待望の“FGA”を取得することができます。非常に難易度が高い試験ですが、Gem-A認定の宝石学ディプロマは英国政府により学士号と同等レベルの資格であると認められています。<br /><br />
                                日本宝飾クラフト学院では、通学教育と通信添削教育を用意しています。<br /><br />
                            </p>
                            <h5 className="text-[#65B729] text-base md:text-[24px] my-6 font-bold">一　ジュエリーの資格だと、一般社団法人日本ジュエリー協会のジュエリーコーディネーター検定や米国宝石学会（Gemological Institute Of America）のGIAなんかも有名ですよね。</h5>
                            <p className="text-sm md:text-base">
                                そうですね。しかし、GIAの教育部門は現在日本からは撤退してしまっています。また、今、国内で受けられるジュエリー関係の資格の中で、FGAは世界で通用する唯一の資格です。<br /><br />
                            </p>
                            <h5 className="text-[#65B729] text-base md:text-[24px] my-6 font-bold">一　今講座に通われている方はどういう方がいるのでしょうか。</h5>
                            <p className="text-sm md:text-base">
                                ジュエリー業界の方や、宝石や鉱物が好きという方もいらっしゃいますが、私（鈴木先生）は、夜の時間帯の社会人クラスを担当しているので、そこに通ってくる方は、ジュエリー・宝飾業界で働いている人が多いですね。企業の研修の一環としてくる方や、スキルアップを目指している方、自分で事業をしていて実務で悩んでいる方も学びに来ています。<br /><br />
                            </p>
                            <h5 className="text-[#65B729] text-base md:text-[24px] my-6 font-bold">一　FGAがリユース・買取業界でのスキルアップにどう活かされるでしょうか。</h5>
                            <p className="text-sm md:text-base">
                                学ぶ内容は、宝石に関するあらゆることを総合的に学びます。査定、鑑定に関わるリユースのお仕事をされている方々は、自分の判断の根拠・裏付けがなければならないはずです。それには、色を始めとした品質、インクルージョン、産地、処理、合成など幅広い知識が必要です。バイヤーの方はそれを元に相場や需要なども見ながら値段を出すわけですね。鑑別機関にいる方も鑑別書を作成するにはこの知識が絶対に必要です。<br /><br />
                                この辺りの知識や経験を積むのは簡単なことではなく、業界の経験者でも「産地を何で判断していいかわからない」などの悩みがあるのです。<br /><br />
                                FGAでは、知識だけでなく、宝石のサンプルを見ながら、実技も交えて学んでいきます。非常に実践的なので、すでに鑑定・査定のお仕事をされている方も多く通われているのだと思います。<br /><br />
                            </p>
                            <h5 className="text-[#65B729] text-base md:text-[24px] my-6 font-bold">一　リユース・買取業界に従事する方、業界を目指している方へメッセージをお願いします。</h5>

                            <p className="text-sm md:text-base">
                                資格を取得するまでの期間や料金もそれなりにハードルが高いと思っております。<br /><br />
                                しかし、現場で経験を積むと、自分に何の知識やスキルが足りないのかが、わかってきます。それを補い、確実なスキルを手に入れるにはFGAに通う他ない、そういった内容だと思っています。なので、仕事をしている中で自分の課題に気づきがある方、そして絶対その知識やスキルを習得したい、習得する必要があるという強い覚悟のある方に通っていいただきたいと思っています。必ず、実務で活かされることでしょう。<br /><br />
                            </p>
                        </div>
                        <hr className="border border-t-0 border-[#DFDFDF] my-[60px]"></hr>
                        <p className="text-sm md:text-base">
                            いかがでしたでしょうか。<br /><br />
                            しかし、現場で経験を積むと、自分に何の知識やスキルが足りないのかが、わかってきます。それを補い、確実なスキルを手に入れるにはFGAに通う他ない、そういった内容だと思っています。なので、仕事をしている中で自分の課題に気づきがある方、そして絶対その知識やスキルを習得したい、習得する必要があるという強い覚悟のある方に通っていいただきたいと思っています。必ず、実務で活かされることでしょう。<br /><br />
                            業界未経験の方は、まずは資格と飛びつかずとも、未経験から採用している企業を探して経験を積んでいき、経験を積む中で自分に必要だと思うものや、今後のキャリアアップを考える中で役立ちそうなものを選定していくのが良いかもしれません。そのあたりは、個別のキャリア相談の中でも詳しく情報提供させていただきます。
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}