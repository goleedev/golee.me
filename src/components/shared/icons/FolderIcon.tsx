type FolderIconProps = {
  size?: number;
};

const FolderIcon = ({ size = 36 }: FolderIconProps) => {
  return (
    <div className="flex flex-col items-center justify-center drop-shadow-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={`${size}px`}
        height={`${size}px`}
        viewBox="20 30 120 100" // 폴더 부분만 크롭하여 빈 공간 제거
        role="img"
        aria-labelledby="title"
        aria-describedby="desc"
      >
        <title id="title">Folder</title>
        <desc id="desc">An empty blue folder with a tab on the top left</desc>
        <path
          fill="#99e7ff"
          d="M133,125H27c-1.6999969,0-3-1.2999878-3-3V38c0-1.7000122,1.3000031-3,3-3h26.3000031
          C54.4000092,35,55.5,35.6000061,56,36.7000122l3.3000031,6.7000122c0.5,1,1.5,1.7000122,2.6999969,1.7000122h71
          c1.6999969,0,3,1.2999878,3,3v74C136,123.7000122,134.6999969,125,133,125z"
        />
        <path
          fill="#6dd3f2"
          d="M133,125H27c-1.6999969,0-3-1.2999878-3-3V56c0-1.7000122,1.3000031-3,3-3h106c1.6999969,0,3,1.2999878,3,3
          v66C136,123.7000122,134.6999969,125,133,125z"
        />
        <rect x="24" y="116" fill="#78dfff" width="112" height="1" />
        <rect x="24" y="118" fill="#67c7e5" width="112" height="1" />
        <rect x="24" y="119" fill="#78dfff" width="112" height="1" />
        <rect x="24" y="121" fill="#67c7e5" width="112" height="1" />
      </svg>
    </div>
  );
};

export default FolderIcon;
