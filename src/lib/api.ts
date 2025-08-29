import { RegisterEmployerParam, RegisterJobSeekerParam, LoginParam, JobParam, RecruitingCriteria, AdminCriteriaFetchParam, BookmarkJobParam, CreateUpdateCriteriaFetchParam, ApplicationFetchParam, BookmarkedJobsFetchParams, ColumnFetchParam, Column, ColumnResponse, InterviewFetchParam, InterviewResponse, Interview, CompanyApplicationParam, CompanyApplicationResponse, ContactInquiryParam, ContactFetchParam, CareerConsultationParam } from "@/utils/types";
import api from './axios';
import { toQueryString } from "@/utils/helper";
import type { ConfirmEmailParam, ForgotPasswordParam, JobSeekerFilterParam, ResetPasswordParam, ChangePasswordParam } from '@/utils/types';

//Auth
export const registerAsEmployer = async (param: RegisterEmployerParam) => {
    const response = await api.post('/auth/employer/register', param);
    return response.data;
};

export const registerAsJobSeeker = async (param: RegisterJobSeekerParam) => {
    const response = await api.post('/auth/job-seeker/register', param);
    return response.data;
};

export const login = async (param: LoginParam) => {
    const response = await api.post('/auth/login', param);
    return response.data;
};

export const forgotPassword = async (param: ForgotPasswordParam) => {
    const response = await api.post('/auth/forgot-password', param);
    return response.data;
};

export const resetPassword = async (param: ResetPasswordParam) => {
    const response = await api.post('/auth/reset-password', param);
    return response.data;
};

export const changePassword = async (param: ChangePasswordParam) => {
    const response = await api.put('/auth/change-password', param);
    return response.data;
};

export const confirmEmail = async (param: ConfirmEmailParam) => {
    const response = await api.post('/auth/confirm-email', param);
    return response.data;
};

export const getAllEmployerInfos = async () => {
    const response = await api.get('/employers/infos');
    return response.data;
};

export const getEmployerInfoById = async (id: number) => {
    const response = await api.get(`/employers/${id}`);
    return response.data;
};

// Feature related
export const getAllFeatures = async () => {
    const response = await api.get('/features');
    return response.data;
};

export const getPaginatedFeatures = async (param: AdminCriteriaFetchParam) => {
    const queryString = toQueryString(param);
    const response = await api.get(`/features/pagination?${queryString}`);
    return response.data.data;
}

export const createFeatures = async (param: AdminCriteriaFetchParam) => {
    const response = await api.post('/features', param);
    return response.data;
};

export const updateFeatures = async (id: number, param: AdminCriteriaFetchParam) => {
    const response = await api.put(`/features/${id}`, param);
    return response.data;
};

export const deleteFeatures = async (id: number) => {
    const response = await api.delete(`/features/${id}`);
    return response.data;
};

// Criteria related
export const getRecruitingCriterias = async () => {
    const response = await api.get('/recruitingCriterias');
    const sorted = (response.data?.data || []).sort((a: RecruitingCriteria, b: RecruitingCriteria) => a.display_order - b.display_order);
    return sorted;
};

export const getAdminCriterias = async (param: AdminCriteriaFetchParam) => {
    const queryString = toQueryString(param);
    const response = await api.get(`/recruitingCriterias/pagination?${queryString}`);
    return response.data;
};

export const createRecruitingCriteria = async (param: CreateUpdateCriteriaFetchParam) => {
    const response = await api.post('/recruitingCriterias', param);
    return response.data;
};

export const updateRecruitingCriteria = async ({ id, data }: { id: number, data: CreateUpdateCriteriaFetchParam }) => {
    const response = await api.put(`/recruitingCriterias/${id}`, data);
    return response.data;
};

export const deleteRecruitingCriteria = async (id: number) => {
    const response = await api.delete(`/recruitingCriterias/${id}`);
    return response.data;
};

export const getBookmarkedJobs = async (param: BookmarkedJobsFetchParams) => {
    const queryString = toQueryString(param);
    const response = await api.get(`/jobs/favourites?${queryString}`);
    return response.data;
};

export const bookmarkJob = async (param: BookmarkJobParam) => {
    const response = await api.post(`/jobs/favourite`, param);
    return response.data;
};

