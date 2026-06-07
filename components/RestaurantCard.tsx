export function RestaurantCard({
  name,
  image,
  horizontal,
}: any) {
  return (
    <div className="bg-white rounded-xl p-3 shadow">
      <img src={image} className="w-full h-24 object-cover rounded-lg" />
      <p className="mt-2 font-semibold">{name}</p>
    </div>
  );
}