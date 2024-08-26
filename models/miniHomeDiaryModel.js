const mongoose = require('mongoose');

const miniHomeDiarySchema = new mongoose.Schema(
  {
    diary_title: {
      type: String,
      required: [true, 'Provide photo title!'],
      maxlength: [20, 'Title must have less or equal then 20 characters']
    },

    diary_folder_id: {
      type: String,
      required: [true, 'Provide folder id!']
    },

    diary_privacy_scope: {
      type: String,
      defualt: 'public'
    },

    content: {
      type: String,
      maxlength: [3000, 'Content must have less or equal then 3000 characters']
    },

    date: {
      type: String,
      required: true
    },

    comment: [
      {
        friendId: {
          type: String,
          default: null,
          required: [true, 'Please provide friend id']
        },
        friend_name: {
          type: String,
          default: null,
          required: [true, 'Please provide friend_name']
        },
        friend_nick_name: {
          type: String,
          default: null,
          required: [true, 'Please provide friend_nick_name']
        },
        text: {
          type: String,
          default: null,
          required: [true, 'Please provide text']
        },
        createdAt: {
          type: Date,
          default: Date.now()
        },
        updatedAt: { type: Date, default: Date.now() }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// 이건 자식이 포린키를 가지고있고 부모가 아무정보도 없을때.. 리뷰를 생각해보면 1000만개가 부모가 저장하기힘듬
// 그래서 리뷰 자체에 부모키를 넣고 이렇게 불러올수있는것임!
// shopItemSchema.virtual('category', {
//   ref: 'Category', //본채의 아이디를 const reviewRoom = mongoose.model('ReviewRoom', reviewRoomSchema);
//   foreignField: 'category', // 넣어줄곳
//   localField: '_id'
// });
// miniHomePhotoSchema.pre(/^find/, function(next) {
// user 만 쓰면 전체다 나오는거 / path 주면 select 까지 선택가능! boooking 참고!
// this.populate({ path: 'category', select: 'name' });
// .populate({ path: 'amenities', select: 'name' })
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
//   next();
// });

const MiniHomeDiary = mongoose.model('MiniHomeDiary', miniHomeDiarySchema);

module.exports = MiniHomeDiary;
