import React from 'react';
import Image from 'next/image';

interface JobDetail {
    title: string;
    location: string;
    description: string;
    requiredSkills: string[];
    articleLink?: { text: string; href: string };
}

interface JobCategory {
    id: number;
    title: string;
    description: string;
    image?: string;
    jobs?: JobDetail[];
    subCategories?: string[];
    link?: { text: string; href: string };
}

interface JobCategorySectionProps {
    category: JobCategory;
}

const JobCategorySection: React.FC<JobCategorySectionProps> = ({ category }) => {
    // Determine if the category is the '本部部門' which has subcategories instead of job details
    const isHeadOfficeCategory = category.id === 5;

    return (
        <div className="pb-10 md:pb-20">
            {/* Image */}
            {category.image && (
                <div className="flex justify-center">
                    <Image
                        src={category.image}
                        alt={category.title}
                        width={600}
                        height={400}
                        objectFit="cover"
                        className="rounded-md"
                    />
                </div>
            )}

            {/* Category Number and Title Section */}
            <div className="flex flex-col items-center my-10">
                <div className="flex items-center mb-2">
                    <div className="h-px bg-green-600 w-4 mr-2"></div> {/* Left line */}
                    <div className="text-[24px] md:text-[30px] font-bold text-green-600">{`0${category.id}`}</div>
                    <div className="h-px bg-green-600 w-4 ml-2"></div> {/* Right line */}
                </div>
                <h3 className="text-3xl font-medium text-gray-900 text-center">{category.title}</h3>
            </div>

            {/* White Card with Content */}
            <div className="bg-white rounded-lg overflow-hidden">
                {/* Job Details Table (for categories with jobs) */}
                {!isHeadOfficeCategory && category.jobs && category.jobs.length > 0 && (
                    <div className="">
                        {category.jobs.map((job, index) => (
                            <React.Fragment key={index}>
                                {/* Job Title Row */}
                                <div className='border border-gray-700'>
                                    <div className="grid grid-cols-[120px_1fr] md:grid-cols-[200px_1fr] font-light">
                                        <div className="font-light text-gray-900 bg-gray-800 p-4 flex items-center">職種名</div>
                                        <div className="p-4 flex items-center border-l border-gray-700">{job.title}</div>
                                    </div>

                                    {/* Location Row */}
                                    <div className="grid grid-cols-[120px_1fr] md:grid-cols-[200px_1fr] font-light border-t border-gray-700">
                                        <div className="font-light text-gray-900 bg-gray-800 p-4 flex items-center">勤務場所</div>
                                        <div className="p-4 flex items-center border-l border-gray-700">{job.location}</div>
                                    </div>

                                    {/* Description Row */}
                                    <div className="grid grid-cols-[120px_1fr] md:grid-cols-[200px_1fr] font-light border-t border-gray-700">
                                        <div className="font-light text-gray-900 bg-gray-800 p-4 flex items-center">仕事内容</div>
                                        <div className="p-4 border-l border-gray-700">{job.description}</div>
                                    </div>

                                    {/* Required Skills Row */}
                                    <div className="grid grid-cols-[120px_1fr] md:grid-cols-[200px_1fr] font-light border-t border-gray-700">
                                        <div className="font-light text-gray-900 bg-gray-800 p-4 flex items-center">必要な知識やスキル</div>
                                        <div className="p-4 border-l border-gray-700">
                                            <ul className="list-disc list-inside space-y-1">
                                                {job.requiredSkills.map((skill, skillIndex) => (
                                                    <li key={skillIndex}>{skill}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Article Link Row */}
                                {job.articleLink && (
                                    <div className="col-span-2 px-4 py-3">
                                        <p className="mb-2 text-left text-sm">こちらの記事も参考にしてみてください！</p>
                                        <a href={job.articleLink.href} className="text-green-600 hover:underline flex items-center text-base">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 fill-current text-green-600" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {job.articleLink.text}
                                        </a>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {/* Sub-categories for 本部部門 */}
                {isHeadOfficeCategory && category.subCategories && category.subCategories.length > 0 && (
                    <div>
                        <p className="font-medium text-gray-900 mb-2 text-center font-light">{category.description}</p>
                        <div className="space-y-4 p-6">
                            <div className="space-y-2">
                                {category.subCategories.map((subCat, index) => (
                                    <div key={index} className="flex items-center gap-2 border-b border-gray-700 mb-5">
                                        <div className="text-[30px] font-bold text-[#65B729] mr-2">{`0${index + 1}.`}</div>
                                        <div className="text-[14px] text-base">{subCat}</div>
                                    </div>
                                ))}
                            </div>
                            <p className='text-center text-[14px] md:text-base pt-10'>リユース・リサイクル・買取業界のミドル・ハイクラス転職もリユース転職！</p>
                            {category.link && (
                                <div className="mt-6 text-center lg:text-left flex">
                                    <a
                                        href={category.link.href}
                                        className="m-auto inline-block bg-[#3598c4] text-white px-7 py-4 rounded-lg font-medium hover:opacity-80 transition-colors"
                                    >
                                        {category.link.text}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default JobCategorySection; 