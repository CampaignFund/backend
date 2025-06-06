
const createPayload = (user) =>  {
 return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isApproved: user.isApproved,
  };
}
module.exports = createPayload
