import Skeleton from "react-loading-skeleton";

const SkeletonLoader = () => {
  return (
    <div className="py-4 mx-10 my-10">
      <Skeleton count={4} height={150} width={293} className="mx-1"/>
    </div>
  );
};

export default SkeletonLoader;
