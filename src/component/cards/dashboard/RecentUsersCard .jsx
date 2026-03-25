// RecentUsersCard.js

const users = [
  {
    name: "Quinn Flynn",
    role: "Android developer",
    status: "yellow",
    date: "11 May 12:30",
  },
  {
    name: "Garrett Winters",
    role: "Android developer",
    status: "green",
    date: "11 May 12:30",
  },
  {
    name: "Ashton Cox",
    role: "Android developer",
    status: "blue",
    date: "11 May 12:30",
  },
  {
    name: "Cedric Kelly",
    role: "Android developer",
    status: "red",
    date: "11 May 12:30",
  },
];

const RecentUsersCard = () => {
  return (
    <div className="bg-white  p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700  font-semibold">
          Recent Users
        </h3>
        <button className="text-gray-400 ">
          ⋮
        </button>
      </div>
      <ul>
        {users.map((user, index) => (
          <li key={index} className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200  flex items-center justify-center mr-3">
                <img
                  src={`https://randomuser.me/api/portraits/men/${
                    index + 10
                  }.jpg`}
                  alt={user.name}
                  className="rounded-full"
                />
              </div>
              <div>
                <p className="text-gray-800  font-medium">
                  {user.name}
                </p>
                <p className="text-gray-500  text-sm">
                  {user.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full bg-${user.status}-500 `}
                title={user.date}
              ></span>
              <button className="w-8 h-8 bg-red-100  rounded-full flex items-center justify-center text-red-500">
                ✗
              </button>
              <button className="w-8 h-8 bg-green-100   rounded-full flex items-center justify-center text-green-500">
                ✓
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUsersCard;
