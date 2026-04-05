/* eslint-disable react/prop-types */
const UserProfile = ({ name, bidStats }) => {
  return (
    <div className="w-full md:w-1/4 p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
          <div className="mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Bids Received</p>
              <p className="text-2xl font-bold text-indigo-600">
                {bidStats?.bidsReceived || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;



