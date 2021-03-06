import { readFileSync } from 'fs'
import { PubSub } from 'graphql-yoga'
import Redis from 'ioredis'
import path from 'path'
import { check } from '../../../common/src/util'
import { Comment } from '../entities/Comment'
import { Listing } from '../entities/Listing'
import { Survey } from '../entities/Survey'
import { SurveyAnswer } from '../entities/SurveyAnswer'
import { SurveyQuestion } from '../entities/SurveyQuestion'
import { Tag } from '../entities/Tag'
import { User } from '../entities/User'
import { Resolvers } from './schema.types'

export const pubsub = new PubSub()
export const redis = new Redis()

export function getSchema() {
  const schema = readFileSync(path.join(__dirname, 'schema.graphql'))
  return schema.toString()
}

interface Context {
  user: User | null
  request: Request
  response: Response
  pubsub: PubSub
  redis: Redis.Redis
}

export const graphqlRoot: Resolvers<Context> = {
  Query: {
    self2: (_, args, ctx) => ctx.user,
    self: async (_, { email }) => {
      const user = await User.findOne({ where: { email: email } })
      if (user) {
        return user
      }
      return null
    },
    user: async (_, { userId }) => (await User.findOne({ where: { id: userId } })) || null,
    survey: async (_, { surveyId }) => (await Survey.findOne({ where: { id: surveyId } })) || null,
    surveys: () => Survey.find(),
    listing: async (_, { listingId }) => {
      const l = await Listing.findOne({ where: { id: listingId } })
      if (l) {
        return l
      }
      return null
    },
    listings: () => Listing.find(),
    listingsPaginated: async (_, { input }) => {
      if (input == undefined || !input) return []
      const { offset, limit } = input
      let allListings = await Listing.find()
      let ret = []
      let i = 0
      if (limit)
        if (offset + limit > allListings.length) {
          return allListings
        }
      if (limit)
        for (; i < offset + limit; i++) {
          ret.push(allListings[i])
        }
      return ret
    },
    comments: () => Comment.find(),
  },
  Mutation: {
    answerSurvey: async (_, { input }, ctx) => {
      const { answer, questionId } = input
      const question = check(await SurveyQuestion.findOne({ where: { id: questionId }, relations: ['survey'] }))

      const surveyAnswer = new SurveyAnswer()
      surveyAnswer.question = question
      surveyAnswer.answer = answer
      await surveyAnswer.save()

      question.survey.currentQuestion?.answers.push(surveyAnswer)
      ctx.pubsub.publish('SURVEY_UPDATE_' + question.survey.id, question.survey)

      return true
    },
    nextSurveyQuestion: async (_, { surveyId }, ctx) => {
      // check(ctx.user?.userType === UserType.Admin)
      const survey = check(await Survey.findOne({ where: { id: surveyId } }))
      survey.currQuestion = survey.currQuestion == null ? 0 : survey.currQuestion + 1
      await survey.save()
      ctx.pubsub.publish('SURVEY_UPDATE_' + surveyId, survey)
      return survey
    },
    addListing: async (_, { listing }, ctx) => {
      if (listing !== undefined && listing !== null) {
        const { username, userId_ref, price, sellingName, startDate, endDate, location, description, image } = listing
        if (
          username !== undefined &&
          userId_ref !== undefined &&
          price !== undefined &&
          sellingName !== undefined &&
          startDate !== undefined &&
          endDate !== undefined &&
          location !== undefined &&
          description !== undefined &&
          image !== undefined
        ) {
          const newListing = new Listing()
          newListing.username = username
          newListing.userId_ref = userId_ref
          newListing.price = price
          newListing.sellingName = sellingName
          newListing.startDate = startDate
          newListing.endDate = endDate
          newListing.location = location
          newListing.description = description
          newListing.image = image
          let newComments: Comment[] = []
          newListing.comments = newComments
          let newTags: Tag[] = []
          newListing.tags = newTags
          await newListing.save()
          // update user's listing
          return newListing
        }
      }
      return null
    },
    editListing: async (_, { editInfo }, ctx) => {
      if (editInfo !== undefined && editInfo !== null) {
        const { id, username, price, sellingName, startDate, endDate, location, description, image } = editInfo
        let listing = await Listing.findOne({ where: { id: id } })
        if (listing !== undefined) {
          if (username) {
            listing.username = username
          }
          if (price) {
            listing.price = price
          }
          if (sellingName) {
            listing.sellingName = sellingName
          }
          if (startDate) {
            listing.startDate = startDate
          }
          if (endDate) {
            listing.endDate = endDate
          }
          if (location) {
            listing.location = location
          }
          if (description) {
            listing.description = description
          }
          if (image) {
            listing.image = image
          }
          listing.save()
          return listing
        }
      }
      return null
    },
    addComment: async (_, { comment }, ctx) => {
      if (comment !== undefined && comment !== null) {
        const { date, commentContents, listingId_ref, userId, username, userPic } = comment
        const newComment = new Comment()
        if (
          date != undefined &&
          date != null &&
          commentContents !== undefined &&
          commentContents !== null &&
          userId !== undefined &&
          userId !== null
        ) {
          newComment.date = date
          newComment.commentContents = commentContents
          newComment.userId = userId
          newComment.username = username
          newComment.userPic = userPic
          let listing = await Listing.findOne({ where: { id: listingId_ref } })
          if (listing !== undefined && listing !== null) {
            newComment.listing = listing
            // no longer need to add
            // listing.comments.push(newComment)
            await listing.save()
          }
          await newComment.save()
          return newComment
        }
      }
      return null
    },
    addTag: async (_, { tag }, ctx) =>
      // {
      //   if (tag !== undefined && tag !== null) {
      //     const { type, listingId } = tag
      //     const newTag = new Tag()
      //     if (type != undefined && type != null && listingId !== undefined && listingId !== null) {
      //       newTag.type = type
      //       let listing = await Listing.findOne({ where: { id: listingId } })
      //       if (listing !== undefined && listing !== null && !listing.tags.includes(newTag)) {
      //         let hasTag = false
      //         listing.tags.forEach(tag => {
      //           if (tag.type === type)
      //           {
      //             hasTag = true
      //             return
      //           }
      //         })
      //         if (hasTag)
      //           return null
      //         if (!hasTag) {
      //           newTag.listing = listing
      //           listing.tags.push(newTag)
      //           await listing.save()
      //         }
      //       }
      //       await newTag.save()
      //       return newTag
      //     }
      //   }
      //   return null
      // },
      // decoupled version:
      {
        if (tag !== undefined && tag !== null) {
          const { type, listingId } = tag
          const newTag = new Tag()
          if (type != undefined && type != null && listingId !== undefined && listingId !== null) {
            newTag.type = type
            let listing = await Listing.findOne({ where: { id: listingId } })
            let testTag = await Tag.findOne({ where: { listing: listing } })
            if (testTag !== undefined)
              // tag associated with listing exists, exit early
              return null
            if (listing !== undefined && listing !== null) {
              newTag.listing = listing
              // listing.tags.push(newTag) // decoupled!
              await listing.save()
            }
            await newTag.save()
            return newTag
          }
        }
        return null
      },
    editUser: async (_, { editInfo }, { redis }) => {
      if (editInfo !== undefined && editInfo !== null) {
        const { id, email, name, password, number, location, about, image } = editInfo
        let user = await User.findOne({ where: { email: email } })
        if (user !== undefined) {
          if (email) {
            //replace old email with new email in Redis cache
            await redis.srem('userEmails', user.email)
            await redis.sadd('userEmails', email)
            user.email = email
          }
          if (name) {
            user.name = name
          }
          if (number) {
            user.number = number
          }
          if (location) {
            user.location = location
          }
          if (about) {
            user.about = about
          }
          if (image) {
            user.image = image
          }
          user.save()
          return user
        }
      }
      return null
    },
  },
  Subscription: {
    surveyUpdates: {
      subscribe: (_, { surveyId }, context) => context.pubsub.asyncIterator('SURVEY_UPDATE_' + surveyId),
      resolve: (payload: any) => payload,
    },
  },
  Listing: {
    comments: async (self, arg, ctx) => {
      return Comment.find({ where: { listing: self } }) as any
    },
    tags: async (self, arg, ctx) => {
      return Tag.find({ where: { listing: self } }) as any
    },
  },
}
