import type { SearchResultDto } from "@reactive-resume/dto";
import React from "react";

interface SearchResultItemProps {
  item: SearchResultDto;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item }) => {
  return (
    <div className="relative h-[61px] w-[592px] overflow-hidden rounded-[23px] bg-[#eff3ff] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="absolute left-[8px] top-[5px] h-[50px] w-[51px]">
        <div className="absolute left-0 top-0 h-[50px] w-[51px] rounded-full bg-[#d9d9d9]" />
        <img
          className="absolute left-[-51px] top-0 h-[104px] w-[121px]"
          src={
            item.picture ||
            "https://img.freepik.com/premium-vector/profile-icon-vector-illustration-design-template_827767-5831.jpg?w=740"
          }
          alt={item.name}
        />
      </div>
      <div className="absolute left-[96.03px] top-0 w-[348.95px] font-['Poppins'] text-xl font-normal text-black">
        {item.name}
      </div>
      <div data-svg-wrapper className="absolute left-[418px] top-[11px]">
        <svg
          width="52"
          height="42"
          viewBox="0 0 52 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.7778 10.4286L22.6358 17.0175L22.6394 17.0199C23.8451 17.7304 24.4482 18.0859 25.1089 18.2232C25.6929 18.3445 26.3067 18.3445 26.8906 18.2232C27.5519 18.0857 28.1568 17.7292 29.3646 17.0175C29.3646 17.0175 36.329 12.7228 40.2222 10.4286M10 24.4289V13.5717C10 11.9716 10 11.1709 10.3875 10.5597C10.7284 10.0221 11.272 9.58533 11.941 9.31141C12.7015 9 13.6979 9 15.6892 9H36.3115C38.3028 9 39.297 9 40.0576 9.31141C40.7266 9.58533 41.272 10.0221 41.6128 10.5597C42 11.1703 42 11.97 42 13.567V24.4337C42 26.0307 42 26.8293 41.6128 27.4398C41.272 27.9774 40.7266 28.415 40.0576 28.6889C39.2978 29 38.304 29 36.3166 29H15.6834C13.696 29 12.7008 29 11.941 28.6889C11.272 28.415 10.7284 27.9774 10.3875 27.4398C10 26.8287 10 26.029 10 24.4289Z"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div data-svg-wrapper className="absolute left-[485px] top-[11px]">
        <svg
          width="35"
          height="35"
          viewBox="0 0 35 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.7778 18H19M19 18H25.2222M19 18V24.2222M19 18V11.7778M19 32C11.268 32 5 25.732 5 18C5 10.268 11.268 4 19 4C26.732 4 33 10.268 33 18C33 25.732 26.732 32 19 32Z"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div data-svg-wrapper className="absolute left-[526px] top-[4px]">
        <svg
          width="53"
          height="53"
          viewBox="0 0 53 53"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.8125 19.6667H19.0003C17.2501 19.6667 16.3744 19.6667 15.7059 20.0179C15.1179 20.3268 14.6402 20.8194 14.3406 21.4257C14 22.1149 14 23.0179 14 24.8225V33.8448C14 35.6494 14 36.5512 14.3406 37.2405C14.6402 37.8468 15.1179 38.3402 15.7059 38.6491C16.3738 39 17.2484 39 18.9952 39L34.0048 39C35.7516 39 36.625 39 37.2928 38.6491C37.8808 38.3402 38.3601 37.8468 38.6597 37.2405C39 36.5519 39 35.6513 39 33.8502V24.8172C39 23.0162 39 22.1143 38.6597 21.4257C38.3601 20.8194 37.8808 20.3268 37.2928 20.0179C36.6243 19.6667 35.7505 19.6667 34.0003 19.6667H21.8125ZM21.8125 19.6667V15.0269C21.8125 12.2507 23.8438 10 26.3495 10C27.637 10 28.7981 10.5942 29.6239 11.5485"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="absolute left-[98px] top-[34px] h-[22px] w-[177px] font-['Poppins'] text-base font-normal text-black/90">
        {item.username}
      </div>
    </div>
  );
};

export default SearchResultItem;
