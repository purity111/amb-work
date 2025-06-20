export type HeaderButton = HeaderLink | HeaderMenu
export interface HeaderLink {
    title: string;
    type: 'link';
    to: string;
}

export interface HeaderMenu {
    title: string;
    type: 'menu';
    items: Array<{
        title: string;
        to: string;
    }>
}

export interface PickOption {
    value: string;
    option: string;
}

export interface MapInfo {
    id: string;
    map: string;
    text: string;
    class: string;
    textColor?: string;
    city: Array<{ id: number, text: string }>
}

export interface RegisterEmployerParam {
    clinic_name: string;
    clinic_name_kana: string;
    zip: string;
    prefectures: number;
    closest_stataion: string;
    tel: string;
    employee_number?: number;
    establishment_year?: string;
    city?: string;
    business?: string;
    home_page_url?: string;
    email: string;
    password: string;
}

export interface RegisterJobSeekerParam {
    name: string;
    name_kana: string;
    birthdate: string;
    sex: number;
    zip: string;
    prefectures: number;
    tel: string;
    email: string;
    password: string;
}

export interface LoginParam {
    email: string;
    password: string;
}

export interface JobFetchParam {
    page: number;
    limit: number;
    searchTerm: string;
    companyID?: number;
    jobType?: number;
    features?: string[];
    prefectures?: string[];
    isAdmin?: string;
}

export interface JobParam {
    employer_id: number;
    job_title: string;
    features: number[];
    job_lead_statement: string;
    another_url_text?: string;
    workplaceIntroductions: Array<{ description: string }>;
    staffInfos: Array<{
        post: string;
        first_name: string;
        last_name: string;
        career?: string;
        introduction_text?: string;
        order_by: number;
    }>;
    pay: string;
    recruitingCriterias: Array<{
        id: number;
        body: string;
    }>,
    clinic_public_date_start: string; // 'YYYYMMDD'
    clinic_public_date_end: string;
    job_detail_page_template_id: number;
    clinic_public_form_url?: string;
    public_status: number;
}

export interface Employer {
    "id": number,
    "clinic_name": string,
    "clinic_name_kana": string,
    "business_form": number,
    "zip": string,
    "prefectures": number,
    "city": string,
    "closest_station": string,
    "tel": string,
    "home_page_url": string,
    "access"?: string,
    "director_name"?: string,
    "employee_number"?: number,
    "establishment_year": string,
    "business": string,
    "capital_stock": string
}

export interface ImageDetail {
    entity_path: string;
    image_name: string;
}

export interface StaffInfo {
    post: string;
    first_name: string;
    last_name: string;
    career?: string;
    introduction_text?: string;
    order_by: number;
}

export interface CompanyInfo {
    id: number;
    job_info_id: number
    description: string;
    created: string;
    modified: string;
    images: ImageDetail[]
}

export interface StaffInfoExtra extends StaffInfo {
    id: number;
    job_info_id: string;
    created: string;
    modified: string;
    images: ImageDetail[]
}

export interface JobDetail {
    "id": number;
    "employer_id": number;
    "job_detail_page_template_id": number,
    "job_title": string,
    "job_lead_statement": string,
    "public_status": number,
    "short_appeal"?: string,
    "continuation_gift_money"?: string,
    "job_posting_date": string,
    "header_image_catch_copy"?: string,
    "header_image_sub_catch_copy"?: string,
    "comment"?: number,
    "comment_public_status": number,
    "clinic_points_public_status"?: number,
    "youtube_url"?: string,
    "employment_type_id": number,
    "features": FeatureItem[],
    "pay": string,
    "job_category": number,
    "publication_only_flg": number,
    "clinic_form_public_status": number,
    "clinic_public_form_url": string,
    "clinic_public_date_start": string,
    "clinic_public_date_end": string,
    "another_url_text"?: string,
    "deleted"?: string,
    "created": string,
    "modified": string,
    "employer": {
        "id": number,
        "clinic_name": string,
        "prefectures": number,
        "city": string,
        "closest_station"?: string
    },
    "employmentType": {
        "id": number,
        "name": string,
        "created": string,
        "modified": string
    },
    "jobThumbnails": [
        {
            "entity_path": string,
            "image_name": string
        }
    ]
}

export interface JobDetailExtra {
    "id": number,
    "employer_id": number,
    "job_detail_page_template_id": number,
    "job_title": string,
    "job_lead_statement": string,
    "public_status": number,
    "short_appeal"?: string,
    "continuation_gift_money": string,
    "job_posting_date": string,
    "header_image_catch_copy"?: string,
    "header_image_sub_catch_copy"?: string,
    "comment"?: string,
    "comment_public_status": number,
    "clinic_points_public_status"?: number,
    "youtube_url"?: string,
    "employment_type_id": number,
    "pay": string,
    "job_category": number,
    "publication_only_flg": number,
    "clinic_form_public_status": number,
    "clinic_public_form_url"?: string,
    "clinic_public_date_start": string,
    "clinic_public_date_end": string,
    "another_url_text"?: string,
    "deleted"?: string,
    "created": string,
    "modified": string,
    "employer": Employer,
    "features": FeatureItem[],
    "recruitingCriterias": RecruitingCriteriaExtra[],
    "clinicPoints": number[],
    "staffInfos": StaffInfoExtra[],
    "workplaceIntroductions": CompanyInfo[],
    "jobThumbnails": ImageDetail[]
}

