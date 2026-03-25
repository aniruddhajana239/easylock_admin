const SalesCard = ({
  title,
  amount,
  description,
  bgColor,
  titleColor = "text-gray-800",
  bgImg,
}) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-xl ${bgColor} text-gray-800  flex flex-col justify-between`}
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundPosition: "top right",
        backgroundRepeat: "no-repeat",
        top: "10px",
        right: "10px",
      }}
    >
      <div>
        <h4 className={`text-md font-medium ${titleColor}`}>{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
        <div className="flex space-x-2 items-center">
          <p className={`text-xl font-semibold my-2 ${titleColor}`}>{amount}</p>
         
        </div>
      </div>

      {/* <div className="w-full h-2 rounded-full mt-4">
        <LinearProgress
          determinate
          size="md"
          variant="solid"
          value={value}
          color={color}
        />
      </div> */}
    </div>
  );
};

export default SalesCard;