import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAndProducts } from "../store/auction/auctionSlice";
import Card from "../components/Card";
import Skeleton from "../components/Skeleton";
import UserProfile from "../components/UserProfile";
import { useParams } from "react-router-dom";

const MyAuction = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { userData, userProducts, loading, error } = useSelector(
    (state) => state.auctions
  );

  useEffect(() => {
    dispatch(fetchUserAndProducts(userId));
  }, [dispatch, userId]);

  if (loading) return (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  );
  
  if (error) return (
    <div>
      <p>Error: {error.message}</p>
    </div>
  );

  // Add console log to debug the data
  console.log('User Data:', userData);

  return (
    <div className="min-h-[calc(100svh-9rem)] px-4 py-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* User Profile with bid stats */}
        <UserProfile 
          name={userData?.name} 
          bidStats={{
            bidsMade: userData?.bidStats?.bidsMade || 0,
            bidsReceived: userData?.bidStats?.bidsReceived || 0
          }}
        />

        {/* Products list */}
        <div className="w-full md:w-3/4">
          {userProducts && userProducts.length > 0 ? (
            userProducts.map((auction) => (
              <Card
                key={auction._id}
                auction_id={auction._id}
                item_id={auction.seller._id}
                itemName={auction.itemName}
                itemDescription={auction.itemDescription}
                itemPrice={auction.itemPrice}
                itemPostDate={auction.createdAt}
                itemStartDate={auction.itemStartDate}
                itemEndDate={auction.itemEndDate}
                itemPhoto={auction.itemPhoto}
                sellerName={auction.seller.name}
              />
            ))
          ) : (
            <div className="text-center">No auctions found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAuction;