export interface RecruitingCriteria {
    id: number;
    calling_name: string;
    name: string;
    created: string;
    modified: string;
    display_order: number;
    clinic_flg: number;
    JobInfosRecruitingCriteria: {
        body: string;
        public_status: number;
    }
}

export interface AdminCriteriaFetchParam {
    page: number;
    limit: number;
    searchTerm: string;
}

export interface CreateUpdateCriteriaFetchParam {
    calling_name?: string;
    name: string;
    display_order: number
}

export interface BookmarkJobParam {
    job_info_id: number;
}

export interface BookmarkJob {
    id: number;
    created: string;
    modified: string;
    jobInfo: JobDetail;
    job_info_id: number;
    job_seeker_id: number;
}

export interface RecruitingCriteriaExtra extends RecruitingCriteria {
    JobInfosRecruitingCriteria: {
        body: string;
        public_status: number;
    }
}

export interface CircleTextItemData {
    imageUrl: string;
    text: string;
    altText: string;
}

export interface StatisticItemData {
    image: string;
    altText: string;
    text: string;
}

export interface AboutItemProps {
    image: string;
    title: string | React.ReactNode;
    text: string;
    altText?: string;
}

export interface AboutProps {
    items: AboutItemProps[];
    className?: string;
}

export interface CustomerVoiceItemData {
    image: string;
    title: string;
    position: string;
    text: string;
    altText?: string;
}

export interface PricePlanDetail {
    label: string;
    value: string;
    description?: string;
    link?: { text: string; href: string };
}

export interface PricePlanData {
    title: string;
    subtitle: string;
    image: string;
    planTitle: string;
    details: PricePlanDetail[];
    altText?: string;
}

export interface FlowChartItemData {
    image: string;
    step: string;
    title: string;
    text: string;
    altText?: string;
}

export interface RecruiterFlowStep {
    image: string;
    step: string;
    title: string;
    text: string;
}

export interface PrivacyPolicySectionData {
    number: number;
    title: string;
    text: string;
}

export interface FeatureItem {
    billing_flg?: boolean;
    created: string;
    id: number;
    modified: string;
    name: string;
    number_slot: number;
    parent_id?: number;
    price: number;
    price_2: number;
    price_3: number;
    type: number;
}

export interface ApplicationFetchParam {
    limit: number;
    page: number;
    job_seeker_id?: number;
    employer_id?: number;
    searchTerm?: string;
    jobType?: number;
}

export interface ApplicationItem {
    id: number;
    job_info_id: number;
    job_seeker_id: number;
    job_title: string;
    created: string;
    modified: string;
    chat_id: number;
    jobSeeker: {
        id: number;
        name: string;
        name_kana: string;
        birthdate: string;
        sex: number;
        zip: string;
        prefectures: number;
        tel: string;
        email: string;
        password: string;
        desired_working_place_1: string | null;
        desired_working_place_2: string | null;
        other_desired_criteria: string;
        reset_token: string;
        token_expiry: string;
        deleted: string | null;
        created: string;
        modified: string;
    };
    jobInfo: {
        id: number;
        employer_id: number;
        job_detail_page_template_id: number;
        job_title: string;
        job_lead_statement: string;
        public_status: number;
        short_appeal: string | null;
        continuation_gift_money: string | null;
        job_posting_date: string;
        header_image_catch_copy: string | null;
        header_image_sub_catch_copy: string | null;
        comment: string | null;
        comment_public_status: number;
        clinic_points_public_status: number | null;
        youtube_url: string | null;
        employment_type_id: number;
        pay: string;
        job_category: number;
        publication_only_flg: number;
        clinic_form_public_status: number;
        clinic_public_form_url: string;
        clinic_public_date_start: string;
        clinic_public_date_end: string;
        another_url_text: string | null;
        deleted: string | null;
        created: string;
        modified: string;
        employer: {
            id: number;
            clinic_name: string;
            prefectures: number;
            city: string;
            zip: string;
            tel: string;
        };
        recruitingCriterias: Array<{
            id: number;
            calling_name: string | null;
            name: string;
            created: string;
            modified: string;
            display_order: number;
            clinic_flg: number;
            JobInfosRecruitingCriteria: {
                id: number;
                job_info_id: number;
                recruiting_criteria_id: number;
                body: string;
                public_status: number;
                deleted: string | null;
                created: string;
                modified: string;
            };
        }>;
    };
}