// Job related
export const getJobs = async (
    page: number,
    limit: number,
    searchTerm?: string,
    jobType?: number,
    isAdmin?: string,
    companyID?: number,
    employer_id?: number,
    features?: string[],
    prefectures?: string[],
    public_status?: number,
    sortBy?: string,
    recommend?: number,
) => {
    const param: Record<string, any> = { page, limit, searchTerm, jobType, isAdmin };
    if (companyID && companyID > 0) {
        param.companyID = companyID;
    }
    if (employer_id && employer_id > 0) {
        param.employer_id = employer_id;
    }
    if (features?.length && features?.length > 0) {
        param.features = features;
    }
    if (prefectures?.length && prefectures?.length > 0) {
        param.prefectures = prefectures;
    }
    if (public_status !== undefined) {
        param.public_status = public_status;
    }
    if (sortBy !== undefined) {
        param.sortBy = sortBy;
    }
    if (recommend) {
        param.recommend = 1;
    }
    const queryString = toQueryString(param);
    const response = await api.get(`/jobs?${queryString}`);
    return response.data;
};

export const getJobById = async (id: number) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
};



export const getJobSeekers = async (param: JobSeekerFilterParam) => {
    const { page, limit, sortBy, sortOrder = 'ASC', prefectures, searchTerm } = param;
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    if (sortBy) {
        params.set('sortBy', sortBy.toString());
        params.set('sortOrder', sortOrder.toString());
    }
    if (prefectures) {
        params.set('prefectures', prefectures.toString());
    }
    if (searchTerm) {
        params.set('searchTerm', searchTerm.toString());
    }
    const response = await api.get(`/job-seekers?${params.toString()}`);
    return response.data;
};

export const deleteJobSeekerById = async (id: number) => {
    const response = await api.delete(`/job-seekers/${id}`);
    return response.data;
};

export const updateJobSeekerById = async ({ id, param }: { id: number, param: any }) => {
    const response = await api.put(`/job-seekers/${id}`, param);
    return response.data;
};

export const deleteJobById = async (id: number) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
};

