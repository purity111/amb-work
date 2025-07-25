"use client";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import React from "react";
import BackgroundsSection from "@/components/BackgroundsSection";
import { BACKGROUNDS_SECTIONS } from '@/utils/constants';
import Link from "next/link";

export default function BusinessPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
        {/* Text Content (Left Side - Dark Grey Background) */}
        <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
          <div className="md:text-left md:mr-8 xl:mr-20">
            <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
            <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-semibold text-black mb-2">リユース業界に<br />ついて知る</h1>
            <p className="text-[14px] md:text-[18px] text-gray-300 font-semibold">Reuse Industry</p>
          </div>
        </div>

        <div className="pl-4">
          <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
            <Image
              src="/images/business/top.jpg"
              alt="Business Top"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* About Section */}
        <section className="max-w-[960px] mx-auto px-4 lg:px-0 py-12">
          <div className="pb-[30px] md:pb-[60px] text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
              取扱い領域について
            </h2>
            <p className='text-center text-[14px] text-gray-600 font-sans'>AREAS OF EXPERTISE</p>
          </div>
          <div className="w-full">
            <Image
              src="/images/business/about.jpg"
              alt="About Business"
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-auto"
              priority
            />
          </div>
          <p className="text-sm md:text-base my-10 leading-[1.8] font-medium">
            リユース・リサイクル・買取の対象アイテムは、ブランド品のバック・小物・時計、貴金属・ジュエリー・宝石、衣類・アパレル・スニーカーというファッション関連、本・ゲーム・玩具といったホビー用品、PC・スマートフォンというデジタル用品、チケット・金券、家具・家電などが主な取り扱い領域となります。（不動産や自動車は含まないケースが多い）<br /><br />
            近年は取り扱い領域が広がっています。トレカ・フィギュア、着物、骨董品・陶器・食器、雑貨、酒・飲料、コスメ、キャンプ・アウトドア用品、カメラ・楽器・釣り具、ゴルフ用品・スポーツ用品、工具・農機具などが取り扱われています。
          </p>
        </section>

        <section className="bg-[#f3f3f3] rounded-tr-[100px] md:rounded-tr-[200px]">
          <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-[50px] md:py-[100px]">
            <div className="pb-[30px] md:pb-[60px] text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                拡大を遂げるリユース・リサイクル・買取業界
              </h2>
              <p className='text-center text-[14px] text-gray-600 font-sans'>WHAT IS THE JOBCHANGE SUPPORT SERVICE?</p>
            </div>
            <p className="text-sm md:text-base my-10 leading-[1.8] font-medium">
              新品を買うだけでなく、売ること、直して使うこと、デザインを変えるなどリフォーム・リメイクすること、中古品を買うこと、シェアをすることといった購買の選択肢が増えた現代。<br /><br />
              リサイクルに代表されるエコロジー（エコ）な社会、循環型社会の実現を目指すリユース・リサイクル・買取業界は、ここ10年来急成長を遂げています。具体的には、市場規模は13年連続で右肩上がりで成長しています。2022年のリユース市場規模は2.9兆円となっています。<br /><br />
              この3兆円の市場規模とは、ブライダル業界や化粧品業界を超えており、国内の同じ規模感の産業としては、インターネット広告業界や、アニメ業界が挙げられます。<br /><br />
              リユース・リサイクル・買取業界は、まだ業界としての歴史が浅いため、認知度が低いのですが、意外に大きなマーケットだなと感じられた方もいるかもしれません。環境省のデータではリサイクルショップ利用したことがあるのは5人に1人というデータもありますが、メルカリを代表するフリマアプリが台頭した昨今、物を売ることや中古品を購入することが身近に感じている方はもっといるかもしれませんね。<br /><br />
              市場規模は2025年には4兆円になると言われており、成長はとどまることを知りません。<br /><br />
              その背景に4つの要因があります。
            </p>
          </div>
        </section>

        <section className="max-w-[960px] mx-2 md:mx-auto py-[50px] md:py-[100px]">
          <div className="pb-[30px] md:pb-[60px] text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
              拡大を遂げるリユース・リサイクル・買取業界
            </h2>
            <p className='text-center text-[14px] text-gray-600 font-sans'>WHAT IS THE JOBCHANGE SUPPORT SERVICE?</p>
          </div>
          {BACKGROUNDS_SECTIONS.map((_, idx) => (
            <BackgroundsSection key={idx} sectionIndex={idx} />
          ))}
          <div className="flex flex-col md:flex-row items-start justify-start gap-10 mx-3 md:mx-0 md:w-[80%]">
            <div className="w-[300px] h-[300px] aspect-[1/1] m-auto relative md:w-[164px] md:h-[164px] flex justify-center mb-6 md:mb-0">
              <Image
                src="/images/business/back5.jpg"
                alt="back5"
                fill
                className="rounded-lg object-cover"
                priority
              />
            </div>
            <p className="text-sm md:text-base leading-[1.8] font-medium">
              なぜSDGsを紹介したかというと、17項目の内の12項目に「つくる責任と使う責任」というものがあるからです。”リニアエコノミー”から”サーキュラーエコノミー”へ移行し、持続可能な消費と生産のパターンを確保すること。リユースの事業というのはまさにここに取り組んでおり、社会的意義が大きいといえます。実際、若い世代は社会貢献への意識が高く、「経済の好循環を生むところ」が当業界を志望した理由の一つと答える方も多くいます。<br /><br />
              実際にどのような求人情報があるのか確認したい場合は、こちらから求人一覧をご覧ください。
            </p>
          </div>
        </section>

        <section className="max-w-[960px] mx-auto px-4 lg:px-0 py-12">
          <div className="pb-[30px] md:pb-[60px] text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
              比較的景気に強い業態
            </h2>
            <p className='text-center text-[14px] text-gray-600 font-sans'>RELATIVELY STRONG BUSINESS CLIMATE</p>
          </div>
          <div className="w-full">
            <Image
              src="/images/business/climate.jpg"
              alt="About Business"
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-auto"
              priority
            />
          </div>
          <p className="text-sm md:text-base my-10 leading-[1.8] font-medium">
            先ほど歴史的にまだ浅いとお伝えしましたが、日本ではリユースというビジネスがはじまって30年くらいです。ざっと振り返ると、バブル崩壊後、ゲオ社やブックオフ社といった現在のトップ企業が誕生し、リサイクルショップの多店舗展開を進めてきました。<br /><br />
            その後、2000年のITバブル期にヤフオクやビッターズなどのネットショップが誕生。2008年リーマンショック後、不安定な経済情勢を背景に、金相場が高騰し、貴金属買取ブームが起きました。これを機に国内の事業者数が一気に拡大します。<br /><br />
            2010年以降は、ZOZOUSEDやメルカリを代表するテクノロジーを駆使した企業が誕生。また、中国経済の影響もあり、インバウンドの需要で宝飾品や中古ブランド品の売れ行きが好調でした。<br /><br />
            直近では、リユース市場も成熟期に入り、各社が事業戦略を見直す中で、事業統合（M＆A）や、協業の動きが目立っています。<br />
            いずれにしても、過去の歴史から振り替えると、リユース・リサイクル・買取業界はそのビジネス特性上、景気衰退期に成長してきたともいえ、”景気に比較的強い業界”と言えます。
          </p>
        </section>

        <section className="bg-[#f3f3f3] rounded-tl-[100px] md:rounded-tl-[200px]">
          <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-[50px] md:py-[100px]">
            <div className="pb-[30px] md:pb-[60px] text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                業界の将来性、潜在需要は66兆円
              </h2>
              <p className='text-center text-[14px] text-gray-600 font-sans'>POTENTIAL DEMAND IS 66 TRILLION YEN</p>
            </div>
            <p className="text-sm md:text-base my-10 leading-[1.8] font-medium">
              これまで時代の背景とか社会のトレンドと業界の関係についてお話しました。ここ10年で急成長を見せたリユース市場。2025年には4兆円を超えるという推測もあります。<br /><br />
              『リユース転職』では、その先も市場成長していくと考えています。もっと言うと、前述したような理由から、今後10~20年は国内でもグローバルでも優位にある市場だと思っています。<br /><br />
              最新のメルカリ社のデータによると、中古品になり得るいわゆる不用品（隠れ資産※）の潜在需要は「66兆円」あるともいわれています。<br />※1年以上使用せず、理由なく家庭内に保管している不要品のことを「隠れ資産」と呼んでいます<br /><br />
              一方、別の調査によると国内全人口の60％しかリサイクルショップを利用したことがないといわれています。また、別のアンケートによると断捨離を試みた人の内の50％が「物を捨てた」と答えたという結果もあります。<br /><br />
              つまり、まだまだ伸びしろがあるのです。国内の人口は減少に向かっていますが、リユース経験をしていく人口は増えていきます。<br /><br />
              そのためにはリユース業界として、できる対象アイテムを広げていくことや、買取や中古品の購入を経験したことがない顧客層を開拓していくこと、信頼性のある市場を形成していくことが、今後の業界のさらなる可能性になりそうです。<br /><br />
              顧客心理として大事なモノほど、手放すのが一番最後になります。一度買取を経験した人も、まだ手放せないモノを保有しているので、企業側はサービスの品質を向上をさせ、顧客との信頼関係を作り、そうした大切な物を次の人の手に譲り渡していくお手伝いをできるか、適切に市場に流通させていけるかということがカギになると考えています。
            </p>
          </div>
        </section>

        <section className="max-w-[960px] mx-auto px-4 lg:px-0 py-12">
          <div className="pb-[30px] md:pb-[60px] text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
              様々な業態が存在
            </h2>
            <p className='text-center text-[14px] text-gray-600 font-sans'>VARIOUS TYPES OF BUSINESSES EXIST</p>
          </div>
          <div className="w-full">
            <Image
              src="/images/business/exist.jpg"
              alt="About Business"
              width={960}
              height={300}
              className="rounded-lg object-cover w-full h-auto"
              priority
            />
          </div>
          <p className="text-sm md:text-base mt-10 leading-[1.8] font-medium">
            このように急激に成長し、将来性もあるリユース・リサイクル・買取業界ですが、伝統的な質屋のような業態から、IT技術でCtoCの市場を作りつつあるメルカリのような業態まで、多種多様な企業が混在するのが特徴です。 また個人商店から上場企業まで規模も様々です。<br />
            取り扱いのアイテムも、単品に特化したカテゴリーキラーから、家庭にあるほぼすべてのアイテムを扱う総合型までバリエーションが豊富です。<br /><br />
            ここでは、多種多様な業態の特徴により以下に分類してみます。<br /><br />
          </p>
          <p className="px-[20px] py-[30px] md:p-[45px] bg-[#f3f3f3] my-[10px] md:my-[30px] text-sm md:text-base leading-[1.8] font-semibold">
            ・買取専門店（直営、FC）<br />
            ・買取と販売まで行うリユース店<br />
            ・類似の数種類の商材を専門に扱う（専門商材特化型リユース）店<br />
            ・総合的にどんなものでも扱う（総合型リユース、リサイクルショップ）店<br />
            ・リアル店舗を保有している、多店舗型<br />
            ・無店舗のネット型リユース、出張買取<br />
            ・オークションで仕入れて、販売を個人向けとするBtoC型<br />
            ・業者間の売買を行うBtoB型<br />
            ・販売チャネルは通販（ECサイト）専業<br />
            ・オークション（市場）運営<br />
            ・質屋<br />
            ・中古品のマーケットプレイス<br />
            ・リユース業を支援するコンサルティング業、システムサービス業など
          </p>
          <p className="text-sm md:text-base mt-10 leading-[1.8] font-medium">
            実際には企業で複数の事業展開をしていることが多いです。<br /><br />
            最近の注目は、アパレルや家具、楽器などの大手メーカーや小売が中古品ビジネスへ参入していることです。また、リユース企業とパートナーシップを組んだ異業種の中古品ビジネスへの参入としては、下記のような事例があります。
          </p>
          <p className="px-[20px] py-[30px] md:p-[45px] border border-[#dfdfdf] my-[10px] md:my-[30px] text-sm md:text-base leading-[1.8] font-semibold">
            ・引っ越しの際に引っ越し業者が買取をして、引っ越し代から相殺してくれるサービス<br />
            ・葬儀屋が遺品整理としての買取を一緒に行うサービス<br />
            ・地方の信用金庫で相続対策や終活の相談時に一緒に査定をするサービス
          </p>
          <p className="text-sm md:text-base mt-10 leading-[1.8] font-medium">
            他にも、ジュエリーや家具・着物などのメンテナンスを施しデザインを変えるリフォーム機能を持つ事業や、リユースをメインで扱いながらレンタル業態に踏み込む企業など、顧客ニーズを踏まえて業態はどんどん進化を辿っているといえます。<br /><br />
            さらに、リユース大手企業が不動産業界へ進出する動きを2020年に見せ始めました。個人のお客様の家の中の保有物である貴金属や服、骨董などから始まったリユースですが、最終的に家という資産を終活として整理するというニーズがあると考えられます。冒頭で家や車は領域に含まないと表記していましたが、今後は流れが変わっていくかもしれません。<br /><br />
            以上のようにリユース・リサイクル・買取業界と一括りにしても様々な業態と可能性があることをご理解いただけましたでしょうか。<br />
            最新の業界動向は<Link href={'/business/business-new'} className="text-[#65B729] underline">「最新のリユース・リサイクル・買取業界の動向と採用状況について」</Link>でご覧いただけます。<br /><br />
            そのようなリユース・リサイクル・買取業界ではどのような仕事があるのか、については<Link href={'/works'} className="text-[#65B729] underline">「仕事やスキルについて知る」</Link>でご覧いただけます。<br /><br />
            実際にどのような求人情報があるのか確認したい場合は、以下から求人一覧をご覧ください。
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}


