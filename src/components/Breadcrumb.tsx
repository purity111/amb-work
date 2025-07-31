'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

// Define the mapping of paths to their display names
const pathToName: { [key: string]: string } = {
    '/': 'HOME',
    '/company': '会社概要',
    '/recruiter': '採用担当者の方へ',
    '/terms': '利用規約（ユーザー向け）',
    '/works': '仕事・スキルについて知る',
    '/privacy': 'プライバシーポリシー',
    '/simplified-test': '真贋スキル簡易テスト',
    '/qualifications': '資格一覧',
    '/career-counseling': '転職支援サービス',
    '/columns': 'コラム一覧',
    '/about': 'リユース転職について',
    '/contact': 'お問い合わせ',
    '/interview': 'インタビュー',
    '/experience': '経験者サポート',
    '/inexperience': '未経験者サポート',
    '/business': 'リユース業界について知る',
    '/business/business-new': '最新動向、採用状況',
    '/register/thanks': 'ありがとう',
    '/register': '登録',
    '/contact/finish': 'ありがとう',
    '/recruiter/finish': 'ありがとう'
    // Add more paths and their corresponding names as needed
}

interface BreadcrumbProps {
    lastItemName?: string;
}

export default function Breadcrumb({ lastItemName }: BreadcrumbProps) {
    const pathname = usePathname()

    // Split the path into segments and filter out empty strings
    const segments = pathname.split('/').filter(segment => segment)

    // Build the breadcrumb items
    const breadcrumbItems = segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/')
        let name = pathToName[path] || segment // Fallback to segment if no mapping exists
        if (index === segments.length - 1 && lastItemName) {
            name = lastItemName
        }
        return {
            path,
            name
        }
    })

    // Always add HOME as the first item
    const items = [{ path: '/', name: 'HOME' }, ...breadcrumbItems]

    return (
        <div className="max-w-[1200px] mx-auto pb-10 md:pb-20 pl-4 lg:pl-0">
            <div className="flex items-center text-sm">
                {items.map((item, index) => (
                    <div key={item.path} className="flex items-center">
                        {index > 0 && <span className="mx-2">・</span>}
                        {index === items.length - 1 ? (
                            <span>{item.name}</span>
                        ) : (
                            <Link href={item.path} className="hover:text-green text-[10px] md:text-[12px]">
                                {item.name}
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
} 