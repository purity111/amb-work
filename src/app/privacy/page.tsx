'use client'

import React from 'react';
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import DefinitionSection from "@/components/pages/privacy/DefinitionSection";
import { PrivacyPolicySectionData } from "@/utils/types";
import Footer from '@/components/Footer';

const PrivacyPolicySections: PrivacyPolicySectionData[] = [
    {
        number: 1,
        title: "定義",
        text: "(1) 本方針において、「個人情報」とは、個人情報保護法にいう個人情報を指すものとします.\\n\\n(2) 本方針において、「履歴情報および特性情報」とは、上記に定める「個人情報」以外の当社がサービスを提供るにあたってご利用者から収集される情報をいい、ご利用されたサービスの利用履歴、ご覧になったページや広告の履歴、ご利用者が投稿などに利用したキーワード、ご利用日時、ご利用方法、ご利用環境（携帯端末を通じてご利用の場合の当該端末の通信状態、ご利用に際しての各種設定情報などを含みます。）、郵便番号、性別、年齢、職業、IPアドレス、クッキー情報、クレジットカード情報、端末の個体識別情報などを指します."
    },
    {
        number: 2,
        title: "個人情報などの取得",
        text: "当社は、以下の場合に、当社のサービスまたは当社を経由してご利用いただく当社の提携先（情報提供元、広告主、広告配信先などを含みます。以下｢提携先｣といいます。）のサービスを提供するために必要な範囲に限って、適法かつ公正な手段によって、以下のとおりご利用者の個人情報などを取得します.\\n\\n(1) 当社サービスを利用するためのアカウントへの登録を行う際ならびに当社サービスに申し込む際および当社サービスを利用するためのアカウントへの登録を行う際ならびに当社サービスに申し込む際および当社サービスを利用する際に、氏名、生年月日、お住いの都道府県、メールアドレス、電話番号などの情報をお尋ねすることがあります.\\n\\n(2) LINEその他の外部のサービス（以下「外部サービス」といいます。）のアカウントを用いて当社サービスを利用する際に、氏名、生年月日、お住いの都道府県などの情報を取得することがあります.\\n\\n(3) 当社サービス上でプロフィールページや人材の募集を行うページを作成する際に、氏名、生年月日、年齢、性別、メールアドレス、電話番号、所在地、学歴、職歴、職業、資格、プロフィール画像などの情報をお尋ねすることがあります.\\n\\n(4) ご利用者が当社の提供する有料サービスを利用される場合においてクレジットカード決済を希望されるときには、クレジットカード情報などの情報をお尋ねすることがあります.\\n\\n(5) ご利用者を特定する必要がある場合や、当社にお問い合わせいただいた場合に、氏名、生年月日、住所、メールアドレス、電話番号などの情報をお尋ねすることがあります.\\n\\n(6) ご利用者と提携先との間でなさ..."
    },
    {
        number: 7,
        title: "個人情報の閲覧・訂正・追加・削除",
        text: "(1) 当社は、ご利用者からご自身の個人情報の照会の申し出があった場合には、合理的な範囲で個人情報を開示します.\\n\\n(2) 当社の保有する個人情報の内容が事実と異なる場合など、個人情報の訂正、削除、利用の停止などをお申し出になる場合、ご利用者は、当社に対してメールにてご連絡ください。ご連絡をいただいてから合理的な範囲で遅滞なく調査を行い、その結果に基づき、当社の判断により個人情報を訂正、追加または削除します."
    },
    {
        number: 8,
        title: "外部サービス、外部リンクについて",
        text: "(1) 当社は、外部サービスと連携して当社サービスを提供する場合があり、ご利用者が、外部サービス上で個人情報その他の情報を公開し、または外部サービスと連携するサービス上で個人情報その他の情報の利用を許諾した場合、当社サービスにおいても個人情報その他の情報が公開される場合がありますので、ご了承ください。情報の公開範囲の設定方法などについては、外部サービスのプライバシーポリシーなどをご確認ください.\\n\\n(2) 当社サービスは、外部サイトへのリンクを含んでいますが、リンク先の外部サイトにおける個人情報その他の情報の取扱いについて、当社は責任を負いかねます。リンク先の外部サイトのご利用に際しては、各サイトのプライバシーポリシーをご確認ください."
    },
    {
        number: 9,
        title: "安全管理体制",
        text: "(1) 当社は、ご利用者の個人情報ならびに履歴情報および特性情報の漏洩、滅失または毀損を防止するため、個人情報ならびに履歴情報および特性情報のアクセス制限の実施、外部からの不正アクセスの防止のための措置など、安全管理のために必要かつ適切な措置を講じます.\\n\\n(2) 当社は、代表取締役を個人情報ならびに履歴情報および特性情報の管理責任者として、適正な管理および継続的な改善を実施します."
    },
    {
        number: 10,
        title: "プライバシーポリシーの変更",
        text: "(1) 当社は、個人情報保護法その他の関係法令・規範を遵守するとともに、本方針の内容を継続的に見直し、改善に努めます.\\n\\n(2) 本方針の内容を変更する場合は、当社サービスにかかるウェブサイトあるいはアプリへの掲示その他ご利用者にわかりやすい方法により告知します。ただし、法令上ご利用者の同意が必要となるような内容の変更を行うときは、別途当社が定める方法により、ご利用者の同意を取得します."
    },
    {
        number: 11,
        title: "お問い合わせ先",
        text: "当社における個人情報ならびに履歴情報および特性情報の取扱いに関するご意見、ご質問その他のお問い合わせは、当社が指定するメールアドレス（info@reuse-tenshoku.com）宛てのメールにより行ってください。当社は、お問い合わせに対する回答を原則としてメールのみで行います。なお、当社は、お問い合わせに対して回答する義務を負うものではありません."
    }
];

export default function PrivacyPolicyPage() {
    return (
        <main>
            {/* Hero Section - Identical Split Layout */}
            <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
            {/* Text Content (Left Side - Dark Grey Background) */}
            <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
                <div className="md:text-left md:mr-8 xl:mr-20">
                    <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                    <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-bold text-black mb-2">プライバシーポリシー</h1>
                    <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">Privacy Policy</p>
                </div>
            </div>

            <div className="pl-4">
                <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
                    <Image
                        src="/images/privacy-bg.jpg"
                        alt="Company Page Top"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Main Content */}
            <div className="max-w-[850px] mx-auto px-4 md:px-8 py-8">
                {/* Intro text */}
                <p className="mb-8 leading-[1.8]">
                    株式会社AMBヒトラボ（以下「当社」といいます。）は、当社が提供するサービスなどにおいてご利用者に関する情報を保護するため、個人情報の保護に関する法律（平成15年法第57号）（以下「個人情報保護法」といいます。）その他関連する法令などを遵守し、以下の方針（以下「本方針」といいます。）をとります。
                </p>

                {/* Render sections using the component */}
                {PrivacyPolicySections.map((section) => (
                    <DefinitionSection
                        key={section.number}
                        number={section.number}
                        title={section.title}
                        text={section.text}
                        isTerms={false}
                    />
                ))}
                <p className='text-[14px] md:text-base text-right pb-10 md:pb-20'>
                    2023年8月19日制定・適用
                </p>
            </div>
            <Footer />
        </main>
    );
}