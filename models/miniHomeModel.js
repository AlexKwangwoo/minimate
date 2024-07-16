const mongoose = require('mongoose');

const miniHomeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User must belong to a miniHome']
    },
    url: {
      type: String,
      required: [true, 'Please provide url'],
      unique: true,
      lowercase: true //convert them to lowercase
    },

    background_color: {
      type: String,
      default: '#afcfd8'
    },

    menu_box_color: {
      type: String,
      default: '#268db2'
    },

    // domain_photo_folders: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'PhotoFolder'
    //   }
    // ],

    banner_photo: {
      type: String,
      default: null
    },

    banner_text_history: [
      {
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
    ],

    best_friend_comment: [
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
    ],

    main_text: {
      type: String,
      default: 'Welcome To My MiniHome'
    },

    main_background_img: {
      type: String,
      default: null
    },

    sub_img: [
      {
        img_url: {
          type: String,
          default: null
        },
        x_location: {
          type: String,
          default: null
        },
        y_location: {
          type: String,
          default: null
        },
        enable: {
          type: Boolean,
          default: true
        }
      }
    ]

    // role: {
    //   type: String,
    //   enum: ['user', 'admin'],
    //   default: 'user'
    // },
  },
  { timestamps: true }
);

//유저가 저장하기전에 이게 먼저 실행될것임
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// // not .insertMany XXXXXX
// userSchema.pre('save', async function(next) {
//   console.log('check 11111');
//   // Only run this function if password was actually modified
//   if (!this.isModified('password')) return next();

//   // Hash the password with cost of 12
//   this.password = await bcrypt.hash(this.password, 12);

//   // Delete passwordConfirm field // no need for db, just need field 즉 필드만 있고 값은 없어도됨
//   this.passwordConfirm = undefined;
//   next();
// });

// userSchema.pre('save', function(next) {
//   console.log('check 222222');

//   //isNew 는 바로 document 데이터가 생성된지 확인...
//   // 이건 페스워드 바꾸는거 관련 또는 새로운데이터가 만들어진게 아니면 next!
//   // 즉 처음만들어진 유저는 passwordChangedAt이 없을것임!
//   if (!this.isModified('password') || this.isNew) return next();

//   // 위에 조건이 아닐경우 페스워드changedAt을 변경한다!
//   // 시간 차이를 좀더 빠르게 만드는걸로 해줘야 웹토큰이 뒤에 만들어진거라 생각가능... 웹토큰이 changedpw보다 빠르면
//   // 우리는 에러를 낼것임 // 즉 비번바꼈으니 새로운 웹토큰을 가져라.. 그토큰은 이시간보다 나중일것임!
//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

// ^find -=> find로 시작하는 메소드를 받는다면 실행
// userSchema.pre(/^find/, function(next) {
//   //유저찾을때 active가 not equal인걸로 받을것임!
//   // 미리 생성된 유저들중 active 필드가 없는곳이 있을것이므로
//   // equal === true /{active:true} 하는게 아니라 active !== false 를 찾을것임!
//   // this points to the current query

//   // .find({ active: { $ne: false } })
//   console.log('comecomecome');
//   this.populate({
//     path: 'best_friends',
//     select: 'friend friend_nick_name my_nick_name', //-를붙이고 owner 안해주면 계속 방이유저찾고 유저가 방찾고 무한루프돌게됨!
//     // populate: [
//     //   // {
//     //   //   path: 'room',
//     //   //   model: 'Room',
//     //   //   select: ''
//     //   // },
//     //   {
//     //     path: 'friend',
//     //     model: 'User',
//     //     select: 'name'
//     //   }
//     // ],
//     options: {
//       limit: 6,
//       sort: { createdAt: -1 } //-1도됨 createdAt는 내가 입력한 model에서 가져오는것임
//       // skip: 0
//     }
//   });
//   next();
// });

// userSchema.methods.correctPassword = async function(
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

// userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     ); //2019-04-30T00:00:00.000z 를 15201233 iso or unix시간? 으로 바꿔줌

//     console.log('JWTTimestamp', JWTTimestamp);
//     console.log('changedTimestamp', changedTimestamp);
//     return JWTTimestamp < changedTimestamp;
//   }

//   // False means NOT changed
//   return false;
// };

// userSchema.methods.createPasswordResetToken = function() {
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   //  해쉬한값을 데이터베이스에 넣을거고 resetPassword 사용할때 param으로 해쉬안된 토큰정보를 가져와서
//   // 다시 해쉬해 데이터베이스에 저장된 유저 토큰과 같을시 유효날짜 한번더 확인할것임!
//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   // token을 바로 유저에 저장안하고.. 다시 암호화해서 저장한다
//   console.log({ resetToken }, this.passwordResetToken);

//   // 10 mins 유효시간도 저장! -> save는 여기 구문을 빠져나와 부모로직에서 user.save를 해줄것임
//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };

const MiniHome = mongoose.model('MiniHome', miniHomeSchema);

module.exports = MiniHome;
