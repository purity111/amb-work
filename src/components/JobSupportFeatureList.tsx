import React from "react";
import { JobSupportFeatures } from "@/utils/constants";

const JobSupportFeatureList: React.FC = () => (
  <div className="space-y-2">
    {JobSupportFeatures.map((item) => (
      <div key={item.number} className="flex items-center font-semibold space-x-2 pb-5 mb-5 border-b border-[#dfdfdf]">
        <span className="text-[#65B729] text-[30px] font-bold min-w-[2.5em]">{item.number}</span>
        <span className="text-[18px]">{item.text}</span>
      </div>
    ))}
    <p className="flex items-center font-semibold space-x-2 pb-5 mb-5 border-b border-[#dfdfdf]">※転職支援サービスにおける特徴となります</p>
  </div>
);

export default JobSupportFeatureList;