export const createNewJob = async ({ param, thumbnail, companyImages, staffImages }: { param: JobParam, thumbnail: File | string | null, companyImages: Array<File | string | null>, staffImages: Array<File | string | null> }) => {
    const formData = new FormData();
    Object.entries(param).map(([k, v]: [k: string, v: any]) => {
        const str = (typeof v === 'string') ? v : JSON.stringify(v);
        formData.append(k, str);
    })
    companyImages.forEach(i => {
        formData.append('introImages', i as string | Blob);
    })
    staffImages.forEach(i => {
        formData.append('staffImages', i as string | Blob);
    })
    formData.append('thumbnail', thumbnail as string | Blob);

    // Send with axios
    const response = await api.post('/jobs', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data;
};

export const updateJobById = async ({ id, param, thumbnail, companyImages, staffImages }: { id: number, param: JobParam, thumbnail: File | string | null, companyImages: Array<File | string | null>, staffImages: Array<File | string | null> }) => {
    const formData = new FormData();
    Object.entries(param).map(([k, v]: [k: string, v: any]) => {
        const str = (typeof v === 'string') ? v : JSON.stringify(v);
        formData.append(k, str);
    })
    companyImages.forEach(i => {
        formData.append('introImages', i as string | Blob);
    })
    staffImages.forEach(i => {
        formData.append('staffImages', i as string | Blob);
    })
    formData.append('thumbnail', thumbnail as string | Blob);

    // Send with axios
    const response = await api.put(`/jobs/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data;
};

// export const createApplication = async (param: ApplicationParam) => {
//     const response = await api.post('/applications', param);
//     console.log('------------', response.data)
//Application Mng
export const getApplicationsByRole = async (param: ApplicationFetchParam) => {
    const queryString = toQueryString(param);
    const response = await api.get(`/applications?${queryString}`);
    return response.data;
};

export const createApplication = async (param: { job_info_id: number, job_seeker_id: number }) => {
    const response = await api.post('/applications', param);
    return response.data;
};

// Update JobSeeker Profile
export const updateJobSeekerProfile = async (param: FormData) => {
    const response = await api.post('/auth/job-seeker/update', param, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// Update Employer Profile
export const updateEmployerProfile = async (param: FormData) => {
    const response = await api.post('/auth/employer/update', param, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// Get current user info
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const requestChangeEmail = async (newEmail: string) => {
    const response = await api.post('/auth/request-change-email', { newEmail });
    return response.data;
};

// Column related
export const getColumns = async (param: ColumnFetchParam = {}): Promise<ColumnResponse> => {
    const queryString = toQueryString(param);
    const response = await api.get(`/columns?${queryString}`);
    return response.data.data;
};

// Get columns for admin with publish status filter
export const getColumnsAdmin = async (param: ColumnFetchParam = {}): Promise<ColumnResponse> => {
    const queryString = toQueryString(param);
    const response = await api.get(`/columns/admin?${queryString}`);
    return response.data.data;
};

// Fetch a single column by id
export const getColumn = async (id: number): Promise<Column> => {
    const response = await api.get(`/columns/${id}`);
    return response.data.data;
};

// Fetch a single column by id for admin (includes draft status)
export const getColumnAdmin = async (id: number): Promise<Column> => {
    const response = await api.get(`/columns/admin/${id}`);
    return response.data.data;
};

// Create a new column
export const createColumn = async (formData: FormData): Promise<Column> => {
    const response = await api.post('/columns', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Update a column
export const updateColumn = async (id: number, formData: FormData): Promise<Column> => {
    const response = await api.put(`/columns/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Delete a column
export const deleteColumn = async (id: number): Promise<void> => {
    const response = await api.delete(`/columns/${id}`);
    return response.data;
};

// Fetch recommended columns
export const getRecommendedColumns = async () => {
    const response = await api.get('/columns/recommended');

    return response.data.recommended;
};

// Interview related
export const getInterviews = async (param: InterviewFetchParam = {}): Promise<InterviewResponse> => {
    const queryString = toQueryString(param);
    const response = await api.get(`/interviews?${queryString}`);
    return response.data.data;
};

export const getInterview = async (id: number): Promise<Interview> => {
    const response = await api.get(`/interviews/${id}`);
    return response.data.data;
};

export const createInterview = async (formData: FormData): Promise<Interview> => {
    const response = await api.post('/interviews', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const updateInterview = async (id: number, formData: FormData): Promise<Interview> => {
    const response = await api.put(`/interviews/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteInterview = async (id: number): Promise<void> => {
    const response = await api.delete(`/interviews/${id}`);
    return response.data;
};

export const getApplicantsByJobId = async (id: number) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
};

export const getChats = async () => {
    const response = await api.get(`/chats`);
    return response.data;
};

export const getChatById = async (id: number) => {
    const response = await api.get(`/chats/${id}`);
    return response.data;
};

export const readChatById = async (id: number) => {
    const response = await api.get(`/chats/mark/${id}`);
    return response.data;
};

export const uploadChatFile = async (formData: FormData) => {
    const response = await api.post('/chat-upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
}

export const submitCompanyApplication = async (param: CompanyApplicationParam) => {
    const response = await api.post("/company-applications", param);
    return response.data;
};

export const getCompanyApplications = async (param: AdminCriteriaFetchParam): Promise<CompanyApplicationResponse> => {
    const queryString = toQueryString(param);
    const response = await api.get(`/company-applications?${queryString}`);
    return response.data.data;
};

export const deleteCompanyApplication = async (id: number): Promise<void> => {
    await api.delete(`/company-applications/${id}`);
};

// Contact Inquiry APIs
export const getContacts = async (param: ContactFetchParam) => {
    const queryString = toQueryString(param);
    const response = await api.get(`/contacts?${queryString}`);
    return response.data;
};

export const submitContactInquiry = async (param: ContactInquiryParam) => {
    const response = await api.post('/contacts', param);
    return response.data;
};

export const addCareerInquiry = async (param: CareerConsultationParam) => {
    const response = await api.post('/career-consultations', param);
    return response.data;
};

export const deleteContactInquiry = async (id: number) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
};

export const getCareerConsultations = async (param: AdminCriteriaFetchParam) => {
    const queryString = toQueryString(param);
    const response = await api.get(`/career-consultations?${queryString}`);
    return response.data;
};

export const deleteCareerConsultation = async (id: number) => {
    const response = await api.delete(`/career-consultations/${id}`);
    return response.data;
};