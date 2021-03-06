/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchUserContext
// ====================================================

export interface FetchUserContext_self {
  __typename: "User";
  id: number;
  name: string;
  userType: UserType;
}

export interface FetchUserContext {
  self: FetchUserContext_self | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchUserContext2
// ====================================================

export interface FetchUserContext2_self {
  __typename: "User";
  id: number;
  name: string;
  userType: UserType;
  password: string;
}

export interface FetchUserContext2 {
  self: FetchUserContext2_self | null;
}

export interface FetchUserContext2Variables {
  email: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchUserContext3
// ====================================================

export interface FetchUserContext3_self2 {
  __typename: "User";
  id: number;
  email: string;
  password: string;
  name: string;
  userType: UserType;
  number: string;
  location: string;
  image: string | null;
  about: string;
}

export interface FetchUserContext3 {
  self2: FetchUserContext3_self2 | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditUser
// ====================================================

export interface EditUser_editUser {
  __typename: "User";
  id: number;
  name: string;
  number: string;
  email: string;
  location: string;
  about: string;
  image: string | null;
}

export interface EditUser {
  editUser: EditUser_editUser | null;
}

export interface EditUserVariables {
  input?: EditUserInput | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchUserFromID
// ====================================================

export interface FetchUserFromID_user {
  __typename: "User";
  name: string;
  number: string;
  about: string;
  email: string;
  image: string | null;
}

export interface FetchUserFromID {
  user: FetchUserFromID_user | null;
}

export interface FetchUserFromIDVariables {
  userId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchComments
// ====================================================

export interface FetchComments_comments {
  __typename: "Comment";
  date: string;
  commentContents: string;
  userId: number;
  username: string;
  userPic: string;
}

export interface FetchComments {
  comments: FetchComments_comments[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchListings
// ====================================================

export interface FetchListings_listings_comments {
  __typename: "Comment";
  commentContents: string;
  userId: number;
  username: string;
  userPic: string;
  date: string;
}

export interface FetchListings_listings_tags {
  __typename: "Tag";
  type: TagType;
}

export interface FetchListings_listings {
  __typename: "Listing";
  id: number;
  username: string;
  price: number | null;
  sellingName: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  image: string;
  comments: (FetchListings_listings_comments | null)[];
  tags: (FetchListings_listings_tags | null)[];
  userId_ref: number;
}

export interface FetchListings {
  listings: FetchListings_listings[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchListingsPaginated
// ====================================================

export interface FetchListingsPaginated_listingsPaginated_comments {
  __typename: "Comment";
  commentContents: string;
  userId: number;
  username: string;
  userPic: string;
  date: string;
}

export interface FetchListingsPaginated_listingsPaginated_tags {
  __typename: "Tag";
  type: TagType;
}

export interface FetchListingsPaginated_listingsPaginated {
  __typename: "Listing";
  id: number;
  username: string;
  price: number | null;
  sellingName: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  image: string;
  comments: (FetchListingsPaginated_listingsPaginated_comments | null)[];
  tags: (FetchListingsPaginated_listingsPaginated_tags | null)[];
  userId_ref: number;
}

export interface FetchListingsPaginated {
  listingsPaginated: FetchListingsPaginated_listingsPaginated[] | null;
}

export interface FetchListingsPaginatedVariables {
  input: ListingInputPaginated;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchListing
// ====================================================

export interface FetchListing_listing_comments {
  __typename: "Comment";
  date: string;
  commentContents: string;
  userId: number;
  username: string;
  userPic: string;
}

export interface FetchListing_listing_tags {
  __typename: "Tag";
  type: TagType;
}

export interface FetchListing_listing {
  __typename: "Listing";
  username: string;
  price: number | null;
  sellingName: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  image: string;
  comments: (FetchListing_listing_comments | null)[];
  tags: (FetchListing_listing_tags | null)[];
  userId_ref: number;
}

export interface FetchListing {
  listing: FetchListing_listing | null;
}

export interface FetchListingVariables {
  listingId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddComment
// ====================================================

export interface AddComment_addComment_listing {
  __typename: "Listing";
  id: number;
}

export interface AddComment_addComment {
  __typename: "Comment";
  date: string;
  commentContents: string;
  listing: AddComment_addComment_listing;
  userId: number;
  username: string;
  userPic: string;
}

export interface AddComment {
  addComment: AddComment_addComment | null;
}

export interface AddCommentVariables {
  input: CommentInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddListing
// ====================================================

export interface AddListing_addListing {
  __typename: "Listing";
  username: string;
  price: number | null;
  sellingName: string;
}

export interface AddListing {
  addListing: AddListing_addListing | null;
}

export interface AddListingVariables {
  input: ListingInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditListing
// ====================================================

export interface EditListing_editListing {
  __typename: "Listing";
  id: number;
  sellingName: string;
}

export interface EditListing {
  editListing: EditListing_editListing | null;
}

export interface EditListingVariables {
  input: EditListingInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddTag
// ====================================================

export interface AddTag_addTag_listing {
  __typename: "Listing";
  id: number;
}

export interface AddTag_addTag {
  __typename: "Tag";
  type: TagType;
  listing: AddTag_addTag_listing;
}

export interface AddTag {
  addTag: AddTag_addTag | null;
}

export interface AddTagVariables {
  input: TagInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchSurveys
// ====================================================

export interface FetchSurveys_surveys_currentQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface FetchSurveys_surveys_currentQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: FetchSurveys_surveys_currentQuestion_answers[];
}

export interface FetchSurveys_surveys {
  __typename: "Survey";
  id: number;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestion: FetchSurveys_surveys_currentQuestion | null;
}

export interface FetchSurveys {
  surveys: FetchSurveys_surveys[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: SurveySubscription
// ====================================================

export interface SurveySubscription_surveyUpdates_currentQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface SurveySubscription_surveyUpdates_currentQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: SurveySubscription_surveyUpdates_currentQuestion_answers[];
}

export interface SurveySubscription_surveyUpdates {
  __typename: "Survey";
  id: number;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestion: SurveySubscription_surveyUpdates_currentQuestion | null;
}

export interface SurveySubscription {
  surveyUpdates: SurveySubscription_surveyUpdates | null;
}

export interface SurveySubscriptionVariables {
  surveyId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchSurvey
// ====================================================

export interface FetchSurvey_survey_currentQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface FetchSurvey_survey_currentQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: FetchSurvey_survey_currentQuestion_answers[];
}

export interface FetchSurvey_survey {
  __typename: "Survey";
  id: number;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestion: FetchSurvey_survey_currentQuestion | null;
}

export interface FetchSurvey {
  survey: FetchSurvey_survey | null;
}

export interface FetchSurveyVariables {
  surveyId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AnswerSurveyQuestion
// ====================================================

export interface AnswerSurveyQuestion {
  answerSurvey: boolean;
}

export interface AnswerSurveyQuestionVariables {
  input: SurveyInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NextSurveyQuestion
// ====================================================

export interface NextSurveyQuestion_nextSurveyQuestion_currentQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface NextSurveyQuestion_nextSurveyQuestion_currentQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: NextSurveyQuestion_nextSurveyQuestion_currentQuestion_answers[];
}

export interface NextSurveyQuestion_nextSurveyQuestion {
  __typename: "Survey";
  id: number;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestion: NextSurveyQuestion_nextSurveyQuestion_currentQuestion | null;
}

export interface NextSurveyQuestion {
  nextSurveyQuestion: NextSurveyQuestion_nextSurveyQuestion | null;
}

export interface NextSurveyQuestionVariables {
  surveyId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Survey
// ====================================================

export interface Survey_currentQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface Survey_currentQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: Survey_currentQuestion_answers[];
}

export interface Survey {
  __typename: "Survey";
  id: number;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestion: Survey_currentQuestion | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SurveyQuestion
// ====================================================

export interface SurveyQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface SurveyQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: SurveyQuestion_answers[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum TagType {
  GROCERIES = "GROCERIES",
  HAIRCUT = "HAIRCUT",
  OTHER = "OTHER",
  TUTORING = "TUTORING",
}

export enum UserType {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface CommentInput {
  date: string;
  commentContents: string;
  listingId_ref: number;
  userId: number;
  username: string;
  userPic: string;
}

export interface EditListingInput {
  id: number;
  username?: string | null;
  price?: number | null;
  sellingName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  description?: string | null;
  image?: string | null;
}

export interface EditUserInput {
  id?: number | null;
  email: string;
  name?: string | null;
  password?: string | null;
  number?: string | null;
  location?: string | null;
  about?: string | null;
  image?: string | null;
}

export interface ListingInput {
  username: string;
  userId_ref: number;
  price?: number | null;
  sellingName: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  image: string;
}

export interface ListingInputPaginated {
  offset: number;
  limit?: number | null;
}

export interface SurveyInput {
  questionId: number;
  answer: string;
}

export interface TagInput {
  type: TagType;
  listingId: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
