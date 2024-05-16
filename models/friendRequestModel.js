const mongoose = require('mongoose');

// save 한다 user에 일촌리스트 거기에 유저아이디 유저월래 이름 그리고 닉네임!
// 일촌평볼때 저걸 함께 저장한다, 일촌 글, 일촌 이름, 월래이름, 유저아이디, 일촌평 아이디
const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User must belong to a cart']
    },

    sender_nick_name: {
      type: String,
      required: [true, 'sender nick name is required']
    },

    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User must belong to a cart']
    },

    receiver_nick_name: {
      type: String,
      required: [true, 'sender nick name is required']
    },

    content: {
      type: String
    },

    status: {
      type: String,
      default: 'pending'
    }
  },
  { timestamps: true }
);

friendRequestSchema.pre(/^find/, function(next) {
  // user 만 쓰면 전체다 나오는거 / path 주면 select 까지 선택가능! boooking 참고!
  this.populate({ path: 'sender', select: 'username id' }).populate({
    path: 'receiver',
    select: 'username id'
  });
  // .populate({
  //   // 이렇게하면 투어에서 리뷰를 볼떄 또 투어를 넣어줄것임... 그래서 밑에서 투어없이 해봄
  //   //durationWeeks 도 보이는데 이는 가상 결과라 나옴 db에서오는게아님
  //   path: 'owner',
  //   select: 'name -wishlist profile_img total_review' //-를붙이고 guides 필드에 __v passwordChangedAt을 안보이게 한다
  // }); //영상에서는 populate tour는 안썼음.. 그래서 바로 tour에 id가 들어가서 밑에 post에서 tour <-자리에 id가 있는것임

  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   // 이렇게하면 투어에서 리뷰를 볼떄 또 투어를 넣어줄것임... 그래서 밑에서 투어없이 해봄
  //   //durationWeeks 도 보이는데 이는 가상 결과라 나옴 db에서오는게아님
  //   path: 'user',
  //   select: '-__v -passwordChangedAt' //-를붙이고 guides 필드에 __v passwordChangedAt을 안보이게 한다
  // });

  // this.populate({
  //   // 이렇게하면 투어에서 리뷰를 볼떄 또 투어를 넣어줄것임... 그래서 밑에서 투어없이 해봄
  //   //durationWeeks 도 보이는데 이는 가상 결과라 나옴 db에서오는게아님
  //   path: 'user',
  //   select: '-__v -passwordChangedAt' //-를붙이고 guides 필드에 __v passwordChangedAt을 안보이게 한다
  // });
  next();
});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
