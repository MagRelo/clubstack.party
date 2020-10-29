const mongoose = require('mongoose');
const nanoid = require('nanoid');

//
// User
//
const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: () => nanoid(),
    },
    displayName: String,
    caption: String,
    avatar: String,
    type: {
      type: String,
      enum: ['Standard', 'Admin', 'Closed'],
      default: 'Standard',
    },
    status: {
      type: String,
      enum: ['Pending', 'NewSubscriber', 'Active', 'Closed'],
      default: 'Pending',
    },

    needsOnboarding: {
      type: Boolean,
      default: true,
    },

    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },

    issuer: Object,
    email: String,
    lastLoginAt: String,
    publicAddress: String,

    stripeCustomerId: String,
    stripeEvents: [Object],

    rocketUserId: String,
    rocketUser: Object,

    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    follows: { type: Array, default: [] },
  },
  { timestamps: true }
);

exports.UserModel = mongoose.model('User', UserSchema);

//
// Events
//
const EventSchema = new mongoose.Schema(
  { event: Object },
  { timestamps: true }
);
exports.EventModel = mongoose.model('Event', EventSchema);

//
// Group
//
const GroupSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subdomain: String,
    productCode: String,

    subdomainData: Object,

    rocketGroupId: String,
    rocketGroup: Object,
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    waitlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);
exports.GroupModel = mongoose.model('Group', GroupSchema);

//
// Content
//

const ContentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['Text', 'Video', 'Podcast'],
      default: 'Text',
    },
    title: String,
    length: String,
    description: String,
    image: String,
    alt: String,
    category: String,
    renderedHtml: String,
    rawState: Object,
  },
  { timestamps: true }
);
exports.ContentModel = mongoose.model('ContentItem', ContentSchema);

// prop
// const Position = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     type: {
//       type: String,
//       enum: ['Standard', 'Admin', 'Closed'],
//       default: 'Standard',
//     },
//     status: {
//       type: String,
//       enum: ['Pending', 'Approved', 'Closed'],
//       default: 'Pending',
//     },
//     title: String,
//     amount: String,
//     direction: String,
//     length: String,
//     leverage: String,
//     rawState: Object,
//     renderedHtml: String,
//   },
//   { timestamps: true }
// );
// exports.PositionModel = mongoose.model('Position', Position);

//
// Give/Get
//

// const PersonSchema = new mongoose.Schema(
//   {
//     personId: {
//       type: String,
//       default: () => nanoid(),
//     },
//     firstname: String,
//     lastname: String,
//     avatar: String,
//     displayName: String,
//     email: String,
//     phone: String,
//     placeId: String,
//     address: String,
//     location: {
//       type: {
//         type: String,
//         enum: ['Point'],
//         required: true,
//       },
//       coordinates: {
//         type: [Number],
//         required: true,
//       },
//     },
//     help_grocery: { type: Boolean, default: false },
//     help_wellness: { type: Boolean, default: false },
//     help_childcare: { type: Boolean, default: false },
//     help_homeshool: { type: Boolean, default: false },
//     help_food: { type: Boolean, default: false },
//     help_housing: { type: Boolean, default: false },
//     help_transportation: { type: Boolean, default: false },
//     needsHelp: { type: Boolean, default: false },
//     offeringHelp: { type: Boolean, default: false },
//     welcomeEmail: Object,
//     isMatched: { type: Boolean, default: false },
//     matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
//     follows: { type: Array, default: [], select: false },
//   },
//   { timestamps: true }
// );

// PersonSchema.index({ location: '2dsphere' });
// exports.PersonModel = mongoose.model('Person', PersonSchema);

// //
// // Link
// //
// const LinkSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     parentLink: { type: mongoose.Schema.Types.ObjectId, ref: 'Link' },
//     originLink: { type: mongoose.Schema.Types.ObjectId, ref: 'Link' },
//     parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }],
//     children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }],
//     linkId: {
//       type: String,
//       default: () => nanoid()
//     },
//     generation: {
//       type: Number,
//       default: 0
//     },
//     isBuried: {
//       type: Boolean,
//       default: false
//     },
//     total_bonus: Number,
//     target_bonus: Number,
//     network_bonus: Number,
//     payoffs: [],
//     potentialPayoffs: [],
//     payment: Object,

//     title: String,
//     type: String,
//     data: Object,

//     responses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }],

//     status: {
//       type: String,
//       enum: ['Active', 'Pending', 'Closed'],
//       default: 'Active'
//     }
//   },
//   { timestamps: true }
// );

// // LinkSchema.index({ title: 'text' });

// exports.LinkModel = mongoose.model('Link', LinkSchema);

// //
// // Response
// //
// const ResponseSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     link: { type: mongoose.Schema.Types.ObjectId, ref: 'Link' },
//     originLink: { type: mongoose.Schema.Types.ObjectId, ref: 'Link' },
//     parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }],
//     message: String,

//     target_bonus: Number,
//     targetPayouts: [],
//     network_bonus: Number,
//     networkPayouts: [],

//     payment: Object,
//     status: {
//       type: String,
//       enum: ['Applied', 'Submitted', 'Closed'],
//       default: 'Applied'
//     },
//     applyDate: Date,
//     submitDate: Date,
//     closeDate: Date
//   },
//   { timestamps: true }
// );
// exports.ResponseModel = mongoose.model('Response', ResponseSchema);

// //
// // Payment
// //
// const PaymentSchema = new mongoose.Schema(
//   {
//     link: { type: mongoose.Schema.Types.ObjectId, ref: 'Link' },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     response: { type: mongoose.Schema.Types.ObjectId, ref: 'Response' },
//     amount: {
//       type: Number,
//       default: 0
//     },
//     stripeData: Object,
//     stripeResponse: Object,
//     status: {
//       type: String,
//       enum: ['created', 'pending', 'closed'],
//       default: 'created'
//     },
//     isPaid: {
//       type: Boolean,
//       default: false
//     },
//     isInError: {
//       type: Boolean,
//       default: false
//     }
//   },
//   { timestamps: true }
// );
// exports.PaymentModel = mongoose.model('Payment', PaymentSchema);

// //
// // Share
// //
// const ShareSchema = new mongoose.Schema(
//   {
//     link: { type: mongoose.Schema.Types.ObjectId, ref: 'Link' },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     type: 'String',
//     data: Object
//   },
//   { timestamps: true }
// );
// exports.ShareModel = mongoose.model('Share', ShareSchema);

// const Signup = new mongoose.Schema(
//   {
//     source: String,
//     email: String
//   },
//   { timestamps: true }
// );
// exports.SignupModel = mongoose.model('Signup', Signup);
