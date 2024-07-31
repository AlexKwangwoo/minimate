const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User must belong to a cart']
    },
    shop_items: [
      {
        type: {
          type: String
        },

        item_name: {
          type: String,
          required: [true, 'Provide name!'],
          maxlength: [40, 'Name must have less or equal then 40 characters']
        },

        item_img: {
          type: String,
          default: null
        },

        item_price: {
          type: Number,
          min: 0,
          required: [true, 'Provide price!']
        },

        category: {
          type: String
          // required: [true, 'Category must belong to a shop item']
        }
      }
    ],
    total_price: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    total_qty: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

historySchema.pre(/^find/, function(next) {
  // user 만 쓰면 전체다 나오는거 / path 주면 select 까지 선택가능! boooking 참고!
  this.populate({ path: 'user', select: 'username id' });
  // .populate({ // object 자체를 저장했기에 이부분 필요없음!
  //   path: 'shop_items',
  //   select: 'item_name item_img id'
  // });

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

const History = mongoose.model('History', historySchema);

module.exports = History;
