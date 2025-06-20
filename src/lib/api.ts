import { RegisterEmployerParam, RegisterJobSeekerParam, LoginParam, JobParam, RecruitingCriteria, AdminCriteriaFetchParam, BookmarkJobParam, CreateUpdateCriteriaFetchParam, ApplicationFetchParam } from "@/utils/types";
import api from './axios';
import { toQueryString } from "@/utils/helper";

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

//Favourite related
export const getBookmarkedJobs = async () => {
    const response = await api.get(`/jobs/favourites`);
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
    searchTerm: string,
    jobType?: number,
    companyID?: number,
    features?: string[],
    prefectures?: string[]
) => {
    const param: Record<string, any> = { page, limit, searchTerm, jobType };
    if (companyID && companyID > 0) {
        param.companyID = companyID;
    }
    if (features?.length && features?.length > 0) {
        param.features = features;
    }
    if (prefectures?.length && prefectures?.length > 0) {
        param.prefectures = prefectures;
    }
    const queryString = toQueryString(param);
    const response = await api.get(`/jobs?${queryString}`);
    return response.data;
};

export const getJobById = async (id: number) => {
    const response = await api.get(`/jobs/${id}`);
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

//Application Mng
export const getApplicationsByRole = async (param: ApplicationFetchParam) => {
    const queryString = toQueryString(param);
    const response = await api.get(`/applications?${queryString}`);
    return response.data;
};