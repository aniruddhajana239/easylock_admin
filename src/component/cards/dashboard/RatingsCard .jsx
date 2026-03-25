// RatingsCard.js

const RatingsCard = () => {
  return (
    <div className="bg-white   p-4 w-full ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700  font-semibold">
          Recent Users
        </h3>
        <button className="text-gray-400 ">⋮</button>
      </div>
      <div className="text-center mb-4">
        <span className="text-4xl font-semibold text-gray-800">
          4.7
        </span>
        <span className="text-gray-500">/5</span>
      </div>
      <div className="flex justify-center mb-4 text-yellow-400 ">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-2xl ${
              i < 4 ? "fill-current" : "text-gray-300 "
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <div>
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <div
            key={index}
            className="flex items-center justify-between mb-2 text-gray-600 "
          >
            <div className="flex items-center">
              <span className="text-sm font-medium">{rating}</span>
              <span className="ml-1 text-yellow-400 ">
                ★
              </span>
            </div>
            <div className="flex-grow mx-3 h-2 bg-gray-200  rounded-full">
              <div
                className={`h-full bg-blue-500  rounded-full`}
                style={{ width: `${(rating / 5) * 100}%` }}
              />
            </div>
            <span className="text-sm">
              {rating === 5
                ? 384
                : rating === 4
                ? 145
                : rating === 3
                ? 24
                : rating === 2
                ? 1
                : 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsCard;
